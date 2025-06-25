// @ts-check

import { Usuarios } from "./jsonf/usuarios.mjs";
import { Servicos } from "./jsonf/servicos.mjs";

const crudUsuarios = new Usuarios();
const crudServicos = new Servicos();

const prepareString = (str) => {
    return (
        str
            // Normaliza string
            .normalize("NFD")
            // Remove acentos gráficos
            .replace(/[\u0300-\u036f]/g, "")
            // Remove espaços
            .replace(" ", "")
            // Converter para Lower Case
            .toLowerCase()
    );
};

/** @type {any[] | null} */
let usuarios = [];
/** @type {any[] | null} */
let servicos = [];

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

let filtros = null;

function createServiceCard(
    id,
    fotoSrc,
    titulo,
    nomeUsuario,
    descricao,
    quantAvaliacoes,
    notaMedAvaliacoes,
) {
    const card = document.createElement("a");
    card.classList.add("col-12", "col-md-6", "col-xl-4", "text-decoration-none");
    card.href = `/detalhes?id=${id}`;
    // TODO: Adicionar avaliações como estrelas
    card.innerHTML = `<div class="card h-100 w-100">
        <div class="card-body d-flex flex-column">
        <div class="d-flex flex-row mb-2 align-items-center">
            <img class="card-image me-2 rounded border" src="${
                fotoSrc || "static/img/placeholder_profile.png"
            }" />
            <div class="flex-column">
            <h4 class="space-0">${titulo}</h4>
            <p class="space-0">💼 ${nomeUsuario}</p>
            </div>
        </div>
        <p>${descricao}</p>
        <div class="d-flex flex-row justify-content-between mt-auto">
            <p class="space-0">📝 ${quantAvaliacoes}</p>
            <p class="space-0">⭐ ${notaMedAvaliacoes}/10</p>
        </div>
        </div>
    </div>`;

    return card;
}

function createUserCard(
    id,
    fotoSrc,
    nomeUsuario,
    localizacao,
    quantAvaliacoes,
    notaMedAvaliacoes,
    biografia,
) {
    const card = document.createElement("a");
    card.classList.add("col-12", "col-md-6", "col-xl-4", "text-decoration-none");
    card.href = `/perfil?id=${id}`;
    // TODO: Adicionar avaliações como estrelas
    card.innerHTML = `<div class="card h-100 w-100">
        <div class="card-body d-flex flex-column">
        <div class="d-flex flex-row mb-2 align-items-center">
            <img class="card-image me-2 rounded border" src="${
                fotoSrc || "static/img/placeholder_profile.png"
            }" />
            <div class="flex-column">
            <h4 class="space-0">${nomeUsuario}</h4>
            <p class="space-0">🗺️ ${localizacao}</p>
            </div>
        </div>
        <p>${biografia}</p>
        <div class="d-flex flex-row justify-content-between mt-auto">
            <p class="space-0">📝 ${quantAvaliacoes}</p>
            
            <p class="space-0">⭐ ${notaMedAvaliacoes}/10</p>
        </div>
        </div>
    </div>`;

    return card;
}

async function getData() {
    servicos = await crudServicos.lerServicos();
    if (!servicos) return;

    usuarios = await crudUsuarios.lerUsuarios();
    if (!usuarios) return;
}

const PLACEHOLDER_QUANT_AVAL_SERV = 12;
const PLACEHOLDER_NOTA_MED_AVAL_SERV = 6;
const PLACEHOLDER_QUANT_AVAL_USUA = 1923;
const PLACEHOLDER_NOTA_MED_AVAL_USUA = 8;

function showResultsServices() {
    const htmlDivServicos = document.getElementById("row-service");
    if (!(htmlDivServicos instanceof HTMLDivElement)) {
        console.error("Can't find the html element 'row-service'");
        return;
    }
    htmlDivServicos.innerHTML = "";

    if (!servicos) return;

    let servicosFiltrados = servicos;
    if (filtros?.query)
        servicosFiltrados = servicosFiltrados.filter((_servico) => {
            const indexer = prepareString(`${_servico.id}${_servico.titulo}${_servico.descricao}`);
            return indexer.includes(prepareString(filtros?.query));
        });

    if (filtros?.localizacao)
        servicosFiltrados = servicosFiltrados.filter((_servico) => {
            // INFO: Desabilitado por agora devido ao CRUD de serviços não incluir a informação de localização
            // TODO: Add a filter to all elements of filtering
            const cidade = _servico.cidade || "";
            return cidade.toLowerCase().includes(filtros?.localizacao);
        });

    if (filtros?.review)
        servicosFiltrados = servicosFiltrados.filter(
            () => PLACEHOLDER_NOTA_MED_AVAL_SERV >= parseInt(filtros?.review, 10),
        );

    const htmlSpanServico404Query = document.getElementById("search_text_se");
    const htmlSpanUsuario404Container = document.getElementById("no_found_service");
    if (servicosFiltrados.length === 0) {
        htmlSpanUsuario404Container?.classList.remove("d-none");
        if (filtros?.query?.trim() && htmlSpanServico404Query instanceof HTMLSpanElement) {
            htmlSpanServico404Query.innerText = ` com a pesquisa "${filtros?.query}"`;
        }
    } else {
        htmlSpanUsuario404Container?.classList.add("d-none");
        if (htmlSpanServico404Query instanceof HTMLSpanElement)
            htmlSpanServico404Query.innerText = "";
    }

    for (const _servico of servicosFiltrados) {
        htmlDivServicos.appendChild(
            createServiceCard(
                _servico.id,
                _servico.imagem,
                _servico.titulo,
                // _servico_user_id,
                // TODO: Ler dinamicamente e criar relação do usuario com o serviço
                "Fulano",
                _servico.descricao,
                PLACEHOLDER_QUANT_AVAL_SERV,
                PLACEHOLDER_NOTA_MED_AVAL_SERV,
            ),
        );
    }
}

function showResultsUsers() {
    const htmlDivUsuarios = document.getElementById("row-users");
    if (!(htmlDivUsuarios instanceof HTMLDivElement)) return;
    htmlDivUsuarios.innerHTML = "";

    if (!usuarios) return;

    let usuariosFiltrados = usuarios;

    if (filtros?.query)
        usuariosFiltrados = usuariosFiltrados.filter((_user) => {
            const indexer = prepareString(
                `${_user.id}${_user.nome}${_user.cidade}${_user.biografia}`,
            );
            return indexer.includes(prepareString(filtros?.query));
        });

    if (filtros?.localizacao)
        usuariosFiltrados = usuariosFiltrados.filter((_user) => {
            return _user.cidade?.toLowerCase().includes(filtros?.localizacao.trim().toLowerCase());
        });

    if (filtros?.review)
        usuariosFiltrados = usuariosFiltrados.filter(
            () => PLACEHOLDER_NOTA_MED_AVAL_USUA >= parseInt(filtros?.review, 10),
        );

    const htmlSpanUsuario404Query = document.getElementById("search_text_us");
    const htmlSpanUsuario404Container = document.getElementById("no_found_user");
    if (usuariosFiltrados.length === 0) {
        htmlSpanUsuario404Container?.classList.remove("d-none");
        if (filtros?.query.trim() !== "" && htmlSpanUsuario404Query instanceof HTMLSpanElement) {
            htmlSpanUsuario404Query.innerText = ` com a pesquisa "${filtros?.query}"`;
        }
    } else {
        htmlSpanUsuario404Container?.classList.add("d-none");
        if (htmlSpanUsuario404Query instanceof HTMLSpanElement)
            htmlSpanUsuario404Query.innerText = "";
    }
    for (const _user of usuariosFiltrados) {
        // TODO: Ler dinamicamente
        htmlDivUsuarios.appendChild(
            createUserCard(
                _user.id,
                _user.foto,
                _user.nome,
                _user.cidade,
                PLACEHOLDER_QUANT_AVAL_USUA,
                PLACEHOLDER_NOTA_MED_AVAL_USUA,
                _user.biografia,
            ),
        );
    }
}

function showResults() {
    showResultsServices();
    showResultsUsers();
}

function createOption(value) {
    let option = document.createElement("option");
    option.innerText = value;
    return option;
}

function setupFiltersElement() {
    const htmlInputRangeNota = document.getElementById("review_range");
    const htmlSelectLocalizacao = document.getElementById("localizacao_select");
    const htmlSpanRangeInfo = document.getElementById("review_range_info");

    let opcoesLocalizacao = new Map();

    if (usuarios) {
        usuarios.forEach((_user, i) => {
            if (_user.cidade) {
                opcoesLocalizacao.set(_user.cidade, i);
            }
        });
    }

    opcoesLocalizacao.forEach((_, k) => {
        htmlSelectLocalizacao?.appendChild(createOption(k));
    });

    if (
        !(htmlInputRangeNota instanceof HTMLInputElement) ||
        !(htmlSpanRangeInfo instanceof HTMLSpanElement) ||
        !(htmlSelectLocalizacao instanceof HTMLSelectElement)
    )
        return;

    htmlInputRangeNota.addEventListener("input", () => {
        const val = htmlInputRangeNota.value;
        filtros.review = val;
        htmlSpanRangeInfo.innerText = val;
        setParamNoReload();
        showResults();
    });

    htmlSelectLocalizacao.addEventListener("input", () => {
        if (!(htmlSelectLocalizacao instanceof HTMLSelectElement)) return;
        if (htmlSelectLocalizacao.value === "0") {
            filtros.localizacao = null;
        } else filtros.localizacao = htmlSelectLocalizacao.selectedOptions[0].text.trim();
        setParamNoReload();
        showResults();
    });

    if (filtros?.query && filtros?.query.trim() !== "") {
        const htmlInputSearchQuery = document.getElementById("search-bar");
        if (htmlInputSearchQuery instanceof HTMLInputElement) {
            htmlInputSearchQuery.value = filtros?.query;
        }
    }

    if (filtros?.review && filtros?.review !== "0") {
        htmlInputRangeNota.value = filtros?.review;
        htmlSpanRangeInfo.innerText = filtros?.review;
    }

    if (filtros?.localizacao && opcoesLocalizacao.has(filtros?.localizacao)) {
        let tt = opcoesLocalizacao.get(filtros?.localizacao);
        htmlSelectLocalizacao.selectedIndex = tt + 1;
        htmlSelectLocalizacao.value = filtros?.localizacao;
    }
}

function setOnLoadParamFilters() {
    let params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const localizacao = params.get("local") || "";
    const review = params.get("review") || "";
    filtros = new Filtros(query, localizacao, review);
}

function setParamNoReload() {
    let params = new URLSearchParams(location.search);
    if (filtros?.query) params.set("q", filtros?.query);
    else params.delete("q");
    if (filtros?.localizacao) params.set("local", filtros?.localizacao);
    else params.delete("local");
    if (!filtros?.review || filtros?.review === "0") params.delete("review");
    else params.set("review", filtros?.review);

    const url = new URL(window.location.href);
    const newParams = params.size === 0 ? `` : `?${params.toString()}`;
    const newUrl = `${url.origin}${url.pathname}${newParams}`;

    window.history.replaceState(null, document.title, newUrl);
}

function limparFiltros() {
    // Limpar os filtros apenas se há algum configurado
    if (!filtros?.query && !filtros?.localizacao && !filtros?.review) return;
    filtros = new Filtros(null, null, null);
    showResults();
}

function setupClearButton() {
    const htmlButtonLimpar = document.getElementById("clear-btn");

    if (!(htmlButtonLimpar instanceof HTMLButtonElement)) return;

    htmlButtonLimpar.classList.remove("d-none");
    htmlButtonLimpar.addEventListener("click", (e) => {
        e.preventDefault();
        limparFiltros();
        setParamNoReload();

        // Move to a function
        const htmlInputRangeNota = document.getElementById("review_range");
        const htmlSelectLocalizacao = document.getElementById("localizacao_select");
        const htmlSpanRangeInfo = document.getElementById("review_range_info");
        const htmlInputSearchQuery = document.getElementById("search-bar");

        if (
            !(htmlInputRangeNota instanceof HTMLInputElement) ||
            !(htmlSpanRangeInfo instanceof HTMLSpanElement) ||
            !(htmlSelectLocalizacao instanceof HTMLSelectElement) ||
            !(htmlInputSearchQuery instanceof HTMLInputElement)
        )
            return;

        htmlSelectLocalizacao.selectedIndex = 0;
        htmlSelectLocalizacao.value = "0";
        htmlInputRangeNota.value = "0";
        htmlSpanRangeInfo.innerText = "0";
        htmlInputSearchQuery.value = "";
    });
}

(async () => {
    setOnLoadParamFilters();
    await getData();
    setupClearButton();
    setupFiltersElement();
    showResults();
})();
