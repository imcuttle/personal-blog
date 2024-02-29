import * as nps from "path";
import main from "./index";
import bestTimeToBuyAndSellStockIi from "./index";


describe(nps.basename(__dirname), () => {
    it('case 1', function () {
        expect(bestTimeToBuyAndSellStockIi([7,1,5,3,6,4])).toBe(7)
        expect(bestTimeToBuyAndSellStockIi([1,2,3,4,5])).toBe(4)
        expect(bestTimeToBuyAndSellStockIi([7,6,4,3,1])).toBe(0)
    });
})
