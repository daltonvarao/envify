import { RouterProvider } from "react-router";
import "../public/index.css";
import { router } from "./router";

export const App = () => {
  return <RouterProvider router={router} />;
};
