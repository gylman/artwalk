import { Button, IconButton, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Layout } from "../../components/Layout";
import { TopBar } from "../../components/TopBar";
import { HiFive } from "../../components/HiFive";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useMapContext } from "../../components/Map/hooks";
import { useEffect, useMemo } from "react";
import { rgbToHex } from "../../components/Map/utils";
import { StyledPathGroup } from "../../state";

export function Finish() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { styledPathGroups } = useMapContext();

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
          overflowY: "auto",
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
            flexShrink: 0,
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
            width: "80%",
            flex: "1 1 0%",
            padding: "0 24px",
            minWidth: "320px",
          }}
        >
          <Geojson styledPathGroups={styledPathGroups} />
        </div>

        <Link to={`/challenges/${slug}/similarity`}>
          <PrimaryButton sx={{ fontSize: "16px" }}>
            Check Similarity
          </PrimaryButton>
        </Link>
      </div>
    </Layout>
  );
}

function Geojson({
  styledPathGroups,
}: {
  styledPathGroups: StyledPathGroup[];
}) {
  useEffect(() => {
    console.log(styledPathGroups);
  }, [styledPathGroups]);

  const { minX, minY, maxX, maxY } = useMemo(
    () =>
      styledPathGroups
        .map(({ paths }) => paths)
        .flat()
        .flat()
        .reduce(
          (acc, [lng, lat]) => ({
            minX: Math.min(acc.minX, lng),
            maxX: Math.max(acc.maxX, lng),
            minY: Math.min(acc.minY, lat),
            maxY: Math.max(acc.maxY, lat),
          }),
          { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
        ),
    [styledPathGroups]
  );

  const scale = 360 / (maxX - minX);
  const padding = 24;

  const viewBox = `${-padding} ${-padding} ${
    (maxX - minX) * scale + padding * 2
  } ${(maxY - minY) * scale + padding * 2}`;
  return (
    <svg viewBox={viewBox}>
      {styledPathGroups.map((group, index) => (
        <g key={index} style={{ color: rgbToHex(group.style.color) }}>
          {group.paths.map((path, index) => (
            <path
              key={index}
              d={`M ${path
                .map(
                  ([lng, lat]) =>
                    `${(lng - minX) * scale} ${(maxY - lat) * scale}`
                )
                .join(" L ")}`}
              stroke="currentColor"
              strokeWidth={group.style.lineWidth * 1.5}
              fill="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
