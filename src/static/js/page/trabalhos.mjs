// @ts-check

import { Contratos } from "../jsonf/contratos.mjs";
import { Servicos } from "../jsonf/servicos.mjs";
import { retornarIdSeLogado } from "../lib/credenciais.mjs";

const crudContratos = new Contratos();
const crudServicos = new Servicos();

const listaSolicitacoes = document.getElementById("lista-solicitacoes");

function createCard(
    contrato,
    contratoId,
    servicoId,
    servicoImagem,
    servicoTitulo,
    servicoDescricao,
    contratoStatus,
    contratoStatusId,
    contratoData,
) {
    const card = document.createElement("li");
    card.classList.add("list-group-item", "d-flex", "center-xy", "flex-row", "flex-wrap");
    card.innerHTML = `<div class="d-flex me-3">
            <img width="64px" heigth="64px" src="${servicoImagem || "static/icons/images.svg"}" />
        </div>
        <div class="d-flex flex-column flex-grow-1 me-3">
            <a href="/detalhes?id=${servicoId}"><strong>${servicoTitulo}</strong></a>
            <small>${servicoDescricao}</small>
            <p class="mb-1"><span class="badge bg-primary">Status: ${contratoStatus}</span></p>
            <small>Data da solicitação: ${contratoData || "Data da solicitação não registrada"}</small>
        </div>
        <div class="d-flex gap-2 ms-auto">
            <select name="tipo" class="form-select">
              <option value="0">Aguardando pagamento</option>
              <option value="1">Pendente (Pagamento realizado)</option>
              <option value="2">Em andamento</option>
              <option value="3">Concluído</option>
            </select>
            <button class="btn btn-sm btn-primary">Alterar status</button>
        </div>`;
    const select = card.querySelector("select");
    const button = card.querySelector("button");
    if (button && select instanceof HTMLSelectElement) {
        let newContrato = contrato;
        button.addEventListener("click", async () => {
            newContrato.status = select.options[select.selectedIndex].text;
            newContrato.statusId = select.value;
            await crudContratos.atualizarContrato(newContrato);
            alert("Informações atualizadas")
            location.reload()
        });
    }
    return card; 
}

(async () => {
    const userId = retornarIdSeLogado();

    let servicos = await crudServicos.lerServicos();
    if (!servicos) {
        // TODO: Colocar no HTML
        alert("Nenhum serviço cadastrado!");
        return;
    }

    servicos = servicos.filter((servico) => servico.usuarioId === userId);
    const servicosIds = new Set();
    servicos.forEach((servico) => servicosIds.add(servico.id));
    let contratos = await crudContratos.lerContratos();
    if (!contratos) return;
    contratos = contratos.filter((contrato) => servicosIds.has(contrato.servicoId));

    if (listaSolicitacoes && contratos.length) {
        const frag = document.createDocumentFragment();
        contratos.reverse();
        contratos.forEach((contrato) => {
            const { servico } = contrato;
            let data = "";
            if (contrato.data) {
                data = new Date(contrato.data).toLocaleString("pt-BR");
            }
            frag.appendChild(
                createCard(
                    contrato,
                    contrato.id,
                    servico?.id,
                    servico?.imagem,
                    servico?.titulo || "Serviço",
                    servico?.descricao || "Descrição não informada",
                    contrato.status,
                    contrato.statusId,
                    data,
                ),
            );
        });
        listaSolicitacoes.appendChild(frag);
    }
})();
