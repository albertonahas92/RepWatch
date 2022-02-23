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
    sets?: ESet[]
    elapsedTime?: number
    date?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export interface ESet {
    id?: string
    index: number
    reps?: number
    weight?: number
    active?: boolean
    elapsedTime?: number
    resting?: boolean
    elapsedRestTime?: number
}

export interface ExerciseHistory {
    exercise: RoutineExercise;
    date: Date
}

export const omitSetKeys = [
    'active',
    'elapsedTime',
    'resting',
    'elapsedRestTime',
]

export const omitExerciseKeys = [
    'force'
    // , 'category'
    , 'level'
    , 'mechanic'
    // , 'equipment'
    // , 'primaryMuscles'
    , 'secondaryMuscles'
    , 'instructions'
    , 'category'
    , 'active'
]