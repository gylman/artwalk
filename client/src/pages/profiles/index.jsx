import { Avatar, Box, Tabs, Tab, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { PrimaryButton } from '../../components/PrimaryButton';
import { TabPanel } from '../challenges';
import { useEffect, useMemo, useState } from 'react';
import { challenges } from '../../constants';
import { useAtom } from 'jotai';
import { FilterList } from '@mui/icons-material';
import { currentChallengeAtom } from '../../state';
import { styled } from 'styled-components';
import { Challenge } from '../../components/Challenge';
import { FilterChallengeDialog } from '../challenges/FilterChallengeDialog';

const ChallengesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

// TODO: replace it by the real thing
function getUser(slug) {
  return {
    id: 'jane.doe',
    fullName: 'Jane Doe',
    profileImageUrl:
      'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
  };
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export function Profile() {
  const [values, setValues] = useState({
    difficulty: 'All',
    pricing: 'All',
  });

  const [tabIndex, setTabIndex] = useState(0);

  const [isFilterChallengeDialogOpen, setIsFilterChallengeDialogOpen] =
    useState(false);

  const handleChange = (newValue) => {
    setTabIndex(newValue);
  };

  const filteredChallenges = useMemo(
    () =>
      challenges.filter(
        (challenge) =>
          (values.difficulty === 'All' ||
            challenge.difficulty === values.difficulty) &&
          (values.pricing === 'All' || challenge.pricing === values.pricing)
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
  const { slug } = useParams();
  const currentUser = useCurrentUser();

  const user = slug ? getUser(slug) : currentUser;

  return (
    <Layout
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <Box
        sx={{
          paddingY: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '36px',
        }}
      >
        <Avatar
          alt={user.fullName}
          src={user.profileImageUrl}
          sx={{
            width: 256,
            height: 256,
          }}
        />
        <Typography variant='h3' fontFamily='Mona Sans' color='primary'>
          {user.fullName}
        </Typography>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => handleChange(v)}
          indicatorColor='primary'
          textColor='inherit'
          variant='fullWidth'
          aria-label='Tab'
          style={{
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 30,
            backgroundColor: 'rgb(246, 244, 248)',
          }}
        >
          <Tab label='NFTs' {...a11yProps(0)} />
          <Tab label='CHALLENGES' {...a11yProps(1)} />
        </Tabs>

        <TabPanel value={tabIndex} index={0}></TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Button
            variant='outlined'
            startIcon={<FilterList />}
            style={{ borderRadius: 9999, marginBottom: '8px' }}
            onClick={() => setIsFilterChallengeDialogOpen(true)}
          >
            Filter challenge
          </Button>
          <ChallengesContainer>
            {filteredChallenges.map((challenge) => (
              <Challenge key={challenge.id} {...challenge} />
            ))}
            {filteredChallenges.length === 0 && (
              <>
                <Typography
                  variant='h5'
                  fontFamily='Mona Sans'
                  color='primary'
                  sx={{
                    textAlign: 'center',
                    paddingTop: '48px',
                  }}
                >
                  There is no such challenge!
                </Typography>

                <Typography sx={{ color: '#626362', textAlign: 'center' }}>
                  Try to change filter settings.
                </Typography>
              </>
            )}
          </ChallengesContainer>
        </TabPanel>

        <FilterChallengeDialog
          isOpen={isFilterChallengeDialogOpen}
          setIsOpen={setIsFilterChallengeDialogOpen}
          spec={[
            {
              type: 'select',
              id: 'status',
              label: 'Status',
              options: ['All', 'Ongoing', 'Pending', 'Completed'],
            },
            {
              type: 'select',
              id: 'results',
              label: 'Results',
              options: ['All', '1st', '2nd', '3rd'],
            },
          ]}
          values={values}
          setValues={setValues}
        />

        <PrimaryButton
          onClick={() => {
            if (confirm('Are you sure to clear everything?')) {
              localStorage.clear();
              location.href = '/';
            }
          }}
        >
          Clear everything
        </PrimaryButton>
      </Box>
    </Layout>
  );
}
