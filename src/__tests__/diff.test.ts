import { Diff, Audit } from "../Diff";

describe("testar auditoria", () => {

    it("deve detectar mudanças simples", () => {

        const expectedDiffs: Diff[] = [
            {
                key: "nome",
                from: "Renato",
                to: "Renatinho"
            }
        ];

        const audit = new Audit({ ignore: ["id"] });

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
})