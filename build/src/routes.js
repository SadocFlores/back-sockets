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
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
const authRoutes = express_1.Router();
const userCtrl = new user_controller_1.default();
authRoutes.get('/getUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userCtrl.getUsers();
        return res.status(response.code).json(response);
    }
    catch (err) {
        return res.status(err.code ? err.code : 500).json(err);
    }
}));
authRoutes.post('/createUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    try {
        const response = yield userCtrl.createUser(user);
        return res.status(response.code).json(response);
    }
    catch (err) {
        return res.status(err.code ? err.code : 500).json(err);
    }
}));
authRoutes.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body.user;
    //const updatedUser = req.body.user
    try {
        const response = yield userCtrl.updateUser(email);
        return res.status(response.code).json(response);
    }
    catch (err) {
        return res.status(err.code ? err.code : 500).json(err);
    }
}));
authRoutes.delete('/delete/:_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query._id;
    try {
        const response = yield userCtrl.deleteUser(_id);
        return res.status(response.code).json(response);
    }
    catch (err) {
        return res.status(err.code ? err.code : 500).json(err);
    }
}));
authRoutes.get('/getUserByEmail/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        const response = yield userCtrl.getUserByEmail(email);
        return res.status(response.code).json(response);
    }
    catch (err) {
        return res.status(err.code ? err.code : 500).json(err);
    }
}));
authRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const response = yield userCtrl.loginUser(email, password);
        return res.status(response.code).json(response);
    }
    catch (err) {
        return res.status(err.code ? err.code : 500).json(err);
    }
}));
exports.default = authRoutes;
