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
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("../../lib/logger"));
const socket_io_1 = require("socket.io");
const sockets_controller_1 = __importDefault(require("../controllers/sockets.controller"));
class HttpServer {
    constructor() {
        this.port = config_1.default.get('api.port');
        this.app = express_1.default();
        this.httpServer = new http_1.default.Server(this.app);
        this.io = new socket_io_1.Server(this.httpServer, { cors: { origin: '*' } });
        // this.mongodb = MongoConn.instance
        this.ioServer = new sockets_controller_1.default(this.io);
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.httpServer.listen(this.port);
                logger_1.default.info(`Server run on port: ${this.port}`);
            }
            catch (err) {
                logger_1.default.error(`Error: ${err}`);
            }
        });
    }
}
exports.default = HttpServer;
