import { ArrowBack } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Layout } from "../../components/Layout";
import { PrimaryButton } from "../../components/PrimaryButton";
import { TopBar } from "../../components/TopBar";
import { challenges } from "../../constants";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { challengeStatesAtom } from "../../state";
import { useAtom } from "jotai";
import { Geojson } from "../../components/Geojson";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px;
  height: calc(100% - 84px - 56px);
  overflow-y: auto;
  overflow-x: hidden;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1 1 0%;
`;

export function MintNFT() {
  const { slug } = useParams();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [challengeStates] = useAtom(challengeStatesAtom);

  const defaultTitle = challenges.find((t) => t.id === slug)?.title ?? "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <Layout>
      <TopBar
        title="Mint your NFT"
        before={
          <IconButton
            onClick={() => navigate(-1)}
            aria-label="close"
          >
            <ArrowBack />
          </IconButton>
        }
      />
      <Main>
        <Form method="post">
          <TextField
            label={"Author"}
            aria-readonly
            value={user.fullName}
            sx={{
              width: "100%",
              "& input": {
                fontFamily: "'Mona Sans' !important",
              },
            }}
            variant="standard"
            placeholder={user.fullName}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          >
          </TextField>
          <TextField
            label={"Title"}
            value={title}
            sx={{
              width: "100%",
              "& input": {
                fontFamily: "'Mona Sans' !important",
              },
            }}
            variant="standard"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder={`${defaultTitle} by ${user.fullName}`}
            InputLabelProps={{ shrink: true }}
          >
          </TextField>

          <TextField
            label={"Description"}
            value={description}
            sx={{
              width: "100%",
              "& input": {
                fontFamily: "'Mona Sans' !important",
              },
            }}
            variant="standard"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder={`My ${defaultTitle} walking`}
            InputLabelProps={{ shrink: true }}
          >
          </TextField>

          <div
            style={{
              flex: "1 1 0%",
              padding: "24px",
            }}
          >
            <Geojson
              styledPathGroups={challengeStates[slug]?.styledPathGroups ?? []}
            />
          </div>

          <PrimaryButton
            sx={{
              fontSize: "16px",
              marginX: "auto",
            }}
          >
            Mint NFT
          </PrimaryButton>
        </Form>
      </Main>
    </Layout>
  );
}
