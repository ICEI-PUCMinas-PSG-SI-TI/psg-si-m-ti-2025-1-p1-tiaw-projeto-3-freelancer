//@ts-check

import { CRUDServicos, Servico } from "./jsonql.service.mjs";

const crud_servicos = new CRUDServicos();

const maxAllowedSize = 5 * 1024 * 1024; // 5 MB in bytes

// TODO: Move to module
/**
 * @param {Blob} file
 */
async function fileToBase64(file) {
    const reader = new FileReader();

    if (file.size > maxAllowedSize) throw new Error("O tamanho do arquivo deve ser menor que 5MB!");

    if (!file.type.match("image.*")) throw new Error("O arquivo não é uma imagem!");

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function previewPicture() {
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_picture = document.getElementById("imagem");
    /** @type {HTMLImageElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_img_preview = document.getElementById("image_preview");
    /** @type {SVGElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_svg_placeholder = document.getElementById("image_placeholder");

    if (!html_input_picture.files || !html_input_picture.files.length) return;

    fileToBase64(html_input_picture.files[0])
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

document.addEventListener("DOMContentLoaded", () => {
    /** @type {HTMLFormElement} */
    // @ts-ignore Casting HTMLElement as HTMLFormElement
    const html_form = document.getElementById("form-servico");
    const html_ul_lista = document.getElementById("lista-servicos");

    if (!html_form || !html_ul_lista) return;

    let editIdIndex = null;

    const render = () => {
        html_ul_lista.innerHTML = "";
        crud_servicos.lerServicos().then((res) => {
            if (!res || !res.length) return;

            res.forEach((/** @type {Servico} */ servico) => {
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

                html_edit.addEventListener("click", () => {
                    if (!servico.id) return;
                    console.log(servico.id);
                    crud_servicos.lerServico(servico.id).then((_servico) => {
                        if (!_servico) return;
                        console.log(_servico);

                        // TODO: Re-add image to preview
                        // const html_imagem = document.getElementById("imagem");
                        const html_titulo = document.getElementById("titulo");
                        const html_contato = document.getElementById("contato");
                        const html_categoria = document.getElementById("categoriaId");
                        const html_descricao = document.getElementById("descricao");

                        if (
                            // !(html_imagem instanceof HTMLInputElement) ||
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
                        html_categoria.value = _servico.categoriaId;
                        html_descricao.value = _servico.descricao;
                        editIdIndex = _servico.id;
                    });
                });

                html_delete.addEventListener("click", () => {
                    if (!servico.id) return;
                    // TODO: avoid deleting if editing
                    if (servico.id === editIdIndex) return;
                    crud_servicos.excluirServico(servico.id).then(() => render());
                });

                html_ul_lista.appendChild(li);
            });
        });
    };

    html_form.addEventListener("submit", (event) => {
        event.preventDefault();

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

        if (!html_input_picture.files || !html_input_picture.files.length) return;

        fileToBase64(html_input_picture.files[0]).then(async (imagem) => {
            if (!imagem.startsWith("data:image/")) {
                alert("Ocorreu um erro ao validar as informações!");
                return;
            }

            const titulo = html_titulo.value.trim();
            const contato = html_contato.value.trim();
            const categoriaId = html_categoriaId.value;
            const descricao = html_descricao.value.trim();
            const categoria = html_categoriaId.selectedOptions[0].text;

            if (editIdIndex !== null) {
                // ATUALIZAR
                await crud_servicos.updateServico(
                    new Servico(
                        editIdIndex,
                        titulo,
                        categoria,
                        categoriaId,
                        descricao,
                        contato,
                        imagem
                    )
                );
                editIdIndex = null;
            } else {
                // CADASTRAR
                await crud_servicos.criarServico(
                    new Servico(
                        editIdIndex,
                        titulo,
                        categoria,
                        categoriaId,
                        descricao,
                        contato,
                        imagem
                    )
                );
            }

            html_form.reset();
            render();
        });
    });

    render();
});

function setupServicos() {
    const html_imagem = document.getElementById("imagem");
    if (!(html_imagem instanceof HTMLInputElement)) return;
    html_imagem.addEventListener("change", previewPicture);
}

setupServicos();
