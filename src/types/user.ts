import firebase from '../config';

export interface User {
    age?: number
    complete?: boolean
    displayName?: string
    photoURL?: string
    email?: string
    gender?: string
    lastWorkoutAt?: firebase.firestore.Timestamp
    onBoarding?: boolean
    streak?: number
    uid?: string
    messagingToken?: string

    goal?: string
    weightGoal?: number
    experience?: number

    weight?: number
    height?: number
    heightIn?: number
    unit?: 'metric' | 'imperial'

    colorMode?: 'light' | 'dark'
}