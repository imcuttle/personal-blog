const isObjectLike = (o) => {
    return !!o && typeof o === 'object';
}

export default function jsonDeepEq(a, b) {
    if (a === b) {
        return true
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false
        }
        return a.every((item, i) => jsonDeepEq(item, b[i]))
    }

    if (isObjectLike(a) && isObjectLike(b)) {
        const aList = Object.keys(a).sort()
        const bList = Object.keys(b).sort()
        if (jsonDeepEq(aList, bList)) {
            return aList.every((ak) => {
                return jsonDeepEq(a[ak], b[ak])
            })
        }
    }

    return false
}
