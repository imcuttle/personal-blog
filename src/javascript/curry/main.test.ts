import * as nps from "path";
import main from "./index";


describe(nps.basename(__dirname), () => {
    it('case 1', function () {
        const fn = function sum(...args) { return args.reduce((a, b) => a + b); }
        const sum = main(fn);

        expect(sum()()(1,2,3) + 1).toBe(7)
        expect(sum()()(1,2,3)(4) + 2).toBe(12)
    });
})
