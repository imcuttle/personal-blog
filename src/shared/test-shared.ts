export function runCase(
  cases: string[],
  argss: Array<any[]>,
  {
    classes,
  }: {
    classes: Record<string, Function>;
  }
) {
    let ctx = {
        $self: null,
        $returns: []
    }
    cases.forEach((name, i) => {
        const args = argss[i];
        if (Object.hasOwn(classes, name)) {
            ctx.$self = new classes[name](...args)
            ctx.$returns.push(null)
        } else {
            ctx.$returns.push(ctx.$self[name](...args) ?? null)
        }
    })
    return ctx.$returns
}
