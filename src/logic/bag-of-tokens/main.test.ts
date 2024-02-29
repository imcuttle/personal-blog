import * as nps from "path";
import bagOfTokens from "./index";

describe(nps.basename(__dirname), () => {
  it("case 1", function () {
    expect(bagOfTokens([100], 50)).toBe(0);
    expect(bagOfTokens([200, 100], 150)).toBe(1);
    expect(bagOfTokens([100, 200, 300, 400], 200)).toBe(2);
  });
  it("case 2", function () {
    expect(bagOfTokens([81,45,8], 32)).toBe(0);
  });
});
