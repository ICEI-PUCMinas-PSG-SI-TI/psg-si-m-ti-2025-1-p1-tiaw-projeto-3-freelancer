//@ts-check

import { ensureType, isNonNegativeInt } from "./tools.mjs";

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 * Ferramentas para CRUD referentes aos [ USUÁRIOS ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 * JavaScript Object Notation Query Language
 *
 */

export class Usuario {
    constructor(
        id,
        ativo,
        nome,
        foto,
        data_nascimento,
        email,
        senha,
        tipo,
        cpf_cnpj,
        cidade,
        biografia,
        contatos
    ) {
        if (id) this.id = id;
        this.ativo = ativo;
        this.nome = nome;
        this.foto = foto;
        this.data_nascimento = data_nascimento;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
        this.cpf_cnpj = cpf_cnpj;
        this.cidade = cidade;
        this.biografia = biografia;
        this.contatos = contatos;
    }
}

export class CRUDUsuarios {
    /**
     * Validação da struct dos usuários
     *
     * @param  {object} usuario Objeto com as informações do usuários
     * @returns {object | null} Se valido, retorna o objeto com as informações do usuário
     */
    validateUsuario(usuario) {
        // TODO: Check if is object

        // ID Opcional
        if (usuario.id && !(ensureType(usuario.id, "number") || ensureType(usuario.id, "string"))) {
            console.log("validateUsuario: id não é valido(a)");
            return;
        }

        if (!ensureType(usuario.ativo, "boolean")) {
            console.log("validateUsuario: ativo não é valido(a)");
            return;
        }

        if (!ensureType(usuario.nome, "string")) {
            console.log("validateUsuario: nome não é valido(a)");
            return;
        }

        if (!ensureType(usuario.data_nascimento, "string")) {
            console.log("validateUsuario: data_nascimento não é valido(a)");
            return;
        }

        if (!ensureType(usuario.email, "string")) {
            console.log("validateUsuario: email não é valido(a)");
            return;
        }

        if (!ensureType(usuario.senha, "string")) {
            console.log("validateUsuario: senha não é valido(a)");
            return;
        }

        if (!ensureType(usuario.tipo, "string")) {
            console.log("validateUsuario: tipo não é valido(a)");
            return;
        }

        if (!ensureType(usuario.cpf_cnpj, "string")) {
            console.log("validateUsuario: cpf_cnpj não é valido(a)");
            return;
        }

        if (!ensureType(usuario.cidade, "string")) {
            console.log("validateUsuario: cidade não é valido(a)");
            return;
        }

        if (!ensureType(usuario.biografia, "string")) {
            console.log("validateUsuario: biografia não é valido(a)");
            return;
        }

        if (!ensureType(usuario.contatos, "object")) {
            console.log("validateUsuario: contatos não é valido(a)");
            return;
        }

        return usuario;
    }

    /**
     * Lê os usuários armazenados, paginado
     * @param {{page?: number;per_page?: number;}} opts
     * @returns {Promise<Object | null>}
     */
    // TODO: Alterar função para ler 1 objeto ou varios
    async lerUsuarios(opts = {}) {
        // 0 = all
        const _page = isNonNegativeInt(opts.page) ? opts.page : 1;
        // 0 = default(10)
        const _per_page = isNonNegativeInt(opts.per_page) ? opts.per_page : 10;

        return fetch(`/usuarios?_page=${_page}&_per_page=${_per_page}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((res) => (Array.isArray(res) ? res : res.data ? res.data : null));
    }

    /**
     * @param {number | string?} id
     * @returns {Promise<Object | null>}
     */
    async lerUsuario(id) {
        if (typeof id !== "number" && typeof id !== "string") return null;

        return fetch(`/usuarios/${id}`, {
            method: "GET",
        }).then((res) => res.json());
    }

    /**
     * Atualiza as informações de um usuário, retorna uma Promessa com as informações atualizadas
     * @param {Usuario} usuario
     */
    async updateUsuario(usuario) {
        if (!(usuario instanceof Usuario)) return null;
        if (!usuario.id) return null;

        // Verifica se as informações do usuário são validas
        // if (!validateUsuario(usuario)) return null;

        return fetch(`/usuarios/${usuario.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(usuario),
        }).then((res) => res.json());
    }

    /**
     * Deleta as informações de um usuário utilizando a de (id), retorna uma Promessa do id
     * @param {string | number} id ID do usuário a ser atualizado
     */
    async deleteUsuario(id) {
        // id not always number
        if (typeof id !== "number" && typeof id !== "string") return null;
        if (typeof id === "string" && id.length === 0) return null;

        // returns the deleted json
        return fetch(`/usuarios/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((res) => res.id);
    }

    /**
     * Limpa todas as informações dos usuários
     */
    // TODO: Verificar melhor forma de excluir todos os dados não recursivamente
    async clearUsuarios() {}

    /**
     * Cadastra um novo usuário
     * @param {Usuario} usuario Informações do usuário a ser cadastrado
     * @returns {Promise<Object|null>} Retorna o json do usuário se as informações foram cadastradas corretamente
     */
    async criarUsuario(usuario) {
        if (!(usuario instanceof Usuario)) return null;

        // // Verifica se as informações no usuário são validas
        // if (!validateUsuario(usuario)) return null;

        // TODO: Verificar se id foi informado e recusar transação se id existe
        delete usuario.id;

        return fetch("/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(usuario),
        }).then((res) => res.json());
    }
}
