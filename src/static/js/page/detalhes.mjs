// @ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";
import { Servicos } from "../jsonf/servicos.mjs";
import { assertStringNonEmpty } from "../lib/validate.mjs";
import { Avaliacoes } from "../jsonf/avaliacoes.mjs";

// eslint-disable-next-line no-unused-vars
const crudUsuarios = new Usuarios();
const crudServicos = new Servicos();
const crudAvaliacoes = new Avaliacoes();

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

    const htmlServicoImagem = document.getElementById("servico-img");
    if (servico.imagem && htmlServicoImagem instanceof HTMLImageElement)
        htmlServicoImagem.src = servico.imagem;

    initializeIfNotNull("servico-img", servico.imagem);
    initializeIfNotNull("servico-titulo", servico.titulo);
    initializeIfNotNull("servico-categoria", servico.categoria);
    initializeIfNotNull("servico-descricao", servico.descricao);

    if (servico.usuario) {
        const { nome, id } = servico.usuario;
        const freelancerNome = document.getElementById("freelancer-nome");
        if (nome && id && freelancerNome instanceof HTMLAnchorElement) {
            // TODO: Adicionar link ao perfil
            freelancerNome.textContent = nome;
            freelancerNome.href = `/perfil?id=${id}`;
        }
    }

    initializeIfNotNull("servico-contato", servico.contato);
    initializeIfNotNull("servico-prazo", servico.prazo);
    initializeIfNotNull("servico-preco", servico.preco);

    // Preenche avaliações
    const avaliacoesDiv = document.getElementById("avaliacoes-lista");
    if (!avaliacoesDiv) return;
    avaliacoesDiv.innerHTML = "";

    let avaliacoes = await crudAvaliacoes.lerAvaliacoes();
    if (!avaliacoes) {
        avaliacoesDiv.innerHTML = "<p class='text-light'>Nenhuma avaliação ainda.</p>";
        return;
    }

    let total = 0;
    let quant = 0;
    avaliacoes = avaliacoes.filter((avaliacao) => avaliacao.servicoId === id);
    if (!avaliacoes.length) {
        avaliacoesDiv.innerHTML = "<p class='text-light'>Nenhuma avaliação ainda.</p>";
        return;
    }

    avaliacoes.forEach((avaliacao) => {
        const { nota, usuario, comentario } = avaliacao;
        const nome = usuario?.nome || "usuário";

        total += nota || 0;
        quant++;

        avaliacoesDiv.innerHTML += `<div class="card mb-3 bg-dark-subtle detalhes-servico-avaliacao">
                <div class="card-body">
                <h6 class="card-title mb-1">${nome} <span class="text-warning">${estrelas(nota)}</span></h6>
                <p class="card-text mb-0">${comentario}</p>
                </div>
            </div>`;
    });

    // Media
    initializeIfNotNull("servico-avaliacao", estrelas(total / quant));
}

function estrelas(nota) {
    if (!nota) return "Nota não informada";
    nota = nota.toFixed(2).toString();
    return `${"⭐".repeat(nota)} (${nota}/5)`;
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
