import { Exercise, RoutineExercise } from "./exercise";
import { Routine } from "./routine";
import { User } from "./user";

export interface State {
    user: UserState
    exercises: ExercisesState
    routine: RoutineState
    exercise: ExerciseState
    alert: AlertState
}

export interface UserState {
    value?: User | null
    serverValue?: any | null
}
export interface ExercisesState {
    value?: Exercise[]
}
export interface RoutineState {
    value?: Routine
    open?: boolean
}
export interface ExerciseState {
    value?: RoutineExercise
    open?: boolean
}
export interface AlertState {
    title?: string
    message?: string
    open?: boolean
}