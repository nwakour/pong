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
const matter_js_1 = __importDefault(require("matter-js"));
const http = __importStar(require("http"));
const SocketIO = __importStar(require("socket.io"));
const simulation_1 = require("./simulation");
const port = 4000;
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '../../../pong')));
const server = new http.Server(app);
const io = new SocketIO.Server(server, {
    cors: {
        // origin: 'http://10.12.12.2:3000',
        origin: 'http://localhost:3000',
        credentials: true
    }
});
const game = {};
// const check_collision = function(event : Matter.IEventCollision<Matter.Engine>, game : Game, sock : SocketIO.Socket) {
//     const pairs = event.pairs;
//         for (let i = 0; i < pairs.length; ++i) {
//             const pair = pairs[i];
//             if (pair.bodyA ===  game.ball.ball || pair.bodyB ===  game.ball.ball) {
//                 if (pair.bodyA ===  game.bar.bar || pair.bodyB ===  game.bar.bar) {
//                    const ev : [[number, number], [number, number], [string, number]] = [[ game.ball.ball.position.x,  game.ball.ball.position.y], [ game.ball.ball.velocity.x,  game.ball.ball.velocity.y], ["bar", new Date().getTime()]];
//                 //     game.ball.ev.push(ev);
//                     console.log(ev);
//                 }
//                 else if (pair.bodyA ===  game.walls["top"] || pair.bodyB ===  game.walls["top"]) {
//                    const ev : [[number, number], [number, number], [string, number]] = [[ game.ball.ball.position.x,  game.ball.ball.position.y], [ game.ball.ball.velocity.x,  game.ball.ball.velocity.y], ["top", new Date().getTime()]];
//                    sock.emit('update', ev);
//                    console.log(ev);
//                 }
//                 else if (pair.bodyA ===  game.walls["bottom"] || pair.bodyB ===  game.walls["bottom"]) {
//                     const ev : [[number, number], [number, number], [string, number]] = [[ game.ball.ball.position.x,  game.ball.ball.position.y], [ game.ball.ball.velocity.x,  game.ball.ball.velocity.y], ["bottom", new Date().getTime()]];
//                     sock.emit('update', ev);
//                     console.log(ev);
//                 }
//                 else if (pair.bodyA ===  game.walls["left"] || pair.bodyB ===  game.walls["left"]) {
//                     const ev : [[number, number], [number, number], [string, number]] = [[ game.ball.ball.position.x,  game.ball.ball.position.y], [ game.ball.ball.velocity.x,  game.ball.ball.velocity.y], ["left", new Date().getTime()]];
//                     sock.emit('update', ev);
//                     console.log(ev);
//                 }
//                 else if (pair.bodyA ===  game.walls["right"] || pair.bodyB ===  game.walls["right"]) {
//                     const ev : [[number, number], [number, number], [string, number]] = [[ game.ball.ball.position.x,  game.ball.ball.position.y], [ game.ball.ball.velocity.x,  game.ball.ball.velocity.y], ["right", new Date().getTime()]];
//                     sock.emit('update', ev);
//                     console.log(ev);
//                 }
//                 else
//                     console.log("collision with something else");
//             }
//         }
// }
const game_update = function (game) {
    if (game.lastframe === null) {
        game.lastframe = new Date().getTime();
        return;
    }
    const now = new Date().getTime();
    const diff = now - game.lastframe;
    game.lastframe = now;
    let py = game.bar.bar.position.y + (game.bar.mov * diff);
    if (py < 51)
        py = 51;
    else if (py > 669)
        py = 669;
    matter_js_1.default.Body.setVelocity(game.bar.bar, { x: 0, y: py - game.bar.bar.position.y });
    matter_js_1.default.Body.setPosition(game.bar.bar, { x: game.bar.bar.position.x, y: py });
    // if (game.bar.last !== 0 ||  game.bar.mov!==0 ) {
    //     // const ev : Snap = new Snap(, game.bar.bar.position.y, game.bar.bar.velocity.x, game.bar.bar.velocity.y, game.lastframe , game.bar.mov);
    //     sock.emit('update', game.bar.check_nb ,game.bar.bar.position.x, game.bar.bar.position.y, game.bar.bar.velocity.x, game.bar.bar.velocity.y, game.lastframe , game.bar.mov);
    //     game.bar.last = game.bar.mov;
    //     console.log(game.bar.check_nb ,game.bar.bar.position.x, game.bar.bar.position.y, game.bar.bar.velocity.x, game.bar.bar.velocity.y, game.lastframe , game.bar.mov);
    //     ++game.bar.check_nb;
    // }
};
io.on('connection', (socket) => {
    console.log('a user connected : ' + socket.id);
    socket.emit('welcome', 50, 300);
    game[socket.id] = new simulation_1.Game();
    const inter = setInterval(game_update.bind(this), 1000 / 60, game[socket.id]);
    socket.on('keydown', (key) => {
        if (key === 'ArrowUp') {
            game[socket.id].bar.mov = -1;
            game[socket.id].bar.key['ArrowUp'] = 1;
        }
        else if (key === 'ArrowDown') {
            game[socket.id].bar.mov = 1;
            game[socket.id].bar.key['ArrowDown'] = 1;
        }
        else
            return;
        game[socket.id].lastkeytime = new Date().getTime();
        socket.emit('update', game[socket.id].bar.check_nb, game[socket.id].bar.bar.position.x, game[socket.id].bar.bar.position.y, game[socket.id].bar.bar.velocity.x, game[socket.id].bar.bar.velocity.y, game[socket.id].lastkeytime, game[socket.id].bar.mov);
        game[socket.id].bar.last = game[socket.id].bar.mov;
        console.log(game[socket.id].bar.check_nb, game[socket.id].bar.bar.position.x, game[socket.id].bar.bar.position.y, game[socket.id].bar.bar.velocity.x, game[socket.id].bar.bar.velocity.y, game[socket.id].lastkeytime, game[socket.id].bar.mov);
        ++game[socket.id].bar.check_nb;
    });
    socket.on('keyup', (key) => {
        if (key === 'ArrowUp') {
            game[socket.id].bar.key['ArrowUp'] = 0;
            if (game[socket.id].bar.key['ArrowDown'] === 1)
                game[socket.id].bar.mov = 1;
            else
                game[socket.id].bar.mov = 0;
        }
        else if (key === 'ArrowDown') {
            game[socket.id].bar.key['ArrowDown'] = 0;
            if (game[socket.id].bar.key['ArrowUp'] === 1)
                game[socket.id].bar.mov = -1;
            else
                game[socket.id].bar.mov = 0;
        }
        else
            return;
        game[socket.id].lastkeytime = new Date().getTime();
        socket.emit('update', game[socket.id].bar.check_nb, game[socket.id].bar.bar.position.x, game[socket.id].bar.bar.position.y, game[socket.id].bar.bar.velocity.x, game[socket.id].bar.bar.velocity.y, game[socket.id].lastkeytime, game[socket.id].bar.mov);
        game[socket.id].bar.last = game[socket.id].bar.mov;
        console.log(game[socket.id].bar.check_nb, game[socket.id].bar.bar.position.x, game[socket.id].bar.bar.position.y, game[socket.id].bar.bar.velocity.x, game[socket.id].bar.bar.velocity.y, game[socket.id].lastkeytime, game[socket.id].bar.mov);
        ++game[socket.id].bar.check_nb;
    });
    // Matter.Events.on(game[socket.id].engine, 'collisionStart', (event) => { check_collision(event, game[socket.id], socket) });
    socket.on('disconnect', () => {
        console.log('socket disconnected : ' + socket.id);
        clearInterval(inter);
        matter_js_1.default.Runner.stop(game[socket.id].runner);
        delete game[socket.id];
    });
});
server.listen(port);
