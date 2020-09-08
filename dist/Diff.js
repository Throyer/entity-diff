"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audit = exports.DiffType = void 0;
var utils_1 = require("./utils");
var DiffType;
(function (DiffType) {
    DiffType["NEW"] = "NEW";
    DiffType["MODIFIED"] = "MODIFIED";
    DiffType["REMOVED"] = "REMOVED";
    DiffType["ARRAY"] = "ARRAY";
})(DiffType = exports.DiffType || (exports.DiffType = {}));
var Audit = /** @class */ (function () {
    function Audit(_a) {
        var _b = _a === void 0 ? { ignore: [], options: [] } : _a, ignore = _b.ignore, options = _b.options;
        this.ignore = ignore !== null && ignore !== void 0 ? ignore : [];
        this.options = options !== null && options !== void 0 ? options : [];
    }
    Audit.prototype.diff = function (from, to) {
        var _this = this;
        var root = [];
        return Object.keys(__assign(__assign({}, from), to))
            .filter(function (key) { return _this.hasDiff(from, to, key); })
            .reduce(function (diffs, key) { return _this.deepDiffs(diffs, from[key], to[key], key); }, root);
    };
    Audit.prototype.deepDiffs = function (diffs, from, to, key) {
        if (utils_1.isArray(from, to)) {
            return this.addArrayDiff(diffs, from, to, key);
        }
        if (utils_1.isObject(from, to)) {
            return this.addObjectDiff(diffs, from, to, key);
        }
        return this.addSimpleAudit(diffs, from, to, key);
    };
    Audit.prototype.addSimpleAudit = function (diffs, from, to, key) {
        var _a;
        var options = this.findKeyOptions(key);
        var diff = {
            key: (_a = options === null || options === void 0 ? void 0 : options.title) !== null && _a !== void 0 ? _a : key,
            from: from !== null && from !== void 0 ? from : null,
            to: to !== null && to !== void 0 ? to : null
        };
        if ((options === null || options === void 0 ? void 0 : options.customFormatter) && from) {
            diff.from = options.customFormatter(from);
        }
        if ((options === null || options === void 0 ? void 0 : options.customFormatter) && to) {
            diff.to = options.customFormatter(to);
        }
        diffs.push(diff);
        return diffs;
    };
    Audit.prototype.addObjectDiff = function (diffs, from, to, key) {
        var _a;
        var objectDiffs = this.diff(from, to);
        if (objectDiffs && objectDiffs.length) {
            var options = this.findKeyOptions(key);
            diffs.push({
                key: (_a = options === null || options === void 0 ? void 0 : options.title) !== null && _a !== void 0 ? _a : key,
                type: this.diffTypeDiscover(from, to),
                details: objectDiffs,
            });
        }
        return diffs;
    };
    Audit.prototype.addArrayDiff = function (diffs, from, to, key) {
        var _a;
        var arrayDiffs = this.arrayDetails(from, to, key);
        if (arrayDiffs && arrayDiffs.length) {
            var options = this.findKeyOptions(key);
            diffs.push({
                key: (_a = options === null || options === void 0 ? void 0 : options.title) !== null && _a !== void 0 ? _a : key,
                type: DiffType.ARRAY,
                details: arrayDiffs,
            });
        }
        return diffs;
    };
    Audit.prototype.arrayDetails = function (from, to, key) {
        if (!from) {
            from = utils_1.copySkeleton(from);
        }
        var modified = this.findModifiedDiffs(from, to, key);
        var add = this.findDiffsFromLeftToRight(to, from, key, DiffType.NEW);
        var remove = this.findDiffsFromLeftToRight(from, to, key, DiffType.REMOVED);
        return __spreadArrays(modified, add, remove);
    };
    Audit.prototype.findModifiedDiffs = function (right, left, key) {
        var _this = this;
        var root = [];
        return right.reduce(function (modified, item) {
            var _a, _b, _c;
            var options = _this.findKeyOptions(key);
            if (options === null || options === void 0 ? void 0 : options.arrayOptions) {
                var leftItem = _this.findItemInAnotherArray(left, item, (_a = options.arrayOptions.key) !== null && _a !== void 0 ? _a : "id");
                if (leftItem && item !== leftItem) {
                    var diffs = _this.diff(item, leftItem);
                    if (diffs && diffs.length) {
                        var diff = {
                            key: (_c = item[(_b = options === null || options === void 0 ? void 0 : options.arrayOptions) === null || _b === void 0 ? void 0 : _b.name]) !== null && _c !== void 0 ? _c : key,
                            type: DiffType.MODIFIED,
                            details: diffs,
                        };
                        return __spreadArrays(modified, [diff]);
                    }
                }
            }
            return modified;
        }, root);
    };
    Audit.prototype.findDiffsFromLeftToRight = function (right, left, key, type) {
        var _this = this;
        var root = [];
        return right.reduce(function (modified, item) {
            var _a, _b, _c;
            var options = _this.findKeyOptions(key);
            if (options === null || options === void 0 ? void 0 : options.arrayOptions) {
                var notExists = _this.notExistInAnotherArray(left, item, (_a = options.arrayOptions.key) !== null && _a !== void 0 ? _a : "id");
                var diffs = [];
                if (notExists && type === DiffType.NEW) {
                    diffs = _this.diff(utils_1.copySkeleton(item), item);
                }
                if (notExists && type === DiffType.REMOVED) {
                    diffs = _this.diff(item, utils_1.copySkeleton(item));
                }
                if (diffs.length) {
                    var diff = {
                        key: (_c = item[(_b = options === null || options === void 0 ? void 0 : options.arrayOptions) === null || _b === void 0 ? void 0 : _b.name]) !== null && _c !== void 0 ? _c : key,
                        type: type,
                        details: diffs,
                    };
                    return __spreadArrays(modified, [diff]);
                }
            }
            return modified;
        }, root);
    };
    Audit.prototype.findKeyOptions = function (key) {
        return this.options.find(function (_a) {
            var option = _a.key;
            return option === key;
        });
    };
    Audit.prototype.findItemInAnotherArray = function (array, itemFromAnother, key) {
        return array.find(function (item) { return item[key] === itemFromAnother[key]; });
    };
    Audit.prototype.notExistInAnotherArray = function (array, itemFromAnother, key) {
        return array.every(function (item) { return item[key] !== itemFromAnother[key]; });
    };
    Audit.prototype.hasDiff = function (from, to, key) {
        return (from[key] !== to[key]) && !this.ignore.includes(key);
    };
    Audit.prototype.diffTypeDiscover = function (from, to) {
        if ((from !== null) && (to !== null)) {
            return DiffType.MODIFIED;
        }
        if ((from !== null) && (to === null)) {
            return DiffType.REMOVED;
        }
        if ((from === null) && (to !== null)) {
            return DiffType.NEW;
        }
    };
    return Audit;
}());
exports.Audit = Audit;
