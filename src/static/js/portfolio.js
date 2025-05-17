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
    // TODO: Utilizar ?id= da URI
    // INFO: Repo 14 escolhido para desenvolvimento porque contem as 3 categorias necessárias geradas aleatoriamente
    let portfolio = JSONQL_P.readPortfolios(14);
    if (!portfolio.length) {
        console.log("setupPortfolioPage: nenhum portfólio cadastrado!");
        return null
    }

    portfolio = portfolio[genRandomNumber(portfolio.length)]
    // portfolio = portfolio[genRandomNumber(portfolio.length)]

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

    // TODO: {Feratorar} Evitar que haja mais de um container de avaliação
    let aval_ja_adicionado = false;
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


        switch (secao_categoria) {
            // categoriaId(1): Avaliações
            case 1: {
                if (aval_ja_adicionado)
                    return

                aval_ja_adicionado = true

                let container_icon = "static/icons/star.svg"
                let container_icon_class = "filter-star"
                let container_title = "Avaliações"
                let container_subtitle = "Clientes satisfeitos!"

                let content_container = document.createElement("div")
                content_container.classList.add("card", "w-100", "overflow-hidden", "p-0", "g-0", "g-0", "mb-3")
                let content_header = document.createElement("div")
                content_header.classList.add("card-header", "p-3", "d-flex", "align-items-center", "justify-content-start")
                content_header.innerHTML = `<div>
                            <img class="icon-32px me-3 ${container_icon_class}" src="${container_icon}">
                        </div><div>
                            <h5 class="card-title">${container_title}</h5>
                            <h6 class="card-subtitle mb-0 pb-0 text-body-secondary">${container_subtitle}</h6>
                        </div>`
                content_container.appendChild(content_header)

                let content_actions = document.createElement("div")
                content_actions.classList.add("ms-auto")

                let content_button_edit = document.createElement("button")
                content_button_edit.classList.add("button")
                content_button_edit.setAttribute("type", "button")
                content_button_edit.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/edit.svg">`
                content_button_edit.addEventListener("click", () => {})
                content_actions.appendChild(content_button_edit)

                let content_button_up = document.createElement("button")
                content_button_up.classList.add("button")
                content_button_up.setAttribute("type", "button")
                content_button_up.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/up.svg">`
                content_button_up.addEventListener("click", () => {})
                content_actions.appendChild(content_button_up)

                let content_button_down = document.createElement("button")
                content_button_down.classList.add("button")
                content_button_down.setAttribute("type", "button")
                content_button_down.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/down.svg">`
                content_button_down.addEventListener("click", () => {})
                content_actions.appendChild(content_button_down)

                let content_button_delete = document.createElement("button")
                content_button_delete.classList.add("button")
                content_button_delete.setAttribute("type", "button")
                content_button_delete.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/delete.svg">`
                content_button_delete.addEventListener("click", () => {})
                content_actions.appendChild(content_button_delete)

                content_header.appendChild(content_actions)

                portfolio_secoes.appendChild(content_container)

                let content_blobs = document.createElement("div")
                content_blobs.classList.add("row", "w-100", "m-0", "g-0", "py-3", "scrool-container")

                let content_blobs_scrool = document.createElement("div")
                content_blobs_scrool.classList.add("px-3")

                let avaliacoes = JSONQL_A.readAvaliacoes()
                if (!avaliacoes.length)
                    return null

                // Lê todas as avaliações
                avaliacoes.forEach(avaliacao_element => { 
                    let comentario = avaliacao_element.comentario.substring(0, 200)
                    let nota = avaliacao_element.nota
                    let contratanteId = avaliacao_element.contratanteId
                    // TODO: { Otimizar > Informações do serviço da avaliação
                    // Pega o contratoId da avaliação e filtra
                    let contratoId = avaliacao_element.contratoId;
                    if (!contratoId)
                        return null

                    let contrato = JSONQL_C.readContratos(contratoId)
                    if (!contrato.length)
                        return null

                    contrato = contrato[0]
                    let contratadoId = contrato.contratadoId

                    if (!contratadoId)
                        return null

                    // A partir daqui, continue apenas os contratos que possuem a mesma id que o usuario do portfolio
                    if (contratadoId != id) {
                        return null
                    }

                    // TODO: } Otimizar > Informações do serviço da avaliação
                    let servicos = JSONQL_S.readServicos();
                    if(!servicos.length)
                        return null
                    servicos = servicos[0]

                    let usuarios = JSONQL_U.readUsuarios(contratanteId);
                    if (!usuarios.length)
                        return null
                    usuarios = usuarios[0]
                    
                    // TODO: replace 'placeholder_profile'
                    content_blobs_scrool.innerHTML += `<div class="d-inline-block float-none me-3">
                        <a class="text-decoration-none m-0 p-0 g-0" href="#">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row card-aval-limit">
                                        <div class="d-flex justify-content-start align-items-center pb-2">
                                            <div class="me-2">
                                                <img class="icon-32px" src="static/img/placeholder_profile.png"> 
                                            </div>
                                            <div class="max-width-80">
                                                <h6 class="text-truncate">${usuarios.nome}</h6>
                                                <p class="m-0 g-0 p-0 text-truncate">⭐ <span>${nota}</span> - <span>${servicos.titulo}</span></p>
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="col-12">
                                            <p class="text-wrap g-0 m-0 p-0">${comentario}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>`
                });

                content_blobs.appendChild(content_blobs_scrool)
                content_container.appendChild(content_blobs)
            }
            break;
            // categoriaId(0): Fotos
            case 0: {
                if (!secao_content.length)
                    return null

                let container_icon = "static/icons/images.svg"
                let container_icon_class = "filter-images"
                let container_title = "Imagens"
                let container_subtitle = "Imagens de serviços realizados"

                let content_container = document.createElement("div")
                content_container.classList.add("card", "w-100", "overflow-hidden", "p-0", "g-0", "g-0", "mb-3")
                let content_header = document.createElement("div")
                content_header.classList.add("card-header", "p-3", "d-flex", "align-items-center", "justify-content-start")
                content_header.innerHTML = `<div>
                            <img class="icon-32px me-3 ${container_icon_class}" src="${container_icon}">
                        </div><div>
                            <h5 class="card-title">${container_title}</h5>
                            <h6 class="card-subtitle mb-0 pb-0 text-body-secondary">${container_subtitle}</h6>
                        </div>`
                content_container.appendChild(content_header)

                let content_actions = document.createElement("div")
                content_actions.classList.add("ms-auto")

                let content_button_edit = document.createElement("button")
                content_button_edit.classList.add("button")
                content_button_edit.setAttribute("type", "button")
                content_button_edit.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/edit.svg">`
                content_button_edit.addEventListener("click", () => {})

                let content_button_up = document.createElement("button")
                content_button_up.classList.add("button")
                content_button_up.setAttribute("type", "button")
                content_button_up.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/up.svg">`
                content_button_up.addEventListener("click", () => {})

                let content_button_down = document.createElement("button")
                content_button_down.classList.add("button")
                content_button_down.setAttribute("type", "button")
                content_button_down.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/down.svg">`
                content_button_down.addEventListener("click", () => {})

                let content_button_delete = document.createElement("button")
                content_button_delete.classList.add("button")
                content_button_delete.setAttribute("type", "button")
                content_button_delete.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/delete.svg">`
                content_button_delete.addEventListener("click", () => {})

                content_actions.appendChild(content_button_edit)
                content_actions.appendChild(content_button_up)
                content_actions.appendChild(content_button_down)
                content_actions.appendChild(content_button_delete)

                content_header.appendChild(content_actions)

                portfolio_secoes.appendChild(content_container)

                let content_blobs = document.createElement("div")
                content_blobs.classList.add("row", "w-100", "m-0", "g-0", "py-3", "scrool-container")

                let content_blobs_scrool = document.createElement("div")
                content_blobs_scrool.classList.add("px-3")

                // TODO: remove foreach?
                secao_content.forEach(content_element => {
                    if (!content_element.blob && !content_element.descricao)
                        return null

                    //${content_element.descricao}
                    content_blobs_scrool.innerHTML += `<img class="img-thumbnail images me-3" src="${content_element.blob}">`
                });

                content_blobs.appendChild(content_blobs_scrool)
                content_container.appendChild(content_blobs)
            }
            break;
            // categoriaId(2): Links
            case 2: {
                if (!secao_content.length)
                    return null

                let container_icon = "static/icons/link.svg"
                let container_icon_class = "filter-link"
                let container_title = "Redes"
                let container_subtitle = "Segue lá!"

                let content_container = document.createElement("div")
                content_container.classList.add("card", "w-100", "overflow-hidden", "p-0", "g-0", "g-0", "mb-3")
                let content_header = document.createElement("div")
                content_header.classList.add("card-header", "p-3", "d-flex", "align-items-center", "justify-content-start")
                content_header.innerHTML = `<div>
                            <img class="icon-32px me-3 ${container_icon_class}" src="${container_icon}">
                        </div><div>
                            <h5 class="card-title">${container_title}</h5>
                            <h6 class="card-subtitle mb-0 pb-0 text-body-secondary">${container_subtitle}</h6>
                        </div>`
                content_container.appendChild(content_header)

                let content_actions = document.createElement("div")
                content_actions.classList.add("ms-auto")

                let content_button_edit = document.createElement("button")
                content_button_edit.classList.add("button")
                content_button_edit.setAttribute("type", "button")
                content_button_edit.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/edit.svg">`
                content_button_edit.addEventListener("click", () => {})

                let content_button_up = document.createElement("button")
                content_button_up.classList.add("button")
                content_button_up.setAttribute("type", "button")
                content_button_up.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/up.svg">`
                content_button_up.addEventListener("click", () => {})

                let content_button_down = document.createElement("button")
                content_button_down.classList.add("button")
                content_button_down.setAttribute("type", "button")
                content_button_down.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/down.svg">`
                content_button_down.addEventListener("click", () => {})

                let content_button_delete = document.createElement("button")
                content_button_delete.classList.add("button")
                content_button_delete.setAttribute("type", "button")
                content_button_delete.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/delete.svg">`
                content_button_delete.addEventListener("click", () => {})

                content_actions.appendChild(content_button_edit)
                content_actions.appendChild(content_button_up)
                content_actions.appendChild(content_button_down)
                content_actions.appendChild(content_button_delete)

                content_header.appendChild(content_actions)

                portfolio_secoes.appendChild(content_container)

                let content_blobs = document.createElement("div")
                content_blobs.classList.add("row", "w-100", "m-0", "g-3", "py-2", "px-3", "pb-4")

                // TODO: remove foreach?
                secao_content.forEach(content_element => {
                    if (!content_element.blob && !content_element.descricao)
                        return null

                    content_blobs.innerHTML += `<div class="col-12 col-sm-6 col-xl-4">
                        <a class="btn btn-primary text-decoration-none w-100" href="${content_element.blob}" role="button">
                            <div class="d-flex justify-content-center m-2">
                                <img class="icon-24px fixed-filter-invert me-2"
                                    src="static/action-icons/external.svg">
                                    <p class="g-0 p-0 m-0">${content_element.descricao}</p>
                            </div>
                        </a>
                    </div>`
                });

                content_container.appendChild(content_blobs)
            }
            break;
        }
    });
}

setupPortfolioPage();