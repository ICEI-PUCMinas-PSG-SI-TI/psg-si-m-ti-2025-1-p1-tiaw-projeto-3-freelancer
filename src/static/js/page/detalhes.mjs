// @ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";
import { Servicos } from "../jsonf/servicos.mjs";
import { assertStringNonEmpty } from "../lib/validate.mjs";

const crud_usuarios = new Usuarios();
const crud_servicos = new Servicos();

async function inicializarDetalhes(id) {
    assertStringNonEmpty(id);

    const servico = await crud_servicos.lerServico(id);
    if (!servico) {
        alert("Serviço não encontrado!");
        return;
    }

    // Change background
    const htmlBackgroundImage = document.querySelector("div.body-section.body-content");
    if (htmlBackgroundImage instanceof HTMLDivElement)
        htmlBackgroundImage.style.backgroundImage = `url(https://picsum.photos/seed/${id}/1080)`;

    if (servico.imagem) document.getElementById("servico-img").src = servico.imagem;
    document.getElementById("servico-titulo").textContent = servico.titulo;
    document.getElementById("servico-categoria").textContent = "Categoria: " + servico.categoria;
    document.getElementById("servico-descricao").textContent = servico.descricao;
    try {
        const _userId = servico.usuarioId;
        const _user = await crud_usuarios.lerUsuario(_userId);
        if (_user) {
            // TODO: Adicionar link ao perfil
            document.getElementById("freelancer-nome").textContent = _user.nome;
            document.getElementById("freelancer-nome").href = `/perfil?id=${_userId}`;
        }
    } catch (err) {
        console.error(err.message);
    }
    if (servico.contato) document.getElementById("servico-contato").textContent = servico.contato;
    // document.getElementById("prazo-servico").textContent = servico.prazo;
    // document.getElementById("preco-servico").textContent = servico.preco;
    // document.getElementById("avaliacao-servico").textContent = servico.avaliacao;

    // Preenche avaliações
    const avaliacoesDiv = document.getElementById("avaliacoes-lista");
    if (!avaliacoesDiv) return;
    avaliacoesDiv.innerHTML = "";
    if (!servico.avaliacoes?.length) {
        avaliacoesDiv.innerHTML = "<p class='text-light'>Nenhuma avaliação ainda.</p>";
        return;
    }

    for (const _avaliacao of servico.avaliacoes) {
        avaliacoesDiv.innerHTML += `<div class="card mb-3 bg-dark-subtle detalhes-servico-avaliacao">
                <div class="card-body">
                <h6 class="card-title mb-1">${_avaliacao.nome} <span class="text-warning">${_avaliacao.estrelas}</span></h6>
                <p class="card-text mb-0">${_avaliacao.comentario}</p>
                </div>
            </div>`;
    }
}

function carregarDadosDaUrl() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (!id) {
        alert("Não há infomações para o serviço informado!");
        location.assign("/homepage");
        return;
    }
    inicializarDetalhes(id);
}

carregarDadosDaUrl();
