import axios from "axios";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { axiosCustomized } from "../../api/axios";
import useUpdateValueAfterTimer from "../hooks/shared/useUpdateValueAfterTimer";
import useAuth from "../hooks/shared/useAuth";

export default function SignUp() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPasswod] = useState(false);

  useUpdateValueAfterTimer({ setValue: setIsError, value: isError });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value?.trim().length && !password?.trim().length) {
      console.log("lol, can not submit when username or password is an empty string");
      return;
    }

    try {
      const res = await axiosCustomized
        .post(`/users/`, {
          username: value,
          password,
        })
        .then((r) => r.data);

      if (res) {
        setToken(res.access_token);
        sessionStorage.setItem("userId", res.user_id);
        navigate("/");
      }
      console.log(res);
    } catch (error) {
      console.error(error);
      setIsError(true);
      if (axios.isAxiosError(error)) {
        if (error.status === 404) {
          setErrorMessage("Неверные данные");
        } else if (error.status === 500) {
          setErrorMessage("Такое имя уже занято");
        } else {
          setErrorMessage("Что-то пошло не так");
        }
      }
    }
  };

  return (
    <section className="w-full h-full flex items-center relative">
      <Link className="absolute top-0 hover:opacity-80 transition-all" to={"/"}>
        <BiArrowBack size={30} />
      </Link>
      <form
        onSubmit={handleSubmit}
        className="mx-auto border-border border-[.2rem] rounded-md p-[1rem] flex flex-col gap-[1rem]"
      >
        <h1 className="mb-[1rem] text-[2rem] underline self-end">Financial Instit.</h1>
        {isError ? <p className="text-[1.2rem] text-red-500">{errorMessage}</p> : null}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите ваше имя"
          className="bg-inherit px-[1rem] py-[.5rem] rounded-md text-[1.4rem] border-border border-[1px]"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="bg-inherit px-[1rem] pr-[2.5rem] py-[.5rem] rounded-md text-[1.4rem] border-border border-[1px]"
          />
          <button
            type="button"
            onClick={() => setShowPasswod((prev) => !prev)}
            className="absolute right-[.5rem] top-1/2 -translate-y-1/2"
          >
            <BsEyeFill
              color={"white"}
              size={18}
              className={`${showPassword ? "" : "hidden"} hover:opacity-80 transition-all`}
            />
            <FaEyeSlash
              color={"white"}
              size={18}
              className={`${showPassword ? "hidden" : ""} hover:opacity-80 transition-all`}
            />
          </button>
        </div>

        <button
          disabled={isError}
          className={`${
            isError ? "cursor-not-allowed" : ""
          } text-[1.5rem] hover:bg-active transition-all mt-[.5rem] rounded-md border-border border-[.1rem] py-[.5rem] w-fit self-end px-[2rem]`}
        >
          ЗАПУСК
        </button>
        <p className="text-text-muted text-[1.1rem]">
          havee an account??{" "}
          <span className="hover:text-white">
            <Link to={"/auth/login"}>click</Link>
          </span>
        </p>
      </form>
    </section>
  );
}
