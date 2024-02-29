import * as nps from "path";
import objDiff from "./index";


describe(nps.basename(__dirname), () => {
    it('case 1', function () {
        expect(objDiff({
            "a": 5,
            "v": 6,
            "z": [1, 2, 4, [2, 5, 7]]
        }, {
            "a": 5,
            "v": 7,
            "z": [1, 2, 3, [1]]
        })).toEqual({
            "v": [6, 7],
            "z": {
                "2": [4, 3],
                "3": {
                    "0": [2, 1]
                }
            }
        })
    });
})
