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