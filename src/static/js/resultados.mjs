// @ts-check

import { readUsuarios } from "./jsonql.user.mjs";
import { readServicos } from "./jsonql.service.mjs";

function createServiceCard(
    id,
    foto_src,
    titulo,
    nome_usuario,
    descricao,
    quantidade_avaliacoes,
    nota_avaliacoes
) {
    const card = document.createElement("div");
    card.classList.add("col-12", "col-md-6", "col-xl-4");
    card.innerHTML = `<div class="card h-100 w-100">
        <div class="card-body d-flex flex-column">
        <div class="d-flex flex-row mb-2 align-items-center">
            <img class="card-image me-2 rounded" src="${
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
    const card = document.createElement("div");
    card.classList.add("col-12", "col-md-6", "col-xl-4");
    card.innerHTML = `<div class="card h-100 w-100">
        <div class="card-body d-flex flex-column">
        <div class="d-flex flex-row mb-2 align-items-center">
            <img class="card-image me-2 rounded" src="${
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

function setupResultadosServicos() {
    const html_row_service = document.getElementById("row-service");
    if (!(html_row_service instanceof HTMLDivElement)) return;

    const servicos = readServicos();
    console.log(servicos);
    if (!servicos) return;

    servicos.forEach((_servico) => {
        // TODO: Criar relação do usuario com o serviço
        const _servico_user_id = "Fulano";
        // TODO: Ler dinamicamente
        const _user_avaliacoes_quantidade = 12;
        const _user_avaliacoes_nota_media = 6;
        html_row_service.appendChild(
            createServiceCard(
                _servico.id,
                _servico.imagem,
                _servico.titulo,
                _servico_user_id,
                _servico.descricao,
                _user_avaliacoes_quantidade,
                _user_avaliacoes_nota_media
            )
        );
    });
}

function setupResultadosUsuarios() {
    const html_row_users = document.getElementById("row-users");
    if (!(html_row_users instanceof HTMLDivElement)) return;

    const usuarios = readUsuarios();
    if (!usuarios) return;

    usuarios.forEach((_user) => {
        // TODO: Ler dinamicamente
        const _user_avaliacoes_quantidade = 1923;
        const _user_avaliacoes_nota_media = 8;
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

// function setupResultados()
(() => {
    setupResultadosUsuarios();
    setupResultadosServicos();
})();
