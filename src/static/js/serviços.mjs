// @ts-check

import { Servicos } from "./jsonf/servicos.mjs";
import { retornarIdSeLogado } from "./lib/credenciais.mjs";
import { imageFileToBase64 } from "./lib/tools.mjs";

const crud_servicos = new Servicos();

class EditContext {
    constructor(id, foto) {
        this.id = id;
        this.foto = foto;
    }
}

/** @type {EditContext|null} */
let editContext = null;

function previewPicture() {
    const html_input_picture = document.getElementById("imagem");
    const html_img_preview = document.getElementById("image_preview");
    const html_svg_placeholder = document.getElementById("image_placeholder");

    if (
        !(html_input_picture instanceof HTMLInputElement) ||
        !(html_img_preview instanceof HTMLImageElement) ||
        !(html_svg_placeholder instanceof SVGElement)
    ) {
        console.log("Null check");
        return;
    }

    if (!html_input_picture.files?.length) return;

    imageFileToBase64(html_input_picture.files[0])
        .then((/** @type {string} */ result) => {
            if (result.startsWith("data:image/")) {
                html_img_preview.src = result;
                html_img_preview.classList.remove("d-none");
                html_svg_placeholder.classList.add("d-none");
            } else {
                alert("Arquivo inválido!");
                html_img_preview.src = "";
                html_img_preview.classList.add("d-none");
                html_svg_placeholder.classList.remove("d-none");
            }
        })
        .catch((error) => {
            html_img_preview.src = "";
            html_img_preview.classList.add("d-none");
            html_svg_placeholder.classList.remove("d-none");

            alert(error);
            // Limpa arquivos
            setTimeout(() => (html_input_picture.value = ""), 1);
        });
}

function setupServicos() {
    const html_imagem = document.getElementById("imagem");
    if (!(html_imagem instanceof HTMLInputElement)) return;
    html_imagem.addEventListener("change", previewPicture);
}

function _editarServico(servico_id) {
    if (!servico_id) return;
    crud_servicos.lerServico(servico_id).then((_servico) => {
        if (!_servico) return;

        // TODO: Re-add image to preview
        const html_svg_placeholder = document.getElementById("image_placeholder");
        const html_image_preview = document.getElementById("image_preview");
        const html_titulo = document.getElementById("titulo");
        const html_contato = document.getElementById("contato");
        const html_categoria = document.getElementById("categoriaId");
        const html_descricao = document.getElementById("descricao");

        if (
            !(html_image_preview instanceof HTMLImageElement) ||
            !(html_svg_placeholder instanceof SVGElement) ||
            !(html_titulo instanceof HTMLInputElement) ||
            !(html_contato instanceof HTMLInputElement) ||
            !(html_categoria instanceof HTMLSelectElement) ||
            !(html_descricao instanceof HTMLTextAreaElement)
        ) {
            console.log("null check");
            return;
        }

        html_titulo.value = _servico.titulo;
        html_contato.value = _servico.contato;
        html_categoria.value = _servico.categoriaId.toString();
        html_descricao.value = _servico.descricao;
        if (_servico.imagem) {
            html_svg_placeholder.classList.add("d-none");
            html_image_preview.classList.remove("d-none");
            html_image_preview.src = _servico.imagem;
        }
        editContext = new EditContext(_servico.id, _servico.imagem);
        document.querySelector(".body-content")?.scrollIntoView();
    });
}

function render() {
    /** @type {HTMLFormElement} */
    // @ts-ignore Casting HTMLElement as HTMLFormElement
    const html_form = document.getElementById("form-servico");
    const html_ul_lista = document.getElementById("lista-servicos");

    if (!html_form || !html_ul_lista) return;

    html_ul_lista.innerHTML = "";
    crud_servicos.lerServicos().then((res) => {
        if (!res?.length) return;

        const logged_id = retornarIdSeLogado();
        if (!logged_id) return;
        for (const servico of res) {
            if (servico.usuarioId !== logged_id) continue;
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

            const html_edit = li.getElementsByTagName("button")[0];
            const html_delete = li.getElementsByTagName("button")[1];

            if (
                !(html_edit instanceof HTMLButtonElement) ||
                !(html_delete instanceof HTMLButtonElement)
            ) {
                console.log("null check");
                return;
            }

            html_edit.addEventListener("click", () => _editarServico(servico.id));

            html_delete.addEventListener("click", async () => {
                if (!servico.id) return;
                // TODO: avoid deleting if editing
                if (servico.id === editContext?.id) return;
                await crud_servicos.excluirServico(servico.id);
                render();
            });

            html_ul_lista.appendChild(li);
        }
    });
}

function iniciarlizarPaginaServicos() {
    setupServicos();

    /** @type {HTMLFormElement} */
    // @ts-ignore Casting HTMLElement as HTMLFormElement
    const html_form = document.getElementById("form-servico");
    const html_ul_lista = document.getElementById("lista-servicos");

    if (!html_form || !html_ul_lista) return;

    html_form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const usuarioId = retornarIdSeLogado();

        // TODO: declare 1 time
        const html_input_picture = document.getElementById("imagem");
        const html_titulo = document.getElementById("titulo");
        const html_contato = document.getElementById("contato");
        const html_categoriaId = document.getElementById("categoriaId");
        const html_descricao = document.getElementById("descricao");

        if (
            !(html_input_picture instanceof HTMLInputElement) ||
            !(html_titulo instanceof HTMLInputElement) ||
            !(html_contato instanceof HTMLInputElement) ||
            !(html_categoriaId instanceof HTMLSelectElement) ||
            !(html_descricao instanceof HTMLTextAreaElement)
        ) {
            console.log("null check");
            return;
        }

        if (!html_input_picture.files?.length && !editContext?.foto) {
            alert("Selecione uma imagem!");
            return;
        }
        let _bs64img;
        if (html_input_picture.files?.length && !editContext?.foto)
            _bs64img = await fileToBase64(html_input_picture.files[0]);
        else _bs64img = editContext?.foto;

        if (!_bs64img.startsWith("data:image/")) {
            alert("Ocorreu um erro ao validar as informações!");
            return;
        }

        const titulo = html_titulo.value.trim();
        const contato = html_contato.value.trim();
        const categoriaId = html_categoriaId.value;
        const descricao = html_descricao.value.trim();
        const categoria = html_categoriaId.selectedOptions[0].text;

        if (editContext !== null) {
            // ATUALIZAR
            await crud_servicos.atualizarServico({
                usuarioId,
                id: editContext.id,
                titulo,
                categoria,
                categoriaId,
                contato,
                descricao,
                imagem: _bs64img,
            });
            editContext = null;
        } else {
            // CADASTRAR
            await crud_servicos.criarServico({
                usuarioId,
                titulo,
                categoria,
                categoriaId,
                contato,
                descricao,
                imagem: _bs64img,
            });
        }

        html_form.reset();
        render();
    });

    render();
}

document.addEventListener("DOMContentLoaded", iniciarlizarPaginaServicos);
