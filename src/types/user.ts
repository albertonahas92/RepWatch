import firebase from '../config';

export interface User {
    age?: number
    complete?: boolean
    displayName?: string
    photoURL?: string
    email?: string
    gender?: 'male' | 'female'
    lastWorkoutAt?: firebase.firestore.Timestamp
    onBoarding?: boolean
    streak?: number
    uid?: string
    messagingToken?: string
    feedback?: boolean

    goal?: string
    weightGoal?: number
    frequencyGoal?: number
    experience?: number

    weight?: number
    height?: number
    heightIn?: number
    unit?: 'metric' | 'imperial'

    colorMode?: 'light' | 'dark'
    weightRecords?: weightRecord[]

    settings?: UserSettings
}


export interface weightRecord {
    date: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    weight: number
}

export interface UserSettings {
    autofillVolume?: boolean
    applyRecommendation?: boolean
    autostartSet?: boolean
    warmupTimer?: boolean
    warmupTime?: number
    restTimer?: boolean
}