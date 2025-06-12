// @ts-check

import { readUsuarios } from "./jsonql.user.mjs";
import { readServicos } from "./jsonql.service.mjs";

/** @type {any[] | null} */
var usuarios = [];
/** @type {any[] | null} */
var servicos = [];

class Filtros {
    constructor(query, localizacao, review) {
        if (query && typeof query === "string" && query.trim() !== "") this.query = query;
        else query = null;
        if (localizacao && typeof localizacao === "string" && localizacao.trim() !== "")
            this.localizacao = localizacao;
        else localizacao = null;
        if (review && typeof review === "string" && review.trim() !== "") this.review = review;
        else review = null;
    }
}

var filtros = null;

function createServiceCard(
    id,
    foto_src,
    titulo,
    nome_usuario,
    descricao,
    quantidade_avaliacoes,
    nota_avaliacoes
) {
    const card = document.createElement("a");
    card.classList.add("col-12", "col-md-6", "col-xl-4", "text-decoration-none");
    card.href = "/404.html";
    card.innerHTML = `<div class="card h-100 w-100">
        <div class="card-body d-flex flex-column">
        <div class="d-flex flex-row mb-2 align-items-center">
            <img class="card-image me-2 rounded border" src="${
                foto_src || "static/img/placeholder_profile.png"
            }" />
            <div class="flex-column">
            <h4 class="space-0">${titulo}</h4>
            <p class="space-0">💼 ${nome_usuario}</p>
            </div>
        </div>
        <p>${descricao}</p>
        <div class="d-flex flex-row justify-content-between mt-auto">
            <p class="space-0">📝 ${quantidade_avaliacoes}</p>
            <!-- TODO: Adicionar como estrelas -->
            <p class="space-0">⭐ ${nota_avaliacoes}/10</p>
        </div>
        </div>
    </div>`;

    return card;
}

function createUserCard(
    id,
    foto_src,
    nome_usuario,
    localizacao,
    quantidade_avaliacoes,
    nota_avaliacoes,
    biografia
) {
    const card = document.createElement("a");
    card.classList.add("col-12", "col-md-6", "col-xl-4", "text-decoration-none");
    card.href = "/404.html";
    card.innerHTML = `<div class="card h-100 w-100">
        <div class="card-body d-flex flex-column">
        <div class="d-flex flex-row mb-2 align-items-center">
            <img class="card-image me-2 rounded border" src="${
                foto_src || "static/img/placeholder_profile.png"
            }" />
            <div class="flex-column">
            <h4 class="space-0">${nome_usuario}</h4>
            <p class="space-0">🗺️ ${localizacao}</p>
            </div>
        </div>
        <p>${biografia}</p>
        <div class="d-flex flex-row justify-content-between mt-auto">
            <p class="space-0">📝 ${quantidade_avaliacoes}</p>
            <!-- TODO: Adicionar como estrelas -->
            <p class="space-0">⭐ ${nota_avaliacoes}/10</p>
        </div>
        </div>
    </div>`;

    return card;
}

function getData() {
    servicos = readServicos();
    if (!servicos) return;

    usuarios = readUsuarios();
    if (!usuarios) return;
}

function showResults() {
    const pesquisa = filtros.query;
    const html_row_service = document.getElementById("row-service");
    if (!(html_row_service instanceof HTMLDivElement)) {
        console.log("not a html service");
        return;
    }
    html_row_service.innerHTML = "";

    if (!servicos) return;

    let service_filtered = servicos;
    if (filtros.query)
        service_filtered = service_filtered.filter((_servico) => {
            const indexer = `${_servico.id}${_servico.titulo}${_servico.descricao}`;
            return indexer.toLowerCase().includes(filtros.query.toLowerCase());
        });

    if (filtros.localizacao)
        service_filtered = service_filtered.filter((_servico) => {
            // INFO: Desabilitado por agora devido ao CRUD de serviços não incluir a informação de localização
            // TODO: Add a filter to all elements of filtering
            const cidade = _servico.cidade || "";
            return cidade.toLowerCase().includes(filtros.localizacao);
        });

    const _service_avaliacoes_quantidade = 12;
    const _service_avaliacoes_nota_media = 6;

    if (filtros.review)
        service_filtered = service_filtered.filter((_servico) => {
            return _service_avaliacoes_nota_media >= parseInt(filtros.review);
        });

    const no_found_service = document.getElementById("no_found_service");
    if (service_filtered.length === 0) {
        no_found_service?.classList.remove("d-none");
    } else {
        no_found_service?.classList.add("d-none");
    }

    service_filtered.forEach((_servico) => {
        // TODO: Criar relação do usuario com o serviço
        const _servico_user_id = "Fulano";
        // TODO: Ler dinamicamente
        html_row_service.appendChild(
            createServiceCard(
                _servico.id,
                _servico.imagem,
                _servico.titulo,
                _servico_user_id,
                _servico.descricao,
                _service_avaliacoes_quantidade,
                _service_avaliacoes_nota_media
            )
        );
    });

    const html_row_users = document.getElementById("row-users");
    if (!(html_row_users instanceof HTMLDivElement)) return;
    html_row_users.innerHTML = "";

    if (!usuarios) return;

    let user_filtered = usuarios;

    if (filtros.query)
        user_filtered = user_filtered.filter((_user) => {
            const indexer = `${_user.id}${_user.nome}${_user.cidade}${_user.biografia}`;
            return indexer.toLowerCase().includes(filtros.query.toLowerCase());
        });

    if (filtros.localizacao)
        user_filtered = user_filtered.filter((_user) => {
            return _user.cidade.toLowerCase().includes(filtros.localizacao.trim().toLowerCase());
        });

    const _user_avaliacoes_quantidade = 1923;
    const _user_avaliacoes_nota_media = 8;

    if (filtros.review)
        user_filtered = user_filtered.filter((_user) => {
            return _user_avaliacoes_nota_media >= parseInt(filtros.review);
        });

    const no_found_user = document.getElementById("no_found_user");
    if (user_filtered.length === 0) {
        no_found_user?.classList.remove("d-none");
    } else {
        no_found_user?.classList.add("d-none");
    }
    user_filtered.forEach((_user) => {
        // TODO: Ler dinamicamente
        html_row_users.appendChild(
            createUserCard(
                _user.id,
                _user.foto,
                _user.nome,
                _user.cidade,
                _user_avaliacoes_quantidade,
                _user_avaliacoes_nota_media,
                _user.biografia
            )
        );
    });
}

function createOption(value) {
    let option = document.createElement("option");
    option.innerText = value;
    return option;
}

/**
 * @returns {Filtros | null}
 */
function setupFiltersElement() {
    const html_review_range = document.getElementById("review_range");
    const html_select_localizacao = document.getElementById("localizacao_select");
    const html_range_info = document.getElementById("review_range_info");

    let option_map = new Map();

    if (usuarios) {
        usuarios.forEach((_user, i) => {
            if (!_user.cidade) return;
            option_map.set(_user.cidade, i);
        });
    }

    option_map.forEach((_, k) => {
        html_select_localizacao?.appendChild(createOption(k));
    });

    if (
        !(html_review_range instanceof HTMLInputElement) ||
        !(html_range_info instanceof HTMLSpanElement) ||
        !(html_select_localizacao instanceof HTMLSelectElement)
    )
        return null;

    html_review_range.addEventListener("input", () => {
        const val = html_review_range.value;
        filtros.review = val;
        html_range_info.innerText = val;
        setParamNoReload();
        showResults();
    });

    html_select_localizacao.addEventListener("input", () => {
        if (!(html_select_localizacao instanceof HTMLSelectElement)) return;
        if (html_select_localizacao.value === "0") {
            filtros.localizacao = null;
        } else filtros.localizacao = html_select_localizacao.selectedOptions[0].text.trim();
        setParamNoReload();
        showResults();
    });

    if (filtros.query && filtros.query.trim() !== "") {
        const search_bar = document.getElementById("search-bar");
        if (search_bar instanceof HTMLInputElement) {
            search_bar.value = filtros.query;
        }
    }

    if (filtros.review && filtros.review !== "0") {
        html_review_range.value = filtros.review;
        html_range_info.innerText = filtros.review;
    }

    if (filtros.localizacao && option_map.has(filtros.localizacao)) {
        let tt = option_map.get(filtros.localizacao);
        html_select_localizacao.selectedIndex = tt + 1;
        html_select_localizacao.value = filtros.localizacao;
    }
    return null;
}

function setOnLoadParamFilters() {
    let params = new URLSearchParams(location.search);
    const query = (params.get("q") || "")
    const localizacao = params.get("local") || "";
    const review = (params.get("review") || "")
    filtros = new Filtros(query, localizacao, review);
}

function setParamNoReload() {
    let params = new URLSearchParams(location.search);
    if (filtros.query) params.set("q", filtros.query);
    else params.delete("q");
    if (filtros.localizacao) params.set("local", filtros.localizacao);
    else params.delete("local");
    if (!filtros.review || filtros.review === "0") params.delete("review");
    else params.set("review", filtros.review);

    const url = new URL(window.location.href);
    const newUrl = `${url.origin}${url.pathname}?${params.toString()}`;

    window.history.replaceState(null, document.title, newUrl);
}

(() => {
    setOnLoadParamFilters();
    getData();
    setupFiltersElement();
    showResults();
})();
