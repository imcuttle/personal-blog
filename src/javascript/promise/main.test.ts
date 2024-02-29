import PromiseLike, {getPromiseLikeResult, getPromiseLikeStatus} from './index';

const delay = (ms = 0) => new PromiseLike(res => setTimeout(res, ms))

describe('PromiseLike', () => {
    it('spec1 pending', function () {
        const p = new PromiseLike(() => {})
        expect(getPromiseLikeStatus(p)).toBe('pending')
    });
    it('spec1 rejected', async function () {
        const p = new PromiseLike((res, rej) => {
            rej('error')
            res('ok')
        })
        expect(getPromiseLikeStatus(p)).toBe('rejected')
        expect(getPromiseLikeResult(p)).toBe('error')

        const p2 = PromiseLike.reject('error')
        expect(getPromiseLikeStatus(p2)).toBe('rejected')
        expect(getPromiseLikeResult(p2)).toBe('error')

        const p3 = new PromiseLike((res, rej) => {
            throw new Error('error')
        })
        expect(getPromiseLikeStatus(p3)).toBe('rejected')
        expect(getPromiseLikeResult(p3)).toEqual(new Error('error'))


        const p4 = new PromiseLike(async (res, rej) => {
            await delay();
            throw new Error('error');
            rej('error')
        })
        expect(getPromiseLikeStatus(p4)).toBe('pending')

        try {
            await p4;
        } catch {}
        expect(getPromiseLikeStatus(p4)).toBe('rejected')
        expect(getPromiseLikeResult(p4)).toEqual(new Error('error'))
    });
    it('spec1 resolved', function () {
        const p = new PromiseLike((res, rej) => {
            res('ok')
            rej('error')
        })
        expect(getPromiseLikeStatus(p)).toBe('resolved')
        expect(getPromiseLikeResult(p)).toBe('ok')
    });

    it('chain multi resolved', async function () {
        const p = PromiseLike.resolve(1);
        const vals = await PromiseLike.all([
            p.then(x => x+1),
            p.then(x => x+1).then(x => {
                return delay().then(() => x+1)
            }),
        ])
        expect(vals).toEqual([
            2, 3
        ])
    });

    it('should called by order', async function () {
        const log = jest.fn((...args: any[]) => {})

        log('1')
        const p = new PromiseLike((res) => {
            log('2')
            res(new PromiseLike(res2 => {
                log('2.1')
                res2()
            }).then(() => log('2.2')))
            log('2.3')
        }).then(() => log('3')).finally(() => log('4'))
        log('5')

        expect(log.mock.calls).toEqual([
            ['1'],
            ['2'],
            ['2.1'],
            ['2.3'],
            ['5']
        ])

        await p;
        expect(log.mock.calls).toEqual([
            ['1'],
            ['2'],
            ['2.1'],
            ['2.3'],
            ['5'],
            ['2.2'],
            ['3'],
            ['4'],
        ])
    });
    it('should Promise.race', async function () {
        expect(await PromiseLike.race([1,2])).toBe(1)
        expect(await PromiseLike.race([PromiseLike.resolve(1),2])).toBe(1)
        expect(await PromiseLike.race([PromiseLike.resolve(1).then(x => delay().then(x => 1)),2])).toBe(2)
    });
})
