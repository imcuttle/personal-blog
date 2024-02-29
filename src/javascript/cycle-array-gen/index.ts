
export default function *cycleArrayGen(arr, index = 0) {
    while (true) {
        const step = yield arr[index];
        index = (((index + step) % arr.length) + arr.length) % arr.length;
    }
}
