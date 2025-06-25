//@ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";
import { Servicos } from "../jsonf/servicos.mjs";

const crudUsuarios = new Usuarios();
const crudServicos = new Servicos();

// Dados dos profissionais
const profissionais = await crudUsuarios.lerUsuarios();
const servicos = await crudServicos.lerServicos();

// Ícones por categoria
const categoriaIcons = {
    garcons: '<i class="bi bi-cup-hot"></i>',
    fotografos: '<i class="bi bi-camera-fill"></i>',
    programadores: '<i class="bi bi-code-slash"></i>',
    designers: '<i class="bi bi-palette-fill"></i>',
};

function createProfileCard(id, index, foto, nome, categoria, path) {
    const card = document.createElement("a");
    card.classList.add(
        "card-box",
        "shadow",
        "rounded",
        "border",
        "bg-light",
        "position-relative",
        "overflow-hidden",
        "text-decoration-none",
    );
    card.style.cursor = "pointer";
    card.href = `/${path}?id=${id}`;

    const img = document.createElement("img");
    img.src = foto;
    img.alt = nome;

    // Overlay com nome e ícone
    const overlay = document.createElement("div");
    overlay.classList.add(
        "position-absolute",
        "bottom-0",
        "start-0",
        "w-100",
        "p-2",
        "bg-dark",
        "bg-opacity-75",
        "text-white",
        "d-flex",
        "align-items-center",
    );
    overlay.innerHTML = `${categoriaIcons[categoria] || ""}<span class="ms-2">${nome}</span>`;

    if (typeof index === "number") {
        const numberDiv = document.createElement("div");
        numberDiv.classList.add("number-div");
        const number = document.createElement("h5");
        number.classList.add("number", "space-0");
        number.textContent = String(index + 1);
        numberDiv.appendChild(number);
        card.appendChild(numberDiv);
    }

    card.appendChild(img);
    card.appendChild(overlay);

    return card;
}

function renderizarTop10Profissionais() {
    const top10Container = document.getElementById("top10");
    if (!top10Container) return;
    profissionais.slice(0, 10).forEach((_profissional, index) => {
        top10Container.appendChild(
            createProfileCard(
                _profissional.id,
                index,
                _profissional.foto,
                _profissional.nome,
                null,
                "perfil",
            ),
        );
    });
}

function renderizarTop10Servicos() {
    const top10Container = document.getElementById("top10-serv");
    if (!top10Container) return;
    servicos.slice(0, 10).forEach((_profissional, index) => {
        top10Container.appendChild(
            createProfileCard(
                _profissional.id,
                index,
                _profissional.imagem,
                _profissional.titulo,
                _profissional.categoria,
                "detalhes",
            ),
        );
    });
}

renderizarTop10Profissionais();
renderizarTop10Servicos();

// Renderiza por categoria (15 por categoria)
function renderCategoria(categoriaId) {
    const container = document.getElementById(categoriaId);
    if (!container) return;
    // Limpa antes de renderizar
    container.innerHTML = "";
    const filtrados = profissionais.filter((p) => p.profissao === categoriaId).slice(0, 15);
    if (filtrados.length === 0) container.parentElement?.classList.add("d-none");
    else container.parentElement?.classList.remove("d-none");
    for (const _profissional of filtrados) {
        const card = createProfileCard(
            _profissional.id,
            null,
            _profissional.foto,
            _profissional.nome,
            null,
            "perfil",
        );

        container.appendChild(card);
    }
}

let categoriasArray = new Set(["Fotográfo", "Designer", "Programador", "Garçom", "Outro"]);
categoriasArray.forEach((value) => {
    renderCategoria(value);
});

// Função para filtrar categorias
function filtrarCategoria(cat, btn) {
    // Troca botão ativo
    document
        .querySelectorAll(".category-filter .btn")
        .forEach((_button) => _button.classList.remove("active"));
    if (btn) btn.classList.add("active");

    // Mostra ou esconde categorias
    document.querySelectorAll(".category").forEach((div) => {
        if (div instanceof HTMLElement) {
            if (cat === "todos") {
                div.style.display = "block";
            } else {
                div.style.display = div.id === "cat-" + cat ? "block" : "none";
            }
        }
    });
}

// Inicializa mostrando todos após o DOM estar pronto
document.addEventListener("DOMContentLoaded", () =>
    filtrarCategoria("todos", document.querySelector(".category-filter .btn")),
);

document.querySelectorAll("main.body-content div button.btn.btn-dark").forEach((_button) => {
    if (_button instanceof HTMLButtonElement)
        _button.addEventListener("click", () => filtrarCategoria(_button.value, _button));
});
