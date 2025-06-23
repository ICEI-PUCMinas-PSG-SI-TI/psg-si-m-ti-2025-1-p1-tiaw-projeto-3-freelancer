//@ts-check

import * as Faker from "./lib/faker.mjs";
import { ensureInteger, isNonEmptyString } from "./tools.mjs";
import { assertBase64ConvertableImage, imageFileToBase64 } from "./lib/tools.mjs";

import { Usuarios } from "./jsonf/usuarios.mjs"; // Usuários
import { Servicos } from "./jsonf/servicos.mjs"; // Serviços
import { Contratos } from "./jsonf/contratos.mjs"; // Contratos
import { Avaliacoes } from "./jsonf/avaliacoes.mjs"; // Avaliações
import { Portfolios } from "./jsonf/portfolios.mjs"; // Portfólios

const crud_usuarios = new Usuarios();
const crud_servicos = new Servicos();
const crud_contratos = new Contratos();
const crud_avaliacoes = new Avaliacoes();
const crud_portfolios = new Portfolios();

// TODO: Mover adicionar-imagens para um popup
// TODO: Criar popups dinamicamente e remove-los do html

class AddSectionContext {
    /**
     * @param {string} portfolio_id
     */
    constructor(portfolio_id) {
        this.portfolio_id = portfolio_id;
    }
}

class DeleteSectionContext {
    /**
     * @param {number} portfolio_id
     * @param {number} section_id
     * @param {string} name
     * @param {string} description
     */
    constructor(portfolio_id, section_id, name, description) {
        this.portfolio_id = portfolio_id;
        this.section_id = section_id;
        // TODO: Optional?
        this.name = name;
        this.description = description;
    }
}

class EditSectionInfoContext {
    /**
     * @param {number} portfolio_id
     * @param {number} section_id
     * @param {string} name
     * @param {string} description
     */
    constructor(portfolio_id, section_id, name, description) {
        this.portfolio_id = portfolio_id;
        this.section_id = section_id;
        this.name = name;
        this.description = description;
    }
}

class EditSectionPositionContext {
    /**
     * @param {number} portfolio_id
     * @param {number} section_id
     * @param {string} name
     * @param {string} description
     * @param {number} move
     */
    constructor(portfolio_id, section_id, name, description, move) {
        this.portfolio_id = portfolio_id;
        this.section_id = section_id;
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
     * @param {number} portfolio_id
     * @param {number} section_id
     */
    constructor(portfolio_id, section_id) {
        this.portfolio_id = portfolio_id;
        this.section_id = section_id;
    }
}

class DeleteBlobContext {
    /**
     * @param {number} portfolio_id
     * @param {number} section_id
     * @param {any} blob
     * @param {string} description
     */
    constructor(portfolio_id, section_id, blob, description) {
        this.portfolio_id = portfolio_id;
        this.section_id = section_id;
        this.blob = blob;
        this.description = description;
    }
}

class Context {
    constructor() {
        this.context = {};
    }

    /**
     * @param {AddSectionContext | DeleteSectionContext | EditSectionInfoContext | AddLinkContext | DeleteBlobContext | DeleteBlobContext} context
     */
    setupContext(context) {
        if (
            context instanceof AddSectionContext ||
            context instanceof DeleteSectionContext ||
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
 * @param {DeleteSectionContext} deleteSectionContext
 */
function triggerDeleteSection(deleteSectionContext) {
    if (!(deleteSectionContext instanceof DeleteSectionContext)) return;

    preparePopup();
    toggleDisplayNoneOnElement("popup-delete", false);

    const popup_delete_name = document.getElementById("popup-delete-name");
    const popup_delete_description = document.getElementById("popup-delete-description");

    if (
        !(popup_delete_name instanceof HTMLParagraphElement) ||
        !(popup_delete_description instanceof HTMLParagraphElement)
    ) {
        console.error(`${this.name}: null check`);
        return;
    }

    popup_delete_name.innerText = deleteSectionContext.name;
    popup_delete_description.innerText = deleteSectionContext.description;

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

    const popup_edit_name = document.getElementById("popup-edit-name");
    const popup_edit_description = document.getElementById("popup-edit-description");

    if (
        !(popup_edit_name instanceof HTMLInputElement) ||
        !(popup_edit_description instanceof HTMLInputElement)
    ) {
        console.error(`${this.name}: null check`);
        return;
    }

    popup_edit_name.value = editSectionContext.name;
    popup_edit_description.value = editSectionContext.description;

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

    const popup_delete_link_url = document.getElementById("popup-delete-link-url");
    const popup_delete_link_description = document.getElementById("popup-delete-link-description");

    if (
        !(popup_delete_link_url instanceof HTMLParagraphElement) ||
        !(popup_delete_link_description instanceof HTMLParagraphElement)
    ) {
        return;
    }

    popup_delete_link_url.innerText = deleteLinkContext.blob;
    popup_delete_link_description.innerText = deleteLinkContext.description;

    context.setupContext(deleteLinkContext);
}

/**
 * @param {DeleteBlobContext} deleteImageContext
 */
function triggerDeleteImage(deleteImageContext) {
    if (!(deleteImageContext instanceof DeleteBlobContext)) return;

    preparePopup();
    toggleDisplayNoneOnElement("popup-delete-image", false);

    const popup_delete_image_image = document.getElementById("popup-delete-image-image");

    if (!(popup_delete_image_image instanceof HTMLImageElement)) {
        console.error(`${this.name}: null check`);
        return;
    }

    popup_delete_image_image.src = deleteImageContext.blob;

    context.setupContext(deleteImageContext);
}

async function commitAddAsection() {
    const _context = context.getContext();

    if (!(_context instanceof AddSectionContext)) return;

    const _portfolio_id = _context.portfolio_id;
    const html_popup_add_name = document.getElementById("popup-add-name");
    const html_popup_add_description = document.getElementById("popup-add-description");
    const html_popup_add_categoria = document.getElementById("popup-add-categoria");

    if (
        !_portfolio_id ||
        !(html_popup_add_name instanceof HTMLInputElement) ||
        !(html_popup_add_description instanceof HTMLInputElement) ||
        !(html_popup_add_categoria instanceof HTMLSelectElement)
    ) {
        console.log("add-section: null check");
        return;
    }

    const form_section_name = html_popup_add_name.value;
    const form_section_description = html_popup_add_description.value;
    const form_section_categoria = html_popup_add_categoria.value;

    const _portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);
    if (!_portfolio) {
        console.log(`ID0: Erro ao editar categoria do portfolio ${_portfolio_id}.`);
        return;
    }

    if (!form_section_name) {
        alert("O nome da seção não pode estar vazio!");
        return;
    }

    let maior = 0;
    // Como estamos adicionando uma seção, não é problema se ela esta vazia
    if (_portfolio.secoes?.length) {
        // Verificar o maior valor para json.ordem

        _portfolio.secoes.forEach((element) => {
            if (parseInt(element.ordem) > maior) maior = element.ordem;
        });
    } else {
        _portfolio.secoes = [];
    }

    maior++;

    _portfolio.secoes.push({
        ordem: maior,
        nome: form_section_name,
        descricao: form_section_description || "",
        categoriaId: parseInt(form_section_categoria),
        contents: [],
    });

    if (await crud_portfolios.atualizarPortfolio(_portfolio)) {
        toggleDisplayNoneOnElement("popup-add", true);
        notifySectionDataChanged();
        return;
    }

    console.log("Ocorreu um erro ao atualizar o objeto!");
}

async function commitDeleteSection() {
    const _context = context.getContext();

    if (!_context || !(_context instanceof DeleteSectionContext)) return;

    const _portfolio_id = ensureInteger(_context.portfolio_id);
    const _section_id = ensureInteger(_context.section_id);

    if (!_portfolio_id || !_section_id) return;

    const _portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);
    if (!_portfolio || !_portfolio.secoes.length) {
        console.error(`Erro ao editar o portfólio ${_portfolio_id}.`);
        return;
    }

    for (let i = 0; i < _portfolio.secoes.length; i++) {
        if (ensureInteger(_portfolio.secoes[i].ordem) !== _section_id) continue;

        _portfolio.secoes.splice(i, 1);
        break;
    }

    if (await crud_portfolios.atualizarPortfolio(_portfolio)) {
        toggleDisplayNoneOnElement("popup-delete", true);
        context.resetContext();
        notifySectionDataChanged();
        return;
    }

    console.log("Ocorreu um erro ao atualizar o objeto!");
}

async function commitEditSectionInfo() {
    const _context = context.getContext();

    if (!_context || !(_context instanceof EditSectionInfoContext)) return;

    const html_popup_edit_name = document.getElementById("popup-edit-name");
    const html_popup_edit_description = document.getElementById("popup-edit-description");

    if (
        !(html_popup_edit_name instanceof HTMLInputElement) ||
        !(html_popup_edit_description instanceof HTMLInputElement)
    ) {
        console.log(`${this.name} null check`);
        return;
    }

    const new_name = html_popup_edit_name.value;
    // Pode ser vazio
    const new_description = html_popup_edit_description.value;

    if (!isNonEmptyString(new_name)) {
        alert("O campo 'nome' não pode ser vazio!");
        return;
    }

    const _portfolio_id = ensureInteger(_context.portfolio_id);
    const _section_id = ensureInteger(_context.section_id);

    if (!_portfolio_id || !_section_id) return;

    const _portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);

    if (!_portfolio || !_portfolio.secoes.length) {
        console.error(`ID0: Erro ao editar categoria do portfolio ${_portfolio_id}.`);
        return;
    }

    for (let i = 0; i < _portfolio.secoes.length; i++) {
        if (ensureInteger(_portfolio.secoes[i].ordem) !== _section_id) continue;

        _portfolio.secoes[i].nome = new_name;
        _portfolio.secoes[i].descricao = new_description;
        break;
    }

    if (await crud_portfolios.atualizarPortfolio(_portfolio)) {
        toggleDisplayNoneOnElement("popup-edit", true);
        context.resetContext();
        notifySectionDataChanged();
        return;
    }

    console.log("Ocorreu um erro ao atualizar o objeto!");
}

/**
 *
 * @param {EditSectionPositionContext} editSectionPositionContext
 */
async function commitEditSectionPosition(editSectionPositionContext) {
    if (!(editSectionPositionContext instanceof EditSectionPositionContext)) return;

    const _portfolio_id = ensureInteger(editSectionPositionContext.portfolio_id);
    const _section_id = ensureInteger(editSectionPositionContext.section_id);

    if (!_portfolio_id || !_section_id) return;

    const _portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);

    if (!_portfolio || !_portfolio.secoes.length) {
        console.error(`ID0: Erro ao editar categoria do portfolio ${_portfolio_id}.`);
        return;
    }

    switch (editSectionPositionContext.direction) {
        case EditSectionPositionContext.MOVE_UP:
            // INFO: Aqui a ordem esta sendo utilizada como id da seção
            // TODO: Por enquanto a ordem no array é mais importante que o valor em json.ordem
            // TODO: Desabilitar botão quando no topo ou no final?

            for (let i = 1; i > 0 && i < _portfolio.secoes.length; i++) {
                if (ensureInteger(_portfolio.secoes[i].ordem) !== _section_id) continue;

                // Remove do array
                let secao = _portfolio.secoes.splice(i, 1)[0];
                // Adiciona uma posição antes
                _portfolio.secoes.splice(i - 1, 0, secao);
                break;
            }

            break;
        case EditSectionPositionContext.MOVE_DOWN:
            {
                // Verificar o maior valor para json.ordem
                let maior = 0;
                _portfolio.secoes.forEach((element) => {
                    if (parseInt(element.ordem) > maior) maior = element.ordem;
                });

                // TODO: Desabilitar botão quando no topo ou no final?
                if (_section_id >= maior) return;

                for (let i = 0; i < _portfolio.secoes.length - 1; i++) {
                    if (ensureInteger(_portfolio.secoes[i].ordem) !== _section_id) continue;

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

    if (await crud_portfolios.atualizarPortfolio(_portfolio)) {
        notifySectionDataChanged();
        return;
    }

    console.log("Ocorreu um erro ao atualizar o objeto!");
}

async function commitAddLink() {
    const _context = context.getContext();

    if (!(_context instanceof AddLinkContext)) return;

    const _portfolio_id = ensureInteger(_context.portfolio_id);
    const _section_id = ensureInteger(_context.section_id);

    if (!_portfolio_id || !_section_id) return;

    const popup_add_link_url = document.getElementById("popup-add-link-url");
    const popup_add_link_description = document.getElementById("popup-add-link-description");

    if (
        !(popup_add_link_url instanceof HTMLInputElement) ||
        !(popup_add_link_description instanceof HTMLInputElement)
    ) {
        console.error(`${this.name}: null check`);
        return;
    }

    let new_url = popup_add_link_url.value;
    let new_description = popup_add_link_description.value;

    const _portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);

    if (!_portfolio || !_portfolio.secoes.length) {
        console.log(`ID0: Erro ao editar categoria do portfolio ${_portfolio_id}.`);
        return;
    }

    // TODO: useregex?
    if (!(new_url.startsWith("https://") || new_url.startsWith("http://"))) {
        alert("URL não é valida!\n\nA URL não começa com 'http://' ou 'https://'");
        return;
    } else if (
        (new_url.startsWith("https://") && new_url.length === 8) ||
        (new_url.startsWith("http://") && new_url.length === 7)
    ) {
        alert("URL não é valida!\n\nA URL esta vazia!");
        return;
    }

    for (let i = 0; i < _portfolio.secoes.length; i++) {
        if (parseInt(_portfolio.secoes[i].ordem) != _section_id) continue;

        _portfolio.secoes[i].contents.push({
            blob: new_url || "",
            descricao: new_description || "",
        });
        break;
    }

    if (await crud_portfolios.atualizarPortfolio(_portfolio)) {
        toggleDisplayNoneOnElement("popup-add-link", true);
        context.resetContext();
        notifySectionDataChanged();
        return;
    }

    console.log("Ocorreu um erro ao atualizar o objeto!");
}

async function commitDeleteLink() {
    const _context = context.getContext();

    if (!(_context instanceof DeleteBlobContext)) return;

    // TODO: ensurePositiveInteger()
    const _portfolio_id = ensureInteger(_context.portfolio_id);
    const _section_id = ensureInteger(_context.section_id);
    // TODO: Expensive, use id or something else
    const _s_cntnt_blob = _context.blob;
    const _s_cntnt_description = _context.description;

    if (!_portfolio_id || !_section_id) return;

    const _portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);

    if (!_portfolio || !_portfolio.secoes.length) {
        console.log(`ID0: Erro ao editar categoria do portfolio ${_portfolio_id}.`);
        return;
    }

    let procurando = true;
    for (let i = 0; i < _portfolio.secoes.length && procurando; i++) {
        if (parseInt(_portfolio.secoes[i].ordem) != _section_id) {
            continue;
        }

        if (!_portfolio.secoes[i].contents || !_portfolio.secoes[i].contents.length) {
            console.log(`Não encontrado: ${_portfolio.secoes[i].contents}`);
            return;
        }

        for (let j = 0; j < _portfolio.secoes[i].contents.length && procurando; j++) {
            console.log(_portfolio.secoes[i].contents[j]);
            console.log(_portfolio.secoes[i].contents);
            if (
                !_portfolio.secoes[i].contents[j].blob ||
                _portfolio.secoes[i].contents[j].descricao == null
            )
                continue;

            if (_portfolio.secoes[i].contents[j].blob != _s_cntnt_blob) continue;

            if (_portfolio.secoes[i].contents[j].descricao != _s_cntnt_description) continue;

            _portfolio.secoes[i].contents.splice(j, 1);
            procurando = false;
        }
        procurando = false;
    }

    if (await crud_portfolios.atualizarPortfolio(_portfolio)) {
        toggleDisplayNoneOnElement("popup-delete-link", true);
        notifySectionDataChanged();
        return;
    }

    console.log("Ocorreu um erro ao atualizar o objeto!");
}

// TODO: Rework this
/**
 * @param {number} p_id
 * @param {number} s_id
 * @param {Blob} blob
 */
async function commitAddImage(p_id, s_id, blob) {
    const base64Image = await imageFileToBase64(blob);

    if (!base64Image.startsWith("data:image/")) {
        alert("Não é um arquivo de imagem!");
        return;
    }

    const _portfolio_id = ensureInteger(p_id);
    const _section_id = ensureInteger(s_id);

    if (!_portfolio_id || !_section_id) return;

    const _portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);

    if (!_portfolio || !_portfolio.secoes.length) {
        console.log(`ID0: Erro ao editar categoria do portfolio ${_portfolio_id}.`);
        return;
    }

    for (let i = 0; i < _portfolio.secoes.length; i++) {
        if (ensureInteger(_portfolio.secoes[i].ordem) !== _section_id) continue;

        // TODO: Add id
        _portfolio.secoes[i].contents.push({
            blob: base64Image,
            descricao: "Imagem",
        });
        break;
    }

    if (await crud_portfolios.atualizarPortfolio(_portfolio)) {
        notifySectionDataChanged();
        return;
    }

    console.log("Ocorreu um erro ao atualizar o objeto!");
}

async function commitDeleteImage() {
    const _context = context.getContext();

    if (!(_context instanceof DeleteBlobContext)) return;

    const _portfolio_id = ensureInteger(_context.portfolio_id);
    const _section_id = ensureInteger(_context.section_id);
    // TODO: Expensive, use id or something else
    let _s_cntnt_blob = _context.blob;
    let _s_cntnt_description = _context.description;

    if (!_portfolio_id || !_section_id) return;

    const _portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);

    if (!_portfolio || !_portfolio.secoes.length) {
        console.log(`ID0: Erro ao editar categoria do portfolio ${_portfolio_id}.`);
        return;
    }

    let procurando = true;
    for (let i = 0; i < _portfolio.secoes.length && procurando; i++) {
        if (ensureInteger(_portfolio.secoes[i].ordem) !== _section_id) continue;

        if (!_portfolio.secoes[i].contents || !_portfolio.secoes[i].contents.length) {
            console.log(`Não encontrado: ${_portfolio.secoes[i].contents}`);
            return;
        }

        for (let j = 0; j < _portfolio.secoes[i].contents.length && procurando; j++) {
            if (
                !_portfolio.secoes[i].contents[j].blob ||
                _portfolio.secoes[i].contents[j].descricao == null
            )
                continue;

            if (_portfolio.secoes[i].contents[j].blob !== _s_cntnt_blob) continue;

            if (_portfolio.secoes[i].contents[j].descricao !== _s_cntnt_description) continue;

            _portfolio.secoes[i].contents.splice(j, 1);
            procurando = false;
        }
        procurando = false;
    }

    if (await crud_portfolios.atualizarPortfolio(_portfolio)) {
        toggleDisplayNoneOnElement("popup-delete-image", true);
        notifySectionDataChanged();
        return;
    }

    console.log("Ocorreu um erro ao atualizar o objeto!");
}

/**
 * @returns {HTMLDivElement}
 */
function createSectionContainer() {
    let content_container = document.createElement("div");
    content_container.classList.add("card", "w-100", "overflow-hidden", "space-0", "mb-3");
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
        "justify-content-start",
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

/**
 * @returns {HTMLDivElement}
 * @param {number} portfolio_id
 * @param {number} section_id
 * @param {string} name
 * @param {string} description
 */
function createActionMenu(portfolio_id, section_id, name, description) {
    let content_actions = document.createElement("div");
    content_actions.classList.add("ms-auto");

    let content_button_edit = createActionButton("edit", () =>
        triggerEditSectionInfo(
            new EditSectionInfoContext(portfolio_id, section_id, name, description),
        ),
    );

    let content_button_up = createActionButton("up", () =>
        commitEditSectionPosition(
            new EditSectionPositionContext(
                portfolio_id,
                section_id,
                name,
                description,
                EditSectionPositionContext.MOVE_UP,
            ),
        ),
    );

    let content_button_down = createActionButton("down", () =>
        commitEditSectionPosition(
            new EditSectionPositionContext(
                portfolio_id,
                section_id,
                name,
                description,
                EditSectionPositionContext.MOVE_DOWN,
            ),
        ),
    );

    let content_button_delete = createActionButton("delete", () =>
        triggerDeleteSection(new DeleteSectionContext(portfolio_id, section_id, name, description)),
    );

    content_actions.appendChild(content_button_edit);
    content_actions.appendChild(content_button_up);
    content_actions.appendChild(content_button_down);
    content_actions.appendChild(content_button_delete);

    return content_actions;
}

/**
 * @param {number} portfolio_id
 * @param {number} section_id
 */
function createAddLinkSubSection(portfolio_id, section_id) {
    let add_new_link = document.createElement("div");
    add_new_link.classList.add("col-12");

    let add_new_link_button = document.createElement("button");
    add_new_link_button.classList.add(
        "btn",
        "btn-outline-primary",
        "text-decoration-none",
        "w-100",
    );
    add_new_link_button.addEventListener("click", () =>
        triggerAddLink(new AddLinkContext(portfolio_id, section_id)),
    );

    add_new_link_button.innerHTML = `<div class="d-flex justify-content-center m-2">
        <img class="icon-24px fixed-filter-invert me-2"
            src="static/action-icons/add.svg">
        <p class="space-0">Adicionar link</p>
    </div>`;

    add_new_link.appendChild(add_new_link_button);
    return add_new_link;
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

    let toggle_edit_element_img = document.createElement("img");
    let toggle_edit_element_p = document.createElement("p");
    toggle_edit_element_img.classList.add("icon-dark", "icon-24px", "space-0", "me-2");
    toggle_edit_element_p.classList.add("space-0");

    if (_edit) {
        toggle_edit_element_img.src = "static/action-icons/close.svg";
        toggle_edit_element_p.innerText = "Finalizar edição";
    } else {
        toggle_edit_element_img.src = "static/action-icons/edit.svg";
        toggle_edit_element_p.innerText = "Editar portfólio";
    }

    button.appendChild(toggle_edit_element_img);
    button.appendChild(toggle_edit_element_p);
    button.addEventListener("click", () => toggleEditParam(!_edit));

    return button;
}

// TODO: Improve this: get only needed contracts
// TODO: select * where userId = userId
/**
 * @param {string | number} userId
 * @returns {number | null}
 */
async function getMediaAvaliacoes(userId) {
    const userId_int = ensureInteger(userId);
    if (typeof userId_int !== "number") return null;

    let avaliacoes = (await crud_avaliacoes.lerAvaliacoes()) || [];
    // Sem avaliações
    if (!avaliacoes || !avaliacoes.length) return null;

    let media = 0;
    let quantidade = 0;
    for (let i = 0; i < avaliacoes.length; i++) {
        const contratado = await crud_contratos.lerContrato(avaliacoes[i].contratoId);
        if (!contratado || ensureInteger(contratado) !== userId_int) continue;

        media += avaliacoes[i].nota;
        quantidade++;
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
 * @param {string} element_id
 * @param {boolean} set_display_none_status
 */
function toggleDisplayNoneOnElement(element_id, set_display_none_status) {
    if (typeof element_id !== "string") return;

    const element = document.getElementById(element_id);
    if (!(element instanceof HTMLElement)) return;

    if (typeof set_display_none_status === "boolean") {
        set_display_none_status
            ? element.classList.add("d-none")
            : element.classList.remove("d-none");

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

    const url = new URL(window.location.href); // Get the current URL
    const params = new URLSearchParams(url.search); // Get the search parameters

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
    if (typeof id === "string") id = parseInt(id);

    if (typeof id !== "number") {
        console.log("?id= Não é número");
        return;
    }

    const url = new URL(window.location.href); // Get the current URL
    const params = new URLSearchParams(url.search); // Get the search parameters
    if (id) {
        params.set("id", id.toString());
        window.location.href = `${url.origin}${url.pathname}?${params.toString()}${url.hash}`;
    } else {
        // Navega para a pagina sem parametros
        window.location.href = `${url.origin}${url.pathname}`;
    }
}

/**
 * @param {number} portfolio_id
 * @param {number} section_id
 * @param {string} section_name
 * @param {string} section_description
 * @param {boolean} enable_edit
 * @param {string} portfolio_user_id
 */
async function createReviewSection(
    portfolio_id,
    section_id,
    section_name,
    section_description,
    enable_edit,
    portfolio_user_id,
) {
    const _portfolio_id = ensureInteger(portfolio_id);
    const _section_id = ensureInteger(section_id);
    const _portfolio_user_id = portfolio_user_id;

    if (!_portfolio_id || !_section_id || !_portfolio_user_id) return;

    const _section_name = section_name || "Avaliações";
    const _section_description = section_description || "Clientes satisfeitos!";

    const section_header = createSectionHeader(
        "star",
        "filter-star",
        _section_name,
        _section_description,
    );

    let content_container = createSectionContainer();
    content_container.appendChild(section_header);

    if (enable_edit) {
        section_header.appendChild(
            createActionMenu(_portfolio_id, _section_id, _section_name, _section_description),
        );
    }

    let content_blobs = document.createElement("div");
    content_blobs.classList.add("row", "w-100", "space-0", "py-3", "scrool-container");

    let content_blobs_scrool = document.createElement("div");
    content_blobs_scrool.classList.add("px-3");

    let avaliacoes = await crud_avaliacoes.lerAvaliacoes();
    if (!avaliacoes?.length) {
        let information = document.createElement("p");
        information.classList.add("d-flex", "w-100", "space-0", "p-4", "center-xy");
        information.innerHTML = `Não há avaliações para este usuário, você pode utilizar a&nbsp;<a href="/dev">página de desenvolvimento</a>&nbsp;para gerar uma avaliação.`;
        content_blobs_scrool.appendChild(information);
    } else {
        // Lê todas as avaliações
        // TODO: Otimizar > Informações do serviço da avaliação
        for (const avaliacao_element of avaliacoes) {
            const comentario = avaliacao_element.comentario.substring(0, 200);
            const nota = avaliacao_element.nota;
            const contratanteId = avaliacao_element.contratanteId;
            // Pega o contratoId da avaliação e filtra
            const _contract_id = avaliacao_element.contratoId;
            if (!_contract_id) return;

            const contrato = await crud_contratos.lerContrato(_contract_id);
            if (!contrato) return;

            const contratadoId = contrato.contratadoId;
            const _service_id = String(contrato.servicoId);
            if (!contratadoId || !_service_id) return;

            // A partir daqui, continue apenas os contratos que possuem a mesma id que o usuario do portfolio
            if (contratadoId.toString() !== _portfolio_user_id.toString()) return;

            const service = await crud_servicos.lerServico(_service_id);
            if (!service) return;

            const user = await crud_usuarios.lerUsuario(contratanteId);
            if (!user) return;

            // TODO: replace 'placeholder_profile'
            content_blobs_scrool.innerHTML += `<div class="d-inline-block float-none me-3">
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
        }
    }

    content_blobs.appendChild(content_blobs_scrool);
    content_container.appendChild(content_blobs);

    return content_container;
}

/**
 * @param {number} portfolio_id
 * @param {number} section_id
 * @param {string} section_name
 * @param {string} section_description
 * @param {boolean} enable_edit
 * @param {any[]} content
 */
function createImageSection(
    portfolio_id,
    section_id,
    section_name,
    section_description,
    enable_edit,
    content,
) {
    const _portfolio_id = ensureInteger(portfolio_id);
    const _section_id = ensureInteger(section_id);

    if (!_portfolio_id || !_section_id) return;

    const _section_name = section_name || "Imagens";
    const _section_description = section_description || "Seção de imagens";

    const section_header = createSectionHeader(
        "images",
        "filter-images",
        section_name,
        section_description,
    );

    if (enable_edit) {
        section_header.appendChild(
            createActionMenu(_portfolio_id, _section_id, _section_name, _section_description),
        );
    }

    const content_container = createSectionContainer();
    content_container.appendChild(section_header);

    let content_blobs = document.createElement("div");
    content_blobs.classList.add("row", "w-100", "space-0", "py-3", "scrool-container");

    let content_blobs_scrool = document.createElement("div");
    content_blobs_scrool.classList.add("px-3");

    if (content && content.length) {
        for (let i = 0; i < content.length; i++) {
            if (!content[i].blob && !content[i].descricao) return;

            let image_div = document.createElement("div");
            image_div.classList.add("me-3", "d-inline-block", "position-relative");
            image_div.innerHTML += `<img class="img-thumbnail images" src="${content[i].blob}">`;

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
                    "center-xy",
                );
                remove_button.addEventListener("click", () =>
                    triggerDeleteImage(
                        new DeleteBlobContext(
                            _portfolio_id,
                            _section_id,
                            content[i].blob,
                            content[i].descricao,
                        ),
                    ),
                );
                image_div.appendChild(remove_button);
            }

            content_blobs_scrool.appendChild(image_div);
        }
    } else {
        let information = document.createElement("p");
        information.classList.add("d-flex", "w-100", "space-0", "p-4", "center-xy");
        information.innerText = "Não há imagens cadastrados, edite o portfólio para adicionar uma!";
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
        content_add_div_1.classList.add("col-12", "space-0", "px-4", "w-100", "mb-3");
        let content_add_div_1_input = document.createElement("input");
        content_add_div_1_input.classList.add("form-control");
        content_add_div_1_input.setAttribute("type", "file");
        content_add_div_1.appendChild(content_add_div_1_input);
        content_add.appendChild(content_add_div_1);

        content_add_div_1_input.addEventListener("change", () => {
            // Watch change in input of files and check if they are valid
            try {
                assertBase64ConvertableImage(content_add_div_1_input.files);
            } catch (error) {
                alert(error);
                content_add_div_1_input.value = "";
            }
        });

        let content_add_div_2 = document.createElement("div");
        content_add_div_2.classList.add("col-12", "space-0", "px-4", "pb-4");

        let content_add_div_2_button = document.createElement("button");
        content_add_div_2_button.classList.add(
            "btn",
            "btn-outline-primary",
            "text-decoration-none",
            "w-100",
        );
        content_add_div_2_button.role = "button";
        content_add_div_2_button.innerHTML = `<div class="d-flex justify-content-center m-2">
            <img class="icon-24px fixed-filter-invert me-2"
                src="static/action-icons/add.svg">
                <p class="space-0">Adicionar imagens</p>
        </div>`;
        content_add_div_2_button.addEventListener("click", async () => {
            if (!(content_add_div_1_input instanceof HTMLInputElement)) return;

            if (!content_add_div_1_input.files || !content_add_div_1_input.files.length) {
                alert("Seleciona um arquivo!");
                return;
            }

            commitAddImage(_portfolio_id, _section_id, content_add_div_1_input.files[0]);
        });
        content_add_div_2.appendChild(content_add_div_2_button);
        content_add.appendChild(content_add_div_2);
        content_container.appendChild(content_add);
    }

    return content_container;
}
/**
 * @param {number} portfolio_id
 * @param {number} section_id
 * @param {string} section_name
 * @param {string} section_description
 * @param {boolean} enable_edit
 * @param {any[]} content
 */
function createLinkSection(
    portfolio_id,
    section_id,
    section_name,
    section_description,
    enable_edit,
    content,
) {
    const _portfolio_id = ensureInteger(portfolio_id);
    const _section_id = ensureInteger(section_id);

    if (!_portfolio_id || !_section_id) return;

    const _section_name = section_name || "Redes";
    const _section_description = section_description || "Links Externos";

    const section_header = createSectionHeader(
        "link",
        "filter-link",
        section_name,
        section_description,
    );

    if (enable_edit) {
        section_header.appendChild(
            createActionMenu(_portfolio_id, _section_id, _section_name, _section_description),
        );
    }

    let content_container = createSectionContainer();
    content_container.appendChild(section_header);

    let content_blobs = document.createElement("div");
    content_blobs.classList.add("row", "w-100", "m-0", "g-3", "py-2", "px-3", "pb-4");

    if (content && content.length) {
        for (let i = 0; i < content.length; i++) {
            if (!content[i].blob && !content[i].descricao) return;

            let link_div = document.createElement("div");
            link_div.classList.add("col-12", "col-sm-6", "col-xl-4", "position-relative");
            link_div.innerHTML += `<a class="btn btn-primary text-decoration-none w-100" href="${content[i].blob}" role="button">
                    <div class="d-flex justify-content-center m-2">
                        <img class="icon-24px fixed-filter-invert me-2"
                            src="static/action-icons/external.svg">
                            <p class="space-0">${content[i].descricao}</p>
                    </div>
                </a>`;

            if (enable_edit) {
                let remove_button = document.createElement("button");
                remove_button.innerHTML = `<img class="icon-dark icon-24px" src="static/action-icons/close.svg">`;
                // TODO: Simplify classes
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
                    "center-xy",
                );
                link_div.appendChild(remove_button);
                remove_button.addEventListener("click", () =>
                    triggerDeleteLink(
                        new DeleteBlobContext(
                            _portfolio_id,
                            _section_id,
                            content[i].blob,
                            content[i].descricao,
                        ),
                    ),
                );
            }

            content_blobs.appendChild(link_div);
        }
    } else {
        content_blobs.appendChild(createNoLinkSubSection());
    }

    if (enable_edit) {
        content_blobs.appendChild(createAddLinkSubSection(_portfolio_id, _section_id));
    }

    content_container.appendChild(content_blobs);

    return content_container;
}

/**
 * @param {number} portf_id
 * @param {boolean} enable_edit
 */
// TODO: Remover async dessa função ou dividir em funcoes menores
async function setupPortfolioPage(portf_id, enable_edit) {
    if (!portf_id && typeof portf_id !== "number") return;

    if (typeof enable_edit !== "boolean") enable_edit = false;

    const portfolio = await crud_portfolios.lerPortfolio(_portfolio_id);
    if (!portfolio) {
        console.log("setupPortfolioPage: nenhum portfólio cadastrado!");
        alert("A id informada para o portfólio não existe!");
        setIdParam(0);
        return;
    }

    toggleDisplayNoneOnElement("portfolio-display", false);

    let toggle_edit_element = document.getElementById("toggle-edit-div");
    if (!(toggle_edit_element instanceof HTMLDivElement)) return;

    toggle_edit_element.appendChild(createEditPortfolioButton(enable_edit));
    if (enable_edit) {
        toggleDisplayNoneOnElement("add-section", false);

        const popup_edit_section_close = document.getElementById("popup-edit-close");
        const popup_edit_section_confirm = document.getElementById("popup-edit-confirm");

        popup_edit_section_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-edit", true),
        );
        popup_edit_section_confirm?.addEventListener("click", commitEditSectionInfo);

        const add_section = document.getElementById("add-section");
        const popup_add_section_close = document.getElementById("popup-add-close");
        const popup_add_section_confirm = document.getElementById("popup-add-confirm");

        // Botão de adicionar seção
        add_section?.addEventListener("click", () =>
            triggerAddSection(new AddSectionContext(portfolio.id)),
        );
        popup_add_section_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-add", true),
        );
        popup_add_section_confirm?.addEventListener("click", commitAddAsection);

        const popup_add_link_close = document.getElementById("popup-add-link-close");
        const popup_add_link_confirm = document.getElementById("popup-add-link-confirm");
        popup_add_link_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-add-link", true),
        );
        popup_add_link_confirm?.addEventListener("click", commitAddLink);

        const popup_delete_section_close = document.getElementById("popup-delete-close");
        const popup_delete_section_cancel = document.getElementById("popup-delete-cancel");
        const popup_delete_section_confirm = document.getElementById("popup-delete-confirm");

        popup_delete_section_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete", true),
        );
        popup_delete_section_cancel?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete", true),
        );
        popup_delete_section_confirm?.addEventListener("click", commitDeleteSection);

        const popup_delete_image_close = document.getElementById("popup-delete-image-close");
        const popup_delete_image_cancel = document.getElementById("popup-delete-image-cancel");
        const popup_delete_image_confirm = document.getElementById("popup-delete-image-confirm");

        popup_delete_image_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete-image", true),
        );
        popup_delete_image_cancel?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete-image", true),
        );
        popup_delete_image_confirm?.addEventListener("click", () => commitDeleteImage);

        const popup_delete_link_close = document.getElementById("popup-delete-link-close");
        const popup_delete_link_cancel = document.getElementById("popup-delete-link-cancel");
        const popup_delete_link_confirm = document.getElementById("popup-delete-link-confirm");

        popup_delete_link_close?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete-link", true),
        );
        popup_delete_link_cancel?.addEventListener("click", () =>
            toggleDisplayNoneOnElement("popup-delete-link", true),
        );
        popup_delete_link_confirm?.addEventListener("click", () => commitDeleteLink);
    }

    /** @type {string} */
    const portfolio_user_id = portfolio.usuarioId;
    const portfolio_user = await crud_usuarios.lerUsuario(portfolio_user_id);
    if (!portfolio_user) {
        console.log("setupPortfolioPage: no user");
        return;
    }

    let portfolio_user_name = portfolio_user.nome;
    let portfolio_user_about = portfolio_user.biografia || "Sem descrição informada";
    let portfolio_user_picture =
        portfolio_user.foto || `https://picsum.photos/seed/${portfolio_user_id}/200`;

    // TODO: adicionar contato e e-mail?
    // TODO: Se não preenchido na hora do cadastro?
    if (!portfolio_user_name || !portfolio_user_id || !portfolio_user_about) {
        console.log("setupPortfolioPage: não foi possível verificar alguma informação do usuário");
        return;
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
        return;
    }

    portfolio_name.innerText = portfolio_user_name;
    portfolio_username.innerText = `@${portfolio_user_id}`;
    portfolio_picture.src = portfolio_user_picture;
    portfolio_descricao.innerText = portfolio_user_about;

    const media = await getMediaAvaliacoes(portfolio_user_id);
    if (media) {
        portfolio_nota.innerText = media.toString();
    }

    // TODO: O usuário pode não ter cadastrado nenhuma seção ainda
    if (!portfolio.secoes.length && !enable_edit) {
        let information = document.createElement("h5");
        information.classList.add("d-flex", "w-100", "space-0", "p-4", "center-xy");
        information.innerText = "Portfólio vazio, edite o portfólio para adicionar uma seção!";
        portfolio_secoes.appendChild(information);
        return;
    }

    // TODO: Permitir apenas 1 seção de avaliações
    for (const element of portfolio.secoes) {
        const e_section_name = element.nome;
        const e_section_description = element.descricao;
        const e_section_id = element.ordem;
        const e_section_category_id = element.categoriaId;
        // For categoriaId(0), content is optional
        const e_secao_content = element.contents;

        if (
            !e_section_name ||
            (!e_section_id && typeof e_section_id !== "number") ||
            (!e_section_category_id && typeof e_section_category_id !== "number")
        ) {
            console.log("setupPortfolioPage: algo na seção não foi encontrado!");
            return;
        }

        switch (e_section_category_id) {
            // categoriaId(1): Avaliações
            case 1:
                {
                    const child = await createReviewSection(
                        portfolio.id,
                        e_section_id,
                        e_section_name,
                        e_section_description,
                        enable_edit,
                        portfolio_user_id,
                    );
                    if (child) portfolio_secoes.appendChild(child);
                }
                break;
            // categoriaId(0): Fotos
            case 0:
                {
                    const child = createImageSection(
                        portfolio.id,
                        e_section_id,
                        e_section_name,
                        e_section_description,
                        enable_edit,
                        e_secao_content,
                    );
                    if (child) portfolio_secoes.appendChild(child);
                }
                break;
            // categoriaId(2): Links
            case 2:
                {
                    const child = createLinkSection(
                        portfolio.id,
                        e_section_id,
                        e_section_name,
                        e_section_description,
                        enable_edit,
                        e_secao_content,
                    );
                    if (child) portfolio_secoes.appendChild(child);
                }
                break;
        }
    }
}

async function setupPortfolioSetupUsuarios() {
    // OPTIMIZE: Ler os usuários anteriormente e escolher um número aleatorio
    const _usuarios = await crud_usuarios.lerUsuarios();

    const portfolio_setup_create_select = document.getElementById("portfolio-setup-create-select");
    const portfolio_setup_create_btn = document.getElementById("portfolio-setup-create-btn");

    if (
        !(portfolio_setup_create_select instanceof HTMLSelectElement) ||
        !(portfolio_setup_create_btn instanceof HTMLButtonElement)
    ) {
        console.error(`${this.name}: null check`);
        return;
    }

    // Se existem usuários, adiciona-os à lista (criar novo portfólio)
    if (_usuarios && _usuarios.length) {
        for (let i = 0; i < _usuarios.length; i++) {
            let option = document.createElement("option");
            option.value = _usuarios[i].id;
            option.innerText = `Usuário id(${_usuarios[i].id}): ${_usuarios[i].nome}`;
            portfolio_setup_create_select.appendChild(option);
        }
        portfolio_setup_create_btn.classList.remove("disabled");
        portfolio_setup_create_btn.addEventListener("click", async () => {
            // Criar portfólio para o usuário de id $?
            let portfolioId = await crud_portfolios.criarPortfolio({
                usuarioId: portfolio_setup_create_select.value,
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
    portfolio_setup_create_select.appendChild(option);
}

async function setupPortfolioSetupPortfolios() {
    let portfolio_setup_select_select = document.getElementById("portfolio-setup-select-select");
    let portfolio_setup_select_btn = document.getElementById("portfolio-setup-select-btn");

    if (
        !(portfolio_setup_select_select instanceof HTMLSelectElement) ||
        !(portfolio_setup_select_btn instanceof HTMLButtonElement)
    ) {
        console.error(`${this.name}: null check`);
        return;
    }

    // Lê os portfolios e usuários disponíveis
    const _portfolios = await crud_portfolios.lerPortfolio(_portfolio_id);

    // Se existem portfólios, adiciona-os à lista (abrir portfólio)
    if (_portfolios && _portfolios.length) {
        for (let i = 0; i < _portfolios.length; i++) {
            let option = document.createElement("option");
            option.value = _portfolios[i].id;
            option.innerText = `Portfólio de id(${_portfolios[i].id})`;
            portfolio_setup_select_select.appendChild(option);
        }
        portfolio_setup_select_btn.classList.remove("disabled");
        portfolio_setup_select_btn.addEventListener("click", () =>
            // Abrir o portfólio de id $?
            setIdParam(parseInt(portfolio_setup_select_select.value)),
        );
    } else {
        let option = document.createElement("option");
        option.innerText = `Nenhum portfólio criado!`;
        portfolio_setup_select_select.appendChild(option);
    }
}

async function setupPortfolioSetupMicroDev() {
    let portfolio_setup_dev_btn = document.getElementById("portfolio-setup-dev-btn");

    if (!(portfolio_setup_dev_btn instanceof HTMLButtonElement))
        throw new Error(`${this.name}: null check`);

    portfolio_setup_dev_btn.addEventListener("click", async () => {
        // Utilizar a página 'dev.js'
        await Faker.criarNUsuarios(30);
        await Faker.criarNServicos(60, true);
        await Faker.criarNContratos(90);
        await Faker.criarNAvaliacoes(120);
        notifySectionDataChanged();
    });
}

// Configura a página inicial de visualizar/criar portfólios
function setupPortfolioSetup() {
    // Mostra os elementos da página de setup do portfólio
    // TODO: Adicionar a pagina dinamicamente
    toggleDisplayNoneOnElement("portfolio-setup", false);
    // Adiciona usuários a página de setup de portfólio
    setupPortfolioSetupUsuarios();
    // Adiciona portfólios a página de setup de portfólio
    setupPortfolioSetupPortfolios();
    // Adiciona opções de desenvolvedor a página de setup de portfólio
    setupPortfolioSetupMicroDev();
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
