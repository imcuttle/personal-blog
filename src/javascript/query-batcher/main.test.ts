import * as nps from "path";
import QueryBatcher from "./index";

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });

jest.useRealTimers();

function main({ queryMultiple, t, calls }) {
  const q = new QueryBatcher(queryMultiple, t);
  const s = Date.now();
  const ps = calls.map(async ({ key, time }) => {
    await delay(time);
    const v = await q.getValue(key);
    const d = Date.now() - s;
    return {
      resolved: v,
      time: d,
    };
  });
  return Promise.all(ps).then((list) => list.sort((a, b) => a.time - b.time));
}

describe(nps.basename(__dirname), () => {
  it("case 1", async function () {
    const queryMultiple = async function (keys) {
      return keys.map((key) => key + "!");
    };
    const t = 100;
    const calls = [
      { key: "a", time: 10 },
      { key: "b", time: 20 },
      { key: "c", time: 30 },
    ];
    const vals = await main({
      queryMultiple,
      t,
      calls,
    });
    expect(vals.map((v) => v.resolved)).toMatchInlineSnapshot(`
      [
        "a!",
        "b!",
        "c!",
      ]
    `);
    expect(vals[0].time).toBeGreaterThanOrEqual(10);
    expect(vals[0].time).toBeLessThan(20);

    expect(vals[1].time).toBe(vals[2].time);
    expect(vals[1].time).toBeGreaterThanOrEqual(110);
    expect(vals[1].time).toBeLessThan(120);
  });
  it("case 2", async function () {
    const queryMultiple = async function (keys) {
      await new Promise((res) => setTimeout(res, 100));
      return keys.map((key) => key + "!");
    };
    const t = 100;
    const calls = [
      { key: "a", time: 10 },
      { key: "b", time: 20 },
      { key: "c", time: 30 },
    ];
    const vals = await main({
      queryMultiple,
      t,
      calls,
    });
    expect(vals.map((v) => v.resolved)).toMatchInlineSnapshot(`
      [
        "a!",
        "b!",
        "c!",
      ]
    `);
    expect(vals[0].time).toBeGreaterThanOrEqual(110);
    expect(vals[0].time).toBeLessThan(120);

    expect(vals[1].time).toBe(vals[2].time);
    expect(vals[1].time).toBeGreaterThanOrEqual(210);
    expect(vals[1].time).toBeLessThan(220);
  });
  it("case 3", async function () {
    const queryMultiple = async function (keys) {
      await new Promise((res) => setTimeout(res, keys.length * 100));
      return keys.map((key) => key + "!");
    };
    const t = 100;
    const calls = [
      { key: "a", time: 10 },
      { key: "b", time: 20 },
      { key: "c", time: 30 },
      { key: "d", time: 40 },
      { key: "e", time: 250 },
      { key: "f", time: 300 },
    ];

    const vals = await main({
      queryMultiple,
      t,
      calls,
    });
    expect(vals.map((v) => v.resolved)).toMatchInlineSnapshot(`
      [
        "a!",
        "e!",
        "b!",
        "c!",
        "d!",
        "f!",
      ]
    `);
    expect(vals[0].time).toBeGreaterThanOrEqual(110);
    expect(vals[0].time).toBeLessThan(120);

    expect(vals[1].time).toBeGreaterThanOrEqual(350);
    expect(vals[1].time).toBeLessThan(360);

    expect(vals[2].time).toBe(vals[3].time);
    expect(vals[2].time).toBe(vals[4].time);
    expect(vals[2].time).toBeGreaterThanOrEqual(410);
    expect(vals[2].time).toBeLessThan(420);

    expect(vals[5].time).toBeGreaterThanOrEqual(450);
    expect(vals[5].time).toBeLessThan(460);
  });
});
