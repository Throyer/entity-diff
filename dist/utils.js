"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = exports.isArray = exports.isObject = exports.copySkeleton = void 0;
var TYPE_OBJECT = "object";
var TYPE_STRING = "string";
function copySkeleton(source) {
    var VALORES_DEFAULT = {
        string: null,
        number: null,
        boolean: null
    };
    var objeto = Array.isArray(source) ? [] : {};
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var tipo = typeof source[key];
            objeto[key] = tipo == TYPE_OBJECT ? copySkeleton(source[key]) :
                VALORES_DEFAULT[tipo];
        }
    }
    return objeto;
}
exports.copySkeleton = copySkeleton;
function isObject(left, right) {
    return typeof left === TYPE_OBJECT && !Array.isArray(left) &&
        typeof right === TYPE_OBJECT && !Array.isArray(right);
}
exports.isObject = isObject;
function isArray(left, right) {
    return Array.isArray(left) && Array.isArray(right);
}
exports.isArray = isArray;
function isString(left, right) {
    return (typeof left === TYPE_STRING) &&
        (typeof right === TYPE_STRING);
}
exports.isString = isString;
