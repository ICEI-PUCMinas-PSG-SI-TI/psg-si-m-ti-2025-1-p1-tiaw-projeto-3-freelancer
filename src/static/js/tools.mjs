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
 * Retorna um número aleatório entre 0 e max, o min é opcional
 * Valor máximo
 * @param {{min?, max?, double?, convert_string?, invalid?}} [opts={}]
 * @returns {number | any} Retorna um número aleatório
 */
export function generateRandomNumberOpts(opts = {}) {
    // opts.min(number): Limite mínimo do valor gerado (default: 0)
    // opts.max(number): Limite máximo do valor gerado (default: 10 000)
    // opts.double(boolean): Retorna double como argumento
    // opts.convert_string(boolean): Aceita string como argumento
    // opts.invalid
    const _min = opts.min || 0;
    const _max = opts.max || 10000;
    const double = typeof opts.double === "boolean" ? opts.double : false;
    const convert_string = typeof opts.convert_string === "boolean" ? opts.convert_string : true;
    const invalid = opts.invalid || null;

    let min =
        typeof _min === "number"
            ? double
                ? _min
                : Math.floor(_min)
            : typeof _min === "string" && convert_string
            ? double
                ? parseFloat(_min)
                : parseInt(_min)
            : null;

    let max =
        typeof _max === "number"
            ? double
                ? _max
                : Math.floor(_max)
            : typeof _max === "string" && convert_string
            ? double
                ? parseFloat(_max)
                : parseInt(_max)
            : null;

    if (typeof min !== "number" || typeof max !== "number" || max < min) return invalid;

    const ret = Math.random() * (max - min) + min;

    if (!double) return Math.floor(ret);

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
        let parse = parseInt(value);
        if (typeof parse === "number") value = parse;
    }

    return typeof value === type;
}

export const MAX_ALLOWED_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

/**
 * @param {Blob} file
 */
export async function imageFileToBase64(file) {
    const reader = new FileReader();

    if (file.size > MAX_ALLOWED_SIZE)
        throw new Error("O tamanho do arquivo deve ser menor que 5MB!");

    if (!file.type.match("image.*")) throw new Error("O arquivo não é uma imagem!");

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function isNonEmptyString(value) {
    return typeof value === "string" && value.length > 0;
}

const LUCRE_KEY = "LucreM";

// Função para alterar keys, isso garante que nenhuma aplicativo rodando e/ou
// salvando dados no localStorage/localStorage interfica nessa aplicação.
function lucreKey(key) {
    return `${LUCRE_KEY}.${key}`;
}

export function isUserLoggedIn() {
    return !!localStorage.getItem(lucreKey("id"));
}
