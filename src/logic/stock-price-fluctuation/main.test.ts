import * as nps from "path";
import StockPrice from "./index";
import { runCase } from "../../shared/test-shared";

describe(nps.basename(__dirname), () => {
  it("case 1", function () {
    expect(
      runCase(
        [
          "StockPrice",
          "update",
          "update",
          "current",
          "maximum",
          "update",
          "maximum",
          "update",
          "minimum",
        ],

        [[], [1, 10], [2, 5], [], [], [1, 3], [], [4, 2], []],
        {
          classes: { StockPrice },
        }
      )
    ).toEqual([null, null, null, 5, 10, null, 5, null, 2]);
  });
});
