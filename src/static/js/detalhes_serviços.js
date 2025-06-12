document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-servico");
  const lista = document.getElementById("lista-servicos");
  let editIndex = null;

  const getServicos = () =>
    JSON.parse(localStorage.getItem("servicos") || "[]");
  const salvarServicos = (servicos) =>
    localStorage.setItem("servicos", JSON.stringify(servicos));

  const render = () => {
    lista.innerHTML = "";
    getServicos().forEach((servico, index) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center flex-wrap";

      li.innerHTML = `
          <div class="d-flex flex-column">
            <strong>${servico.titulo}</strong>
            <small>${servico.categoria}</small>
            <p class="mb-1">${servico.descricao}</p>
            <small>Contato: ${servico.contato}</small>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning" onclick="editarServico(${index})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deletarServico(${index})">Excluir</button>
          </div>
        `;

      lista.appendChild(li);
    });
  };

  window.editarServico = (index) => {
    const servico = getServicos()[index];
    document.getElementById("titulo").value = servico.titulo;
    document.getElementById("contato").value = servico.contato;
    document.getElementById("categoriaId").value = servico.categoriaId;
    document.getElementById("descricao").value = servico.descricao;
    editIndex = index;
  };

  window.deletarServico = (index) => {
    const servicos = getServicos();
    servicos.splice(index, 1);
    salvarServicos(servicos);
    render();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const contato = document.getElementById("contato").value.trim();
    const categoriaId = document.getElementById("categoriaId").value;
    const descricao = document.getElementById("descricao").value.trim();
    const categoria =
      document.getElementById("categoriaId").selectedOptions[0].text;

    const novoServico = {
      titulo,
      contato,
      categoriaId,
      categoria,
      descricao,
    };

    const servicos = getServicos();

    if (editIndex !== null) {
      servicos[editIndex] = novoServico;
      editIndex = null;
    } else {
      servicos.push(novoServico);
    }

    salvarServicos(servicos);
    form.reset();
    render();
  });

  render();
});
document.addEventListener("DOMContentLoaded", async () => {
  // Supondo que o id do serviço venha por query string, ex: detalhes_serviços.html?id=1
  const urlParams = new URLSearchParams(window.location.search);
  const servicoId = urlParams.get("id") || "1";

  // Busca os dados do serviço no server.json
  const response = await fetch("../server.json");
  const data = await response.json();
  const servico = data.servicos.find((s) => String(s.id) === String(servicoId));

  if (servico) {
    document.getElementById("servico-img").src =
      servico.imagem || "static/img/servico_exemplo.jpg";
    document.getElementById("servico-titulo").textContent = servico.titulo;
    document.getElementById("servico-categoria").textContent =
      "Categoria: " + servico.categoria;
    document.getElementById("servico-descricao").textContent =
      servico.descricao;
    document.getElementById("freelancer-nome").textContent = servico.freelancer;
    document.getElementById("prazo-servico").textContent = servico.prazo;
    document.getElementById("preco-servico").textContent = servico.preco;
    document.getElementById("avaliacao-servico").textContent =
      servico.avaliacao;

    // Preenche avaliações
    const avaliacoesDiv = document.getElementById("avaliacoes-lista");
    avaliacoesDiv.innerHTML = "";
    if (servico.avaliacoes && servico.avaliacoes.length > 0) {
      servico.avaliacoes.forEach((av) => {
        avaliacoesDiv.innerHTML += `
          <div class="card mb-3 bg-dark-subtle detalhes-servico-avaliacao">
            <div class="card-body">
              <h6 class="card-title mb-1">${av.nome} <span class="text-warning">${av.estrelas}</span></h6>
              <p class="card-text mb-0">${av.comentario}</p>
            </div>
          </div>
        `;
      });
    } else {
      avaliacoesDiv.innerHTML =
        "<p class='text-light'>Nenhuma avaliação ainda.</p>";
    }
  }
});
