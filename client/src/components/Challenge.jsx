import { Button } from "@mui/material";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import participants from "../assets/images/participants.svg";

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
  padding: 16px 16px 0;
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

const ParticipantsIcon = styled.img.attrs({ src: participants })``;

export const Challenge = (props) => {
  console.log(props);
  return (
    <Card
      sx={{ width: "100%", backgroundColor: "#00301e", position: "relative" }}
    >
      <Tag>{props.pricing}</Tag>
      <CardMedia
        component="img"
        sx={{ height: 220, backgroundColor: "white", objectFit: "contain" }}
        image={props.imgUrl}
      />
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
          <Text>{props.deadline.toLocaleString("en-US")}</Text>
        </Row>
      </Content>

      <CardActions>
        <Button
          sx={{ color: "#c9e7ac" }}
        >
          START WALKING
        </Button>
      </CardActions>
    </Card>
  );
};
