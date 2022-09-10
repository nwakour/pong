import {Socket, io} from 'socket.io-client'
import {Game, Bar} from './canvas'
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
            // this.game.keydown(event.key,1);
            // this.socket.emit('keydown', event.key);
        })
        document.addEventListener('keyup', (event) => {
            this.game.keyup(event.key,0);
            // this.game.keyup(event.key,1);
            
        })

        // this.socket.on('keydown', (key:string) => {
        //     this.game.keydown(key,1);
        // })
        // this.socket.on('keyup', (key:string) => {
        //     this.game.keyup(key,1);
        // })
        this.socket.on('welcome', (x:number, y:number) => {
            console.log('welcome', 'x: ' + x, 'y: ' + y)
            this.game.bar.push(new Bar(x, y, 10, 100))
            // this.game.bar.push(new Bar(700, 300, 10, 100))
            Matter.World.add(this.game.engine.world, [this.game.bar[0].bar]);
            // Matter.World.add(this.game.engine.world, [this.game.bar[2].bar]);
            // Matter.Body.setVelocity(this.game.bar.bar, {x: x - this.game.bar.bar.position.x, y: y - this.game.bar.bar.position.y});
            // Matter.Body.setPosition(this.game.bar.bar, {x: x, y: y});
        })
        this.socket.on('update', (ev : [ pos :[x: number, y:number], v: [vx: number, vy: number], par: [mov: number, t: number]]) => {
            // console.log('update');
            this.game.bar[0].corr_events.push(ev);
            // this.game.bar[2].check(ev);
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
        game.update(p5, client.socket);
	};
};

new P5(sketch);