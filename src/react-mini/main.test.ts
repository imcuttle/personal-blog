import { createElement as h } from "./react";
import { render } from "./react-dom";

describe("react-mini", () => {
  it("case 1", function () {
    const handleClick = jest.fn(() => {});
    const vnode = h(
      "div",
      { id: "element", class: "two classes", on: { click: handleClick } },
      [
        h("span", { class: "text-class1" }, "This is black"),
        " and this is just normal text",
        h("a", { href: "/foo" }, "I'll take you places!"),
      ]
    );

    document.body.innerHTML = "";
    render(vnode, document.body);

    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<div id="element" class="two classes"><span class="text-class1">This is black</span> and this is just normal text<a href="/foo">I'll take you places!</a></div>"`
    );

    document.body.querySelector('#element').click();
    expect(handleClick).toBeCalled()
  });
});
