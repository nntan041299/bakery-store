/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Home = lazy(() => import("@/pages/Home"));
const Account = lazy(() => import("@/pages/Account"));

const routes: Record<string, RouteObject[]> = {
  default: [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/account",
      element: <Account />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
};

export default routes;
