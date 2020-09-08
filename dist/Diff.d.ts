export declare enum DiffType {
    NEW = "NOVO",
    MODIFIED = "EDITADO",
    REMOVED = "REMOVIDO",
    ARRAY = "LISTA"
}
export interface AuditKeyOptions {
    key: string;
    title?: string;
    customFormater?: (object: any) => string;
    arrayOptions?: {
        key: string;
        name?: string;
    };
}
export interface Diff {
    key: string;
    from?: string;
    to?: string;
    details?: Diff[];
    type?: DiffType;
}
export declare class Audit {
    private ignore;
    private options;
    constructor(ignore?: string[], options?: AuditKeyOptions[]);
    diff(from: any, to: any): Diff[];
    private deepDiffs;
    private addSimpleAudit;
    private addObjectDiff;
    private addArrayDiff;
    private arrayDetails;
    private findModifiedDiffs;
    private findDiffsFromLeftToRight;
    private findKeyOptions;
    private findItemInAnotherArray;
    private notExistInAnotherArray;
    private hasDiff;
    private diffTypeDiscover;
}
