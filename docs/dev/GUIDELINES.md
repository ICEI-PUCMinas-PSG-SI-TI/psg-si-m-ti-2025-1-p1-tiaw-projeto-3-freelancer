# Guidelines

Diretrizes para os desenvolvedores do projeto.

## Desenvolvimento

- Para o desenvolvimento do projeto, é obrigatório o uso do git, se houver dúvidas, sempre entrar em contato com o Scrum Master ou o Project Owner.
- Evitar enviar tudo em um so commit, se tudo for feito de uma vez, fica difícil identificar o que foi realizado ou alterado.

> É melhor que haja vários commits, mesmo que com poucas alterações e o que você esteja fazendo não tenha ficado pronto. É pra isso que servem as branches, você desenvolve tudo nela sem alterar o funcionamento do projeto, e quando essa feature estiver pronto, todo o código feito nela é revisado e unido a branch principal (main/master).

## Branches

- Nunca utilizar a main/master para desenvolver features.
- Utilizar a main/master apenas se foram alterações simples com poucas linhas.

O desenvolvimento em branches funciona da seguinte forma: Suponhamos que será desenvolvido a tela de perfil do usuário, primeiramente, em um terminal criamos uma branch separada e alternamos para ela:

<!-- TODO: Colocar prints ou GIFs do vscode para auxiliar -->

```shell
# Para criar a branch, utilizar `git branch`
git branch feature-tela-perfil

# para alternar para branch
git checkout feature-tela-perfil

# confirma que estamos na branch feature-tela-perfil
git status
```

Caso necessário, pode utilizar o nome pessoal para nomear a branch como `dev-fulano`, mas pessoalmente eu procuraria outras alternativas pois é importante que o nome da branch seja algo descritivo sobre o que você esta desenvolvendo nela.

Exemplos de branches recomendadas:

```shell
# desenvolver tela de perfil
feature-tela-perfil
dev-tela-perfil
# resolver bug no login
fix-login
```

Após alternar para branch `feature-tela-perfil`, desenvolver o código necessário dentro dela criando commits a cada alterações conforme necessário. 

> [!NOTE]
> É importante que as alterações sejam realizadas referente a feature que você esta desenvolvendo:
>
> Viu um erro em outro arquivo que esta fora do escopo da branch (por exemplo na tela de login)? Você pode:
>
> - Opção 1: Criar uma 3º branch separada e realizar um commit com **APENAS** as alterações feitas para resolver esse erro.
> - Opção 2: Informar ao Scrum Master ou o Project Owner.
> - Opção 3: Deixar pra resolver após finalizar a branch.

Também é importante que as suas alterações não causem problemas em outras partes do código, por exemplo remover uma imagem que esta sendo utilizada por outra tela ou recurso do site.

## Pull Request

Sempre que terminar uma feature ou um fix, abrir um terminal e envie a branch para o github:

<!-- TODO: Colocar prints ou GIFs do vscode para auxiliar -->

```shell
git pull origin nome-da-branch
```

<!-- TODO: Colocar prints do github para ilustrar -->
Após enviar a branch, crie um "Pull Request", isto é, uma solicitação para unir o código que esta na branch enviada com a branch principal, aqui, será realizado a revisão de todo o código para ter certeza que tudo esta funcionando corretamente.

## Estrutura do diretório

Todos os arquivos referente ao site são inseridos dentro da pasta "src". Dentro desta pasta irá conter as pastas referentes a paginas do site e dentro de cada uma dessas haverá um arquivo index.html e styles.css.

```txt
📁 src
├── 📁 .template
│  ├── 📄 index.html
│  ├── 🎨 styles.css
│  └── 🚀 script.js
├── 📁 static
│  ├── 🖼️ logo.png
│  ├── 🖼️ icone_instagram.svg
│  └── 🖼️ foto_generica.jpeg
├── 📁 login
│  ├── 📄 index.html
│  ├── 🎨 styles.css
│  └── 🚀 script.js
├── 📁 perfil
│  ├── 📄 index.html
│  ├── 🎨 styles.css
│  └── 🚀 script.js
├── 📄 index.html
├── 🎨 styles.css
└── 🚀 script.js
```

Há uma pasta chamada `src/.template/`, nela haverá arquivos HTML, CSS e JavaScript modelos para criar as paginas. Elas serão utilizadas para reservar espaços como cabeçalho e rodapé ou estilos pré definidos.

Os arquivos de imagem devem ficar todos na pasta `src/static/` e ao utilizar as imagens no HTML, colocar como abaixo:

```html
<!-- Para arquivos que estão em sub-pastas dentro da pasta src -->
<!-- Como exemplo: src/login/index.html -->
<img src="../static/imagem.png" >

<!-- Para arquivos dentro da pasta src -->
<!-- Como exemplo: src/index.html -->
<img src="static/imagem.png" >
```

<!--
TODO: ## Estrutura do HTML e CSS
-->