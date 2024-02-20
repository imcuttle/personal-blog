function createDefer() {
  let reject;
  let resolve;
  const p = new Promise((_resolve, _reject) => {
    reject = _reject;
    resolve = _resolve;
  });
  return {
    p,
    resolve,
    reject,
  };
}

export default class QueryBatcher {
  protected _pendingTimer = null;
  protected _pendingEntities = [];

  constructor(private queryMultiple, private t) {}

  async getValue(key) {
    let queryPromise;
    if (this._pendingTimer == null) {
      queryPromise = Promise.resolve(this.queryMultiple([key])).then(
        (res) => res[0]
      );
      this._pendingTimer = setTimeout(async () => {
        this._pendingTimer = null;
        if (this._pendingEntities.length) {
          const _pendingEntities = this._pendingEntities.slice();
          this._pendingEntities = [];

          const defers = _pendingEntities.map((e) => e.defer);
          let res;
          try {
            res = await this.queryMultiple(_pendingEntities.map((e) => e.arg));
            res.forEach((val, i) => {
              defers[i].resolve(val);
            });
          } catch (err) {
            defers.forEach((def) => {
              def.reject(err);
            });
          }
        }
      }, this.t);
    } else {
      const entity = {
        defer: createDefer(),
        arg: key,
      };
      this._pendingEntities.push(entity);
      queryPromise = entity.defer.p;
    }

    return queryPromise;
  }
}
