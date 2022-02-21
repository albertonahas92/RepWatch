import _ from "lodash";
import { ExerciseHistory } from "../types/exercise";
import { RoutineHistory } from "../types/routine";

export const getExercisesHistory = (history?: RoutineHistory[], exerciseName?: string) => {
    return history
        ?.flatMap((h) =>
            h?.routine?.exercises?.map((e) => {
                return {
                    exercise: e,
                    date: h.routine.finishedAt?.toDate() || new Date(),
                };
            })
        ).filter(e => !exerciseName || e?.exercise.name == exerciseName)
}

export const sortExercisesHistory = (a?: ExerciseHistory, b?: ExerciseHistory) => (a?.date.getTime() || 0) - (b?.date.getTime() || 0)