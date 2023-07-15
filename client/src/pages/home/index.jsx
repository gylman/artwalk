import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Frame } from '../../components/Frame';
import { PrimaryButton } from '../../components/PrimaryButton';
import background from './background.svg';
import '../../components/flow/config';
import * as fcl from '@onflow/fcl';

export function Home() {
  const [user, setUser] = useState({ loggedIn: null });

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  // TODO: connect wallet

  return (
    <Frame
      wrapperStyle={{
        background: `url(${background})`,
        backgroundSize: 'cover',
        color: 'white',
        backgroundPosition: 'center',
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        variant='h1'
        component='h1'
        fontWeight={600}
        fontSize='64px'
        lineHeight='70px'
        paddingTop='64px'
        textAlign='center'
        color='#9afcc5'
        fontFamily='Mona Sans'
      >
        Own Your Workout
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          paddingBottom: '48px',
        }}
      >
        <Typography
          variant='h2'
          component='h2'
          fontFamily='Mona Sans'
          style={{
            width: '100%',
            fontSize: 48,
            lineHeight: 1,
            fontWeight: 600,
            textAlign: 'center',
            color: '#7135C7',
            marginBottom: '16px',
          }}
        >
          Touch grass
        </Typography>
        <Typography
          variant='h2'
          component='h2'
          fontFamily='Mona Sans'
          style={{
            width: '100%',
            fontSize: 24,
            lineHeight: '30px',
            fontWeight: 400,
            textAlign: 'center',
            color: '#2B2B2B',
            marginBottom: '56px',
          }}
        >
          Create & Mint Art
          <br />
          through Fitness
        </Typography>
        {user.loggedIn ? (
          <Link to='/challenges'>
            <PrimaryButton>Go to challenge</PrimaryButton>
          </Link>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <PrimaryButton onClick={fcl.logIn}> Connect wallet</PrimaryButton>
            <PrimaryButton onClick={fcl.signUp}> Sign up</PrimaryButton>
          </Box>
        )}
      </Box>
    </Frame>
  );
}
