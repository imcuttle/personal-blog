import * as nps from "path";
import jsonDeepEq from "./index";


describe(nps.basename(__dirname), () => {
    it('case 1', function () {
        let o1 = {"x":1,"y":2}, o2 = {"x":1,"y":2}
        expect(jsonDeepEq(o1, o2)).toBeTruthy()
    });
    it('case 2', function () {
        let o1 = {"y":2,"x":1}, o2 = {"x":1,"y":2}
        expect(jsonDeepEq(o1, o2)).toBeTruthy()
    });

    it('case 3', function () {
        let o1 = {"x":null,"L":[1,2,3]}, o2 = {"x":null,"L":["1","2","3"]};
        expect(jsonDeepEq(o1, o2)).toBeFalsy()
    });
})
