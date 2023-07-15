import { Button, Snackbar, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { challengeStatesAtom, currentChallengeAtom } from "../state";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { challenges } from "../constants";
import { useNow, useNowSetter } from "../hooks/useNow";

export function ToastManager() {
  useNowSetter();

  const [challengeStates, setChallengeStates] = useAtom(challengeStatesAtom);

  const challengeKeysTracked = useMemo(
    () =>
      Object.keys(challengeStates).filter(
        (key) =>
          challengeStates[key] &&
          !challengeStates[key].isToastShown &&
          !challengeStates[key].isResultShown
      ),
    [challengeStates]
  );

  return (
    <SnackbarProvider maxSnack={3}>
      {challengeKeysTracked.map((key) => (
        <ToastItem
          key={key}
          id={key}
          title={challenges.find((x) => x.id === key)?.title ?? ""}
        />
      ))}
    </SnackbarProvider>
  );

  //   const [toastShown, setToastShown] = useState(false);
  //   const [isToastOpen, setIsToastOpen] = useState(false);

  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     if (toastShown) return;

  //     const check = () => {
  //       const showResultAt = localStorage.getItem(`showResultAt__ramen`);
  //       if (!showResultAt) return;
  //       if (localStorage.getItem(`resultShown__ramen`)) return;

  //       const timestamp = parseInt(showResultAt);
  //       if (timestamp < Date.now()) {
  //         setToastShown(true);
  //         setIsToastOpen(true);
  //       }
  //     };

  //     check();
  //     const interval = setInterval(check, 1000);

  //     return () => clearInterval(interval);
  //   }, [toastShown]);

  //   return (
  //     <Snackbar
  //       open={isToastOpen}
  //       message="The challenge 'Ramen' ished! You wanna see the results?"
  //       action={
  //         <Button
  //           sx={{
  //             color: "#9AFCC5",
  //           }}
  //           size="small"
  //           onClick={() => {
  //             setIsToastOpen(false);
  //             localStorage.setItem(`resultShown__ramen`, "true");
  //             navigate("/challenges/ramen/results");
  //           }}
  //         >
  //           Show me results
  //         </Button>
  //       }
  //       sx={{
  //         bottom: { xs: 90, sm: 0 },
  //         marginX: "24px",
  //       }}
  //       ContentProps={{
  //         sx: {
  //           backgroundColor: "#7135C7",
  //         },
  //       }}
  //     />
  //   );
}

function ToastItem({ id, title }: { id: string; title: string }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const shown = useRef(false);
  const [challengeStates, setChallengeStates] = useAtom(challengeStatesAtom);
  const navigate = useNavigate();

  const dismiss = (toastId: string | number) => {
    setChallengeStates((s) =>
      !id || !s[id]
        ? s
        : {
            ...s,
            [id]: {
              ...s[id],
              isToastShown: true,
            },
          }
    );
    closeSnackbar(toastId);
  };

  const action = (toastId: string | number) => (
    <>
      <Button
        sx={{
          color: "#9AFCC5",
        }}
        size="small"
        onClick={() => {
          navigate(`/challenges/${id}/results`);
          dismiss(toastId);
        }}
      >
        See results
      </Button>
      <Button
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
        }}
        size="small"
        onClick={() => {
          dismiss(toastId);
        }}
      >
        Dismiss
      </Button>
    </>
  );

  const now = useNow();
  useEffect(() => {
    if (!id) return;
    const currentChallengeState = challengeStates[id];
    if (!currentChallengeState) return;
    if (
      currentChallengeState.isToastShown ||
      currentChallengeState.isResultShown
    )
      return;

    if (now >= currentChallengeState.endAt && !shown.current) {
      shown.current = true;
      enqueueSnackbar(
        <Typography>
          The challenge '{title}' has been finished! You wanna see the results?
        </Typography>,
        {
          action,
          persist: true,
        }
      );
    }
  }, [challengeStates, id, now]);

  return null;
}
