//@ts-check
import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios
import * as COMMON from "./common.mjs"; // Common Utilities

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 */


export async function createUsuarios(quantidade) {
    const quantidade_int = COMMON.ensureInteger(quantidade)
    if (!quantidade_int) {
        console.log("dev_create_usuarios: Não foi possível realizar o parse da quantidade");
        return
    }

    const usuarios = await COMMON.createNUsers(quantidade_int);
    usuarios.forEach((value) => JSONQL_U.createUsuario(value));
}

export async function createServicos(quantidade) {
    const quantidade_int = COMMON.ensureInteger(quantidade)
    if (!quantidade_int) {
        console.log("dev_create_servicos: Não foi possível realizar o parse da quantidade");
        return
    }
    let servicos = await COMMON.createNServicos(quantidade_int);
    servicos.forEach((value) => JSONQL_S.createServicos(value));
}

export async function createContratos(quantidade) {
    const quantidade_int = COMMON.ensureInteger(quantidade)
    if (!quantidade_int) {
        console.log("dev_create_contratos: Não foi possível realizar o parse da quantidade");
        return
    }
    let contratos = await COMMON.createNContratos(quantidade_int);
    contratos?.forEach((value) => JSONQL_C.createContrato(value));
}

export async function createAvaliacoes(quantidade) {
    const quantidade_int = COMMON.ensureInteger(quantidade)
    if (!quantidade_int) {
        console.log("dev_create_avaliacoes: Não foi possível realizar o parse da quantidade");
        return
    }
    let avaliacoes = await COMMON.createNAvaliacoes(quantidade_int);
    avaliacoes?.forEach((value) => JSONQL_A.createAvaliacao(value));
}

export async function createPortfolios(quantidade) {
    const quantidade_int = COMMON.ensureInteger(quantidade)
    if (!quantidade_int) {
        console.log("dev_create_portfolios: Não foi possível realizar o parse da quantidade");
        return
    }
    let portfolios = await COMMON.createNPortfolios(quantidade_int);
    portfolios?.forEach((value) => JSONQL_P.createPortfolio(value));
}