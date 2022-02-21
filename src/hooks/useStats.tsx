import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../config";
import { historySelector, setHistory } from "../store/historySlice";
import { userSelector } from "../store/userSlice";
import { strengthStandards, strengthLevels } from "../utils/strengthStandards";
import { getSetRPM, getStrengthLevel } from "../utils/utils";
import { useExercises } from "./useExercises";

export const useStats = () => {
  const user = useSelector(userSelector);
  const history = useSelector(historySelector);
  const { exercises } = useExercises();

  const streak = useMemo(() => {
    const historyByWeek = _.groupBy(history, (h) =>
      moment(h.routine.finishedAt?.toDate()).week()
    );
    let proceed = true;
    let weekIndex = moment().week();
    let weeksStreak = 0;

    let trainingStreak = historyByWeek[weekIndex]?.length || 0;

    while (proceed && weekIndex > 0) {
      if (historyByWeek[weekIndex]) {
        weekIndex--;
        weeksStreak++;
      } else {
        proceed = false;
      }
    }
    return { weeksStreak, trainingStreak };
  }, [user, history]);

  const strengthData = useMemo(() => {
    return Object.keys(strengthStandards)
      .map((m: string) => {
        const muscleExercises = exercises
          ?.filter((e) => e.primaryMuscles?.includes(m))
          .map((e) => e.name);

        const RM: number = Math.max(
          ...(history
            ?.flatMap((h) => h.routine.exercises)
            .filter((e) => muscleExercises?.includes(e?.name || ""))
            .flatMap((e) => e?.sets)
            .map((s) => getSetRPM(s) || 0) || [0])
        );

        return {
          muscle: m,
          level: getStrengthLevel(m, RM, user),
          ...strengthLevels,
        };
      })
      .filter((d) => !!d.level);
  }, [user, history]);

  return { history, streak, strengthData };
};
