// @ts-check

import { Contratos } from "../jsonf/contratos.mjs";
import { retornarIdSeLogado } from "../lib/credenciais.mjs";

const crudContratos = new Contratos();

const listaSolicitacoes = document.getElementById("lista-solicitacoes");

function createCard(
    contratoId,
    servicoId,
    servicoImagem,
    servicoTitulo,
    servicoDescricao,
    contratoStatus,
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
            <small>Data da solicitação: ${contratoData}</small>
        </div>
        <div class="d-flex gap-2 ms-auto">
            <button class="btn btn-sm btn-danger">Cancelar Solicitação</button>
        </div>`;
    return card;
}

(async () => {
    const userId = retornarIdSeLogado();
    let contratos = await crudContratos.lerContratos();
    if (!contratos) {
        // TODO: Colocar no HTML
        alert("Nenhum contrato solicitado!");
        return;
    }
    contratos = contratos.filter((contrato) => contrato.usuarioId === userId);

    if (listaSolicitacoes && contratos.length) {
        const frag = document.createDocumentFragment();
        contratos.reverse()
        contratos.forEach((contrato) => {
            const { servico } = contrato;
            let data = "";
            if (contrato.data) {
                data = new Date(contrato.data).toLocaleString("pt-BR");
            }
            frag.appendChild(
                createCard(
                    contrato.id,
                    servico?.id,
                    servico?.imagem,
                    servico?.titulo || "Serviço",
                    servico?.descricao || "Descrição não informada",
                    contrato.status,
                    data,
                ),
            );
        });
        listaSolicitacoes.appendChild(frag);
    }
})();
