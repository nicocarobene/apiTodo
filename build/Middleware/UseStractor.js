"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseStractor = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoConect_1 = require("../src/mongoConect");
const UseStractor = (req, resp, next) => {
    const { authorization } = req.headers;
    let token = null;
    if (authorization === null || authorization === void 0 ? void 0 : authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, mongoConect_1.SECRET_WORD);
    if (!token || !decodedToken) {
        return resp.status(401).json({ error: 'somesing' });
    }
    req.username = decodedToken.username;
    next();
};
exports.UseStractor = UseStractor;
