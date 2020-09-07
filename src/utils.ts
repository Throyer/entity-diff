const TYPE_OBJECT = "object";
const TYPE_STRING = "string";

export function copySkeleton(source: any): any {
    const VALORES_DEFAULT = {
        string: null,
        number: null,
        boolean: null
    }
    const objeto = Array.isArray(source) ? [] : {};
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            const tipo = typeof source[key];
            objeto[key] = tipo == TYPE_OBJECT ? copySkeleton(source[key]) :
                VALORES_DEFAULT[tipo];
        }
    }
    return objeto;
}

export function isObject(left: any, right: any): boolean {
    return typeof left === TYPE_OBJECT && !Array.isArray(left) &&
        typeof right === TYPE_OBJECT && !Array.isArray(right)
}

export function isArray(left: any, right: any): boolean {
    return Array.isArray(left) && Array.isArray(right)
}

export function isString(left: any, right: any): boolean {
    return (typeof left === TYPE_STRING) &&
        (typeof right === TYPE_STRING);
}