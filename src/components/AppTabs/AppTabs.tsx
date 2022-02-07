import React, { useEffect } from "react";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  SvgIcon,
} from "@mui/material";
import { Link } from "react-router-dom";

import RestoreIcon from "@mui/icons-material/Restore";
import PersonIcon from "@mui/icons-material/Person";
import { Dumbbell } from "../../icons/dumbbell";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import { useSelector } from "react-redux";
import { State } from "../../types/state";
import { Exercise } from "../../icons/exercise";
import { useLocation } from "react-router-dom";
import { HideOnScroll } from "./HideOnScroll";

export var AppTabs = function () {
  const [value, setValue] = React.useState(1);
  const user = useSelector((state: State) => state.user.value);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.indexOf("exercises") > -1) {
      setValue(4);
    }
    if (location.pathname.indexOf("profile") > -1) {
      setValue(3);
    }
    if (location.pathname.indexOf("routine") > -1) {
      setValue(2);
    }
    if (location.pathname.indexOf("workout") > -1) {
      setValue(1);
    }
    if (location.pathname.indexOf("history") > -1) {
      setValue(0);
    }
  }, [location]);

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
  };

  return user !== null ? (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        component="footer"
        sx={{ bottom: 0, top: "auto", height: 60, background: "bg.paper" }}
        color="default"
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="History"
            icon={<RestoreIcon />}
            component={Link}
            to="/history"
          />
          <BottomNavigationAction
            label="Workout"
            icon={<Dumbbell style={{ fontSize: "25px" }} />}
            component={Link}
            to="/"
          />
          <BottomNavigationAction
            label="Routine"
            icon={<AddCircleSharpIcon />}
            component={Link}
            to="/routine"
          />
          <BottomNavigationAction
            label="Profile"
            icon={<PersonIcon />}
            component={Link}
            to="/profile"
          />
          <BottomNavigationAction
            label="Exercises"
            icon={<Exercise />}
            component={Link}
            to="/exercises"
          />
        </BottomNavigation>
      </AppBar>
    </HideOnScroll>
  ) : (
    <></>
  );
};
