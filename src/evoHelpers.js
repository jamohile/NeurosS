export function rndBool() {
    return Math.random() >= 0.5
}

export function rndTrinary (o1, o2, o3) {
    const rnd = Math.random();

    if (rnd < 0.49) {
        return o1;
    } else if (rnd < 0.98) {
        return o2;
    } else {
        return o3
    }
}

