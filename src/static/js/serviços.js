document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-servico");
    const lista = document.getElementById("lista-servicos");
    let editIndex = null;
  
    const getServicos = () => JSON.parse(localStorage.getItem("servicos") || "[]");
    const salvarServicos = (servicos) => localStorage.setItem("servicos", JSON.stringify(servicos));
  
    const render = () => {
      lista.innerHTML = "";
      getServicos().forEach((servico, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap";
  
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
      const categoria = document.getElementById("categoriaId").selectedOptions[0].text;
  
      const novoServico = { titulo, contato, categoriaId, categoria, descricao };
  
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
  