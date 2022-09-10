import path from 'path'
import express from 'express'
import Matter from 'matter-js'
import * as http from 'http'
import * as SocketIO from 'socket.io'

import { Game} from './simulation'

const port: number = 4000
const app = express()
app.use(express.static(path.join(__dirname, '../../../pong')))
const server = new http.Server(app)
const io = new SocketIO.Server(server, {
    cors: {
        // origin: 'http://10.12.12.2:3000',
        origin: 'http://localhost:3000',
        credentials: true
    }
})

const game : { [x: string]: Game } = {};

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
const game_update = function(game : Game, sock : SocketIO.Socket) {
    if (game.lastframe === null)
    {
        game.lastframe = new Date().getTime();
        return
    }
    const diff = new Date().getTime() - game.lastframe;
    game.lastframe = new Date().getTime();
    let py = game.bar.bar.position.y + (game.bar.mov * diff);
    if (py < 51)
        py = 51;
    else if (py > 669)
        py = 669;
    Matter.Body.setVelocity(game.bar.bar, {x: 0, y: py - game.bar.bar.position.y});
    Matter.Body.setPosition(game.bar.bar, {x: game.bar.bar.position.x, y: py});
    if (game.bar.last !== game.bar.mov) {
        const ev : [[number, number], [number, number], [number, number]] = [[game.bar.bar.position.x, game.bar.bar.position.y], [game.bar.bar.velocity.x, game.bar.bar.velocity.y] ,[game.bar.mov, diff]];
        sock.emit('update', ev);
        game.bar.last = game.bar.mov;
        console.log(ev);
    }
}
io.on('connection', (socket: SocketIO.Socket) => {
    console.log('a user connected : ' + socket.id)
    socket.emit('welcome',  50, 300)
    game[socket.id] = new Game();
    const inter = setInterval(game_update.bind(this), 1000 / 60, game[socket.id], socket);
    // socket.on('keydown', (key: string) => {
    //     game[socket.id].keydown(key)
    //     socket.emit('keydown', key)
    // })
    socket.on('move', (mov: number) => {
        game[socket.id].bar.mov = mov;
    })
    
    // Matter.Events.on(game[socket.id].engine, 'collisionStart', (event) => { check_collision(event, game[socket.id], socket) });
    socket.on('disconnect', () => {
        console.log('socket disconnected : ' + socket.id)
        clearInterval(inter);
        Matter.Runner.stop(game[socket.id].runner)
        delete game[socket.id];
    })
})



server.listen(port)

