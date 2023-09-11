"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
class AdEncrypClass {
    genRandomString(length) {
        return crypto_1.default.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }
    getStringValue(data) {
        if (typeof data === 'number' || data instanceof Number) {
            return data.toString();
        }
        if (!Buffer.isBuffer(data) && typeof data !== 'string') {
            throw new TypeError('Los datos para generar contraseñas deber ser de tipo String o Buffer');
        }
        return data;
    }
    sha512(password, salt) {
        const hash = crypto_1.default.createHmac('sha512', this.getStringValue(salt));
        hash.update(this.getStringValue(password));
        const passwordHash = hash.digest('hex');
        return {
            salt,
            passwordHash
        };
    }
    genPassword(password) {
        const salt = this.genRandomString(16);
        return this.sha512(String(password), salt);
    }
    genResetPasswordToken(userId) {
        const text = JSON.stringify({ userId, valid: new Date().getTime() + `${config_1.default.get("crypto.auth_ttl")}` });
        const cipher = crypto_1.default.createCipher(config_1.default.get("crypto.auth_algorithm"), config_1.default.get("crypto.auth_secret"));
        let ciphered = cipher.update(text, config_1.default.get("crypto.auth_inputEncoding"), config_1.default.get("crypto.auth_outputEncoding"));
        ciphered += cipher.final(config_1.default.get("crypto.auth_outputEncoding"));
        return ciphered;
    }
    saltHashPassword(password, salt) {
        return this.sha512(String(password), salt);
    }
    genToken(user) {
        return new Promise((resolve, reject) => {
            const payload = {
                user
            };
            const privateKey = config_1.default.get('jwt.accessTokenSecret');
            const tokenLife = config_1.default.get('jwt.accessTokenLife');
            jsonwebtoken_1.default.sign(payload, privateKey, {
                expiresIn: tokenLife,
                algorithm: 'HS256'
            }, (err, token) => {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve(token);
                }
            });
        });
    }
}
exports.default = AdEncrypClass;
