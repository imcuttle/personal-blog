import * as nps from "path";
import throttleAdvanced from "./index";

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });

jest.useRealTimers();

describe(nps.basename(__dirname), () => {
  it("case 1", async function () {
    const fn = jest.fn(() => {});
    const throttled = throttleAdvanced(fn, 100);
    throttled(1);
    throttled(2);
    throttled(3);
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          1,
        ],
      ]
    `);
    await delay(100);
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          1,
        ],
        [
          3,
        ],
      ]
    `);

    throttled(2);
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          1,
        ],
        [
          3,
        ],
      ]
    `);
    throttled.cancel();
    await delay(100);

    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          1,
        ],
        [
          3,
        ],
      ]
    `);
  });
});
