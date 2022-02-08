import firebase from '../config';
import { RoutineExercise } from './exercise';

export interface Routine {
    id?: string
    name?: string
    exercises?: RoutineExercise[]
    createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue

    active?: boolean
    startedAt?: Date
    duration?: number
    finishedAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export interface RoutineHistory { id: string; routine: Routine }