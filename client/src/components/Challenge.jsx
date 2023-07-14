import React from 'react';
import styled from 'styled-components';
import participants from '../assets/images/participants.svg';

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  border-radius: 4px;
  background: #00301e;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.2);
`;

const Tag = styled.div`
  position: absolute;
  top: 13px;
  left: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 9px;
  align-items: center;
  border-radius: 100px;
  background: #00301e;
  color: #c9e7ac;
  font-family: Roboto;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 138.462%;
  letter-spacing: 0.16px;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  background: #00301e;
  flex-direction: column;
  gap: 7.42px;
  padding: 21px 16px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Text = styled.span`
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20.02px; /* 143% */
  letter-spacing: 0.15px;
`;

const Title = styled.span`
  color: #fff;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32.016px;
`;

const ImgWrapper = styled.div`
  width: 100%;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  color: #c9e7ac;
  font-family: Roboto;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 138.462%;
  letter-spacing: 0.16px;
  &:hover {
    text-decoration: underline;
  }
`;

const ParticipantsIcon = styled.img.attrs({ src: participants })``;

export const Challenge = (props) => {
  return (
    <Card>
      <Tag>{props.pricing}</Tag>
      <ImgWrapper>
        <img src={props.imgUrl} widht='100%' />
      </ImgWrapper>
      <Content>
        <Row>
          <Title>{props.title}</Title>
          <Wrapper>
            <ParticipantsIcon />
            <Text>{props.numOfParticipants}</Text>
          </Wrapper>
        </Row>
        <Row>
          <Text>Difficulty</Text>
          <Text>{props.difficulty}</Text>
        </Row>
        <Row>
          <Text>Deadline</Text>
          <Text>{props.deadline}</Text>
        </Row>
        <Row>
          <Button>START WALKING</Button>
        </Row>
      </Content>
    </Card>
  );
};
