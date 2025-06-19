//@ts-check

document.getElementById("formCadastro").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const tipo = document.getElementById("tipo").value;
    const cpf_cnpj = document.getElementById("cpf").value.replace(/\D/g, "");
    const contato = document.getElementById("contato").value.replace(/\D/g, "");
    const data_nascimento = document.getElementById("data_nascimento").value;
    const cidade = document.getElementById("cidade").value;
    const biografia = document.getElementById("biografia").value;
    const profissao = document.getElementById("profissao").value;
    const fotoInput = document.getElementById("foto");

    if (!fotoInput.files[0]) {
        alert("Por favor, selecione uma foto.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const fotoBase64 = reader.result;

        const novoUsuario = {
            id: Date.now(),
            ativo: true,
            foto: fotoBase64,
            nome,
            data_nascimento,
            email,
            senha,
            contatos: [
                {
                    id: 0,
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
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Adiciona o novo usuário à lista
        usuarios.push(novoUsuario);

        // Salva a lista de volta no localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Usuário cadastrado com sucesso!");
        document.getElementById("formCadastro").reset();
        document.getElementById("preview").src = "https://www.w3schools.com/howto/img_avatar.png";
    };

    reader.readAsDataURL(fotoInput.files[0]);
});

// Preview da imagem
function previewFoto() {
    const file = document.getElementById("foto").files[0];
    const preview = document.getElementById("preview");
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
