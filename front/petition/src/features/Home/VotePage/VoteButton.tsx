import { PetitionTypes } from "../../../types/PetitionTypes";
import useAuth from "../../hooks/shared/useAuth";
import { ExpandPetitionTypes } from "../Home";

type VoteButtonTypes = {
  expandPetition: ExpandPetitionTypes;
  setVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setVotedPetitions: React.Dispatch<React.SetStateAction<PetitionTypes[]>>;
  setAlreadyVotted: React.Dispatch<React.SetStateAction<boolean>>;
  votedPetitions: PetitionTypes[];
};

export default function VoteButton({
  expandPetition,
  setVoted,
  setVotedPetitions,
  setAlreadyVotted,
  votedPetitions,
}: VoteButtonTypes) {
  const { token } = useAuth();

  const voteForPetition = async () => {
    if (!token?.trim().length && votedPetitions.some((v) => v.id !== expandPetition.id)) {
      console.log("no token was found");
      return;
    }
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
      setAlreadyVotted(true);
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

  return (
    <button
      onClick={voteForPetition}
      className={`${
        token.trim().length ? "hover:bg-active hover:text-white bg-secondary text-primary " : "bg-active"
      } w-fit active:scale-[0.99] transition-all px-[2rem] py-[.5rem] rounded-md shadow-sm mt-[2rem] text-[1.5rem] text-text font-medium self-end`}
    >
      {token.trim().length ? "Голосовать" : "Вы не авторизованны"}
    </button>
  );
}
