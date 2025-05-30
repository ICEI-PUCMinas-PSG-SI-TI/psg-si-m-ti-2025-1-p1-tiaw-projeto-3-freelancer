//@ts-check

/**
 * Retorna um número aleatório entre 0 e max, o min é opcional
 * Valor máximo
 * @param {number} max Valor máximo
 * @param {number} [min] Valor mínimo (opcional = 0)
 *
 * @returns {number | null} Retorna um número aleatório
 */
// TODO: check types
export function generateRandomNumber(max, min) {
    if (min) {
        let val = Math.random() * (max - min) + min;
        // TODO: why convert to string? avoid IDE warning
        // Avoid double values
        return parseInt(val.toString(), 10);
    }

    if (!max) return 0;

    return Math.floor(Math.random() * max);
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
        let parse = parseInt(value);
        if (typeof parse === "number") value = parse;
    }

    return typeof value === type;
}
