import { useEffect, useState } from "react";
import { PetitionTypes } from "../../types/PetitionTypes";
import useGetAllPetitions from "../hooks/useGetAllPetitions";
import HomeHeader from "./Header/HomeHeader";
import { BiArrowBack } from "react-icons/bi";
import PetitionCommentSection from "./PetitionCommentSection";
import useUpdateValueAfterTimer from "../hooks/shared/useUpdateValueAfterTimer";
import useAuth from "../hooks/shared/useAuth";

type ExpandPetitionTypes = {
  expand: boolean;
  id: number;
  title: string;
  description: string;
  createdAt: {
    year: string;
    month: string;
    day: string;
  };
  votesCount: number;
};

export default function Home() {
  const petitions = useGetAllPetitions();
  const [votedPetitions, setVotedPetitions] = useState<PetitionTypes[]>([]);
  const [voted, setVoted] = useState(false);
  const [expandPetition, setExpandPetition] = useState<ExpandPetitionTypes>({
    expand: false,
    id: 0,
    title: "",
    description: "",
    createdAt: {
      day: "",
      month: "",
      year: "",
    },
    votesCount: 0,
  });

  useEffect(() => {
    fetchVotedPetitions();
  }, []);

  const fetchVotedPetitions = async () => {
    const userId = sessionStorage.getItem("userId") || 1;
    try {
      const res = await fetch(`http://localhost:8000/petitions/users/${userId}`, {
        method: "GET",
      }).then((response) => response.json());
      setVotedPetitions(res);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useUpdateValueAfterTimer({ setValue: setVoted, value: voted });
  return (
    <div className="h-full w-full mx-auto realtive">
      <HomeHeader />
      <div className={`${expandPetition.expand ? "hidden" : ""} flex flex-col gap-[1rem] p-[1rem]`}>
        <h2 className="text-[1.5rem]">Питиции на расмотрение</h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-[1rem]">
          {petitions?.map((p) => (
            <PetitionBlock
              key={p.id}
              setVoted={setVoted}
              expandPetition={expandPetition}
              voted={voted}
              setExpandPetition={setExpandPetition}
              {...p}
            />
          ))}
        </ul>
      </div>
      <aside
        className={`${
          voted ? "" : "hidden"
        } absolute bottom-[1rem] right-[1rem] text-white w-[20rem] h-[10rem] border-border border-[.1rem] p-[1rem] rounded-md text-[1.5rem] content-center items-center flex flex-col shadow-sm shadow-text-muted`}
      >
        Spasibo For Vote
      </aside>
      <PetitionBlockExpanded
        setVoted={setVoted}
        votedPetitions={votedPetitions}
        setVotedPetitions={setVotedPetitions}
        expandPetition={expandPetition}
        setExpandPetition={setExpandPetition}
      />
    </div>
  );
}

type PetitionBlockExpandedTypes = {
  expandPetition: ExpandPetitionTypes;
  setVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setExpandPetition: React.Dispatch<React.SetStateAction<ExpandPetitionTypes>>;
  setVotedPetitions: React.Dispatch<React.SetStateAction<PetitionTypes[]>>;
  votedPetitions: PetitionTypes[];
};

function PetitionBlockExpanded({
  expandPetition,
  votedPetitions,
  setVoted,
  setExpandPetition,
  setVotedPetitions,
}: PetitionBlockExpandedTypes) {
  const { token } = useAuth();
  const resetExpandedPetition = () => {
    setExpandPetition({
      expand: false,
      id: 0,
      title: "",
      description: "",
      createdAt: {
        day: "",
        month: "",
        year: "",
      },
      votesCount: 0,
    });
  };
  const voteForPetition = async () => {
    try {
      setVotedPetitions((prev) => [
        ...prev,
        {
          id: expandPetition.id,
          created_at: new Date(),
          description: expandPetition.description,
          title: expandPetition.title,
          votes_count: expandPetition.votesCount,
        },
      ]);
      setVoted(true);

      await fetch(`http://localhost:8000/votes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petition_id: expandPetition.id, token }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Vote created:", data);
        });

      console.log("token: ", token);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const notAllowedToVote = votedPetitions.some((v) => v.id === expandPetition.id) || !token.trim().length;
  console.log("token: ", token);

  return (
    <div className={`${expandPetition.expand ? "" : "hidden"} flex flex-col gap-[1rem] p-[2rem] relative`}>
      <button onClick={resetExpandedPetition}>
        <BiArrowBack size={20} className="hover:opacity-80 transition-all" />
      </button>
      <p className="absolute right-[1rem] top-[1rem] text-text-muted">
        {expandPetition.createdAt.day}/{expandPetition.createdAt.month}/{expandPetition.createdAt.year}
      </p>
      <div className="w-fit">
        <h2 className="text-[2rem] capitalize">{expandPetition.title}</h2>
        <div className="w-full h-[.1rem] bg-white mt-[1rem]"></div>
      </div>
      <p className="text-[1.5rem] text-text-muted">{expandPetition.description}</p>

      <button
        onClick={voteForPetition}
        disabled={notAllowedToVote}
        className={`${
          notAllowedToVote ? "cursor-not-allowed" : ""
        } w-fit hover:bg-active hover:text-white active:scale-[0.99] transition-all bg-white text-primary px-[2rem] py-[.5rem] rounded-md shadow-sm mt-[2rem] text-[1.5rem] font-medium self-end`}
      >
        ЛЕТСГОУ
      </button>

      <PetitionCommentSection />
    </div>
  );
}

type PetitionBlockTypes = {
  setVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setExpandPetition: React.Dispatch<React.SetStateAction<ExpandPetitionTypes>>;
  expandPetition: ExpandPetitionTypes;
  voted: boolean;
} & PetitionTypes;

function PetitionBlock({
  created_at,
  description,
  id,
  title,
  expandPetition,
  voted,
  votes_count,
  setVoted,
  setExpandPetition,
}: PetitionBlockTypes) {
  const [currentVotesCount, setCurrentVotesCount] = useState(votes_count);
  const date = new Date(created_at).toISOString().split("-");
  const refinedDate = {
    year: (date || [])[0],
    month: (date || [])[1],
    day: (date || [])[2].slice(0, 2),
  };

  const resetExpandedPetition = () => {
    setExpandPetition({
      expand: false,
      id: 0,
      title: "",
      description: "",
      createdAt: {
        day: "",
        month: "",
        year: "",
      },
      votesCount: 0,
    });
    setVoted(false);
  };

  useEffect(() => {
    if (expandPetition.id === id && voted) {
      setCurrentVotesCount((prev) => prev + 1);
      resetExpandedPetition();
    }
  }, [voted, expandPetition, id]);

  return (
    <div
      onClick={() =>
        setExpandPetition({
          createdAt: refinedDate,
          description,
          expand: true,
          id,
          title,
          votesCount: votes_count,
        })
      }
      className="border-border cursor-pointer hover:scale-[1.01] hover:shadow-sm hover:shadow-white transition-all rounded-md p-[1rem] border-[1px] flex flex-col gap-[.5rem]"
    >
      <h3 className="text-[1.5rem] text-ellipsis capitalize">{title}</h3>
      <p className="text-text-muted text-[1.2rem] text-ellipsis">{description}</p>
      <div className="flex justify-between gap-[1rem] mt-[1rem] text-[1.2rem]">
        <p>Количество Голосов: {currentVotesCount}</p>
        <p className="mt-[.5rem] text-[1.1rem] text-text-muted">
          {refinedDate.day}-{refinedDate.month}-{refinedDate.year}
        </p>
      </div>
    </div>
  );
}
