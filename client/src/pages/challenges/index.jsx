import { FilterList } from "@mui/icons-material";
import { Button, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Layout } from "../../components/Layout";
import { FilterChallengeDialog } from "./FilterChallengeDialog";

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
  const swiperRef = useRef(null);

  const [isFilterChallengeDialogOpen, setIsFilterChallengeDialogOpen] =
    useState(false);

  const handleChange = (newValue) => {
    setTabIndex(newValue);
    swiperRef.current?.slideTo(newValue);
  };
  const onSwiper = (currentSwiper) => {
    const swiperInstance = currentSwiper;
    swiperRef.current = swiperInstance;
  };
  const onSlideChange = (currentSwiper) => {
    setTabIndex(currentSwiper.activeIndex);
  };

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
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
        }}
      >
        <Tab label="Competitive" {...a11yProps(0)} />
        <Tab label="Creative" {...a11yProps(1)} />
      </Tabs>

      <Swiper
        simulateTouch={false}
        spaceBetween={50}
        slidesPerView={1}
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        style={{
          width: "100%",
          flex: "1 1 0%",
        }}
      >
        {/* Challenge page */}
        <SwiperSlide>
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

            <Link
              to="/challenges/dummy/walk"
              style={{
                display: "contents",
              }}
            >
              <button
                style={{
                  width: "100%",
                  height: "256px",
                  backgroundColor: "white",
                  borderRadius: "16px",
                }}
              >
                Dummy button to challenge page
              </button>
            </Link>
          </TabPanel>
        </SwiperSlide>

        {/* */}
        <SwiperSlide>
          <TabPanel value={tabIndex} index={1}>
          </TabPanel>
        </SwiperSlide>
      </Swiper>

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
