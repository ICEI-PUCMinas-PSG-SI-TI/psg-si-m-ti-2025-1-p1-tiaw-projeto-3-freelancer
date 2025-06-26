// @ts-check

import { Avaliacoes } from "./jsonf/avaliacoes.mjs";
import { Contratos } from "./jsonf/contratos.mjs";

import { retornarIdSeLogado } from "./lib/credenciais.mjs";
import { imageFileToBase64 } from "./lib/tools.mjs";

const crudAvaliacoes = new Avaliacoes();
const crudContratos = new Contratos();

const htmlButtonCancelar = document.getElementById("btn-cancelar");
const htmlButtonPublicar = document.getElementById("btn-publicar");
const htmlComentario = document.getElementById("comentario");

// Script para interação das estrelas
const stars = document.querySelectorAll(".stars span");
let selectedRating = 0;
let avaliacaoId = null;
let stateContratoId = null;

stars.forEach((star, index) => {
    star.addEventListener("click", () => {
        selectedRating = index + 1;
        updateStars();
    });
    star.addEventListener("mouseenter", () => {
        highlightStars(index + 1);
    });
    star.addEventListener("mouseleave", () => {
        updateStars();
    });
});

function highlightStars(rating) {
    stars.forEach((star, i) => {
        star.classList.toggle("hover", i < rating);
    });
}

function updateStars() {
    stars.forEach((star, i) => {
        if (i < selectedRating) {
            star.classList.add("selected");
            star.setAttribute("aria-checked", "true");
            star.setAttribute("tabindex", "0");
        } else {
            star.classList.remove("selected");
            star.setAttribute("aria-checked", "false");
            star.setAttribute("tabindex", "-1");
        }
    });
}

function limparFormulario() {
    selectedRating = 0;
    updateStars();
    const htmlComentario = document.getElementById("comentario");
    const htmlImagem = document.getElementById("imagem");
    if (htmlComentario instanceof HTMLTextAreaElement) htmlComentario.value = "";
    if (htmlImagem instanceof HTMLInputElement) htmlImagem.value = "";
}

async function publicar() {
    if (!(htmlComentario instanceof HTMLTextAreaElement)) return;
    const comentario = htmlComentario.value.trim();
    const imagemInput = document.getElementById("imagem");
    if (!(imagemInput instanceof HTMLInputElement)) return;
    if (selectedRating === 0) {
        alert("Por favor, selecione uma avaliação por estrelas.");
        return;
    }
    if (comentario.length < 5) {
        alert("Por favor, escreva um comentário mais detalhado.");
        return;
    }

    try {
        const avaliacao = {
            usuarioId: retornarIdSeLogado(),
            nota: selectedRating,
            comentario,
            data: new Date().toISOString(),
            contratoId: stateContratoId,
        };

        if(avaliacaoId) avaliacao.id = avaliacaoId

        if (imagemInput.files?.length)
            avaliacao.imagem = await imageFileToBase64(imagemInput.files[0]);

        await crudAvaliacoes.criarAvaliacao(avaliacao);

        alert("Avaliação enviada com sucesso!");
        limparFormulario();
    } catch (error) {
        alert("Erro ao enviar avaliação: " + error.message);
    }
}

(async () => {
    // Inicializa as estrelas
    updateStars();

    let usuarioLogadoId = retornarIdSeLogado();
    let params = new URLSearchParams(location.search);
    let contratoId = params.get("contrato");
    if (!contratoId) errQuit("Ocorreu um erro ao ler o contrato!");

    let contrato;
    try {
        contrato = await crudContratos.lerContrato(contratoId);
    } catch (err) {
        errQuit(err.message);
    }
    if (!contrato) errQuit("Ocorreu um erro ao ler o contrato!");
    stateContratoId = contratoId;
    document.getElementById("form-title").innerText = `Avaliação do serviço de ${contrato?.servico?.titulo}`;
    document.getElementById("form-image").src = contrato?.servico?.imagem;

    let avaliacoes = await crudAvaliacoes.lerAvaliacoes();
    avaliacoes = avaliacoes.filter(
        (avaliacao) =>
            avaliacao.contratoId === contrato.id && usuarioLogadoId === contrato.usuarioId,
    );
    if (avaliacoes.length) {
        const avaliacao = avaliacoes[0];
        if (htmlComentario instanceof HTMLTextAreaElement)
            htmlComentario.value = avaliacao.comentario || "";
        selectedRating = avaliacao.nota || 0;
        avaliacaoId = avaliacao.id
    }

    if (htmlButtonCancelar instanceof HTMLButtonElement)
        htmlButtonCancelar.addEventListener("click", limparFormulario);

    if (htmlButtonPublicar instanceof HTMLButtonElement)
        htmlButtonPublicar.addEventListener("click", publicar);
})();

function errQuit(message) {
    alert(message);
    location.assign("/");
}
