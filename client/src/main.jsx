import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import blue from "@mui/material/colors/blue";
import "./main.css";

import { Home } from "./pages/home";
import { Challenges } from "./pages/challenges";
import { Walk } from "./pages/challenges-slug-walk";
import { Finish } from "./pages/challenges-slug-finish";

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
]);

const theme = createTheme({
  typography: {
    fontFamily:
      `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  },
  palette: {
    primary: blue,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
