// Dados fictícios de profissionais 
const profissionais = [
  // Garçons
  { nome: "João", imagem: "static/img/pro1.jpg", categoria: "garcons" },
  { nome: "Carlos", imagem: "static/img/pro5.jpg", categoria: "garcons" },
  { nome: "Fernando", imagem: "static/img/pro9.jpg", categoria: "garcons" },
  { nome: "Paulo", imagem: "static/img/pro11.jpg", categoria: "garcons" },
  { nome: "Rafael", imagem: "static/img/pro12.jpg", categoria: "garcons" },
  { nome: "Eduardo", imagem: "static/img/pro13.jpg", categoria: "garcons" },
  { nome: "Roberto", imagem: "static/img/pro14.jpg", categoria: "garcons" },
  { nome: "Sérgio", imagem: "static/img/pro15.jpg", categoria: "garcons" },
  { nome: "Bruno", imagem: "static/img/pro16.jpg", categoria: "garcons" },
  { nome: "André", imagem: "static/img/pro17.jpg", categoria: "garcons" },
  { nome: "Ricardo", imagem: "static/img/pro18.jpg", categoria: "garcons" },
  { nome: "Leandro", imagem: "static/img/pro19.jpg", categoria: "garcons" },
  { nome: "Marcos", imagem: "static/img/pro20.jpg", categoria: "garcons" },
  { nome: "Fábio", imagem: "static/img/pro21.jpg", categoria: "garcons" },
  { nome: "Gustavo", imagem: "static/img/pro22.jpg", categoria: "garcons" },

  // Fotógrafos
  { nome: "Maria", imagem: "static/img/pro2.jpg", categoria: "fotografos" },
  { nome: "Juliana", imagem: "static/img/pro6.jpg", categoria: "fotografos" },
  { nome: "Camila", imagem: "static/img/pro10.jpg", categoria: "fotografos" },
  { nome: "Patrícia", imagem: "static/img/pro23.jpg", categoria: "fotografos" },
  { nome: "Renata", imagem: "static/img/pro24.jpg", categoria: "fotografos" },
  { nome: "Tatiane", imagem: "static/img/pro25.jpg", categoria: "fotografos" },
  { nome: "Aline", imagem: "static/img/pro26.jpg", categoria: "fotografos" },
  { nome: "Beatriz", imagem: "static/img/pro27.jpg", categoria: "fotografos" },
  { nome: "Fernanda", imagem: "static/img/pro28.jpg", categoria: "fotografos" },
  { nome: "Letícia", imagem: "static/img/pro29.jpg", categoria: "fotografos" },
  { nome: "Priscila", imagem: "static/img/pro30.jpg", categoria: "fotografos" },
  { nome: "Sabrina", imagem: "static/img/pro31.jpg", categoria: "fotografos" },
  { nome: "Viviane", imagem: "static/img/pro32.jpg", categoria: "fotografos" },
  { nome: "Débora", imagem: "static/img/pro33.jpg", categoria: "fotografos" },
  { nome: "Simone", imagem: "static/img/pro34.jpg", categoria: "fotografos" },

  // Programadores
  { nome: "Lucas", imagem: "static/img/pro3.jpg", categoria: "programadores" },
  { nome: "Bruno", imagem: "static/img/pro7.jpg", categoria: "programadores" },
  { nome: "Thiago", imagem: "static/img/pro35.jpg", categoria: "programadores" },
  { nome: "Gabriel", imagem: "static/img/pro36.jpg", categoria: "programadores" },
  { nome: "Felipe", imagem: "static/img/pro37.jpg", categoria: "programadores" },
  { nome: "Vinícius", imagem: "static/img/pro38.jpg", categoria: "programadores" },
  { nome: "Matheus", imagem: "static/img/pro39.jpg", categoria: "programadores" },
  { nome: "Pedro", imagem: "static/img/pro40.jpg", categoria: "programadores" },
  { nome: "Henrique", imagem: "static/img/pro41.jpg", categoria: "programadores" },
  { nome: "Caio", imagem: "static/img/pro42.jpg", categoria: "programadores" },
  { nome: "Igor", imagem: "static/img/pro43.jpg", categoria: "programadores" },
  { nome: "Ruan", imagem: "static/img/pro44.jpg", categoria: "programadores" },
  { nome: "Samuel", imagem: "static/img/pro45.jpg", categoria: "programadores" },
  { nome: "Otávio", imagem: "static/img/pro46.jpg", categoria: "programadores" },
  { nome: "Diego", imagem: "static/img/pro47.jpg", categoria: "programadores" },

  // Designers
  { nome: "Ana", imagem: "static/img/pro4.jpg", categoria: "designers" },
  { nome: "Larissa", imagem: "static/img/pro8.jpg", categoria: "designers" },
  { nome: "Juliana Costa", imagem: "static/img/pro48.jpg", categoria: "designers" },
  { nome: "Amanda", imagem: "static/img/pro49.jpg", categoria: "designers" },
  { nome: "Carolina", imagem: "static/img/pro50.jpg", categoria: "designers" },
  { nome: "Daniele", imagem: "static/img/pro51.jpg", categoria: "designers" },
  { nome: "Elisa", imagem: "static/img/pro52.jpg", categoria: "designers" },
  { nome: "Flávia", imagem: "static/img/pro53.jpg", categoria: "designers" },
  { nome: "Helena", imagem: "static/img/pro54.jpg", categoria: "designers" },
  { nome: "Isabela", imagem: "static/img/pro55.jpg", categoria: "designers" },
  { nome: "Jéssica", imagem: "static/img/pro56.jpg", categoria: "designers" },
  { nome: "Karla", imagem: "static/img/pro57.jpg", categoria: "designers" },
  { nome: "Luana", imagem: "static/img/pro58.jpg", categoria: "designers" },
  { nome: "Marina", imagem: "static/img/pro59.jpg", categoria: "designers" },
  { nome: "Natália", imagem: "static/img/pro60.jpg", categoria: "designers" },
];

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
  box.classList.add("card-box", "shadow", "rounded", "bg-light", "position-relative", "overflow-hidden");
  box.style.cursor = "pointer";
  box.onclick = () => window.location.href = "perfil.html?nome=" + encodeURIComponent(pro.nome);

  const number = document.createElement("span");
  number.classList.add("number");
  number.textContent = index + 1;

  const img = document.createElement("img");
  img.src = pro.imagem;
  img.alt = pro.nome;

  // Overlay com nome e ícone
  const overlay = document.createElement("div");
  overlay.className = "position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-75 text-white d-flex align-items-center";
  overlay.innerHTML = `${categoriaIcons[pro.categoria] || ""}<span class="ms-2">${pro.nome}</span>`;

  box.appendChild(number);
  box.appendChild(img);
  box.appendChild(overlay);
  top10Container.appendChild(box);
});

// Renderiza por categoria (15 por categoria)
function renderCategoria(categoriaId) {
  const container = document.getElementById(categoriaId);
  container.innerHTML = ""; // Limpa antes de renderizar
  const filtrados = profissionais.filter(p => p.categoria === categoriaId).slice(0, 15);
  filtrados.forEach(p => {
    const box = document.createElement("div");
    box.classList.add("card-box", "shadow", "rounded", "bg-light", "position-relative", "overflow-hidden");
    box.style.cursor = "pointer";
    box.onclick = () => window.location.href = "perfil.html?nome=" + encodeURIComponent(p.nome);

    const img = document.createElement("img");
    img.src = p.imagem;
    img.alt = p.nome;

    // Overlay com nome e ícone
    const overlay = document.createElement("div");
    overlay.className = "position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-75 text-white d-flex align-items-center";
    overlay.innerHTML = `${categoriaIcons[categoriaId] || ""}<span class="ms-2">${p.nome}</span>`;

    box.appendChild(img);
    box.appendChild(overlay);
    container.appendChild(box);
  });
}

renderCategoria("fotografos");
renderCategoria("designers");
renderCategoria("programadores");
renderCategoria("garcons");

// Função para filtrar categorias
function filtrarCategoria(cat, btn) {
  // Troca botão ativo
  document.querySelectorAll('.category-filter .btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Mostra ou esconde categorias
  document.querySelectorAll('.category').forEach(div => {
    if (cat === 'todos') {
      div.style.display = 'block';
    } else {
      div.style.display = div.id === 'cat-' + cat ? 'block' : 'none';
    }
  });
}

// Inicializa mostrando todos após o DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
  filtrarCategoria('todos', document.querySelector('.category-filter .btn'));
});

function rolar(id, dir) {
  const el = document.getElementById(id);
  el.scrollBy({ left: dir * 200, behavior: 'smooth' });
}

