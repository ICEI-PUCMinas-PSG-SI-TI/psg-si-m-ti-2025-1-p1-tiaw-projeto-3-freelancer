// @ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";
import { Servicos } from "../jsonf/servicos.mjs";
import { assertStringNonEmpty } from "../lib/validate.mjs";

const crudUsuarios = new Usuarios();
const crudServicos = new Servicos();

function initializeIfNotNull(elementId, textContent) {
    const element = document.getElementById(elementId);
    if (element instanceof HTMLElement && textContent) element.textContent = textContent;
}

async function inicializarDetalhes(id) {
    assertStringNonEmpty(id);

    const servico = await crudServicos.lerServico(id);
    if (!servico) {
        alert("Serviço não encontrado!");
        return;
    }

    // Change background
    const htmlBackgroundImage = document.querySelector("div.body-section.body-content");
    if (htmlBackgroundImage instanceof HTMLDivElement)
        htmlBackgroundImage.style.backgroundImage = `url(https://picsum.photos/seed/${id}/1080)`;

    const htmlServicoImagem = document.getElementById("servico-contato");
    if (servico.imagem && htmlServicoImagem instanceof HTMLImageElement)
        htmlServicoImagem.src = servico.imagem;

    initializeIfNotNull("servico-img", servico.imagem);
    initializeIfNotNull("servico-titulo", servico.titulo);
    initializeIfNotNull("servico-categoria", servico.categoria);
    initializeIfNotNull("servico-descricao", servico.descricao);

    try {
        const _userId = servico.usuarioId;
        const _user = await crudUsuarios.lerUsuario(_userId);
        if (_user) {
            // TODO: Adicionar link ao perfil
            const freelancerNome = document.getElementById("freelancer-nome");
            if (freelancerNome instanceof HTMLAnchorElement) {
                freelancerNome.textContent = _user.nome;
                freelancerNome.href = `/perfil?id=${_userId}`;
            }
        }
    } catch (err) {
        console.error(err.message);
    }

    initializeIfNotNull("servico-contato", servico.contato);
    initializeIfNotNull("servico-contato", servico.prazo);
    initializeIfNotNull("servico-contato", servico.preco);
    initializeIfNotNull("servico-contato", servico.avaliacao);

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
