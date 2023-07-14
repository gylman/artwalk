import { FilterList } from "@mui/icons-material";
import { Button, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import styled from "styled-components";
import { Challenge } from "../../components/Challenge";
import { Layout } from "../../components/Layout";
import { challenges } from "../../constants";
import { FilterChallengeDialog } from "./FilterChallengeDialog";

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
    theme: "Endangered animals",
    placesToWalk: "Nature",
    deadline: dayjs(),
  });

  const [tabIndex, setTabIndex] = useState(0);

  const [isFilterChallengeDialogOpen, setIsFilterChallengeDialogOpen] =
    useState(false);

  const handleChange = (newValue) => {
    setTabIndex(newValue);
  };

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
          {challenges.map((challenge) => (
            <Challenge key={challenge.id} {...challenge} />
          ))}
        </ChallengesContainer>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}></TabPanel>

      <FilterChallengeDialog
        isOpen={isFilterChallengeDialogOpen}
        setIsOpen={setIsFilterChallengeDialogOpen}
        spec={[
          {
            type: "select",
            id: "theme",
            label: "Theme",
            options: ["Endangered animals", "Modern arts"],
          },
          {
            type: "select",
            id: "placesToWalk",
            label: "Where to you want to walk",
            options: ["Nature", "City"],
          },
          {
            type: "datetime",
            id: "deadline",
            label: "Deadline",
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
