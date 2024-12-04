import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DivBgColor from "../shared/DivBgColor";

export default function Missing() {
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      navigate("/");
    }
  }, [seconds, navigate]);

  return (
    <article>
      <DivBgColor bgColor="bg-primary" />
      <h1 className="text-white text-[3.5rem] text-center">Page wasn't found</h1>
      <p className="text-[1.5rem] text-white opacity-70">You will be redirected in {seconds}</p>
    </article>
  );
}
