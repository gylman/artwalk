import { Button, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { useWarnOnBackButton } from "../../hooks/useWarnOnBackButton";
import { TopBar } from "../../components/TopBar";
import { Geojson } from "../../components/Geojson";
import { useMapContext } from "../../components/Map/hooks";
import { PrimaryButton } from "../../components/PrimaryButton";

export function Similarity() {
  useWarnOnBackButton();

  const { slug } = useParams();
  const navigate = useNavigate();

  const [isSimilarityComputed, setIsSimilarityComputed] = useState(false);
  const { styledPathGroups } = useMapContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSimilarityComputed(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [setIsSimilarityComputed]);

  return (
    <Layout
      isBottomNavigationHidden
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back button */}
      <TopBar title={isSimilarityComputed ? "Your Result" : "Hold on walker"} />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {isSimilarityComputed
          ? (
            <>
              <div
                style={{
                  backgroundColor: "#9afcc5",
                  color: "#7135C7",
                  width: "144px",
                  height: "144px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div>
                  <Typography
                    variant="h3"
                    component="span"
                    fontFamily="Mona Sans"
                  >
                    89
                  </Typography>
                  <Typography
                    variant="h4"
                    component="span"
                    fontFamily="Mona Sans"
                  >
                    %
                  </Typography>
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "0 24px" }}>
                <Typography
                  variant="h4"
                  fontFamily="Mona Sans"
                  sx={{ marginBottom: "8px" }}
                >
                  Similarity
                </Typography>
                <Typography variant="h5" fontFamily="Mona Sans">
                  with the original artwork. Amazing!
                </Typography>
              </div>
            </>
          )
          : (
            <>
              <Typography
                variant="h4"
                fontFamily="Mona Sans"
              >
                AI in Progress
              </Typography>

              <LinearProgress
                sx={{
                  width: "100%",
                }}
              />

              <Typography
                variant="h5"
                fontFamily="Mona Sans"
                sx={{ textAlign: "center" }}
              >
                Our AI companion is analysing the similarity
              </Typography>
            </>
          )}

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

        {isSimilarityComputed &&
          (
            <PrimaryButton
              onClick={() => {
                alert("Not implemented, return to the challenge page.");
                navigate("/challenges");
              }}
              variant="contained"
              sx={{
                fontSize: "16px",
              }}
            >
              Submit
            </PrimaryButton>
          )}
      </div>
    </Layout>
  );
}
