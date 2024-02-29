export default function* nestedArrayGen(arr) {
    for (const arrElement of arr) {
        if (Array.isArray(arrElement)) {
            yield* nestedArrayGen(arrElement)
        } else {
            yield arrElement
        }
    }
}
