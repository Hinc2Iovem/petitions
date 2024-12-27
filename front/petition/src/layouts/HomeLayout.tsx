import { BiMoon, BiSun } from "react-icons/bi";
import { Outlet } from "react-router-dom";
import DivBgColor from "../components/shared/DivBgColor";
import useTheme from "../hooks/shared/useTheme";

export default function HomeLayout() {
  const { setTheme, theme } = useTheme();

  const handleClick = () => {
    if (theme === "dark") {
      setTheme("light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      document.body.classList.remove("light");
      setTheme("dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <>
      <DivBgColor bgColor="bg-primary" />
      <div className="h-screen p-[2rem] w-full max-w-[148rem] mx-auto text-white">
        <Outlet />
      </div>
      <aside className="fixed bottom-[.5rem] right-[1rem]">
        <button
          onClick={handleClick}
          className={`${
            theme === "light" ? "" : "hidden"
          } hover:scale-[1.01] hover:opacity-90 active:scale-[0.98] transition-all`}
        >
          <BiMoon size={30} fill="black" />
        </button>
        <button
          onClick={handleClick}
          className={`${
            theme === "dark" ? "" : "hidden"
          } hover:scale-[1.01] hover:opacity-90 active:scale-[0.98] transition-all`}
        >
          <BiSun size={30} fill="white" />
        </button>
      </aside>
    </>
  );
}
