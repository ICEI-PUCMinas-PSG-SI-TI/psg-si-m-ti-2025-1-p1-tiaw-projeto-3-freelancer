//@ts-check

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 * 
 * Ferramentas para CRUD referentes aos [ AVALIAÇÔES ]
 * 
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 * 
 * JavaScript Object Notation Query Language
 * 
 */

const KEY_AVALIACOES = "avaliacoes"
const getAvaliacoes = () => JSON.parse(localStorage.getItem(KEY_AVALIACOES) || "[]");
const setAvaliacoes = (avaliacoes) => {
    try {
        localStorage.setItem(KEY_AVALIACOES, JSON.stringify(avaliacoes))
    } catch (err) {
        if (err instanceof DOMException) {
            alert("O limite de armazenamento do localStorage foi atingido!\n\nDelete alguma imagem antes de adicionar outra!\n\nEsse é um problema que utilizar o json-server irá resolver futuramente");
        } else throw err
    }
};

/**
 * Retorna null e printa o que estiver em value no console
 * 
 * @param {string} value console.log(value)
 * 
 * @return {null} 
 */
// TODO: Export to module and reuse
function returnError(value) {
    if (typeof (value) === "string")
        console.log(value)

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
function ensureType(value, type) {
    if (typeof (type) !== "string")
        return false

    if (typeof (value) === "string" && type === "number") {
        let parse = parseInt(value)
        if (typeof (parse) === "number")
            value = parse
    }

    return typeof (value) === type;
}

/**
 * Cria um objeto com as informações da avaliação
 * 
 * @param {number} contratoId = ID do contrato que esta sendo avaliado
 * @param {number} contratanteId = ID do usuário que fez a avaliação
 * @param {number} nota = Nota que o usuário deu para o serviço
 * @param {string} comentario = Comentário realizado pelo usuário
 * @returns {object|null} Se valido, retorna o objeto com as informações da avaliação
 */
export function factoryAvaliacao(contratoId, contratanteId, nota, comentario) {
    // Struct :: Contrato
    function Avaliacao(id, contratoId, contratanteId, nota, comentario) {
        this.id = id;
        this.contratoId = contratoId;
        // this.usuarioId = contratanteId;
        this.contratanteId = contratanteId;
        this.nota = nota;
        this.comentario = comentario;
    }

    const avaliacao = new Avaliacao(null, contratoId, contratanteId, nota, comentario);
    return validateAvaliacao(avaliacao);
}

/**
 * Validação da struct de avaliação
 * 
 * @param  {object} avaliacao Objeto com as informações da avaliação
//  * @returns {object|null} Se valido, retorna o objeto com as informações da avaliação
 */
export function validateAvaliacao(avaliacao) {
    // TODO: Check if is object

    // ID Opcional
    if (avaliacao.id && !(ensureType(avaliacao.id, "number") || ensureType(avaliacao.id, "string"))) {
        return returnError("validateAvaliacao: id não é valido(a)")
    }

    if (!ensureType(avaliacao.contratoId, "number")) {
        return returnError("validateAvaliacao: contratoId não é valido(a)")
    }

    if (!ensureType(avaliacao.contratanteId, "number")) {
        return returnError("validateAvaliacao: contratanteId não é valido(a)")
    }

    if (!ensureType(avaliacao.nota, "number")) {
        return returnError("validateAvaliacao: nota não é valido(a)")
    }

    if (!ensureType(avaliacao.comentario, "string")) {
        return returnError("validateAvaliacao: comentario não é valido(a)")
    }

    return avaliacao
}

/**
 * Lê as avaliações armazenadas no local storage
 * 
 * @param  {Array} avaliacoes_id Array com IDs dos avaliações solicitados, retorna todas se vazio.
 * @returns {Array|null} Array com informações das avaliações
 */
export function readAvaliacoes(...avaliacoes_id) {
    if (!avaliacoes_id) {
        return returnError("readAvaliacoes: nulo");
    }

    if (!Array.isArray(avaliacoes_id)) {
        return returnError("readAvaliacoes: não é um array");
    }

    let avaliacoes = getAvaliacoes();

    // Se o valor for nulo, retorna todas as ids
    if (avaliacoes_id.length === 0)
        return avaliacoes

    let avaliacoes_filter = [];

    // TODO: Export to module and reuse
    for (let x = 0; x < avaliacoes_id.length; x++) {
        let id = parseInt(avaliacoes_id[x]);

        if (isNaN(id))
            return null

        for (let index = 0; index < avaliacoes.length; index++) {
            const element = avaliacoes[index];

            if (id === parseInt(element.id)) {
                avaliacoes_filter.push(element);
                // Remove a avaliação da lista original
                avaliacoes.splice(index, 1);
            }
        }
    }

    return avaliacoes_filter;
}

/**
 * Retorna a ID da última avaliação cadastrada
 * 
 * @returns {Number} ID do última avaliação cadastrada
 */
export function getIdLastAvaliacao() {
    let avaliacoes = readAvaliacoes();

    // Se não há avaliações cadastradas, retorna o valor 0
    if (!avaliacoes)
        return 0

    let last_id = 0;

    avaliacoes.forEach((avaliacao) => {
        let id = parseInt(avaliacao.id);
        if (id > last_id) {
            last_id = id;
        }
    })

    return last_id;
}

/**
 * Atualiza as informações de um avaliação utilizando a ID
 *  
 * @param {Number} avaliacao_id ID da avaliação a ser atualizado 
 * @param {any} avaliacoes_new Informações da avaliação para ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram cadastradas corretamente 
 */
export function updateAvaliacao(avaliacao_id, avaliacoes_new) {
    // TODO: Create a validateId func
    // 1. check if number (accept string to number)
    // 2. ensure number > 0
    if (!ensureType(avaliacao_id, "number"))
        return null

    if (avaliacao_id < 1)
        return null

    // Verifica se as informações da avaliação são validas
    if (!validateAvaliacao(avaliacoes_new))
        return null

    let avaliacoes = readAvaliacoes();

    if (!avaliacoes?.length)
        return false

    for (let index = 0; index < avaliacoes.length; index++) {
        const element = avaliacoes[index];
        if (avaliacao_id === parseInt(element.id)) {
            // Remove a avaliação da lista
            avaliacoes.splice(index, 1);
            // Adiciona a avaliação com as novas informações, salva no localStorage, retorna true
            avaliacoes.push(avaliacoes_new);
            setAvaliacoes(avaliacoes);
            return true;
        }
    }

    return false;
}

/**
 * Deleta as informações de uma avaliação utilizando a ID
 *  
 * @param {Number} avaliacao_id ID da avaliação a ser deletado
 * @returns {boolean | null} Retorna true se as informações foram encontradas e deletadas
 */
// TODO: Receber array
export function deleteAvaliacao(avaliacao_id) {
    if (!ensureType(avaliacao_id, "number"))
        return null

    if (avaliacao_id < 1)
        return null

    let avaliacoes = readAvaliacoes();

    if (!avaliacoes?.length)
        return false

    for (let index = 0; index < avaliacoes.length; index++) {
        const element = avaliacoes[index];
        if (avaliacao_id === parseInt(element.id, 10)) {
            // Remove a avaliação da lista
            avaliacoes.splice(index, 1);
            // Após remover a avaliação, armazena a nova lista e retorna true
            setAvaliacoes(avaliacoes);
            return true;
        }
    }

    return false;
}

/**
 * Limpa todas as informações de avaliações do localStorage
 *  
 * @returns {void}
 */
export function clearAvaliacoes() {
    return setAvaliacoes([]);
}

/**
 * Cadastra uma nova avaliação
 *  
 * @param {any} avaliacao_new Informações da avaliação a ser cadastrada
 * @returns {Number | null} Retorna o ID da avaliação se as informações foram cadastradas corretamente 
 */
export function createAvaliacao(avaliacao_new) {
    if (!avaliacao_new) {
        return returnError("createAvaliacao: Não há argumentos");
    }

    let avaliacoes = readAvaliacoes();

    // Verifica se as informações da avaliação são validas
    if (!validateAvaliacao(avaliacao_new)) {
        return returnError("createAvaliacao: Não foi possível validar os argumentos");
    }

    if (!avaliacoes)
        avaliacoes = []

    avaliacao_new.id = getIdLastAvaliacao()
    if (!ensureType(avaliacao_new.id, "number"))
        return null

    // Incrementa a ID
    avaliacao_new.id += 1;

    avaliacoes.push(avaliacao_new);

    setAvaliacoes(avaliacoes);

    return avaliacao_new.id;
}