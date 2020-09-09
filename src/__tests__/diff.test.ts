import { Diff, Audit, DiffType, AuditKeyOptions } from "../Diff";

describe("testar auditoria", () => {

    it("deve detectar mudanças simples", () => {

        const expectedDiffs: Diff[] = [
            {
                key: "nome",
                from: "Renato",
                to: "Renatinho"
            }
        ];

        const audit = new Audit();

        const from = {
            id: 1,
            nome: "Renato"
        }

        const to = {
            id: 1,
            nome: "Renatinho"
        }

        const diffs = audit.diff(from, to);

        expect(diffs).toEqual(expectedDiffs);
    });

    it("deve detectar mudanças no array", () => {

        const expectedDiffs: Diff[] = [
            {
                key: "nome",
                from: "Fulano da silva",
                to: "Fulano"
            },
            {
                key: "empresa",
                type: DiffType.MODIFIED,
                details: [
                    {
                        key: "nome",
                        from: "Algum lugar",
                        to: "Outro lugar"
                    },
                    {
                        key: "cnpj",
                        from: "12345678910",
                        to: "10987654321"
                    }
                ]
            },
            {
                key: "permissoes",
                type: DiffType.ARRAY,
                details: [
                    {
                        key: "ADMINISTRADOR",
                        type: DiffType.MODIFIED,
                        details: [
                            {
                                key: "nome",
                                from: "ADMINISTRADOR",
                                to: "SUPER_USER"
                            }
                        ]
                    },
                    {
                        key: "PROGRAMADOR",
                        type: DiffType.NEW,
                        details: [
                            {
                                key: "nome",
                                from: null,
                                to: "PROGRAMADOR"
                            }
                        ]
                    },
                    {
                        key: "USUARIO",
                        type: DiffType.REMOVED,
                        details: [
                            {
                                key: "nome",
                                from: "USUARIO",
                                to: null
                            }
                        ]
                    },
                ]
            }
        ];

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

        const from = {
            id: 1,
            nome: "Fulano da silva",
            empresa: {
                id: 1,
                nome: "Algum lugar",
                cnpj: "12345678910"
            },
            "permissoes": [
                {
                    id: 1,
                    nome: "ADMINISTRADOR"
                },
                {
                    id: 2,
                    nome: "USUARIO"
                }
            ]
        }

        const to = {
            id: 1,
            nome: "Fulano",
            empresa: {
                id: 2,
                nome: "Outro lugar",
                cnpj: "10987654321"
            },
            permissoes: [
                {
                    id: 1,
                    nome: "SUPER_USER"
                },
                {
                    id: 4,
                    nome: "PROGRAMADOR"
                }
            ]
        }

        const diffs = audit.diff(from, to);

        expect(diffs).toEqual(expectedDiffs);
    });

    it("não devem aparecer mudanças feitas em chaves ignoradas", () => {

        const expectedResult = [];

        const ignore = ["id", "nome", "idade"];

        const audit = new Audit({ ignore });

        const de = {
            id: 1,
            nome: "renato",
            idade: 25
        };

        const para = {
            id: 2,
            nome: null,
            idade: 20
        };

        const result = audit.diff(de, para);

        expect(result).toEqual(expectedResult);
    })

    it("deve aparecer com um nome diferente na diff", () => {

        const expectedResult: Diff[] = [
            {
                key: "Nome de usuario",
                from: "renato",
                to: "renatinho"
            }
        ];

        const options: AuditKeyOptions[] = [{ key: "nome", title: "Nome de usuario" }];

        const audit = new Audit({ options });

        const de = {
            id: 1,
            nome: "renato",
            idade: 25
        };

        const para = {
            id: 1,
            nome: "renatinho",
            idade: 25
        };

        const result = audit.diff(de, para);

        expect(result).toEqual(expectedResult);
    })

    it("deve detectar romeção de objeto no array", () => {

        const expectedResult: Diff[] = [
            {
                key: "roles",
                type: DiffType.ARRAY,
                details: [
                    {
                        type: DiffType.REMOVED,
                        key: "ADMIN",
                        details: [
                            {
                                key: "nome",
                                from: "ADMIN",
                                to: null
                            }
                        ]
                    }
                ]
            }
        ];

        const options: AuditKeyOptions[] = [
            { 
                key: "roles",
                arrayOptions: {
                    name: "nome"
                }
            }
        ];

        const audit = new Audit({ ignore: ["id"], options });

        const de = {
            id: 1,
            nome: "renato",
            roles: [
                {
                    id: 1,
                    nome: "ADMIN"
                }
            ]
        };

        const para = {
            id: 1,
            nome: "renato",
            roles: []
        };

        const result = audit.diff(de, para);

        expect(result).toEqual(expectedResult);
    })
})