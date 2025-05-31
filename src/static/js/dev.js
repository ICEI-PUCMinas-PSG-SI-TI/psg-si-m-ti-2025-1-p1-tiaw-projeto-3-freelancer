//@ts-check

import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios
import * as COMMON from "./common.mjs"; // Common Utilities
import * as DEV from "./dev_create.mjs"; // Common Utilities

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 */

function setupDevTools() {
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_usuarios_n = document.getElementById("dev-create-usuarios-n");
    let dev_create_usuarios = document.getElementById("dev-create-usuarios");
    let dev_delete_usuarios_all = document.getElementById("dev-delete-usuarios-all");
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_usuarios_id = document.getElementById("dev-delete-usuarios-id");
    let dev_delete_usuarios = document.getElementById("dev-delete-usuarios");
    let dev_read_usuarios = document.getElementById("dev-read-usuarios");

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_servicos_n = document.getElementById("dev-create-servicos-n");
    let dev_create_servicos = document.getElementById("dev-create-servicos");
    let dev_delete_servicos_all = document.getElementById("dev-delete-servicos-all");
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_servicos_id = document.getElementById("dev-delete-servicos-id");
    let dev_delete_servicos = document.getElementById("dev-delete-servicos");
    let dev_read_servicos = document.getElementById("dev-read-servicos");

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_contratos_n = document.getElementById("dev-create-contratos-n");
    let dev_create_contratos = document.getElementById("dev-create-contratos");
    let dev_delete_contratos_all = document.getElementById("dev-delete-contratos-all");
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_contratos_id = document.getElementById("dev-delete-contratos-id");
    let dev_delete_contratos = document.getElementById("dev-delete-contratos");
    let dev_read_contratos = document.getElementById("dev-read-contratos");

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_avaliacoes_n = document.getElementById("dev-create-avaliacoes-n");
    let dev_create_avaliacoes = document.getElementById("dev-create-avaliacoes");
    let dev_delete_avaliacoes_all = document.getElementById("dev-delete-avaliacoes-all");
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_avaliacoes_id = document.getElementById("dev-delete-avaliacoes-id");
    let dev_delete_avaliacoes = document.getElementById("dev-delete-avaliacoes");
    let dev_read_avaliacoes = document.getElementById("dev-read-avaliacoes");

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_portfolios_n = document.getElementById("dev-create-portfolios-n");
    let dev_create_portfolios = document.getElementById("dev-create-portfolios");
    let dev_delete_portfolios_all = document.getElementById("dev-delete-portfolios-all");
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_portfolios_id = document.getElementById("dev-delete-portfolios-id");
    let dev_delete_portfolios = document.getElementById("dev-delete-portfolios");
    let dev_read_portfolios = document.getElementById("dev-read-portfolios");

    let dev_outros_clear = document.getElementById("dev-outros-clear");

    // Usuários

    dev_create_usuarios?.addEventListener("click", async () => {
        const quantidade = dev_create_usuarios_n?.value;
        DEV.createUsuarios(quantidade);
    });

    dev_delete_usuarios_all?.addEventListener("click", JSONQL_U.clearUsuarios);

    dev_delete_usuarios?.addEventListener("click", () => {
        const id = dev_delete_usuarios_id?.value;
        const id_int = COMMON.ensureInteger(id);

        if (!id_int) {
            console.log("dev_delete_usuarios: Não foi possível realizar o parse do id");
            return;
        }

        if (JSONQL_U.deleteUsuario(id_int)) {
            console.log(`dev_delete_usuarios: usuário ${id_int} foi deletado!`);
        } else {
            console.log(
                `dev_delete_usuarios: Não foi possível encontrar o usuário ou ocorreu um erro.`
            );
        }
    });

    dev_read_usuarios?.addEventListener("click", () => console.log(JSONQL_U.readUsuarios()));

    // Serviços

    dev_create_servicos?.addEventListener("click", async () => {
        let quantidade = dev_create_servicos_n?.value;
        DEV.createServicos(quantidade);
    });

    dev_delete_servicos_all?.addEventListener("click", JSONQL_S.clearServicos);

    dev_delete_servicos?.addEventListener("click", () => {
        const id = dev_delete_servicos_id?.value;
        const id_int = COMMON.ensureInteger(id);
        if (!id_int) {
            console.log("dev_delete_servicos: Não foi possível realizar o parse do id");
            return;
        }

        if (JSONQL_S.deleteServicos(id_int)) {
            console.log(`dev_delete_servicos: serviço ${id_int} foi deletado!`);
        } else {
            console.log(
                `dev_delete_servicos: Não foi possível encontrar o serviço ou ocorreu um erro.`
            );
        }
    });

    dev_read_servicos?.addEventListener("click", () => console.log(JSONQL_S.readServicos()));

    // Contratos

    dev_create_contratos?.addEventListener("click", async () => {
        let quantidade = dev_create_contratos_n?.value;
        DEV.createContratos(quantidade);
    });

    dev_delete_contratos_all?.addEventListener("click", JSONQL_C.clearContratos);

    dev_delete_contratos?.addEventListener("click", () => {
        const id = dev_delete_contratos_id?.value;
        const id_int = COMMON.ensureInteger(id);
        if (!id_int) {
            console.log("dev_delete_contratos: Não foi possível realizar o parse do id");
            return;
        }

        if (JSONQL_C.deleteContrato(id_int)) {
            console.log(`dev_delete_contratos: contrato ${id_int} foi deletado!`);
        } else {
            console.log(
                `dev_delete_contratos: Não foi possível encontrar o contrato ou ocorreu um erro.`
            );
        }
    });

    dev_read_contratos?.addEventListener("click", () => console.log(JSONQL_C.readContratos()));

    // Avaliações

    dev_create_avaliacoes?.addEventListener("click", async () => {
        let quantidade = dev_create_avaliacoes_n?.value;
        DEV.createAvaliacoes(quantidade);
    });

    dev_delete_avaliacoes_all?.addEventListener("click", JSONQL_A.clearAvaliacoes);

    dev_delete_avaliacoes?.addEventListener("click", () => {
        const id = dev_delete_avaliacoes_id?.value;
        const id_int = COMMON.ensureInteger(id);
        if (!id_int) {
            console.log("dev_delete_avaliacoes: Não foi possível realizar o parse do id");
            return;
        }

        if (JSONQL_A.deleteAvaliacao(id_int)) {
            console.log(`dev_delete_avaliacoes: avaliação ${id_int} foi deletado!`);
        } else {
            console.log(
                `dev_delete_avaliacoes: Não foi possível encontrar a avaliação ou ocorreu um erro.`
            );
        }
    });

    dev_read_avaliacoes?.addEventListener("click", () => console.log(JSONQL_A.readAvaliacoes()));

    // Portfólio

    dev_create_portfolios?.addEventListener("click", async () => {
        let quantidade = dev_create_portfolios_n?.value;
        DEV.createPortfolios(quantidade);
    });

    dev_delete_portfolios_all?.addEventListener("click", JSONQL_P.clearPortfolios);

    dev_delete_portfolios?.addEventListener("click", () => {
        const id = dev_delete_portfolios_id?.value;
        const id_int = COMMON.ensureInteger(id);
        if (!id_int) {
            console.log("dev_delete_portfolios: Não foi possível realizar o parse do id");
            return;
        }

        if (JSONQL_P.deletePortfolio(id_int)) {
            console.log(`dev_delete_portfolios: portfolio ${id_int} foi deletado!`);
        } else {
            console.log(
                `dev_delete_portfolios: Não foi possível encontrar o portfolio ou ocorreu um erro.`
            );
        }
    });

    dev_read_portfolios?.addEventListener("click", () => console.log(JSONQL_P.readPortfolios()));

    // Outros

    dev_outros_clear?.addEventListener("click", () => {
        // Limpa todas as informações do localStorage
        localStorage.clear();
        // Recarrega a página
        location.reload();
    });
}

setupDevTools();
