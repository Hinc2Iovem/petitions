import { BiArrowBack } from "react-icons/bi";
import { PetitionTypes } from "../../../types/PetitionTypes";
import { ExpandPetitionTypes } from "../Home";
import PetitionCommentSection from "../PetitionCommentSection";
import VoteButton from "./VoteButton";
import UnvoteButton from "./UnvoteButton";
import { useEffect, useState } from "react";
import useTheme from "../../../hooks/shared/useTheme";

type PetitionBlockExpandedTypes = {
  expandPetition: ExpandPetitionTypes;
  setVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setUnVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setExpandPetition: React.Dispatch<React.SetStateAction<ExpandPetitionTypes>>;
  setVotedPetitions: React.Dispatch<React.SetStateAction<PetitionTypes[]>>;
  votedPetitions: PetitionTypes[];
};

export default function ExpandedPetition({
  expandPetition,
  votedPetitions,
  setVoted,
  setUnVoted,
  setExpandPetition,
  setVotedPetitions,
}: PetitionBlockExpandedTypes) {
  const [alreadyVotted, setAlreadyVotted] = useState(votedPetitions.some((v) => v.id === expandPetition.id));
  const { theme } = useTheme();
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

  useEffect(() => {
    setAlreadyVotted(votedPetitions.some((v) => v.id === expandPetition.id));
  }, [expandPetition, votedPetitions]);

  return (
    <div className={`${expandPetition.expand ? "" : "hidden"} flex flex-col gap-[1rem] p-[2rem] relative`}>
      <button onClick={resetExpandedPetition}>
        <BiArrowBack
          size={20}
          fill={theme === "dark" ? "white" : "black"}
          className="hover:opacity-80 transition-all"
        />
      </button>
      <p className="absolute right-[1rem] top-[1rem] text-text-muted">
        {expandPetition.createdAt.day}/{expandPetition.createdAt.month}/{expandPetition.createdAt.year}
      </p>
      <div className="w-fit">
        <h2 className="text-[2rem] text-text capitalize">{expandPetition.title}</h2>
        <div className="w-full h-[.1rem] bg-text mt-[1rem]"></div>
      </div>
      <p className="text-[1.5rem] text-text-muted">{expandPetition.description}</p>
      {alreadyVotted ? (
        <UnvoteButton
          votedPetitions={votedPetitions}
          expandPetition={expandPetition}
          setUnVoted={setUnVoted}
          setAlreadyVotted={setAlreadyVotted}
          setVotedPetitions={setVotedPetitions}
        />
      ) : (
        <VoteButton
          expandPetition={expandPetition}
          setVoted={setVoted}
          setAlreadyVotted={setAlreadyVotted}
          setVotedPetitions={setVotedPetitions}
          votedPetitions={votedPetitions}
        />
      )}
      <PetitionCommentSection />
    </div>
  );
}
