"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const SocketIO = __importStar(require("socket.io"));
const simulation_1 = require("./simulation");
const port = 4000;
class App {
    constructor(port) {
        Object.defineProperty(this, "server", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "port", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "io", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "simu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.port = port;
        const app = (0, express_1.default)();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../../../pong')));
        this.server = new http.Server(app);
        this.io = new SocketIO.Server(this.server, {
            cors: {
                origin: 'http://10.12.12.2:3000',
                // origin: 'http://localhost:3000',
                credentials: true
            }
        });
        this.simu = new simulation_1.simulation(this.io, 1280, 720);
        this.io.on('connection', (socket) => {
            console.log('a user connected : ' + socket.id);
            const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
            const x = rand(50, 1280 - 50);
            const y = rand(50, 720 - 50);
            socket.emit('welcome', socket.id, x, y);
            socket.broadcast.emit('newPlayer', socket.id, x, y);
            for (let key in this.simu.balls) {
                socket.emit('newPlayer', this.simu.balls[key].id, this.simu.balls[key].xpos, this.simu.balls[key].ypos);
            }
            this.simu.add_ball(new simulation_1.Ball(socket.id, x, y, 50, 1));
            socket.on('thanks', function () {
                console.log('thanks from ' + socket.id);
            });
            socket.on('input', (id, xpos, ypos, nb, speed, move) => {
                console.log(nb);
                this.simu.balls[id].events[nb] = [xpos, ypos, speed, move];
            });
            socket.on('disconnect', () => {
                console.log('socket disconnected : ' + socket.id);
                socket.broadcast.emit('destroy', socket.id);
                delete this.simu.balls[socket.id];
            });
        });
    }
    Start() {
        this.server.listen(this.port);
        console.log(`Server listening on port ${this.port}.`);
    }
}
new App(port).Start();
