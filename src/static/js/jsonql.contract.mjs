//@ts-check

import { ensureType } from "./tools.mjs";

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 * Ferramentas para CRUD referentes aos [ CONTRATOS ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 * JavaScript Object Notation Query Language
 *
 */

const KEY_CONTRATOS = "contratos";
const getContratos = () => JSON.parse(localStorage.getItem(KEY_CONTRATOS) || "[]");
const setContratos = (contratos) => {
    try {
        localStorage.setItem(KEY_CONTRATOS, JSON.stringify(contratos));
    } catch (err) {
        if (err instanceof DOMException) {
            alert(
                "O limite de armazenamento do localStorage foi atingido!\n\nDelete alguma imagem antes de adicionar outra!\n\nEsse é um problema que utilizar o json-server irá resolver futuramente"
            );
        } else throw err;
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
    if (typeof value === "string") console.log(value);

    return null;
}

/**
 * Cria um objeto com as informações do contrato
 *
 * @param {number} servicoId // ID do usuário que ofereceu o serviço
 * @param {number} contratadoId // ID do usuário que ofereceu o serviço
 * @param {number} contratanteId // ID do usuário que contratou o serviço
 * @param {string} data // Data do contrato do serviço
 * @param {number} valor // Valor combinado (int)
 * @returns {object|null} Se valido, retorna o objeto com as informações do contrato
 */
export function factoryContrato(servicoId, contratadoId, contratanteId, data, valor) {
    // Struct :: Contrato
    function Contrato(id, servicoId, contratadoId, contratanteId, data, valor) {
        this.id = id;
        this.servicoId = servicoId;
        this.contratadoId = contratadoId;
        this.contratanteId = contratanteId;
        this.data = data;
        this.valor = valor;
    }

    const contrato = new Contrato(null, servicoId, contratadoId, contratanteId, data, valor);
    return validateContrato(contrato);
}

/**
 * Validação da struct de contrato
 * 
 * @param  {object} contrato Objeto com as informações do contrato
//  * @returns {object|null} Se valido, retorna o objeto com as informações do contrato
 */
export function validateContrato(contrato) {
    // TODO: Check if is object

    // ID Opcional
    if (contrato.id && !(ensureType(contrato.id, "number") || ensureType(contrato.id, "string"))) {
        return returnError("validateContrato: id não é valido(a)");
    }

    if (!ensureType(contrato.servicoId, "number")) {
        return returnError("validateContrato: servicoId não é valido(a)");
    }

    if (!ensureType(contrato.contratadoId, "number")) {
        return returnError("validateContrato: contratadoId não é valido(a)");
    }

    if (!ensureType(contrato.contratanteId, "number")) {
        return returnError("validateContrato: contratanteId não é valido(a)");
    }

    if (!ensureType(contrato.data, "string")) {
        return returnError("validateContrato: data não é valido(a)");
    }

    if (!ensureType(contrato.valor, "number")) {
        return returnError("validateContrato: valor não é valido(a)");
    }

    return contrato;
}

/**
 * Lê os contratos armazenados no local storage
 *
 * @param  {Array} contratos_id Array com IDs dos contratos solicitados, retorna todos se vazio.
 * @returns {Array|null} Array com informações sobre os contratos
 */
export function readContratos(...contratos_id) {
    if (!Array.isArray(contratos_id)) {
        return returnError("readContratos: não é um array");
    }

    let contratos = getContratos();

    // Se o valor for nulo, retorna todas as ids
    if (contratos_id.length === 0) return contratos;

    let contratos_filter = [];

    for (let x = 0; x < contratos_id.length; x++) {
        let id = parseInt(contratos_id[x]);

        if (typeof id !== "number") return null;

        for (let index = 0; index < contratos.length; index++) {
            if (id === parseInt(contratos[index].id)) {
                // Remove o contrato da lista original e adiciona a lista filtrada
                contratos_filter.push(contratos.splice(index, 1));
            }
        }
    }

    return contratos_filter;
}

/**
 * Retorna a ID do último contrato cadastrado
 *
 * @returns {Number} ID do último contrato cadastrado
 */
export function getIdLastContrato() {
    let contratos = readContratos();

    // Se não há contratos cadastrados, retorna o valor 0
    if (!contratos) return 0;

    let last_id = 0;

    contratos.forEach((contrato) => {
        let id = parseInt(contrato.id);
        if (id > last_id) last_id = id;
    });

    return last_id;
}

/**
 * Atualiza as informações de um contrato utilizando a ID
 *
 * @param {Number} contrato_id ID do contrato a ser atualizado
 * @param {any} contrato_new Informações do contrato para ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram cadastradas corretamente
 */
export function updateContrato(contrato_id, contrato_new) {
    // TODO: Create a validateId func
    // 1. check if number (accept string to number)
    // 2. ensure number > 0
    if (!ensureType(contrato_id, "number")) return null;

    if (contrato_id < 1) return null;

    // Verifica se as informações do contrato são validas
    if (!validateContrato(contrato_new)) return null;

    let contratos = readContratos();

    if (!contratos?.length) return false;

    for (let index = 0; index < contratos.length; index++) {
        const element = contratos[index];
        if (contrato_id === parseInt(element.id)) {
            // Remove o contrato da lista
            contratos.splice(index, 1);
            // Adiciona o contrato com as novas informações, salva no localStorage, retorna true
            contratos.push(contrato_new);
            setContratos(contratos);
            return true;
        }
    }

    return false;
}

/**
 * Deleta as informações de um contrato utilizando a ID
 *
 * @param {Number} contrato_id ID do contrato a ser deletado
 * @returns {boolean | null} Retorna true se as informações foram encontradas e deletadas
 */
// TODO: Receber array
export function deleteContrato(contrato_id) {
    if (!ensureType(contrato_id, "number")) return null;

    if (contrato_id < 1) return null;

    let contratos = readContratos();

    if (!contratos?.length) return false;

    for (let index = 0; index < contratos.length; index++) {
        const element = contratos[index];
        if (contrato_id === parseInt(element.id, 10)) {
            // Remove o usuário da lista
            contratos.splice(index, 1);
            // Após remover o contrato, armazena a nova lista e retorna true
            setContratos(contratos);
            return true;
        }
    }

    return false;
}

/**
 * Limpa todas as informações de contratos do localStorage
 *
 * @returns {void}
 */
export function clearContratos() {
    return setContratos([]);
}

/**
 * Cadastra um novo contrato
 *
 * @param {any} contrato_new Informações do contrato a ser cadastrado
 * @returns {Number | null} Retorna o ID do contrato se as informações foram cadastradas corretamente
 */
export function createContrato(contrato_new) {
    if (!contrato_new) {
        return returnError("createContrato: Não há argumentos");
    }

    let contratos = readContratos();

    // Verifica se as informações do contrato são validas
    if (!validateContrato(contrato_new)) {
        return returnError("createContrato: Não foi possível validar os argumentos");
    }

    if (!contratos) contratos = [];

    contrato_new.id = getIdLastContrato();
    if (!ensureType(contrato_new.id, "number")) return null;

    // Incrementa a ID
    contrato_new.id += 1;

    contratos.push(contrato_new);

    setContratos(contratos);

    return contrato_new.id;
}
