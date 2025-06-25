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

export const NotFoundError = new Error("O usuário não existe!");

export class UsuarioObject {
    /** @type string|number|null */
    id = null;
    /** @type boolean? */
    ativo = null;
    /** @type string? */
    foto = null;
    /** @type string? */
    nome = null;
    /** @type string? */
    dataNascimento = null;
    /** @type string? */
    email = null;
    /** @type string? */
    senha = null;
    /** @type string? */
    tipo = null;
    /** @type string? */
    username = null;
    /** @type string? */
    cpfCnpj = null;
    /** @type string? */
    cidade = null;
    /** @type string? */
    biografia = null;
    /** @type string[]? */
    contatos = null;
    /** @type boolean? */
    formularioConcluido = null;
    /** @type string? */
    profissao = null;
    /** @type string? */
    sexo = null;
    /** @type string? */
    escolaridade = null;
    /** @type string? */
    dataCadastro = null;
    /** @type boolean? */
    fake = null;
}

export class Usuarios {
    // https://tenor.com/view/lazy-pat-down-gif-24710885
    assertObjetoUsuario(usuario) {
        if (typeof usuario !== "object") throw new Error("Objeto é nulo!");
    }

    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<UsuarioObject[]>}
     */
    lerUsuarios() {
        return fetch(API_URL, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * @param {string} id
     * @returns {Promise<UsuarioObject>}
     */
    lerUsuario(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, {
            method: "GET",
        }).then((response) => {
            if (response.ok) return response.json();
            else if (response.status === 404) throw NotFoundError;
            else
                throw new Error(
                    `Request não pode ser completada: ${response.status} - ${response.statusText}`,
                );
        });
    }

    /**
     * Exclui as informações de um usuário utilizando a de (id), retorna uma Promessa do id
     * @param {string} id ID do usuário a ser atualizado
     * @returns {Promise<string>}
     */
    excluirUsuario(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then((response) => response.json())
            .then((response) => response.id);
    }

    /**
     * Atualiza as informações de um usuário, retorna uma Promessa com as informações atualizadas
     * @param {UsuarioObject} usuario
     */
    atualizarUsuario(usuario) {
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
    criarUsuario(usuario) {
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
    limparUsuarios() {
        throw new Error("Função não implementada!");
    }
}
