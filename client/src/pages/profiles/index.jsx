import { Avatar, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { useCurrentUser } from "../../hooks/useCurrentUser";

// TODO: replace it by the real thing
function getUser(slug) {
  return {
    id: "jane.doe",
    fullName: "Jane Doe",
    profileImageUrl:
      "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
  };
}

export function Profile() {
  const { slug } = useParams();
  const currentUser = useCurrentUser();

  const user = slug ? getUser(slug) : currentUser;

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          paddingY: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "36px",
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
        <Typography variant="h3" fontFamily="Mona Sans" color="primary">
          {user.fullName}
        </Typography>
      </Box>
    </Layout>
  );
}
