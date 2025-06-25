//@ts-check

import { assertStringNonEmpty } from "../lib/validate.mjs";
// eslint-disable-next-line no-unused-vars
import { UsuarioObject } from "./usuarios.mjs";
// eslint-disable-next-line no-unused-vars
import { ContratoObject } from "./contratos.mjs";
// eslint-disable-next-line no-unused-vars
import { ServicoObject } from "./servicos.mjs";

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

export class AvaliacaoObject {
    /** @type {string|number|null} */
    id = null;
    /** @type {string|number|null} */
    contratoId = null;
    /** @type {string|number|null} */
    usuarioId = null;
    /** @type {number|null} */
    nota = null;
    /** @type {string|null} */
    comentario = null;
    /** @type {string|null} */
    imagem = null;
    /** @type {string|null} */
    data = null;
}

export class AvaliacaoObjectExpanded {
    /** @type {string|number|null} */
    id = null;
    /** @type {string|number|null} */
    servicoId = null;
    /** @type {string|number|null} */
    contratoId = null;
    /** @type {string|number|null} */
    usuarioId = null;
    /** @type {number|null} */
    nota = null;
    /** @type {string|null} */
    comentario = null;
    /** @type {string|null} */
    imagem = null;
    /** @type {string|null} */
    data = null;
    /** @type {UsuarioObject|null} */
    usuario = null;
    /** @type {ContratoObject|null} */
    contrato = null;
    /** @type {ServicoObject|null} */
    servico = null;
}

export class Avaliacoes {
    // https://tenor.com/view/lazy-pat-down-gif-24710885
    assertObjetoAvaliacao(avaliacao) {
        if (typeof avaliacao !== "object") throw new Error("Objeto é nulo!");
    }

    // TODO: paginate (_page) (_per_page)
    /**
     * @returns {Promise<AvaliacaoObjectExpanded[]>}
     */
    lerAvaliacoes() {
        return fetch(`${API_URL}?_embed=usuario&_embed=contrato&_embed=servico`, {
            method: "GET",
        }).then((response) => response.json());
    }

    /**
     * @param {string} id
     * @returns {Promise<AvaliacaoObjectExpanded>}
     */
    lerAvaliacao(id) {
        assertStringNonEmpty(id);
        return fetch(`${API_URL}/${id}?_embed=usuario&_embed=contrato&_embed=servico`, {
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
        return fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then((response) => response.json())
            .then((response) => response.id);
    }

    /**
     * Atualiza as informações de um avaliacao, retorna uma Promessa com as informações atualizadas
     * @param {AvaliacaoObject} avaliacao
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
