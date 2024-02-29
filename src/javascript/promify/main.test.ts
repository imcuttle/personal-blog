import * as nps from "path";
import promify from "./index";

describe(nps.basename(__dirname), () => {
  it("case 1", async function () {
    expect(
      await promify((callback, a, b, c) => {
        return callback(a * b * c);
      })(1, 2, 3)
    ).toBe(6);
  });
  it("case 2", async function () {
    await expect(
      promify((callback, a, b, c) => {
        callback(a * b * c, "Promise Rejected");
      })(1, 2, 3)
    ).rejects.toMatchInlineSnapshot(`"Promise Rejected"`);
  });
});
