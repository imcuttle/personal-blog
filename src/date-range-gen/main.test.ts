import * as nps from "path";
import dateRangeGen from "./index";

describe(nps.basename(__dirname), () => {
  it("case 1", function () {
    expect(Array.from(dateRangeGen("2023-04-01", "2023-04-04", 1)))
      .toMatchInlineSnapshot(`
      [
        "2023-04-01",
        "2023-04-02",
        "2023-04-03",
        "2023-04-04",
      ]
    `);

    expect(Array.from(dateRangeGen("2023-04-01", "2023-04-14", 3)))
      .toMatchInlineSnapshot(`
      [
        "2023-04-01",
        "2023-04-04",
        "2023-04-07",
        "2023-04-10",
        "2023-04-13",
      ]
    `);

    expect(Array.from(dateRangeGen("2023-04-01", "2023-03-14", -3)))
      .toMatchInlineSnapshot(`
      [
        "2023-04-01",
        "2023-03-29",
        "2023-03-26",
        "2023-03-23",
        "2023-03-20",
        "2023-03-17",
        "2023-03-14",
      ]
    `);
  });
});
