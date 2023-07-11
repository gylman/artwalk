import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";

export function Finish() {
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
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            Wohhooooo! 🥳
          </h1>
          <p>You finished the walking artwork!</p>
        </div>

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

        <Button
          variant="contained"
          style={{
            flexShrink: 0,
            borderRadius: "20px",
            fontSize: "16px",
          }}
        >
          Check Similarity
        </Button>
      </div>
    </Layout>
  );
}
