import { ArrowBack } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Geojson } from "../../components/Geojson";
import { HiFive } from "../../components/HiFive";
import { Layout } from "../../components/Layout";
import { useMapContext } from "../../components/Map/hooks";
import { PrimaryButton } from "../../components/PrimaryButton";
import { TopBar } from "../../components/TopBar";
import { currentChallengeAtom } from "../../state";

export function Finish() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { styledPathGroups } = useMapContext();

  const [currentChallenge] = useAtom(currentChallengeAtom);

  useEffect(() => {
    if (currentChallenge !== slug) {
      navigate("/challenges");
    }
  }, [currentChallenge, slug, navigate]);

  return (
    <Layout
      isBottomNavigationHidden
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar
        before={
          <IconButton aria-label="back" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
        }
        title="Walking Finished"
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          paddingTop: "24px",
          paddingBottom: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "32px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#9afcc5",
            color: "#7135C7",
            width: "144px",
            height: "144px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <HiFive />
        </div>

        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <Typography
            variant="h4"
            fontFamily="Mona Sans"
            sx={{ marginBottom: "8px" }}
          >
            Hi-5!
          </Typography>
          <Typography
            variant="h5"
            fontFamily="Mona Sans"
            sx={{ color: "#626362" }}
          >
            Here’s the result of your walking artwork.
          </Typography>
        </div>

        <div
          style={{
            width: "80%",
            flex: "1 1 0%",
            padding: "0 24px",
            maxHeight: "320px",
          }}
        >
          <Geojson styledPathGroups={styledPathGroups} />
        </div>

        <Link to={`/challenges/${slug}/similarity`}>
          <PrimaryButton sx={{ fontSize: "16px" }}>
            Check Similarity
          </PrimaryButton>
        </Link>
      </div>
    </Layout>
  );
}
