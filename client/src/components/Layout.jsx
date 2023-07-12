import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { Frame } from "./Frame";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

function getTabIndexFromLocation({ pathname }) {
  if (pathname.startsWith("/profiles")) return 0;
  if (pathname.startsWith("/favorites")) return 2;
  return 1;
}

export function Layout(
  { children, isBottomNavigationHidden = false, ...props },
) {
  const location = useLocation();
  const navigate = useNavigate();
  const index = useMemo(() => getTabIndexFromLocation(location), [location]);

  return (
    <Frame
      wrapperStyle={{
        backgroundColor: "#E8F5FF",
      }}
      {...props}
    >
      {children}

      {!isBottomNavigationHidden && (
        <BottomNavigation
          showLabels
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 20,
          }}
          value={index}
          onChange={(event, newValue) => {
            if (newValue === index) return;
            navigate(
              [
                "/profiles",
                "/challenges",
                "/favorites",
              ][newValue],
            );
          }}
        >
          <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
          <BottomNavigationAction
            label="Challenges"
            icon={<DirectionsWalkIcon />}
          />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        </BottomNavigation>
      )}
    </Frame>
  );
}
