import * as nps from "path";
import ImmutableHelper from "./index";

describe(nps.basename(__dirname), () => {
    it("case 1", function () {
        const originalObj = {x: 5};
        const helper = new ImmutableHelper(originalObj);
        const newObj = helper.produce((proxy) => {
            proxy.x = proxy.x + 1;
        });
        expect(originalObj).toEqual({x: 5});
        expect(newObj).toEqual({x: 6});
    });

    it("case 2", function () {
        const baseState = [
            {
                title: "Learn TypeScript",
                done: true,
            },
            {
                title: "Try Immer",
                done: false,
            },
        ];
        const helper = new ImmutableHelper(baseState);
        const nextState = helper.produce((draftState) => {
            draftState.push({title: "Tweet about it"});
            draftState[1].done = true;
        });
        expect(baseState).toEqual([
            {
                title: "Learn TypeScript",
                done: true,
            },
            {
                title: "Try Immer",
                done: false,
            },
        ]);
        expect(nextState === baseState).toEqual(false);
        expect(nextState[1] === baseState[1]).toEqual(false);
        expect(nextState[0] === baseState[0]).toEqual(true);
        expect(nextState).toMatchInlineSnapshot(`
      [
        {
          "done": true,
          "title": "Learn TypeScript",
        },
        {
          "done": true,
          "title": "Try Immer",
        },
        {
          "title": "Tweet about it",
        },
      ]
    `);
    });

    it("case 3", function () {
        const originalObj = {"val": 10};
        const helper = new ImmutableHelper(originalObj);
        const newObj = helper.produce(proxy => {
            proxy.val += 1;
        });
        const newObj2 = helper.produce(proxy => {
            proxy.val -= 1;
        });
        expect(newObj).toEqual({val: 11});
        expect(newObj2).toEqual({val: 9});
    });
    it("case 4", function () {
        const originalObj = {"arr": [1, 2, 3]};
        const helper = new ImmutableHelper(originalObj);
        const newObj = helper.produce(proxy => {
            proxy.arr[0] = 5;
            proxy.newVal = proxy.arr[0] + proxy.arr[1];
        });
        expect(newObj).toEqual(
            {"arr": [5, 2, 3], "newVal": 7}
        );
    });
});
