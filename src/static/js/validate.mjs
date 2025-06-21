//@ts-check

/**
 * @param {string} value
 */
export function assertStringNonEmpty(value) {
    if (typeof value !== "string") throw new Error("Value is not a string!");
    if (value.length < 1) throw new Error("String is empty!");
}
