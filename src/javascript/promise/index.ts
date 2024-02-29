import { EventEmitter } from 'node:events'

function catchErrorRun(fn, {reject, resolve}) {
    try {
        const p = fn();
        if (typeof p?.then === 'function') {
            p.then(val => resolve(val), err => reject(err))
            return;
        }
        resolve(p)
    } catch (err) {
        reject(err);
    }
}

export function getPromiseLikeStatus(p: PromiseLike) {
    return p._status
}
export function getPromiseLikeResult(p: PromiseLike) {
    return p._result
}

interface IPromiseLike {
    then(resolve, reject?): IPromiseLike
}

const nextTick = typeof process !== 'undefined' && typeof process.nextTick === 'function' ? process.nextTick : requestAnimationFrame

const isPromiseLike = p => typeof p?.then === 'function'

export default class PromiseLike {
    _status: 'pending' | 'resolved' | 'rejected' = 'pending'
    _result = undefined
    _emitter = new EventEmitter()

    static resolve = (v) => {
        return isPromiseLike(v) ? v : new PromiseLike(res => res(v))
    }
    static reject = (v) => {
        return new PromiseLike((res, rej) => rej(v))
    }

    static race = (ps: unknown[]) => {
        return new PromiseLike((resolve, reject) => {
            ps.forEach((p, i) => {
                PromiseLike.resolve(p).then(val => {
                    resolve(val);
                }, err => {
                    reject(err);
                })
            })
        })
    }
    static all = (ps: unknown[]) => {
        return new PromiseLike((resolve, reject) => {
            const values = [];
            let doneCount = 0;
            let failed = false
            ps.forEach((p, i) => {
                PromiseLike.resolve(p).then(val => {
                    if (failed || doneCount >= ps.length) {
                        return
                    }
                    doneCount++;
                    values[i] = val;
                    if (doneCount >= ps.length) {
                        resolve(values);
                    }
                }, err => {
                    failed = true;
                    reject(err);
                })
            })
        })
    }

    constructor(creator) {
        const _resolve = (v) => {
            if (typeof v?.then === 'function') {
                v.then(_resolve, _reject)
                return;
            }
            if (this._status === 'pending') {
                this._status = 'resolved';
                this._result = v;
                nextTick(() => {
                    this._emitter.emit('resolveNext', this._result);
                    this._emitter.emit('finallyNext');
                })
            }
        }
        const _reject = (v) => {
            if (typeof v?.then === 'function') {
                v.then(_reject, _reject)
                return;
            }
            if (this._status === 'pending') {
                this._status = 'rejected';
                this._result = v;
                nextTick(() => {
                    this._emitter.emit('rejectNext', this._result);
                    this._emitter.emit('finallyNext');
                })
            }
        }
        catchErrorRun(() => creator(_resolve, _reject), {reject: _reject, resolve: () => {}})
    }

    then(resolveNext, rejectNext?) {
        return new PromiseLike((resolve, reject) => {
            resolveNext && this._emitter.once('resolveNext', v => {
                catchErrorRun(() => resolveNext(v), {reject, resolve});
            })
            rejectNext && this._emitter.once('rejectNext', v => {
                catchErrorRun(() => rejectNext(v), {reject, resolve: reject});
            })
        })
    }
    finally(finallyNext) {
        return new PromiseLike((resolve, reject) => {
            finallyNext && this._emitter.once('finallyNext', () => {
                catchErrorRun(() => {
                    const p = finallyNext();
                    if (typeof p?.then === 'function') {
                        return p.then(() => this._result)
                    }
                    return this._result
                }, {reject, resolve});
            })
        })
    }
    catch(rejectNext) {
        return this.then(null, rejectNext)
    }
}
