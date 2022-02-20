export const strengthStandards = {
    "hamstrings": { male: [0.75, 1, 1.5, 2, 2.75], female: [0.5, 0.75, 1, 1.5, 1.75] },
    "quadriceps": { male: [0.75, 1.25, 1.5, 2.25, 2.75], female: [0.5, 0.75, 1.25, 1.5, 2] },
    // "calves": { male: [0.5, 1, 1.75, 2.75, 4], female: [0.25, 0.5, 1.25, 2, 3.25] },
    "glutes": { male: [0.5, 0.1, 1.75, 2.5, 3.5], female: [0.5, 0.75, 1.5, 2, 3] },
    // "abductors": {},
    // "adductors": {},
    "biceps": { male: [0.2, 0.4, 0.6, 0.85, 1.15], female: [0.1, 0.2, 0.4, 0.6, 0.85] },
    "triceps": { male: [0.25, 0.5, 0.75, 1, 1.5], female: [0.15, 0.30, 0.5, 0.75, 1.05] },
    // "forearms": { male: [0.2, 0.4, 0.6, 0.8, 1.3], female: [0.2, 0.3, 0.4, 0.6, 0.7] },
    // "abdominals": {},
    // "middle back": {},
    // "lower back": {},
    "lats": { male: [0.5, 0.75, 1, 1.5, 1.75], female: [0.3, 0.45, 0.70, 0.95, 1.25] },
    // "traps": { male: [0.5, 1, 1.75, 2.25, 3.25], female: [0.25, 0.5, 1, 1.5, 2.25] },
    "chest": { male: [0.5, 0.75, 1.25, 1.75, 2], female: [0.25, 0.5, 0.75, 1, 1.5] },
    "shoulders": { male: [0.35, 0.55, 0.8, 1.05, 1.35], female: [0.2, 0.35, 0.5, 0.75, 0.95] },
}

export const strengthLevels = {
    "beginner": 20,
    "novice": 40,
    "intermidiate": 60,
    "expert": 80,
    "elite": 100,
}

export interface strengthRecord {
    male: number[]
    female: number[]
}