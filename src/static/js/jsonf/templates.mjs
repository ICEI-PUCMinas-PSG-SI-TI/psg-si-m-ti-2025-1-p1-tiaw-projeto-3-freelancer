//@ts-check

/*
 * Esse script adiciona os recursos necessários para o CRUD de exemplos
 *
 * Ferramentas para CRUD referentes aos [ EXEMPLOS ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 */

const API_URL = "/templates";

export class TemplatesObject {
    /** @type {string[]} */
    avaliacoes = [];
    /** @type {string[]} */
    biografia = [];
    /** @type {string[]} */
    categoriasServicos = [];
    /** @type {string[]} */
    cidades = [];
    /** @type {string[]} */
    contatos = [];
    /** @type {string[]} */
    cpfCnpj = [];
    /** @type {string[]} */
    descricoes = [];
    /** @type {string[]} */
    email = [];
    /** @type {string[]} */
    linksExternos = [];
    /** @type {string[]} */
    nomes = [];
    /** @type {string[]} */
    sobrenomes = [];
    /** @type {string[]} */
    tipo = [];
}

export class Templates {
    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<TemplatesObject>}
     */
    lerTemplates() {
        return fetch(API_URL, {
            method: "GET",
        }).then((response) => response.json());
    }
}
