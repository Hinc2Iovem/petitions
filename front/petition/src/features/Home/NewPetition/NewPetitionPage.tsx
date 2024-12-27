import axios from "axios";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import useUpdateValueAfterTimer from "../../hooks/shared/useUpdateValueAfterTimer";
import { axiosCustomized } from "../../../api/axios";
import useTheme from "../../../hooks/shared/useTheme";

export default function NewPetitionPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [petition, setPetition] = useState({
    title: "",
    description: "",
  });

  useUpdateValueAfterTimer({ setValue: setIsError, value: isError });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petition.title.trim().length || !petition.description.trim().length) {
      console.log("FILL THE FIELDS, pls");
      return;
    }

    try {
      await axiosCustomized
        .post("/petitions/", {
          title: petition.title,
          description: petition.description,
        })
        .then((r) => r.data);

      navigate("/");
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
    <div className="h-full w-full mx-auto realtive flex flex-col items-center">
      <Link to={"/"}>
        <BiArrowBack
          fill={theme === "dark" ? "white" : "black"}
          size={30}
          className="hover:opacity-80 transition-all absolute top-[2rem] left-[2rem]"
        />
      </Link>
      <form
        className="min-w-fit border-border border-[.1rem] p-[1rem] rounded-md mt-[5rem] w-[30rem]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-[2.5rem] text-text text-right mb-[2rem] ">Новая питиция</h2>
        {isError ? <p className="text-[1.2rem] text-red-500">{errorMessage}</p> : null}
        <div className="flex flex-col gap-[1rem]">
          <input
            type="text"
            name="title"
            id="Title"
            placeholder="Тайтл"
            onChange={(e) =>
              setPetition((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="bg-inherit w-full text-[1.4rem] text-text border-[.1rem] border-border px-[1rem] py-[.5rem] rounded-md"
          />
          <textarea
            name="description"
            id="Description"
            placeholder="Описание"
            onChange={(e) =>
              setPetition((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="bg-inherit max-h-[10rem] w-full text-[1.4rem] text-text border-[.1rem] border-border px-[1rem] py-[.5rem] rounded-md"
          />

          <button className="border-border text-[1.5rem] text-text border-[.1rem] hover:bg-active transition-all w-fit self-end px-[3rem] py-[.5rem] rounded-md">
            Создать
          </button>
        </div>
      </form>
    </div>
  );
}
