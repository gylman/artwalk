import { Button, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { challenges } from "../constants";
import { useNow, useNowSetter } from "../hooks/useNow";
import { challengeStatesAtom } from "../state";

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
