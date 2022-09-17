import {Socket, io} from 'socket.io-client'
import {Game, Bar, Snap} from './canvas'
import P5 from 'p5'
import Matter from 'matter-js'

const check_collision = function(event : Matter.IEventCollision<Matter.Engine>) {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; ++i) {
        const pair = pairs[i];
        if (pair.bodyA === game.ball.ball || pair.bodyB === game.ball.ball) {
			if (pair.bodyA === game.walls["top"] || pair.bodyB === game.walls["top"]) {
				console.log("top");
			   game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 0, new Date().getTime()));
			}
			else if (pair.bodyA === game.walls["bottom"] || pair.bodyB === game.walls["bottom"]) {
				console.log("bottom");
				game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 1, new Date().getTime()));
			}
			else if (pair.bodyA === game.walls["left"] || pair.bodyB === game.walls["left"]) {
				console.log("left");
				game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 2, new Date().getTime()));
				
			}
			else if (pair.bodyA === game.walls["right"] || pair.bodyB === game.walls["right"]) {
				console.log("right");
				game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 3, new Date().getTime()));
			}
			else
			{
				console.log("bar");
				game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 4, new Date().getTime()));
			}
			console.log(game.ball.pending_events[game.ball.pending_events.length - 1]);
			++game.ball.nb_events_pending;
		}
    }
}

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
		})
		this.socket.on('update', (events : Snap[][], ball_events :Snap[]) => {
			console.log('update')
			for (let i = 0; i < events.length; ++i){
				if (events[i][0].x === game.bar[0].x)
				{
					this.game.bar[0].corr_events = events[i];
					this.game.bar[0].check();
				}
				else
				{
					this.game.bar[1].corr_events = events[i];
					this.game.bar[1].check();
				}
			}
			if (ball_events.length > 0)
			{
				this.game.ball.corr_events = ball_events;
				this.game.ball.check();
			}
		})
		this.socket.on('en_key', (eve : string, key: string) => {
			if (eve == "keydown")
				this.game.keydown(key, 1);
			else
				this.game.keyup(key, 1);
		})

		this.socket.on('remove', () => {
			console.log('remove')
			Matter.Composite.remove(this.game.engine.world, this.game.bar[0].bar);
			Matter.Composite.remove(this.game.engine.world, this.game.bar[1].bar);
			Matter.Composite.remove(this.game.engine.world, this.game.ball.ball);
			this.game.bar.pop();
			Matter.Events.off(this.game.engine, 'collisionEnd', check_collision);
		})
		this.socket.on('start', (vx: number, vy: number) => {
			console.log('start ' + vx + ' ' + vy)
			this.game.start();
			Matter.Body.setVelocity(this.game.ball.ball, {x: vx , y: vy});
			Matter.Events.on(game.engine, 'collisionEnd', check_collision);

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
//             if (pair.bodyA === game.walls["top"] || pair.bodyB === game.walls["top"]) {
// 				console.log("top");
//                game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 0));
//             }
//             else if (pair.bodyA === game.walls["bottom"] || pair.bodyB === game.walls["bottom"]) {
// 				console.log("bottom");
//                 game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 1));
//             }
//             else if (pair.bodyA === game.walls["left"] || pair.bodyB === game.walls["left"]) {
// 				console.log("left");
//                 game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 2));
//             }
//             else if (pair.bodyA === game.walls["right"] || pair.bodyB === game.walls["right"]) {
// 				console.log("right");
//                 game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 3));
//             }
//             else
// 			{
// 				console.log("bar");
//                 game.ball.pending_events.push(new Snap(game.ball.nb_events_pending, game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 4));
// 			}
// 			++game.ball.nb_events_pending;
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