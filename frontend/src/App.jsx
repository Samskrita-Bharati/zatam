import { AuthContext } from "./Context/AuthContext";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "./Layout/MainLayout";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import TestPage from "./Pages/TestPage";
import ResetPassword from "./Pages/ResetPassword";

import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    )
  );
  return (
    <>
      <ToastContainer theme="dark" transition={Bounce} className="font-serif" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
