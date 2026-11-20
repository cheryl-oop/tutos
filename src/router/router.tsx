import { createBrowserRouter } from "react-router";
import { Homepage } from "../pages/Homepage";
import { Tutorials } from "../pages/Tutorials";
import { DatabaseIndex } from "../pages/tutorials/DatabaseIndex.tsx";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/tutorials",
      element: <Tutorials />,
    },
    {
      path: "/tutorials/Database-migration",
      element: <DatabaseIndex />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
