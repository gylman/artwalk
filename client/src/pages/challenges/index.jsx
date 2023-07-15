import { FilterList } from "@mui/icons-material";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Challenge } from "../../components/Challenge";
import { Layout } from "../../components/Layout";
import { challenges } from "../../constants";
import { FilterChallengeDialog } from "./FilterChallengeDialog";
import { useAtom } from "jotai";
import { currentChallengeAtom } from "../../state";
import { useNavigate } from "react-router-dom";

const ChallengesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export function Challenges() {
  const [values, setValues] = useState({
    difficulty: "All",
    pricing: "All",
  });

  const [tabIndex, setTabIndex] = useState(0);

  const [isFilterChallengeDialogOpen, setIsFilterChallengeDialogOpen] =
    useState(false);

  const handleChange = (newValue) => {
    setTabIndex(newValue);
  };

  const filteredChallenges = useMemo(() =>
    challenges.filter((challenge) => (
      (values.difficulty === "All" ||
        challenge.difficulty === values.difficulty) &&
      (values.pricing === "All" || challenge.pricing === values.pricing)
    )), [values]);

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
        paddingBottom: "56px",
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={(_, v) => handleChange(v)}
        indicatorColor="primary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="Tab"
        style={{
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: "rgb(246, 244, 248)",
        }}
      >
        <Tab label="Competitive" {...a11yProps(0)} />
        <Tab label="Creative" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          style={{ borderRadius: 9999, marginBottom: "8px" }}
          onClick={() => setIsFilterChallengeDialogOpen(true)}
        >
          Filter challenge
        </Button>
        <Button
          style={{
            borderRadius: 9999,
            color: "#757575",
            padding: "5px 15px",
            marginBottom: "16px",
          }}
        >
          Suggest a new challenge
        </Button>
        <ChallengesContainer>
          {filteredChallenges.map((challenge) => (
            <Challenge
              key={challenge.id}
              {...challenge}
            />
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

              <Typography
                sx={{ color: "#626362", textAlign: "center" }}
              >
                Try to change filter settings.
              </Typography>
            </>
          )}
        </ChallengesContainer>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}></TabPanel>

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
        values={values}
        setValues={setValues}
      />
    </Layout>
  );
}

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{
        padding: "24px",
      }}
    >
      {value === index && (
        <div
          style={{
            overflowY: "auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
