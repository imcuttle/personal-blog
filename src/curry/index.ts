export default function curry(fn: Function): Function {
    return function curried(...args) {
        let cachedVal
        let called
        return Object.assign((...nextArgs) => curried(...args, ...nextArgs), {
            valueOf: () => {
                if (called) {
                    return cachedVal
                }
                cachedVal = fn(...args);
                called = true;
                return cachedVal;
            }
        });
    };
}

