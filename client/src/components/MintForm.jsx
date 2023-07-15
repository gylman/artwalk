import React, { useState } from 'react';
import styled from 'styled-components';
import { PrimaryButton } from './PrimaryButton';
import { IconButton, TextField } from '@mui/material';
import { TopBar } from './TopBar';
import { ArrowBack } from '@mui/icons-material';
import { Layout } from './Layout';
import { Link } from 'react-router-dom';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Wrapper1 = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  position: relative;
`;

const handleSubmit = () => {
  () => {
    setIsWalletConnected(true);
  };
};

const MintForm = (props) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  return (
    <Layout>
      <TopBar
        title='Mint your NFT'
        before={
          <IconButton
            sx={{ marginX: '0px' }}
            size='large'
            edge='start'
            color='inherit'
            aria-label='close'
          >
            <Link to='/'>
              <ArrowBack />
            </Link>
          </IconButton>
        }
      />
      <Main>
        <Form method='post'>
          <TextField
            label={'Author'}
            value={author}
            sx={{
              width: '100%',
              '& input': {
                fontFamily: "'Mona Sans' !important",
              },
            }}
            variant='standard'
            onChange={(e) => {
              setAuthor(e.target.value);
            }}
          ></TextField>
          <TextField
            label={'Title'}
            value={title}
            sx={{
              width: '100%',
              '& input': {
                fontFamily: "'Mona Sans' !important",
              },
            }}
            variant='standard'
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></TextField>

          <TextField
            label={'Description'}
            value={description}
            sx={{
              width: '100%',
              '& input': {
                fontFamily: "'Mona Sans' !important",
              },
            }}
            variant='standard'
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></TextField>

          <PrimaryButton onClick={handleSubmit}>MINT NFT</PrimaryButton>
        </Form>
      </Main>
    </Layout>
  );
};

export default MintForm;
