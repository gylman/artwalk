import { createTheme, ThemeProvider } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { MapProvider } from "./components/Map";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "*",
    Component: App,
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      50: "#7135C7",
      100: "#7135C7",
      200: "#7135C7",
      300: "#7135C7",
      400: "#7135C7",
      500: "#7135C7",
      600: "#7135C7",
      700: "#7135C7",
      800: "#7135C7",
      900: "#7135C7",
    },
    secondary: grey,
    warning: red,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <MapProvider>
      <RouterProvider router={router} />
    </MapProvider>
  </ThemeProvider>,
);
