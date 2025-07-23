import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";
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

const App = () => {
  const { user } = useContext(AuthContext);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={user ? <TestPage /> : <LoginPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
