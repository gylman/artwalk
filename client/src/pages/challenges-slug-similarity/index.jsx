import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { useEffect, useState } from "react";
import { animated, useSpringValue } from "@react-spring/web";
import LinearProgress from "@mui/material/LinearProgress";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export function Similarity() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isSimilarityComputed, setIsSimilarityComputed] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSimilarityComputed(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [setIsSimilarityComputed]);

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
          paddingTop: "72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "32px",
        }}
      >
        {isSimilarityComputed
          ? (
            <p>
              You have
              <br />
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                }}
              >
                89%
              </span>
              <br />
              of similarity with the original artwork. Amazing!

              <Confetti
                recycle={false}
                width={width}
                height={height}
              />
            </p>
          )
          : (
            <>
              <div>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                  }}
                >
                  Hold on tight, walker!
                </h1>
                <p>
                  Our AI companion is analysing the similarity.
                </p>
              </div>
              <LinearProgress />
            </>
          )}

        {
          /* <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
        </div> */
        }

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

        {isSimilarityComputed &&
          (
            <Button
              onClick={() => {
                alert("Not implemented, return to the challenge page.");
                navigate("/challenges");
              }}
              variant="contained"
              style={{
                flexShrink: 0,
                borderRadius: "20px",
                fontSize: "16px",
              }}
            >
              Submit
            </Button>
          )}
      </div>
    </Layout>
  );
}
