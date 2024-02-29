export default function undefinedToNull(obj) {
    if (typeof obj === 'object' && obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => undefinedToNull(item))
        } else {
            const newObj = {}
            for (const [k, v] of Object.entries(obj)) {
                newObj[k] = undefinedToNull(v);
            }
            return newObj;
        }
    }
    return typeof obj === 'undefined' ? null : obj
}
