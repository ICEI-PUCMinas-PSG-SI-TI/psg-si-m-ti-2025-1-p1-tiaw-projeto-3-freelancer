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

const KEY_SERVICOS = "servicos";
// const KEY_USUARIOS = "usuarios"
// const KEY_AVALIACOES = "avaliacoes"
// const KEY_CONTRATOS = "contratos" 
// const KEY_PORTFOLIOS = "portfolios" 

const getServicos = () => JSON.parse(localStorage.getItem(KEY_SERVICOS) || "[]");
// const getUsuarios = () => JSON.parse(localStorage.getItem(KEY_USUARIOS) || "[]");
// const getAvaliacoes = () => JSON.parse(localStorage.getItem(KEY_AVALIACOES) || "[]");
// const getContratos = () => JSON.parse(localStorage.getItem(KEY_CONTRATOS) || "[]");
// const getPortfolios = () => JSON.parse(localStorage.getItem(KEY_PORTFOLIOS) || "[]");

const setServicos = (servicos) => localStorage.setItem(KEY_SERVICOS, JSON.stringify(servicos));
// const setUsuarios = (usuarios) => localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
// const setAvaliacoes = (avaliacoes) => localStorage.setItem(KEY_AVALIACOES, JSON.stringify(avaliacoes));
// const setContratos = (contratos) => localStorage.setItem(KEY_CONTRATOS, JSON.stringify(contratos));
// const setPortfolios = (portfolios) => localStorage.setItem(KEY_PORTFOLIOS, JSON.stringify(portfolios));

// Struct de exemplo, pode ser clonada com Object.assign(source, destination)
const StructServico = {
    id: 0,
    titulo: "null",
    categoriaId: 0,
    descricao: "null",
    contato: "null"
}

/**
 * Cria um objeto com as informações do serviço
 * 
 * @param {string} titulo Título do serviço 
 * @param {number} categoriaId ID da categoria do serviço 
 * @param {string} descricao Descrição do serviço 
 * @param {string} contato Descrição do serviço 
 * @returns {object|null} Se valido, retorna o objeto com as informações do serviço
 */
export function factoryServicos(titulo, categoriaId, descricao, contato, categoria) {

    if (!titulo) {
        console.log("factoryServicos: tiulo não foi informado");
        return null
    }

    if (!categoriaId && categoriaId != 0) {
        console.log("factoryServicos: categoriaId não foi informado");
        return null
    }

    // TODO: campo temporario, remover depois
    /*
    if (!categoria) {
        console.log("factoryServicos: categoria não foi informado");
        return null
    }
    */

    if (!descricao) {
        console.log("factoryServicos: descricao não foi informada");
        return null
    }

    if (!contato) {
        console.log("factoryServicos: contato não foi informada");
        return null
    }

    let servico = {};

    Object.assign(servico, StructServico)

    delete servico.id;
    servico.titulo = titulo;
    // TODO: campo temporario, remover depois
    servico.categoria = categoria;
    servico.categoriaId = categoriaId;
    servico.descricao = descricao;
    servico.contato = contato;

    return validateServicos(servico);
}

/**
 * Validação da struct dos serviços
 * 
 * @param {object} servico Objeto com as informações do serviço
 * @returns {object|null} Se valido, retorna o objeto com as informações do serviço
 */
export function validateServicos(servico) {
    // ID Opcional
    if (servico.id && typeof (servico.id) != "string") {
        console.log("validateServicos: id não é valido")
        return null
    }

    if (typeof (servico.titulo) != "string") {
        console.log("validateServicos: titulo não é valido")
        return null
    }

    // TODO: campo temporario, remover depois
    if (typeof (servico.categoria) != "string") {
        console.log("validateServicos: categoria não é valido")
        return null
    }

    if (typeof (servico.categoriaId) != "number") {
        console.log("validateServicos: categoriaId não é valido")
        return null
    }

    if (typeof (servico.descricao) != "string") {
        console.log("validateServicos: descricao não é valida")
        return null
    }

    if (typeof (servico.contato) != "string") {
        console.log("validateServicos: contato não é valido")
        return null
    }

    return servico
}

/**
 * Lê os serviços armazenados no local storage
 * 
 * @param  {...any} servicos_id Array com IDs dos serviços solicitados, retorna todos se vazio.
 * @returns {Array|null} Array com informações sobre os serviço
 */
export function readServicos(...servicos_id) {
    if (!servicos_id) {
        console.log("readServicos: nulo");
        return null
    }

    if (!Array.isArray(servicos_id)) {
        console.log("readServicos: não é um array");
        return null
    }

    let servicos = getServicos();

    // Se o valor for nulo, retorna todas as ids
    if (servicos_id.length === 0)
        return servicos

    let servicos_filter = [];

    for (let x = 0; x < servicos_id.length; x++) {
        let id = parseInt(servicos_id[x]);

        if (isNaN(id))
            return null

        for (let index = 0; index < servicos.length; index++) {
            const element = servicos[index];

            if (id === parseInt(element.id)) {
                servicos_filter.push(element);
                // Remove o servico da lista
                servicos.splice(index, 1);
            }
        }
    }

    return servicos_filter;
}

/**
 * Retorna a ID do último serviço cadastrado
 * 
 * @returns {Number} ID do último serviço cadastrado 
 */
export function getIdLastServico() {
    let servicos = readServicos();

    // Se não há serviços cadastrados, retorna o valor 0
    if (!servicos)
        return 0

    let last_id = 0;

    servicos.forEach((servico) => {
        let id = parseInt(servico.id);
        if (id > last_id) {
            last_id = id;
        }
    })

    return last_id;
}

/**
 * Atualiza as informações de um serviço utilizando a ID
 *  
 * @param {Number} servico_id ID do serviço a ser atualizado 
 * @param {any} servico_new Informações do serviço para ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram cadastradas corretamente 
 */
export function updateServicos(servico_id, servico_new) {
    if (!servico_id)
        return null

    if (typeof (servico_id) != "number")
        return null

    // Verifica se as informações no serviço são validas
    if (!validateServicos(servico_new))
        return null

    let servicos = readServicos();

    if (!servicos)
        return null

    servicos.forEach((servico, index, object) => {
        if (servico_id === parseInt(servico.id)) {
            // Remove o servico da lista
            servicos.splice(index, 1);
            // Adiciona o serviço com as novas informações
            object.push(servico_new);
        }
    })

    setServicos(servicos);

    return true;
}

/**
 * Deleta as informações de um serviço utilizando a ID
 *  
 * @param {Number} servico_id ID do serviço a ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram encontradas e deletadas 
 */
export function deleteServicos(servico_id) {
    // TODO: Receber array

    if (!servico_id)
        return null

    if (typeof (servico_id) != "number")
        return null

    let servicos = readServicos();

    if (!servicos)
        return null

    let encontrado = false;
    servicos.forEach((servico, index, object) => {
        if (servico_id === parseInt(servico.id)) {
            // Remove o servico da lista
            servicos.splice(index, 1);
            // TODO: break forEach
            encontrado = true;
        }
    })

    setServicos(servicos);

    return true;
}

/**
 * Limpa todas as informações dos serviços do localStorage
 *  
 * @returns {void}
 */
export function clearServicos() {
    return setServicos([]);
}

/**
 * Cadastra um novo serviço
 *  
 * @param {any} servico_new Informações do serviço a ser cadastrado
 * @returns {Number | null} Retorna o ID do serviço se as informações foram cadastradas corretamente 
 */
export function createServicos(servico_new) {
    if (!servico_new) {
        console.log("createServicos: Não há argumentos");
        return null
    }

    let servicos = readServicos();

    // Verifica se as informações no serviço são validas
    if (!validateServicos(servico_new)) {
        console.log("createServicos: Não foi possível validar os argumentos");
        return null
    }

    if (!servicos)
        servicos = []

    servico_new.id = getIdLastServico()
    if (typeof (servico_new.id) != "number")
        return null

    // Incrementa a ID
    servico_new.id += 1;

    servicos.push(servico_new);

    setServicos(servicos);

    return servico_new.id;
}