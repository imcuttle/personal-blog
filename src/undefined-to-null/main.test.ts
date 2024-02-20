import * as nps from "path";
import undefinedToNull from "./index";


describe(nps.basename(__dirname), () => {
    it('case 1', function () {
        expect(undefinedToNull({"a": undefined, "b": 3})).toEqual({"a": null, "b": 3})
    });
    it('case 2', function () {
        expect(undefinedToNull({"a": undefined, "b": ["a", undefined]})).toEqual({"a": null,"b": ["a", null]})
    });
})
