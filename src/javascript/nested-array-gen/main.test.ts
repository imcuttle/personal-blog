import * as nps from "path";
import nestedArrayGen from "./index";

describe(nps.basename(__dirname), () => {
  it("case 1", function () {
    const generator = nestedArrayGen([[[6]], [1, 3], []]);
    expect(Array.from(generator)).toMatchInlineSnapshot(`
      [
        6,
        1,
        3,
      ]
    `);
  });
});
