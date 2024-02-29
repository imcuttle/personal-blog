
const zeroCode = '0'.charCodeAt(0);
const upperACode = 'A'.charCodeAt(0);

export default function createDeEncode({
    table = [],
    sep = '',
                                       }) {

    const symbolIndexes = new Map()
    table.forEach((n, i) => {
        if (symbolIndexes.has(n)) {
            throw new Error('不能存在重复的 symbol')
        }
        symbolIndexes.set(n, i);
    })


    const radiusStrToIndex = function (radiusStrElement) {
        radiusStrElement = radiusStrElement.toUpperCase()
        if (!isNaN(radiusStrElement)) {
            return radiusStrElement.charCodeAt(0) - zeroCode
        }
        return radiusStrElement.charCodeAt(0) - upperACode
    }

    return {
        encode(raw: string) {
            let r = '';
            for (const symbol of raw) {
                const n = symbol.codePointAt(0);
                const radiusStr = n.toString(table.length);
                r = r + (r.length > 0 ? sep : '');
                for (const radiusStrElement of radiusStr) {
                    r = r + table[radiusStrToIndex(radiusStrElement)]
                }
            }
            return r;
        },
        decode(encoded: string) {
            let r = ''
            const cs = encoded.split(sep);
            for (const c of cs) {
                let sum = 0;
                for (const cElement of c) {
                    const index = symbolIndexes.get(cElement);
                    sum = index + sum * table.length;
                }
                r += String.fromCodePoint(sum)
            }
            return r
        }
    }
}
