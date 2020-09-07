import { Audit } from "./Diff";

function toJSON(objeto: any): string {
    return JSON.stringify(objeto, null, 4);
}

const de = {
    id: 1,
    nome: "renato",
    idade: 25,
    updatedAt: "2020-09-01T04:14:38.594Z",
    jogos: [
        {
            id: 1,
            nome: "SimCity 4"
        }
    ]
}

const para = {
    id: 1,
    nome: "Renatinho",
    profissao: "programador",
    updatedAt: "2020-09-07T04:14:38.594Z",
    jogos: [
        {
            id: 1,
            nome: "SimCity 2013",
            fodase: "tem que aparecer essa porra"
        }
    ]
}

const audit = new Audit({
    ignore: ["id"],
    options: [
        {
            key: "idade",
            title: "Idade"
        },
        {
            key: "updatedAt",
            customFormater: (updatedAt) => "fodase"
        },
        {
            key: "profissao",
            title: "Profissão do pião"
        },
        {
            key: "jogos",
            arrayOptions: {
                key: "id",
                name: "nome"
            }
        }
    ]
});

console.log(toJSON(audit.diff(de, para)));
