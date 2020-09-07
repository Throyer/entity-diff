import { Audit } from "./Diff";

function toJSON(objeto: any): string {
    return JSON.stringify(objeto, null, 4);
}

const de = {
    "id": 1,
    "nome": "Fulano da silva",
    "empresa": {
        "id": 1,
        "nome": "Algum lugar",
        "cnpj": "12345678910"
    },
    "permissoes": [
        {
            "id": 1,
            "nome": "ADMINISTRADOR"
        },
        {
            "id": 2,
            "nome": "USUARIO"
        }
    ]
}

const para = {
    "id": 1,
    "nome": "Fulano",
    "empresa": {
        "id": 2,
        "nome": "Outro lugar",
        "cnpj": "10987654321"
    },
    "permissoes": [
        {
            "id": 1,
            "nome": "SUPER_USER"
        },
        {
            "id": 4,
            "nome": "PROGRAMADOR"
        }
    ]
}

const audit = new Audit({
    ignore: ["id"],
    options: [
        {
            key: "permissoes",
            arrayOptions: {
                key: "id",
                name: "nome"
            }
        }
    ]
});

console.log(toJSON(audit.diff(de, para)));
