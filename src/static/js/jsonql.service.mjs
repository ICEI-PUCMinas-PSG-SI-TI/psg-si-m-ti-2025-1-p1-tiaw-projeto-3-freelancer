//@ts-check

import { ensureType, isNonNegativeInt } from "./tools.mjs";

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 * Ferramentas para CRUD referentes aos [ SERVIÇOS ]
 *
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 *
 * JavaScript Object Notation Query Language
 *
 */

/**
 * Retorna null e printa o que estiver em value no console
 *
 * @param {string} value console.log(value)
 *
 * @return {null}
 */
// TODO: Export to module and reuse
function returnError(value) {
    if (typeof value === "string") console.log(value);

    return null;
}

// Cria um objeto com as informações do serviço
export class Servico {
    /**
     * @param {string | number | null} id
     * @param {string} titulo Título do serviço
     * @param {any} categoria Categoria do serviço
     * @param {any} categoriaId ID da categoria do serviço
     * @param {any} descricao Descrição do serviço
     * @param {any} contato Descrição do serviço
     * @param {any} imagem Imagem do serviço
     */
    constructor(id, titulo, categoria, categoriaId, descricao, contato, imagem) {
        if (id) this.id = id;
        this.titulo = titulo;
        // TODO: campo temporario, remover depois
        this.categoria = categoria;
        // TODO: Verificar se esse valor é uma string? Ex: "2", "59",...
        this.categoriaId = categoriaId;
        this.descricao = descricao;
        this.contato = contato;
        this.imagem = imagem;
    }
}

export class CRUDServicos {
    /**
     * Validação da struct dos serviços
     *
     * @param {object} servico Objeto com as informações do serviço
     * @returns {object|null} Se valido, retorna o objeto com as informações do serviço
     */
    validateServicos(servico) {
        // ID Opcional
        if (servico.id && !(ensureType(servico.id, "string") || ensureType(servico.id, "number"))) {
            return returnError("validateServicos: id não é valido");
        }

        if (!ensureType(servico.titulo, "string")) {
            return returnError("validateServicos: titulo não é valido");
        }

        // TODO: campo temporario para compatibilidade com o serviços.html, remover depois
        /*
        if (!ensureType(servico.categoria, "string")) {
            console.log("validateServicos: categoria não é valido")
            return null
        }
        */

        if (!ensureType(servico.categoriaId, "number")) {
            return returnError("validateServicos: categoriaId não é valido");
        }

        if (!ensureType(servico.descricao, "string")) {
            return returnError("validateServicos: descricao não é valida");
        }

        if (!ensureType(servico.contato, "string")) {
            return returnError("validateServicos: contato não é valido");
        }

        return servico;
    }

    /**
     * Lê os serviços armazenados, paginado
     * @param {{page?: number;per_page?: number;}} opts
     * @returns {Promise<Servico[] | null>}
     */
    // TODO: Alterar função para ler 1 objeto ou varios
    async lerServicos(opts = {}) {
        // 0 = all
        const _page = isNonNegativeInt(opts.page) ? opts.page : 1;
        // 0 = default(10)
        const _per_page = isNonNegativeInt(opts.per_page) ? opts.per_page : 10;

        return fetch(`/servicos?_page=${_page}&_per_page=${_per_page}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((res) => (Array.isArray(res) ? res : res.data ? res.data : null));
    }

    /**
     * @param {number | string?} id
     * @returns {Promise<Servico | null>}
     */
    async lerServico(id) {
        if (typeof id !== "number" && typeof id !== "string") return null;

        return fetch(`/servicos/${id}`, {
            method: "GET",
        }).then((res) => res.json());
    }

    /**
     * Atualiza as informações de um serviço, retorna uma Promessa com as informações atualizadas
     * @param {Servico} servico
     */
    async updateServico(servico) {
        if (!(servico instanceof Servico)) return null;
        if (!servico.id) return null;

        // Verifica se as informações do serviço são validas
        // if (!validateServico(servico)) return null;

        return fetch(`/servicos/${servico.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(servico),
        }).then((res) => res.json());
    }

    /**
     * Deleta as informações de um serviço utilizando a de (id), retorna uma Promessa do id
     * @param {string | number} id ID do serviço a ser atualizado
     */
    async excluirServico(id) {
        // id not always number
        if (typeof id !== "number" && typeof id !== "string") return null;
        if (typeof id === "string" && id.length === 0) return null;

        // returns the deleted json
        return fetch(`/servicos/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((res) => res.id);
    }

    /**
     * Limpa todas as informações dos serviços
     */
    // TODO: Verificar melhor forma de excluir todos os dados não recursivamente
    async limparServicos() {}

    /**
     * Cadastra um novo serviços
     * @param {Servico} servico Informações do serviços a ser cadastrado
     * @returns {Promise<Object|null>} Retorna o json do serviços se as informações foram cadastradas corretamente
     */
    async criarServico(servico) {
        if (!(servico instanceof Servico)) return null;

        // // Verifica se as informações no servico são validas
        // if (!validateServico(servico)) return null;

        // TODO: Verificar se id foi informado e recusar transação se id existe
        delete servico.id;

        return fetch("/servicos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(servico),
        }).then((res) => res.json());
    }
}
