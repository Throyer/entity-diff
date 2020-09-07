import { copySkeleton, isArray, isObject } from "./utils";

export enum DiffType {
    NEW = "NOVO",
    MODIFIED = "EDITADO",
    REMOVED = "REMOVIDO"
}

interface AuditProps {
    ignore?: string[];
    options?: AuditKeyOptions[];
}

export interface AuditKeyOptions {
    key: string;
    title?: string;
    customFormater?: (object: any) => string;
    arrayOptions?: {
        key: string;
        name?: string;
    }
}

export interface Diff {
    key: string;
    from?: string;
    to?: string;
    details?: Diff[];
    type?: DiffType;
}

export class Audit {

    private ignore: string[];
    private options: AuditKeyOptions[];

    constructor({ ignore, options }: AuditProps) {
        this.ignore = ignore;
        this.options = options;
    }

    public diff(from: any, to: any): Diff[] {

        const root: Diff[] = [];

        return Object.keys({ ...from, ...to })
            .filter(key => this.hasDiff(from, to, key))
            .reduce((diffs, key) => this.deepDiffs(
                diffs,
                from[key],
                to[key],
                key), root);
    }

    private deepDiffs(diffs: Diff[], de: any, para: any, key: string) {
        
        if (isArray(de, para)) {
            return this.addArrayDiff(diffs, de, para, key);
        }

        if (isObject(de, para)) {
            return this.addObjectDiff(diffs, de, para, key)
        }

        return this.addSimpleAudit(diffs, de, para, key);
    }

    private addSimpleAudit(diffs: Diff[], from: any, to: any, key: string): Diff[] {

        const options = this.findKeyOptions(key);

        let diff: Diff = {
            key: options?.title ?? key,
            from: from ?? null,
            to: to ?? null
        };

        if (options?.customFormater && from) {
            diff.from = options.customFormater(from);
        }

        if (options?.customFormater && to) {
            diff.to = options.customFormater(to);
        }
        
        diffs.push(diff);

        return diffs;
    }

    private addObjectDiff(diffs: Diff[], from: any, to: any, key: string): Diff[] {

        const objectDiffs = this.diff(from, to);

        if (objectDiffs && objectDiffs.length) {
            const { title } = this.findKeyOptions(key);
            diffs.push({
                type: this.diffTypeFinder(from, to),
                key: title ?? key,
                details: objectDiffs
            })
        }

        return diffs;
    }

    private addArrayDiff(diffs: Diff[], from: any, to: any, key: string): Diff[] {

        const arrayDiffs = this.arrayDetails(from, to, key);

        if (arrayDiffs && arrayDiffs.length) {

            const { title } = this.findKeyOptions(key);

            diffs.push({
                details: arrayDiffs,
                key: title ?? key
            });
        }
        return diffs;
    }

    private arrayDetails(from: any, to: any, key: string): Diff[] {

        if (!from) {
            from = copySkeleton(from);
        }

        return [
            ...this.findModifiedDiffs(from, to, key),
            ...this.findDiffsFromLeftToRight(from, to, key, DiffType.NEW),
            ...this.findDiffsFromLeftToRight(to, from, key, DiffType.REMOVED)
        ];
    }

    private findModifiedDiffs(right: any[], left: any[], key: string): Diff[] {

        const root: Diff[] = [];

        return right.reduce((modified, item) => {

            const options = this.findKeyOptions(key);

            if (options?.arrayOptions) {
                const leftItem = this.findItemInAnotherArray(left, item, key); 
                if (leftItem && item !== leftItem) {
                    const diffs = this.diff(item, leftItem);

                    if (diffs && diffs.length) {

                        const diff: Diff = {
                            key: item[options?.arrayOptions?.name] ?? key,
                            type: DiffType.MODIFIED,
                            details: diffs,
                        }

                        return [...modified, diff];
                    }
                }
            }

            return modified;

        }, root);
    }

    private findDiffsFromLeftToRight(right: any[], left: any[], key: string, type: DiffType) {

        const root: Diff[] = [];

        return right.reduce((modified, item) => {

            const options = this.findKeyOptions(key);

            if (options?.arrayOptions) {

                const notExists = this.notExistInAnotherArray(left, item, key);

                let diffs: Diff[] = [];
    
                if (notExists && type === DiffType.NEW) {
                    diffs = this.diff(copySkeleton(item), item);
                }
    
                if (notExists && type === DiffType.REMOVED) {
                    diffs = this.diff(item, copySkeleton(item));
                }
                    
                if (diffs.length) {
                    return [
                        ...modified,
                        {
                            key: options?.title ?? key,
                            type,
                            details: diffs, 
                        }
                    ]
                }
            }
            
            return modified;
        }, root)
    }

    private findKeyOptions(key: string): AuditKeyOptions | undefined {
        return this.options.find(({ key: option }) => option === key);
    }

    private findItemInAnotherArray(array: any[], itemFromAnother: any, key: string): any {
        return array.find(item => item[key] === itemFromAnother[key]);
    }

    private notExistInAnotherArray(array: any[], itemFromAnother: any, key: string): boolean {
        return array.every(item => item[key] !== itemFromAnother[key]);
    }

    private hasDiff(from: any, to: any, key: string) {
        return (from[key] !== to[key]) && !this.ignore.includes(key);
    }

    private diffTypeFinder(from: any, to: any): DiffType {

        if ((from !== null) && (to !== null)) {
            return DiffType.MODIFIED
        }

        if ((from !== null) && (to === null)) {
            return DiffType.REMOVED
        }

        if ((from === null) && (to !== null)) {
            return DiffType.NEW
        }
    }
}