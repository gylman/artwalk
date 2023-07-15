import { Route, Routes } from "react-router-dom";
import "./main.css";

import { ToastManager } from "./components/ToastManager";
import { Challenges } from "./pages/challenges";
import { Done } from "./pages/challenges-slug-done";
import { Finish } from "./pages/challenges-slug-finish";
import { MintNFT } from "./pages/challenges-slug-mint-nft";
import { Results } from "./pages/challenges-slug-results";
import { Similarity } from "./pages/challenges-slug-similarity";
import { Walk } from "./pages/challenges-slug-walk";
import { Favorites } from "./pages/favorites";
import { Home } from "./pages/home";
import { Profile } from "./pages/profiles";

export function App() {
  return (
    <>
      <ToastManager />
      <Routes>
        <Route path="/" element={<Home />} />,
        <Route path="/challenges" element={<Challenges />} />,
        <Route path="/challenges/:slug/walk" element={<Walk />} />,
        <Route path="/challenges/:slug/finish" element={<Finish />} />,
        <Route path="/challenges/:slug/similarity" element={<Similarity />} />,
        <Route path="/challenges/:slug/done" element={<Done />} />,
        <Route path="/challenges/:slug/results" element={<Results />} />,
        <Route path="/challenges/:slug/mint-nft" element={<MintNFT />} />,
        <Route path="/profiles" element={<Profile />} />
        <Route path="/profiles/:id" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
}
