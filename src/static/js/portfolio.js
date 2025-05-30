//@ts-check
import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios
import * as Faker from "./faker.mjs";
import { ensureInteger, imageFileToBase64 } from "./tools.mjs";

/**
 * @returns {HTMLDivElement}
 */
function createSectionContainer() {
    let content_container = document.createElement("div");
    content_container.classList.add(
        "card",
        "w-100",
        "overflow-hidden",
        "p-0",
        "g-0",
        "g-0",
        "mb-3"
    );
    return content_container;
}

/**
 *
 * @param {string} icon
 * @param {string} icon_class
 * @param {string} title
 * @param {string} subtitle
 * @returns {HTMLDivElement}
 */
function createSectionHeader(icon, icon_class, title, subtitle) {
    let content_header = document.createElement("div");
    content_header.classList.add(
        "card-header",
        "p-3",
        "d-flex",
        "align-items-center",
        "justify-content-start"
    );
    content_header.innerHTML = `<div>
            <img class="icon-32px me-3 ${icon_class}" src="static/icons/${icon}.svg">
        </div><div>
            <h5 class="card-title">${title}</h5>
            <h6 class="card-subtitle mb-0 pb-0 text-body-secondary">${subtitle}</h6>
        </div>`;
    return content_header;
}

/**
 * @param {string} icon
 * @param {EventListener} clickEventListener
 *
 * @returns {HTMLButtonElement}
 */
function createActionButton(icon, clickEventListener) {
    let HTMLButton = document.createElement("button");
    HTMLButton.classList.add("button");
    HTMLButton.setAttribute("type", "button");
    HTMLButton.innerHTML = `<img class="icon-dark icon-16px" src="static/action-icons/${icon}.svg">`;
    HTMLButton.addEventListener("click", clickEventListener);
    return HTMLButton;
}

// TODO: Improve this: get only needed contracts
// TODO: select * where userId = userId
/**
 * @param {string | number} userId
 * @returns {number | null}
 */
function getMediaAvaliacoes(userId) {
    const userId_int = ensureInteger(userId);
    if (typeof userId_int !== "number") return null;

    let avaliacoes = JSONQL_A.readAvaliacoes() || [];
    // Sem avaliações
    if (!avaliacoes || !avaliacoes.length) return null;

    let media = 0;
    let quantidade = 0;
    while (quantidade < avaliacoes.length) {
        const contratoId = avaliacoes[quantidade].contratoId;
        const contrato = JSONQL_C.readContratos(contratoId);
        if (!contrato) {
            console.log("setupPortfolioPage: Não foi possível identificar o contrato");
            continue;
        }

        let contratado = contrato[0].contratadoId;

        if (!contratado) {
            console.log("setupPortfolioPage: Não foi possível identificar o contratado");
            continue;
        }

        if (ensureInteger(contratado) === userId_int) {
            media += avaliacoes[quantidade].nota;
            quantidade++;
        }
    }

    if (quantidade > 0) {
        media /= quantidade;
        // Arredonda para 2 casas
        return Math.round(media * 100) / 100;
    }

    return null;
}

function preparePopup() {
    window.scrollTo(0, 0);
}

// TODO: Reload only needed information
function notifySectionDataChanged() {
    window.location.reload();
}

function toggleDisplayNoneOnElement(element_id, set_display_none_status) {
    if (typeof element_id !== "string") return null;

    const element = document.getElementById(element_id);
    if (!(element instanceof HTMLElement)) return;

    if (typeof set_display_none_status === "boolean") {
        set_display_none_status
            ? element.classList.add("d-none")
            : element.classList.remove("d-none");
    }

    element.classList.toggle("d-none");
}

// @AI-Gemini
function toggleEditParam(enable) {
    if (typeof enable !== "boolean") return null;

    const url = new URL(window.location.href); // Get the current URL
    const params = new URLSearchParams(url.search); // Get the search parameters

    if (enable) {
        // Set a new parameter or modify an existing one
        params.set("edit", true);
    } else {
        // Delete a parameter
        params.delete("edit");
    }

    // Get the modified URL string
    const newUrl = `${url.origin}${url.pathname}?${params.toString()}${url.hash}`;

    // TODO: Verificar a necessidade de recarregar a página se o parametro não foi alterado
    // Or, to navigate to the new URL (which will cause a reload):
    window.location.href = newUrl;
}

// @AI-Gemini
function setIdParam(id) {
    if (typeof id === "string") id = parseInt(id);

    if (typeof id !== "number") {
        console.log("?id= Não é número");
        return null;
    }

    const url = new URL(window.location.href); // Get the current URL
    const params = new URLSearchParams(url.search); // Get the search parameters
    if (id) {
        params.set("id", id);
        window.location.href = `${url.origin}${url.pathname}?${params.toString()}${url.hash}`;
    } else {
        // Navega para a pagina sem parametros
        window.location.href = `${url.origin}${url.pathname}`;
    }
}

// TODO: Configurar edição apenas se necessário como ?edit=true
function setupPortfolioPage(portf_id, enable_edit) {
    if (!portf_id && typeof portf_id !== "number") return null;

    /* Check if null
    if (enable_edit && typeof (enable_edit) !== "boolean")
        return null
    */

    function readPortfolio(id) {
        const p_id = ensureInteger(id);
        if (typeof p_id !== "number") return null;

        const portfolios = JSONQL_P.readPortfolios(p_id);
        if (!portfolios || !portfolios.length) return null;

        return portfolios[0];
    }

    // INFO: Repo 14 escolhido para desenvolvimento porque contem as 3 categorias necessárias geradas aleatoriamente
    const portfolio = readPortfolio(portf_id);
    if (!portfolio) {
        console.log("setupPortfolioPage: nenhum portfólio cadastrado!");
        alert("A id informada para o portfólio não existe!");
        setIdParam(0);
        return null;
    }

    toggleDisplayNoneOnElement("portfolio-display", false);

    let toggle_edit_element = document.getElementById("toggle-edit");
    if (enable_edit) {
        if (toggle_edit_element instanceof HTMLButtonElement) {
            let toggle_edit_element_img = document.createElement("img");
            toggle_edit_element_img.classList.add(
                "icon-dark",
                "icon-24px",
                "g-0",
                "m-0",
                "p-0",
                "me-2"
            );
            toggle_edit_element_img.src = "static/action-icons/close.svg";
            let toggle_edit_element_p = document.createElement("p");
            toggle_edit_element_p.classList.add("g-0", "m-0", "p-0");
            toggle_edit_element_p.innerText = "Finalizar edição";
            toggle_edit_element.appendChild(toggle_edit_element_img);
            toggle_edit_element.appendChild(toggle_edit_element_p);
            toggle_edit_element.addEventListener("click", () => {
                toggleEditParam(false);
            });
        }

        toggleDisplayNoneOnElement("add-section", false);

        const popup_edit_section_close = document.getElementById("popup-edit-close");
        const popup_edit_section_confirm = document.getElementById("popup-edit-confirm");

        popup_edit_section_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-edit", true)
        );
        popup_edit_section_confirm?.addEventListener("click", () => {
            let form_id = globalThis.popup_edit_context.secao_id;
            let form_sec_ordem = globalThis.popup_edit_context.secao_ordem;

            const html_popup_edit_name = document.getElementById("popup-edit-name");
            const html_popup_edit_description = document.getElementById("popup-edit-description");

            if (
                !(html_popup_edit_name instanceof HTMLButtonElement) ||
                !(html_popup_edit_description instanceof HTMLButtonElement)
            ) {
                console.log("edit-section: null check");
                return null;
            }

            let form_sec_name = html_popup_edit_name.value;
            let form_sec_description = html_popup_edit_description.value;

            const form_porfolio = readPortfolio(form_id);

            if (!form_porfolio) {
                console.log(`ID0: Erro ao editar categoria do portfolio ${form_id}.`);
                return null;
            }

            if (!form_porfolio.secoes.length) {
                console.log("ID1: Erro ao editar categoria.");
                return null;
            }

            for (let k = 0; k < form_porfolio.secoes.length; k++) {
                if (form_porfolio.secoes[k].ordem == form_sec_ordem) {
                    form_porfolio.secoes[k].nome = form_sec_name;
                    form_porfolio.secoes[k].descricao = form_sec_description;
                    break;
                }
            }
            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                toggleDisplayNoneOnElement("popup-edit", true);
                notifySectionDataChanged();
                return null;
            }

            console.log("Ocorreu um erro ao atualizar o objeto!");
        });

        const add_section = document.getElementById("add-section");
        const popup_add_section_close = document.getElementById("popup-add-close");
        const popup_add_section_confirm = document.getElementById("popup-add-confirm");

        // Botão de adicionar seção
        add_section?.addEventListener("click", () => toggleDisplayNoneOnElement("popup-add", true));
        popup_add_section_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-add", true)
        );
        popup_add_section_confirm?.addEventListener("click", () => {
            let form_id = globalThis.popup_edit_context.portfolio_id;

            const html_popup_add_name = document.getElementById("popup-add-name");
            const html_popup_add_description = document.getElementById("popup-add-description");
            const html_popup_add_categoria = document.getElementById("popup-add-categoria");

            if (
                !(html_popup_add_name instanceof HTMLInputElement) ||
                !(html_popup_add_description instanceof HTMLInputElement) ||
                !(html_popup_add_categoria instanceof HTMLInputElement)
            ) {
                console.log("add-section: null check");
                return;
            }

            const form_section_name = html_popup_add_name.value;
            const form_section_description = html_popup_add_description.value;
            const form_section_categoria = html_popup_add_categoria.value;

            const form_porfolio = readPortfolio(form_id);

            if (!form_porfolio) {
                console.log(`ID0: Erro ao editar categoria do portfolio ${form_id}.`);
                return null;
            }

            if (!form_section_name) {
                alert("O nome da seção não pode estar vazio!");
                return null;
            }

            let maior = 0;
            // Como estamos adicionando uma seção, não é problema se ela esta vazia
            if (form_porfolio.secoes && form_porfolio.secoes.length) {
                // Verificar o maior valor para json.ordem

                form_porfolio.secoes.forEach((element) => {
                    if (parseInt(element.ordem) > maior) maior = element.ordem;
                });
            } else {
                form_porfolio.secoes = [];
            }

            maior++;

            form_porfolio.secoes.push({
                ordem: maior,
                nome: form_section_name,
                descricao: form_section_description || "",
                categoriaId: parseInt(form_section_categoria),
                contents: [],
            });

            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                toggleDisplayNoneOnElement("popup-add", true);
                notifySectionDataChanged();
                return;
            }

            console.log("Ocorreu um erro ao atualizar o objeto!");
        });

        const popup_add_link_close = document.getElementById("popup-add-link-close");
        const popup_add_link_confirm = document.getElementById("popup-add-link-confirm");
        popup_add_link_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-add-link", true)
        );
        popup_add_link_confirm?.addEventListener("click", () => {
            let form_id = globalThis.popup_edit_context.secao_id;
            let form_ordem = globalThis.popup_edit_context.secao_ordem;

            const popup_add_link_url = document.getElementById("popup-add-link-url");
            const popup_add_link_description = document.getElementById(
                "popup-add-link-description"
            );

            if (
                !(popup_add_link_url instanceof HTMLInputElement) ||
                !(popup_add_link_description instanceof HTMLInputElement)
            ) {
                console.error(`${this.name}: null check`);
                return;
            }

            let form_sec_url = popup_add_link_url.value;
            let form_sec_description = popup_add_link_description.value;

            const form_porfolio = readPortfolio(form_id);

            if (!form_porfolio) {
                console.log(`ID0: Erro ao editar categoria do portfolio ${form_id}.`);
                return null;
            }

            if (!form_porfolio.secoes.length) {
                console.log("ID1: Erro ao editar categoria.");
                return null;
            }

            if (!(form_sec_url.startsWith("https://") || form_sec_url.startsWith("http://"))) {
                alert("URL não é valida!\n\nA URL não começa com 'http://' ou 'https://'");
                return null;
            } else if (form_sec_url.startsWith("https://")) {
                if (form_sec_url.length === 8) {
                    alert("URL não é valida!\n\nA URL esta vazia!");
                    return null;
                }
            } else if (form_sec_url.startsWith("http://")) {
                if (form_sec_url.length === 8) {
                    alert("URL não é valida!\n\nA URL esta vazia!");
                    return null;
                }
            }

            for (let index = 0; index < form_porfolio.secoes.length; index++) {
                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                    continue;
                }

                let content_tv = {
                    blob: form_sec_url || "",
                    descricao: form_sec_description || "",
                };

                form_porfolio.secoes[index].contents.push(content_tv);
                break;
            }

            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                toggleDisplayNoneOnElement("popup-add-link", true);
                notifySectionDataChanged();
                return;
            }

            console.log("Ocorreu um erro ao atualizar o objeto!");
        });

        const popup_delete_section_close = document.getElementById("popup-delete-close");
        const popup_delete_section_cancel = document.getElementById("popup-delete-cancel");
        const popup_delete_section_confirm = document.getElementById("popup-delete-confirm");

        popup_delete_section_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete", true)
        );
        popup_delete_section_cancel?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete", true)
        );
        popup_delete_section_confirm?.addEventListener("click", () => {
            let form_id = globalThis.popup_edit_context.portfolio_id;
            let form_ordem = globalThis.popup_edit_context.secao_ordem;

            const form_porfolio = readPortfolio(form_id);

            if (!form_porfolio) {
                console.log(`ID0: Erro ao editar categoria do portfolio ${form_id}.`);
                return null;
            }

            if (!form_porfolio.secoes.length) {
                console.log("ID1: Erro ao editar categoria.");
                return null;
            }

            for (let index = 0; index < form_porfolio.secoes.length; index++) {
                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                    continue;
                }

                form_porfolio.secoes.splice(index, 1);
                break;
            }

            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                toggleDisplayNoneOnElement("popup-delete", true);
                notifySectionDataChanged();
                return;
            }

            console.log("Ocorreu um erro ao atualizar o objeto!");
        });

        const popup_delete_image_close = document.getElementById("popup-delete-image-close");
        const popup_delete_image_cancel = document.getElementById("popup-delete-image-cancel");
        const popup_delete_image_confirm = document.getElementById("popup-delete-image-confirm");

        popup_delete_image_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete-image", true)
        );
        popup_delete_image_cancel?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete-image", true)
        );
        popup_delete_image_confirm?.addEventListener("click", () => {
            let form_id = globalThis.popup_edit_context.secao_id;
            let form_ordem = globalThis.popup_edit_context.secao_ordem;
            // TODO: Expensive, use id or something else
            let form_blob = globalThis.popup_edit_context.blob;
            let form_descricao = globalThis.popup_edit_context.descricao;

            const portfolios = JSONQL_P.readPortfolios(form_id);
            if (!portfolios || !portfolios.length) {
                console.log(`ID0: Erro ao editar categoria do portfolio ${form_id}.`);
                return;
            }

            const form_porfolio = portfolios[0];

            if (!form_porfolio) {
                console.log(`ID0: Erro ao editar categoria do portfolio ${form_id}.`);
                return null;
            }

            if (!form_porfolio.secoes.length) {
                console.log("ID1: Erro ao editar categoria.");
                return null;
            }

            let procurando = true;
            for (let index = 0; index < form_porfolio.secoes.length && procurando; index++) {
                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                    continue;
                }

                if (
                    !form_porfolio.secoes[index].contents ||
                    !form_porfolio.secoes[index].contents.length
                ) {
                    console.log(form_porfolio.secoes[index].contents);
                    console.log("Não encontrado");
                    return null;
                }

                for (
                    let jindex = 0;
                    jindex < form_porfolio.secoes[index].contents.length && procurando;
                    jindex++
                ) {
                    if (
                        !form_porfolio.secoes[index].contents[jindex].blob ||
                        form_porfolio.secoes[index].contents[jindex].descricao == null
                    )
                        continue;

                    if (form_porfolio.secoes[index].contents[jindex].blob != form_blob) continue;

                    if (form_porfolio.secoes[index].contents[jindex].descricao != form_descricao)
                        continue;

                    form_porfolio.secoes[index].contents.splice(jindex, 1);
                    procurando = false;
                }
                procurando = false;
            }

            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                toggleDisplayNoneOnElement("popup-delete-image", true);
                notifySectionDataChanged();
                return;
            }

            console.log("Ocorreu um erro ao atualizar o objeto!");
        });

        const popup_delete_link_close = document.getElementById("popup-delete-link-close");
        const popup_delete_link_cancel = document.getElementById("popup-delete-link-cancel");
        const popup_delete_link_confirm = document.getElementById("popup-delete-link-confirm");

        popup_delete_link_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete-link", true)
        );
        popup_delete_link_cancel?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete-link", true)
        );
        popup_delete_link_confirm?.addEventListener("click", () => {
            let form_id = globalThis.popup_edit_context.secao_id;
            let form_ordem = globalThis.popup_edit_context.secao_ordem;
            // TODO: Expensive, use id or something else
            let form_blob = globalThis.popup_edit_context.blob;
            let form_descricao = globalThis.popup_edit_context.descricao;

            const form_porfolios = JSONQL_P.readPortfolios(form_id);

            if (!form_porfolios || !form_porfolios.length) {
                console.log(`ID0: Erro ao editar categoria do portfolio ${form_id}.`);
                return null;
            }
            const form_porfolio = form_porfolios[0];

            if (!form_porfolio.secoes.length) {
                console.log("ID1: Erro ao editar categoria.");
                return null;
            }

            let procurando = true;
            for (let index = 0; index < form_porfolio.secoes.length && procurando; index++) {
                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                    continue;
                }

                if (
                    !form_porfolio.secoes[index].contents ||
                    !form_porfolio.secoes[index].contents.length
                ) {
                    console.log(form_porfolio.secoes[index].contents);
                    console.log("Não encontrado");
                    return null;
                }

                for (
                    let jindex = 0;
                    jindex < form_porfolio.secoes[index].contents.length && procurando;
                    jindex++
                ) {
                    console.log(form_porfolio.secoes[index].contents[jindex]);
                    console.log(form_porfolio.secoes[index].contents);
                    if (
                        !form_porfolio.secoes[index].contents[jindex].blob ||
                        form_porfolio.secoes[index].contents[jindex].descricao == null
                    )
                        continue;

                    if (form_porfolio.secoes[index].contents[jindex].blob != form_blob) continue;

                    if (form_porfolio.secoes[index].contents[jindex].descricao != form_descricao)
                        continue;

                    form_porfolio.secoes[index].contents.splice(jindex, 1);
                    procurando = false;
                }
                procurando = false;
            }

            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                toggleDisplayNoneOnElement("popup-delete-link", true);
                notifySectionDataChanged();
                return;
            }

            console.log("Ocorreu um erro ao atualizar o objeto!");
        });
    } else if (toggle_edit_element instanceof HTMLButtonElement) {
        let toggle_edit_element_img = document.createElement("img");
        toggle_edit_element_img.classList.add(
            "icon-dark",
            "icon-24px",
            "g-0",
            "m-0",
            "p-0",
            "me-2"
        );
        toggle_edit_element_img.src = "static/action-icons/edit.svg";
        let toggle_edit_element_p = document.createElement("p");
        toggle_edit_element_p.classList.add("g-0", "m-0", "p-0");
        toggle_edit_element_p.innerText = "Editar portfólio";
        toggle_edit_element.appendChild(toggle_edit_element_img);
        toggle_edit_element.appendChild(toggle_edit_element_p);
        toggle_edit_element.addEventListener("click", () => {
            toggleEditParam(true);
        });
    }

    if (!globalThis.popup_edit_context) {
        globalThis.popup_edit_context = [];
        globalThis.popup_edit_context.portfolio_id = portfolio.id;
    }

    let user = portfolio.usuarioId;
    if (!user) {
        console.log("setupPortfolioPage: no user");
        return null;
    }

    user = JSONQL_U.readUsuarios(user);

    if (!user.length) {
        console.log("setupPortfolioPage: usuario não encontrado");
        return null;
    }

    let nome = user[0].nome;
    let id = user[0].id;
    let biografia = user[0].biografia || "Sem descrição informada";
    let picture = user[0].foto || `https://picsum.photos/seed/${id}/200`;

    // TODO: adicionar contato e e-mail?

    // TODO: Se não preenchido na hora do cadastro?
    if (!nome || !id || !biografia) {
        console.log("setupPortfolioPage: não foi possível verificar alguma informação do usuário");
        return null;
    }

    const portfolio_name = document.getElementById("portfolio-name");
    const portfolio_picture = document.getElementById("portfolio-picture");
    const portfolio_username = document.getElementById("portfolio-username");
    const portfolio_nota = document.getElementById("portfolio-nota");
    const portfolio_descricao = document.getElementById("portfolio-descricao");
    const portfolio_secoes = document.getElementById("portfolio-secoes");

    if (
        !(portfolio_name instanceof HTMLHeadingElement) ||
        !(portfolio_picture instanceof HTMLImageElement) ||
        !(portfolio_username instanceof HTMLSpanElement) ||
        !(portfolio_nota instanceof HTMLSpanElement) ||
        !(portfolio_descricao instanceof HTMLParagraphElement) ||
        !(portfolio_secoes instanceof HTMLDivElement)
    ) {
        console.error(`${this.name}: null check`);
        return null;
    }

    portfolio_name.innerText = nome;
    portfolio_username.innerText = `@${id}`;
    portfolio_picture.src = picture;
    portfolio_descricao.innerText = biografia;

    let media = getMediaAvaliacoes(id);
    if (media) {
        portfolio_nota.innerText = media.toString();
    }

    let secoes = portfolio.secoes;
    // TODO: O usuário pode não ter cadastrado nenhuma seção ainda
    if (!secoes.length && !enable_edit) {
        let information = document.createElement("h5");
        information.classList.add(
            "d-flex",
            "w-100",
            "p-4",
            "m-0",
            "g-0",
            "align-items-center",
            "justify-content-center"
        );
        information.innerText = "Portfólio vazio, edite o portfólio para adicionar uma seção!";
        portfolio_secoes.appendChild(information);
        return null;
    }

    // TODO: {Feratorar} Evitar que haja mais de um container de avaliação
    let aval_ja_adicionado = false;
    secoes.forEach((element) => {
        let secao_nome = element.nome;
        // New
        let secao_descricao = element.descricao;
        let secao_ordem = element.ordem;
        let secao_categoria = element.categoriaId;
        // For categoriaId(0), content is optional
        let secao_content = element.contents;

        if (
            !secao_nome ||
            (!secao_ordem && typeof secao_ordem !== "number") ||
            (!secao_categoria && typeof secao_categoria !== "number")
        ) {
            console.log("setupPortfolioPage: algo na seção não foi encontrado!");
            return null;
        }

        switch (secao_categoria) {
            // categoriaId(1): Avaliações
            case 1:
                {
                    // Não é um bug, é uma feature, mas parece um bug
                    // Desabilitado por enquanto
                    /*
                if (aval_ja_adicionado)
                    return

                aval_ja_adicionado = true
                */

                    let container_title = secao_nome || "Avaliações";
                    let container_subtitle = secao_descricao || "Clientes satisfeitos!";

                    let content_header = createSectionHeader(
                        "star",
                        "filter-star",
                        container_title,
                        container_subtitle
                    );

                    let content_container = createSectionContainer();
                    content_container.appendChild(content_header);

                    if (enable_edit) {
                        let content_actions = document.createElement("div");
                        content_actions.classList.add("ms-auto");

                        let content_button_edit = createActionButton("edit", () => {
                            preparePopup();
                            toggleDisplayNoneOnElement("popup-edit", false);

                            if (!globalThis.popup_edit_context) globalThis.popup_edit_context = [];

                            globalThis.popup_edit_context.secao_id = portfolio.id;
                            globalThis.popup_edit_context.secao_ordem = secao_ordem;
                            globalThis.popup_edit_context.secao_nome = container_title;
                            globalThis.popup_edit_context.secao_descricao = container_subtitle;

                            const popup_edit_name = document.getElementById("popup-edit-name");
                            const popup_edit_description =
                                document.getElementById("popup-edit-description");

                            if (
                                !(popup_edit_name instanceof HTMLInputElement) ||
                                !(popup_edit_description instanceof HTMLInputElement)
                            ) {
                                console.error(`${this.name}: null check`);
                                return;
                            }

                            popup_edit_name.value = container_title;
                            popup_edit_description.value = container_subtitle;
                        });

                        let content_button_up = createActionButton("up", () => {
                            let form_id = portfolio.id;
                            let form_ordem = secao_ordem;

                            const form_porfolio = readPortfolio(form_id);

                            if (!form_porfolio) {
                                console.log(
                                    `ID0: Erro ao editar categoria do portfolio ${form_id}.`
                                );
                                return null;
                            }

                            if (!form_porfolio.secoes.length) {
                                console.log("ID1: Erro ao editar categoria.");
                                return null;
                            }

                            // TODO: Por enquanto a ordem no array é mais importante que o valor em json.ordem
                            // INFO: Aqui a ordem esta sendo utilizada como id da seção
                            // Verificar o maior valor para json.ordem
                            /*
                        let maior = 0;
                        form_porfolio.secoes.forEach(element => {
                            if (parseInt(element.ordem) > maior)
                                maior = element.ordem;
                        });

                        // TODO: Desabilitar botão quando no topo ou no final?
                        if (secao_ordem >= maior)
                            return null
                        */

                            for (
                                let index = 1;
                                index > 0 && index < form_porfolio.secoes.length;
                                index++
                            ) {
                                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                                    continue;
                                }

                                // Remove do array
                                let secao = form_porfolio.secoes.splice(index, 1)[0];
                                form_porfolio.secoes.splice(index - 1, 0, secao);
                                break;
                            }

                            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                                notifySectionDataChanged();
                            } else {
                                console.log("Ocorreu um erro ao atualizar o objeto!");
                            }
                        });

                        let content_button_down = createActionButton("down", () => {
                            let form_id = portfolio.id;
                            let form_ordem = secao_ordem;

                            const form_porfolio = readPortfolio(form_id);

                            if (!form_porfolio) {
                                console.log(
                                    `ID0: Erro ao editar categoria do portfolio ${form_id}.`
                                );
                                return null;
                            }

                            if (!form_porfolio.secoes.length) {
                                console.log("ID1: Erro ao editar categoria.");
                                return null;
                            }

                            // Verificar o maior valor para json.ordem
                            let maior = 0;
                            form_porfolio.secoes.forEach((element) => {
                                if (parseInt(element.ordem) > maior) maior = element.ordem;
                            });

                            // TODO: Desabilitar botão quando no topo ou no final?
                            if (secao_ordem >= maior) return null;

                            for (let index = 0; index < form_porfolio.secoes.length - 1; index++) {
                                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                                    continue;
                                }

                                // Remove do array
                                let secao = form_porfolio.secoes.splice(index, 1)[0];
                                form_porfolio.secoes.splice(index + 1, 0, secao);
                                break;
                            }

                            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                                notifySectionDataChanged();
                            } else {
                                console.log("Ocorreu um erro ao atualizar o objeto!");
                            }
                        });

                        let content_button_delete = createActionButton("delete", () => {
                            preparePopup();
                            toggleDisplayNoneOnElement("popup-delete", false);

                            if (!globalThis.popup_edit_context) globalThis.popup_edit_context = [];

                            globalThis.popup_edit_context.secao_id = portfolio.id;
                            globalThis.popup_edit_context.secao_ordem = secao_ordem;

                            const popup_delete_name = document.getElementById("popup-delete-name");
                            const popup_delete_description = document.getElementById(
                                "popup-delete-description"
                            );

                            if (
                                !(popup_delete_name instanceof HTMLParagraphElement) ||
                                !(popup_delete_description instanceof HTMLParagraphElement)
                            ) {
                                return;
                            }

                            popup_delete_name.innerText = container_title;
                            popup_delete_description.innerText = container_subtitle;
                        });

                        content_actions.appendChild(content_button_edit);
                        content_actions.appendChild(content_button_down);
                        content_actions.appendChild(content_button_up);
                        content_actions.appendChild(content_button_delete);

                        content_header.appendChild(content_actions);
                    }

                    portfolio_secoes.appendChild(content_container);

                    let content_blobs = document.createElement("div");
                    content_blobs.classList.add(
                        "row",
                        "w-100",
                        "m-0",
                        "g-0",
                        "py-3",
                        "scrool-container"
                    );

                    let content_blobs_scrool = document.createElement("div");
                    content_blobs_scrool.classList.add("px-3");

                    let avaliacoes = JSONQL_A.readAvaliacoes();
                    if (!avaliacoes || !avaliacoes.length) {
                        let information = document.createElement("p");
                        information.classList.add(
                            "d-flex",
                            "w-100",
                            "p-4",
                            "m-0",
                            "g-0",
                            "align-items-center",
                            "justify-content-center"
                        );
                        information.innerHTML = `Não há avaliações para este usuário, você pode utilizar a&nbsp;<a href="dev.html">página de desenvolvimento</a>&nbsp;para gerar uma avaliação.`;
                        content_blobs_scrool.appendChild(information);
                    }

                    // Lê todas as avaliações
                    avaliacoes.forEach((avaliacao_element) => {
                        let comentario = avaliacao_element.comentario.substring(0, 200);
                        let nota = avaliacao_element.nota;
                        let contratanteId = avaliacao_element.contratanteId;
                        // TODO: { Otimizar > Informações do serviço da avaliação
                        // Pega o contratoId da avaliação e filtra
                        let contratoId = avaliacao_element.contratoId;
                        if (!contratoId) return null;

                        let contrato = JSONQL_C.readContratos(contratoId);
                        if (!contrato.length) return null;

                        contrato = contrato[0];
                        let contratadoId = contrato.contratadoId;

                        if (!contratadoId) return null;

                        // A partir daqui, continue apenas os contratos que possuem a mesma id que o usuario do portfolio
                        if (contratadoId != id) {
                            return null;
                        }

                        // TODO: } Otimizar > Informações do serviço da avaliação
                        let servicos = JSONQL_S.readServicos();
                        if (!servicos.length) return null;
                        servicos = servicos[0];

                        let usuarios = JSONQL_U.readUsuarios(contratanteId);
                        if (!usuarios.length) return null;
                        usuarios = usuarios[0];

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
                    </div>`;
                    });

                    content_blobs.appendChild(content_blobs_scrool);
                    content_container.appendChild(content_blobs);
                }
                break;
            // categoriaId(0): Fotos
            case 0:
                {
                    let container_title = secao_nome || "Imagens";
                    let container_subtitle = secao_descricao || "Seção de imagens";

                    let content_header = createSectionHeader(
                        "images",
                        "filter-images",
                        container_title,
                        container_subtitle
                    );

                    let content_container = createSectionContainer();
                    content_container.appendChild(content_header);

                    if (enable_edit) {
                        let content_actions = document.createElement("div");
                        content_actions.classList.add("ms-auto");

                        let content_button_edit = createActionButton("edit", () => {
                            preparePopup();
                            toggleDisplayNoneOnElement("popup-edit", false);

                            if (!globalThis.popup_edit_context) globalThis.popup_edit_context = [];

                            globalThis.popup_edit_context.secao_id = portfolio.id;
                            globalThis.popup_edit_context.secao_ordem = secao_ordem;
                            globalThis.popup_edit_context.secao_nome = container_title;
                            globalThis.popup_edit_context.secao_descricao = container_subtitle;

                            const popup_edit_name = document.getElementById("popup-edit-name");
                            const popup_edit_description =
                                document.getElementById("popup-edit-description");

                            if (
                                !(popup_edit_name instanceof HTMLInputElement) ||
                                !(popup_edit_description instanceof HTMLInputElement)
                            )
                                return;

                            popup_edit_name.value = container_title;
                            popup_edit_description.value = container_subtitle;
                        });

                        let content_button_up = createActionButton("up", () => {
                            let form_id = portfolio.id;
                            let form_ordem = secao_ordem;

                            const form_porfolio = readPortfolio(form_id);

                            if (!form_porfolio) {
                                console.log(
                                    `ID0: Erro ao editar categoria do portfolio ${form_id}.`
                                );
                                return null;
                            }

                            if (!form_porfolio.secoes.length) {
                                console.log("ID1: Erro ao editar categoria.");
                                return null;
                            }

                            // TODO: Por enquanto a ordem no array é mais importante que o valor em json.ordem
                            // INFO: Aqui a ordem esta sendo utilizada como id da seção
                            // Verificar o maior valor para json.ordem
                            /*
                        let maior = 0;
                        form_porfolio.secoes.forEach(element => {
                            if (parseInt(element.ordem) > maior)
                                maior = element.ordem;
                        });

                        // TODO: Desabilitar botão quando no topo ou no final?
                        if (secao_ordem >= maior)
                            return null
                        */

                            for (
                                let index = 1;
                                index > 0 && index < form_porfolio.secoes.length;
                                index++
                            ) {
                                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                                    continue;
                                }

                                // Remove do array
                                let secao = form_porfolio.secoes.splice(index, 1)[0];
                                form_porfolio.secoes.splice(index - 1, 0, secao);
                                break;
                            }

                            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                                notifySectionDataChanged();
                            } else {
                                console.log("Ocorreu um erro ao atualizar o objeto!");
                            }
                        });

                        let content_button_down = createActionButton("down", () => {
                            let form_id = portfolio.id;
                            let form_ordem = secao_ordem;

                            const form_porfolio = readPortfolio(form_id);

                            if (!form_porfolio) {
                                console.log(
                                    `ID0: Erro ao editar categoria do portfolio ${form_id}.`
                                );
                                return null;
                            }

                            if (!form_porfolio.secoes.length) {
                                console.log("ID1: Erro ao editar categoria.");
                                return null;
                            }

                            // Verificar o maior valor para json.ordem
                            let maior = 0;
                            form_porfolio.secoes.forEach((element) => {
                                if (parseInt(element.ordem) > maior) maior = element.ordem;
                            });

                            // TODO: Desabilitar botão quando no topo ou no final?
                            if (secao_ordem >= maior) return null;

                            for (let index = 0; index < form_porfolio.secoes.length - 1; index++) {
                                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                                    continue;
                                }

                                // Remove do array
                                let secao = form_porfolio.secoes.splice(index, 1)[0];
                                form_porfolio.secoes.splice(index + 1, 0, secao);
                                break;
                            }

                            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                                notifySectionDataChanged();
                            } else {
                                console.log("Ocorreu um erro ao atualizar o objeto!");
                            }
                        });

                        let content_button_delete = createActionButton("delete", () => {
                            preparePopup();
                            toggleDisplayNoneOnElement("popup-delete", false);

                            if (!globalThis.popup_edit_context) globalThis.popup_edit_context = [];

                            globalThis.popup_edit_context.secao_id = portfolio.id;
                            globalThis.popup_edit_context.secao_ordem = secao_ordem;

                            const popup_delete_name = document.getElementById("popup-delete-name");
                            const popup_delete_description = document.getElementById(
                                "popup-delete-description"
                            );

                            if (
                                !(popup_delete_name instanceof HTMLParagraphElement) ||
                                !(popup_delete_description instanceof HTMLParagraphElement)
                            ) {
                                console.error(`${this.name}: null check`);
                                return null;
                            }

                            popup_delete_name.innerText = container_title;
                            popup_delete_description.innerText = container_subtitle;
                        });

                        content_actions.appendChild(content_button_edit);
                        content_actions.appendChild(content_button_up);
                        content_actions.appendChild(content_button_down);
                        content_actions.appendChild(content_button_delete);

                        content_header.appendChild(content_actions);
                    }

                    portfolio_secoes.appendChild(content_container);

                    let content_blobs = document.createElement("div");
                    content_blobs.classList.add(
                        "row",
                        "w-100",
                        "m-0",
                        "g-0",
                        "py-3",
                        "scrool-container"
                    );

                    let content_blobs_scrool = document.createElement("div");
                    content_blobs_scrool.classList.add("px-3");

                    if (secao_content && secao_content.length) {
                        for (let index = 0; index < secao_content.length; index++) {
                            if (!secao_content[index].blob && !secao_content[index].descricao)
                                return null;

                            let image_div = document.createElement("div");
                            image_div.classList.add("me-3", "d-inline-block", "position-relative");
                            image_div.innerHTML += `<img class="img-thumbnail images" src="${secao_content[index].blob}">`;

                            // edit.remove
                            if (enable_edit) {
                                let remove_button = document.createElement("button");
                                remove_button.innerHTML = `<img class="icon-dark icon-24px" src="static/action-icons/close.svg">`;
                                remove_button.classList.add(
                                    "icon-32px",
                                    "position-absolute",
                                    "top-0",
                                    "start-100",
                                    "translate-middle",
                                    "p-2",
                                    "border",
                                    "border-light",
                                    "rounded-circle",
                                    "d-flex",
                                    "justify-content-center",
                                    "align-items-center"
                                );
                                remove_button.addEventListener("click", () => {
                                    preparePopup();
                                    toggleDisplayNoneOnElement("popup-delete-image", false);

                                    if (!globalThis.popup_edit_context)
                                        globalThis.popup_edit_context = [];

                                    globalThis.popup_edit_context.secao_id = portfolio.id;
                                    globalThis.popup_edit_context.secao_ordem = secao_ordem;
                                    // TODO: Expensive, use id or something else
                                    globalThis.popup_edit_context.blob = secao_content[index].blob;
                                    globalThis.popup_edit_context.descricao =
                                        secao_content[index].descricao;

                                    const popup_delete_image_image = document.getElementById(
                                        "popup-delete-image-image"
                                    );

                                    if (!(popup_delete_image_image instanceof HTMLImageElement)) {
                                        console.error(`${this.name}: null check`);
                                        return;
                                    }

                                    popup_delete_image_image.src = secao_content[index].blob;
                                });
                                image_div.appendChild(remove_button);
                            }

                            content_blobs_scrool.appendChild(image_div);
                        }
                    } else {
                        let information = document.createElement("p");
                        information.classList.add(
                            "d-flex",
                            "w-100",
                            "p-4",
                            "m-0",
                            "g-0",
                            "align-items-center",
                            "justify-content-center"
                        );
                        information.innerText =
                            "Não há imagens cadastrados, edite o portfólio para adicionar uma!";
                        content_blobs_scrool.appendChild(information);
                    }

                    content_blobs.appendChild(content_blobs_scrool);
                    content_container.appendChild(content_blobs);

                    // edit.add
                    if (enable_edit) {
                        let content_add = document.createElement("div");
                        content_add.innerHTML += "<hr>";
                        let content_add_div_1 = document.createElement("div");
                        content_add_div_1.innerHTML = `<label class="form-label">Adicionar imagens</label>`;
                        content_add_div_1.classList.add(
                            "col-12",
                            "m-0",
                            "g-0",
                            "px-4",
                            "w-100",
                            "mb-3"
                        );
                        let content_add_div_1_input = document.createElement("input");
                        content_add_div_1_input.classList.add("form-control");
                        content_add_div_1_input.setAttribute("type", "file");
                        content_add_div_1.appendChild(content_add_div_1_input);
                        content_add.appendChild(content_add_div_1);

                        let content_add_div_2 = document.createElement("div");
                        content_add_div_2.classList.add("col-12", "m-0", "g-0", "px-4", "pb-4");

                        let content_add_div_2_button = document.createElement("button");
                        content_add_div_2_button.classList.add(
                            "btn",
                            "btn-outline-primary",
                            "text-decoration-none",
                            "w-100"
                        );
                        content_add_div_2_button.role = "button";
                        content_add_div_2_button.innerHTML = `<div class="d-flex justify-content-center m-2">
                        <img class="icon-24px fixed-filter-invert me-2"
                            src="static/action-icons/add.svg">
                            <p class="g-0 p-0 m-0">Adicionar imagens</p>
                    </div>`;
                        content_add_div_2_button.addEventListener("click", async () => {
                            if (!(content_add_div_1_input instanceof HTMLInputElement)) return;

                            if (
                                !content_add_div_1_input.files ||
                                !content_add_div_1_input.files.length
                            ) {
                                alert("Seleciona um arquivo!");
                                return;
                            }

                            const base64Image = await imageFileToBase64(
                                content_add_div_1_input.files[0]
                            );

                            if (!base64Image.startsWith("data:image/")) {
                                alert("Não é um arquivo de imagem!");
                                return null;
                            }

                            let form_id = portfolio.id;
                            let form_ordem = secao_ordem;

                            const form_porfolio = readPortfolio(form_id);

                            if (!form_porfolio) {
                                console.log(
                                    `ID0: Erro ao editar categoria do portfolio ${form_id}.`
                                );
                                return null;
                            }

                            if (!form_porfolio.secoes.length) {
                                console.log("ID1: Erro ao editar categoria.");
                                return null;
                            }

                            for (let index = 0; index < form_porfolio.secoes.length; index++) {
                                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                                    continue;
                                }

                                /// TODO: Add id
                                let content_tv = {
                                    blob: base64Image,
                                    descricao: "Imagem",
                                };

                                form_porfolio.secoes[index].contents.push(content_tv);
                                break;
                            }

                            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                                notifySectionDataChanged();
                            } else {
                                console.log("Ocorreu um erro ao atualizar o objeto!");
                            }
                        });
                        content_add_div_2.appendChild(content_add_div_2_button);
                        content_add.appendChild(content_add_div_2);
                        content_container.appendChild(content_add);
                    }
                }
                break;
            // categoriaId(2): Links
            case 2:
                {
                    let container_title = secao_nome || "Redes";
                    let container_subtitle = secao_descricao || "Links Externos"; // "Segue lá!"

                    let content_header = createSectionHeader(
                        "link",
                        "filter-link",
                        container_title,
                        container_subtitle
                    );
                    let content_container = createSectionContainer();
                    content_container.appendChild(content_header);

                    if (enable_edit) {
                        let content_actions = document.createElement("div");
                        content_actions.classList.add("ms-auto");

                        let content_button_edit = createActionButton("edit", () => {
                            preparePopup();
                            toggleDisplayNoneOnElement("popup-edit", false);

                            if (!globalThis.popup_edit_context) globalThis.popup_edit_context = [];

                            globalThis.popup_edit_context.secao_id = portfolio.id;
                            globalThis.popup_edit_context.secao_ordem = secao_ordem;
                            globalThis.popup_edit_context.secao_nome = container_title;
                            globalThis.popup_edit_context.secao_descricao = container_subtitle;

                            const html_popup_edit_name = document.getElementById("popup-edit-name");
                            const html_popup_edit_description =
                                document.getElementById("popup-edit-description");

                            if (
                                !(html_popup_edit_name instanceof HTMLButtonElement) ||
                                !(html_popup_edit_description instanceof HTMLButtonElement)
                            ) {
                                console.log(`${this.name}: null check`);
                                return null;
                            }

                            html_popup_edit_name.value = container_title;
                            html_popup_edit_description.value = container_subtitle;
                        });

                        let content_button_up = createActionButton("up", () => {
                            let form_id = portfolio.id;
                            let form_ordem = secao_ordem;

                            const form_porfolio = readPortfolio(form_id);

                            if (!form_porfolio) {
                                console.log(
                                    `ID0: Erro ao editar categoria do portfolio ${form_id}.`
                                );
                                return null;
                            }

                            if (!form_porfolio.secoes.length) {
                                console.log("ID1: Erro ao editar categoria.");
                                return null;
                            }

                            // TODO: Por enquanto a ordem no array é mais importante que o valor em json.ordem
                            // INFO: Aqui a ordem esta sendo utilizada como id da seção
                            // Verificar o maior valor para json.ordem
                            /*
                        let maior = 0;
                        form_porfolio.secoes.forEach(element => {
                            if (parseInt(element.ordem) > maior)
                                maior = element.ordem;
                        });

                        // TODO: Desabilitar botão quando no topo ou no final?
                        if (secao_ordem >= maior)
                            return null
                        */

                            for (
                                let index = 1;
                                index > 0 && index < form_porfolio.secoes.length;
                                index++
                            ) {
                                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                                    continue;
                                }

                                // Remove do array
                                let secao = form_porfolio.secoes.splice(index, 1)[0];
                                form_porfolio.secoes.splice(index - 1, 0, secao);
                                break;
                            }

                            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                                notifySectionDataChanged();
                            } else {
                                console.log("Ocorreu um erro ao atualizar o objeto!");
                            }
                        });

                        let content_button_down = createActionButton("down", () => {
                            let form_id = portfolio.id;
                            let form_ordem = secao_ordem;

                            const form_porfolio = readPortfolio(form_id);

                            if (!form_porfolio) {
                                console.log(
                                    `ID0: Erro ao editar categoria do portfolio ${form_id}.`
                                );
                                return null;
                            }

                            if (!form_porfolio.secoes.length) {
                                console.log("ID1: Erro ao editar categoria.");
                                return null;
                            }

                            // Verificar o maior valor para json.ordem
                            let maior = 0;
                            form_porfolio.secoes.forEach((element) => {
                                if (parseInt(element.ordem) > maior) maior = element.ordem;
                            });

                            // TODO: Desabilitar botão quando no topo ou no final?
                            if (secao_ordem >= maior) return null;

                            for (let index = 0; index < form_porfolio.secoes.length - 1; index++) {
                                if (parseInt(form_porfolio.secoes[index].ordem) != form_ordem) {
                                    continue;
                                }

                                // Remove do array
                                let secao = form_porfolio.secoes.splice(index, 1)[0];
                                form_porfolio.secoes.splice(index + 1, 0, secao);
                                break;
                            }

                            if (JSONQL_P.updatePortfolio(form_id, form_porfolio)) {
                                notifySectionDataChanged();
                            } else {
                                console.log("Ocorreu um erro ao atualizar o objeto!");
                            }
                        });

                        let content_button_delete = createActionButton("delete", () => {
                            preparePopup();
                            toggleDisplayNoneOnElement("popup-delete", false);

                            if (!globalThis.popup_edit_context) globalThis.popup_edit_context = [];

                            globalThis.popup_edit_context.secao_id = portfolio.id;
                            globalThis.popup_edit_context.secao_ordem = secao_ordem;

                            const popup_delete_name = document.getElementById("popup-delete-name");
                            const popup_delete_description = document.getElementById(
                                "popup-delete-description"
                            );

                            if (
                                !(popup_delete_name instanceof HTMLParagraphElement) ||
                                !(popup_delete_description instanceof HTMLParagraphElement)
                            ) {
                                console.error(`${this.name}: null check`);
                                return;
                            }

                            popup_delete_name.innerText = container_title;
                            popup_delete_description.innerText = container_subtitle;
                        });

                        content_actions.appendChild(content_button_edit);
                        content_actions.appendChild(content_button_up);
                        content_actions.appendChild(content_button_down);
                        content_actions.appendChild(content_button_delete);

                        content_header.appendChild(content_actions);
                    }

                    portfolio_secoes.appendChild(content_container);

                    let content_blobs = document.createElement("div");
                    content_blobs.classList.add(
                        "row",
                        "w-100",
                        "m-0",
                        "g-3",
                        "py-2",
                        "px-3",
                        "pb-4"
                    );

                    if (secao_content && secao_content.length) {
                        for (let index = 0; index < secao_content.length; index++) {
                            if (!secao_content[index].blob && !secao_content[index].descricao)
                                return null;

                            let link_div = document.createElement("div");
                            link_div.classList.add(
                                "col-12",
                                "col-sm-6",
                                "col-xl-4",
                                "position-relative"
                            );
                            link_div.innerHTML += `<a class="btn btn-primary text-decoration-none w-100" href="${secao_content[index].blob}" role="button">
                                <div class="d-flex justify-content-center m-2">
                                    <img class="icon-24px fixed-filter-invert me-2"
                                        src="static/action-icons/external.svg">
                                        <p class="g-0 p-0 m-0">${secao_content[index].descricao}</p>
                                </div>
                            </a>`;

                            if (enable_edit) {
                                let remove_button = document.createElement("button");
                                remove_button.innerHTML = `<img class="icon-dark icon-24px" src="static/action-icons/close.svg">`;
                                remove_button.classList.add(
                                    "icon-32px",
                                    "position-absolute",
                                    "top-0",
                                    "start-100",
                                    "translate-middle",
                                    "p-2",
                                    "border",
                                    "border-light",
                                    "rounded-circle",
                                    "d-flex",
                                    "justify-content-center",
                                    "align-items-center"
                                );
                                link_div.appendChild(remove_button);
                                remove_button.addEventListener("click", () => {
                                    preparePopup();
                                    toggleDisplayNoneOnElement("popup-delete-link", false);

                                    if (!globalThis.popup_edit_context)
                                        globalThis.popup_edit_context = [];

                                    globalThis.popup_edit_context.secao_id = portfolio.id;
                                    globalThis.popup_edit_context.secao_ordem = secao_ordem;
                                    // TODO: Expensive, use id or something else
                                    globalThis.popup_edit_context.blob = secao_content[index].blob;
                                    globalThis.popup_edit_context.descricao =
                                        secao_content[index].descricao;

                                    const popup_delete_link_url =
                                        document.getElementById("popup-delete-link-url");
                                    const popup_delete_link_description = document.getElementById(
                                        "popup-delete-link-description"
                                    );

                                    if (
                                        !(popup_delete_link_url instanceof HTMLParagraphElement) ||
                                        !(
                                            popup_delete_link_description instanceof
                                            HTMLParagraphElement
                                        )
                                    ) {
                                        return;
                                    }

                                    popup_delete_link_url.innerText = secao_content[index].blob;
                                    popup_delete_link_description.innerText =
                                        secao_content[index].descricao;
                                });
                            }

                            content_blobs.appendChild(link_div);
                        }
                    } else {
                        let information = document.createElement("p");
                        information.classList.add(
                            "d-flex",
                            "w-100",
                            "p-4",
                            "m-0",
                            "g-0",
                            "align-items-center",
                            "justify-content-center"
                        );
                        information.innerText =
                            "Não há links cadastrados, edite o portfólio para adicionar um!";
                        content_blobs.appendChild(information);
                    }

                    if (enable_edit) {
                        let add_new_link = document.createElement("div");
                        add_new_link.classList.add("col-12");

                        let add_new_link_button = document.createElement("button");
                        add_new_link_button.classList.add(
                            "btn",
                            "btn-outline-primary",
                            "text-decoration-none",
                            "w-100"
                        );
                        add_new_link_button.addEventListener("click", () => {
                            if (!globalThis.popup_edit_context) globalThis.popup_edit_context = [];

                            globalThis.popup_edit_context.secao_id = portfolio.id;
                            globalThis.popup_edit_context.secao_ordem = secao_ordem;

                            preparePopup();
                            toggleDisplayNoneOnElement("popup-add-link", false);
                        });
                        add_new_link_button.innerHTML = `<div class="d-flex justify-content-center m-2">
                                    <img class="icon-24px fixed-filter-invert me-2"
                                        src="static/action-icons/add.svg">
                                        <p class="g-0 p-0 m-0">Adicionar link</p>
                                </div>`;

                        add_new_link.appendChild(add_new_link_button);
                        content_blobs.appendChild(add_new_link);
                    }
                    content_container.appendChild(content_blobs);
                }
                break;
        }
    });
}

function setupPortfolioSetup() {
    toggleDisplayNoneOnElement("portfolio-setup", false);

    // let portfolio_setup_select = document.getElementById("portfolio-setup-select")
    let portfolio_setup_select_select = document.getElementById("portfolio-setup-select-select");
    let portfolio_setup_select_btn = document.getElementById("portfolio-setup-select-btn");
    // let portfolio_setup_create = document.getElementById("portfolio-setup-create")
    let portfolio_setup_create_select = document.getElementById("portfolio-setup-create-select");
    let portfolio_setup_create_btn = document.getElementById("portfolio-setup-create-btn");
    let portfolio_setup_dev_btn = document.getElementById("portfolio-setup-dev-btn");

    if (
        !(portfolio_setup_select_select instanceof HTMLSelectElement) ||
        !(portfolio_setup_select_btn instanceof HTMLButtonElement) ||
        !(portfolio_setup_create_select instanceof HTMLSelectElement) ||
        !(portfolio_setup_create_btn instanceof HTMLButtonElement) ||
        !(portfolio_setup_dev_btn instanceof HTMLButtonElement)
    ) {
        console.error(`${this.name}: null check`);
        return;
    }
    let portfolios = JSONQL_P.readPortfolios();
    let usuarios = JSONQL_U.readUsuarios();

    // Não configura portfolios
    if (portfolios && portfolios.length) {
        // Reseta as opções
        console.log(portfolio_setup_select_select);
        console.log(portfolios);
        // portfolio_setup_select_select.innerHTML = ""
        for (let index = 0; index < portfolios.length; index++) {
            let option = document.createElement("option");
            option.value = portfolios[index].id;
            option.innerText = `Portfólio de id(${portfolios[index].id})`;
            portfolio_setup_select_select.appendChild(option);
        }
        portfolio_setup_select_btn.classList.remove("disabled");
        portfolio_setup_select_btn.addEventListener("click", () => {
            // Abrir o portfólio de id $?
            let userId = parseInt(portfolio_setup_select_select.value);
            setIdParam(userId);
        });
    } else {
        let option = document.createElement("option");
        option.innerText = `Nenhum portfólio criado!`;
        portfolio_setup_select_select.appendChild(option);
    }

    // console.log(portfolio_setup_create_select);
    // console.log(usuarios);
    if (usuarios && usuarios.length) {
        // Reseta as opções
        // portfolio_setup_create_select.innerHTML = ""
        for (let index = 0; index < usuarios.length; index++) {
            let option = document.createElement("option");
            option.value = usuarios[index].id;
            option.innerText = `Usuário id(${usuarios[index].id}): ${usuarios[index].nome}`;
            portfolio_setup_create_select.appendChild(option);
        }
        portfolio_setup_create_btn.classList.remove("disabled");
        portfolio_setup_create_btn.addEventListener("click", () => {
            // Criar portfólio para o usuário de id $?
            let userId = parseInt(portfolio_setup_create_select.value);
            let portfolioId = JSONQL_P.createPortfolio({
                usuarioId: userId,
                secoes: [],
            });

            if (!portfolioId) {
                console.error("Não foi possível criar o portfólio");
            } else {
                setIdParam(portfolioId);
            }
            // console.log("creating");
            // portfolioId = parseInt(portfolioId)
            // const url = new URL(window.location.href);
            // window.location.href = `${url.origin}${url.pathname}?id=${portfolioId}`;
        });
    } else {
        let option = document.createElement("option");
        option.innerText = `Nenhum usuário criado!`;
        portfolio_setup_create_select.appendChild(option);
    }

    portfolio_setup_dev_btn.addEventListener("click", async () => {
        // Utilizar a página 'dev.js'
        await Faker.criarNUsuarios(30);
        await Faker.criarNServicos(60);
        await Faker.criarNContratos(90);
        await Faker.criarNAvaliacoes(120);
        // Faker.createPortfolios(30);
        notifySectionDataChanged();
    });
}

function validateEntry() {
    let params = new URLSearchParams(location.search);
    // ?id=:id
    let id = ensureInteger(params.get("id"));
    // ?edit=true
    let edit = params.get("edit") === "true";

    if (id) {
        // Se tem ?id, carrega as informações do portfolio
        setupPortfolioPage(id, edit);
    } else {
        setupPortfolioSetup();
    }
}

validateEntry();
