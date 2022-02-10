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

export const WorkoutSummary = () => {
  const routine = useSelector(routineSelector);
  const user = useSelector(userSelector);

  const volume = useMemo(() => {
    return routine?.exercises
      ?.flatMap((e) => e.sets)
      .reduce((acc, val) => {
        return acc + (val?.reps || 0) * (val?.weight || 0);
      }, 0);
  }, [routine]);

  const animation = () => {
    anime({
      targets: ".fireworks-5",
      scale: [0, 1],
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
      <List sx={{ bgcolor: "background.paper" }}>
        {routine?.exercises?.map((exercise, i) => (
          <React.Fragment key={i}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "light" }}
                    variant="body2"
                  >
                    {exercise.sets?.length}
                  </Typography>
                  <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography
                      color="text.primary"
                      component="h5"
                      variant="body1"
                    >
                      {exercise?.name}
                    </Typography>
                  </>
                }
                secondary={
                  <React.Fragment>
                    {exercise.sets?.map((s, i) => (
                      <Typography
                        sx={{ fontSize: 12 }}
                        component="div"
                        variant="body2"
                        color="text.primary"
                      >
                        Set {i + 1} - {s.reps} reps - {s.weight}kg
                      </Typography>
                    ))}

                    {/* <Typography
                      color="text.secondary"
                      component="span"
                      sx={{ display: "inline-block" }}
                      variant="body2"
                    >
                      {Math.round(
                        moment.duration(routine.duration || 0).asMinutes()
                      )}{" "}
                      minutes
                    </Typography> */}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </>
  );
};
