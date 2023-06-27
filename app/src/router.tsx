import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { App } from "./pages/App";
import { Home } from "./pages/Home";
import { OnBoarding } from "./pages/OnBoarding";

const Root = () => {
  const location = useLocation();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1
          className="text-xl flex gap-1 items-center hover:opacity-80 cursor-pointer w-fit"
          onClick={() => history.back()}
        >
          {location.pathname !== "/apps" ? (
            <ArrowLeftIcon className="w-5 h-9 stroke-2" />
          ) : (
            <span className="h-9 font-semibold">envify</span>
          )}
        </h1>
      </div>

      <Outlet />
    </div>
  );
};

// export const router = createBrowserRouter(
//   [
//     {
//       path: "/",
//       element: <Root />,
//       children: [
//         {
//           path: "/",
//           element: <Home />,
//         },
//         {
//           path: "/apps/:id",
//           element: <App />,
//           loader: appLoader,
//         },
//       ],
//     },
//   ],
//   {
//     basename: "/dist/index.html",
//   }
// );

export const Router = () => {
  return (
    <BrowserRouter basename="/dist/index.html">
      <Routes>
        <Route path="/" element={<OnBoarding />} />
        <Route path="/apps" element={<Root />}>
          <Route path="/apps" element={<Home />} />
          <Route path="/apps/:id" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
