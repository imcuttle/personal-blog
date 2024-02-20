export default function jsonParse(str, state = {
    prev: null,
    val: undefined,
    except: null
}) {
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (state.except != null && state.except !== ch) {
            throw new Error(`except ${state.except}, but ${ch}`);
        }
        // boolean
        if (ch === 't' && state.except == null) {
            state.except = 'r';
        } else if (ch === 'e') {

        }
        state.prev = ch;
    }
}
