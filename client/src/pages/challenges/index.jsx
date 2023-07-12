import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Layout } from "../../components/Layout";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export function Challenges() {
  const [value, setValue] = useState(0);
  const swiperRef = useRef(null);

  const handleChange = (newValue) => {
    setValue(newValue);
    swiperRef.current?.slideTo(newValue);
  };
  const onSwiper = (currentSwiper) => {
    const swiperInstance = currentSwiper;
    swiperRef.current = swiperInstance;
  };
  const onSlideChange = (currentSwiper) => {
    setValue(currentSwiper.activeIndex);
  };

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        value={value}
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
        <SwiperSlide>
          <TabPanel value={value} index={0}>
            <Link to="/challenges/dummy/walk">
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
        <SwiperSlide>
          <TabPanel value={value} index={1}>
          </TabPanel>
        </SwiperSlide>
      </Swiper>
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
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
