//@ts-check

import { assertStringNonEmpty } from "../lib/validate.mjs";

/*
 * Esse script adiciona os recursos necessários para o CRUD de serviços
 *
 * Ferramentas para CRUD referentes aos [ SERVIÇOS ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 */

const API_URL = "/servicos";

export class Servicos {
    // https://tenor.com/view/lazy-pat-down-gif-24710885
    assertObjetoServico(servico) {
        if (typeof servico !== "object") throw new Error("Objeto é nulo!");
    }

    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<Array>}
     */
    lerServicos() {
        return fetch(API_URL, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     */
    lerServico(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * Exclui as informações de um serviço utilizando a de (id), retorna uma Promessa do id
     * @param {string} id ID do serviço a ser atualizado
     * @returns {Promise<string>}
     */
    excluirServico(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((response) => response.id);
    }

    /**
     * Atualiza as informações de um serviço, retorna uma Promessa com as informações atualizadas
     * @param {Object} servico
     */
    atualizarServico(servico) {
        // TODO: validar as informações de servico
        // Obs: Retornar erro, caso necessário
        this.assertObjetoServico(servico);

        return fetch(`${API_URL}/${servico.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(servico),
        }).then((response) => response.json());
    }

    /**
     * Cadastra um novo serviço
     * @param {Object} servico Informações do serviço a ser cadastrado
     * @returns {Promise<Object>} Retorna o json do serviço se as informações foram cadastradas corretamente
     */
    criarServico(servico) {
        // TODO: Validar as informações do serviço
        // Obs: Retornar erro, caso necessário
        this.assertObjetoServico(servico);

        return fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(servico),
        }).then((response) => response.json());
    }

    /**
     * Limpa todas as informações dos serviços
     */
    // TODO: Verificar melhor forma de excluir todos os dados não recursivamente
    limparServicos() {
        throw new Error("Função não implementada!");
    }
}
