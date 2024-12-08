import { BiEnvelopeOpen, BiLogIn, BiLogOut, BiUserCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/shared/useAuth";

export default function HomeHeader() {
  const { token, setToken } = useAuth();

  return (
    <header className="w-full px-[1rem] py-[1rem] relative flex justify-between gap-[1rem] items-center">
      <h1 className="text-white text-[2.5rem] cursor-pointer hover:text-text-muted transition-all">ПРЕЗИДЕНТ МИРА</h1>
      <div className="flex self-end gap-[.5rem]">
        <Link to={"/new"}>
          <BiEnvelopeOpen
            color="white"
            size={30}
            className="cursor-pointer hover:opacity-80 active:scale-[0.97] transition-all"
          />
        </Link>
        <BiUserCircle
          color="white"
          size={30}
          className="cursor-pointer hover:opacity-80 active:scale-[0.97] transition-all"
        />
        {token?.trim().length ? (
          <button onClick={() => setToken("")}>
            <BiLogOut
              color="white"
              size={30}
              className="cursor-pointer hover:opacity-80 active:scale-[0.97] transition-all"
            />
          </button>
        ) : (
          <Link to={"/auth/login"}>
            <BiLogIn
              color="white"
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
