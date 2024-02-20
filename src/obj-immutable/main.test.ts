import * as nps from "path";
import objImmutable from "./index";

describe(nps.basename(__dirname), () => {
  it("case 1", function () {
    const obj = objImmutable({
      x: 5,
    });

    expect(() => {
      obj.x = 2;
    }).toThrowErrorMatchingInlineSnapshot(`"Error Modifying: x"`);

    expect(() => {
      Object.defineProperty(obj, "x", { value: 2 });
    }).toThrowErrorMatchingInlineSnapshot(`"Error Modifying: x"`);
  });
  it("case 2", function () {
    const obj = objImmutable([1, 2, 3]);

    expect(() => {
      obj.x = 2;
    }).toThrowErrorMatchingInlineSnapshot(`"Error Modifying: x"`);

    expect(() => {
      obj[2] = 3;
    }).toThrowErrorMatchingInlineSnapshot(`"Error Modifying Index: 2"`);
    expect(() => {
      obj[4] = 3;
    }).toThrowErrorMatchingInlineSnapshot(`"Error Modifying Index: 4"`);
  });
  it("case 3", function () {
    const obj = objImmutable({
      deep: [1, 2, { abc: {} }],
    });

    expect(() => {
      obj.deep = 2;
    }).toThrowErrorMatchingInlineSnapshot(`"Error Modifying: deep"`);

    expect(() => {
      obj.deep[2] = 3;
    }).toThrowErrorMatchingInlineSnapshot(`"Error Modifying Index: 2"`);
    expect(() => {
      obj.deep[2].abc = 3;
    }).toThrowErrorMatchingInlineSnapshot(`"Error Modifying: abc"`);
  });
  it("case 4", function () {
    const obj = objImmutable({
      deep: [1, 2, { abc: {} }],
    });

    expect(obj.deep.shift).toBe(obj.deep.shift);
    expect(() => {
      obj.deep.shift();
    }).toThrowErrorMatchingInlineSnapshot(`"Error Calling Method: shift"`);
  });
});
