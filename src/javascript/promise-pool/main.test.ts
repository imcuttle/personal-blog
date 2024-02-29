import * as nps from "path";
import promisePool from "./index";

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });

jest.useRealTimers();

const collectDuration = async (promise, greaterThanOrEqual) => {
    let s = Date.now()
    try {
        return await promise
    } finally {
        const duration = Date.now() - s;
        expect(duration).toBeGreaterThanOrEqual(greaterThanOrEqual)
        expect(duration).toBeLessThanOrEqual(greaterThanOrEqual + 100)
    }
}

describe(nps.basename(__dirname), () => {
  it("case 1", async function () {
    expect(
      await collectDuration(promisePool(
        [100, 100, 100].map(ms => delay.bind(null, ms)),
        1
      ), 300)
    ).toMatchInlineSnapshot(`
      [
        100,
        100,
        100,
      ]
    `);
  });
  it("case 2", async function () {
    expect(
      await collectDuration(promisePool(
        [100, 100, 100].map(ms => delay.bind(null, ms)),
        2
      ), 200)
    ).toMatchInlineSnapshot(`
      [
        100,
        100,
        100,
      ]
    `);
  });
  it("case 3", async function () {
    expect(
      await collectDuration(promisePool(
        [100, 100, 100].map(ms => delay.bind(null, ms)),
        4
      ), 100)
    ).toMatchInlineSnapshot(`
      [
        100,
        100,
        100,
      ]
    `);
  });
  it("case 4", async function () {
    expect(
      await collectDuration(promisePool(
        [100, 200, 100].map(ms => delay.bind(null, ms)),
        3
      ), 200)
    ).toMatchInlineSnapshot(`
      [
        100,
        200,
        100,
      ]
    `);
  });
});
