import { Set } from "../types/exercise"
import { Routine } from "../types/routine"
import { User } from "../types/user"

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

const getCaloriesBurnedInSet = (user: User, set?: Set) => {
    return (weightInKg(user) * 4.8 * 0.0175 * (set?.elapsedTime || 0) / 60)
}