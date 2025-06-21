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
export function generateRandomNumberOld(max, min) {
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
 * @param {{min?, max?, double?, convert_string?}} [opts={}]
 * @returns {number | any} Retorna um número aleatório
 */
export function generateRandomNumber(opts = {}) {
    // opts.min(number): Limite mínimo do valor gerado (default: 0)
    let _min = opts.min || 0;
    // opts.max(number): Limite máximo do valor gerado (default: 10 000)
    let _max = opts.max || 10000;
    // opts.double(boolean): Retorna double como argumento
    const double = opts.double === true;

    if (typeof _min !== "number" || typeof _max !== "number")
        throw new Error("generateRandomNumber: Invalid Params");

    if(!double){
        _min = Math.floor(_min);
        _max = Math.floor(_max);
    }

    // TODO: Should this function return error?
    if (_max < _min) return;

    const ret = Math.random() * (_max - _min) + _min;

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
