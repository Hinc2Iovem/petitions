import { useEffect, useState } from "react";
import { PetitionTypes } from "../../types/PetitionTypes";
import useUpdateValueAfterTimer from "../hooks/shared/useUpdateValueAfterTimer";
import useGetAllPetitions from "../hooks/useGetAllPetitions";
import HomeHeader from "./Header/HomeHeader";
import ExpandedPetition from "./VotePage/ExpandedPetition";

export type ExpandPetitionTypes = {
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
  const [unVoted, setUnVoted] = useState(false);
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
      <HomeHeader setExpandPetition={setExpandPetition} />
      <div className={`${expandPetition.expand ? "hidden" : ""} flex flex-col gap-[1rem] p-[1rem]`}>
        <h2 className="text-[1.5rem] text-text">Питиции на расмотрение</h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-[1rem]">
          {petitions?.map((p) => (
            <PetitionBlock
              key={p.id}
              setVoted={setVoted}
              setUnVoted={setUnVoted}
              expandPetition={expandPetition}
              voted={voted}
              unVoted={unVoted}
              setExpandPetition={setExpandPetition}
              {...p}
            />
          ))}
        </ul>
      </div>
      <ExpandedPetition
        setVoted={setVoted}
        setUnVoted={setUnVoted}
        votedPetitions={votedPetitions}
        setVotedPetitions={setVotedPetitions}
        expandPetition={expandPetition}
        setExpandPetition={setExpandPetition}
      />
    </div>
  );
}

type PetitionBlockTypes = {
  setVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setUnVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setExpandPetition: React.Dispatch<React.SetStateAction<ExpandPetitionTypes>>;
  expandPetition: ExpandPetitionTypes;
  unVoted: boolean;
  voted: boolean;
} & PetitionTypes;

function PetitionBlock({
  created_at,
  description,
  id,
  title,
  expandPetition,
  voted,
  unVoted,
  votes_count,
  setVoted,
  setUnVoted,
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
    setUnVoted(false);
  };

  useEffect(() => {
    if (expandPetition.id === id && voted) {
      setCurrentVotesCount((prev) => prev + 1);
      resetExpandedPetition();
    } else if (expandPetition.id === id && unVoted) {
      setCurrentVotesCount((prev) => prev - 1);
      resetExpandedPetition();
    }
  }, [voted, unVoted, expandPetition, id]);

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
      className="border-border cursor-pointer hover:scale-[1.01] hover:shadow-sm hover:shadow-text transition-all rounded-md p-[1rem] border-[1px] flex flex-col gap-[.5rem]"
    >
      <h3 className="text-[1.5rem] text-text text-ellipsis capitalize">{title}</h3>
      <p className="text-text-muted text-[1.2rem] text-ellipsis">{description}</p>
      <div className="flex justify-between gap-[1rem] mt-[1rem] text-[1.2rem] text-text">
        <p>Количество Голосов: {currentVotesCount}</p>
        <p className="mt-[.5rem] text-[1.1rem] text-text-muted">
          {refinedDate.day}-{refinedDate.month}-{refinedDate.year}
        </p>
      </div>
    </div>
  );
}
