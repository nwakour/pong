import path from 'path'
import express from 'express'
import Matter from 'matter-js'
import * as http from 'http'
import * as SocketIO from 'socket.io'
import crypto from 'crypto'
import {Game} from './simulation'

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

// const game : { [x: string]: Game } = {};
const games = new Map<string, Game>();
const links  = new Map<string, string>()

const pending_rooms : string[] = [];

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

const game_update = function(game : Game) {
	for (let bar of game.bars.values())
	{
		if (bar.lastframe === null)
		{
			bar.lastframe = new Date().getTime();
			continue;
		}
		const now = new Date().getTime();
		const diff = now - bar.lastframe;
		bar.lastframe = now;
		let py = bar.bar.position.y + (bar.mov * diff);
		if (py < 51)
			py = 51;
		else if (py > 669)
			py = 669;
		Matter.Body.setVelocity(bar.bar, {x: 0, y: py - bar.bar.position.y});
		Matter.Body.setPosition(bar.bar, {x: bar.bar.position.x, y: py});
	}
}

io.on('connection', (socket: SocketIO.Socket) => {
	console.log('a user connected : ' + socket.id)
	// const inter : NodeJS.Timer | null = null;
	if (!links.has(socket.id))
	{
		let room = pending_rooms.pop();
		if (room !== undefined)
		{
			socket.join(room);
			if (!games.has(room))
			{
				games.get(room)!.addBar(socket.id, 1230, 300, 10, 100);
				io.sockets.in(room).emit('welcome', 1230, 300);
			}
			else
			{
				games.set(room, new Game());
				games.get(room)!.addBar(socket.id, 50, 300, 10, 100);
				io.sockets.in(room).emit('welcome', 50, 300);
				pending_rooms.push(room);
			}
		}
		else
		{
			room = crypto.randomBytes(8).toString('hex');
			socket.join(room);
			pending_rooms.push(room);
			games.set(room, new Game());
			games.get(room)!.addBar(socket.id, 50, 300, 10, 100);
			io.sockets.in(room).emit('welcome', 50, 300);
		}
		links.set(socket.id, room);
	}
	const my_game = games.get(links.get(socket.id)!);
	const my_bar = my_game!.bars.get(socket.id);
	if (my_game !== undefined && my_game.bars.size === 2 && my_game.inter === null)
		my_game.inter = setInterval(game_update.bind(this), 1000 / 60, my_game);
	if (my_bar !== undefined){
		socket.on('keydown', (key: string) => {
			if (key === 'ArrowUp'){
				my_bar.mov = -1;
				my_bar.key['ArrowUp'] = 1;
			}
			else if (key === 'ArrowDown'){
				my_bar.mov = 1;
				my_bar.key['ArrowDown'] = 1;
			}
			else
				return;
			my_bar.lastkeytime = new Date().getTime();
			socket.emit('update', my_bar.check_nb ,my_bar.bar.position.x, my_bar.bar.position.y, my_bar.bar.velocity.x, my_bar.bar.velocity.y, my_bar.lastkeytime , my_bar.mov);
			io.to(links.get(socket.id)!).except(socket.id).emit('spectate', my_bar.check_nb ,my_bar.bar.position.x, my_bar.bar.position.y, my_bar.bar.velocity.x, my_bar.bar.velocity.y, my_bar.lastkeytime , my_bar.mov);
			my_bar.last = my_bar.mov;
			console.log(my_bar.check_nb ,my_bar.bar.position.x, my_bar.bar.position.y, my_bar.bar.velocity.x, my_bar.bar.velocity.y, my_bar.lastkeytime , my_bar.mov);
			++my_bar.check_nb;
		})
		socket.on('keyup', (key: string) => {
			if (key === 'ArrowUp'){
				my_bar.key['ArrowUp'] = 0;
				if (my_bar.key['ArrowDown'] === 1)
					my_bar.mov = 1;
				else
					my_bar.mov = 0;
			}
			else if (key === 'ArrowDown'){
				my_bar.key['ArrowDown'] = 0;
				if (my_bar.key['ArrowUp'] === 1)
					my_bar.mov = -1;
				else
					my_bar.mov = 0;
			}
			else
				return;
			my_bar.lastkeytime = new Date().getTime();
			socket.emit('update', my_bar.check_nb ,my_bar.bar.position.x, my_bar.bar.position.y, my_bar.bar.velocity.x, my_bar.bar.velocity.y, my_bar.lastkeytime , my_bar.mov);
			io.to(links.get(socket.id)!).except(socket.id).emit('spectate', my_bar.check_nb ,my_bar.bar.position.x, my_bar.bar.position.y, my_bar.bar.velocity.x, my_bar.bar.velocity.y, my_bar.lastkeytime , my_bar.mov);
			my_bar.last = my_bar.mov;
			console.log(my_bar.check_nb ,my_bar.bar.position.x, my_bar.bar.position.y, my_bar.bar.velocity.x, my_bar.bar.velocity.y, my_bar.lastkeytime , my_bar.mov);
			++my_bar.check_nb;
		})
		socket.on('disconnect', () => {
			console.log('socket disconnected : ' + socket.id)
			if (my_game !== undefined)
			{
				my_game.removeBar(socket.id);
				if (my_game.bars.size === 0)
				{	
					console.log('game deleted');
					my_game.clear();
					games.delete(links.get(socket.id)!);
					links.delete(socket.id);
				}
				else
				{
					links.delete(socket.id);
				}
			}
		})
	}
	else
		console.log('bar not found');
	// Matter.Events.on(game[socket.id].engine, 'collisionStart', (event) => { check_collision(event, game[socket.id], socket) });
})

server.listen(port)
