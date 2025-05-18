//@ts-check

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 * 
 * Ferramentas para CRUD referentes aos [ PORTFÓLIOS ]
 * 
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 * 
 * JavaScript Object Notation Query Language
 * 
 */

const KEY_PORTFOLIOS = "portfolios"
const getPortfolios = () => JSON.parse(localStorage.getItem(KEY_PORTFOLIOS) || "[]");
const setPortfolios = (portfolios) => {
    try {
        localStorage.setItem(KEY_PORTFOLIOS, JSON.stringify(portfolios))
    } catch (err) {
        if (err instanceof DOMException) {
            alert("O limite de armazenamento do localStorage foi atingido!\n\nDelete alguma imagem antes de adicionar outra!\n\nEsse é um problema que utilizar o json-server irá resolver futuramente");
        } else throw err
    }
};


/**
 * Retorna null e imprime $value no console
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
 * Retorna true se o tipo do objeto passado como parâmetro é igual ao tipo desejado
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

    return typeof (value) === type;
}

/**
 * Cria um objeto de conteúdo da seção para o portfólio
 * 
 * @param {number} blob // URI do conteúdo (link, base64/imagem, ...)
 * @param {number} descricao // Descrição do conteúdo presente no blob
 * @returns {object|null} Se valido, retorna o objeto com as informações do portfolio
 */
export function factoryPortfolioSecoesContents(blob, descricao) {
    // Struct :: Portfólio -> Seções -> Contents
    function PortfolioSecoesContents(blob, descricao) {
        this.blob = blob
        this.descricao = descricao
    }

    const portfolioSecoesContents = new PortfolioSecoesContents(blob, descricao);
    return validatePortfolio(portfolioSecoesContents);
}

/**
 * Cria um seção de conteúdo para o portfólio
 * 
 * @param {string} nome // Nome da seção
 * @param {number} ordem // Ordem da seção no portfólio
 * @param {number} categoriaId // ID da categoria da seção
 * @param {Array} contents // Conteúdos da seção de acorodo com a categoria
 * @returns {object|null} Se valido, retorna o objeto com as informações do portfolio
 */
export function factoryPortfolioSecoes(nome, ordem, categoriaId, contents) {
    // Struct :: Portfólio -> Seções
    function PortfolioSecoes(nome, ordem, categoriaId, contents) {
        this.nome = nome
        this.ordem = ordem
        this.categoriaId = categoriaId
        this.contents = contents
    }

    const portfolioSecoes = new PortfolioSecoes(nome, ordem, categoriaId, contents);
    return validatePortfolio(portfolioSecoes);
}

/**
 * Cria um objeto com as informações do portfólio
 * 
 * @param {number} usuarioId // ID do usuário do portfólio
 * @param {Array} secoes // Seção de informações
 * 
 * @returns {object|null} Se valido, retorna o objeto com as informações do portfólio
 */
export function factoryPortfolio(usuarioId, secoes) {
    // Struct :: Portfólio
    function Portfolio(id, usuarioId, secoes) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.secoes = secoes;
    }

    const portfolio = new Portfolio(null, usuarioId, secoes);
    return validatePortfolio(portfolio);
}

/**
 * Validação da struct de portfolio
 * 
 * @param  {object} portfolio Objeto com as informações do portfolio
 * @returns {object|null} Se valido, retorna o objeto com as informações do portfolio
 */
// TODO: Check if is object
// TODO: Remove non valid values
export function validatePortfolio(portfolio) {

    // ID Opcional
    if (portfolio.id && !(ensureType(portfolio.id, "number") || ensureType(portfolio.id, "string"))) {
        return returnError("validatePortfolio: id não é valido(a)")
    }

    if (!ensureType(portfolio.usuarioId, "number")) {
        return returnError("validatePortfolio: usuarioId não é valido(a)")
    }

    // portfolio.secoes é opcional
    if (portfolio.secoes) {
        // !ensureType(portfolio.secoes, "object") &&
        if (!Array.isArray(portfolio.secoes))
            return null

        if (portfolio.secoes.length) {
            for (let index = 0; index < portfolio.secoes.length; index++) {
                const secao = portfolio.secoes[index];

                if (!ensureType(secao.categoriaId, "number")) {
                    return returnError("validatePortfolio: secao.categoriaId não é valido(a)")
                }

                if (!ensureType(secao.nome, "string")) {
                    return returnError("validatePortfolio: secao.nome não é valido(a)")
                }

                if (!ensureType(secao.ordem, "number")) {
                    return returnError("validatePortfolio: secao.ordem não é valido(a)")
                }

                // secao.contents é opcional
                if (secao.contents) {
                    if (!Array.isArray(secao.contents))
                        return null

                    if (secao.contents.length) {
                        for (let index = 0; index < secao.contents.length; index++) {
                            const content = secao.contents[index];

                            if (!ensureType(content.blob, "string")) {
                                return returnError("validatePortfolio: content.blob não é valido(a)")
                            }

                            if (!ensureType(content.descricao, "string")) {
                                return returnError("validatePortfolio: content.descricao não é valido(a)")
                            }
                        }
                    }
                }
            }
        }
    }

    return portfolio
}

/**
 * Lê os portfolios armazenados no local storage
 * 
 * @param  {Array} portfolios_id Array com IDs dos portfolios solicitados, retorna todos se vazio.
 * @returns {Array|null} Array com informações sobre os portfolios
 */
export function readPortfolios(...portfolios_id) {
    if (!portfolios_id) {
        return returnError("readPortfolios: nulo");
    }

    if (!Array.isArray(portfolios_id)) {
        return returnError("readPortfolios: não é um array");
    }

    let portfolios = getPortfolios();

    // Se o valor for nulo, retorna todas as ids
    if (portfolios_id.length === 0)
        return portfolios

    let portfolios_filter = [];

    for (let x = 0; x < portfolios_id.length; x++) {
        let id = parseInt(portfolios_id[x]);

        if (isNaN(id))
            return null

        for (let index = 0; index < portfolios.length; index++) {
            const element = portfolios[index];

            if (id === parseInt(element.id)) {
                portfolios_filter.push(element);
                // Remove o portfolio da lista original
                portfolios.splice(index, 1);
            }
        }
    }

    return portfolios_filter;
}

/**
 * Retorna a ID do último portfolio cadastrado
 * 
 * @returns {Number} ID do último portfolio cadastrado 
 */
export function getIdLastPortfolio() {
    let portfolios = readPortfolios();

    // Se não há portfolios cadastrados, retorna o valor 0
    if (!portfolios)
        return 0

    let last_id = 0;

    portfolios.forEach((portfolio) => {
        let id = parseInt(portfolio.id);
        if (id > last_id) {
            last_id = id;
        }
    })

    return last_id;
}

/**
 * Atualiza as informações de um portfolio utilizando a ID
 *  
 * @param {Number} portfolio_id ID do portfolio a ser atualizado 
 * @param {any} portfolio_new Informações do portfolio para ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram cadastradas corretamente 
 */
export function updatePortfolio(portfolio_id, portfolio_new) {
    // TODO: Create a validateId func
    // 1. check if number (accept string to number)
    // 2. ensure number > 0
    if (!ensureType(portfolio_id, "number"))
        return null

    if (portfolio_id < 1)
        return null

    // Verifica se as informações do portfolio são validas
    if (!validatePortfolio(portfolio_new))
        return null

    let portfolios = readPortfolios();

    if (!portfolios?.length)
        return false

    for (let index = 0; index < portfolios.length; index++) {
        const element = portfolios[index];
        if (portfolio_id === parseInt(element.id)) {
            // Remove o portfolio da lista
            portfolios.splice(index, 1);
            // Adiciona o portfolio com as novas informações, salva no localStorage, retorna true
            portfolios.push(portfolio_new);
            setPortfolios(portfolios);
            return true;
        }
    }

    return false;
}

/**
 * Deleta as informações de um portfolio utilizando a ID
 *  
 * @param {Number} portfolio_id ID do portfolio a ser deletado
 * @returns {boolean | null} Retorna true se as informações foram encontradas e deletadas 
 */
// TODO: Receber array
export function deletePortfolio(portfolio_id) {
    if (!ensureType(portfolio_id, "number"))
        return null

    if (portfolio_id < 1)
        return null

    let portfolios = readPortfolios();

    if (!portfolios?.length)
        return false

    for (let index = 0; index < portfolios.length; index++) {
        const element = portfolios[index];
        if (portfolio_id === parseInt(element.id, 10)) {
            // Remove o usuário da lista
            portfolios.splice(index, 1);
            // Após remover o portfolio, armazena a nova lista e retorna true
            setPortfolios(portfolios);
            return true;
        }
    }

    return false;
}

/**
 * Limpa todas as informações de portfolios do localStorage
 *  
 * @returns {void}
 */
export function clearPortfolios() {
    return setPortfolios([]);
}

/**
 * Cadastra um novo portfolio
 *  
 * @param {any} portfolio_new Informações do portfolio a ser cadastrado
 * @returns {Number | null} Retorna o ID do portfolio se as informações foram cadastradas corretamente 
 */
export function createPortfolio(portfolio_new) {
    if (!portfolio_new) {
        return returnError("createportfolio: Não há argumentos");
    }

    let portfolios = readPortfolios();

    // Verifica se as informações do portfolio são validas
    if (!validatePortfolio(portfolio_new)) {
        return returnError("createportfolio: Não foi possível validar os argumentos");
    }

    if (!portfolios)
        portfolios = []

    portfolio_new.id = getIdLastPortfolio()
    if (!ensureType(portfolio_new.id, "number"))
        return null

    // Incrementa a ID
    portfolio_new.id += 1;

    portfolios.push(portfolio_new);

    setPortfolios(portfolios);

    return portfolio_new.id;
}