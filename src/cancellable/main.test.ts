import * as nps from "path";
import cancellable from "./index";

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });

jest.useRealTimers();

describe(nps.basename(__dirname), () => {
  it("case 1", async function () {
    const [cancel, p] = cancellable(
      (function* () {
        let result = 0;
        try {
          yield new Promise((res) => setTimeout(res, 100));
          result += yield new Promise((res) => res(1));
          yield new Promise((res) => setTimeout(res, 100));
          result += yield new Promise((res) => res(1));
        } catch (e) {
          return result;
        }
        return result;
      })()
    );

    await delay(150);
    cancel();
    expect(await p).toBe(1);
  });
  it("case 2", async function () {
    const [cancel, p] = cancellable(
      (function* () {
        yield new Promise((res) => setTimeout(res, 200));
        return "Success";
      })()
    );

    await delay(100);
    cancel();
    await expect(p).rejects.toMatchInlineSnapshot(`"Cancelled"`);
  });

  it("case 3", async function () {
    const [cancel, p] = cancellable(
      (function* () {
        let result = 0;
        try {
          yield new Promise((res) => setTimeout(res, 200));
          result += yield new Promise((res) => res(1));
          yield new Promise((res) => setTimeout(res, 100));
          result += yield new Promise((res) => res(1));
        } catch (e) {
          return result;
        }
        return result;
      })()
    );

    await delay(150);
    cancel();
    expect(await p).toBe(0);
  });
});
