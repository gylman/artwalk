import Button from "@mui/material/Button";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";

export function Finish() {
  const { slug } = useParams();

  return (
    <Layout
      isBottomNavigationHidden
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
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

        <Link to={`/challenges/${slug}/similarity`}>
          <Button
            variant="contained"
            style={{
              width: "100%",
              flexShrink: 0,
              borderRadius: "20px",
              fontSize: "16px",
            }}
          >
            Check Similarity
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
