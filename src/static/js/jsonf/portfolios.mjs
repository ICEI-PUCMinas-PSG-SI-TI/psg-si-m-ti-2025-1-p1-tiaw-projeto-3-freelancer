//@ts-check

import { assertStringNonEmpty } from "../lib/validate.mjs";

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

export class Portfolios {
    // https://tenor.com/view/lazy-pat-down-gif-24710885
    assertObjetoPortfolio(portfolio) {
        if (typeof portfolio !== "object") throw new Error("Objeto é nulo!");
    }

    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<Array>}
     */
    async lerPortfolios() {
        return fetch(API_URL, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     */
    async lerPortfolio(id) {
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
    async excluirPortfolio(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((response) => response.id);
    }

    /**
     * Atualiza as informações de um portfólio, retorna uma Promessa com as informações atualizadas
     * @param {Object} portfolio
     */
    async atualizarPortfolio(portfolio) {
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
    async criarPortfolio(portfolio) {
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
    async limparPortfólio() {
        throw new Error("Função não implementada!");
    }
}
