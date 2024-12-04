import { useEffect, useState } from "react";
import { PetitionTypes } from "../../types/PetitionTypes";
import { axiosCustomized } from "../../api/axios";

export default function useGetAllPetitions() {
  const [petitions, setPetitions] = useState<PetitionTypes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosCustomized.get<PetitionTypes[]>(`/petitions/`).then((r) => r.data);
        if (data) {
          setPetitions(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return petitions;
}
