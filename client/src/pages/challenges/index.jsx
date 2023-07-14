import { FilterList } from '@mui/icons-material';
import { Button, Tab, Tabs } from '@mui/material';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import cuid from 'cuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Layout } from '../../components/Layout';
import { FilterChallengeDialog } from './FilterChallengeDialog';
import ramen from '../../assets/images/challenges/ramen.jpg';
import tree_expert from '../../assets/images/challenges/tree_expert.jpg';
import tree_difficult from '../../assets/images/challenges/tree_difficult.jpg';
import tree_hard from '../../assets/images/challenges/tree_hard.jpg';
import tree_medium from '../../assets/images/challenges/tree_medium.webp';
import tree_easy from '../../assets/images/challenges/tree_easy.jpg';
import moth from '../../assets/images/challenges/moth.jpg';
import mountain from '../../assets/images/challenges/mountain.jpg';
import mouth from '../../assets/images/challenges/mouth.png';
import leaves from '../../assets/images/challenges/leaves.jpg';
import car from '../../assets/images/challenges/car.jpg';
import alien from '../../assets/images/challenges/alien.png';
import pianist from '../../assets/images/challenges/pianist.jpg';
import sea_scape from '../../assets/images/challenges/sea_scape.webp';
import { Challenge } from '../../components/Challenge';

import styled from 'styled-components';

const ChallengesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const challenges = [
  {
    id: cuid(),
    imgUrl: ramen,
    pricing: 'Premium',
    title: 'Ramen',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: sea_scape,
    pricing: 'Free',
    title: 'Sea',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: alien,
    pricing: 'Premium',
    title: 'Alien',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: leaves,
    pricing: 'Free',
    title: 'Leaves',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: car,
    pricing: 'Free',
    title: 'AUDI',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: mouth,
    pricing: 'Premium',
    title: 'Mouth',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: mountain,
    pricing: 'Premium',
    title: 'Mountains',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: moth,
    pricing: 'Premium',
    title: 'Moth',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: pianist,
    pricing: 'Premium',
    title: 'Pianist',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: tree_easy,
    pricing: 'Premium',
    title: 'Tree simple',
    numOfParticipants: 23,
    deadline: new Date(),
    difficulty: 'Easy',
  },
  {
    id: cuid(),
    pricing: 'Free',
    imgUrl: tree_difficult,
    title: 'Tough tree',
    numOfParticipants: 248,
    deadline: new Date(),
    difficulty: 'Hard',
  },
  {
    id: cuid(),
    pricing: 'Detailed tree',
    title: 'Detailed tree',
    imgUrl: tree_hard,
    numOfParticipants: 3,
    deadline: new Date(),
    difficulty: 'MEDIUM',
  },
  {
    id: cuid(),
    imgUrl: tree_expert,
    pricing: 'Premium',
    title: 'TreeXpert',
    numOfParticipants: 5667,
    deadline: new Date(),
    difficulty: 'Expert',
  },
  {
    id: cuid(),
    imgUrl: tree_medium,
    pricing: 'Premium',
    title: 'Tree OK',
    numOfParticipants: 5667,
    deadline: new Date(),
    difficulty: 'Expert',
  },
];

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export function Challenges() {
  const [values, setValues] = useState({
    theme: 'Endangered animals',
    placesToWalk: 'Nature',
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={(_, v) => handleChange(v)}
        indicatorColor='primary'
        textColor='inherit'
        variant='fullWidth'
        aria-label='Tab'
        style={{
          flexShrink: 0,
        }}
      >
        <Tab label='Competitive' {...a11yProps(0)} />
        <Tab label='Creative' {...a11yProps(1)} />
      </Tabs>

      <Swiper
        simulateTouch={false}
        spaceBetween={50}
        slidesPerView={1}
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        style={{
          width: '100%',
          flex: '1 1 0%',
        }}
      >
        {/* Challenge page */}
        <SwiperSlide>
          <TabPanel value={tabIndex} index={0}>
            <Button
              variant='outlined'
              startIcon={<FilterList />}
              style={{ borderRadius: 9999, marginBottom: '8px' }}
              onClick={() => setIsFilterChallengeDialogOpen(true)}
            >
              Filter challenge
            </Button>
            <Button
              style={{
                borderRadius: 9999,
                color: '#757575',
                padding: '5px 15px',
                marginBottom: '16px',
              }}
            >
              Suggest a new challenge
            </Button>
            <ChallengesContainer>
              {challenges.map((challenge) => (
                <Challenge key={cuid()} props={challenge} />
              ))}
            </ChallengesContainer>
            <Link
              to='/challenges/dummy/walk'
              style={{
                display: 'contents',
              }}
            >
              <button
                style={{
                  width: '100%',
                  height: '256px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                }}
              >
                Dummy button to challenge page
              </button>
            </Link>
          </TabPanel>
        </SwiperSlide>

        {/* */}
        <SwiperSlide>
          <TabPanel value={tabIndex} index={1}></TabPanel>
        </SwiperSlide>
      </Swiper>

      <FilterChallengeDialog
        isOpen={isFilterChallengeDialogOpen}
        setIsOpen={setIsFilterChallengeDialogOpen}
        spec={[
          {
            type: 'select',
            id: 'theme',
            label: 'Theme',
            options: ['Endangered animals', 'Modern arts'],
          },
          {
            type: 'select',
            id: 'placesToWalk',
            label: 'Where to you want to walk',
            options: ['Nature', 'City'],
          },
          {
            type: 'datetime',
            id: 'deadline',
            label: 'Deadline',
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
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{
        padding: '24px',
      }}
    >
      {value === index && (
        <div
          style={{
            overflowY: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
