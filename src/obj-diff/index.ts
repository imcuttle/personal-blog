const type = v => {
    return Object.prototype.toString.call(v).slice(8, -1).toLowerCase()
}

function isObject(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && obj !== null;
}


export default function objDiff(a, b) {
    if (type(a) !== type(b)) return [a, b];
    if (!isObject(a)) return a === b ? {} : [a, b];

    const diff = {}
    for (const [k, av] of Object.entries(a)) {
        if (Object.hasOwnProperty.call(b, k)) {
            const bv = b[k];
            if (av !== bv) {
                const diffV = objDiff(av, bv);
                if (Object.keys(diffV).length) {
                    diff[k] = diffV;
                }
            }
        }
    }
    return diff;
}
