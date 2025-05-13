//@ts-check

const KEY_USUARIOS = "usuarios"

const getUsuarios = () => JSON.parse(localStorage.getItem(KEY_USUARIOS) || "[]");
const setUsuarios = (usuarios) => localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));

// Struct de exemplo, pode ser clonada com Object.assign(source, destination)
const StructUsuarios = {
    id: 0, // number
    ativo: true, // bool
    nome: "null", // string
    data_nascimento: "null", // string
    email: "null", // string
    senha: "null", // string
    tipo: "null", // string
    cpf_cnpj: "null", // string
    cidade: "null", // string
    biografia: "null", // string
    contatos: [] // Array
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
 * @returns {object|null} Array com informações sobre os 
 */
export function factoryUsuario(ativo, nome, data_nascimento, email, senha, tipo, cpf_cnpj, cidade, biografia, contatos) {

    /* TODO: Validate if bool exists
    if (!ativo) {
        console.log("factoryUsuario: ativo não foi informado");
        return null
    }
    */

    if (!nome) {
        console.log("factoryUsuario: nome não foi informado(a)");
        return null
    }

    if (!data_nascimento) {
        console.log("factoryUsuario: data_nascimento não foi informado(a)");
        return null
    }

    if (!email) {
        console.log("factoryUsuario: email não foi informado(a)");
        return null
    }

    if (!senha) {
        console.log("factoryUsuario: senha não foi informado(a)");
        return null
    }

    if (!tipo) {
        console.log("factoryUsuario: tipo não foi informado(a)");
        return null
    }

    if (!cpf_cnpj) {
        console.log("factoryUsuario: cpf_cnpj não foi informado(a)");
        return null
    }

    if (!cidade) {
        console.log("factoryUsuario: cidade não foi informado(a)");
        return null
    }

    if (!biografia) {
        console.log("factoryUsuario: biografia não foi informado(a)");
        return null
    }

    if (!contatos) {
        console.log("factoryUsuario: contatos não foi informado(a)");
        return null
    }

    let usuario = {};

    Object.assign(usuario, StructUsuarios)

    delete usuario.id;
    usuario.ativo = ativo;
    usuario.nome = nome;
    usuario.data_nascimento = data_nascimento;
    usuario.email = email;
    usuario.senha = senha;
    usuario.tipo = tipo;
    usuario.cpf_cnpj = cpf_cnpj;
    usuario.cidade = cidade;
    usuario.biografia = biografia;
    usuario.contatos = contatos;

    return validateUsuario(usuario);
}

/**
 * Validação da struct dos usuários
 * 
 * @param  {object} usuario Informações do usuários
 * @returns {object|null} Array com informações sobre os usuários
 */
export function validateUsuario(usuario) {
    // TODO: Check if is object

    // ID Opcional
    if (usuario.id && typeof (usuario.id) != "string") {
        console.log("validateUsuario: id não é valido(a)")
        return null
    }

    if (typeof (usuario.ativo) != "boolean") {
        console.log("validateUsuario: ativo não é valido(a)")
        return null
    }

    if (typeof (usuario.nome) != "string") {
        console.log("validateUsuario: nome não é valido(a)")
        return null
    }

    if (typeof (usuario.data_nascimento) != "string") {
        console.log("validateUsuario: data_nascimento não é valido(a)")
        return null
    }

    if (typeof (usuario.email) != "string") {
        console.log("validateUsuario: email não é valido(a)")
        return null
    }

    if (typeof (usuario.senha) != "string") {
        console.log("validateUsuario: senha não é valido(a)")
        return null
    }

    if (typeof (usuario.tipo) != "string") {
        console.log("validateUsuario: tipo não é valido(a)")
        return null
    }

    if (typeof (usuario.cpf_cnpj) != "string") {
        console.log("validateUsuario: cpf_cnpj não é valido(a)")
        return null
    }

    if (typeof (usuario.cidade) != "string") {
        console.log("validateUsuario: cidade não é valido(a)")
        return null
    }

    if (typeof (usuario.biografia) != "string") {
        console.log("validateUsuario: biografia não é valido(a)")
        return null
    }

    if (typeof (usuario.contatos) != "object") {
        console.log("validateUsuario: contatos não é valido(a)")
        return null
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
        console.log("readUsuarios: nulo");
        return null
    }

    if (!Array.isArray(usuarios_id)) {
        console.log("readUsuarios: não é um array");
        return null
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
 * @returns {Number | null} ID do último usuário cadastrado 
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
    if (!usuario_id)
        return null

    if (typeof (usuario_id) != "number")
        return null

    // Verifica se as informações do usuário são validas
    if (!validateUsuario(usuario_new))
        return null

    let usuarios = readUsuarios();

    if (!usuarios)
        return null

    usuarios.forEach((usuario, index, object) => {
        if (usuario_id === parseInt(usuario.id)) {
            // Remove o usuário da lista
            usuarios.splice(index, 1);
            // Adiciona o usuário com as novas informações
            object.push(usuario_new);
        }
    })

    setUsuarios(usuarios);

    return true;
}

/**
 * Deleta as informações de um usuário utilizando a ID
 *  
 * @param {Number} usuario_id ID do usuário a ser atualizado
 * @returns {boolean | null} Retorna true se as informações foram encontradas e deletadas 
 */
export function deleteUsuario(usuario_id) {
    // TODO: Receber array

    if (!usuario_id)
        return null

    if (typeof (usuario_id) != "number")
        return null

    let usuarios = readUsuarios();

    if (!usuarios)
        return null

    let encontrado = false;
    usuarios.forEach((usuario, index) => {
        if (usuario_id === parseInt(usuario.id)) {
            // Remove o usuário da lista
            usuarios.splice(index, 1);
            // TODO: break forEach
            encontrado = true;
        }
    })

    setUsuarios(usuarios);

    return encontrado;
}

/**
 * Limpa todas as informações de um usuário do localStorage
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
        console.log("createUsuario: Não há argumentos");
        return null
    }

    let usuarios = readUsuarios();

    // Verifica se as informações no usuário são validas
    if (!validateUsuario(usuario_new)) {
        console.log("createUsuario: Não foi possível validar os argumentos");
        return null
    }

    if (!usuarios)
        usuarios = []

    usuario_new.id = getIdLastUsuario()
    if (typeof (usuario_new.id) != "number")
        return null

    // Incrementa a ID
    usuario_new.id += 1;

    usuarios.push(usuario_new);

    setUsuarios(usuarios);

    return usuario_new.id;
}