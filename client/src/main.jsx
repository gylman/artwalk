import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import './main.css';

import { Home } from './pages/home';
import { Challenges } from './pages/challenges';
import { Walk } from './pages/challenges-slug-walk';
import { Finish } from './pages/challenges-slug-finish';
import { Similarity } from './pages/challenges-slug-similarity';
import { Profile } from './pages/profiles';
import { Favorites } from './pages/favorites';
import { MapProvider } from './components/Map';
import { Challenge } from './components/Challenge';
import MintForm from './components/MintForm';
import back from './assets/images/back.svg';
import { challenges } from './constants';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/challenges',
    element: <Challenges />,
  },
  {
    path: '/challenges/:slug/:page',
    element: <Walk />,
  },
  {
    path: '/challenges/:slug/finish',
    element: <Finish />,
  },
  {
    path: '/challenges/:slug/similarity',
    element: <Similarity />,
  },
  {
    path: '/profiles',
    element: <Profile />,
  },
  {
    path: '/profiles/:id',
    element: <Profile />,
  },
  {
    path: '/favorites',
    element: <Favorites />,
  },
  { path: '/test', element: <Challenge /> },
  {
    path: '/mint',
    element: <MintForm imgUrl={challenges[0].imgUrl} iconUrl={back} />,
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      50: '#7135C7',
      100: '#7135C7',
      200: '#7135C7',
      300: '#7135C7',
      400: '#7135C7',
      500: '#7135C7',
      600: '#7135C7',
      700: '#7135C7',
      800: '#7135C7',
      900: '#7135C7',
    },
    secondary: grey,
    warning: red,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MapProvider>
        <RouterProvider router={router} />
      </MapProvider>
    </ThemeProvider>
  </React.StrictMode>
);
