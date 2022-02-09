import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import anime from "animejs";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Fireworks } from "../../icons/fireworks";
import { routineSelector } from "../../store/routineSlice";
import { userSelector } from "../../store/userSlice";

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
      duration: 200,
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
    <Container sx={{ textAlign: "center" }}>
      <Box sx={{ maxWidth: 150, m: "auto" }}>
        <Fireworks />
      </Box>
      <Typography variant="h4">Well done!</Typography>
      <Typography variant="body1">
        You have lifted a total of {volume}
        {user?.unit === "metric" ? "kg" : "lbgs"} today!
      </Typography>
    </Container>
  );
};
