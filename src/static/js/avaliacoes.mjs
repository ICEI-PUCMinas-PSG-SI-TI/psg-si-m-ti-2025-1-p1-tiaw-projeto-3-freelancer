// @ts-check

import { Avaliacoes } from "./jsonf/avaliacoes.mjs";
import { retornarIdSeLogado } from "./lib/credenciais.mjs";
import { imageFileToBase64 } from "./lib/tools.mjs"

const crud_avaliacoes = new Avaliacoes();

const htmlButtonCancelar = document.getElementById("btn-cancelar");
const htmlButtonPublicar = document.getElementById("btn-publicar");

// Script para interação das estrelas
const stars = document.querySelectorAll(".stars span");
let selectedRating = 0;

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
    document.getElementById("comentario").value = "";
    document.getElementById("imagem").value = "";
}

async function publicar() {
    const comentario = document.getElementById("comentario").value.trim();
    const imagemInput = document.getElementById("imagem");
    if (selectedRating === 0) {
        alert("Por favor, selecione uma avaliação por estrelas.");
        return;
    }
    if (comentario.length < 5) {
        alert("Por favor, escreva um comentário mais detalhado.");
        return;
    }

    const imagemBase64 = await imageFileToBase64(imagemInput.files[0]);

    try {
        await crud_avaliacoes.criarAvaliacao({
            usuarioId: retornarIdSeLogado(),
            nota: selectedRating,
            comentario,
            imagem: imagemBase64,
            data: new Date().toISOString(),
            // TODO: contratoId
        });

        alert("Avaliação enviada com sucesso!");
        limparFormulario();
    } catch (error) {
        alert("Erro ao enviar avaliação: " + error.message);
    }
}

(() => {
    // Inicializa as estrelas
    updateStars();

    if (
        htmlButtonCancelar instanceof HTMLButtonElement &&
        htmlButtonPublicar instanceof HTMLButtonElement
    ) {
        htmlButtonCancelar.addEventListener("click", limparFormulario);
        htmlButtonPublicar.addEventListener("click", publicar);
    }
})();
