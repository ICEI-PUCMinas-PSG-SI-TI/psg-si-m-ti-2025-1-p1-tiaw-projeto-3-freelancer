//@ts-check

import * as Faker from "./lib/faker.mjs";
import { ensureInteger, isNonEmptyString } from "./tools.mjs";
import { assertBase64ConvertableImage, imageFileToBase64 } from "./lib/tools.mjs";
import { assertBoolean, assertStringNonEmpty } from "./lib/validate.mjs";

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

// TODO: Mover adicionar-imagens para um popup
// TODO: Criar popups dinamicamente e remove-los do html

class AddSectionContext {
    /**
     * @param {string} portfolioId
     */
    constructor(portfolioId) {
        this.portfolioId = portfolioId;
    }
}

class EditSectionInfoContext {
    /**
     * @param {string} portfolioId
     * @param {number} sectionId
     * @param {string} name
     * @param {string} description
     */
    constructor(portfolioId, sectionId, name, description) {
        this.portfolioId = portfolioId;
        this.sectionId = sectionId;
        // TODO: Optional? (for delete)
        this.name = name;
        this.description = description;
    }
}

class EditSectionPositionContext {
    /**
     * @param {string} portfolioId
     * @param {number} sectionId
     * @param {string} name
     * @param {string} description
     * @param {number} move
     */
    constructor(portfolioId, sectionId, name, description, move) {
        this.portfolioId = portfolioId;
        this.sectionId = sectionId;
        this.name = name;
        this.description = description;
        // down = int(-1), up = int(1)
        this.direction = move;
    }

    // mom, can we have static const?
    // no, we already have static const at home
    // at home:
    static get MOVE_UP() {
        return 1;
    }

    static get MOVE_DOWN() {
        return -1;
    }
}

class AddLinkContext {
    /**
     * @param {string} portfolioId
     * @param {number} sectionId
     */
    constructor(portfolioId, sectionId) {
        this.portfolioId = portfolioId;
        this.sectionId = sectionId;
    }
}

class DeleteBlobContext {
    /**
     * @param {string} portfolioId
     * @param {number} sectionId
     * @param {any} blob
     * @param {string} description
     */
    constructor(portfolioId, sectionId, blob, description) {
        this.portfolioId = portfolioId;
        this.sectionId = sectionId;
        this.blob = blob;
        this.description = description;
    }
}

class Context {
    constructor() {
        this.context = {};
    }

    /**
     * @param {AddSectionContext | EditSectionInfoContext | AddLinkContext | DeleteBlobContext | DeleteBlobContext} context
     */
    setupContext(context) {
        if (
            context instanceof AddSectionContext ||
            context instanceof EditSectionInfoContext ||
            context instanceof AddLinkContext ||
            context instanceof DeleteBlobContext
        )
            this.context = context;
    }

    getContext() {
        if (Object.keys(this.context).length === 0) return null;
        else return this.context;
    }

    resetContext() {
        this.context = {};
    }
}

const context = new Context();

/**
 *
 * @param {AddSectionContext} addSectionContext
 */
function triggerAddSection(addSectionContext) {
    if (!(addSectionContext instanceof AddSectionContext)) return;

    preparePopup();
    toggleDisplayNoneOnElement("popup-add", false);

    context.setupContext(addSectionContext);
}

/**
 *
 * @param {EditSectionInfoContext} deleteSectionContext
 */
function triggerDeleteSection(deleteSectionContext) {
    if (!(deleteSectionContext instanceof EditSectionInfoContext)) return;

    preparePopup();
    toggleDisplayNoneOnElement("popup-delete", false);

    const popupDeleteName = document.getElementById("popup-delete-name");
    const popupDeleteDescription = document.getElementById("popup-delete-description");

    if (
        !(popupDeleteName instanceof HTMLParagraphElement) ||
        !(popupDeleteDescription instanceof HTMLParagraphElement)
    )
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    popupDeleteName.innerText = deleteSectionContext.name;
    popupDeleteDescription.innerText = deleteSectionContext.description;

    context.setupContext(deleteSectionContext);
}

/**
 *
 * @param {EditSectionInfoContext} editSectionContext
 */
function triggerEditSectionInfo(editSectionContext) {
    if (!(editSectionContext instanceof EditSectionInfoContext)) return;

    preparePopup();
    toggleDisplayNoneOnElement("popup-edit", false);

    const popupEditName = document.getElementById("popup-edit-name");
    const popupEditDescription = document.getElementById("popup-edit-description");

    if (
        !(popupEditName instanceof HTMLInputElement) ||
        !(popupEditDescription instanceof HTMLInputElement)
    )
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    popupEditName.value = editSectionContext.name;
    popupEditDescription.value = editSectionContext.description;

    context.setupContext(editSectionContext);
}

/**
 * @param {AddLinkContext} addLinkContext
 */
function triggerAddLink(addLinkContext) {
    if (!(addLinkContext instanceof AddLinkContext)) return;

    context.setupContext(addLinkContext);

    preparePopup();
    toggleDisplayNoneOnElement("popup-add-link", false);

    context.setupContext(addLinkContext);
}

/**
 * @param {DeleteBlobContext} deleteLinkContext
 */
function triggerDeleteLink(deleteLinkContext) {
    if (!(deleteLinkContext instanceof DeleteBlobContext)) return;

    preparePopup();
    toggleDisplayNoneOnElement("popup-delete-link", false);

    const popupDeleteLinkUrl = document.getElementById("popup-delete-link-url");
    const popupDeleteLinkDescription = document.getElementById("popup-delete-link-description");

    if (
        !(popupDeleteLinkUrl instanceof HTMLParagraphElement) ||
        !(popupDeleteLinkDescription instanceof HTMLParagraphElement)
    ) {
        return;
    }

    popupDeleteLinkUrl.innerText = deleteLinkContext.blob;
    popupDeleteLinkDescription.innerText = deleteLinkContext.description;

    context.setupContext(deleteLinkContext);
}

/**
 * @param {DeleteBlobContext} deleteImageContext
 */
function triggerDeleteImage(deleteImageContext) {
    if (!(deleteImageContext instanceof DeleteBlobContext)) return;

    preparePopup();
    toggleDisplayNoneOnElement("popup-delete-image", false);

    const popupDeleteImageImage = document.getElementById("popup-delete-image-image");

    if (!(popupDeleteImageImage instanceof HTMLImageElement))
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    popupDeleteImageImage.src = deleteImageContext.blob;

    context.setupContext(deleteImageContext);
}

async function commitAddAsection() {
    const _context = context.getContext();

    if (!(_context instanceof AddSectionContext)) return;

    const { portfolioId } = _context;
    const htmlPopupAddName = document.getElementById("popup-add-name");
    const htmlPopupAddDescription = document.getElementById("popup-add-description");
    const htmlPopupAddCategoria = document.getElementById("popup-add-categoria");

    if (
        !portfolioId ||
        !(htmlPopupAddName instanceof HTMLInputElement) ||
        !(htmlPopupAddDescription instanceof HTMLInputElement) ||
        !(htmlPopupAddCategoria instanceof HTMLSelectElement)
    )
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    const formSectionName = htmlPopupAddName.value;
    const formSectionDescription = htmlPopupAddDescription.value;
    const formSectionCategoria = htmlPopupAddCategoria.value;

    const _portfolio = await crudPortfolios.lerPortfolio(portfolioId);
    if (!_portfolio) throw new Error(`Não foi possível encontrar o portfólio de ID ${portfolioId}`);

    if (!formSectionName) throw new Error("O nome da seção não pode estar vazio!");

    // Como estamos adicionando uma seção, não é problema se ela esta vazia
    if (!_portfolio.secoes?.length) _portfolio.secoes = [];

    // Verificar o maior valor para json.ordem
    let ultimaSecao = _portfolio.secoes.reduce((pV, i) => (i.ordem > pV.ordem ? i : pV));

    _portfolio.secoes.push({
        ordem: ultimaSecao?.ordem || 1,
        nome: formSectionName,
        descricao: formSectionDescription || "",
        categoriaId: parseInt(formSectionCategoria, 10),
        contents: [],
    });

    crudPortfolios
        .atualizarPortfolio(_portfolio)
        .then(() => {
            toggleDisplayNoneOnElement("popup-add", true);
            notifySectionDataChanged();
        })
        .catch(() => console.error("Ocorreu um erro ao atualizar o objeto!"));
}

async function commitDeleteSection() {
    const _context = context.getContext();

    if (!_context || !(_context instanceof EditSectionInfoContext)) return;

    const _portfolioId = _context.portfolioId;
    const _sectionId = ensureInteger(_context.sectionId);

    if (!_portfolioId || !_sectionId) return;

    const _portfolio = await crudPortfolios.lerPortfolio(_portfolioId);
    if (!_portfolio?.secoes.length) {
        console.error(`Erro ao editar o portfólio ${_portfolioId}.`);
        return;
    }

    for (let i = 0; i < _portfolio.secoes.length; i++) {
        if (ensureInteger(_portfolio.secoes[i].ordem) === _sectionId) {
            _portfolio.secoes.splice(i, 1);
            break;
        }
    }

    crudPortfolios
        .atualizarPortfolio(_portfolio)
        .then(() => {
            toggleDisplayNoneOnElement("popup-delete", true);
            context.resetContext();
            notifySectionDataChanged();
        })
        .catch((err) => console.error(`Ocorreu um erro ao atualizar o objeto: ${err}`));
}

async function commitEditSectionInfo() {
    const _context = context.getContext();

    if (!_context || !(_context instanceof EditSectionInfoContext)) return;

    const htmlPopupEditName = document.getElementById("popup-edit-name");
    const htmlPopupEditDescription = document.getElementById("popup-edit-description");

    if (
        !(htmlPopupEditName instanceof HTMLInputElement) ||
        !(htmlPopupEditDescription instanceof HTMLInputElement)
    ) {
        console.error("Algum elemento HTML não pode ser encontrado!");
        return;
    }

    const newName = htmlPopupEditName.value;
    // Pode ser vazio
    const newDescription = htmlPopupEditDescription.value;

    if (!isNonEmptyString(newName)) {
        alert("O campo 'nome' não pode ser vazio!");
        return;
    }

    const _portfolioId = _context.portfolioId;
    const _sectionId = ensureInteger(_context.sectionId);

    if (!_portfolioId || !_sectionId) return;

    const _portfolio = await crudPortfolios.lerPortfolio(_portfolioId);

    if (!_portfolio?.secoes.length) {
        console.error(`ID0: Erro ao editar categoria do portfolio ${_portfolioId}.`);
        return;
    }

    for (const element of _portfolio.secoes) {
        if (ensureInteger(element.ordem) === _sectionId) {
            element.nome = newName;
            element.descricao = newDescription;
            break;
        }
    }

    crudPortfolios
        .atualizarPortfolio(_portfolio)
        .then(() => {
            toggleDisplayNoneOnElement("popup-edit", true);
            context.resetContext();
            notifySectionDataChanged();
        })
        .catch((err) => console.error(`Ocorreu um erro ao atualizar o objeto: ${err}`));
}

/**
 *
 * @param {EditSectionPositionContext} editSectionPositionContext
 */
async function commitEditSectionPosition(editSectionPositionContext) {
    if (!(editSectionPositionContext instanceof EditSectionPositionContext)) return;

    const { portfolioId, sectionId } = editSectionPositionContext;
    if (!portfolioId || !sectionId) return;

    const _portfolio = await crudPortfolios.lerPortfolio(portfolioId);
    if (!_portfolio?.secoes.length) {
        console.error(`ID0: Erro ao editar categoria do portfolio ${portfolioId}.`);
        return;
    }

    // TODO: Desabilitar botão quando no topo ou no final?
    switch (editSectionPositionContext.direction) {
        case EditSectionPositionContext.MOVE_UP:
            // INFO: Aqui a ordem esta sendo utilizada como id da seção
            // TODO: Por enquanto a ordem no array é mais importante que o valor em json.ordem
            for (let i = 1; i > 0 && i < _portfolio.secoes.length; i++) {
                if (_portfolio.secoes[i].ordem === sectionId) {
                    // Remove do array
                    let secao = _portfolio.secoes.splice(i, 1)[0];
                    // Adiciona uma posição antes
                    _portfolio.secoes.splice(i - 1, 0, secao);
                    break;
                }
            }
            break;
        case EditSectionPositionContext.MOVE_DOWN:
            for (let i = 0; i < _portfolio.secoes.length - 1; i++) {
                if (_portfolio.secoes[i].ordem === sectionId) {
                    // Remove do array
                    let secao = _portfolio.secoes.splice(i, 1)[0];
                    // Adiciona um posição depois
                    _portfolio.secoes.splice(i + 1, 0, secao);
                    break;
                }
            }
            break;
        default:
            return;
    }

    crudPortfolios
        .atualizarPortfolio(_portfolio)
        .then(() => notifySectionDataChanged())
        .catch((err) => console.error(`Ocorreu um erro ao atualizar o objeto: ${err.message}`));
}

async function commitAddLink() {
    const _context = context.getContext();

    if (!(_context instanceof AddLinkContext)) return;

    const { portfolioId, sectionId } = _context;

    if (!portfolioId || !sectionId) return;

    const popupAddLinkURL = document.getElementById("popup-add-link-url");
    const popupAddLinkDescription = document.getElementById("popup-add-link-description");

    if (
        !(popupAddLinkURL instanceof HTMLInputElement) ||
        !(popupAddLinkDescription instanceof HTMLInputElement)
    )
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    let newURL = popupAddLinkURL.value;
    let newDescription = popupAddLinkDescription.value;

    const _portfolio = await crudPortfolios.lerPortfolio(portfolioId);
    if (!_portfolio?.secoes.length)
        throw new Error(`ID0: Erro ao editar categoria do portfolio ${portfolioId}.`);

    // TODO: useregex?
    if (!(newURL.startsWith("https://") || newURL.startsWith("http://"))) {
        alert("URL não é valida!\n\nA URL não começa com 'http://' ou 'https://'");
        return;
    } else if (
        (newURL.startsWith("https://") && newURL.length === 8) ||
        (newURL.startsWith("http://") && newURL.length === 7)
    ) {
        alert("URL não é valida!\n\nA URL esta vazia!");
        return;
    }

    for (const element of _portfolio.secoes) {
        if (parseInt(element.ordem, 10) !== sectionId) {
            element.contents.push({
                blob: newURL || "",
                descricao: newDescription || "",
            });
            break;
        }
    }

    crudPortfolios
        .atualizarPortfolio(_portfolio)
        .then(() => {
            toggleDisplayNoneOnElement("popup-add-link", true);
            context.resetContext();
            notifySectionDataChanged();
        })
        .catch((err) => console.error(`Ocorreu um erro ao atualizar o objeto: ${err}`));
}

async function commitDeleteBlob() {
    const _context = context.getContext();
    if (!(_context instanceof DeleteBlobContext)) throw new Error("O contexto é inválido");

    // TODO: Expensive, use id or something else
    const { portfolioId, sectionId, blob, description } = _context;

    if (!portfolioId || !sectionId) throw new Error("As informações do contexto são invalidas!");

    const _portfolio = await crudPortfolios.lerPortfolio(portfolioId);

    if (!_portfolio?.secoes.length) throw new Error("Nenhuma seção encontrada!");

    let i = _portfolio.secoes.findIndex((element) => element.ordem === sectionId);
    if (i === -1 || !_portfolio.secoes[i]?.contents.length)
        throw new Error("Seção não encontrada.");

    let procurando = true;
    for (let j = 0; j < _portfolio.secoes[i].contents.length && procurando; j++) {
        if (
            _portfolio.secoes[i].contents[j].blob === blob &&
            _portfolio.secoes[i].contents[j].descricao === description
        ) {
            _portfolio.secoes[i].contents.splice(j, 1);
            procurando = false;
        }
    }

    if (procurando) throw new Error("Valores não encontrados.");

    return _portfolio;
}

async function commitDeleteLink() {
    try {
        const portfolio = await commitDeleteBlob();
        crudPortfolios.atualizarPortfolio(portfolio).then(() => {
            toggleDisplayNoneOnElement("popup-delete-link", true);
            notifySectionDataChanged();
        });
    } catch (err) {
        console.error(`Ocorreu um erro ao atualizar o objeto: ${err.message}`);
    }
}

// TODO: Rework this
/**
 * @param {string} portfolioId
 * @param {number} sectionId
 * @param {Blob} blob
 */
async function commitAddImage(portfolioId, sectionId, blob) {
    const base64Image = await imageFileToBase64(blob);

    if (!base64Image.startsWith("data:image/")) {
        alert("Não é um arquivo de imagem!");
        return;
    }

    if (!portfolioId || !sectionId) return;

    const _portfolio = await crudPortfolios.lerPortfolio(portfolioId);

    if (!_portfolio?.secoes.length) throw new Error("Nenhuma seção encontrada!");

    for (const element of _portfolio.secoes) {
        if (ensureInteger(element.ordem) === sectionId) {
            element.contents.push({
                // TODO: Add id
                blob: base64Image,
                descricao: "Imagem",
            });
        }
    }

    crudPortfolios
        .atualizarPortfolio(_portfolio)
        .then(() => notifySectionDataChanged())
        .catch((err) => console.error(`Ocorreu um erro ao atualizar o objeto: ${err}`));
}

async function commitDeleteImage() {
    try {
        const portfolio = await commitDeleteBlob();
        crudPortfolios.atualizarPortfolio(portfolio).then(() => {
            toggleDisplayNoneOnElement("popup-delete-image", true);
            notifySectionDataChanged();
        });
    } catch (err) {
        console.error(`Ocorreu um erro ao atualizar o objeto: ${err}`);
    }
}

/**
 * @returns {HTMLDivElement}
 */
function createSectionContainer() {
    let sectionContainer = document.createElement("div");
    sectionContainer.classList.add("card", "w-100", "overflow-hidden", "space-0", "mb-3");
    return sectionContainer;
}

/**
 *
 * @param {string} icon
 * @param {string} iconClass
 * @param {string} title
 * @param {string} subtitle
 * @returns {HTMLDivElement}
 */
function createSectionHeader(icon, iconClass, title, subtitle) {
    let sectionHeader = document.createElement("div");
    sectionHeader.classList.add(
        "card-header",
        "p-3",
        "d-flex",
        "align-items-center",
        "justify-content-start",
    );
    sectionHeader.innerHTML = `<div>
            <img class="icon-32px me-3 ${iconClass}" src="static/icons/${icon}.svg">
        </div><div>
            <h5 class="card-title">${title}</h5>
            <h6 class="card-subtitle mb-0 pb-0 text-body-secondary">${subtitle}</h6>
        </div>`;
    return sectionHeader;
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

/**
 * @returns {HTMLDivElement}
 * @param {string} portfolioId
 * @param {number} sectionId
 * @param {string} name
 * @param {string} description
 */
function createActionMenu(portfolioId, sectionId, name, description) {
    let contentActions = document.createElement("div");
    contentActions.classList.add("ms-auto");

    let contentButtonEdit = createActionButton("edit", () =>
        triggerEditSectionInfo(
            new EditSectionInfoContext(portfolioId, sectionId, name, description),
        ),
    );

    let contentButtonUp = createActionButton("up", () =>
        commitEditSectionPosition(
            new EditSectionPositionContext(
                portfolioId,
                sectionId,
                name,
                description,
                EditSectionPositionContext.MOVE_UP,
            ),
        ),
    );

    let contentButtonDown = createActionButton("down", () =>
        commitEditSectionPosition(
            new EditSectionPositionContext(
                portfolioId,
                sectionId,
                name,
                description,
                EditSectionPositionContext.MOVE_DOWN,
            ),
        ),
    );

    let contentButtonDelete = createActionButton("delete", () =>
        triggerDeleteSection(new EditSectionInfoContext(portfolioId, sectionId, name, description)),
    );

    contentActions.appendChild(contentButtonEdit);
    contentActions.appendChild(contentButtonUp);
    contentActions.appendChild(contentButtonDown);
    contentActions.appendChild(contentButtonDelete);

    return contentActions;
}

/**
 * @param {string} portfolioId
 * @param {number} sectionId
 */
function createAddLinkSubSection(portfolioId, sectionId) {
    let addNewLink = document.createElement("div");
    addNewLink.classList.add("col-12");

    let addNewLinkButton = document.createElement("button");
    addNewLinkButton.classList.add("btn", "btn-outline-primary", "text-decoration-none", "w-100");
    addNewLinkButton.addEventListener("click", () =>
        triggerAddLink(new AddLinkContext(portfolioId, sectionId)),
    );

    addNewLinkButton.innerHTML = `<div class="d-flex justify-content-center m-2">
        <img class="icon-24px fixed-filter-invert me-2"
            src="static/action-icons/add.svg">
        <p class="space-0">Adicionar link</p>
    </div>`;

    addNewLink.appendChild(addNewLinkButton);
    return addNewLink;
}

function createNoLinkSubSection() {
    let information = document.createElement("p");
    information.classList.add("d-flex", "w-100", "space-0", "p-4", "center-xy");
    information.innerText = "Não há links cadastrados, edite o portfólio para adicionar um!";
    return information;
}

/**
 * @param {boolean} edit
 */
function createEditPortfolioButton(edit) {
    const _edit = edit === true;

    const button = document.createElement("button");
    button.classList.add(
        "btn",
        "btn-outline-primary",
        "d-flex",
        "flex-row",
        "center-xy",
        "space-0",
        "w-100",
        "p-2",
    );

    let toggleEditElementImg = document.createElement("img");
    let toggleEditElementP = document.createElement("p");
    toggleEditElementImg.classList.add("icon-dark", "icon-24px", "space-0", "me-2");
    toggleEditElementP.classList.add("space-0");

    if (_edit) {
        toggleEditElementImg.src = "static/action-icons/close.svg";
        toggleEditElementP.innerText = "Finalizar edição";
    } else {
        toggleEditElementImg.src = "static/action-icons/edit.svg";
        toggleEditElementP.innerText = "Editar portfólio";
    }

    button.appendChild(toggleEditElementImg);
    button.appendChild(toggleEditElementP);
    button.addEventListener("click", () => toggleEditParam(!_edit));

    return button;
}

// TODO: Improve this: get only needed contracts
// TODO: select * where userId = userId
/**
 * @param {string} userId
 * @returns {Promise<number | null>}
 */
async function getMediaAvaliacoes(userId) {
    assertStringNonEmpty(userId);

    let avaliacoes = await crudAvaliacoes.lerAvaliacoes();
    // Sem avaliações
    if (!avaliacoes?.length) return null;

    let media = 0;
    let quantidade = 0;
    for (const element of avaliacoes) {
        const contratado = await crudContratos.lerContrato(element.contratoId);
        if (contratado && contratado === userId) {
            media += element.nota;
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

/**
 * @param {string} elementId
 * @param {boolean} enableDisplayNone
 */
function toggleDisplayNoneOnElement(elementId, enableDisplayNone) {
    assertStringNonEmpty(elementId);
    if (typeof elementId !== "string") return;

    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLElement)) return;

    if (typeof enableDisplayNone === "boolean") {
        enableDisplayNone ? element.classList.add("d-none") : element.classList.remove("d-none");

        return;
    }

    element.classList.toggle("d-none");
}

// @AI-Gemini
/**
 * @param {boolean} enable
 */
function toggleEditParam(enable) {
    if (typeof enable !== "boolean") return;

    // Get the current URL
    const url = new URL(window.location.href);
    // Get the search parameters
    const params = new URLSearchParams(url.search);

    if (enable) {
        // Set a new parameter or modify an existing one
        params.set("edit", "true");
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
// TODO: Improve this piece of code
function setIdParam(id) {
    if (!id) throw new Error("Nenhuma id informada");

    // Get the current URL
    const url = new URL(window.location.href);
    // Get the search parameters
    const params = new URLSearchParams(url.search);
    if (id) {
        params.set("id", id.toString());
        window.location.href = `${url.origin}${url.pathname}?${params.toString()}${url.hash}`;
    } else {
        // Navega para a pagina sem parametros
        window.location.href = `${url.origin}${url.pathname}`;
    }
}

/**
 * @param {string} portfolioId
 * @param {number} sectionId
 * @param {string} sectionName
 * @param {string} sectionDescription
 * @param {boolean} enableEdit
 * @param {string} portfolioUserId
 * @returns {Promise<HTMLElement>}
 */
async function createReviewSection(
    portfolioId,
    sectionId,
    sectionName,
    sectionDescription,
    enableEdit,
    portfolioUserId,
) {
    assertStringNonEmpty(portfolioId);
    const _sectionId = ensureInteger(sectionId);
    const _portfolioUserId = portfolioUserId;

    if (!_sectionId || !_portfolioUserId) throw new Error("Object is null");

    const _sectionName = sectionName || "Avaliações";
    const _sectionDescription = sectionDescription || "Clientes satisfeitos!";

    const sectionHeader = createSectionHeader(
        "star",
        "filter-star",
        _sectionName,
        _sectionDescription,
    );

    let contentContainer = createSectionContainer();
    contentContainer.appendChild(sectionHeader);

    if (enableEdit) {
        sectionHeader.appendChild(
            createActionMenu(portfolioId, _sectionId, _sectionName, _sectionDescription),
        );
    }

    let contentBlobs = document.createElement("div");
    contentBlobs.classList.add("row", "w-100", "space-0", "py-3", "scrool-container");

    let contentBlobsScrool = document.createElement("div");
    contentBlobsScrool.classList.add("px-3");

    let avaliacoes = await crudAvaliacoes.lerAvaliacoes();
    if (!avaliacoes?.length) {
        let information = document.createElement("p");
        information.classList.add("d-flex", "w-100", "space-0", "p-4", "center-xy");
        information.innerHTML = `Não há avaliações para este usuário, você pode utilizar a&nbsp;<a href="/dev">página de desenvolvimento</a>&nbsp;para gerar uma avaliação.`;
        contentBlobsScrool.appendChild(information);
    } else {
        // Lê todas as avaliações
        // TODO: Otimizar > Informações do serviço da avaliação
        avaliacoes.forEach(async (avaliacao) => {
            const comentario = avaliacao.comentario.substring(0, 200);
            const nota = avaliacao.nota;
            const contratanteId = avaliacao.contratanteId;
            // Pega o contratoId da avaliação e filtra
            const _contatoId = avaliacao.contratoId;
            if (!_contatoId) return;

            const contrato = await crudContratos.lerContrato(_contatoId);
            if (!contrato) return;

            const contratadoId = contrato.contratadoId;
            const _servicoId = String(contrato.servicoId);
            if (!contratadoId || !_servicoId) return;

            // A partir daqui, continue apenas os contratos que possuem a mesma id que o usuario do portfolio
            if (contratadoId.toString() !== _portfolioUserId.toString()) return;

            const service = await crudServicos.lerServico(_servicoId);
            if (!service) return;

            const user = await crudUsuarios.lerUsuario(contratanteId);
            if (!user) return;

            // TODO: replace 'placeholder_profile'
            contentBlobsScrool.innerHTML += `<div class="d-inline-block float-none me-3">
                <a class="text-decoration-none space-0" href="#">
                    <div class="card">
                        <div class="card-body">
                            <div class="row card-aval-limit">
                                <div class="d-flex justify-content-start align-items-center pb-2">
                                    <div class="me-2">
                                        <img class="icon-32px" src="static/img/placeholder_profile.png"> 
                                    </div>
                                    <div class="max-width-80">
                                        <h6 class="text-truncate">${user.nome}</h6>
                                        <p class="space-0 text-truncate">⭐ ${nota} - ${service.titulo}</p>
                                    </div>
                                </div>
                                <hr>
                                <div class="col-12">
                                    <p class="text-wrap space-0">${comentario}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>`;
        });
    }

    contentBlobs.appendChild(contentBlobsScrool);
    contentContainer.appendChild(contentBlobs);

    return contentContainer;
}

/**
 * @param {string} portfolioId
 * @param {number} sectionId
 * @param {string} sectionName
 * @param {string} sectionDescription
 * @param {boolean} enableEdit
 * @param {any[]} content
 * @returns {HTMLDivElement|void}
 */
function createImageSection(
    portfolioId,
    sectionId,
    sectionName,
    sectionDescription,
    enableEdit,
    content,
) {
    const _sectionId = ensureInteger(sectionId);

    if (!portfolioId || !_sectionId) throw new Error("Object is null!");

    const _sectionName = sectionName || "Imagens";
    const _sectionDescription = sectionDescription || "Seção de imagens";

    const sectionHeader = createSectionHeader(
        "images",
        "filter-images",
        sectionName,
        sectionDescription,
    );

    if (enableEdit) {
        sectionHeader.appendChild(
            createActionMenu(portfolioId, _sectionId, _sectionName, _sectionDescription),
        );
    }

    const contentContainer = createSectionContainer();
    contentContainer.appendChild(sectionHeader);

    let contentBlobs = document.createElement("div");
    contentBlobs.classList.add("row", "w-100", "space-0", "py-3", "scrool-container");

    let contentBlobsScrool = document.createElement("div");
    contentBlobsScrool.classList.add("px-3");

    if (content?.length) {
        content.forEach((element) => {
            if (!element.blob || !element.descricao) return;

            let imageDiv = document.createElement("div");
            imageDiv.classList.add("me-3", "d-inline-block", "position-relative");
            imageDiv.innerHTML += `<img class="img-thumbnail images" src="${element.blob}">`;

            // edit.remove
            if (enableEdit) {
                let removeButton = document.createElement("button");
                removeButton.innerHTML = `<img class="icon-dark icon-24px" src="static/action-icons/close.svg">`;
                removeButton.classList.add(
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
                    "center-xy",
                );
                removeButton.addEventListener("click", () =>
                    triggerDeleteImage(
                        new DeleteBlobContext(
                            portfolioId,
                            _sectionId,
                            element.blob,
                            element.descricao,
                        ),
                    ),
                );
                imageDiv.appendChild(removeButton);
            }

            contentBlobsScrool.appendChild(imageDiv);
        });
    } else {
        let information = document.createElement("p");
        information.classList.add("d-flex", "w-100", "space-0", "p-4", "center-xy");
        information.innerText = "Não há imagens cadastrados, edite o portfólio para adicionar uma!";
        contentBlobsScrool.appendChild(information);
    }

    contentBlobs.appendChild(contentBlobsScrool);
    contentContainer.appendChild(contentBlobs);

    // edit.add
    if (enableEdit) {
        let ContentAdd = document.createElement("div");
        ContentAdd.innerHTML += "<hr>";
        let contentAddDiv1 = document.createElement("div");
        contentAddDiv1.innerHTML = `<label class="form-label">Adicionar imagens</label>`;
        contentAddDiv1.classList.add("col-12", "space-0", "px-4", "w-100", "mb-3");
        let contentAddDiv1Input = document.createElement("input");
        contentAddDiv1Input.classList.add("form-control");
        contentAddDiv1Input.setAttribute("type", "file");
        contentAddDiv1.appendChild(contentAddDiv1Input);
        ContentAdd.appendChild(contentAddDiv1);

        contentAddDiv1Input.addEventListener("change", () => {
            // Watch change in input of files and check if they are valid
            try {
                assertBase64ConvertableImage(contentAddDiv1Input.files);
            } catch (error) {
                alert(error);
                contentAddDiv1Input.value = "";
            }
        });

        let contentAddDiv2 = document.createElement("div");
        contentAddDiv2.classList.add("col-12", "space-0", "px-4", "pb-4");

        let contentAddDiv2Button = document.createElement("button");
        contentAddDiv2Button.classList.add(
            "btn",
            "btn-outline-primary",
            "text-decoration-none",
            "w-100",
        );
        contentAddDiv2Button.role = "button";
        contentAddDiv2Button.innerHTML = `<div class="d-flex justify-content-center m-2">
            <img class="icon-24px fixed-filter-invert me-2"
                src="static/action-icons/add.svg">
                <p class="space-0">Adicionar imagens</p>
        </div>`;
        contentAddDiv2Button.addEventListener("click", () => {
            if (!(contentAddDiv1Input instanceof HTMLInputElement)) return;

            if (!contentAddDiv1Input.files?.length) {
                alert("Seleciona um arquivo!");
                return;
            }

            commitAddImage(portfolioId, _sectionId, contentAddDiv1Input.files[0]);
        });
        contentAddDiv2.appendChild(contentAddDiv2Button);
        ContentAdd.appendChild(contentAddDiv2);
        contentContainer.appendChild(ContentAdd);
    }

    return contentContainer;
}
/**
 * @param {string} portfolioId
 * @param {number} sectionId
 * @param {string} sectionName
 * @param {string} sectionDescription
 * @param {boolean} enableEdit
 * @param {any[]} content
 * @returns {HTMLDivElement|void}
 */
function createLinkSection(
    portfolioId,
    sectionId,
    sectionName,
    sectionDescription,
    enableEdit,
    content,
) {
    if (!portfolioId || !sectionId) throw new Error("Object is null");

    const _sectionName = sectionName || "Redes";
    const _sectionDescription = sectionDescription || "Links Externos";

    const sectionHeader = createSectionHeader(
        "link",
        "filter-link",
        sectionName,
        sectionDescription,
    );

    if (enableEdit) {
        sectionHeader.appendChild(
            createActionMenu(portfolioId, sectionId, _sectionName, _sectionDescription),
        );
    }

    let contentContainer = createSectionContainer();
    contentContainer.appendChild(sectionHeader);

    let contentBlobs = document.createElement("div");
    contentBlobs.classList.add("row", "w-100", "m-0", "g-3", "py-2", "px-3", "pb-4");

    if (content?.length) {
        for (const element of content) {
            if (element.blob && element.descricao) {
                let linkDiv = document.createElement("div");
                linkDiv.classList.add("col-12", "col-sm-6", "col-xl-4", "position-relative");
                linkDiv.innerHTML += `<a class="btn btn-primary text-decoration-none w-100" href="${element.blob}" role="button">
                    <div class="d-flex justify-content-center m-2">
                        <img class="icon-24px fixed-filter-invert me-2"
                            src="static/action-icons/external.svg">
                            <p class="space-0">${element.descricao}</p>
                    </div>
                </a>`;

                if (enableEdit) {
                    let removeButton = document.createElement("button");
                    removeButton.innerHTML = `<img class="icon-dark icon-24px" src="static/action-icons/close.svg">`;
                    // TODO: Simplify classes
                    removeButton.classList.add(
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
                        "center-xy",
                    );
                    linkDiv.appendChild(removeButton);
                    removeButton.addEventListener("click", () =>
                        triggerDeleteLink(
                            new DeleteBlobContext(
                                portfolioId,
                                sectionId,
                                element.blob,
                                element.descricao,
                            ),
                        ),
                    );
                }

                contentBlobs.appendChild(linkDiv);
            }
        }
    } else {
        contentBlobs.appendChild(createNoLinkSubSection());
    }

    if (enableEdit) {
        contentBlobs.appendChild(createAddLinkSubSection(portfolioId, sectionId));
    }

    contentContainer.appendChild(contentBlobs);

    return contentContainer;
}

async function renderizarInformacoesUsuario(userId, enableEdit) {
    assertBoolean(enableEdit);

    let toggleEditElement = document.getElementById("toggle-edit-div");
    if (!(toggleEditElement instanceof HTMLDivElement)) return;
    toggleEditElement.appendChild(createEditPortfolioButton(enableEdit));

    const portfolioUser = await crudUsuarios.lerUsuario(userId);
    if (!portfolioUser) throw new Error("setupPortfolioPage: no user");

    const _usuarioPortfolio = {
        nome: portfolioUser.nome,
        biografia: portfolioUser.biografia || "Sem descrição informada",
        foto: portfolioUser.foto || `https://picsum.photos/seed/${userId}/200`,
    };

    // TODO: adicionar contato e e-mail?
    // TODO: Se não preenchido na hora do cadastro?
    if (Object.hasOwn(_usuarioPortfolio, "nome"))
        throw new Error(
            "setupPortfolioPage: não foi possível verificar alguma informação do usuário",
        );

    const portfolioName = document.getElementById("portfolio-name");
    const portfolioPicture = document.getElementById("portfolio-picture");
    const portfolioUsername = document.getElementById("portfolio-username");
    const portfolioNota = document.getElementById("portfolio-nota");
    const portfolioDescricao = document.getElementById("portfolio-descricao");
    const portfolioSecoes = document.getElementById("portfolio-secoes");

    if (
        !(portfolioName instanceof HTMLHeadingElement) ||
        !(portfolioPicture instanceof HTMLImageElement) ||
        !(portfolioUsername instanceof HTMLSpanElement) ||
        !(portfolioNota instanceof HTMLSpanElement) ||
        !(portfolioDescricao instanceof HTMLParagraphElement) ||
        !(portfolioSecoes instanceof HTMLDivElement)
    )
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    portfolioName.innerText = _usuarioPortfolio.nome;
    portfolioUsername.innerText = `@${userId}`;
    portfolioPicture.src = _usuarioPortfolio.foto;
    portfolioDescricao.innerText = _usuarioPortfolio.biografia;

    const media = await getMediaAvaliacoes(userId);
    if (media) {
        portfolioNota.innerText = media.toString();
    }
}

function configurarEditPopups(portfolioId) {
    toggleDisplayNoneOnElement("add-section", false);

    const popupEditSectionClose = document.getElementById("popup-edit-close");
    const popupEditSectionConfirm = document.getElementById("popup-edit-confirm");

    popupEditSectionClose?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-edit", true),
    );
    popupEditSectionConfirm?.addEventListener("click", commitEditSectionInfo);

    const addSection = document.getElementById("add-section");
    const popupAddSectionClose = document.getElementById("popup-add-close");
    const popupAddSectionConfirm = document.getElementById("popup-add-confirm");

    // Botão de adicionar seção
    addSection?.addEventListener("click", () =>
        triggerAddSection(new AddSectionContext(portfolioId)),
    );
    popupAddSectionClose?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-add", true),
    );
    popupAddSectionConfirm?.addEventListener("click", commitAddAsection);

    const popupAddLinkClose = document.getElementById("popup-add-link-close");
    const popupAddLinkConfirm = document.getElementById("popup-add-link-confirm");
    popupAddLinkClose?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-add-link", true),
    );
    popupAddLinkConfirm?.addEventListener("click", commitAddLink);

    const popupDeleteSectionClose = document.getElementById("popup-delete-close");
    const popupDeleteSectionCancel = document.getElementById("popup-delete-cancel");
    const popupDeleteSectionConfirm = document.getElementById("popup-delete-confirm");

    popupDeleteSectionClose?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-delete", true),
    );
    popupDeleteSectionCancel?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-delete", true),
    );
    popupDeleteSectionConfirm?.addEventListener("click", commitDeleteSection);

    const popupDeleteImageClose = document.getElementById("popup-delete-image-close");
    const popupDeleteImageCancel = document.getElementById("popup-delete-image-cancel");
    const popupDeleteImageConfirm = document.getElementById("popup-delete-image-confirm");

    popupDeleteImageClose?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-delete-image", true),
    );
    popupDeleteImageCancel?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-delete-image", true),
    );
    popupDeleteImageConfirm?.addEventListener("click", () => commitDeleteImage);

    const popupDeleteLinkClose = document.getElementById("popup-delete-link-close");
    const popupDeleteLinkCancel = document.getElementById("popup-delete-link-cancel");
    const popupDeleteLinkConfirm = document.getElementById("popup-delete-link-confirm");

    popupDeleteLinkClose?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-delete-link", true),
    );
    popupDeleteLinkCancel?.addEventListener("click", () =>
        toggleDisplayNoneOnElement("popup-delete-link", true),
    );
    popupDeleteLinkConfirm?.addEventListener("click", () => commitDeleteLink);
}

/**
 * @param {string} portfolioId
 * @param {boolean} enableEdit
 */
// TODO: Remover async dessa função ou dividir em funcoes menores
async function renderizarPortfolio(portfolioId, enableEdit) {
    assertStringNonEmpty(portfolioId);
    assertBoolean(enableEdit);

    const portfolioToRender = await crudPortfolios.lerPortfolio(portfolioId);
    if (!portfolioToRender) {
        alert("A id informada para o portfólio não existe!");
        location.assign("/portfolios");
        return;
    }

    // Habilita o container do portfólio
    toggleDisplayNoneOnElement("portfolio-display", false);

    if (enableEdit) {
        configurarEditPopups(portfolioId);
    }

    const portfolioUserId = portfolioToRender.usuarioId;

    renderizarInformacoesUsuario(enableEdit);

    const portfolioSecoes = document.getElementById("portfolio-secoes");

    if (!(portfolioSecoes instanceof HTMLDivElement))
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    // TODO: O usuário pode não ter cadastrado nenhuma seção ainda
    if (!portfolioToRender.secoes.length && !enableEdit) {
        let information = document.createElement("h5");
        information.classList.add("d-flex", "w-100", "space-0", "p-4", "center-xy");
        information.innerText = "Portfólio vazio, edite o portfólio para adicionar uma seção!";
        portfolioSecoes.appendChild(information);
        return;
    }

    // TODO: Permitir apenas 1 seção de avaliações
    portfolioToRender.secoes.forEach(async (element) => {
        // For categoriaId(0), content is optional
        const { nome, descricao, ordem, categoriaId, contents } = element;

        if (
            !nome ||
            (!ordem && typeof ordem !== "number") ||
            (!categoriaId && typeof categoriaId !== "number")
        )
            throw new Error("Algum elemento HTML não pode ser encontrado!");

        switch (categoriaId) {
            // categoriaId(1): Avaliações
            case 1:
                {
                    const child = await createReviewSection(
                        portfolioToRender.id,
                        ordem,
                        nome,
                        descricao,
                        enableEdit,
                        portfolioUserId,
                    );
                    if (child) portfolioSecoes.appendChild(child);
                }
                break;
            // categoriaId(0): Fotos
            case 0:
                {
                    const child = createImageSection(
                        portfolioToRender.id,
                        ordem,
                        nome,
                        descricao,
                        enableEdit,
                        contents,
                    );
                    if (child) portfolioSecoes.appendChild(child);
                }
                break;
            // categoriaId(2): Links
            case 2:
                {
                    const child = createLinkSection(
                        portfolioToRender.id,
                        ordem,
                        nome,
                        descricao,
                        enableEdit,
                        contents,
                    );
                    if (child) portfolioSecoes.appendChild(child);
                }
                break;
        }
    });
}

async function listarUsuariosNaConfiguracao() {
    // OPTIMIZE: Ler os usuários anteriormente e escolher um número aleatorio
    const _usuarios = await crudUsuarios.lerUsuarios();

    const portfolioSetupCreateSelect = document.getElementById("portfolio-setup-create-select");
    const portfolioSetupCreateButton = document.getElementById("portfolio-setup-create-btn");

    if (
        !(portfolioSetupCreateSelect instanceof HTMLSelectElement) ||
        !(portfolioSetupCreateButton instanceof HTMLButtonElement)
    )
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    // Se existem usuários, adiciona-os à lista (criar novo portfólio)
    if (_usuarios?.length) {
        for (const element of _usuarios) {
            let option = document.createElement("option");
            option.value = element.id;
            option.innerText = `Usuário id(${element.id}): ${element.nome}`;
            portfolioSetupCreateSelect.appendChild(option);
        }
        portfolioSetupCreateButton.classList.remove("disabled");
        portfolioSetupCreateButton.addEventListener("click", async () => {
            // Criar portfólio para o usuário de id $?
            let portfolioId = await crudPortfolios.criarPortfolio({
                usuarioId: portfolioSetupCreateSelect.value,
                secoes: [],
            });

            if (!portfolioId) {
                console.error("Não foi possível criar o portfólio");
                return;
            }

            // Abrir o portfólio de id $?
            setIdParam(portfolioId);
        });

        return;
    }

    let option = document.createElement("option");
    option.innerText = `Nenhum usuário criado!`;
    portfolioSetupCreateSelect.appendChild(option);
}

async function listarPortfoliosNaConfiguracao() {
    let portfolioSetupSelectSelect = document.getElementById("portfolio-setup-select-select");
    let portfolioSetupSelectButton = document.getElementById("portfolio-setup-select-btn");

    if (
        !(portfolioSetupSelectSelect instanceof HTMLSelectElement) ||
        !(portfolioSetupSelectButton instanceof HTMLButtonElement)
    )
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    // Lê os portfolios e usuários disponíveis
    const _portfolios = await crudPortfolios.lerPortfolios();

    // Se existem portfólios, adiciona-os à lista (abrir portfólio)
    if (_portfolios?.length) {
        for (const element of _portfolios) {
            let option = document.createElement("option");
            option.value = element.id;
            option.innerText = `Portfólio de id(${element.id})`;
            portfolioSetupSelectSelect.appendChild(option);
        }
        portfolioSetupSelectButton.classList.remove("disabled");
        portfolioSetupSelectButton.addEventListener("click", () =>
            // Abrir o portfólio de id $?
            setIdParam(parseInt(portfolioSetupSelectSelect.value, 10)),
        );
    } else {
        let option = document.createElement("option");
        option.innerText = `Nenhum portfólio criado!`;
        portfolioSetupSelectSelect.appendChild(option);
    }
}

function setupPortfolioSetupMicroDev() {
    let portfolioSetupDevButton = document.getElementById("portfolio-setup-dev-btn");

    if (!(portfolioSetupDevButton instanceof HTMLButtonElement))
        throw new Error("Algum elemento HTML não pode ser encontrado!");

    portfolioSetupDevButton.addEventListener("click", async () => {
        // Utilizar a página 'dev.js'
        await Faker.criarNUsuarios(30);
        await Faker.criarNServicos(60, true);
        await Faker.criarNContratos(90);
        await Faker.criarNAvaliacoes(120);
        notifySectionDataChanged();
    });
}

// Configura a página inicial de visualizar/criar portfólios
function renderizarConfiguracaoPortfolio() {
    // Mostra os elementos da página de setup do portfólio
    // TODO: Adicionar a pagina dinamicamente
    toggleDisplayNoneOnElement("portfolio-setup", false);
    // Adiciona usuários a página de setup de portfólio
    listarUsuariosNaConfiguracao();
    // Adiciona portfólios a página de setup de portfólio
    listarPortfoliosNaConfiguracao();
    // Adiciona opções de desenvolvedor a página de setup de portfólio
    setupPortfolioSetupMicroDev();
}

function iniciarlizarPortfolio() {
    // Verificar as informações na id
    let params = new URLSearchParams(location.search);
    let id = params.get("id");
    let edit = params.get("edit") === "true";
    // Se tem ?id, carrega as informações do portfolio, caso não haja, renderiza a página de criação e/ou abertura
    if (id) {
        renderizarPortfolio(id, edit);
    } else {
        renderizarConfiguracaoPortfolio();
    }
}

iniciarlizarPortfolio();
