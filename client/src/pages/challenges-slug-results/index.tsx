import { ArrowBack } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Geojson } from "../../components/Geojson";
import { Layout } from "../../components/Layout";
import { Medal } from "../../components/Medal";
import { PrimaryButton } from "../../components/PrimaryButton";
import { TopBar } from "../../components/TopBar";
import { challenges } from "../../constants";
import { useNow } from "../../hooks/useNow";
import { challengeStatesAtom } from "../../state";
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export function Results() {
  const { width, height } = useWindowSize();
  const { slug } = useParams();
  const navigate = useNavigate();

  const now = useNow();
  const [challengeStates, setChallengeStates] = useAtom(challengeStatesAtom);

  const rank: number = 2;

  const [medal, medalApi] = useSpring(() => ({
    from: { t: 0 },
    to: { t: 1 },
    delay: 300,
  }));
  const [mainText, mainTextApi] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 700,
  }));
  const [other, otherApi] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 1000,
  }));

  useEffect(() => {
    medalApi.start();
  }, []);

  useEffect(() => {
    const challengeStates_ =
      Object.keys(challengeStates).length === 0
        ? JSON.parse(localStorage.getItem("challengeStates") ?? "{}")
        : challengeStates;
    if (
      !slug ||
      !challengeStates_[slug] ||
      challengeStates_[slug].endAt > now
    ) {
      navigate("/challenges");
    }
  }, [slug, challengeStates, now, navigate]);

  useEffect(() => {
    setChallengeStates((s) => {
      const challengeStates_ =
        Object.keys(s).length === 0
          ? JSON.parse(localStorage.getItem("challengeStates") ?? "{}")
          : challengeStates;
      if (
        slug &&
        challengeStates_[slug] &&
        challengeStates_[slug].endAt <= now &&
        !challengeStates_[slug].isResultShown
      ) {
        return {
          ...s,
          [slug]: {
            ...s[slug],
            isResultShown: true,
          },
        };
      }

      return s;
    });
  }, [slug, now, navigate, setChallengeStates]);

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
        title="Congrats!"
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
        <animated.div
          style={{
            backgroundColor: "#9afcc5",
            color: "#7135C7",
            width: "144px",
            height: "144px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            position: "relative",
            transform: medal.t.to(
              (t) => `rotateZ(${-180 * (1 - t)}deg) scale(${t})`
            ),
          }}
        >
          <Medal />
          <span
            style={{
              fontFamily: "Mona Sans",
              position: "absolute",
              top: "62px",
              fontSize: "30px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {rank}
          </span>
        </animated.div>

        <animated.div
          style={{ textAlign: "center", padding: "0 24px", ...mainText }}
        >
          <Typography
            variant="h4"
            fontFamily="Mona Sans"
            sx={{ marginBottom: "8px" }}
          >
            {rank === 1 ? (
              "You are the winner!"
            ) : (
              <>
                You ranked {rank}
                <sup>{["th", "st", "nd", "rd"][rank]}</sup>!
              </>
            )}
          </Typography>
          <Typography
            variant="h5"
            fontFamily="Mona Sans"
            sx={{ color: "#626362" }}
          >
            {rank === 1 ? (
              <>
                Your {challenges.find((x) => x.id === slug)!.title} walking
                artwork had the most similarity.
              </>
            ) : (
              <>
                Your {challenges.find((x) => x.id === slug)!.title} walking
                artwork ranked {rank}
                <sup>{["th", "st", "nd", "rd"][rank]}</sup>.
              </>
            )}
          </Typography>
        </animated.div>

        <animated.div
          style={{
            width: "80%",
            flex: "1 1 0%",
            padding: "0 24px",
            maxHeight: "320px",
            ...other,
          }}
        >
          <Geojson
            styledPathGroups={challengeStates[slug!]?.styledPathGroups ?? []}
          />
        </animated.div>

        <animated.div style={other}>
          {challengeStates[slug!]?.isMinted ? (
            <PrimaryButton sx={{ fontSize: "16px" }}>See my NFT</PrimaryButton>
          ) : (
            <Link to={`/challenges/${slug}/mint-nft`}>
              <PrimaryButton sx={{ fontSize: "16px" }}>Mint NFT</PrimaryButton>
            </Link>
          )}
        </animated.div>
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
    </Layout>
  );
}
