import _ from "lodash";
import { ExerciseHistory, RoutineExercise } from "../types/exercise";
import { RoutineHistory } from "../types/routine";
import { User } from "../types/user";
import { oneWeightUnit } from "./utils";

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

export const getRepsCount = (user?: User | null, exercise?: RoutineExercise, setIndex?: number) => {
    if (exercise?.equipment === 'body only') {
        return 15
    }
    if (["cardio", "stretching"].includes(exercise?.category || '')) {
        return 0
    }
    switch (user?.goal) {
        case "general":
            return 10
        case "strength":
            return Math.max(6 - (setIndex || 0), 1)
        case "muscle":
            return Math.max(12 - (2 * (setIndex || 0)), 1)
        case "endurance":
            return 16
        default:
            return 12;
    }
}

export const getNextWeight = (user?: User | null, exercise?: RoutineExercise, prevWeight?: number) => {
    if (!prevWeight) return 0
    if (exercise?.equipment === 'body only' || ["cardio", "stretching"].includes(exercise?.category || '')) {
        return 0
    }
    const rate = oneWeightUnit(user)

    switch (user?.goal) {
        case "general":
            return prevWeight
        case "strength":
            return Number(prevWeight) + (exercise?.equipment === 'barbell' ? 10 * rate : 5 * rate)
        case "muscle":
            return Number(prevWeight) + (exercise?.equipment === 'barbell' ? 5 * rate : 2.5 * rate)
        case "endurance":
            return prevWeight
        default:
            return 0;
    }
}

export const getRestTime = (user?: User | null, exercise?: RoutineExercise, setIndex?: number) => {
    if (exercise?.equipment === 'body only' || ["cardio", "stretching"].includes(exercise?.category || '')) {
        return 60
    }
    switch (user?.goal) {
        case "general":
            return 60
        case "strength":
            return 120 + (setIndex || 0) * 60
        case "muscle":
            return 70 + (setIndex || 0) * 10
        case "endurance":
            return 30
        default:
            return 60;
    }
}