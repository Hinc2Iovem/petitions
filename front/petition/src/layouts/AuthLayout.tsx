import { Outlet } from "react-router-dom";
import DivBgColor from "../components/shared/DivBgColor";

export default function AuthLayout() {
  return (
    <>
      <DivBgColor bgColor="bg-primary" />
      <div className="h-screen p-[2rem] max-w-[148rem] mx-auto text-white">
        <Outlet />
      </div>
    </>
  );
}
