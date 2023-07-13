import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
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
    path: "/challenges/:slug/walk",
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
  typography: {
    fontFamily:
      `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  },
  palette: {
    primary: blue,
    secondary: grey,
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
