export declare enum DiffType {
    NEW = "NEW",
    MODIFIED = "MODIFIED",
    REMOVED = "REMOVED",
    ARRAY = "ARRAY"
}
interface AuditProps {
    ignore?: string[];
    options?: AuditKeyOptions[];
}
export interface AuditKeyOptions {
    key: string;
    title?: string;
    customFormatter?: (object: any) => string;
    arrayOptions?: {
        key?: string;
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
    constructor({ ignore, options }?: AuditProps);
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
export {};
