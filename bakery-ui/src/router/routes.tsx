/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Home = lazy(() => import("@/pages/Home"));
const Account = lazy(() => import("@/pages/Account"));
const Products = lazy(() => import("@/pages/Products"));
const ProductForm = lazy(() => import("@/pages/Products/ProductForm"));
const Categories = lazy(() => import("@/pages/Categories"));

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
      path: "/products",
      element: <Products />,
    },
    {
      path: "/products/new",
      element: <ProductForm />,
    },
    {
      path: "/products/:id/edit",
      element: <ProductForm />,
    },
    {
      path: "/categories",
      element: <Categories />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
};

export default routes;
