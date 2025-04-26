# 📋 2. Especificações do Projeto

As especificações do projeto, são resultado do processo de "Design Thinking" que consiste em buscar entender os requisitos e criar funcionalidades focadas na experiência do usuário. Nesta etapa, realizamos a identificação dos diversos perfis de possíveis usuários das plataformas e como estes poderão interagir com o produto, enumerando as necessidades, dificuldades e restrições que irão guiar a implementação das funcionalidades necessárias e o design.

## Personas

As personas são perfis pré-definidos de possíveis usuários e sobre o que buscam na plataforma. Abaixo, estão 3 exemplos de personas e como elas podem auxiliar o a fórmula do produto e seus desafios.

### 👨🏽‍💼 Gabriel Souza

Gabriel Souza, um jovem de 19 anos, é um freelancer criativo e curioso, apaixonado por design gráfico e edição de vídeos. Além de explorar hobbies como jogos online, fotografia urbana e criação de conteúdo para redes sociais, seu objetivo é alcançar independência financeira e construir um portfólio atraente, enquanto trabalha com plataformas intuitivas e clientes que valorizem seu trabalho. Motivado pelo desafio e reconhecimento, sonha em viver do que ama, viajar pelo mundo e se destacar no mercado criativo, equilibrando sua personalidade extrovertida com momentos de introspecção. Essa persona simboliza a maior parte dos freelancers atualmente que utilizam as redes sociais para oferecer os seus serviços já que possuem um alcance mais amplo.

### 👨🏻‍🏫 Heitor Morais

Heitor Morais é alguém experiente e determinado, que combina sua paixão por fotografia com sua ocupação de professor, equilibrando trabalho e freelancing. Aos 49 anos, utiliza principalmente smartphones para comunicação diária, e emprega câmeras digitais para seus serviços de fotografia. Seu sonho é conquistar uma casa na praia e uma aposentadoria confortável com o fruto de seu trabalho. Heitor representa uma pessoa simples que não tem familiaridade com plataformas digitais e a maior parte do tempo no virtual são apps de comunicação.

### 👨🏻‍💼 João Gomes

João Gomes, aos 26 anos, é o proprietário de uma casa de assados e defumados, com uma personalidade calma e focada no trabalho. Nos fins de semana, relaxa jogando futebol e assistindo filmes, enquanto sua ambição é alcançar sucesso profissional até os 30. Ele utiliza WhatsApp e Instagram para comunicação e marketing, além de LinkedIn para objetivos profissionais. João se encaixa no produto quando se facilita a contratação de novos funcionários, priorizando agilidade e simplicidade, condizentes com as demandas do mundo moderno.

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

| Histórias de Usuários |
|:--|
| Como freelancer, eu quero criar um anúncio, para oferecer meus serviços. |
| Como cliente, quero visualizar os serviços disponíveis, para identificar se encaixam nas minhas necessidades. |
| Como cliente, quero visualizar o portfólio do contratado, para identificar se o serviço prestado é de qualidade. |
| Como cliente, quero poder verificar históricos de serviços prestados pelo contratante, para identificar se houve algum inconveniente na prestação do serviço. |
| Como cliente, quero poder filtrar as opções disponíveis para encontrar opções mais diversas ou mais especificas de acordo com as necessidades. |
| Como usuário, desejo poder visualizar a nota de um outro usuário para que evite cair em golpes.|
| Como cliente, desejo poder criar um anúncio de procura de serviço para que outros usuários possam oferecer um orçamento. |
| Como usuário, desejo poder realizar avaliações em serviços contratados para registrar reclamações ou elogios. |
| Como usuário, desejo que haja um meio de se comunicar com outro usuário para poder fazer orçamentos, negociações ou retirar dúvidas. |
| Como usuário, gostaria que houvesse algum meio de garantia no pagamento para evitar golpes. |
| Como freelancer, quero oferecer serviços já precificados, para facilitar a visualização e análise de um possível cliente. |
| Como freelancer, quero receber notificações sobre projetos que correspondem às minhas habilidades, para que eu possa candidatar-me rapidamente. |
| Como administrador, quero poder visualizar comentários inadequados para tornar a plataforma mais segura. |
| Como freelancer, gostaria de poder visualizar serviços mais requisitados para conseguir um número maior de clientes. |
| Como usuário, gostaria de visualizar em um anúncio freelancers semelhantes para considerar mais de uma opção.|

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001|Permitir que usuários possam se cadastrar.|ALTA|
|RF-002|Permitir que o usuário cadastre serviços.|ALTA|
|RF-003|Permitir que o usuário visualize serviços.|ALTA|
|RF-004|Permitir que o usuário pesquise por serviços.|MÉDIA|
|RF-005|Permitir que o usuário possa visualizar ou solicitar orçamentos.|MÉDIA|
|RF-006|Permitir que o usuário possa configurar preços por seus serviços.|BAIXA|
|RF-007|Criar tags ou categorias de serviços.|BAIXA|
|RF-008|Permitir que o usuário utilize filtros para pesquisar serviços<br>como local, habilidades e preço.|BAIXA|
|RF-009|Criar uma interface de informação sobre os serviços contratados.|ALTA|
|RF-010|Criar uma interface de informação sobre todos os serviços<br>prestados pelo usuário.|ALTA|
|RF-011|Adicionar uma aba de avaliações/comentários por serviço.|MÉDIA|
|RF-012|Adicionar uma aba de avaliações/comentários por usuário.|BAIXA|
|RF-013|Criar uma interface de histórico de serviços contratados.|BAIXA|
|RF-014|Criar uma interface de portfólio do usuário.|MÉDIA|
|RF-015|Adicionar um meio de comunicação entre usuários.|BAIXA|
|RF-016|Criar um sistema de moderação de comentários.|BAIXA|
|RF-017|Emitir um relatório de serviços por demanda.|BAIXA|
|RF-018|Criar um sistema de recomendação de serviços semelhantes.|BAIXA|
|RF-019|Criar um sistema de pagamento.|EXTRA|

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
| RNF-001 | O sistema deve utilizar uma interface fluido para se adaptar a<br>diversos dispositivos|ALTA|
| RNF-002 | O sistema deve manter uma interface intuitiva|MÉDIA|
| RNF-003 | O sistema deve exigir autenticação para cadastro de serviços|ALTA|
| RNF-004 | O sistema pode utilizar de ferramentas de localização para melhorar o uso|BAIXA|

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre. |
|02| Não pode ser desenvolvido um módulo de backend.        |
|03| Não criar interfaces complicadas de uso.              |