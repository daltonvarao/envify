import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Outlet, createBrowserRouter, useLocation } from "react-router-dom";
import { appLoader } from "./loaders/app.loader";
import { App } from "./pages/App";
import { Home } from "./pages/Home";

export type OutletContext = {
  setOptionsComponent: React.Dispatch<JSX.Element>;
};

const Root = () => {
  const location = useLocation();

  return (
    <div className="p-6 h-full">
      <div className="flex mb-4 justify-between items-center">
        <h1
          className="text-xl flex gap-1 items-center hover:opacity-80 cursor-pointer w-fit"
          onClick={() => history.back()}
        >
          {location.key !== "default" ? (
            <ArrowLeftIcon className="w-5 h-9 stroke-2" />
          ) : (
            <span className="h-9">Envify</span>
          )}
        </h1>
      </div>

      <Outlet />
    </div>
  );
};

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/apps/:id",
          element: <App />,
          loader: appLoader,
        },
      ],
    },
  ],
  {
    basename: "/dist/index.html",
  }
);
