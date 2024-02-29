
export function createElement(type, props, children) {
    return {
        $$typeof: type,
        props,
        children: children ? (Array.isArray(children) ? children : [children]) : [],
        type,
    }
}


export function useState() {}
export function useEffect() {}
