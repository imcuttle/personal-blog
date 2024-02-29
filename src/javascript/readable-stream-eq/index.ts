const {
    ReadableStream,
} = require('node:stream/web');

function createDefer() {
    let reject
    let resolve
    const p = new Promise((_resolve, _reject) => {
            reject = _reject
            resolve = _resolve
        }
    )
    return {
        p,
        resolve,
        reject
    }
}

export default function isEq(s1, s2) {
    if (!(s1 instanceof ReadableStream) || !(s2 instanceof ReadableStream)) {
        return s1 === s2
    }
    if (s1 === s2) {
        return true
    }

    var r1 = s1.getReader()
    var r2 = s2.getReader()

    const v1Ref = {
        current: []
    }
    const v2Ref = {
        current: []
    }

    const defer = createDefer()
    const handle = () => {
        const v1 = v1Ref.current
        const v2 = v2Ref.current
        if (!v1.length || !v2.length) {
            if (doneNum === 2) {
                defer.resolve(true)
                return
            }
            return true
        }
        var short
        var long
        if (v1.length > v2.length) {
            short = v2Ref
            long = v1Ref
        } else {
            short = v1Ref
            long = v2Ref
        }

        const isEqResult = short.current.every((x, i) => x === long.current[i])
        if (!isEqResult) {
            defer.resolve(false)
            return
        }

        if (doneNum === 2) {
            defer.resolve(true)
            return
        }

        long.current = long.current.slice(short.current.length)
        short.current = []
        return true
    }

    var doneNum = 0

    function handleReader(r, vRef) {
        r.read().then(({done, value}) => {
                if (typeof value !== 'undefined') {
                    const tmp = vRef.current
                    vRef.current = new value.constructor(vRef.current.length + value.length)
                    tmp.length && vRef.current.set(tmp)
                    vRef.current.set(value, tmp.length)
                }

                if (done) {
                    doneNum++
                    r.cancel();
                }

                if (handle()) {
                    !done && handleReader(r, vRef)
                }
            }
        )
    }
    handleReader(r1, v1Ref)
    handleReader(r2, v2Ref)

    return defer.p.finally(() => {
        r1.releaseLock()
        r2.releaseLock()
    })
}
