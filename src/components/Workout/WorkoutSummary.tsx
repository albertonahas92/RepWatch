import {
  Avatar,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import anime from "animejs";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { EquipmentIcon } from "../../icons/equipment/EquipmentIcon";
import { Fireworks } from "../../icons/Fireworks";
import { routineSelector } from "../../store/routineSlice";
import { userSelector } from "../../store/userSlice";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { WorkoutDetails } from "../History/WorkoutDetails";
import { getRoutineVolume } from "../../utils/utils";

export const WorkoutSummary = () => {
  const routine = useSelector(routineSelector);
  const user = useSelector(userSelector);

  const volume = useMemo(() => {
    return getRoutineVolume(routine);
  }, [routine]);

  const animation = () => {
    anime({
      targets: ".fireworks-5",
      // scale: [0, 1],
      easing: "cubicBezier(.5, .05, .1, .3)",
      duration: 600,
      delay: function (el, i) {
        return i * 15;
      },
    });
    anime({
      targets: "[class*=fireworks-]",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "cubicBezier(.5, .05, .1, .3)",
      duration: 200,
      delay: function (el, i) {
        return i * 25;
      },
    });
  };

  useEffect(() => {
    animation();
    return () => {};
  }, []);

  return (
    <>
      {!routine?.historicalId && (
        <Container sx={{ textAlign: "center" }}>
          <Box sx={{ maxWidth: 150, m: "auto" }}>
            <Fireworks />
          </Box>
          <Typography variant="h4">Well done!</Typography>
          <Typography variant="body1">
            You have lifted a total of {volume}
            {user?.unit === "metric" ? "kg" : "lbgs"}!!
          </Typography>
        </Container>
      )}
      <WorkoutDetails routine={routine} />
    </>
  );
};
