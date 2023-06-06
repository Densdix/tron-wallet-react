"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; //Bearer tokenkey
        if (!token) {
            //Разобраться как вернуть 401 статус и обработать на клиенте
            return res.status(200).json({
                resultCode: 1,
                errorMessage: "No authorize",
                source: {}
            });
        }
        console.log("authMiddleware token: " + token);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        console.log("authMiddleware decoded token: " + decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        //Разобраться как вернуть 401 статус и обработать на клиенте
        res.status(200).json({
            resultCode: 1,
            errorMessage: "No authorize",
            source: {}
        });
    }
};
exports.default = authMiddleware;
