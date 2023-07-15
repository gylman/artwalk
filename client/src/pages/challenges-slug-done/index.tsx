import { ArrowBack } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Plane } from "../../components/Plane";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SecondaryButton } from "../../components/SecondaryButton";
import { TopBar } from "../../components/TopBar";

export function Done() {
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
          <IconButton aria-label="back" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
        }
        title="Artwork Submitted"
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
          alignItems: "center",
          gap: "32px",
          overflowY: "auto",
          overflowX: "hidden",
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
          <Plane />
        </div>

        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <Typography
            variant="h4"
            fontFamily="Mona Sans"
            sx={{ marginBottom: "8px" }}
          >
            Fingers Crossed
          </Typography>
          <Typography
            variant="h5"
            fontFamily="Mona Sans"
            sx={{ color: "#626362" }}
          >
            Wait for the deadline. <br />
            The top 3 will be able to mint an NFT.
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "24px 0",
          }}
        >
          <Link to="/profiles">
            <SecondaryButton sx={{ fontSize: "16px" }}>
              Go to your profile
            </SecondaryButton>
          </Link>
          <Link to="/challenges">
            <PrimaryButton sx={{ fontSize: "16px" }}>
              Browse new challenges
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
