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
const crypto_1 = __importDefault(require("crypto"));
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
const games = new Map();
const links = new Map();
const pending_rooms = [];
io.on('connection', (socket) => {
    const check_collision = function (event) {
        console.log("collision");
        if (my_game !== undefined) {
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; ++i) {
                const pair = pairs[i];
                if (pair.bodyA === my_game.ball.ball || pair.bodyB === my_game.ball.ball) {
                    if (pair.bodyA === my_game.walls["top"] || pair.bodyB === my_game.walls["top"]) {
                        console.log("top");
                        // my_game.ball.pending_events.push(new Snap(my_game.ball.check_nb, my_game.ball.ball.position.x, my_game.ball.ball.position.y, my_game.ball.ball.velocity.x, my_game.ball.ball.velocity.y, 0, my_game.engine.timing.timestamp));
                    }
                    else if (pair.bodyA === my_game.walls["bottom"] || pair.bodyB === my_game.walls["bottom"]) {
                        console.log("bottom");
                        // my_game.ball.pending_events.push(new Snap(my_game.ball.check_nb, my_game.ball.ball.position.x, my_game.ball.ball.position.y, my_game.ball.ball.velocity.x, my_game.ball.ball.velocity.y, 1, my_game.engine.timing.timestamp));
                    }
                    else if (pair.bodyA === my_game.walls["left"] || pair.bodyB === my_game.walls["left"]) {
                        console.log("left");
                        // my_game.ball.pending_events.push(new Snap(my_game.ball.check_nb, my_game.ball.ball.position.x, my_game.ball.ball.position.y, my_game.ball.ball.velocity.x, my_game.ball.ball.velocity.y, 2, my_game.engine.timing.timestamp));
                    }
                    else if (pair.bodyA === my_game.walls["right"] || pair.bodyB === my_game.walls["right"]) {
                        console.log("right");
                        // my_game.ball.pending_events.push(new Snap(my_game.ball.check_nb, my_game.ball.ball.position.x, my_game.ball.ball.position.y, my_game.ball.ball.velocity.x, my_game.ball.ball.velocity.y, 3, my_game.engine.timing.timestamp));
                    }
                    else {
                        console.log("bar");
                        // my_game.ball.pending_events.push(new Snap(my_game.ball.check_nb, my_game.ball.ball.position.x, my_game.ball.ball.position.y, my_game.ball.ball.velocity.x, my_game.ball.ball.velocity.y, 4, my_game.engine.timing.timestamp));
                        if (pair.bodyA == my_game.ball.ball) {
                            if (pair.bodyB.isStatic)
                                matter_js_1.default.Body.setStatic(pair.bodyB, false);
                            else
                                matter_js_1.default.Body.setStatic(pair.bodyB, true);
                        }
                        else {
                            if (pair.bodyA.isStatic)
                                matter_js_1.default.Body.setStatic(pair.bodyA, false);
                            else
                                matter_js_1.default.Body.setStatic(pair.bodyA, true);
                        }
                    }
                }
            }
        }
    };
    const before_update = function (event) {
        if (my_game !== undefined) {
            for (let bar of my_game.bars.values()) {
                if (bar.mov !== bar.last) {
                    const event_correction = [];
                    for (let bar of my_game.bars.values()) {
                        event_correction.push(new simulation_1.Snap(bar.check_nb, bar.bar.position.x, bar.bar.position.y, bar.bar.velocity.x, bar.bar.velocity.y, bar.mov, bar.last, event.timestamp));
                        ++bar.check_nb;
                    }
                    event_correction.push(new simulation_1.Snap(my_game.ball.check_nb, my_game.ball.ball.position.x, my_game.ball.ball.position.y, my_game.ball.ball.velocity.x, my_game.ball.ball.velocity.y, 0, 0, event.timestamp));
                    ++my_game.ball.check_nb;
                    io.to(links.get(socket.id)).emit("correction", event_correction);
                    break;
                }
            }
            for (let bar of my_game.bars.values()) {
                if (bar.mov !== bar.last) {
                    matter_js_1.default.Body.setVelocity(bar.bar, { x: 0, y: bar.mov * 20 });
                    bar.last = bar.mov;
                }
                const pos = bar.bar.position;
                const vel = bar.bar.velocity;
                const new_y = pos.y + vel.y;
                if (new_y < 70 || new_y > 650)
                    matter_js_1.default.Body.setVelocity(bar.bar, { x: 0, y: 0 });
                else {
                    if (bar.bar.isStatic == true)
                        matter_js_1.default.Body.setPosition(bar.bar, { x: bar.bar.position.x, y: new_y });
                }
            }
        }
    };
    console.log('a user connected : ' + socket.id);
    if (!links.has(socket.id)) {
        let room = pending_rooms.pop();
        if (room !== undefined) {
            console.log("room found " + room);
            socket.join(room);
            if (games.has(room)) {
                const game = games.get(room);
                if (game !== undefined) {
                    for (const bar of game.bars.values()) {
                        if (bar.x === 50) {
                            game.addBar(socket.id, 1230, 300, 10, 100);
                            io.sockets.in(room).emit('welcome', 1230, 300);
                            socket.emit('welcome', 50, 300);
                        }
                        else {
                            game.addBar(socket.id, 50, 300, 10, 100);
                            io.sockets.in(room).emit('welcome', 50, 300);
                            socket.emit('welcome', 1230, 300);
                        }
                        break;
                    }
                }
            }
            else {
                games.set(room, new simulation_1.Game());
                games.get(room).addBar(socket.id, 50, 300, 10, 100);
                io.sockets.in(room).emit('welcome', 50, 300);
                pending_rooms.push(room);
            }
        }
        else {
            room = crypto_1.default.randomBytes(8).toString('hex');
            socket.join(room);
            console.log("creat new room : " + room);
            pending_rooms.push(room);
            games.set(room, new simulation_1.Game());
            games.get(room).addBar(socket.id, 50, 300, 10, 100);
            io.sockets.in(room).emit('welcome', 50, 300);
        }
        links.set(socket.id, room);
    }
    const my_game = games.get(links.get(socket.id));
    const my_bar = my_game.bars.get(socket.id);
    if (my_game !== undefined && my_game.bars.size === 2) {
        let vx = Math.random() * 2 + 5;
        let vy = Math.random() * 2 + 5;
        io.to(links.get(socket.id)).emit('start', vx, vy);
        my_game.start();
        matter_js_1.default.Events.on(my_game.engine, 'collisionStart', check_collision);
        matter_js_1.default.Events.on(my_game.engine, 'collisionEnd', check_collision);
        matter_js_1.default.Events.on(my_game.engine, 'beforeUpdate', before_update);
        // Matter.Events.on(my_game.engine, 'afterUpdate', after_update);
        matter_js_1.default.Body.setVelocity(my_game.ball.ball, { x: vx, y: vy });
        matter_js_1.default.Runner.run(my_game.runner, my_game.engine);
    }
    if (my_bar !== undefined) {
        socket.on('mov', (mov) => {
            console.log('mov', mov);
            if (mov > 0) {
                games.get(links.get(socket.id)).bars.get(socket.id).mov = 1;
                io.to(links.get(socket.id)).except(socket.id).emit('mov', 1);
            }
            else if (mov < 0) {
                games.get(links.get(socket.id)).bars.get(socket.id).mov = -1;
                io.to(links.get(socket.id)).except(socket.id).emit('mov', -1);
            }
            else {
                games.get(links.get(socket.id)).bars.get(socket.id).mov = 0;
                io.to(links.get(socket.id)).except(socket.id).emit('mov', 0);
            }
        });
        socket.on('disconnect', () => {
            console.log('socket disconnected : ' + socket.id);
            if (my_game !== undefined) {
                my_game.removeBar(socket.id);
                io.sockets.in(links.get(socket.id)).emit('remove');
                matter_js_1.default.Events.off(my_game.engine, 'collisionStart', check_collision);
                matter_js_1.default.Events.off(my_game.engine, 'collisionEnd', check_collision);
                matter_js_1.default.Events.off(my_game.engine, 'beforeUpdate', before_update);
                if (my_game.bars.size === 0) {
                    console.log('game deleted');
                    my_game.clear();
                    games.delete(links.get(socket.id));
                    links.delete(socket.id);
                }
                else {
                    pending_rooms.push(links.get(socket.id));
                    links.delete(socket.id);
                }
            }
        });
    }
    else
        console.log('bar not found');
    // Matter.Events.on(game[socket.id].engine, 'collisionStart', (event) => { check_collision(event, game[socket.id], socket) });
});
server.listen(port);
