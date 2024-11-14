import { lazy } from "react";
import { useRoutes } from "react-router-dom";

// project-imports
import MainLayout from "layout/MainLayout";
import Loadable from "components/Loadable";
//import ComponentsRoutes from "./ComponentsRoutes";
// import LoginRoutes from './LoginRoutes';
import MainRoutes from "./MainRoutes";
// const ThreeDViewer = Loadable(lazy(() => import("pages/threedviewer")));
const ThreeDModelView = Loadable(lazy(() => import("pages/threed/view")));
// render - landing page
// const PagesLanding = Loadable(lazy(() => import("pages/landing")));

// ==============================|| ROUTES RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <ThreeDModelView />,
        },
      ],
    },
    // LoginRoutes,
    //ComponentsRoutes,
    MainRoutes,
  ]);
}
