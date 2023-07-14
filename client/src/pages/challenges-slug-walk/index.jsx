import { ArrowBack } from "@mui/icons-material";
import { ButtonBase, Dialog, IconButton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Map } from "../../components/Map";
import { useWarnOnBackButton } from "../../hooks/useWarnOnBackButton";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SecondaryButton } from "../../components/SecondaryButton";
import { TopBar } from "../../components/TopBar";
import { Turtle } from "../../components/Turtle";
import { useMapContext } from "../../components/Map/hooks";

export function Walk() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { clear, isEnabled, setIsEnabled, continueWalk } = useMapContext();

  const [isImageDisplayOpen, setIsImageDisplayOpen] = useState(false);

  const onBackButtonCallback = useCallback(() => {
    const yes = confirm("Do you really want to quit walking?");
    if (yes) {
      clear();
      navigate("/challenges", { replace: true });
    }
  }, [navigate, clear]);
  useWarnOnBackButton(onBackButtonCallback);

  return (
    <Layout
      isBottomNavigationHidden
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back button */}
      <TopBar
        sx={{
          position: "fixed",
          backgroundColor: "transparent",
        }}
        before={
          <IconButton
            aria-label="back"
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>
        }
        after={
          <ButtonBase
            sx={{
              width: 96,
              height: 72,
              color: "#7135C7",
              backgroundColor: "#F6F4F8",
              borderRadius: "16px",
              padding: "12px",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow:
                "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
              transition:
                "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              ":hover": {
                backgroundColor: "rgb(226,230,220)",
              },
            }}
            onClick={() => setIsImageDisplayOpen(true)}
          >
            <Turtle
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </ButtonBase>
        }
      />

      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "calc(100% - 84px)",
          left: 0,
          top: 0,
        }}
      >
        <Map />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          padding: "24px",
          bottom: 0,
          zIndex: 10,
        }}
      >
        <SecondaryButton
          color="warning"
          sx={{
            padding: "0 16px",
            height: 36,
          }}
          onClick={() => clear()}
        >
          Clear
        </SecondaryButton>
        <SecondaryButton
          onClick={() => {
            if (isEnabled) {
              setIsEnabled(false);
            } else {
              continueWalk();
            }
          }}
          sx={{
            padding: "0 16px",
            height: 36,
          }}
        >
          {isEnabled ? "Pause" : "Continue"}
        </SecondaryButton>
        <Link
          to={`/challenges/${slug}/finish`}
        >
          <PrimaryButton
            sx={{
              padding: "0 16px",
              height: 36,
            }}
          >
            Finish
          </PrimaryButton>
        </Link>
      </div>

      <Dialog
        onClose={() => setIsImageDisplayOpen(false)}
        open={isImageDisplayOpen}
        PaperProps={{
          style: {
            backgroundColor: "#F6F4F8",
            padding: "24px",
            borderRadius: "24px",
            width: "100%",
          },
        }}
      >
        <Turtle style={{ width: "100%", height: "100%", color: "#7135C7" }} />
      </Dialog>
    </Layout>
  );
}
