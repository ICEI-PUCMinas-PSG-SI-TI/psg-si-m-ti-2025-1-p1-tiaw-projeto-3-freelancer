//@ts-check

import { assertStringNonEmpty } from "../lib/validate.mjs";
// eslint-disable-next-line no-unused-vars
import { UsuarioObject } from "./usuarios.mjs";

/*
 * Esse script adiciona os recursos necessários para o CRUD de portfólio
 *
 * Ferramentas para CRUD referentes aos [ PORTFÓLIO ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 */

const API_URL = "/portfolios";

export class PortfolioObject {
    /** @type {string|number|null} */
    id = null;
    /** @type {string|number|null} */
    usuarioId = null;
    /** @type {PortfolioSecaoObject[]|null} */
    secoes = null;
}

export class PortfolioObjectExpanded {
    /** @type {string|number|null} */
    id = null;
    /** @type {string|number|null} */
    usuarioId = null;
    /** @type {PortfolioSecaoObject[]|null} */
    secoes = null;
    /** @type {UsuarioObject|null} */
    usuario = null;
}

export class PortfolioSecaoObject {
    /** @type {number|null} */
    ordem = null;
    /** @type {string|number|null} */
    portfolioCategoriaId = null;
    /** @type {string|null} */
    nome = null;
    /** @type {string|null} */
    descricao = null;
    /** @type {PortfolioSecaoContentsObject[]|null} */
    contents = null;
}

export class PortfolioSecaoContentsObject {
    /** @type {string|null} */
    blob = null;
    /** @type {string|null} */
    descricao = null;
}

export class Portfolios {
    // https://tenor.com/view/lazy-pat-down-gif-24710885
    assertObjetoPortfolio(portfolio) {
        if (typeof portfolio !== "object") throw new Error("Objeto é nulo!");
    }

    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<PortfolioObjectExpanded[]>}
     */
    lerPortfolios() {
        return fetch(API_URL, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * @param {string} id
     * @returns {Promise<PortfolioObjectExpanded>}
     */
    lerPortfolio(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * Exclui as informações de um portfólio utilizando a de (id), retorna uma Promessa do id
     * @param {string} id ID do portfólio a ser atualizado
     * @returns {Promise<string>}
     */
    excluirPortfolio(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then((response) => response.json())
            .then((response) => response.id);
    }

    /**
     * Atualiza as informações de um portfólio, retorna uma Promessa com as informações atualizadas
     * @param {PortfolioObject} portfolio
     */
    atualizarPortfolio(portfolio) {
        // TODO: validar as informações de portfólio
        // Obs: Retornar erro, caso necessário
        this.assertObjetoPortfolio(portfolio);

        return fetch(`${API_URL}/${portfolio.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(portfolio),
        }).then((response) => response.json());
    }

    /**
     * Cadastra um novo portfólio
     * @param {Object} portfolio Informações do portfólio a ser cadastrado
     * @returns {Promise<Object>} Retorna o json do portfólio se as informações foram cadastradas corretamente
     */
    criarPortfolio(portfolio) {
        // TODO: Validar as informações do portfólio
        // Obs: Retornar erro, caso necessário
        this.assertObjetoPortfolio(portfolio);

        return fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(portfolio),
        }).then((response) => response.json());
    }

    /**
     * Limpa todas as informações dos portfólios
     */
    // TODO: Verificar melhor forma de excluir todos os dados não recursivamente
    limparPortfólio() {
        throw new Error("Função não implementada!");
    }
}
