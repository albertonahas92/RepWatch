import firebase from '../config';
import { RoutineExercise } from './exercise';

export interface Routine {
    id?: string
    name?: string
    exercises?: RoutineExercise[]
    active?: boolean
    createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
}