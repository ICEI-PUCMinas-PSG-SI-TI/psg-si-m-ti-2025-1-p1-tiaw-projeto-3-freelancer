//@ts-check

const maxAllowedSizeCad = 5 * 1024 * 1024; // 5 MB in bytes

// TODO: Move to module
/**
 * @param {Blob} file
 */
async function fileToBase64(file) {
    const reader = new FileReader();

    if (file.size > maxAllowedSizeCad)
        throw new Error("O tamanho do arquivo deve ser menor que 5MB!");

    if (!/image.*/.exec(file.type)) throw new Error("O arquivo não é uma imagem!");

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const htmlCadastroInputNome = document.getElementById("nome");
const htmlCadastroInputEmail = document.getElementById("email");
const htmlCadastroInputSenha = document.getElementById("senha");
const htmlCadastroSelectTipo = document.getElementById("tipo");
const htmlCadastroInputCpfCnpj = document.getElementById("cpf");
const htmlCadastroInputContato = document.getElementById("contato");
const htmlCadastroInputDataNascimento = document.getElementById("data_nascimento");
const htmlCadastroInputCidade = document.getElementById("cidade");
const htmlCadastroTextAreaBiografia = document.getElementById("biografia");
const htmlCadastroInputFoto = document.getElementById("foto");
const htmlCadastroImgPreview = document.getElementById("preview");
const htmlCadastroSelectProfissao = document.getElementById("profissao");

const htmlCadastroForm = document.getElementById("formCadastro");

async function atualizarCadastro() {
    if (
        !(htmlCadastroInputNome instanceof HTMLInputElement) ||
        !(htmlCadastroInputEmail instanceof HTMLInputElement) ||
        !(htmlCadastroInputSenha instanceof HTMLInputElement) ||
        !(htmlCadastroSelectTipo instanceof HTMLSelectElement) ||
        !(htmlCadastroInputCpfCnpj instanceof HTMLInputElement) ||
        !(htmlCadastroInputContato instanceof HTMLInputElement) ||
        !(htmlCadastroInputDataNascimento instanceof HTMLInputElement) ||
        !(htmlCadastroInputCidade instanceof HTMLInputElement) ||
        !(htmlCadastroTextAreaBiografia instanceof HTMLTextAreaElement) ||
        !(htmlCadastroInputFoto instanceof HTMLInputElement) ||
        !(htmlCadastroImgPreview instanceof HTMLImageElement) ||
        !(htmlCadastroSelectProfissao instanceof HTMLSelectElement)
    )
        throw new Error("Null checking");

    // TODO: Validar campos
    const nome = htmlCadastroInputNome.value;
    const email = htmlCadastroInputEmail.value;
    const senha = htmlCadastroInputSenha.value;
    const tipo = htmlCadastroSelectTipo.value;
    const cpf_cnpj = htmlCadastroInputCpfCnpj.value.replace(/\D/g, "");
    const contato = htmlCadastroInputContato.value.replace(/\D/g, "");
    const data_nascimento = htmlCadastroInputDataNascimento.value;
    const cidade = htmlCadastroInputCidade.value;
    const biografia = htmlCadastroTextAreaBiografia.value;
    const fotoInput_files = htmlCadastroInputFoto.files;
    const profissao = htmlCadastroSelectProfissao.value;

    if (!fotoInput_files?.length) {
        alert("Por favor, selecione uma foto.");
        return;
    }

    // TODO: Clear input if image is invalid
    fileToBase64(fotoInput_files[0])
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
                profissao,
            };

            // Recupera os usuários salvos anteriormente (ou um array vazio)
            const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]") || [];

            // Adiciona o novo usuário à lista
            usuarios.push(novoUsuario);

            // Salva a lista de volta no localStorage
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Usuário cadastrado com sucesso!");
            if (htmlCadastroForm instanceof HTMLFormElement) htmlCadastroForm.reset();
            htmlCadastroImgPreview.src = "https://www.w3schools.com/howto/img_avatar.png";
        })
        .catch((error) => {
            alert(error);
        });
}

function inicializarCadastro() {
    if (!(htmlCadastroForm instanceof HTMLFormElement)) return;
    htmlCadastroForm.addEventListener("submit", (event) => {
        event.preventDefault();
        atualizarCadastro();
    });

    htmlCadastroInputFoto?.addEventListener("change", async () => {
        if (
            !(htmlCadastroInputFoto instanceof HTMLInputElement) ||
            !(htmlCadastroImgPreview instanceof HTMLImageElement)
        )
            return;

        if (!htmlCadastroInputFoto.files?.length) return;
        fileToBase64(htmlCadastroInputFoto.files[0]).then((result) => {
            htmlCadastroImgPreview.src = result;
        });
    });
}

inicializarCadastro();
