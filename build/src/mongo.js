"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoConect_1 = require("./mongoConect");
mongoose_1.default.connect(mongoConect_1.MONGO_CONECT)
    .then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error(err);
});
process.on('uncaughtException', error => {
    console.error(error);
    void mongoose_1.default.disconnect();
});
