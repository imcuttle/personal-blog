const createDefer = () => {
    let resolve, reject
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    })
    return {
        resolve, reject, promise
    }
}

export default function cancellable(generator) {
    const cancelDefer = createDefer()
    const cancel = () => {
        cancelDefer.reject('Cancelled')
    }

    const handle = async () => {
        let next = generator.next();
        while (!next.done) {
            try {
                next = generator.next(await Promise.race([next.value, cancelDefer.promise]));
            } catch (e) {
                next = generator.throw(e);
            }
        }
        return next.value;
    }

    return [
        cancel,
        handle(),
    ]
};

