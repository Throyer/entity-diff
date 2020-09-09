import { copySkeleton, isArray, isObject, isString } from "../utils";

describe("testar função de copy", () => {

    it("deve copiar a estrutura de um objeto simples", () => {

        const expectedObject = {
            id: null,
            idade: null,
            nome: null,
            cidade: {
                id: null,
                nome: null
            }
        }

        const pessoa = {
            id: 1,
            idade: 25,
            nome: "Renato",
            cidade: {
                id: 1,
                nome: "Cambé"
            }
        };

        const result = copySkeleton(pessoa);       

        expect(result).toEqual(expectedObject);
    });

    it("deve copiar a estrutura de um objeto com array", () => {

        const expected = { 
            id: null,
            nome: null,
            array: [
                {
                    id: null,
                    nome: null
                }
            ]
        }

        const result = copySkeleton({
            id: 1,
            nome: "renato",
            array: [
                {
                    id: 1,
                    nome: "prop"
                }
            ]
        });

        expect(result).toEqual(expected);
    })
})

describe("testar checkagem de tipos", () => {
    it("deve ser string", () => {
        
        const A = "A";
        const B = "B";

        expect(isString(A, B)).toEqual(true)
    })

    it("não deve ser string", () => {

        const A = 10;
        const B = "B";

        expect(isString(A, B)).toEqual(false);
    })

    it("deve ser array", () => {

        const A = ["A"];
        const B = ["B"];

        expect(isArray(A, B)).toEqual(true);
    })

    it("não deve ser array", () => {

        const A = ["A"];
        const B = "B";

        expect(isArray(A, B)).toEqual(false);
    })

    it("deve ser object", () => {
        const A = { a: "A" };
        const B = { b: "B" };

        expect(isObject(A, B)).toEqual(true);
    })

    it("não deve ser object", () => {

        const A = { a: "A" };
        const B = 10;

        expect(isObject(A, B)).toEqual(false);
    })
})