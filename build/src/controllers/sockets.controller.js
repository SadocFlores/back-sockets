"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../lib/logger"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("config"));
class SocketIO {
    constructor(server) {
        this.clients = [];
        this.io = server;
        this.io.use((socket, next) => {
            const token = (socket.handshake.headers.authorization ? socket.handshake.headers.authorization : '');
            jsonwebtoken_1.verify(token, config_1.default.get('jwt.accessTokenSecret'), (err, decoded) => {
                if (err) {
                    const err = new Error("token error");
                    socket.disconnect;
                    return next(err);
                }
                decoded.user.socket = socket;
                let client = decoded.user;
                const clientFound = this.getClientByEmail(client.email);
                if (clientFound) {
                    const err = new Error("Currently logged in user");
                    socket.disconnect;
                    return next(err);
                }
                this.clients.push(client);
                next();
            });
        });
        this.listenSockets();
    }
    listenSockets() {
        this.io.on('connection', (client) => {
            const clientFound = this.getDataClient(client.id);
            clientFound && logger_1.default.info(`el cliente ${clientFound.email} se ha conectado`);
            client.emit('clientOnLine', { clients: this.clients.length });
            this.clientWritting(client.id);
            this.disconnectClient(clientFound);
            this.receiveMessage(client);
        });
    }
    getDataClient(socketId) {
        const clientFound = this.clients.find(client => client.socket.id === socketId);
        return clientFound;
    }
    getClientByEmail(email) {
        const clientFound = this.clients.find(client => client.email === email);
        if (clientFound) {
            return true;
        }
        else {
            return false;
        }
    }
    removeClientFromList(socketId) {
        const clientFound = this.clients.findIndex(client => client.socket.id === socketId);
        return this.clients.splice(clientFound, 1);
    }
    disconnectClient(client) {
        return client.socket.on('disconnect', () => {
            this.removeClientFromList(client.socket.id);
            console.log(this.clients);
            logger_1.default.info(`el cliente ${client.email} se fue`);
        });
    }
    clientWritting(socketId) {
        this.io.on('clientWritting', () => {
            const client = this.getClientByEmail(socketId);
            this.io.emit('clientWritting', ({
                email: ""
            }));
        });
    }
    receiveMessage(client) {
        client.on('sendMessage', (message) => {
            const clientData = this.getDataClient(client.id);
            if (clientData) {
                //this.io.emit('receiveMessage', { sender: clientData.email, message: message })  
                client.broadcast.emit('receiveMessage', { sender: clientData.email, message: message });
            }
        });
    }
}
exports.default = SocketIO;
