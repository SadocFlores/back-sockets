"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, require: true, lowercase: true },
    lastname: { type: String, require: true, lowercase: true },
    email: { type: String, require: true, unique: true, lowercase: true },
    password: { type: String },
    salt: { type: String }
}, { collection: 'user' });
exports.default = mongoose_1.default.model('User', userSchema);
