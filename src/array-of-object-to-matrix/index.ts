export default function arrayOfObjectToMatrix(arr) {
    const mat = [
        []
    ]

    const getItemKeys = (item, prefix = '') => {
        const ks = [];
        Object.keys(item).forEach(k => {
            if (item[k] && typeof item[k] === 'object') {
                ks.push(...getItemKeys(item[k], prefix + k + '.'));
            } else {
                ks.push(prefix + k);
            }
        });
        return ks;
    }

    arr.forEach(item => {
        const ks = getItemKeys(item);
        mat[0] = Array.from(new Set(mat[0].concat(ks))).sort();
    })

    const getByKey = (item, k) => {
        const cs = k.split('.');
        for (const k of cs) {
            if (!item) {
                break
            }
            item = item[k];
        }
        return item;
    }

    arr.forEach(item => {
        mat.push(mat[0].map(k => {
            const v = getByKey(item, k)
            return typeof v === 'undefined' ? "" : v;
        }))
    })
    return mat;
}
