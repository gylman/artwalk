import Box from "@mui/material/Box";
import styled from "styled-components";
import { Frame } from "../../components/Frame";
import background from "./background.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

const Button = styled.button`
margin: 0 auto;
border-radius: 24px;
background-color: black;
height: 48px;
font-size: 16px;
padding: 0 16px;
transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);

&:hover {
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
  background-color: #1f2937;
}
&:active {
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;
  background-color: #4b5563;
}
`;

export function Home() {
  // TODO: connect wallet
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <Frame
      wrapperStyle={{
        background: `url(${background})`,
        backgroundSize: "cover",
        color: "white",
        backgroundPosition: "center",
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h1
        style={{
          fontSize: 64,
          lineHeight: 1.125,
          fontWeight: 700,
          padding: 32,
        }}
      >
        Own Your Workout
      </h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          padding: "32px",
        }}
      >
        <h2
          style={{
            width: "100%",
            fontSize: 48,
            lineHeight: 1.25,
            fontWeight: 700,
            textAlign: "left",
            color: "black",
            marginBottom: "16px",
          }}
        >
          Touch grass
        </h2>
        <p
          style={{
            width: "100%",
            fontSize: 32,
            lineHeight: 1.25,
            color: "black",
            marginBottom: "40px",
          }}
        >
          Create & Mint Art<br />through Fitness
        </p>
        {isWalletConnected
          ? (
            <Link to="/challenges">
              <Button>
                GO TO CHALLENGE
              </Button>
            </Link>
          )
          : (
            <Button
              onClick={() => {
                setIsWalletConnected(true);
              }}
            >
              CONNECT WALLET
            </Button>
          )}
      </Box>
    </Frame>
  );
}
