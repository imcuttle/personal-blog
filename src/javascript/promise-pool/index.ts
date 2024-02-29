

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

export default function promisePool(funcs, limit = Infinity) {
    if (limit<=0) {
        throw new Error('limit invalid')
    }

    const tasks = funcs.slice().map((task, index) => ({task, index}))
    let runningCount = 0;
    let result = [];
    const defer = createDefer();

    const consumeTask = () => {
        if (!tasks.length && !runningCount) {
            defer.resolve(result)
            return;
        }
        while (tasks.length && runningCount < limit) {
            const head = tasks.shift();
            const p = new Promise((res) => {
                res(head.task())
            });
            p.then((data) => {
                result[head.index] = data;
                runningCount--;
                consumeTask();
            }, (err) => {
                runningCount--;
                defer.reject(err);
            });
            runningCount++;
        }
    }

    consumeTask();
    return defer.promise;
}
