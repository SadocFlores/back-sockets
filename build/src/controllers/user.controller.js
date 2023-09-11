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
const user_model_1 = __importDefault(require("../models/user.model"));
const adencrypt_1 = __importDefault(require("../class/adencrypt"));
class UserController {
    constructor() {
        this.encrypt = new adencrypt_1.default;
        this.activeSessions = {};
    }
    createUser(user) {
        return new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (user.password) {
                        const { salt, passwordHash } = this.encrypt.genPassword(user.password);
                        user.password = passwordHash;
                        user.salt = salt;
                    }
                    else {
                        return reject({ ok: false, message: 'bad request', response: null, code: 400 });
                    }
                    const userCreated = yield user_model_1.default.create(user);
                    let userSended = userCreated;
                    userSended.password = '';
                    userSended.salt = '';
                    return resolve({ ok: true, message: 'user created', response: userSended, code: 201 });
                }
                catch (err) {
                    return reject({ ok: false, message: 'error ocurred', response: err, code: 500 });
                }
            }))();
        });
    }
    getUsers() {
        return new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const usersDB = yield user_model_1.default.find({});
                    if (usersDB.length < 1) {
                        return reject({ ok: false, message: 'dont have users', response: null, code: 404 });
                    }
                    const response = {
                        users: usersDB,
                        total: usersDB.length
                    };
                    return resolve({ ok: true, message: 'users recovered', response: response, code: 200 });
                }
                catch (err) {
                    return reject({ ok: false, message: 'error ocurred', response: err, code: 500 });
                }
            }))();
        });
    }
    updateUser(user) {
        return new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userUpdated = yield user_model_1.default.findOneAndUpdate({ email: user.email }, user, { returnDocument: 'after', select: '-salt -password' });
                    if (!userUpdated) {
                        return reject({ ok: false, message: 'user dont found', response: null, code: 404 });
                    }
                    return resolve({ ok: true, message: 'user updated', response: userUpdated, code: 200 });
                }
                catch (err) {
                    return reject({ ok: false, message: 'server error', response: err, code: 500 });
                }
            }))();
        });
    }
    deleteUser(id) {
        return new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userDeleted = yield user_model_1.default.findByIdAndDelete(id, { select: '-salt -password' });
                    if (!userDeleted) {
                        return reject({ ok: false, message: `user with id ${id} dont exist`, response: null, code: 404 });
                    }
                    return resolve({ ok: true, message: 'user deleted', response: userDeleted, code: 200 });
                }
                catch (err) {
                    return reject({ ok: false, message: 'server error', response: err, code: 500 });
                }
            }))();
        });
    }
    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userFinded = yield user_model_1.default.findOne({ email: email }).select('name lastname email');
                    if (!userFinded) {
                        return reject({ ok: false, message: 'user dont exist', response: null, code: 404 });
                    }
                    return resolve({ ok: true, message: 'user found', response: userFinded, code: 200 });
                }
                catch (err) {
                    return reject({ ok: false, message: 'server error', response: err, code: 500 });
                }
            }))(); // IIFE Immendiately Invoked Function Expression
        });
    }
    loginUser(email, password) {
        return new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userFinded = yield user_model_1.default.findOne({ email: email });
                    if (userFinded) {
                        const { passwordHash } = this.encrypt.saltHashPassword(password, userFinded.salt);
                        if (passwordHash === userFinded.password) {
                            // if(this.activeSessions[email]){
                            //     return reject ( {ok: false, message: 'Already login', response: null, code: 401} )
                            // }
                            let userToken = this.removeSensiteveData(userFinded);
                            const token = yield this.encrypt.genToken(userToken);
                            this.activeSessions[email] = token;
                            return resolve({ ok: true, message: 'login successfull', response: null, code: 200, token: token });
                        }
                        else {
                            return reject({ ok: false, message: 'bad request', response: null, code: 401 });
                        }
                    }
                    else {
                        return reject({ ok: false, message: 'user dont exist', response: null, code: 404 });
                    }
                }
                catch (err) {
                    return reject({ ok: false, message: 'bad request', response: err, code: 500 });
                }
            }))();
        });
    }
    removeSensiteveData(user) {
        let objUser = user.toObject();
        delete objUser.password;
        delete objUser.salt;
        return objUser;
    }
}
exports.default = UserController;
