import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Frame } from "../../components/Frame";
import background from "./background.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

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
          fontSize: "64px",
          lineHeight: 1.125,
          fontWeight: 700,
          padding: "24px",
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
          padding: "24px",
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
              <Button
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: "black",
                  fontSize: 16,
                  borderRadius: 20,
                }}
              >
                GO TO CHALLENGE
              </Button>
            </Link>
          )
          : (
            <Button
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "black",
                fontSize: 16,
                borderRadius: 20,
              }}
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
