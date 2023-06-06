"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const referalbase = 25000;
const globals = {
    getRefCodeFromId(id) {
        return id + referalbase;
    },
    getIdFromRefCode(refcode) {
        return refcode - referalbase;
    }
};
exports.default = globals;
