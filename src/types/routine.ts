import firebase from '../config';
import { RoutineExercise } from './exercise';

export interface Routine {
    id?: string
    name?: string
    archived?: boolean
    exercises?: RoutineExercise[]
    createdAt?: firebase.firestore.Timestamp
}
export interface Workout extends Routine {
    historicalId?: string
    done?: boolean
    active?: boolean
    startedAt?: Date
    duration?: number
    finishedAt?: firebase.firestore.Timestamp
}

export interface RoutineHistory { id: string; routine: Omit<Workout, "createdAt" | "updatedAt" | "acitve" | "done"> }