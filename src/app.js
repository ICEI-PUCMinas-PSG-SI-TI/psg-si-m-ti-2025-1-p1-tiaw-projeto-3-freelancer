// app.js

document.getElementById("foto").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("previewFoto");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  });
  
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
    const fotoInput = document.getElementById("foto");
    let fotoBase64 = "";
  
    if (fotoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function () {
        fotoBase64 = reader.result;
  
        const novoUsuario = {
          id: Date.now(),
          ativo: true,
          foto: fotoBase64,
          nome,
          data_nascimento,
          email,
          senha,
          contatos: [{ id: 0, contato }],
          tipo,
          cpf_cnpj,
          cidade,
          biografia,
        };
  
        console.log("Usuário criado:", novoUsuario);
        alert("Usuário cadastrado com sucesso!");
        document.getElementById("formCadastro").reset();
        document.getElementById("previewFoto").style.display = "none";
      };
      reader.readAsDataURL(fotoInput.files[0]);
    } else {
      alert("Por favor, selecione uma foto.");
    }
  });
  
  // app.js

function previewFoto() {
    const file = document.getElementById('foto').files[0];
    const preview = document.getElementById('preview');
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // app.js

document.addEventListener('DOMContentLoaded', () => {
    const fotoInput = document.getElementById('foto');
    const preview = document.getElementById('preview');
  
    if (fotoInput && preview) {
      fotoInput.addEventListener('change', () => {
        const file = fotoInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
  