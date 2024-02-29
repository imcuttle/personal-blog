const isPrimitive = (v) =>
  ["undefined", "boolean", "number", "symbol", "string"].includes(typeof v) ||
  v === null;

const shadowClone = (v) => {
  if (isPrimitive(v)) {
    return v;
  }
  if (Array.isArray(v)) {
    return v.slice();
  }
  return { ...v };
};

function createProxy(obj, { onMutate } = {}) {
  if (isPrimitive(obj)) {
    return obj;
  }

  let rtObj = obj;
  let mutated = false;
  const triggerMutate = () => {
    if (!mutated) {
      rtObj = shadowClone(obj);
      mutated = true;
      onMutate?.();
    }
  };

  const isArr = Array.isArray(obj);
  const cache = new WeakMap();
  const memoGetOrSet = (rawVal, getter) => {
    if (cache.has(rawVal)) {
      return cache.get(rawVal);
    }

    const res = getter();
    cache.set(rawVal, res);
    return res;
  };

  return {
    proxy: new Proxy(rtObj, {
      set: (t, p, v) => {
        if (rtObj[p] !== v) {
          triggerMutate();
        }
        return Reflect.set(rtObj, p, v);
      },
      get: (t, p) => {
        const rawVal = Reflect.get(rtObj, p);
        if (isPrimitive(rawVal)) {
          return rawVal;
        }
        if (isArr) {
          if (
            ["pop", "push", "unshift", "reverse", "sort", "splice"].includes(
              p as any
            )
          ) {
            return memoGetOrSet(
              rawVal,
              () =>
                new Proxy(rawVal, {
                  apply(t, handler, args) {
                    triggerMutate();
                    return rawVal.apply(rtObj, args);
                  },
                })
            );
          }
        }

        const proxyOfRawVal = memoGetOrSet(rawVal, () =>
          createProxy(rawVal, {
            onMutate: () => {
              Reflect.set(rtObj, p, proxyOfRawVal.getObj());
            },
          })
        );
        return proxyOfRawVal.proxy;
      },
      defineProperty(
        target: any,
        property: string | symbol,
        attributes: PropertyDescriptor
      ): boolean {
        triggerMutate();
        return Reflect.defineProperty(rtObj, property, attributes);
      },
    }),
    getObj: () => rtObj,
  };
}

export default class ImmutableHelper {
  constructor(private _obj) {}

  produce(mutator) {
    const proxyItem = createProxy(this._obj);
    mutator(proxyItem.proxy);
    return proxyItem.getObj();
  }
}
