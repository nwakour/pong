import P5 from 'p5'
import Matter from 'matter-js'

export class Snap{
	public check_nb : number;
	public x : number;
	public y : number;
	public vx : number;
	public vy : number;
	public mov : number;
	public t: number;
	constructor(check_nb: number, x : number, y : number, vx : number, vy : number, mov : number, t: number) {
		this.check_nb = check_nb;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.mov = mov;
		this.t = t;
	}
}

export class Ball {
	public ball : Matter.Body;
	public x : number;
	public y : number;
	public r: number;
	public pending_events : Snap[] = [];
	public corr_events : Snap[] = [];
	public nb_events_corrected : number;
	public nb_events_pending: number;
	constructor(x: number, y: number, radius: number) {
		this.x = x;
		this.y = y;
		this.r = radius;
		this.ball = Matter.Bodies.polygon(x, y, 6, radius, {inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0,
			restitution: 1});
		this.nb_events_corrected = 0;
		this.nb_events_pending = 0;
	}

	show(p : P5) {
		let pos = this.ball.position;
		let angle = this.ball.angle;
		p.push();
		p.translate(pos.x, pos.y);
		p.rotate(angle);
		p.ellipseMode(p.CENTER);
		p.ellipse(0, 0, this.r, this.r);
		p.pop();
	}

	reset()
	{
		Matter.Body.setVelocity(this.ball, {x: this.x - this.ball.position.x, y: this.y - this.ball.position.y});
		Matter.Body.setPosition(this.ball, {x: this.x, y: this.y});
	}
	check(){
		if (this.corr_events.length === 0)
			return;
		let new_t = new Date().getTime();
		let x = 0;
		let y = 0;
		let t = 0;
		let vx = 0;
		let vy = 0;
		
		for (let i = 0; i < this.corr_events.length; ++i)
		{
			x = this.corr_events[i].x;
			y = this.corr_events[i].y;
			vx = this.corr_events[i].vx;
			vy = this.corr_events[i].vy;
			++this.nb_events_corrected;
			// if (this.pending_events.length > 0)
			t = this.pending_events[0].t;
			// else
			// {
			// 	console.log("t not found");
			// 	t = this.corr_events[i].t;
			// }
			this.pending_events.shift();
		}
		this.corr_events = [];

		console.log("Corrected "  + x + " " + y + " " + vx + " " + vy + " " + t);
		console.log(this.ball.position)
		console.log(this.ball.position.x, this.ball.position.y, this.ball.velocity.x, this.ball.velocity.y);
		console.log(this.ball.velocity)
		console.log(this.ball);
		console.log('after correction')
		const new_vel = this.ball.velocity;
		console.log(new_vel);
		console.log(new_vel.x);
		console.log(new_vel.y);
		console.log(JSON.parse(JSON.stringify(this.ball.velocity)))
		for (let i = 0; i < this.pending_events.length; ++i)
		{
			x += vx * (this.pending_events[i].t - t);
			y += vy * (this.pending_events[i].t - t);
			t = this.pending_events[i].t;
			vx = this.pending_events[i].vx;
			vy = this.pending_events[i].vy;
		}
		// console.log(x + " " + y + " " + (new_t - t));
		x += vx * (new_t - t);
		y += vy * (new_t - t);
		// console.log(x + " " + y + " " + (new_t - t));
		Matter.Body.setVelocity(this.ball, {x: vx , y: vy});
		// Matter.Body.setPosition(this.ball, {x: x, y: y});
		// console.log(this.ball.position)
		// console.log(this.ball.velocity)
	}
}

export class Bar {
	public bar : Matter.Body;
	public x : number;
	public y : number;
	public width: number;
	public height: number;
	public key: { [x: string]: number } = {};
	public mov : number;
	public last : number;
	public pending_events : Snap[] = [];
	public corr_events : Snap[] = [];
	public nb_events_pending : number;
	public nb_events_corrected : number;
	public lastframe : number | null;
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.bar = Matter.Bodies.rectangle(x, y, width, height, {isStatic: true});
		this.key["ArrowDown"] = 0;
		this.key["ArrowUp"] = 0;
		this.mov = 0;
		this.last = 0;
		this.nb_events_pending = 0;
		this.nb_events_corrected = 0;
		this.lastframe = null;
	}
	show(p : P5) {
		let pos = this.bar.position;
		let angle = this.bar.angle;
		p.push();
		p.translate(pos.x, pos.y);
		p.rotate(angle);
		p.rectMode(p.CENTER);
		p.rect(0, 0, this.width, this.height);
		p.pop();
	}
	reset(){
		console.log("reset");
		this.mov = 0;
		this.last = 0;
		this.nb_events_pending = 0;
		this.nb_events_corrected = 0;
		this.lastframe = null;
		// this.lastkeytime = 0;
		this.pending_events = [];
		this.corr_events = [];
		this.key["ArrowDown"] = 0;
		this.key["ArrowUp"] = 0;
		Matter.Body.setVelocity(this.bar, {x: this.x - this.bar.position.x, y: this.y - this.bar.position.y});
		Matter.Body.setPosition(this.bar, {x: this.x, y: this.y});
		Matter.Body.setVelocity(this.bar, {x: 0, y: 0});
	}
	check(){
		if (this.corr_events.length === 0)
			return;
		let x = 0;
		let y = 0;
		let t = 0;
		for (let i = 0; i < this.corr_events.length; ++i)
		{
			x = this.corr_events[i].x;
			y = this.corr_events[i].y;
			++this.nb_events_corrected;
			t = this.pending_events[0].t;
			this.pending_events.shift();
		}
		this.corr_events = [];

		for (let i = 0; i < this.pending_events.length; ++i)
		{
			y += (this.pending_events[i].t - t) * this.pending_events[i].mov;
			t = this.pending_events[i].t;
			if (y < 51)
				y = 51;
			else if (y > 669)
				y = 669;
		}
		Matter.Body.setVelocity(this.bar, {x: x - this.bar.position.x , y: y - this.bar.position.y});
		Matter.Body.setPosition(this.bar, {x: x, y: y});
	}
}

export class Game{
	public engine : Matter.Engine;
	public bar : Bar[] = [];
	public ball : Ball;
	public walls: { [x: string]: Matter.Body } = {};
	
	constructor(){
		this.engine = Matter.Engine.create();
		this.engine.gravity.y = 0;
		this.walls["top"] = Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true });
		this.walls["bottom"] = Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true });
		this.walls["left"] = Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true });
		this.walls["right"] = Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true });
		this.ball = new Ball(1280/2, 720/2, 10);
		Matter.Composite.add(this.engine.world, [this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
		Matter.Runner.run(Matter.Runner.create(), this.engine);
	}

	keydown(key: string, id : number){
		if (key === 'ArrowUp'){
			this.bar[id].mov = -1;
			this.bar[id].key['ArrowUp'] = 1;
		}
		else if (key === 'ArrowDown'){
			this.bar[id].mov = 1;
			this.bar[id].key['ArrowDown'] = 1;
		}
		else
			return;
		this.bar[id].pending_events.push(new Snap(this.bar[id].nb_events_pending, this.bar[id].bar.position.x, this.bar[id].bar.position.y, this.bar[id].bar.velocity.x, this.bar[id].bar.velocity.y, this.bar[id].last, new Date().getTime()));
		this.bar[id].last = this.bar[id].mov;
		console.log("new event " + this.bar[id].nb_events_pending);
		console.log(this.bar[id].pending_events[this.bar[id].pending_events.length - 1]);
		++this.bar[id].nb_events_pending;
	}

	keyup(key: string, id : number){
		if (key === 'ArrowUp'){
			this.bar[id].key['ArrowUp'] = 0;
			if (this.bar[id].key['ArrowDown'] === 1)
				this.bar[id].mov = 1;
			else
				this.bar[id].mov = 0;
		}
		else if (key === 'ArrowDown'){
			this.bar[id].key['ArrowDown'] = 0;
			if (this.bar[id].key['ArrowUp'] === 1)
				this.bar[id].mov = -1;
			else
				this.bar[id].mov = 0;
		}
		else
			return;
		this.bar[id].pending_events.push(new Snap(this.bar[id].nb_events_pending, this.bar[id].bar.position.x, this.bar[id].bar.position.y, this.bar[id].bar.velocity.x, this.bar[id].bar.velocity.y, this.bar[id].last, new Date().getTime()));
		this.bar[id].last = this.bar[id].mov;
		console.log("new event " + this.bar[id].nb_events_pending);
		console.log(this.bar[id].pending_events);
		++this.bar[id].nb_events_pending;
	}
	start ()
	{
		for (let i = 0; i < this.bar.length; i++)
		{
			Matter.Composite.add(this.engine.world, [this.bar[i].bar]);
			
			this.bar[i].reset();
		}
		Matter.Composite.add(this.engine.world, [this.ball.ball]);
		this.ball.reset();
	}
	update(p: P5){
		
		for (let i = 0; i < this.bar.length; i++)
		{
			if (this.bar[i].lastframe === null)
			{
				this.bar[i].lastframe = new Date().getTime();
				continue;
			}
			const now = new Date().getTime();
			const diff = now - this.bar[i].lastframe!;
			this.bar[i].lastframe = now;
			let py = this.bar[i].bar.position.y + (this.bar[i].mov * diff);
			if (py < 51)
				py = 51;
			else if (py > 669)
				py = 669;
			Matter.Body.setVelocity(this.bar[i].bar, {x: 0, y: py - this.bar[i].bar.position.y});
			Matter.Body.setPosition(this.bar[i].bar, {x: this.bar[i].bar.position.x, y: py});
			this.bar[i].show(p);
			this.ball.show(p);
		}
	}
}
