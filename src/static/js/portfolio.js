import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios

/**
 * Retorna um número aleatório entre 0 e max, o min é opcional
 * Valor máximo
 * @param {number} max Valor máximo
 * @param {number} [min] Valor mínimo (opcional = 0)
 * 
 * @returns {number} Retorna um número aleatório
 */
// TODO: Move to a module
function genRandomNumber(max, min) {
    if (min) {
        let val = (Math.random() * (max - min) + min)
        // TODO: why convert to string? avoid IDE warning
        // Avoid double values
        return parseInt(val.toString(), 10);
    }

    if (!max)
        return 0;

    return Math.floor(Math.random() * max);
}

function getNota(userId) {
    // TODO: select * where userId = userId
    let media = 0;
    let avaliacoes = JSONQL_A.readAvaliacoes()
    if (avaliacoes.length) {
        let q = 0;
        avaliacoes.forEach((element) => {
            let contratoId = element.contratoId
            // TODO: Otimizar
            let contrato = JSONQL_C.readContratos(contratoId);
            if (!contrato) {
                console.log("setupPortfolioPage: Não foi possível identificar o contrato");
                return null
            }

            let contratado = contrato[0].contratadoId

            if (!contratado) {
                console.log("setupPortfolioPage: Não foi possível identificar o contratado");
                return null
            }

            if (contratado == userId) {
                media += element.nota;
                q++;
            }
        });
        if (q > 0) {
            media /= q;
        }
    }

    // Arredonda para 2 casas
    return Math.round(media * 100) / 100;
}

function setupPortfolioPage() {
    let portfolio = JSONQL_P.readPortfolios();
    if (!portfolio.length) {
        console.log("setupPortfolioPage: nenhum portfólio cadastrado!");
        return null
    }

    portfolio = portfolio[genRandomNumber(portfolio.length)]

    let user = portfolio.usuarioId
    if (!user) {
        console.log("setupPortfolioPage: no user");
        return null
    }

    user = JSONQL_U.readUsuarios(user)

    if (!user.length) {
        console.log("setupPortfolioPage: usuario não encontrado");
        return null
    }

    let nome = user[0].nome
    let id = user[0].id
    let biografia = user[0].biografia
    // TODO: adicionar contato e e-mail?

    // TODO: Se não preenchido na hora do cadastro?
    if (!nome || !id || !biografia) {
        console.log("setupPortfolioPage: não foi possível verificar alguma informação do usuário");
        return null
    }

    let portfolio_name = document.getElementById("portfolio-name")
    let portfolio_username = document.getElementById("portfolio-username")
    let portfolio_nota = document.getElementById("portfolio-nota")
    let portfolio_descricao = document.getElementById("portfolio-descricao")

    if (!portfolio_name || !portfolio_username || !portfolio_nota || !portfolio_descricao) {
        console.log("setupPortfolioPage: não foi possível atribuir o id");
        return null
    }

    portfolio_name.innerText = nome
    portfolio_username.innerText = `@${id}`
    portfolio_descricao.innerText = biografia

    let media = getNota(id);
    if (media) {
        portfolio_nota.innerText = media
    }

    let secoes = portfolio.secoes
    // TODO: O usuário pode não ter cadastrado nenhuma seção ainda
    if (!secoes.length) {
        console.log("setupPortfolioPage: sem seções");
        return null
    }

    secoes.forEach(element => {
        let secao_nome = element.nome
        let secao_ordem = element.ordem
        let secao_categoria = element.categoriaId
        // For categoriaId(0), content is optional
        let secao_content = element.contents

        if (
            !secao_nome ||
            (!secao_ordem && typeof (secao_ordem) !== "number") ||
            (!secao_categoria && typeof (secao_categoria) !== "number")
        ) {
            console.log(secao_nome);
            console.log(secao_ordem);
            console.log(secao_categoria);
            console.log(secao_content);
            console.log("setupPortfolioPage: algo na seção não foi encontrado!");
            return null
        }

        let portfolio_secoes = document.getElementById("portfolio-secoes");
        if (!portfolio_secoes) {
            console.log("no portfolio-secoes id find");
            return null
        }

        // TODO: Evitar que haja mais de um container de avaliação
        switch (secao_categoria) {
            // categoriaId(0): Avaliações
            case 0: {
                portfolio_secoes.innerHTML +=
                    `<!-- Container de Avaliações -->
                    <div class="card w-100 overflow-hidden p-0 g-0 g-0 mb-3">
                        <div class="card-header p-3 d-flex align-items-center justify-content-start">
                            <div>
                                <img class="icon-32px me-3 filter-star" src="static/icons/star.svg">
                            </div>
                            <div>
                                <h5 class="card-title">Avaliações</h5>
                                <h6 class="card-subtitle mb-0 pb-0 text-body-secondary">Clientes satisfeitos!</h6>
                            </div>
                            <div class="ms-auto">
                                <button class="button" type="button">
                                    <img class="icon-dark icon-16px" src="static/action-icons/edit.svg">
                                </button>
                                <button class="button" type="button">
                                    <img class="icon-dark icon-16px" src="static/action-icons/up.svg">
                                </button>
                                <button class="button" type="button">
                                    <img class="icon-dark icon-16px" src="static/action-icons/down.svg">
                                </button>
                                <button class="button" type="button">
                                    <img class="icon-dark icon-16px" src="static/action-icons/delete.svg">
                                </button>
                            </div>
                        </div>
                        <!-- Add icons to adjust positions -->
                        <div class="row py-3 m-0 g-0 w-100 scrool-container">
                            <div class="px-3">
                                <div class="d-inline-block float-none">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Special title treatment</h5>
                                            <p class="card-text">With supporting text below as a natural lead-in to
                                                additional
                                                content.
                                            </p>
                                            <a href="#" class="btn btn-primary">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-inline-block float-none">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Special title treatment</h5>
                                            <p class="card-text">With supporting text below as a natural lead-in to
                                                additional
                                                content.
                                            </p>
                                            <a href="#" class="btn btn-primary">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-inline-block float-none">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Special title treatment</h5>
                                            <p class="card-text">With supporting text below as a natural lead-in to
                                                additional
                                                content.
                                            </p>
                                            <a href="#" class="btn btn-primary">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-inline-block float-none">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Special title treatment</h5>
                                            <p class="card-text">With supporting text below as a natural lead-in to
                                                additional
                                                content.
                                            </p>
                                            <a href="#" class="btn btn-primary">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-inline-block float-none">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Special title treatment</h5>
                                            <p class="card-text">With supporting text below as a natural lead-in to
                                                additional
                                                content.
                                            </p>
                                            <a href="#" class="btn btn-primary">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                                <!-- TODO: Remover me-3 -->
                                <div class="d-inline-block float-none me-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Special title treatment</h5>
                                            <p class="card-text">With supporting text below as a natural lead-in to
                                                additional
                                                content.
                                            </p>
                                            <a href="#" class="btn btn-primary">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
            }
            break;
            // categoriaId(1): Fotos
            case 1: {
                portfolio_secoes.innerHTML +=
                    `<div class="card w-100 overflow-hidden p-0 g-0 g-0 mb-3">
                    <!-- Section Header -->
                    <div class="card-header p-3 d-flex align-items-center justify-content-start">
                        <div>
                            <!-- id.portfolio.secao.icon -->
                            <img class="icon-32px me-3 filter-images" src="static/icons/images.svg">
                        </div>
                        <div>
                            <!-- id.portfolio.secao.header -->
                            <h5 class="card-title">Imagens</h5>
                            <!-- id.portfolio.secao.descricao -->
                            <h6 class="card-subtitle mb-0 pb-0 text-body-secondary">Imagens de serviços realizados
                            </h6>
                        </div>
                        <div class="ms-auto">
                            <!-- id.portfolio.secao.action.edit -->
                            <button class="button" type="button">
                                <img class="icon-dark icon-16px" src="static/action-icons/edit.svg">
                            </button>
                            <!-- id.portfolio.secao.action.up -->
                            <button class="button" type="button">
                                <img class="icon-dark icon-16px" src="static/action-icons/up.svg">
                            </button>
                            <!-- id.portfolio.secao.action.down -->
                            <button class="button" type="button">
                                <img class="icon-dark icon-16px" src="static/action-icons/down.svg">
                            </button>
                            <!-- id.portfolio.secao.action.delete -->
                            <button class="button" type="button">
                                <img class="icon-dark icon-16px" src="static/action-icons/delete.svg">
                            </button>
                        </div>
                    </div>
                    <!-- Add icons to adjust positions -->
                    <div class="row py-3 m-0 g-0 w-100 scrool-container">
                        <!-- id.portfolio.secao.content -->
                        <div class="px-3">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                            <img src="static/img/placeholder_profile.png" alt="..." class="img-thumbnail images">
                        </div>
                    </div>
                </div>`
            }
            break;
            // categoriaId(2): Links
            case 2: {
                portfolio_secoes.innerHTML +=
                    `<div class="card w-100 overflow-hidden p-0 g-0 g-0 mb-3">
                        <div class="card-header p-3 d-flex align-items-center justify-content-start">
                            <div>
                                <img class="icon-32px me-3 filter-link" src="static/icons/link.svg">
                            </div>
                            <div>
                                <h5 class="card-title">Redes</h5>
                                <h6 class="card-subtitle mb-0 pb-0 text-body-secondary">Segue lá!</h6>
                            </div>
                            <div class="ms-auto">
                                <button class="button" type="button">
                                    <img class="icon-dark icon-16px" src="static/action-icons/edit.svg">
                                </button>
                                <button class="button" type="button">
                                    <img class="icon-dark icon-16px" src="static/action-icons/up.svg">
                                </button>
                                <button class="button" type="button">
                                    <img class="icon-dark icon-16px" src="static/action-icons/down.svg">
                                </button>
                                <button class="button" type="button">
                                    <img class="icon-dark icon-16px" src="static/action-icons/delete.svg">
                                </button>
                            </div>
                        </div>
                        <!-- Add icons to adjust positions -->
                        <div class="row w-100 px-3 py-2 m-0 g-3 pb-4">
                            <div class="col-12 col-sm-6 col-xl-4">
                                <button type="button" class="btn btn-primary w-100">
                                    <div class="d-flex justify-content-center m-2">
                                        <img class="icon-24px fixed-filter-invert me-2"
                                            src="static/action-icons/external.svg">
                                        <a class="text-decoration-none" href="https://instagram.com/vintageculture">
                                            <p class="g-0 p-0 m-0">Instagram</p>
                                        </a>
                                    </div>
                                </button>
                            </div>
                            <div class="col-12 col-sm-6 col-xl-4">
                                <button type="button" class="btn btn-primary w-100">
                                    <div class="d-flex justify-content-center m-2">
                                        <img class="icon-24px fixed-filter-invert me-2"
                                            src="static/action-icons/external.svg">
                                        <a class="text-decoration-none" href="https://instagram.com/vintageculture">
                                            <p class="g-0 p-0 m-0">Instagram</p>
                                        </a>
                                    </div>
                                </button>
                            </div>
                            <div class="col-12 col-sm-6 col-xl-4">
                                <button type="button" class="btn btn-primary w-100">
                                    <div class="d-flex justify-content-center m-2">
                                        <img class="icon-24px fixed-filter-invert me-2"
                                            src="static/action-icons/external.svg">
                                        <a class="text-decoration-none" href="https://instagram.com/vintageculture">
                                            <p class="g-0 p-0 m-0">Instagram</p>
                                        </a>
                                    </div>
                                </button>
                            </div>
                            <div class="col-12 col-sm-6 col-xl-4">
                                <button type="button" class="btn btn-primary w-100">
                                    <div class="d-flex justify-content-center m-2">
                                        <img class="icon-24px fixed-filter-invert me-2"
                                            src="static/action-icons/external.svg">
                                        <a class="text-decoration-none" href="https://instagram.com/vintageculture">
                                            <p class="g-0 p-0 m-0">Instagram</p>
                                        </a>
                                    </div>
                                </button>
                            </div>
                            <div class="col-12 col-sm-6 col-xl-4">
                                <button type="button" class="btn btn-primary w-100">
                                    <div class="d-flex justify-content-center m-2">
                                        <img class="icon-24px fixed-filter-invert me-2"
                                            src="static/action-icons/external.svg">
                                        <a class="text-decoration-none" href="https://instagram.com/vintageculture">
                                            <p class="g-0 p-0 m-0">Instagram</p>
                                        </a>
                                    </div>
                                </button>
                            </div>
                            <div class="col-12 col-sm-6 col-xl-4">
                                <button type="button" class="btn btn-primary w-100">
                                    <div class="d-flex justify-content-center m-2">
                                        <img class="icon-24px fixed-filter-invert me-2"
                                            src="static/action-icons/external.svg">
                                        <a class="text-decoration-none" href="https://instagram.com/vintageculture">
                                            <p class="g-0 p-0 m-0">Instagram</p>
                                        </a>
                                    </div>
                                </button>
                            </div>
                            <div class="col-12 col-sm-6 col-xl-4">
                                <button type="button" class="btn btn-primary w-100">
                                    <div class="d-flex justify-content-center m-2">
                                        <img class="icon-24px fixed-filter-invert me-2"
                                            src="static/action-icons/external.svg">
                                        <a class="text-decoration-none" href="https://instagram.com/vintageculture">
                                            <p class="g-0 p-0 m-0">Instagram</p>
                                        </a>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>`
            }
            break;
        }
    });
}

setupPortfolioPage();