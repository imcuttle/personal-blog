import {vnodeSymbol} from "./shared";

function assetVnode(node) {
    if (!(node && node.$$typeof)) {
        throw new Error('node is invalid vnode')
    }
}

function vnodeToDom(vnode, opts) {
    const { document = global.document } = opts || {}
    if (vnode === null) {
        return vnode;
    }
    if (typeof vnode === 'string' || typeof vnode === 'number' || typeof vnode === 'boolean') {
        const tNode = document.createTextNode(String(vnode));
        tNode[vnodeSymbol] = {
            vnode,
            opts
        }
        return tNode;
    }

    assetVnode(vnode);
    const { type, children, props } = vnode;
    if (typeof type === 'function') {

    }

    const { on, ...attrs } = props || {}
    const dom = document.createElement(type);
    for (const [key, attrVal] of Object.entries(attrs)) {
        dom.setAttribute(key, attrVal)
    }

    const frag = document.createDocumentFragment()
    ;(children || []).forEach(child => {
        const node = vnodeToDom(child, opts)
        if (node) {
            frag.appendChild(node);
        }
    });
    dom.appendChild(frag);
    dom[vnodeSymbol] = {
        vnode,
        opts
    }
    return dom;
}

function bindEventListener(container: HTMLElement) {
    const dispatchEventHandler = (evt, ...args) => {
        const vnodeInfo = evt.target[vnodeSymbol]
        if (!vnodeInfo) {
            return;
        }
        const { vnode, opts } = vnodeInfo;
        const { props } = vnode
        const { on } = props || {}

        const handler = on?.[evt.type]
        if (handler) {
            handler(evt, ...args)
        }
    }
    const eventTypes = ['click']
    eventTypes.forEach(evt => container.addEventListener(evt, dispatchEventHandler, false))
    return () => {
        eventTypes.forEach(evt => container.removeEventListener(evt, dispatchEventHandler, false))
    }
}

export function render(element, container: HTMLElement) {
    const dom = vnodeToDom(element, { document: container.ownerDocument });
    if (dom) {
        container.appendChild(dom);
        return bindEventListener(container);
    }
    return () => {}
}
