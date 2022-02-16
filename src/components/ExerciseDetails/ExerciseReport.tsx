import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { LineReport } from "../../molecules/Reports/LineReport";
import { historySelector } from "../../store/historySlice";
import { userSelector } from "../../store/userSlice";
import { RoutineExercise } from "../../types/exercise";
import { getExericseVolume } from "../../utils/utils";

export const ExerciseReport: FC<Props> = ({ exercise }) => {
  const history = useSelector(historySelector);
  const user = useSelector(userSelector);
  const unit = useMemo(() => (user?.unit === "imperial" ? "lb" : "kg"), [user]);
  const data = useMemo(
    () =>
      history
        ?.flatMap((h) =>
          h?.routine?.exercises?.map((e) => {
            return {
              exercise: e,
              date: h.routine.finishedAt?.toDate() || new Date(),
            };
          })
        )
        .filter((e) => e?.exercise?.name === exercise.name)
        .sort((a, b) => (a?.date.getTime() || 0) - (b?.date.getTime() || 0))
        .map((e) => {
          return {
            date: `${e?.date.getDate()}/${(e?.date.getMonth() || 0) + 1}`,
            // date: e?.date.toDateString(),
            volume: getExericseVolume(e?.exercise) || 0,
            weight: Math.max.apply(
              null,
              e?.exercise?.sets?.map((s) => s.weight || 0) || [0]
            ),
          };
        }) || [],
    [exercise, history]
  );

  const weightChartKeys = new Map([["weight", "Weight"]]);
  const volumeChartKeys = new Map([["volume", "Volume"]]);

  const getWeightDiff = () => {
    if (data.length < 2) {
      return 0;
    }
    const unit = user?.unit === "imperial" ? "lb" : "kg";
    const diff = data[data.length - 1].weight - data[0].weight;
    if (diff > 0) {
      return `Weight has increased by ${diff} ${unit}`;
    } else {
      return `Weight has decreased by ${Math.abs(diff)} ${unit}`;
    }
  };

  const getVolumeDiff = () => {
    if (data.length < 2) {
      return 0;
    }
    const diff = data[data.length - 1].volume - data[0].volume;
    const percentage = Math.round((diff / data[0].volume) * 100);
    if (diff > 0) {
      return `Volume has increased by ${percentage}%`;
    } else {
      return `Volume has decreased by ${Math.abs(percentage)}%`;
    }
  };

  return (
    <>
      <Typography color="text.secondary" sx={{ my: 1, textAlign: "center" }}>
        {/* Weight */}
        {data.length > 1 && getWeightDiff()}
      </Typography>
      <Box sx={{ height: 300 }}>
        <LineReport data={data} keys={weightChartKeys} argument="date" />
      </Box>
      <Typography color="text.secondary" sx={{ my: 1, textAlign: "center" }}>
        {/* Volume */}
        {data.length > 1 && getVolumeDiff()}
      </Typography>
      <Box sx={{ height: 300 }}>
        <LineReport data={data} keys={volumeChartKeys} argument="date" />
      </Box>
    </>
  );
};

interface Props {
  exercise: RoutineExercise;
}
