export default function promify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn.apply(this, [(value, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            }].concat(args))
        })
    }
}
