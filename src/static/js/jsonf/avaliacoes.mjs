//@ts-check

import { assertStringNonEmpty } from "../lib/validate.mjs";

/*
 * Esse script adiciona os recursos necessários para o CRUD de avaliações
 *
 * Ferramentas para CRUD referentes aos [ AVALIAÇÕES ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 */

const API_URL = "/avaliacoes";

export class Avaliacoes {
    // https://tenor.com/view/lazy-pat-down-gif-24710885
    assertObjetoAvaliacao(avaliacao) {
        if (typeof avaliacao !== "object") throw new Error("Objeto é nulo!");
    }

    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<Array>}
     */
    lerAvaliacoes() {
        return fetch(API_URL, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     */
    lerAvaliacao(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * Exclui as informações de um avaliacao utilizando a de (id), retorna uma Promessa do id
     * @param {string} id ID do avaliacao a ser atualizado
     * @returns {Promise<string>}
     */
    excluirAvaliacao(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((response) => response.id);
    }

    /**
     * Atualiza as informações de um avaliacao, retorna uma Promessa com as informações atualizadas
     * @param {Object} avaliacao
     */
    atualizarAvaliacao(avaliacao) {
        // TODO: validar as informações de avaliacao
        // Obs: Retornar erro, caso necessário
        this.assertObjetoAvaliacao(avaliacao);

        return fetch(`${API_URL}/${avaliacao.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(avaliacao),
        }).then((response) => response.json());
    }

    /**
     * Cadastra um novo avaliacao
     * @param {Object} avaliacao Informações do avaliacao a ser cadastrado
     * @returns {Promise<Object>} Retorna o json do avaliacao se as informações foram cadastradas corretamente
     */
    criarAvaliacao(avaliacao) {
        // TODO: Validar as informações do avaliacao
        // Obs: Retornar erro, caso necessário
        this.assertObjetoAvaliacao(avaliacao);

        return fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(avaliacao),
        }).then((response) => response.json());
    }

    /**
     * Limpa todas as informações dos avaliacoes
     */
    // TODO: Verificar melhor forma de excluir todos os dados não recursivamente
    limparAvaliacoes() {
        throw new Error("Função não implementada!");
    }
}
