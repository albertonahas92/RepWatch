import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { userSelector } from "../../../store/userSlice";
import { historySelector } from "../../../store/historySlice";
import { Dumbbell } from "../../../icons/dumbbell";
import { ProgressRing } from "../../../atoms/ProgressRing/ProgressRing";
import { useStats } from "../../../hooks/useStats";

export var RoutinesInfo = function () {
  const user = useSelector(userSelector);
  const { streak } = useStats();

  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <Grid
              container
              spacing={0}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid item>
                <Typography color="primary" variant="h4">
                  {streak?.trainingStreak}
                </Typography>
              </Grid>
              <Grid sx={{ position: "relative" }} item>
                <Avatar
                  sx={{
                    height: 42,
                    width: 42,
                    m: "auto",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 7,
                  }}
                  alt="workouts"
                >
                  <Dumbbell fontSize="medium" />
                </Avatar>
                <ProgressRing
                  size={56}
                  value={
                    (streak.trainingStreak * 100) / (user?.frequencyGoal || 4)
                  }
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                pt: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography color="textSecondary" variant="caption">
                Workouts this week
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <Grid
              container
              spacing={3}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid item>
                <Typography color="primary" variant="h4">
                  {streak?.weeksStreak}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar
                  sx={{
                    backgroundColor: "primary.light",
                    height: 52,
                    width: 52,
                  }}
                >
                  <HowToRegIcon />
                </Avatar>
              </Grid>
            </Grid>
            <Box
              sx={{
                pt: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography color="textSecondary" variant="caption">
                Weeks streak
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
