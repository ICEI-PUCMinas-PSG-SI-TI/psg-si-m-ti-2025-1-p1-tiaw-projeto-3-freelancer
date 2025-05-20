//@ts-check

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 * 
 * Ferramentas para CRUD referentes aos [ SERVIÇOS ]
 * 
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 * 
 * JavaScript Object Notation Query Language
 * 
 */

const KEY_SERVICOS = "servicos";
const getServicos = () => JSON.parse(localStorage.getItem(KEY_SERVICOS) || "[]");
const setServicos = (servicos) => {
    try {
        localStorage.setItem(KEY_SERVICOS, JSON.stringify(servicos))
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
 * Cria um objeto com as informações do serviço
 * 
 * @param {string} titulo Título do serviço 
 * @param {number} categoriaId ID da categoria do serviço 
 * @param {string} descricao Descrição do serviço 
 * @param {string} contato Descrição do serviço 
 * @returns {object|null} Se valido, retorna o objeto com as informações do serviço
 */
export function factoryServicos(titulo, categoriaId, descricao, contato, categoria) {
    // Struct :: Serviço
    function Servico(id, titulo, categoria, categoriaId, descricao, contato) {
        this.id = id;
        this.titulo = titulo;
        // TODO: campo temporario, remover depois
        this.categoria = categoria;
        // TODO: Verificar se esse valor é uma string? Ex: "2", "59",...
        this.categoriaId = categoriaId;
        this.descricao = descricao;
        this.contato = contato;
    }

    const servico = new Servico(null, titulo, categoriaId, descricao, contato, categoria);
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
    if (servico.id && !(ensureType(servico.id, "string") || ensureType(servico.id, "number"))) {
        return returnError("validateServicos: id não é valido")
    }

    if (!ensureType(servico.titulo, "string")) {
        return returnError("validateServicos: titulo não é valido")
    }

    // TODO: campo temporario para compatibilidade com o serviços.html, remover depois
    /*
    if (!ensureType(servico.categoria, "string")) {
        console.log("validateServicos: categoria não é valido")
        return null
    }
    */

    if (!ensureType(servico.categoriaId, "number")) {
        return returnError("validateServicos: categoriaId não é valido")
    }

    if (!ensureType(servico.descricao, "string")) {
        return returnError("validateServicos: descricao não é valida")
    }

    if (!ensureType(servico.contato, "string")) {
        return returnError("validateServicos: contato não é valido")
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
        return returnError("readServicos: nulo");
    }

    if (!Array.isArray(servicos_id)) {
        return returnError("readServicos: não é um array");
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
    if (!ensureType(servico_id, "number"))
        return null

    if (servico_id < 1)
        return null

    // Verifica se as informações no serviço são validas
    if (!validateServicos(servico_new))
        return null

    let servicos = readServicos();

    if (!servicos?.length)
        return false

    for (let index = 0; index < servicos.length; index++) {
        const element = servicos[index];
        if (servico_id === parseInt(element.id)) {
            // Remove o serviço da lista
            servicos.splice(index, 1);
            // Adiciona o serviço com as novas informações, salva no localStorage, retorna true
            servicos.push(servico_new);
            setServicos(servicos);
            return true;
        }
    }

    return false;
}

/**
 * Deleta as informações de um serviço utilizando a ID
 *  
 * @param {Number} servico_id ID do serviço a ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram encontradas e deletadas 
 */
// TODO: Receber array
export function deleteServicos(servico_id) {
    if (!ensureType(servico_id, "number"))
        return null

    if (servico_id < 1)
        return null

    let servicos = readServicos();

    if (!servicos?.length)
        return false

    for (let index = 0; index < servicos.length; index++) {
        const element = servicos[index];
        if (servico_id === parseInt(element.id, 10)) {
            // Remove o serviço da lista
            servicos.splice(index, 1);
            // Após remover o serviço, armazena a nova lista e retorna true
            setServicos(servicos);
            return true;
        }
    }

    return false;
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
        return returnError("createServicos: Não há argumentos");
    }

    let servicos = readServicos();

    // Verifica se as informações no serviço são validas
    if (!validateServicos(servico_new)) {
        return returnError("createServicos: Não foi possível validar os argumentos");
    }

    if (!servicos)
        servicos = []

    servico_new.id = getIdLastServico()
    if (!ensureType(servico_new.id, "number"))
        return null

    // Incrementa a ID
    servico_new.id += 1;

    servicos.push(servico_new);

    setServicos(servicos);

    return servico_new.id;
}