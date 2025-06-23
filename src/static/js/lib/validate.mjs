//@ts-check

export function assertStringNonEmpty(value) {
    if (typeof value !== "string") throw new Error("Value is not a string!");
    if (value.length < 1) throw new Error("String is empty!");
}

export function assertNumber(value) {
    if (typeof value !== "number" || Number.isNaN(value)) throw new Error("Value is not a number!");
}

export function assertBoolean(value) {
    if (typeof value !== "boolean") throw new Error("Value is not a boolean!");
}

export function assertPositiveInt(value) {
    assertNumber(value);
    if (value <= 0) throw new Error("Value is not positive!");
}
