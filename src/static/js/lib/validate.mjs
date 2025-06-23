//@ts-check

/**
 * Verifica se um dado valor é uma string não vazia.
 * Lança um erro se o valor não for uma string ou se for uma string vazia.
 *
 * @param {string} value O valor a ser validado.
 * @throws {Error} Se o valor não for do tipo 'string'.
 * @throws {Error} Se a string for vazia.
 */
export function assertStringNonEmpty(value) {
    if (typeof value !== "string") throw new Error("Value is not a string!");
    if (value.length < 1) throw new Error("String is empty!");
}

/**
 * Verifica se um dado valor é um número válido.
 * Lança um erro se o valor não for do tipo 'number' ou se for 'NaN'.
 *
 * @param {any} value O valor a ser validado.
 * @throws {Error} Se o valor não for do tipo 'number' ou for 'NaN'.
 */
export function assertNumber(value) {
    if (typeof value !== "number" || Number.isNaN(value)) throw new Error("Value is not a number!");
}

/**
 * Verifica se um dado valor é um booleano.
 * Lança um erro se o valor não for do tipo 'boolean'.
 *
 * @param {any} value O valor a ser validado.
 * @throws {Error} Se o valor não for do tipo 'boolean'.
 */
export function assertBoolean(value) {
    if (typeof value !== "boolean") throw new Error("Value is not a boolean!");
}

/**
 * Verifica se um dado valor é um número inteiro positivo.
 * Lança um erro se o valor não for um número ou se for um número menor ou igual a zero.
 *
 * @param {number} value O valor a ser validado.
 * @throws {Error} Se o valor não for um número
 * @throws {Error} Se o valor for um número menor ou igual a zero.
 */
export function assertPositiveInt(value) {
    assertNumber(value);
    if (value <= 0) throw new Error("Value is not positive!");
}
