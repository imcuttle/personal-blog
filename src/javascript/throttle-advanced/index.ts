
export default function throttleAdvanced(fn, ms) {
    let timer
    let pending

    const flush = () => {
        clearTimeout(timer);
        timer = null;
        pending && throttled.apply(this, pending)
    }

    const cancel = () => {
        clearTimeout(timer);
        timer = null;
        pending = null;
    }

    function throttled(...args) {
        if (!timer) {
            pending = null;
            timer = setTimeout(() => {
                flush();
            }, ms)
            return fn.apply(this, args);
        } else {
            pending = args
        }
    }
    return Object.assign(throttled, {
        flush,
        cancel
    })
}
