import createDeEncode from "./index";


describe('createDeEncode', () => {
    it('case 1', function () {
        const h = createDeEncode({
            table: ['🆘', '🌐'],
            sep: '_'
        });

        const t = h.encode('😍你好中国🇨🇳')
        console.log(t)
        expect(h.decode(t)).toBe('😍你好中国🇨🇳')
    });
})
