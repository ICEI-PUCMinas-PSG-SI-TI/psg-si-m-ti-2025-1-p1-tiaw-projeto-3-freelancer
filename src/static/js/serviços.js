import * as JSONQL from "./jsonql.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-servico");
  const lista = document.getElementById("lista-servicos");
  let editIndex = null;

  const render = () => {
    lista.innerHTML = "";

    JSONQL.readServicos()?.forEach((servico, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap";

      // TODO: categoria -> categoriaId
      li.innerHTML = `
          <div class="d-flex flex-column">
            <p class="mb-1">${servico.id}</p>
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
    let servico = JSONQL.readServicos(index)[0];
    document.getElementById("titulo").value = servico.titulo;
    document.getElementById("contato").value = servico.contato;
    document.getElementById("categoriaId").value = servico.categoriaId;
    document.getElementById("descricao").value = servico.descricao;
    editIndex = index;
  };

  window.deletarServico = (index) => {
    JSONQL.deleteServicos(index);
    render();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const contato = document.getElementById("contato").value.trim();
    const categoriaId = document.getElementById("categoriaId").selectedIndex;
    const descricao = document.getElementById("descricao").value.trim();

    let novo_servico = JSONQL.factoryServicos(titulo, categoriaId, descricao, contato);

    if (editIndex !== null) {
      JSONQL.updateServicos(novo_servico);
      editIndex = null;
    } else {
      JSONQL.createServicos(novo_servico);
    }

    form.reset();
    render();
  });

  render();
});