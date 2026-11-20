import { createBrowserRouter } from "react-router";
import { Homepage } from "../pages/Homepage";
import { Tutorials } from "../pages/Tutorials";

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
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
