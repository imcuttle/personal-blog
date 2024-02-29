import * as nps from "path";
import deepMerge from "./index";

describe(nps.basename(__dirname), () => {
  it("case 1", function () {
    expect(deepMerge({ a: 1, c: 3 }, { a: 2, b: 2 })).toMatchInlineSnapshot(`
      {
        "a": 2,
        "b": 2,
        "c": 3,
      }
    `);
  });

  it("case 2", function () {
    expect(deepMerge([{}, 2, 3], [[], 5])).toMatchInlineSnapshot(`
      [
        [],
        5,
        3,
      ]
    `);
  });

  it("case 3", function () {
    expect(
      deepMerge(
        { a: 1, b: { c: [1, [2, 7], 5], d: 2 } },
        { a: 1, b: { c: [6, [6], [9]], e: 3 } }
      )
    ).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": {
          "c": [
            6,
            [
              6,
              7,
            ],
            [
              9,
            ],
          ],
          "d": 2,
          "e": 3,
        },
      }
    `);
  });

  it("case 4", function () {
    expect(deepMerge(true, null)).toMatchInlineSnapshot(`null`);
  });
});
