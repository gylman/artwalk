import React from 'react';
import styled from 'styled-components/macro';

const Card = styled.div`
  min-width: 340px;
  height: 100%;
  width: 100%;
  max-height: 390px;
`;

const ImgWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const Img = styled.img.attrs({
  width: '345px',
  src: 'https://img.freepik.com/premium-vector/one-line-drawing-minimalist-flower-illustration-line-art-style_717710-85.jpg?w=1800',
})``;

const Challenge = () => {
  return (
    <Card>
      <ImgWrapper>
        <Img />
      </ImgWrapper>
    </Card>
  );
};

export default Challenge;
