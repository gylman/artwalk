import { LinearProgress, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import useWindowSize from "react-use/lib/useWindowSize";
import { Geojson } from "../../components/Geojson";
import { Layout } from "../../components/Layout";
import { useMapContext } from "../../components/Map/hooks";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SecondaryButton } from "../../components/SecondaryButton";
import { TopBar } from "../../components/TopBar";
import { useWarnOnBackButton } from "../../hooks/useWarnOnBackButton";
import { challengeStatesAtom, currentChallengeAtom } from "../../state";

async function fetchSimilarityResult() {
  await new Promise((r) => setTimeout(r, 3000));
  return 0.89;
}

export function Similarity() {
  useWarnOnBackButton();

  const [currentChallenge, setCurrentChallenge] = useAtom(currentChallengeAtom);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const { styledPathGroups, clear } = useMapContext();
  const [challengeStates, setChallengeStates] = useAtom(challengeStatesAtom);
  const similarity = useMemo(
    () =>
      currentChallenge
        ? challengeStates[currentChallenge]?.similarity ?? null
        : null,
    [challengeStates, currentChallenge],
  );
  const isSimilarityComputed = similarity !== null;

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("currentChallenge") ?? "null") !== slug
    ) {
      navigate("/challenges");
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (currentChallenge && similarity === null) {
      fetchSimilarityResult().then((similarity) => {
        setChallengeStates((s) => ({
          ...s,
          [currentChallenge]: {
            styledPathGroups,
            similarity,
            endAt: Number.MAX_SAFE_INTEGER,
            isSubmitted: false,
            isResultShown: false,
            isToastShown: false,
          },
        }));
        clear();
      });
    }
  }, [
    similarity,
    currentChallenge,
    setChallengeStates,
    styledPathGroups,
    clear,
  ]);

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
          overflowY: "auto",
          overflowX: "hidden",
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
                  flexShrink: 0,
                }}
              >
                <div>
                  <Typography
                    variant="h3"
                    component="span"
                    fontFamily="Mona Sans"
                  >
                    {similarity && similarity !== 0
                      ? (similarity * 100).toFixed(0)
                      : ""}
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
                <Typography
                  variant="h5"
                  fontFamily="Mona Sans"
                  sx={{ color: "#626362" }}
                >
                  with the original artwork. Amazing!
                </Typography>
              </div>
              <Confetti
                style={{
                  position: "fixed",
                  top: 0,
                  zIndex: 9999,
                }}
                recycle={false}
                width={width}
                height={height}
                numberOfPieces={300}
              />
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
                sx={{ textAlign: "center", color: "#626362" }}
              >
                Our AI companion is analysing the similarity
              </Typography>
            </>
          )}

        <div
          style={{
            flex: "1 1 0%",
            padding: "0 48px",
          }}
        >
          <Geojson
            styledPathGroups={challengeStates[slug]?.styledPathGroups ??
              styledPathGroups}
          />
        </div>

        {isSimilarityComputed &&
          (
            <div
              style={{
                display: "flex",
                gap: "24px",
              }}
            >
              <SecondaryButton
                onClick={() => {
                  setChallengeStates((s) => {
                    const ss = structuredClone(s);
                    delete ss[slug];
                    return ss;
                  });
                  setCurrentChallenge(slug);
                  navigate(`/challenges/${slug}/walk`);
                }}
                sx={{
                  fontSize: "16px",
                }}
              >
                Restart
              </SecondaryButton>

              <PrimaryButton
                onClick={() => {
                  setChallengeStates((s) => ({
                    ...s,
                    [currentChallenge]: {
                      ...s[currentChallenge],
                      endAt: Date.now() + 30_000,
                      isSubmitted: true,
                    },
                  }));
                  setCurrentChallenge(null);
                  navigate(`/challenges/${slug}/done`);
                }}
                sx={{
                  fontSize: "16px",
                }}
              >
                Submit
              </PrimaryButton>
            </div>
          )}
      </div>
    </Layout>
  );
}
