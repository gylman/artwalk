import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import "./main.css";

import { Home } from "./pages/home";
import { Challenges } from "./pages/challenges";
import { Walk } from "./pages/challenges-slug-walk";
import { Finish } from "./pages/challenges-slug-finish";
import { Similarity } from "./pages/challenges-slug-similarity";
import { Profile } from "./pages/profiles";
import { Favorites } from "./pages/favorites";
import { MapProvider } from "./components/Map";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/challenges",
    element: <Challenges />,
  },
  {
    path: "/challenges/:slug/:page",
    element: <Walk />,
  },
  {
    path: "/challenges/:slug/finish",
    element: <Finish />,
  },
  {
    path: "/challenges/:slug/similarity",
    element: <Similarity />,
  },
  {
    path: "/profiles",
    element: <Profile />,
  },
  {
    path: "/profiles/:id",
    element: <Profile />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      50: "#00301E",
      100: "#00301E",
      200: "#00301E",
      300: "#00301E",
      400: "#00301E",
      500: "#00301E",
      600: "#00301E",
      700: "#00301E",
      800: "#00301E",
      900: "#00301E",
    },
    secondary: grey,
    warning: red,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MapProvider>
        <RouterProvider router={router} />
      </MapProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
