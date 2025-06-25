// @ts-check

import { Servicos } from "./jsonf/servicos.mjs";
import { Templates } from "./jsonf/templates.mjs";

import { retornarIdSeLogado } from "./lib/credenciais.mjs";
import { imageFileToBase64 } from "./lib/tools.mjs";

const crudServicos = new Servicos();
const crudtemplates = new Templates();

class EditContext {
    constructor(id, foto, fake, prazo, preco) {
        this.id = id;
        this.foto = foto;
        this.fake = fake;
        this.prazo = prazo;
        this.preco = preco;
    }
}

/** @type {EditContext|null} */
let editContext = null;

async function previewPicture() {
    const htmlInputImagem = document.getElementById("imagem");
    const htmlImagePreview = document.getElementById("image_preview");
    const htmlSVGPlaceholder = document.getElementById("image_placeholder");

    if (
        !(htmlInputImagem instanceof HTMLInputElement) ||
        !(htmlImagePreview instanceof HTMLImageElement) ||
        !(htmlSVGPlaceholder instanceof SVGElement)
    ) {
        console.error("Some html elements are null!");
        return;
    }

    if (!htmlInputImagem.files?.length) return;

    try {
        const result = await imageFileToBase64(htmlInputImagem.files[0]);

        if (result.startsWith("data:image/")) {
            htmlImagePreview.src = result;
            htmlImagePreview.classList.remove("d-none");
            htmlSVGPlaceholder.classList.add("d-none");
        } else {
            alert("Arquivo inválido!");
            htmlImagePreview.src = "";
            htmlImagePreview.classList.add("d-none");
            htmlSVGPlaceholder.classList.remove("d-none");
        }
    } catch (error) {
        htmlImagePreview.src = "";
        htmlImagePreview.classList.add("d-none");
        htmlSVGPlaceholder.classList.remove("d-none");

        alert(error);
        // Limpa arquivos
        setTimeout(() => (htmlInputImagem.value = ""), 1);
    }
}

function setupServicos() {
    const htmlInputImagem = document.getElementById("imagem");
    if (!(htmlInputImagem instanceof HTMLInputElement)) return;
    htmlInputImagem.addEventListener("change", previewPicture);
}

function _editarServico(servicoId) {
    if (!servicoId) return;
    crudServicos.lerServico(servicoId).then((servico) => {
        if (!servico) return;

        // TODO: Re-add image to preview
        const htmlSVGPlaceholder = document.getElementById("image_placeholder");
        const htmlImagePreview = document.getElementById("image_preview");
        const htmlInputTitulo = document.getElementById("titulo");
        const htmlInputContato = document.getElementById("contato");
        const htmlSelectCategoria = document.getElementById("categoriaId");
        const htmlTextAreaDescricao = document.getElementById("descricao");
        const htmlInputPrazo = document.getElementById("prazo");
        const htmlInputPreco = document.getElementById("preco");

        if (
            !(htmlImagePreview instanceof HTMLImageElement) ||
            !(htmlSVGPlaceholder instanceof SVGElement) ||
            !(htmlInputTitulo instanceof HTMLInputElement) ||
            !(htmlInputContato instanceof HTMLInputElement) ||
            !(htmlSelectCategoria instanceof HTMLSelectElement) ||
            !(htmlTextAreaDescricao instanceof HTMLTextAreaElement) ||
            !(htmlInputPrazo instanceof HTMLInputElement) ||
            !(htmlInputPreco instanceof HTMLInputElement)
        ) {
            console.error("Some html elements are null!");
            return;
        }

        htmlInputTitulo.value = servico.titulo || "Serviço";
        htmlInputContato.value = servico.contato || "Contato não informado";
        htmlSelectCategoria.value = String(servico.categoriaId);
        htmlTextAreaDescricao.value = servico.descricao || "Nenhuma descrição informada";
        htmlInputPrazo.value = servico.prazo || "Prazo não informado";
        htmlInputPreco.value = String(servico.preco);
        if (servico.imagem) {
            htmlSVGPlaceholder.classList.add("d-none");
            htmlImagePreview.classList.remove("d-none");
            htmlImagePreview.src = servico.imagem;
        }
        editContext = new EditContext(servico.id, servico.imagem, servico.fake);
        document.querySelector(".body-content")?.scrollIntoView();
    });
}

function render() {
    const htmlFormCadastroServico = document.getElementById("form-servico");
    const htmlUlListaServicos = document.getElementById("lista-servicos");

    if (!htmlFormCadastroServico || !htmlUlListaServicos) return;

    htmlUlListaServicos.innerHTML = "";
    crudServicos.lerServicos().then((res) => {
        if (!res?.length) return;

        const usuarioCorrenteId = retornarIdSeLogado();
        if (!usuarioCorrenteId) return;

        // TODO: Filtrar via fetch
        const servicosFiltrados = res.filter((v) => v.usuarioId === usuarioCorrenteId);
        servicosFiltrados.forEach((servico) => {
            const li = document.createElement("li");
            li.className =
                "list-group-item d-flex justify-content-between align-items-center flex-wrap";

            li.innerHTML = `<div class="d-flex me-3">
                    <img width="64px" heigth="64px" src="${
                        servico.imagem || "static/icons/images.svg"
                    }" />
                </div>
                <div class="d-flex flex-column flex-grow-1 me-3">
                    <strong>${servico.titulo}</strong>
                    <small>${servico.categoria}</small>
                    <p class="mb-1">${servico.descricao}</p>
                    <small>Contato: ${servico.contato}</small>
                </div>
                <div class="d-flex gap-2 ms-auto">
                    <button class="btn btn-sm btn-warning">Editar</button>
                    <button class="btn btn-sm btn-danger">Excluir</button>
                </div>`;

            const htmlButtonEdit = li.getElementsByTagName("button")[0];
            const htmlButtonDelete = li.getElementsByTagName("button")[1];

            if (
                !(htmlButtonEdit instanceof HTMLButtonElement) ||
                !(htmlButtonDelete instanceof HTMLButtonElement)
            ) {
                console.error("Some html elements are null!");
                return;
            }

            htmlButtonEdit.addEventListener("click", () => _editarServico(servico.id));

            htmlButtonDelete.addEventListener("click", async () => {
                if (!servico.id) return;
                // TODO: avoid deleting if editing
                if (servico.id === editContext?.id) return;
                await crudServicos.excluirServico(String(servico.id));
                render();
            });

            htmlUlListaServicos.appendChild(li);
        });
    });
}

async function iniciarlizarPaginaServicos() {
    setupServicos();

    const htmlFormCadastroServico = document.getElementById("form-servico");
    const htmlUlListaServicos = document.getElementById("lista-servicos");

    if (!(htmlFormCadastroServico instanceof HTMLFormElement) || !htmlUlListaServicos) return;

    const htmlSelectCategoria = document.getElementById("categoriaId");
    if (htmlSelectCategoria instanceof HTMLSelectElement) {
        const templates = await crudtemplates.lerTemplates();
        if (templates) {
            const frag = document.createDocumentFragment();
            templates.categoriasServicos.forEach((categoria) => {
                const opt = document.createElement("option");
                opt.value = categoria;
                opt.innerText = categoria;
                frag.appendChild(opt);
            });
            htmlSelectCategoria.appendChild(frag);
        }
    }

    htmlFormCadastroServico.addEventListener("submit", async (event) => {
        event.preventDefault();

        const usuarioId = retornarIdSeLogado();

        // TODO: declare 1 time
        const htmlInputImagem = document.getElementById("imagem");
        const htmlInputTitulo = document.getElementById("titulo");
        const htmlInputContato = document.getElementById("contato");
        const htmlTextAreaDescricao = document.getElementById("descricao");
        const htmlInputPrazo = document.getElementById("prazo");
        const htmlInputPreco = document.getElementById("preco");

        if (
            !(htmlInputImagem instanceof HTMLInputElement) ||
            !(htmlInputTitulo instanceof HTMLInputElement) ||
            !(htmlInputContato instanceof HTMLInputElement) ||
            !(htmlSelectCategoria instanceof HTMLSelectElement) ||
            !(htmlTextAreaDescricao instanceof HTMLTextAreaElement) ||
            !(htmlInputPrazo instanceof HTMLInputElement) ||
            !(htmlInputPreco instanceof HTMLInputElement)
        ) {
            console.error("Some html elements are null!");
            return;
        }

        if (!htmlInputImagem.files?.length && !editContext?.foto) {
            alert("Selecione uma imagem!");
            return;
        }
        let _bs64img;
        if (htmlInputImagem.files?.length)
            _bs64img = await imageFileToBase64(htmlInputImagem.files[0]);
        else _bs64img = editContext?.foto;

        if (!_bs64img.startsWith("data:image/")) {
            alert("Ocorreu um erro ao validar as informações!");
            return;
        }

        const titulo = htmlInputTitulo.value.trim();
        const contato = htmlInputContato.value.trim();
        const categoriaId = htmlSelectCategoria.value;
        const descricao = htmlTextAreaDescricao.value.trim();
        const categoria = htmlSelectCategoria.selectedOptions[0].text;
        const prazo = htmlInputPrazo.value.trim();
        const preco = parseFloat(htmlInputPreco.value.trim());

        if (editContext !== null) {
            // ATUALIZAR
            await crudServicos.atualizarServico({
                usuarioId,
                id: editContext.id,
                titulo,
                categoria,
                categoriaId,
                contato,
                descricao,
                imagem: _bs64img,
                ativo: true,
                fake: editContext.fake,
                prazo,
                preco,
            });
            editContext = null;
        } else {
            // CADASTRAR
            await crudServicos.criarServico({
                usuarioId,
                titulo,
                categoria,
                categoriaId,
                contato,
                descricao,
                imagem: _bs64img,
                ativo: true,
                fake: false,
                prazo,
                preco,
            });
        }

        htmlFormCadastroServico.reset();
        render();
    });

    render();
}

document.addEventListener("DOMContentLoaded", iniciarlizarPaginaServicos);
