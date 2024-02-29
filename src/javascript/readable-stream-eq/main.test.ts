import isEq from "./index";

const {
    ReadableStream,
} = require('node:stream/web');

const {
    performance,
} = require('node:perf_hooks');


export function createReadableStream(content = ['abc', 'def', 'abc', 'def']) {
    const SECOND = 100;
    let pos = 0;
    let t
    return new ReadableStream({
        async start(controller) {
            clearInterval(t)
            t = setInterval(() => {
                controller.enqueue(Buffer.from(content[pos++]));
                if (pos >= content.length) {
                    controller.close()
                    clearInterval(t)
                }
            }, SECOND)
        },
        cancel() {
            clearInterval(t)
        }
    });
}

describe('readable-stream-eq', () => {
    it('case 1', async function () {
        const a = createReadableStream()
        const b = createReadableStream()
        expect(await isEq(a, b)).toBe(true)
        expect(await isEq(createReadableStream(['asd']), createReadableStream())).toBe(false)
    });
})
