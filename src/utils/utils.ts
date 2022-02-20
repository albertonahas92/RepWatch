import { RoutineExercise, ESet as _Set } from "../types/exercise"
import { Routine, Workout } from "../types/routine"
import { User } from "../types/user"
import { strengthRecord, strengthStandards } from "./strengthStandards"


export const workoutPlaces = [
    "all",
    "home",
    "gym",
    "crossfit",
]

export const nonWeightedEquipments = [
    "body only",
    "bands",
    "foam roll",
]

export const equipmentsPlaces = {
    'body only': ["home"],
    'machine': ["gym"],
    'other': [],
    'foam roll': ["crossfit", "home"],
    'kettlebells': ["crossfit"],
    'dumbbell': ["gym", "crossfit"],
    'cable': ["gym"],
    'barbell': ["gym", "crossfit"],
    'medicine ball': ["crossfit"],
    'bands': ["crossfit", "home"],
    'exercise ball': ["crossfit"],
    'e-z curl bar': ["crossfit", "gym"],
}

export const splits = [
    "push",
    "pull",
    "legs",
    "core",
    "arms",
    "upper",
    "lower",
    "full",
    "biceps",
    "triceps",
    "back",
    "chest",
    "shoulders",
]

export const muscles = {
    "hamstrings": ["legs", "lower"],
    "quadriceps": ["legs", "lower"],
    "calves": ["legs", "lower"],
    "glutes": ["legs", "lower"],
    "abductors": ["legs", "lower"],
    "adductors": ["legs", "lower"],
    "biceps": ["arms", "pull", "upper", "biceps"],
    "triceps": ["arms", "push", "upper", "triceps"],
    "forearms": ["arms", "pull"],
    "abdominals": ["core", "lower", "abdominals"],
    "middle back": ["pull", "upper", "back"],
    "lower back": ["pull", "upper", "back"],
    "lats": ["pull", "upper", "back"],
    "traps": ["pull", "upper", "back"],
    "chest": ["push", "upper", "chest"],
    "shoulders": ["push", "upper", "shoulders"],
}


export const goalCateogries = {
    "general": [],
    "strength": [],
    "muscle": [],
    "endurance": [],
}

export const getMuscleGroupName = (muscle: string) => {
    switch (muscle) {
        case "hamstrings" || "quadriceps" || "calves" || "glutes" || "abductors" || "adductors": return "legs"
        case "biceps" || "triceps" || "forearms": return "arms"
        case "abdominals": return "abdominals"
        case "middle back" || "lower back" || "lats" || "traps": return "back"
        default:
            return muscle;
    }
}


export const getWorkoutSplits = () => Object.assign({}, ...([...new Set(Object.values(muscles).flatMap(e => e))]
    .map(s => { return { [s]: Object.keys(muscles).filter((m: any) => getKeyValue(m)(muscles).includes(s)) } })))

export const getPlaceEquipments = () => Object.assign({}, ...([...new Set(Object.values(equipmentsPlaces).flatMap(e => e))]
    .map(s => { return { [s]: Object.keys(equipmentsPlaces).filter((m: any) => getKeyValue(m)(equipmentsPlaces).includes(s)) } })))

export const getExerciseMuscleGroups = (muscles: string[]) => {

}

export const generateUUID = () => {
    let d = new Date().getTime(); // Timestamp
    let d2 =
        (typeof performance !== 'undefined' &&
            performance.now &&
            performance.now() * 1000) ||
        0; // Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16; // random number between 0 and 16
        if (d > 0) {
            // Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            // Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};

export const converter = {
    ftToCm: (ft = 0, inches = 0) => Math.round(((ft * 12 + inches) * 2.54)),
    cmToFt: (cm = 0) => {
        const inchesTotal = cm / 12 / 2.54;
        const ft = Math.floor(inchesTotal)
        const inches = Math.round((inchesTotal - ft) * 12)
        return {
            ft,
            inches
        }
    },
    kgToLbs: (kg = 0) => Math.round(kg * 2.20462262),
    lbsToKg: (lbs = 0) => Math.round(lbs / 2.20462262)
};

export const compareDates = (d1?: Date, d2?: Date) => {
    return d1 && d2 && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
}

export const goalString = (goal?: string) => {
    switch (goal) {
        case "general":
            return "General Fitness"
        case "strength":
            return "Build Strength"
        case "muscle":
            return "Gain Muscle"
        case "endurance":
            return "Endurance"
        default:
            "";
    }
}


export const getLevelNum = (l?: string) => {
    switch (l) {
        case "beginner":
            return 1;
        case "intermediate":
            return 2;
        default:
            return 3;
    }
};

export const heightString = (user?: User) => {
    return user?.unit === 'imperial' ? `${user.height} ft. ${user.heightIn} in.` : `${user?.height} cm`
}
export const weightString = (user?: User, weight?: number) => {
    return user?.unit === 'imperial' ? `${weight || user.weight} lbs` : `${weight || user?.weight} kg`
}

export const weightInKg = (user?: User) => {
    return user?.unit === 'imperial' ? converter.lbsToKg(user.weight) : user?.weight || 0
}
export const heightInCm = (user?: User) => {
    return user?.unit === 'imperial' ? converter.ftToCm(user.height, user.heightIn) : user?.height || 0
}

export const getSetRPM = (set?: _Set) => Math.round((set?.weight || 0) / (1.0278 - 0.0278 * (set?.reps || 1)))
export const getSetVolume = (set?: _Set) => (set?.reps || 0) * (set?.weight || 0)

export const getExericseVolume = (exercise?: RoutineExercise) => {
    return exercise?.sets?.reduce((acc, val) => {
        return acc + getSetVolume(val);
    }, 0);
}

export const getRoutineVolume = (routine?: Workout) => {
    return routine?.exercises
        ?.flatMap((e) => e.sets)
        .reduce((acc, val) => {
            return acc + getSetVolume(val);
        }, 0);
}

export const getResizedName = (fileName: string, dimensions = '600x600') => {
    const extIndex = fileName.lastIndexOf('.');
    const ext = fileName.substring(extIndex);
    return `${fileName.substring(0, extIndex)}_${dimensions}${ext}`;
};

export const reorder = <T>(
    list: T[],
    startIndex: number,
    endIndex: number
): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


const getPWADisplayMode = () => {
    const isStandalone = window.matchMedia(
        '(display-mode: standalone)'
    ).matches;
    if (document.referrer.startsWith('android-app://')) {
        return 'twa';
    } else if ((navigator as any).standalone || isStandalone) {
        return 'standalone';
    }
    return 'browser';
};


const getCaloriesBurnedInRoutine = (user: User, routine: Routine) => {
    routine.exercises?.flatMap(e => e.sets).reduce(
        (acc, set) => acc + getCaloriesBurnedInSet(user, set),
        0
    )
}

const getCaloriesBurnedInSet = (user: User, set?: _Set) => {
    return (weightInKg(user) * 4.8 * 0.0175 * (set?.elapsedTime || 0) / 60)
}

const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

export const getStrengthLevel = (muscle: string, weight: number, user?: User | null) => {
    const standards: strengthRecord = getKeyValue(muscle)(strengthStandards)
    const userStandards = [0, ...standards[user?.gender || 'male']]
    const ratio = weight / (user?.weight || 1)

    let levelIndex = userStandards.findIndex(s => s > ratio)

    if (levelIndex === -1) {
        return 20 * userStandards.length - 1
    }
    const strength = 20 * (levelIndex - 1)

    const diff = ratio - userStandards[levelIndex - 1]
    const levelDiff = userStandards[levelIndex] - userStandards[levelIndex - 1]
    const strengthDiff = Math.round(((diff) / levelDiff) * 100 / userStandards.length)

    if (muscle === 'chest') {

        console.log(diff, levelDiff, levelIndex, strengthDiff);
    }

    return (strength + strengthDiff)
}