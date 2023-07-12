import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { useWarnOnBackButton } from "../../hooks/useWarnOnBackButton";
import { useCallback } from "react";
import { Map } from "../../components/Map";

export function Walk() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const onBackButtonCallback = useCallback(() => {
    const yes = confirm("Do you really want to quit walking?");
    if (yes) {
      navigate("/challenges", { replace: true });
    }
  }, [navigate]);
  useWarnOnBackButton(onBackButtonCallback);

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back button */}
      <div
        style={{
          zIndex: 10,
          position: "absolute",
          top: 12,
          left: 12,
        }}
      >
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <BackIcon />
        </IconButton>
      </div>

      {/* Zoom in and out */}
      <div
        style={{
          zIndex: 10,
          position: "absolute",
          top: 12,
          left: 12,
        }}
      >
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "32px",
        }}
      >
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
          }}
        >
          <Map />
        </div>

        <Link
          to={`/challenges/${slug}/finish`}
        >
          <Button
            variant="contained"
            style={{
              position: "absolute",
              flexShrink: 0,
              width: "calc(100% - 48px)",
              bottom: 24,
              borderRadius: "20px",
              fontSize: "16px",
            }}
          >
            Finish
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
