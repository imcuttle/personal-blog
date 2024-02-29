
const weakMap = new WeakMap();
const proxy = (target, handler) => {
    if (weakMap.get(target)) {
        return weakMap.get(target)
    }
    const p = new Proxy(target, handler);
    weakMap.set(target, p);
    return p;
}

export default function objImmutable(obj, _parent?) {
    if (['undefined', 'boolean', 'string', 'number'].includes(typeof obj)) {
        return obj
    }
    if (!obj) {
        return obj;
    }

    const arrayMutableMethods = ['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    const isArray = Array.isArray(obj);

    return proxy(obj, {
        set(target: any, p: string | symbol, newValue: any, receiver: any): boolean {
            if (isArray && !isNaN(p as any)) {
                throw new Error(`Error Modifying Index: ${p}`)
            }
            throw new Error(`Error Modifying: ${p}`);
        },
        get(target: any, p: string | symbol, receiver: any): any {
            if (isArray) {
                if (arrayMutableMethods.includes(p as any)) {
                    return proxy(Reflect.get(target, p, receiver), {
                        apply(target: any, thisArg: any, argArray: any[]): any {
                            throw new Error(`Error Calling Method: ${p}`)
                        }
                    })
                }
            }
            return objImmutable(Reflect.get(target, p, receiver))
        },
        defineProperty(target: any, property: string | symbol, attributes: PropertyDescriptor): boolean {
            if (isArray && !isNaN(property as any)) {
                throw new Error(`Error Modifying Index: ${property}`)
            }
            throw new Error(`Error Modifying: ${property}`);
        }
    })
}
