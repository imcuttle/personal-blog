const stringifyNumber = (n) => String(n)
const stringifyBoolean = (n) => n ? 'true' : 'false'
const stringifyString = (v) => {
    let s = '"'
    for (const vElement of v) {
        if (vElement === "\\") {
            s += "\\\\"
        } else if (vElement === '"') {
            s += '\\"'
        } else {
            s += vElement
        }
    }
    return s + '"'
}

function _jsonStringify(data, weakCache) {
    if (typeof data === 'string') {
        return stringifyString(data)
    }
    if (typeof data === 'number') {
        return stringifyNumber(data)
    }

    if (typeof data === 'boolean') {
        return stringifyBoolean(data)
    }

    if (Array.isArray(data)) {
        if (weakCache.get(data)) {
            throw new Error('circular structure error')
        }
        weakCache.set(data, true);
        return '[' + data.map(x => {
            if (typeof x === 'undefined') {
                return 'null'
            }
            return _jsonStringify(x, weakCache)
        }).join(',') + ']'
    }
    if (data === null) {
        return 'null'
    }
    if (typeof data === 'undefined') {
        return
    }

    if (weakCache.get(data)) {
        throw new Error('circular structure error')
    }
    weakCache.set(data, true);
    let s = '{';
    let appended = false;
    Object.keys(data).forEach((name, index, {length}) => {
        const v = data[name];
        if (appended) {
            s+=','
            appended = false
        }
        if (typeof v !== 'undefined') {
            s += _jsonStringify(name, weakCache) + ':'
            s += _jsonStringify(v, weakCache);
            appended = true;
        }
    });
    s+='}'
    return s;
}



export default function (d) {
    return _jsonStringify(d, new WeakMap())
}
