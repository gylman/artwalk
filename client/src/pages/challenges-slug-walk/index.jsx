import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";

export function Walk() {
  const { slug } = useParams();
  const navigate = useNavigate();

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
          top: 24,
          left: 24,
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
          top: 24,
          right: 24,
        }}
      >
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "32px",
        }}
      >
        <div
          style={{
            flex: "1 1 0%",
            textAlign: "center",
            backgroundColor: "#00000011",
            borderRadius: "8px",
          }}
        >
          Canvas here
        </div>

        <Link
          to={`/challenges/${slug}/finish`}
        >
          <Button
            variant="contained"
            style={{
              flexShrink: 0,
              width: "100%",
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
