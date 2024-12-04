import { Route, Routes } from "react-router-dom";
import Home from "./features/Home/Home";
import HomeLayout from "./layouts/HomeLayout";
import Missing from "./components/staticPages/Missing";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./features/Auth/Login";
import SignUp from "./features/Auth/SignUp";
import NewPetitionPage from "./features/Home/NewPetition/NewPetitionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="new" element={<NewPetitionPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<SignUp />} />
      </Route>

      <Route path="/*" element={<Missing />} />
    </Routes>
  );
}
