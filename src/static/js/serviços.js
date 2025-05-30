//@ts-check

var editarServico = () => {};
var deletarServico = () => {};
var previewPicture = () => {};
const getServicos = () => JSON.parse(localStorage.getItem("servicos") || "[]");
const salvarServicos = (/** @type {Object} */ servicos) =>
    localStorage.setItem("servicos", JSON.stringify(servicos));

// TODO: Move to module
/**
 * @param {Blob} file
 */
async function fileToBase64(file) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// TODO: Add image
document.addEventListener("DOMContentLoaded", () => {
    /** @type {HTMLFormElement} */
    // @ts-ignore Casting HTMLElement as HTMLFormElement
    const html_form = document.getElementById("form-servico");
    const html_ul_lista = document.getElementById("lista-servicos");

    if (!html_form || !html_ul_lista) return;

    let editIndex = null;

    const render = () => {
        html_ul_lista.innerHTML = "";
        getServicos().forEach(
            (
                /** @type {{ titulo: any; categoria: any; descricao: any; contato: any; }} */ servico,
                /** @type {any} */ index
            ) => {
                const li = document.createElement("li");
                li.className =
                    "list-group-item d-flex justify-content-between align-items-center flex-wrap";

                li.innerHTML = `<div class="d-flex flex-column">
                    <strong>${servico.titulo}</strong>
                    <small>${servico.categoria}</small>
                    <p class="mb-1">${servico.descricao}</p>
                    <small>Contato: ${servico.contato}</small>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-warning" onclick="editarServico(${index})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletarServico(${index})">Excluir</button>
                </div>`;

                html_ul_lista.appendChild(li);
            }
        );
    };

    editarServico = (/** @type {string | number} */ index) => {
        const servico = getServicos()[index];

        /** @type {HTMLInputElement} */
        // @ts-ignore Casting HTMLElement as HTMLInputElement
        const html_titulo = document.getElementById("titulo");
        /** @type {HTMLInputElement} */
        // @ts-ignore Casting HTMLElement as HTMLInputElement
        const html_contato = document.getElementById("contato");
        /** @type {HTMLInputElement} */
        // @ts-ignore Casting HTMLElement as HTMLInputElement
        const html_categoria = document.getElementById("categoriaId");
        /** @type {HTMLInputElement} */
        // @ts-ignore Casting HTMLElement as HTMLInputElement
        const html_descricao = document.getElementById("descricao");

        if (!html_titulo || !html_contato || !html_categoria || !html_descricao) return;

        html_titulo.value = servico.titulo;
        html_contato.value = servico.contato;
        html_categoria.value = servico.categoriaId;
        html_descricao.value = servico.descricao;
        editIndex = index;
    };

    deletarServico = (/** @type {any} */ index) => {
        const servicos = getServicos();
        servicos.splice(index, 1);
        salvarServicos(servicos);
        render();
    };

    previewPicture = () => {
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

        fileToBase64(html_input_picture.files[0]).then((/** @type {string} */ result) => {
            // TODO: Limitar tamanho da imagem

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
        });
    };

    html_form.addEventListener("submit", (event) => {
        event.preventDefault();

        /** @type {HTMLInputElement} */
        // @ts-ignore Casting HTMLElement as HTMLInputElement
        const html_titulo = document.getElementById("titulo");
        /** @type {HTMLInputElement} */
        // @ts-ignore Casting HTMLElement as HTMLInputElement
        const html_contato = document.getElementById("contato");
        /** @type {HTMLInputElement} */
        // @ts-ignore Casting HTMLElement as HTMLInputElement
        const html_categoriaId = document.getElementById("categoriaId");
        /** @type {HTMLInputElement} */
        // @ts-ignore Casting HTMLElement as HTMLInputElement
        const html_descricao = document.getElementById("descricao");
        /** @type {HTMLSelectElement} */
        // @ts-ignore Casting HTMLElement as HTMLSelectElement
        const html_categoria = document.getElementById("categoriaId");

        if (
            !html_titulo ||
            !html_contato ||
            !html_categoriaId ||
            !html_descricao ||
            !html_categoria
        )
            return;

        const titulo = html_titulo.value.trim();
        const contato = html_contato.value.trim();
        const categoriaId = html_categoriaId.value;
        const descricao = html_descricao.value.trim();
        const categoria = html_categoria.selectedOptions[0].text;

        const novoServico = {
            titulo,
            contato,
            categoriaId,
            categoria,
            descricao,
        };

        const servicos = getServicos();

        if (editIndex !== null) {
            servicos[editIndex] = novoServico;
            editIndex = null;
        } else {
            servicos.push(novoServico);
        }

        salvarServicos(servicos);
        html_form.reset();
        render();
    });

    render();
});
