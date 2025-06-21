// Dados dos profissionais
const profissionais = JSON.parse(localStorage.getItem("usuarios")) || [];

// Ícones por categoria
const categoriaIcons = {
    garcons: '<i class="bi bi-cup-hot"></i>',
    fotografos: '<i class="bi bi-camera-fill"></i>',
    programadores: '<i class="bi bi-code-slash"></i>',
    designers: '<i class="bi bi-palette-fill"></i>',
};

// Renderiza Top 10
const top10Container = document.getElementById("top10");
profissionais.slice(0, 10).forEach((pro, index) => {
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
    box.onclick = () => (window.location.href = "perfil.html?nome=" + encodeURIComponent(pro.nome));

    const number = document.createElement("span");
    number.classList.add("number");
    number.textContent = index + 1;

    const img = document.createElement("img");
    img.src = pro.imagem;
    img.alt = pro.nome;

    // Overlay com nome e ícone
    const overlay = document.createElement("div");
    overlay.className =
        "position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-75 text-white d-flex align-items-center";
    overlay.innerHTML = `${categoriaIcons[pro.categoria] || ""}<span class="ms-2">${
        pro.nome
    }</span>`;

    box.appendChild(number);
    box.appendChild(img);
    box.appendChild(overlay);
    top10Container.appendChild(box);
});

// Renderiza por categoria (15 por categoria)
function renderCategoria(categoriaId) {
    const container = document.getElementById(categoriaId);
    container.innerHTML = ""; // Limpa antes de renderizar
    const filtrados = profissionais.filter((p) => p.profissao === categoriaId).slice(0, 15);
    console.log(filtrados);
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

renderCategoria("Fotográfo");
renderCategoria("Designer");
renderCategoria("Programador");
renderCategoria("Garçom");

// Função para filtrar categorias
function filtrarCategoria(cat, btn) {
    // Troca botão ativo
    document.querySelectorAll(".category-filter .btn").forEach((b) => b.classList.remove("active"));
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
document.addEventListener("DOMContentLoaded", function () {
    filtrarCategoria("todos", document.querySelector(".category-filter .btn"));
});

// eslint-disable-next-line no-unused-vars
function rolar(id, dir) {
    const el = document.getElementById(id);
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
}
