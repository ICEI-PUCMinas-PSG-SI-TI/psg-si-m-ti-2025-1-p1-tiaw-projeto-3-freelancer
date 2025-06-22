//@ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";

const crud_usuarios = new Usuarios();

// Dados dos profissionais
const profissionais = await crud_usuarios.lerUsuarios();

// Ícones por categoria
const categoriaIcons = {
    garcons: '<i class="bi bi-cup-hot"></i>',
    fotografos: '<i class="bi bi-camera-fill"></i>',
    programadores: '<i class="bi bi-code-slash"></i>',
    designers: '<i class="bi bi-palette-fill"></i>',
};

// Renderiza Top 10
const top10Container = document.getElementById("top10");
profissionais.slice(0, 10).forEach((_profissional, index) => {
    const box = document.createElement("div");
    box.classList.add(
        "card-box",
        "shadow",
        "rounded",
        "bg-light",
        "position-relative",
        "overflow-hidden",
    );
    box.style.cursor = "pointer";
    box.addEventListener("click", () =>
        location.assign("perfil.html?nome=" + encodeURIComponent(_profissional.nome)),
    );

    const number = document.createElement("span");
    number.classList.add("number");
    number.textContent = String(index + 1);

    const img = document.createElement("img");
    img.src = _profissional.imagem;
    img.alt = _profissional.nome;

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
    overlay.innerHTML = `${categoriaIcons[_profissional.categoria] || ""}<span class="ms-2">${
        _profissional.nome
    }</span>`;

    box.appendChild(number);
    box.appendChild(img);
    box.appendChild(overlay);
    top10Container.appendChild(box);
});

// Renderiza por categoria (15 por categoria)
function renderCategoria(categoriaId) {
    const container = document.getElementById(categoriaId);
    // Limpa antes de renderizar
    container.innerHTML = "";
    const filtrados = profissionais.filter((p) => p.profissao === categoriaId).slice(0, 15);
    filtrados.forEach((p) => {
        const box = document.createElement("div");
        box.classList.add(
            "card-box",
            "shadow",
            "rounded",
            "bg-light",
            "position-relative",
            "overflow-hidden",
        );
        box.style.cursor = "pointer";
        box.onclick = () =>
            (window.location.href = "perfil.html?nome=" + encodeURIComponent(p.nome));

        const img = document.createElement("img");
        img.src = p.imagem;
        img.alt = p.nome;

        // Overlay com nome e ícone
        const overlay = document.createElement("div");
        overlay.className =
            "position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-75 text-white d-flex align-items-center";
        overlay.innerHTML = `${categoriaIcons[categoriaId] || ""}<span class="ms-2">${
            p.nome
        }</span>`;

        box.appendChild(img);
        box.appendChild(overlay);
        container.appendChild(box);
    });
}

let array_categorias = new Set(["Fotográfo", "Designer", "Programador", "Garçom"]);
array_categorias.forEach((value) => renderCategoria(value));

// Função para filtrar categorias
function filtrarCategoria(cat, btn) {
    // Troca botão ativo
    document
        .querySelectorAll(".category-filter .btn")
        .forEach((_button) => _button.classList.remove("active"));
    if (btn) btn.classList.add("active");

    // Mostra ou esconde categorias
    document.querySelectorAll(".category").forEach((div) => {
        if (cat === "todos") {
            div.style.display = "block";
        } else {
            div.style.display = div.id === "cat-" + cat ? "block" : "none";
        }
    });
}

// Inicializa mostrando todos após o DOM estar pronto
document.addEventListener("DOMContentLoaded", () =>
    filtrarCategoria("todos", document.querySelector(".category-filter .btn")),
);

document
    .querySelectorAll("main.body-content div button.btn.btn-dark")
    .forEach((_button) =>
        _button.addEventListener("click", () => filtrarCategoria(_button.value, _button)),
    );

// eslint-disable-next-line no-unused-vars
function rolar(id, dir) {
    const el = document.getElementById(id);
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
}
