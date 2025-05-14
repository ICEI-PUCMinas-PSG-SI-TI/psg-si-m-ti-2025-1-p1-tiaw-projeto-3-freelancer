//@ts-check

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 * 
 * Ferramentas para CRUD referentes aos [ USUÁRIOS ]
 * 
 * CRUD = Create, Read, Update, Delete
 * CLAD = Criar, Ler, Atualizar, Deletar
 * VEIA = Visualizar, Excluir, Incluir, Alterar
 * 
 * JavaScript Object Notation Query Language
 * 
 */

const KEY_USUARIOS = "usuarios"
const getUsuarios = () => JSON.parse(localStorage.getItem(KEY_USUARIOS) || "[]");
const setUsuarios = (usuarios) => localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));

/**
 * Retorna null e printa o que estiver em value no console
 * 
 * @param {string} value console.log(value)
 * 
 * @return {null} 
 */
// TODO: Export to module and reuse
function returnError(value) {
    if (typeof (value) === "string")
        console.log(value)

    return null;
}

/**
 * Retorna true se o tipo do objeto passado como parametro é igual ao tipo desejado
 * 
 * @param {any} value Objeto para comparação
 * @param {string} type Tipo para comparação
 * 
 * @return {boolean} 
 */
// TODO: Export to module and reuse
function ensureType(value, type) {
    if (typeof (type) !== "string")
        return false

    return typeof (value) === type;
}

/**
 * Cria um objeto com as informações do usuário
 * 
 * @param {Boolean} ativo Usuário está ativo?
 * @param {string} nome Nome completo do usuário, validação de documentação
 * @param {string} data_nascimento Data de nascimento do usuário (ISO-8601)
 * @param {string} email E-mail do usuário
 * @param {string} senha Senha do usuário
 * @param {string} tipo Tipo de usuário, define as permissões (admin, cliente, freelancer)
 * @param {string} cpf_cnpj Documento do usuário
 * @param {string} cidade Localização do usuário
 * @param {string} biografia Informações breves sobre o usuário
 * @param {Array} contatos Lista de contatos do usuário
 * @returns {object|null} Se valido, retorna o objeto com as informações do usuário
 */
export function factoryUsuario(ativo, nome, data_nascimento, email, senha, tipo, cpf_cnpj, cidade, biografia, contatos) {
    // Struct :: Usuário
    function Usuario(id, ativo, nome, data_nascimento, email, senha, tipo, cpf_cnpj, cidade, biografia, contatos) {
        this.id = id;
        this.ativo = ativo;
        this.nome = nome;
        this.data_nascimento = data_nascimento;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
        this.cpf_cnpj = cpf_cnpj;
        this.cidade = cidade;
        this.biografia = biografia;
        this.contatos = contatos;
    }

    const usuario = new Usuario(null, ativo, nome, data_nascimento, email, senha, tipo, cpf_cnpj, cidade, biografia, contatos)
    return validateUsuario(usuario);
}

/**
 * Validação da struct dos usuários
 * 
 * @param  {object} usuario Objeto com as informações do usuários
 * @returns {object | null} Se valido, retorna o objeto com as informações do usuário
 */
export function validateUsuario(usuario) {
    // TODO: Check if is object

    // ID Opcional
    if (usuario.id && !(ensureType(usuario.id, "number") || ensureType(usuario.id, "string"))) {
        return returnError("validateUsuario: id não é valido(a)")
    }

    if (!ensureType(usuario.ativo, "boolean")) {
        return returnError("validateUsuario: ativo não é valido(a)")
    }

    if (!ensureType(usuario.nome, "string")) {
        return returnError("validateUsuario: nome não é valido(a)")
    }

    if (!ensureType(usuario.data_nascimento, "string")) {
        return returnError("validateUsuario: data_nascimento não é valido(a)")
    }

    if (!ensureType(usuario.email, "string")) {
        return returnError("validateUsuario: email não é valido(a)")
    }

    if (!ensureType(usuario.senha, "string")) {
        return returnError("validateUsuario: senha não é valido(a)")
    }

    if (!ensureType(usuario.tipo, "string")) {
        return returnError("validateUsuario: tipo não é valido(a)")
    }

    if (!ensureType(usuario.cpf_cnpj, "string")) {
        return returnError("validateUsuario: cpf_cnpj não é valido(a)")
    }

    if (!ensureType(usuario.cidade, "string")) {
        return returnError("validateUsuario: cidade não é valido(a)")
    }

    if (!ensureType(usuario.biografia, "string")) {
        return returnError("validateUsuario: biografia não é valido(a)")
    }

    if (!ensureType(usuario.contatos, "object")) {
        return returnError("validateUsuario: contatos não é valido(a)")
    }

    return usuario
}

/**
 * Lê os usuários armazenados no local storage
 * 
 * @param  {Array} usuarios_id Array com IDs dos usuários solicitados, retorna todos se vazio.
 * @returns {Array|null} Array com informações sobre os usuário
 */
export function readUsuarios(...usuarios_id) {
    if (!usuarios_id) {
        return returnError("readUsuarios: nulo");
    }

    if (!Array.isArray(usuarios_id)) {
        return returnError("readUsuarios: não é um array");
    }

    let usuarios = getUsuarios();

    // Se o valor for nulo, retorna todas as ids
    if (usuarios_id.length === 0)
        return usuarios

    let usuarios_filter = [];

    for (let x = 0; x < usuarios_id.length; x++) {
        let id = parseInt(usuarios_id[x]);

        if (isNaN(id))
            return null

        for (let index = 0; index < usuarios.length; index++) {
            const element = usuarios[index];

            if (id === parseInt(element.id)) {
                usuarios_filter.push(element);
                // TODO: Remove porque? Não é pra adicionar?
                // Remove o usuário da lista
                usuarios.splice(index, 1);
            }
        }
    }

    return usuarios_filter;
}

/**
 * Retorna a ID do último usuário cadastrado
 * 
 * @returns {Number} ID do último usuário cadastrado 
 */
export function getIdLastUsuario() {
    let usuarios = readUsuarios();

    // Se não há usuários cadastrados, retorna o valor 0
    if (!usuarios)
        return 0

    let last_id = 0;

    usuarios.forEach((usuario) => {
        let id = parseInt(usuario.id);
        if (id > last_id) {
            last_id = id;
        }
    })

    return last_id;
}

/**
 * Atualiza as informações de um usuário utilizando a ID
 *  
 * @param {Number} usuario_id ID do usuário a ser atualizado 
 * @param {any} usuario_new Informações do usuário para ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram cadastradas corretamente 
 */
export function updateUsuario(usuario_id, usuario_new) {
    // TODO: Create a validateId func
    // 1. check if number (accept string to number)
    // 2. ensure number > 0
    if (!ensureType(usuario_id, "number"))
        return null

    if (usuario_id < 1)
        return null

    // Verifica se as informações do usuário são validas
    if (!validateUsuario(usuario_new))
        return null

    let usuarios = readUsuarios();

    if (!usuarios?.length)
        return false

    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        if (usuario_id === parseInt(element.id)) {
            // Remove o usuário da lista
            usuarios.splice(index, 1);
            // Adiciona o usuário com as novas informações, salva no localStorage, retorna true
            usuarios.push(usuario_new);
            setUsuarios(usuarios);
            return true;
        }
    }    

    return false;
}

/**
 * Deleta as informações de um usuário utilizando a ID
 *  
 * @param {Number} usuario_id ID do usuário a ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram encontradas e deletadas 
 */
// TODO: Receber array
export function deleteUsuario(usuario_id) {
    if (!ensureType(usuario_id, "number"))
        return null

    if (usuario_id < 1)
        return null

    let usuarios = readUsuarios();

    if (!usuarios?.length)
        return false

    for (let index = 0; index < usuarios.length; index++) {
        const element = usuarios[index];
        if (usuario_id === parseInt(element.id, 10)) {
            // Remove o usuário da lista
            usuarios.splice(index, 1);
            // Após remover o usuário, armazena a nova lista e retorna true
            setUsuarios(usuarios);
            return true;
        }
    }

    return false;
}

/**
 * Limpa todas as informações dos usuários do localStorage
 *  
 * @returns {void}
 */
export function clearUsuarios() {
    return setUsuarios([]);
}

/**
 * Cadastra um novo usuário
 *  
 * @param {any} usuario_new Informações do usuário a ser cadastrado
 * @returns {Number | null} Retorna o ID do usuário se as informações foram cadastradas corretamente 
 */
export function createUsuario(usuario_new) {
    if (!usuario_new) {
        return returnError("createUsuario: Não há argumentos");
    }

    let usuarios = readUsuarios();

    // Verifica se as informações no usuário são validas
    if (!validateUsuario(usuario_new)) {
        return returnError("createUsuario: Não foi possível validar os argumentos");
    }

    if (!usuarios)
        usuarios = []

    usuario_new.id = getIdLastUsuario()

    if (!ensureType(usuario_new.id, "number"))
        return null

    // Incrementa a ID
    usuario_new.id += 1;

    usuarios.push(usuario_new);

    setUsuarios(usuarios);

    return usuario_new.id;
}