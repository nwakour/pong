import {Socket, io} from 'socket.io-client'
import {Game, Bar, Snap, Game_Update} from './canvas'
import P5 from 'p5'
import Matter from 'matter-js'

const check_collision = function(event : Matter.IEventCollision<Matter.Engine>) {
	console.log("collision");
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; ++i) {
        const pair = pairs[i];
        if (pair.bodyA === game.ball.ball || pair.bodyB === game.ball.ball) {
			if (pair.bodyA === game.walls["top"] || pair.bodyB === game.walls["top"]) {
				console.log("top");
			}
			else if (pair.bodyA === game.walls["bottom"] || pair.bodyB === game.walls["bottom"]) {
				console.log("bottom");
			}
			else if (pair.bodyA === game.walls["left"] || pair.bodyB === game.walls["left"]) {
				console.log("left");
				
			}
			else if (pair.bodyA === game.walls["right"] || pair.bodyB === game.walls["right"]) {
				console.log("right");
			}
			else
			{
				console.log("bar");
				if (pair.bodyA == game.ball.ball)
				{
					if (pair.bodyB.isStatic)
						Matter.Body.setStatic(pair.bodyB, false);
					else
						Matter.Body.setStatic(pair.bodyB, true);
				}
				else
				{
					if (pair.bodyA.isStatic)
						Matter.Body.setStatic(pair.bodyA, false);
					else
						Matter.Body.setStatic(pair.bodyA, true);
				}
			}
		}
    }
}
const before_update = function(event : Matter.IEventCollision<Matter.Engine>) {

	// console.log("in before update");
	if (game.bar[0].last !== game.bar[0].mov || game.bar[1].last !== game.bar[1].mov)
	{
		console.log("adding pending events");
		for (let i = 0; i < game.bar.length; ++i)
		{
			game.bar[i].pending_events.push(new Snap(game.bar[i].bar.position.x, game.bar[i].bar.position.y, game.bar[i].bar.velocity.x, game.bar[i].bar.velocity.y, game.bar[i].mov, game.bar[i].last ,event.timestamp));

		}
		game.ball.pending_events.push(new Snap(game.ball.ball.position.x, game.ball.ball.position.y, game.ball.ball.velocity.x, game.ball.ball.velocity.y, 0, 0,event.timestamp));
	}
	
	if (game.bar[0].corr_events.length > 0)
	{
		const d = new Date().getTime();
		console.log("correcting...", JSON.parse(JSON.stringify(game.bar[0].bar.position)), JSON.parse(JSON.stringify(game.bar[1].bar.position)) , JSON.parse(JSON.stringify(game.bar[0].bar.velocity), JSON.parse(JSON.stringify(game.bar[1].bar.velocity))), JSON.parse(JSON.stringify(game.ball.ball.position)), JSON.parse(JSON.stringify(game.ball.ball.velocity)));
		
		console.log(
		game_sim.clean();
		game_sim.set(game.bar[0].corr_events[game.bar[0].corr_events.length - 1], game.bar[1].corr_events[game.bar[1].corr_events.length - 1], game.ball.corr_events[game.ball.corr_events.length - 1] ,game.bar[0].pending_events[game.bar[0].corr_events.length - 1].t);
		game.ball.pending_events.splice(0, game.ball.corr_events.length);
		game.bar[0].pending_events.splice(0, game.bar[0].corr_events.length);
		game.bar[1].pending_events.splice(0, game.bar[1].corr_events.length);

		game.ball.corr_events = [];
		game.bar[0].corr_events = [];
		game.bar[1].corr_events = [];
		game_sim.simulate(game.bar[0], game.bar[1], event.timestamp);

		Matter.Body.setVelocity(game.bar[0].bar, game_sim.bar[0].bar.velocity);
		Matter.Body.setPosition(game.bar[0].bar, game_sim.bar[0].bar.position);
		Matter.Body.setStatic(game.bar[0].bar, game_sim.bar[0].bar.isStatic);
		game.bar[0].last = game_sim.bar[0].last;
		game.bar[0].mov = game_sim.bar[0].mov;
		
		Matter.Body.setVelocity(game.bar[1].bar, game_sim.bar[1].bar.velocity);
		Matter.Body.setPosition(game.bar[1].bar, game_sim.bar[1].bar.position);
		Matter.Body.setStatic(game.bar[1].bar, game_sim.bar[1].bar.isStatic);
		game.bar[1].last = game_sim.bar[1].last;
		game.bar[1].mov = game_sim.bar[1].mov;
		Matter.Body.setVelocity(game.ball.ball, game_sim.ball.ball.velocity);
		Matter.Body.setPosition(game.ball.ball, game_sim.ball.ball.position);
		console.log("corrected in", new Date().getTime() - d, "ms", JSON.parse(JSON.stringify(game.bar[0].bar.position)), JSON.parse(JSON.stringify(game.bar[1].bar.position)) , JSON.parse(JSON.stringify(game.bar[0].bar.velocity), JSON.parse(JSON.stringify(game.bar[1].bar.velocity))), JSON.parse(JSON.stringify(game.ball.ball.position)), JSON.parse(JSON.stringify(game.ball.ball.velocity)));
	}
	if (game.bar[0].last !== game.bar[0].mov)
	{
		console.log("sending mov");
		client.socket.emit('mov', game.bar[0].mov)
	}
	for (let i = 0; i < game.bar.length; ++i)
	{
		if (game.bar[i].mov !== game.bar[i].last)
		{
			Matter.Body.setVelocity(game.bar[i].bar, {x: 0, y: game.bar[i].mov * 20});
			game.bar[i].last = game.bar[i].mov;
		}
		const pos = game.bar[i].bar.position;
		const vel = game.bar[i].bar.velocity;
		const new_y = pos.y + vel.y;
		if (new_y < 70 || new_y > 650)
			Matter.Body.setVelocity(game.bar[i].bar, {x: 0, y: 0});
		else
		{
			if (game.bar[i].bar.isStatic == true)
				Matter.Body.setPosition(game.bar[i].bar, {x: game.bar[i].bar.position.x, y: new_y});
		}
	}
}

const sim_check_collision = function(event : Matter.IEventCollision<Matter.Engine>) {
	console.log("collision");
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; ++i) {
        const pair = pairs[i];
        if (pair.bodyA === game_sim.ball.ball || pair.bodyB === game_sim.ball.ball) {
			if (pair.bodyA === game_sim.walls["top"] || pair.bodyB === game_sim.walls["top"]) {
				console.log("top");
			}
			else if (pair.bodyA === game_sim.walls["bottom"] || pair.bodyB === game_sim.walls["bottom"]) {
				console.log("bottom");
			}
			else if (pair.bodyA === game_sim.walls["left"] || pair.bodyB === game_sim.walls["left"]) {
				console.log("left");
				
			}
			else if (pair.bodyA === game_sim.walls["right"] || pair.bodyB === game_sim.walls["right"]) {
				console.log("right");
			}
			else
			{
				console.log("bar");
				if (pair.bodyA == game_sim.ball.ball)
				{
					if (pair.bodyB.isStatic)
						Matter.Body.setStatic(pair.bodyB, false);
					else
						Matter.Body.setStatic(pair.bodyB, true);
				}
				else
				{
					if (pair.bodyA.isStatic)
						Matter.Body.setStatic(pair.bodyA, false);
					else
						Matter.Body.setStatic(pair.bodyA, true);
				}
			}
		}
    }
}
const sim_before_update = function(event : Matter.IEventCollision<Matter.Engine>) {	
	if (game_sim.bar[0].last !== game_sim.bar[0].mov || game_sim.bar[1].last !== game_sim.bar[1].mov)
	{
		for (let i = 0; i < game_sim.bar.length; ++i)
		{
			game_sim.bar[i].pending_events.push(new Snap(game_sim.bar[i].bar.position.x, game_sim.bar[i].bar.position.y, game_sim.bar[i].bar.velocity.x, game_sim.bar[i].bar.velocity.y, game_sim.bar[i].mov, game_sim.bar[i].last ,event.timestamp));
			// ++game_sim.bar[i].nb_events_pending;
		}
		game_sim.ball.pending_events.push(new Snap(game_sim.ball.ball.position.x, game_sim.ball.ball.position.y, game_sim.ball.ball.velocity.x, game_sim.ball.ball.velocity.y, 0, 0,event.timestamp));
		// ++game_sim.ball.nb_events_pending;
	}
	for (let i = 0; i < game_sim.bar.length; ++i)
	{
		if (game_sim.bar[i].mov !== game_sim.bar[i].last)
		{
			Matter.Body.setVelocity(game_sim.bar[i].bar, {x: 0, y: game_sim.bar[i].mov * 20});
			game_sim.bar[i].last = game_sim.bar[i].mov;
		}
		const pos = game_sim.bar[i].bar.position;
		const vel = game_sim.bar[i].bar.velocity;
		const new_y = pos.y + vel.y;
		if (new_y < 70 || new_y > 650)
			Matter.Body.setVelocity(game_sim.bar[i].bar, {x: 0, y: 0});
		else
		{
			if (game_sim.bar[i].bar.isStatic == true)
				Matter.Body.setPosition(game_sim.bar[i].bar, {x: game_sim.bar[i].bar.position.x, y: new_y});
		}
	}
}

class Client{
	public socket : Socket;
	public game : Game;
	public sim_game : Game_Update;
	constructor() {
		// this.socket = io('http://10.12.12.2:4000');
		this.socket = io('http://localhost:4000');
		this.game = new Game();
		this.sim_game = new Game_Update();
		Matter.Events.on(this.sim_game.engine, 'collisionStart', sim_check_collision);
		Matter.Events.on(this.sim_game.engine, 'collisionEnd', sim_check_collision);
		Matter.Events.on(this.sim_game.engine, 'beforeUpdate', sim_before_update);
		// Matter.Events.on(game_sim.engine, 'afterUpdate', sim_after_update);
		this.socket.on('connect', function () {
			console.log('connect')
		})
		
		document.addEventListener('keydown', (event) => {
			console.log('key event',new Date().getTime());
			this.game.keydown(event.key,0);
			// this.socket.emit('keydown', event.key);
		})
		document.addEventListener('keyup', (event) => {
			this.game.keyup(event.key,0);
			// this.socket.emit('keyup', event.key);
		})
		this.socket.on('welcome', (x:number, y:number) => {
			console.log('welcome', 'x: ' + x, 'y: ' + y)
			this.game.bar.push(new Bar(x, y, 10, 100))
			this.sim_game.bar.push(new Bar(x, y, 10, 100))
			Matter.Composite.add(game.engine.world, game.bar[game.bar.length - 1].bar);
			Matter.Composite.add(game_sim.engine.world, game_sim.bar[game_sim.bar.length - 1].bar);
		})
		this.socket.on('correction', (events : Snap[]) => {
			console.log('correction', JSON.parse(JSON.stringify(events)));
			for (let i = 0;  i < game.bar.length; ++i)
			{
				if (game.bar[i].x == events[0].x)
				{
					game.bar[i].corr_events.push(events[0]);
				}
				else
				{
					game.bar[i].corr_events.push(events[1]);
				}
			}
			game.ball.corr_events.push(events[2]);
		})
		this.socket.on('mov', (mov : number) => {
			game.bar[1].mov = mov;
		})

		this.socket.on('remove', () => {
			console.log('remove')
			Matter.Composite.remove(this.game.engine.world, this.game.bar[0].bar);
			Matter.Composite.remove(this.game.engine.world, this.game.bar[1].bar);
			Matter.Composite.remove(this.game.engine.world, this.game.ball.ball);
			Matter.Events.off(this.game.engine, 'collisionStart', check_collision);
			Matter.Events.off(this.game.engine, 'collisionEnd', check_collision);
			Matter.Events.off(game.engine, 'beforeUpdate', before_update);
			// Matter.Events.off(game.engine, 'afterUpdate', after_update);

		})
		this.socket.on('start', (vx: number, vy: number) => {
			console.log('start ' + vx + ' ' + vy)
			this.game.start();
			Matter.Body.setVelocity(this.game.ball.ball, {x: vx , y: vy});
			Matter.Events.on(game.engine, 'collisionStart', check_collision);
			Matter.Events.on(game.engine, 'collisionEnd', check_collision);
			Matter.Events.on(game.engine, 'beforeUpdate', before_update);
			// Matter.Events.on(game.engine, 'afterUpdate', after_update);
			Matter.Runner.run(game.runner, game.engine);
		})
	}
}
const client = new Client();
const game = client.game;
const game_sim = client.sim_game;
const sketch = (p5: P5) => {
	p5.setup = () => {
		const canvas = p5.createCanvas(1280, 720);
		p5.frameRate(60);
		canvas.parent("app");
		p5.background("Black");
	};
	p5.draw = () => {
		// console.log("draw");
		p5.background(51);
		game.update(p5);
	};
};

new P5(sketch);