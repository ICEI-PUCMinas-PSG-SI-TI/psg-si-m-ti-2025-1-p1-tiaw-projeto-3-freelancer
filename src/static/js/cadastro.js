//@ts-check

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

/** @type {HTMLFormElement} */
// @ts-ignore Casting HTMLElement as HTMLFormElement
let form_cadastro_usuario = document.getElementById("formCadastro");
form_cadastro_usuario?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // TODO: Validar campos
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_nome = document.getElementById("nome");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_email = document.getElementById("email");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_senha = document.getElementById("senha");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_tipo = document.getElementById("tipo");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_cpf_cnpj = document.getElementById("cpf");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_contato = document.getElementById("contato");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_data_nascimento = document.getElementById("data_nascimento");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_cidade = document.getElementById("cidade");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_biografia = document.getElementById("biografia");
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_foto = document.getElementById("foto");
    /** @type {HTMLImageElement} */
    // @ts-ignore Casting HTMLElement as HTMLImageElement
    const html_img_preview = document.getElementById("preview");

    if (
        !html_input_nome ||
        !html_input_email ||
        !html_input_senha ||
        !html_input_tipo ||
        !html_input_cpf_cnpj ||
        !html_input_contato ||
        !html_input_data_nascimento ||
        !html_input_cidade ||
        !html_input_biografia ||
        !html_input_foto ||
        !html_img_preview
    ) {
        return;
    }

    // TODO: Validar campos
    const nome = html_input_nome.value;
    const email = html_input_email.value;
    const senha = html_input_senha.value;
    const tipo = html_input_tipo.value;
    const cpf_cnpj = html_input_cpf_cnpj.value.replace(/\D/g, "");
    const contato = html_input_contato.value.replace(/\D/g, "");
    const data_nascimento = html_input_data_nascimento.value;
    const cidade = html_input_cidade.value;
    const biografia = html_input_biografia.value;
    const fotoInput_files = html_input_foto.files;

    if (!fotoInput_files || !fotoInput_files.length) {
        alert("Por favor, selecione uma foto.");
        return;
    }

    const fotoInput = fotoInput_files[0];

    fileToBase64(fotoInput)
        .then((result) => {
            const novoUsuario = {
                //* Perigoso?
                id: Date.now(),
                ativo: true,
                foto: result,
                nome,
                data_nascimento,
                email,
                senha,
                contatos: [
                    {
                        id: 1,
                        // TODO: Check this
                        contato,
                    },
                ],
                tipo,
                cpf_cnpj,
                cidade,
                biografia,
            };

            // Recupera os usuários salvos anteriormente (ou um array vazio)
            const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]") || [];

            // Adiciona o novo usuário à lista
            usuarios.push(novoUsuario);

            // Salva a lista de volta no localStorage
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Usuário cadastrado com sucesso!");
            form_cadastro_usuario?.reset();
            html_img_preview.src = "https://www.w3schools.com/howto/img_avatar.png";
        })
        .catch((error) => {
            console.log(error);
        });
});

// Preview da imagem
function previewFoto() {
    /** @type {HTMLInputElement} */
    // @ts-ignore Casting HTMLElement as HTMLInputElement
    const html_input_foto = document.getElementById("foto");
    /** @type {HTMLImageElement} */
    // @ts-ignore Casting HTMLElement as HTMLImageElement
    const html_img_preview = document.getElementById("preview");

    if (!html_input_foto || !html_img_preview) return;

    if (!html_input_foto.files || !html_input_foto.files.length) return;

    const file = html_input_foto.files[0];

    fileToBase64(file).then((result) => {
        html_img_preview.src = result;
    });
}
