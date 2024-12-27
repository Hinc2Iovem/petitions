import { PetitionTypes } from "../../../types/PetitionTypes";
import useAuth from "../../hooks/shared/useAuth";
import { ExpandPetitionTypes } from "../Home";

type UnvoteButtonTypes = {
  votedPetitions: PetitionTypes[];
  expandPetition: ExpandPetitionTypes;
  setUnVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setVotedPetitions: React.Dispatch<React.SetStateAction<PetitionTypes[]>>;
  setAlreadyVotted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UnvoteButton({
  votedPetitions,
  expandPetition,
  setUnVoted,
  setVotedPetitions,
  setAlreadyVotted,
}: UnvoteButtonTypes) {
  const { token } = useAuth();

  const onClick = async () => {
    if (!token?.trim().length && votedPetitions.some((v) => v.id === expandPetition.id)) {
      console.log("No token was found");
      return;
    }
    try {
      setVotedPetitions((prev) => prev.filter((p) => p.id !== expandPetition.id));

      setUnVoted(true);
      setAlreadyVotted(false);

      await fetch(`http://localhost:8000/votes/?petition_id=${expandPetition.id}&token=${token}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petition_id: expandPetition.id,
        }),
      }).then((response) => response.json());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${
        token.trim().length > 0 ? "hover:bg-red-500 hover:text-white bg-active text-primary" : "bg-active"
      }  w-fit active:scale-[0.99] transition-all px-[2rem] py-[.5rem] rounded-md shadow-sm mt-[2rem] text-[1.5rem] text-text font-medium self-end`}
    >
      {token.trim().length ? "Убрать Голос" : "Вы не авторизованны"}
    </button>
  );
}
