//@ts-check

import { assertStringNonEmpty } from "../lib/validate.mjs";

/*
 * Esse script adiciona os recursos necessários para o CRUD de usuários
 *
 * Ferramentas para CRUD referentes aos [ USUÁRIOS ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 */

const API_URL = "/usuarios";

export class Usuarios {
    // https://tenor.com/view/lazy-pat-down-gif-24710885
    assertObjetoUsuario(usuario) {
        if (typeof usuario !== "object") throw new Error("Objeto é nulo!");
    }

    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<Array>}
     */
    async lerUsuarios() {
        return fetch(API_URL, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     */
    async lerUsuario(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * Exclui as informações de um usuário utilizando a de (id), retorna uma Promessa do id
     * @param {string} id ID do usuário a ser atualizado
     * @returns {Promise<string>}
     */
    async excluirUsuario(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((response) => response.id);
    }

    /**
     * Atualiza as informações de um usuário, retorna uma Promessa com as informações atualizadas
     * @param {Object} usuario
     */
    async atualizarUsuario(usuario) {
        // TODO: validar as informações de usuário
        // Obs: Retornar erro, caso necessário
        this.assertObjetoUsuario(usuario);

        return fetch(`${API_URL}/${usuario.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(usuario),
        }).then((response) => response.json());
    }

    /**
     * Cadastra um novo usuário
     * @param {Object} usuario Informações do usuário a ser cadastrado
     * @returns {Promise<Object>} Retorna o json do usuário se as informações foram cadastradas corretamente
     */
    async criarUsuario(usuario) {
        // TODO: Validar as informações do usuário
        // Obs: Retornar erro, caso necessário
        this.assertObjetoUsuario(usuario);

        return fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(usuario),
        }).then((response) => response.json());
    }

    /**
     * Limpa todas as informações dos usuários
     */
    // TODO: Verificar melhor forma de excluir todos os dados não recursivamente
    async limparUsuarios() {
        throw new Error("Função não implementada!");
    }
}
