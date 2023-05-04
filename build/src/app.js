"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../ModelDB/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UseStractor_1 = require("../Middleware/UseStractor");
const Todo_1 = __importDefault(require("../ModelDB/Todo"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoConect_1 = require("./mongoConect");
require('./mongo');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, resp) => {
    resp.send('<h1>Hola</h1>');
});
app.post('/', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, email, password } = req.body;
    if (!(username && name && password)) {
        return resp.status(400).json({ error: 'the user required a username, name and password, pleas fill de input required' });
    }
    const isAlreadyuser = yield User_1.default.findOne({ username });
    if (isAlreadyuser) {
        return resp.status(400).json({ error: 'user is already exist' });
    }
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    const newuser = {
        username,
        name,
        email,
        passwordHash
    };
    console.log(newuser);
    const user = yield User_1.default.create(newuser);
    user.save()
        .then(savedUser => {
        const { email, name, passwordHash, _id, username } = savedUser;
        const newuser = {
            email,
            name,
            password: passwordHash,
            id: _id,
            username
        };
        resp.json(newuser);
    })
        .catch(e => { console.log(e); });
}));
app.post('/toDo', UseStractor_1.UseStractor, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, completed } = req.body;
    const { username } = req;
    const user = yield User_1.default.findOne({ username });
    if (!user)
        return resp.status(400).json({ error: 'something west wrong' });
    const newTodo = yield Todo_1.default.create({
        title,
        completed
    });
    const safeTodo = yield newTodo.save();
    const todoResp = {
        id: safeTodo._id,
        title: safeTodo.title,
        completed: safeTodo.completed
    };
    user.todos = [...user.todos, safeTodo._id];
    console.log(safeTodo._id);
    yield user.save();
    resp.json(todoResp);
}));
app.get('/togglecompleted/:id', UseStractor_1.UseStractor, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const todo = yield Todo_1.default.findById(new mongoose_1.default.Types.ObjectId(id));
    if (!todo)
        return resp.status(400).json({ error: 'the id is wrong' });
    todo.completed = !todo.completed;
    yield todo.save();
    resp.status(200).json(todo);
}));
app.delete('/:id', UseStractor_1.UseStractor, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req;
    if (!username)
        return resp.status(400).json('username or password is invalideted');
    const { id } = req.params;
    if (!id)
        return resp.status(400).json({ error: 'id is required' });
    const idTodelete = yield Todo_1.default.findOneAndDelete(new mongoose_1.default.Types.ObjectId(id));
    resp.status(200).json(idTodelete);
}));
app.post('/login', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username && !password)
        return resp.status(400).json({ Error: "username and password don't exist" });
    const user = yield User_1.default.findOne({ username })
        .populate('todos', {
        title: 1,
        completed: 1
    });
    if (user === null) {
        return resp.status(400).json({
            error: 'Invalid credential'
        });
    }
    const passwordCorrect = yield bcrypt_1.default.compare(password, user.passwordHash);
    if (!(user && passwordCorrect)) {
        return resp.status(400).json({
            error: 'invalid user or password'
        });
    }
    const userForToken = {
        username: user.username,
        id: user._id
    };
    const token = jsonwebtoken_1.default.sign(userForToken, mongoConect_1.SECRET_WORD, {
        expiresIn: 60 * 60 * 24 * 7
    });
    const todos = user.todos.map((todo) => {
        return {
            id: todo._id,
            title: todo.title,
            completed: todo.completed
        };
    });
    resp.status(200).json({
        username: user.username,
        name: user.name,
        todos,
        token,
        message: 'todo salio perfecto'
    });
}));
exports.default = app;
