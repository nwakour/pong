import {Socket, io} from 'socket.io-client'
import {Game, Bar, Snap} from './canvas'
import P5 from 'p5'
import Matter from 'matter-js'

class Client{
	public socket : Socket;
	public game : Game;
 
	constructor() {
		// this.socket = io('http://10.12.12.2:4000');
		this.socket = io('http://localhost:4000');
		this.game = new Game();
		this.socket.on('connect', function () {
			console.log('connect')
		})
		
		document.addEventListener('keydown', (event) => {
			this.game.keydown(event.key,0);
			this.socket.emit('keydown', event.key);
		})
		document.addEventListener('keyup', (event) => {
			this.game.keyup(event.key,0);
			this.socket.emit('keyup', event.key);
		})
		this.socket.on('welcome', (x:number, y:number) => {
			console.log('welcome', 'x: ' + x, 'y: ' + y)
			this.game.bar.push(new Bar(x, y, 10, 100))
			Matter.World.add(this.game.engine.world, [this.game.bar[0].bar]);
		})
		this.socket.on('update', (nb :number, x :number, y: number, vx: number, vy: number, t : number, mov :number) => {
			console.log('update', nb, x, y, vx, vy, t, mov)
			this.game.bar[0].corr_events.set(nb, new Snap(x, y, vx, vy, t, mov));
			this.game.bar[0].check();
		})
		this.socket.on('spectate', (nb :number, x :number, y: number, vx: number, vy: number, t : number, mov :number) => {
			console.log('spectate', nb, x, y, vx, vy, t, mov)
			this.game.bar[1].corr_events.set(nb, new Snap(x, y, vx, vy, t, mov));
			this.game.bar[1].check();
		})
	}
}
const client = new Client();
const game = client.game;

// Matter.Events.on(game.engine, 'collisionStart', function(event : Matter.IEventCollision<Matter.Engine>) {
//     const pairs = event.pairs;
//     for (let i = 0; i < pairs.length; ++i) {
//         const pair = pairs[i];
//         if (pair.bodyA === game.ball.ball || pair.bodyB === game.ball.ball) {
//             if (pair.bodyA === game.bar.bar || pair.bodyB === game.bar.bar) {
//                const ev : [[number, number], [number, number], [string, number]] = [[game.ball.ball.position.x, game.ball.ball.position.y], [game.ball.ball.velocity.x, game.ball.ball.velocity.y], ["bar", new Date().getTime()]];
//                game.ball.ev.push(ev);
//                 console.log(ev);
//             }
//             else if (pair.bodyA === game.walls["top"] || pair.bodyB === game.walls["top"]) {
//                const ev : [[number, number], [number, number], [string, number]] = [[game.ball.ball.position.x, game.ball.ball.position.y], [game.ball.ball.velocity.x, game.ball.ball.velocity.y], ["top", new Date().getTime()]];
//                game.ball.ev.push(ev);
//                console.log(ev);
//             }
//             else if (pair.bodyA === game.walls["bottom"] || pair.bodyB === game.walls["bottom"]) {
//                 const ev : [[number, number], [number, number], [string, number]] = [[game.ball.ball.position.x, game.ball.ball.position.y], [game.ball.ball.velocity.x, game.ball.ball.velocity.y], ["bottom", new Date().getTime()]];
//                 game.ball.ev.push(ev);
//                 console.log(ev);
//             }
//             else if (pair.bodyA === game.walls["left"] || pair.bodyB === game.walls["left"]) {
//                 const ev : [[number, number], [number, number], [string, number]] = [[game.ball.ball.position.x, game.ball.ball.position.y], [game.ball.ball.velocity.x, game.ball.ball.velocity.y], ["left", new Date().getTime()]];
//                 game.ball.ev.push(ev);
//                 console.log(ev);
//             }
//             else if (pair.bodyA === game.walls["right"] || pair.bodyB === game.walls["right"]) {
//                 const ev : [[number, number], [number, number], [string, number]] = [[game.ball.ball.position.x, game.ball.ball.position.y], [game.ball.ball.velocity.x, game.ball.ball.velocity.y], ["right", new Date().getTime()]];
//                 game.ball.ev.push(ev);
//                 console.log(ev);
//             }
//             else
//                 console.log("collision with something else");
//         }
//     }
// }.bind(this));

const sketch = (p5: P5) => {
	p5.setup = () => {
		const canvas = p5.createCanvas(1280, 720);
		p5.frameRate(60);
		canvas.parent("app");
		p5.background("Black");
	};
	p5.draw = () => {
		p5.background(51);
		game.update(p5);
	};
};

new P5(sketch);