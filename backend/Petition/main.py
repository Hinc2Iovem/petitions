from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session
from models import Base, User, Petition, Vote
from database import engine, session_local, get_db
from schemas import (UserCreate, PetitionCreate, PetitionResponse, VoteCreate, UserResponse, VoteResponse, LoginRequest,
                     TokenRequest, VotedPetitionResponse)
from auth import create_access_token, get_current_user, get_user_from_token
from typing import List

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow the listed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


Base.metadata.create_all(bind=engine)

@app.delete("/votes/", response_model=VoteResponse)
async def delete_vote(
    petition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vote = db.query(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.petition_id == petition_id
    ).first()

    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found for this user")

    db.delete(vote)
    db.commit()

    petition = db.query(Petition).filter(Petition.id == petition_id).first()
    if petition:
        petition.votes_count -= 1
        db.commit()

    return vote


@app.post("/token")
async def login_for_access_token(
    login_request: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == login_request.username).first()
    if user is None or user.password != login_request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id}

@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    print(f"I'm sending a request {user}")
    
    existing_user = db.query(User).filter(User.username == user.username).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user_count = db.query(User).count()
    new_user_id = user_count + 1
    db_user = User(id=new_user_id, username=user.username, password=user.password)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.id})
    return {"access_token": access_token, "token_type": "bearer", "user_id": db_user.id} 

@app.post("/petitions/", response_model=PetitionResponse)
async def create_petition(petition: PetitionCreate, db: Session = Depends(get_db)):
    db_petition = Petition(title=petition.title, description=petition.description)
    db.add(db_petition)
    db.commit()
    db.refresh(db_petition)
    return db_petition

@app.post("/votes/", response_model=VoteResponse)
async def create_vote(
        vote: VoteCreate,
        token_request: TokenRequest,
        db: Session = Depends(get_db),
):
    token = vote.token
    petition_id = vote.petition_id

    current_user = get_user_from_token(db, token)

    petition = db.query(Petition).filter(Petition.id == petition_id).first()
    if not petition:
        raise HTTPException(status_code=404, detail="Petition not found")

    existing_vote = db.query(Vote).filter(
        (Vote.user_id == current_user.id) & (Vote.petition_id == petition_id)
    ).first()
    if existing_vote:
        raise HTTPException(status_code=400, detail="You have already voted for this petition")

    db_vote = Vote(user_id=current_user.id, petition_id=petition_id)
    db.add(db_vote)
    db.commit()
    db.refresh(db_vote)

    petition.votes_count += 1
    db.commit()

    return db_vote

@app.get("/petitions/", response_model=List[PetitionResponse])
async def get_petitions(
        skip: int = Query(0, alias="page", ge=0),
        limit: int = Query(15, le=100),
        search: str = Query(None, max_length=50),
        sort_by: str = Query("created_at", regex="^(created_at|votes_count)$"),
        sort_order: str = Query("desc", regex="^(asc|desc)$"),
        db: Session = Depends(get_db)
):
    query = db.query(Petition)

    if search:
        try:
            search_id = int(search)
            query = query.filter(Petition.id == search_id)
        except ValueError:
            query = query.filter(Petition.title.ilike(f"%{search}%"))

    if sort_order == "asc":
        query = query.order_by(asc(getattr(Petition, sort_by)))
    else:
        query = query.order_by(desc(getattr(Petition, sort_by)))

    petitions = query.offset(skip * limit).limit(limit).all()

    return petitions


@app.get("/petitions/users/{userId}", response_model=List[VotedPetitionResponse])
async def get_petitions(userId: int, db: Session = Depends(get_db)):
    voted_petitions = db.query(Petition).join(Vote, Vote.petition_id == Petition.id).filter(Vote.user_id == userId).all()

    if not voted_petitions:
       return []

    return voted_petitions
