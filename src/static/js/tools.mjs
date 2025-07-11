//@ts-check

import { assertBoolean, assertNumber } from "./lib/validate.mjs";

/**
 * Retorna um número aleatório, default: {min(0), max(10000)}
 *
 * O valor máximo não é inclusivo
 * @param {{min?: number, max?: number, double?: boolean}} [opts={}]
 * @returns {number} Retorna um número aleatório
 */
export function generateRandomNumber(opts = {}) {
    if (Object.hasOwn(opts, "min")) assertNumber(opts.min);
    if (Object.hasOwn(opts, "max")) assertNumber(opts.max);
    if (Object.hasOwn(opts, "double")) assertBoolean(opts.double);

    // opts.min(number): Limite mínimo do valor gerado (default: 0)
    let _min = opts.min || 0;
    // opts.max(number): Limite máximo do valor gerado (default: 10 000)
    let _max = opts.max || 10000;
    // opts.double(boolean): Retorna double como argumento
    const _double = opts.double || false;

    if (!_double) {
        _min = Math.floor(_min);
        _max = Math.floor(_max);
    }

    // TODO: Should this function return error?
    if (_min > _max) throw new Error("MIN is greatter than MAX!");

    const ret = Math.random() * (_max - _min) + _min;

    if (!_double) return Math.floor(ret);

    return ret;
}

/**
 * Verifica se o parametro é um número e retorna
 *
 * @param {any} value - O valor para verificar
 * @returns {number | null} - Retorna o número ou null se não foi possível confirmar que é um número
 */
export function ensureInteger(value) {
    if (typeof value === "number" && Number.isInteger(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
}

/**
 * Retorna true se o tipo do objeto passado como parametro é igual ao tipo desejado
 *
 * @param {any} value Objeto para comparação
 * @param {string} type Tipo para comparação
 *
 * @return {boolean}
 */
// TODO: Export to module and reuse
export function ensureType(value, type) {
    if (typeof type !== "string") return false;

    if (typeof value === "string" && type === "number") {
        let parse = parseInt(value, 10);
        if (typeof parse === "number") value = parse;
    }

    return typeof value === type;
}

export function isNonEmptyString(value) {
    return typeof value === "string" && value.length > 0;
}

/**
 * @param {any} value
 */
export function isNonNegativeInt(value) {
    return Number.isInteger(value) && value >= 0;
}

export function assertNonEmptyString(value) {
    if (typeof value !== "string") throw new Error("Value is not a string!");
    if (value.trim().length === 0) throw new Error("String is empty.");
}

// O json-server aceita ids númericas, mas caso não informado,
// a ID criada é composta por 4 digitos alfanúmericos (ex: "a1b2")
/**
 * @param {any} value
 * @param {{opcional?: boolean}} opts
 */
export function assertJSONServerID(value, opts = {}) {
    const opcional = typeof opts.opcional === "boolean" ? opts.opcional : false;
    if (!value) {
        if (!opcional) throw new Error("O valor da ID é nulo!");
        return;
    }
    if (typeof value !== "string" && typeof value !== "number")
        throw new Error("O ID não é uma string ou número!");

    if (typeof value === "string" && value.trim().length === 0)
        throw new Error("O valor da ID é nulo!");

    if (typeof value === "number" && value < 0) throw new Error("O valor da ID é inválido!");
}
