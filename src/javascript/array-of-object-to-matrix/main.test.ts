import * as nps from "path";
import arrayOfObjectToMatrix from "./index";


describe(nps.basename(__dirname), () => {
    it('case 1', function () {
        expect(arrayOfObjectToMatrix([
            {"b": 1, "a": 2},
            {"b": 3, "a": 4}
        ])).toEqual([
            ["a", "b"],
            [2, 1],
            [4, 3]
        ])
        expect(arrayOfObjectToMatrix([
            {"a": 1, "b": 2},
            {"c": 3, "d": 4},
            {}
        ])).toEqual([
            ["a", "b", "c", "d"],
            [1, 2, "", ""],
            ["", "", 3, 4],
            ["", "", "", ""]
        ]);

        expect(arrayOfObjectToMatrix([
            {"a": {"b": 1, "c": 2}},
            {"a": {"b": 3, "d": 4}}
        ])).toEqual([
            ["a.b", "a.c", "a.d"],
            [1, 2, ""],
            [3, "", 4]
        ])
        expect(arrayOfObjectToMatrix([
            [{"a": null}],
            [{"b": true}],
            [{"c": "x"}]
        ])).toEqual([
            ["0.a", "0.b", "0.c"],
            [null, "", ""],
            ["", true, ""],
            ["", "", "x"]
        ])
        expect(arrayOfObjectToMatrix([
            {},
            {},
            {},
        ])).toEqual([
                [],
                [],
                [],
                []
            ])
    });
})
