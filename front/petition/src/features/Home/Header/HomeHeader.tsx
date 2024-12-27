import { BiEnvelopeOpen, BiLogIn, BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import useTheme from "../../../hooks/shared/useTheme";
import useAuth from "../../hooks/shared/useAuth";
import { ExpandPetitionTypes } from "../Home";

type HomeHeaderTypes = {
  setExpandPetition: React.Dispatch<React.SetStateAction<ExpandPetitionTypes>>;
};

export default function HomeHeader({ setExpandPetition }: HomeHeaderTypes) {
  const { token, setToken } = useAuth();
  const { theme } = useTheme();

  const hideExpandedPetition = () => {
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
  return (
    <header className="w-full px-[1rem] py-[1rem] relative flex justify-between gap-[1rem] items-center">
      <button onClick={hideExpandedPetition}>
        <h1 className="text-text text-[3.5rem] cursor-pointer transition-all font-medium">Питиции</h1>
      </button>
      <div className="flex self-end gap-[.5rem]">
        <Link to={"/new"}>
          <BiEnvelopeOpen
            color={`${theme === "dark" ? "white" : "black"}`}
            size={30}
            className="cursor-pointer hover:opacity-80 active:scale-[0.97] transition-all"
          />
        </Link>
        {token?.trim().length ? (
          <button
            onClick={() => {
              sessionStorage.removeItem("access_token");
              sessionStorage.removeItem("userId");
              setToken("");
            }}
          >
            <BiLogOut
              color={`${theme === "dark" ? "white" : "black"}`}
              size={30}
              className="cursor-pointer hover:opacity-80 active:scale-[0.97] transition-all"
            />
          </button>
        ) : (
          <Link to={"/auth/login"}>
            <BiLogIn
              color={`${theme === "dark" ? "white" : "black"}`}
              size={30}
              className="cursor-pointer hover:opacity-80 active:scale-[0.97] transition-all"
            />
          </Link>
        )}
      </div>
      <div className="absolute w-[calc(100%-2rem)] bottom-0 h-[.1rem] rounded-sm bg-text-muted left[1rem]"></div>
    </header>
  );
}
