const warned = {};
export default function warning(valid, component, message) {
    if (!valid && !warned[message]) {
        console.warn(`[wjc: ${component}] ${message}`);
    }
}
