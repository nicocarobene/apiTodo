"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.MONGO_CONECT)
    .then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error(err);
});
process.on('uncaughtException', error => {
    console.error(error);
    void mongoose_1.default.disconnect();
});
