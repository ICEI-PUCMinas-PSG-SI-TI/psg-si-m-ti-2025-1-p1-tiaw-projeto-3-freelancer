//@ts-check

import { assertStringNonEmpty } from "../lib/validate.mjs";

/*
 * Esse script adiciona os recursos necessários para o CRUD de contratos
 *
 * Ferramentas para CRUD referentes aos [ CONTRATOS ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 */

const API_URL = "/contratos";

export class Contratos {
    // https://tenor.com/view/lazy-pat-down-gif-24710885
    assertObjetoContrato(contrato) {
        if (typeof contrato !== "object") throw new Error("Objeto é nulo!");
    }

    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<Array>}
     */
    lerContratos() {
        return fetch(API_URL, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     */
    lerContrato(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * Exclui as informações de um contrato utilizando a de (id), retorna uma Promessa do id
     * @param {string} id ID do contrato a ser atualizado
     * @returns {Promise<string>}
     */
    excluirContrato(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((response) => response.id);
    }

    /**
     * Atualiza as informações de um contrato, retorna uma Promessa com as informações atualizadas
     * @param {Object} contrato
     */
    atualizarContrato(contrato) {
        // TODO: validar as informações de contrato
        // Obs: Retornar erro, caso necessário
        this.assertObjetoContrato(contrato);

        return fetch(`${API_URL}/${contrato.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(contrato),
        }).then((response) => response.json());
    }

    /**
     * Cadastra um novo contrato
     * @param {Object} contrato Informações do contrato a ser cadastrado
     * @returns {Promise<Object>} Retorna o json do contrato se as informações foram cadastradas corretamente
     */
    criarContrato(contrato) {
        // TODO: Validar as informações do contrato
        // Obs: Retornar erro, caso necessário
        this.assertObjetoContrato(contrato);

        return fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(contrato),
        }).then((response) => response.json());
    }

    /**
     * Limpa todas as informações dos contrato
     */
    // TODO: Verificar melhor forma de excluir todos os dados não recursivamente
    limparContratos() {
        throw new Error("Função não implementada!");
    }
}
