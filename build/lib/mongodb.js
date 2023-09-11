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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
class MongoConn {
    constructor() {
        this.connectDB();
        this.mongoConn = mongoose_1.default.connection;
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            mongoose_1.default.set('strictQuery', false);
            mongoose_1.default.set('bufferCommands', true);
            try {
                yield mongoose_1.default.connect(`${config_1.default.get('mongodb.url')}/${config_1.default.get('mongodb.database')}`, config_1.default.get('mongodb.options'));
                logger_1.default.info(`Connected to database ${config_1.default.get('mongodb.database')}`);
            }
            catch (err) {
                return logger_1.default.error(`Error in database ${err}`);
            }
        });
    }
}
exports.default = MongoConn;
