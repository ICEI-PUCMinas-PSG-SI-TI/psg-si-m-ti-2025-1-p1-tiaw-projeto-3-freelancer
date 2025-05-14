//@ts-check

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 * JavaScript Object Notation Query Language
 * 
 */

// Ferramentas para CRUD
// CRUD = Create, Read, Update, Delete
// CLAD = Criar, Ler, Atualizar, Deletar
// VEIA = Visualizar, Excluir, Incluir, Alterar

// const KEY_SERVICOS = "servicos";
// const KEY_USUARIOS = "usuarios"
// const KEY_AVALIACOES = "avaliacoes"
const KEY_CONTRATOS = "contratos" 
// const KEY_PORTFOLIOS = "portfolios" 

// const getServicos = () => JSON.parse(localStorage.getItem(KEY_SERVICOS) || "[]");
// const getUsuarios = () => JSON.parse(localStorage.getItem(KEY_USUARIOS) || "[]");
// const getAvaliacoes = () => JSON.parse(localStorage.getItem(KEY_AVALIACOES) || "[]");
const getContratos = () => JSON.parse(localStorage.getItem(KEY_CONTRATOS) || "[]");
// const getPortfolios = () => JSON.parse(localStorage.getItem(KEY_PORTFOLIOS) || "[]");

// const setServicos = (servicos) => localStorage.setItem(KEY_SERVICOS, JSON.stringify(servicos));
// const setUsuarios = (usuarios) => localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
// const setAvaliacoes = (avaliacoes) => localStorage.setItem(KEY_AVALIACOES, JSON.stringify(avaliacoes));
const setContratos = (contratos) => localStorage.setItem(KEY_CONTRATOS, JSON.stringify(contratos));
// const setPortfolios = (portfolios) => localStorage.setItem(KEY_PORTFOLIOS, JSON.stringify(portfolios));

// Struct de exemplo, pode ser clonada com Object.assign(source, destination)
const StructContratos = {
    id: 2, // number
    servicoId: 0, // number
    contratadoId: 0, // number
    contratanteId: 3, // number
    data: "1970-01-01T00:00:00.000Z-03:00", // string
    valor: 4896 // number
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

    if (!servicoId) {
        console.log("factoryContrato: servicoId não foi informado(a)");
        return null
    }

    if (!contratadoId) {
        console.log("factoryContrato: contratadoId não foi informado(a)");
        return null
    }

    if (!contratanteId) {
        console.log("factoryContrato: contratanteId não foi informado(a)");
        return null
    }

    if (!data) {
        console.log("factoryContrato: data não foi informado(a)");
        return null
    }

    if (!valor) {
        console.log("factoryContrato: valor não foi informado(a)");
        return null
    }

    let contrato = {};

    Object.assign(contrato, StructContratos)

    delete contrato.id;
    contrato.servicoId = servicoId;
    contrato.contratadoId = contratadoId;
    contrato.contratanteId = contratanteId;
    contrato.data = data;
    contrato.valor = valor;

    return validateContrato(contrato);
}

/**
 * Validação da struct de contrato
 * 
 * @param  {object} contrato Objeto com as informações do contrato
 * @returns {object|null} Se valido, retorna o objeto com as informações do contrato
 */
export function validateContrato(contrato) {
    // TODO: Check if is object

    // ID Opcional
    if (contrato.id && typeof (contrato.id) != "string") {
        console.log("validateContrato: id não é valido(a)")
        return null
    }

    if (typeof (contrato.servicoId) != "number") {
        console.log("validateContrato: contratadoId não é valido(a)")
        return null
    }

    if (typeof (contrato.contratadoId) != "number") {
        console.log("validateContrato: contratadoId não é valido(a)")
        return null
    }

    if (typeof (contrato.contratanteId) != "number") {
        console.log("validateContrato: contratanteId não é valido(a)")
        return null
    }

    if (typeof (contrato.data) != "string") {
        console.log("validateContrato: data não é valido(a)")
        return null
    }

    if (typeof (contrato.valor) != "number") {
        console.log("validateContrato: valor não é valido(a)")
        return null
    }

    return contrato
}

/**
 * Lê os contratos armazenados no local storage
 * 
 * @param  {Array} contratos_id Array com IDs dos contratos solicitados, retorna todos se vazio.
 * @returns {Array|null} Array com informações sobre os contratos
 */
export function readContratos(...contratos_id) {
    if (!contratos_id) {
        console.log("readContratos: nulo");
        return null
    }

    if (!Array.isArray(contratos_id)) {
        console.log("readContratos: não é um array");
        return null
    }

    let contratos = getContratos();

    // Se o valor for nulo, retorna todas as ids
    if (contratos_id.length === 0)
        return contratos

    let contratos_filter = [];

    for (let x = 0; x < contratos_id.length; x++) {
        let id = parseInt(contratos_id[x]);

        if (isNaN(id))
            return null

        for (let index = 0; index < contratos.length; index++) {
            const element = contratos[index];

            if (id === parseInt(element.id)) {
                contratos_filter.push(element);
                // Remove o contrato da lista original
                contratos.splice(index, 1);
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
    if (!contratos)
        return 0

    let last_id = 0;

    contratos.forEach((contrato) => {
        let id = parseInt(contrato.id);
        if (id > last_id) {
            last_id = id;
        }
    })

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
    if (!contrato_id)
        return null

    if (typeof (contrato_id) != "number")
        return null

    // Verifica se as informações do contrato são validas
    if (!validateContrato(contrato_new))
        return null

    let contratos = readContratos();

    if (!contratos)
        return null

    contratos.forEach((contrato, index, object) => {
        if (contrato_id === parseInt(contrato.id)) {
            // Remove o contrato da lista
            contratos.splice(index, 1);
            // Adiciona o contrato com as novas informações
            object.push(contrato_new);
        }
    })

    setContratos(contratos);

    return true;
}

/**
 * Deleta as informações de um contrato utilizando a ID
 *  
 * @param {Number} contrato_id ID do contrato a ser deletado
 * @returns {boolean | null} Retorna true se as informações foram encontradas e deletadas 
 */
export function deleteContrato(contrato_id) {
    // TODO: Receber array

    if (!contrato_id)
        return null

    if (typeof (contrato_id) != "number")
        return null

    let contratos = readContratos();

    if (!contratos)
        return null

    let encontrado = false;
    contratos.forEach((contrato, index) => {
        if (contrato_id === parseInt(contrato.id)) {
            // Remove o contrato da lista
            contratos.splice(index, 1);
            // TODO: break forEach
            encontrado = true;
        }
    })

    setContratos(contratos);

    return encontrado;
}

/**
 * Limpa todas as informações dos usuários do localStorage
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
        console.log("createContrato: Não há argumentos");
        return null
    }

    let contratos = readContratos();

    // Verifica se as informações do contrato são validas
    if (!validateContrato(contrato_new)) {
        console.log("createContrato: Não foi possível validar os argumentos");
        return null
    }

    if (!contratos)
        contratos = []

    contrato_new.id = getIdLastContrato()
    if (typeof (contrato_new.id) != "number")
        return null

    // Incrementa a ID
    contrato_new.id += 1;

    contratos.push(contrato_new);

    setContratos(contratos);

    return contrato_new.id;
}