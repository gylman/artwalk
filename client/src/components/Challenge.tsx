import { PeopleOutline } from "@mui/icons-material";
import { Button, Card, CardActions, CardMedia } from "@mui/material";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import type { ChallengeSpec } from "../constants";
import { challengeStatesAtom } from "../state";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { challenges } from "../constants";

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
  background: #7135c7;
  color: #9afcc5;
  font-family: Roboto;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 138.462%;
  letter-spacing: 0.16px;
`;

const Favorite = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  background: #7135c7;
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

export const Challenge = (props: ChallengeSpec) => {
  const [challengesState, setChallengesState] = useState(challenges);
  const [challengeStates, setChallengeStates] = useAtom(challengeStatesAtom);
  const now = useMemo(() => Date.now(), []);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = (id:string) => {
    setChallengesState((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
      });
    });
  };

  return (
    <Card
      sx={{ width: "100%", backgroundColor: "#7135C7", position: "relative" }}
    >
      <Favorite
        onClick={() => {
          handleToggleFavorite(props.id);
        }}
      >
        <FavoriteIcon color={props.isFavorite ? "primary" : "secondary"} />
      </Favorite>
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
            <PeopleOutline sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
            <Text>{props.numOfParticipants}</Text>
          </Wrapper>
        </Row>
        <Row>
          <Text>Difficulty</Text>
          <Text>{props.difficulty}</Text>
        </Row>
        {challengeStates[props.id]?.isSubmitted && (
          <Row>
            <Text>Length</Text>
            <Text>10km</Text>
          </Row>
        )}
        {challengeStates[props.id]?.isSubmitted && (
          <Row>
            <Text>Time spent</Text>
            <Text>20mins</Text>
          </Row>
        )}
        <Row>
          <Text>Deadline</Text>
          <Text>
            {props.deadline === "Soon" && challengeStates[props.id]?.endAt
              ? new Date(challengeStates[props.id].endAt).toLocaleString("en")
              : props.deadline}
          </Text>
        </Row>
        {challengeStates[props.id]?.endAt &&
          challengeStates[props.id].endAt > now && (
            <Row>
              <Text>Waiting the result...</Text>
            </Row>
          )}
      </Content>

      <CardActions>
        {challengeStates[props.id]?.endAt &&
        challengeStates[props.id].endAt <= now ? (
          <Link to={`/challenges/${props.id}/results`}>
            <Button sx={{ color: "#9afcc5" }}>See results</Button>
          </Link>
        ) : challengeStates[props.id]?.isSubmitted ? null : props.id ===
          "ramen" ? (
          <Link to={`/challenges/${props.id}/walk`}>
            <Button sx={{ color: "#9afcc5" }}>Start walking</Button>
          </Link>
        ) : (
          <Button
            onClick={() => {
              alert("Sorry, it is not available yet!");
            }}
            sx={{ color: "#9afcc5" }}
          >
            Start walking
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
