const trimedDate = (date) => {
    const d = new Date(date);
    d.setMilliseconds(0);
    d.setSeconds(0);
    d.setMinutes(0);
    d.setHours(0);
    return d;
}

const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function* dateRangeGen(start, end, step) {
    const sd = trimedDate(start)
    const ed = trimedDate(end)

    if ((step >= 0 && sd.valueOf() <= ed.valueOf()) || (step < 0 && ed.valueOf() <= sd.valueOf())) {
        yield formatDate(sd)
        sd.setDate(sd.getDate() + step)
        yield* dateRangeGen(sd, ed, step)
    }
}
