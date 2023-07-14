import { Button, IconButton, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { ArrowBack } from "@mui/icons-material";
import { TopBar } from "../../components/TopBar";
import { HiFive } from "../../components/HiFive";
import { PrimaryButton } from "../../components/PrimaryButton";

export function Finish() {
  const { slug } = useParams();
  const navigate = useNavigate();

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
          <IconButton
            aria-label="back"
            onClick={() => navigate(-1)}
          >
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
          paddingBottom: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "32px",
        }}
      >
        <div
          style={{
            backgroundColor: "#C9E7AC",
            color: "#00301E",
            width: "144px",
            height: "144px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
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
          <Typography variant="h5" fontFamily="Mona Sans">
            Here’s the result of your walking artwork.
          </Typography>
        </div>

        <div
          style={{
            width: "100%",
            flex: "1 1 0%",
            padding: "0 24px",
          }}
        >
          Canvas here
        </div>

        <Link to={`/challenges/${slug}/similarity`}>
          <PrimaryButton
            style={{
              borderRadius: "20px",
              fontSize: "16px",
            }}
          >
            Check Similarity
          </PrimaryButton>
        </Link>
      </div>
    </Layout>
  );
}
