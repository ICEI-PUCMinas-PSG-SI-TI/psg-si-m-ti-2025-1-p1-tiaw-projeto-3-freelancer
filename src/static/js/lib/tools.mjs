//@ts-check

export const MAX_ALLOWED_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

export function assertBase64ConvertableImage(file) {
    if (!file) throw new Error("Nenhum arquivo foi identificado!");

    if (file.size > MAX_ALLOWED_SIZE)
        throw new Error("O tamanho do arquivo deve ser menor que 5MB!");

    if (!/image.*/.exec(file.type)) throw new Error("O arquivo não é uma imagem!");
}

/**
 * @param {Blob} file
 */
export async function imageFileToBase64(file) {
    assertBase64ConvertableImage(file)

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
