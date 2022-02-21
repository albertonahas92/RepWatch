import { Exercise, RoutineExercise } from "./exercise";
import { Routine, RoutineHistory, Workout } from "./routine";
import { User } from "./user";

export interface State {
    user: UserState
    exercises: ExercisesState
    routine: RoutineState
    exercise: ExerciseState
    alert: AlertState
    history: HistoryState
    drawer: DrawerState
}

export interface UserState {
    value?: User | null
    serverValue?: any | null
}
export interface ExercisesState {
    value?: Exercise[]
}
export interface RoutineState {
    value?: Workout
    edit?: Routine
    open?: boolean
}
export interface HistoryState {
    value?: RoutineHistory[]
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
export interface DrawerState {
    open?: boolean
}