const API_URL = 'http://localhost:3000/avaliacoes';

// Script para interação das estrelas
const stars = document.querySelectorAll('.stars span');
let selectedRating = 0;

stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    selectedRating = index + 1;
    updateStars();
  });
  star.addEventListener('mouseenter', () => {
    highlightStars(index + 1);
  });
  star.addEventListener('mouseleave', () => {
    updateStars();
  });
});

function highlightStars(rating) {
  stars.forEach((star, i) => {
    star.classList.toggle('hover', i < rating);
  });
}

function updateStars() {
  stars.forEach((star, i) => {
    if (i < selectedRating) {
      star.classList.add('selected');
      star.setAttribute('aria-checked', 'true');
      star.setAttribute('tabindex', '0');
    } else {
      star.classList.remove('selected');
      star.setAttribute('aria-checked', 'false');
      star.setAttribute('tabindex', '-1');
    }
  });
}

// Inicializa as estrelas
updateStars();

function limparFormulario() {
  selectedRating = 0;
  updateStars();
  document.getElementById('comentario').value = '';
  document.getElementById('imagem').value = '';
}

// Função para converter imagem em base64 para envio simples (opcional)
function getImagemBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function publicar() {
  const comentario = document.getElementById('comentario').value.trim();
  const imagemInput = document.getElementById('imagem');
  if (selectedRating === 0) {
    alert('Por favor, selecione uma avaliação por estrelas.');
    return;
  }
  if (comentario.length < 5) {
    alert('Por favor, escreva um comentário mais detalhado.');
    return;
  }

  const imagemFile = imagemInput.files[0];
  const imagemBase64 = await getImagemBase64(imagemFile);

  const avaliacao = {
    nome: "Nome e Sobrenome",
    estrelas: selectedRating,
    comentario,
    imagem: imagemBase64 || null,
    data: new Date().toISOString()
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(avaliacao),
    });
    if (!response.ok) throw new Error('Erro ao enviar avaliação.');
    alert('Avaliação enviada com sucesso!');
    limparFormulario();
  } catch (error) {
    alert('Erro ao enviar avaliação: ' + error.message);
  }
}
