import * as nps from "path";
import jsonStringify from "./index";

const eq = (v) => {
  expect(jsonStringify(v)).toBe(JSON.stringify(v));
};

describe(nps.basename(__dirname), () => {
  it("case 1", function () {
    eq({});
    eq({ x: undefined });
    eq([{ x: undefined }, undefined]);
    eq('"sa\\bsds\\a"x"\'');
    eq({ z: 2, y: { ooo: 2 }, abcs: [1, 2, 3, 4] });

    const x = { z: 2, y: { ooo: 2 }, abcs: [1, 2, 3, 4] };
    x.x = x;
    expect(() => eq(x)).toThrowErrorMatchingInlineSnapshot(
      `"circular structure error"`
    );
  });
});
