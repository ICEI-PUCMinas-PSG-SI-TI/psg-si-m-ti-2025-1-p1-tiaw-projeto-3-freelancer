//@ts-check

import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios
import * as Faker from "./lib/faker.mjs";
import { ensureInteger } from "./tools.mjs";

import { Usuarios } from "./jsonf/usuarios.mjs"; // Usuários
import { Servicos } from "./jsonf/servicos.mjs"; // Serviços

const crud_usuarios = new Usuarios();
const crud_servicos = new Servicos();

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 */
function setupUserCRUD() {
    let dev_create_usuarios_n = document.getElementById("dev-create-usuarios-n");
    let dev_create_usuarios = document.getElementById("dev-create-usuarios");
    let dev_delete_usuarios_all = document.getElementById("dev-delete-usuarios-all");
    let dev_delete_usuarios_id = document.getElementById("dev-delete-usuarios-id");
    let dev_delete_usuarios = document.getElementById("dev-delete-usuarios");
    let dev_read_usuarios = document.getElementById("dev-read-usuarios");

    if (
        !(dev_create_usuarios_n instanceof HTMLInputElement) ||
        !(dev_create_usuarios instanceof HTMLButtonElement) ||
        !(dev_delete_usuarios_all instanceof HTMLButtonElement) ||
        !(dev_delete_usuarios_id instanceof HTMLInputElement) ||
        !(dev_delete_usuarios instanceof HTMLButtonElement) ||
        !(dev_read_usuarios instanceof HTMLButtonElement)
    )
        return;

    dev_create_usuarios.addEventListener("click", async () => {
        const quantidade = dev_create_usuarios_n.value || "";
        // TODO: Check if more than $ALERT_QUANTITY
        Faker.criarNUsuarios(parseInt(quantidade));
    });

    dev_delete_usuarios_all.addEventListener("click", crud_usuarios.limparUsuarios);

    dev_delete_usuarios.addEventListener("click", async () => {
        const id = dev_delete_usuarios_id.value;
        if (await crud_usuarios.excluirUsuario(id)) {
            console.log(`dev_delete_usuarios: usuário ${id} foi deletado!`);
        } else {
            console.log(
                `dev_delete_usuarios: Não foi possível encontrar o usuário ou ocorreu um erro.`,
            );
        }
    });

    dev_read_usuarios.addEventListener("click", () =>
        crud_usuarios.lerUsuarios().then((_usuarios) => console.log(_usuarios)),
    );
}

function setupServicesCRUD() {
    let dev_create_servicos_n = document.getElementById("dev-create-servicos-n");
    let dev_create_servicos = document.getElementById("dev-create-servicos");
    let dev_delete_servicos_all = document.getElementById("dev-delete-servicos-all");
    let dev_delete_servicos_id = document.getElementById("dev-delete-servicos-id");
    let dev_delete_servicos = document.getElementById("dev-delete-servicos");
    let dev_read_servicos = document.getElementById("dev-read-servicos");

    if (
        !(dev_create_servicos_n instanceof HTMLInputElement) ||
        !(dev_create_servicos instanceof HTMLButtonElement) ||
        !(dev_delete_servicos_all instanceof HTMLButtonElement) ||
        !(dev_delete_servicos_id instanceof HTMLInputElement) ||
        !(dev_delete_servicos instanceof HTMLButtonElement) ||
        !(dev_read_servicos instanceof HTMLButtonElement)
    )
        return;

    dev_create_servicos.addEventListener("click", async () => {
        const quantidade = dev_create_servicos_n.value;
        // TODO: Adicionar opção no html (onlyFakeUsers)
        Faker.criarNServicos(parseInt(quantidade), false);
    });

    dev_delete_servicos_all.addEventListener("click", crud_servicos.limparServicos);

    dev_delete_servicos.addEventListener("click", async () => {
        const id = dev_delete_servicos_id.value;
        if (await crud_servicos.excluirServico(id)) {
            console.log(`dev_delete_servicos: serviço ${id} foi deletado!`);
        } else {
            console.log(
                `dev_delete_servicos: Não foi possível encontrar o serviço ou ocorreu um erro.`,
            );
        }
    });

    dev_read_servicos.addEventListener("click", () =>
        crud_servicos.lerServicos().then((_servicos) => console.log(_servicos)),
    );
}

function setupContractsCRUD() {
    let dev_create_contratos_n = document.getElementById("dev-create-contratos-n");
    let dev_create_contratos = document.getElementById("dev-create-contratos");
    let dev_delete_contratos_all = document.getElementById("dev-delete-contratos-all");
    let dev_delete_contratos_id = document.getElementById("dev-delete-contratos-id");
    let dev_delete_contratos = document.getElementById("dev-delete-contratos");
    let dev_read_contratos = document.getElementById("dev-read-contratos");

    if (
        !(dev_create_contratos_n instanceof HTMLInputElement) ||
        !(dev_create_contratos instanceof HTMLButtonElement) ||
        !(dev_delete_contratos_all instanceof HTMLButtonElement) ||
        !(dev_delete_contratos_id instanceof HTMLInputElement) ||
        !(dev_delete_contratos instanceof HTMLButtonElement) ||
        !(dev_read_contratos instanceof HTMLButtonElement)
    )
        return;

    dev_create_contratos.addEventListener("click", async () => {
        const quantidade = dev_create_contratos_n.value;
        Faker.criarNContratos(parseInt(quantidade));
    });

    dev_delete_contratos_all.addEventListener("click", JSONQL_C.clearContratos);

    dev_delete_contratos.addEventListener("click", () => {
        const id = dev_delete_contratos_id.value;
        const id_int = ensureInteger(id);
        if (!id_int) {
            console.log("dev_delete_contratos: Não foi possível realizar o parse do id");
            return;
        }

        if (JSONQL_C.deleteContrato(id_int)) {
            console.log(`dev_delete_contratos: contrato ${id_int} foi deletado!`);
        } else {
            console.log(
                `dev_delete_contratos: Não foi possível encontrar o contrato ou ocorreu um erro.`,
            );
        }
    });

    dev_read_contratos.addEventListener("click", () => console.log(JSONQL_C.readContratos()));
}

function setupReviewsCRUD() {
    let dev_create_avaliacoes_n = document.getElementById("dev-create-avaliacoes-n");
    let dev_create_avaliacoes = document.getElementById("dev-create-avaliacoes");
    let dev_delete_avaliacoes_all = document.getElementById("dev-delete-avaliacoes-all");
    let dev_delete_avaliacoes_id = document.getElementById("dev-delete-avaliacoes-id");
    let dev_delete_avaliacoes = document.getElementById("dev-delete-avaliacoes");
    let dev_read_avaliacoes = document.getElementById("dev-read-avaliacoes");

    if (
        !(dev_create_avaliacoes_n instanceof HTMLInputElement) ||
        !(dev_create_avaliacoes instanceof HTMLButtonElement) ||
        !(dev_delete_avaliacoes_all instanceof HTMLButtonElement) ||
        !(dev_delete_avaliacoes_id instanceof HTMLInputElement) ||
        !(dev_delete_avaliacoes instanceof HTMLButtonElement) ||
        !(dev_read_avaliacoes instanceof HTMLButtonElement)
    )
        return;

    dev_create_avaliacoes.addEventListener("click", async () => {
        const quantidade = dev_create_avaliacoes_n.value;
        Faker.criarNAvaliacoes(parseInt(quantidade));
    });

    dev_delete_avaliacoes_all.addEventListener("click", JSONQL_A.clearAvaliacoes);

    dev_delete_avaliacoes.addEventListener("click", () => {
        const id = dev_delete_avaliacoes_id.value;
        const id_int = ensureInteger(id);
        if (!id_int) {
            console.log("dev_delete_avaliacoes: Não foi possível realizar o parse do id");
            return;
        }

        if (JSONQL_A.deleteAvaliacao(id_int)) {
            console.log(`dev_delete_avaliacoes: avaliação ${id_int} foi deletado!`);
        } else {
            console.log(
                `dev_delete_avaliacoes: Não foi possível encontrar a avaliação ou ocorreu um erro.`,
            );
        }
    });

    dev_read_avaliacoes.addEventListener("click", () => console.log(JSONQL_A.readAvaliacoes()));
}

function setupPortfolioCRUD() {
    let dev_create_portfolios_n = document.getElementById("dev-create-portfolios-n");
    let dev_create_portfolios = document.getElementById("dev-create-portfolios");
    let dev_delete_portfolios_all = document.getElementById("dev-delete-portfolios-all");
    let dev_delete_portfolios_id = document.getElementById("dev-delete-portfolios-id");
    let dev_delete_portfolios = document.getElementById("dev-delete-portfolios");
    let dev_read_portfolios = document.getElementById("dev-read-portfolios");

    if (
        !(dev_create_portfolios_n instanceof HTMLInputElement) ||
        !(dev_create_portfolios instanceof HTMLButtonElement) ||
        !(dev_delete_portfolios_all instanceof HTMLButtonElement) ||
        !(dev_delete_portfolios_id instanceof HTMLInputElement) ||
        !(dev_delete_portfolios instanceof HTMLButtonElement) ||
        !(dev_read_portfolios instanceof HTMLButtonElement)
    )
        return;

    dev_create_portfolios.addEventListener("click", async () => {
        const quantidade = dev_create_portfolios_n.value;
        Faker.criarNPortfolios(parseInt(quantidade));
    });

    dev_delete_portfolios_all.addEventListener("click", JSONQL_P.clearPortfolios);

    dev_delete_portfolios.addEventListener("click", () => {
        const id = dev_delete_portfolios_id.value;
        const id_int = ensureInteger(id);
        if (!id_int) {
            console.log("dev_delete_portfolios: Não foi possível realizar o parse do id");
            return;
        }

        if (JSONQL_P.deletePortfolio(id_int)) {
            console.log(`dev_delete_portfolios: portfolio ${id_int} foi deletado!`);
        } else {
            console.log(
                `dev_delete_portfolios: Não foi possível encontrar o portfolio ou ocorreu um erro.`,
            );
        }
    });

    dev_read_portfolios.addEventListener("click", () => console.log(JSONQL_P.readPortfolios()));
}

function setupOtherCRUD() {
    let dev_outros_clear = document.getElementById("dev-outros-clear");

    if (!(dev_outros_clear instanceof HTMLButtonElement)) return;

    dev_outros_clear.addEventListener("click", () => {
        // Limpa todas as informações do localStorage
        localStorage.clear();
        // Recarrega a página
        location.reload();
    });
}

setupUserCRUD();
setupServicesCRUD();
setupContractsCRUD();
setupReviewsCRUD();
setupPortfolioCRUD();
setupOtherCRUD();
