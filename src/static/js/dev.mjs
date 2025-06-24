//@ts-check

import * as Faker from "./lib/faker.mjs";

import { Usuarios } from "./jsonf/usuarios.mjs";
import { Servicos } from "./jsonf/servicos.mjs";
import { Contratos } from "./jsonf/contratos.mjs";
import { Avaliacoes } from "./jsonf/avaliacoes.mjs";
import { Portfolios } from "./jsonf/portfolios.mjs";

const crudUsuarios = new Usuarios();
const crudServicos = new Servicos();
const crudContratos = new Contratos();
const crudAvaliacoes = new Avaliacoes();
const crudPortfolios = new Portfolios();

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 */
function setupUserCRUD() {
    let devCreateUsuariosN = document.getElementById("dev-create-usuarios-n");
    let devCreateUsuarios = document.getElementById("dev-create-usuarios");
    let devDeleteUsuariosAll = document.getElementById("dev-delete-usuarios-all");
    let devDeleteUsuariosId = document.getElementById("dev-delete-usuarios-id");
    let devDeleteUsuarios = document.getElementById("dev-delete-usuarios");
    let devReadUsuarios = document.getElementById("dev-read-usuarios");

    if (
        !(devCreateUsuariosN instanceof HTMLInputElement) ||
        !(devCreateUsuarios instanceof HTMLButtonElement) ||
        !(devDeleteUsuariosAll instanceof HTMLButtonElement) ||
        !(devDeleteUsuariosId instanceof HTMLInputElement) ||
        !(devDeleteUsuarios instanceof HTMLButtonElement) ||
        !(devReadUsuarios instanceof HTMLButtonElement)
    )
        return;

    devCreateUsuarios.addEventListener("click", () => {
        const quantidade = devCreateUsuariosN.value || "";
        // TODO: Check if more than $ALERT_QUANTITY
        Faker.criarNUsuarios(parseInt(quantidade, 10));
    });

    devDeleteUsuariosAll.addEventListener("click", crudUsuarios.limparUsuarios);

    devDeleteUsuarios.addEventListener("click", async () => {
        const id = devDeleteUsuariosId.value;
        if (await crudUsuarios.excluirUsuario(id)) {
            console.warn(`dev_delete_usuarios: usuário ${id} foi deletado!`);
        } else {
            console.error(
                `dev_delete_usuarios: Não foi possível encontrar o usuário ou ocorreu um erro.`,
            );
        }
    });

    devReadUsuarios.addEventListener("click", () =>
        // eslint-disable-next-line no-restricted-syntax
        crudUsuarios.lerUsuarios().then((usuarios) => console.log(usuarios)),
    );
}

function setupServicesCRUD() {
    let devCreateServicosN = document.getElementById("dev-create-servicos-n");
    let devCreateServicos = document.getElementById("dev-create-servicos");
    let devDeleteServicosAll = document.getElementById("dev-delete-servicos-all");
    let devDeleteServicosId = document.getElementById("dev-delete-servicos-id");
    let devDeleteServicos = document.getElementById("dev-delete-servicos");
    let devReadServicos = document.getElementById("dev-read-servicos");

    if (
        !(devCreateServicosN instanceof HTMLInputElement) ||
        !(devCreateServicos instanceof HTMLButtonElement) ||
        !(devDeleteServicosAll instanceof HTMLButtonElement) ||
        !(devDeleteServicosId instanceof HTMLInputElement) ||
        !(devDeleteServicos instanceof HTMLButtonElement) ||
        !(devReadServicos instanceof HTMLButtonElement)
    )
        return;

    devCreateServicos.addEventListener("click", () => {
        const quantidade = devCreateServicosN.value;
        // TODO: Adicionar opção no html (onlyFakeUsers)
        Faker.criarNServicos(parseInt(quantidade, 10), false);
    });

    devDeleteServicosAll.addEventListener("click", crudServicos.limparServicos);

    devDeleteServicos.addEventListener("click", async () => {
        const id = devDeleteServicosId.value;
        if (await crudServicos.excluirServico(id)) {
            console.warn(`dev_delete_servicos: serviço ${id} foi deletado!`);
        } else {
            console.error(
                `dev_delete_servicos: Não foi possível encontrar o serviço ou ocorreu um erro.`,
            );
        }
    });

    devReadServicos.addEventListener("click", () =>
        // eslint-disable-next-line no-restricted-syntax
        crudServicos.lerServicos().then((servicos) => console.log(servicos)),
    );
}

function setupContractsCRUD() {
    let devCreateContratosN = document.getElementById("dev-create-contratos-n");
    let devCreateContratos = document.getElementById("dev-create-contratos");
    let devDeleteContratosAll = document.getElementById("dev-delete-contratos-all");
    let devDeleteContratosId = document.getElementById("dev-delete-contratos-id");
    let devDeleteContratos = document.getElementById("dev-delete-contratos");
    let devReadContratos = document.getElementById("dev-read-contratos");

    if (
        !(devCreateContratosN instanceof HTMLInputElement) ||
        !(devCreateContratos instanceof HTMLButtonElement) ||
        !(devDeleteContratosAll instanceof HTMLButtonElement) ||
        !(devDeleteContratosId instanceof HTMLInputElement) ||
        !(devDeleteContratos instanceof HTMLButtonElement) ||
        !(devReadContratos instanceof HTMLButtonElement)
    )
        return;

    devCreateContratos.addEventListener("click", () => {
        const quantidade = devCreateContratosN.value;
        Faker.criarNContratos(parseInt(quantidade, 10));
    });

    devDeleteContratosAll.addEventListener("click", crudContratos.limparContratos);

    devDeleteContratos.addEventListener("click", async () => {
        const id = devDeleteContratosId.value;
        if (await crudContratos.excluirContrato(id)) {
            console.warn(`dev_delete_contratos: contrato ${id} foi deletado!`);
        } else {
            console.error(
                `dev_delete_contratos: Não foi possível encontrar o contrato ou ocorreu um erro.`,
            );
        }
    });

    devReadContratos.addEventListener("click", () =>
        // eslint-disable-next-line no-restricted-syntax
        crudContratos.lerContratos().then((contratos) => console.log(contratos)),
    );
}

function setupReviewsCRUD() {
    let devCreateAvaliacoesN = document.getElementById("dev-create-avaliacoes-n");
    let devCreateAvaliacoes = document.getElementById("dev-create-avaliacoes");
    let devDeleteAvaliacoesAll = document.getElementById("dev-delete-avaliacoes-all");
    let devDeleteAvaliacoesId = document.getElementById("dev-delete-avaliacoes-id");
    let devDeleteAvaliacoes = document.getElementById("dev-delete-avaliacoes");
    let devReadAvaliacoes = document.getElementById("dev-read-avaliacoes");

    if (
        !(devCreateAvaliacoesN instanceof HTMLInputElement) ||
        !(devCreateAvaliacoes instanceof HTMLButtonElement) ||
        !(devDeleteAvaliacoesAll instanceof HTMLButtonElement) ||
        !(devDeleteAvaliacoesId instanceof HTMLInputElement) ||
        !(devDeleteAvaliacoes instanceof HTMLButtonElement) ||
        !(devReadAvaliacoes instanceof HTMLButtonElement)
    )
        return;

    devCreateAvaliacoes.addEventListener("click", () => {
        const quantidade = devCreateAvaliacoesN.value;
        Faker.criarNAvaliacoes(parseInt(quantidade, 10));
    });

    devDeleteAvaliacoesAll.addEventListener("click", crudAvaliacoes.limparAvaliacoes);

    devDeleteAvaliacoes.addEventListener("click", async () => {
        const id = devDeleteAvaliacoesId.value;
        if (await crudAvaliacoes.excluirAvaliacao(id)) {
            console.warn(`dev_delete_avaliacoes: avaliação ${id} foi deletado!`);
        } else {
            console.error(
                `dev_delete_avaliacoes: Não foi possível encontrar a avaliação ou ocorreu um erro.`,
            );
        }
    });

    devReadAvaliacoes.addEventListener("click", () =>
        // eslint-disable-next-line no-restricted-syntax
        crudAvaliacoes.lerAvaliacoes().then((avaliacoes) => console.log(avaliacoes)),
    );
}

function setupPortfolioCRUD() {
    let devCreatePortfoliosN = document.getElementById("dev-create-portfolios-n");
    let devCreatePortfolios = document.getElementById("dev-create-portfolios");
    let devDeletePortfoliosAll = document.getElementById("dev-delete-portfolios-all");
    let devDeletePortfoliosId = document.getElementById("dev-delete-portfolios-id");
    let devDeletePortfolios = document.getElementById("dev-delete-portfolios");
    let devReadPortfolios = document.getElementById("dev-read-portfolios");

    if (
        !(devCreatePortfoliosN instanceof HTMLInputElement) ||
        !(devCreatePortfolios instanceof HTMLButtonElement) ||
        !(devDeletePortfoliosAll instanceof HTMLButtonElement) ||
        !(devDeletePortfoliosId instanceof HTMLInputElement) ||
        !(devDeletePortfolios instanceof HTMLButtonElement) ||
        !(devReadPortfolios instanceof HTMLButtonElement)
    )
        return;

    devCreatePortfolios.addEventListener("click", () => {
        const quantidade = devCreatePortfoliosN.value;
        Faker.criarNPortfolios(parseInt(quantidade, 10));
    });

    devDeletePortfoliosAll.addEventListener("click", crudPortfolios.limparPortfólio);

    devDeletePortfolios.addEventListener("click", async () => {
        const id = devDeletePortfoliosId.value;
        if (await crudPortfolios.excluirPortfolio(id)) {
            console.warn(`dev_delete_portfolios: portfolio ${id} foi deletado!`);
        } else {
            console.error(
                `dev_delete_portfolios: Não foi possível encontrar o portfolio ou ocorreu um erro.`,
            );
        }
    });

    devReadPortfolios.addEventListener("click", () =>
        // eslint-disable-next-line no-restricted-syntax
        crudPortfolios.lerPortfolios().then((portfolios) => console.log(portfolios)),
    );
}

function setupOtherCRUD() {
    let devOutrosClear = document.getElementById("dev-outros-clear");

    if (!(devOutrosClear instanceof HTMLButtonElement)) return;

    devOutrosClear.addEventListener("click", () => {
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
