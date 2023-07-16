import { Layout } from "../../components/Layout";
import { FilterList } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Challenge } from "../../components/Challenge";
import { challenges } from "../../constants";
import { currentChallengeAtom } from "../../state";
import { FilterChallengeDialog } from "../challenges/FilterChallengeDialog";

const ChallengesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export function Favorites() {
  const [values, setValues] = useState({
    difficulty: "All",
    pricing: "All",
  });

  const [isFilterChallengeDialogOpen, setIsFilterChallengeDialogOpen] =
    useState(false);

  const filteredChallenges = useMemo(
    () =>
      challenges.filter(
        (challenge) =>
          (values.difficulty === "All" ||
            challenge.difficulty === values.difficulty) &&
          (values.pricing === "All" || challenge.pricing === values.pricing)
      ),
    [values]
  );

  const navigate = useNavigate();
  const [currentChallenge] = useAtom(currentChallengeAtom);
  useEffect(() => {
    if (currentChallenge) {
      navigate(`/challenges/${currentChallenge}/walk`);
    }
  }, [currentChallenge, navigate]);

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        paddingBottom: "56px",
      }}
    >
      <Button
        variant="outlined"
        startIcon={<FilterList />}
        style={{ borderRadius: 9999, marginBottom: "8px" }}
        onClick={() => setIsFilterChallengeDialogOpen(true)}
      >
        Filter challenge
      </Button>
      <ChallengesContainer>
        {filteredChallenges
          .filter((challenge) => challenge.isFavorite)
          .map((challenge) => (
            <Challenge key={challenge.id} {...challenge} />
          ))}
        {filteredChallenges.length === 0 && (
          <>
            <Typography
              variant="h5"
              fontFamily="Mona Sans"
              color="primary"
              sx={{
                textAlign: "center",
                paddingTop: "48px",
              }}
            >
              There is no such challenge!
            </Typography>

            <Typography sx={{ color: "#626362", textAlign: "center" }}>
              Try to change filter settings.
            </Typography>
          </>
        )}
      </ChallengesContainer>

      <FilterChallengeDialog
        isOpen={isFilterChallengeDialogOpen}
        setIsOpen={setIsFilterChallengeDialogOpen}
        spec={[
          {
            type: "select",
            id: "difficulty",
            label: "Difficulty",
            options: ["All", "Easy", "Medium", "Hard", "Expert"],
          },
          {
            type: "select",
            id: "pricing",
            label: "Pricing",
            options: ["All", "Premium", "Free"],
          },
        ]}
        values={[values]}
        setValues={setValues}
      />
    </Layout>
  );
}
