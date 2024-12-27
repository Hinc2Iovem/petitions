import { useEffect, useState } from "react";

type UpdateValueAfterTimerTypes = {
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  value: boolean;
};

export default function useUpdateValueAfterTimer({ setValue, value }: UpdateValueAfterTimerTypes) {
  const [seconds, setSeconds] = useState(1);

  useEffect(() => {
    if (value) {
      setSeconds(5);
      const interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [value]);

  useEffect(() => {
    if (seconds === 0) {
      setValue(false);
    }
  }, [seconds, setValue]);
}
