const _type = v => Object.prototype.toString.call(v).slice(8, -1).toLowerCase()

export default function deepMerge(a, b) {
    if ((typeof a !== 'object' || !a) || typeof b !== 'object' || !b) {
        return b
    }

    const ta = _type(a)
    const tb = _type(b)
    if (ta !== tb) {
        return b;
    }
    if (ta === 'Array') {
        const arr = a;
        for (let i = 0; i < a.length; i++) {
            const va = a[i];
            if (i < b.length) {
                arr[i] = deepMerge(va, b[i]);
            } else {
                arr[i] = va;
            }
        }
        for (let i = a.length; i < b.length; i++) {
            arr.push(b[i]);
        }
        return arr;
    } else {
        for (const [bk, bv] of Object.entries(b)) {
            if (Object.hasOwnProperty.call(a, bk)) {
                a[bk] = deepMerge(a[bk], bv);
            } else {
                a[bk] = bv;
            }
        }
        return a;
    }
}
