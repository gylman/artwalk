import { DirectionsWalk, Favorite, Person } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Frame } from "./Frame";

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
        backgroundColor: "#F6F4F8",
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
          <BottomNavigationAction label="Profile" icon={<Person />} />
          <BottomNavigationAction
            label="Challenges"
            icon={<DirectionsWalk />}
          />
          <BottomNavigationAction label="Favorites" icon={<Favorite />} />
        </BottomNavigation>
      )}
    </Frame>
  );
}
