import firebase from '../config';

export interface Exercise {
    id?: string
    name: string;
    force?: string | null;
    level?: string;
    mechanic?: string | null;
    equipment?: string | null;
    primaryMuscles?: string[];
    secondaryMuscles?: string[];
    instructions?: string[];
    category?: string;
}

export interface RoutineExercise extends Exercise {
    index: number
    active?: boolean
    sets?: Set[]
    elapsedTime?: number
    date?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export interface Set {
    id?: string
    index: number
    reps?: number
    weight?: number
    active?: boolean
    elapsedTime?: number
    resting?: boolean
    elapsedRestTime?: number
}

export const omitSetKeys = [
    'active',
    'elapsedTime',
    'resting',
    'elapsedRestTime',
]

export const omitExerciseKeys = [
    'category'
    , 'force'
    , 'level'
    , 'mechanic'
    // , 'equipment'
    , 'primaryMuscles'
    , 'secondaryMuscles'
    , 'instructions'
    , 'category'
    , 'active'
]