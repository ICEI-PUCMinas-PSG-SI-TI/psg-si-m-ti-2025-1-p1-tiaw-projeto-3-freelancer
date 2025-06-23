//@ts-check

/**
 * @param {string} value
 */
export function assertStringNonEmpty(value) {
    if (typeof value !== "string") throw new Error("Value is not a string!");
    if (value.length < 1) throw new Error("String is empty!");
}

export function assertNumber(value) {
    if (typeof value !== "number") throw new Error("Value is not a number!");
    if (Number.isNaN(value)) throw new Error("Number is Nan!");
}

export function assertBoolean(value) {
    if (typeof value !== "boolean") throw new Error("Value is not a boolean!");
}
