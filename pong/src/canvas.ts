import P5 from 'p5'
import Matter from 'matter-js'

export class Snap{
	public x : number;
	public y : number;
	public vx : number;
	public vy : number;
	public mov : number;
	public last : number;
	public t: number;
	constructor(x : number, y : number, vx : number, vy : number, mov : number, last :number ,t: number) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.mov = mov;
		this.last = last;
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

	constructor(x: number, y: number, radius: number) {
		this.x = x;
		this.y = y;
		this.r = radius;
		this.ball = Matter.Bodies.polygon(x, y, 6, radius, {inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0,
			restitution: 1});
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
		Matter.Body.setPosition(this.ball, {x: this.x, y: this.y});
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
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.bar = Matter.Bodies.rectangle(x, y, width, height, {inertia: Infinity,
			friction: 1,
			restitution: 1,
			mass: Infinity,
			density: Infinity
		});
		this.key["ArrowDown"] = 0;
		this.key["ArrowUp"] = 0;
		this.mov = 0;
		this.last = 0;
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
		this.pending_events = [];
		this.corr_events = [];
		this.key["ArrowDown"] = 0;
		this.key["ArrowUp"] = 0;
		Matter.Body.setVelocity(this.bar, {x: this.x - this.bar.position.x, y: this.y - this.bar.position.y});
		Matter.Body.setPosition(this.bar, {x: this.x, y: this.y});
		Matter.Body.setVelocity(this.bar, {x: 0, y: 0});
	}
}

export class Game_Update{
	public engine : Matter.Engine;
	public bar : Bar[] = [];
	public ball : Ball;
	public walls: { [x: string]: Matter.Body } = {};
	public frame : number;
	constructor () {
		this.engine = Matter.Engine.create();
		this.engine.gravity.y = 0;
		this.walls["top"] = Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true });
		this.walls["bottom"] = Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true });
		this.walls["left"] = Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true });
		this.walls["right"] = Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true });
		this.ball = new Ball(1280/2, 720/2, 10);
		Matter.Composite.add(this.engine.world, [this.ball.ball, this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
		this.frame = 0;
	}

	set(last_bar1: Snap, Last_bar2: Snap, last_ball: Snap, lastframe: number)
	{
		Matter.Body.setVelocity(this.ball.ball, {x: last_ball.vx , y: last_ball.vy});
		Matter.Body.setPosition(this.ball.ball, {x: last_ball.x, y: last_ball.y});
		Matter.Body.setVelocity(this.bar[0].bar, {x: last_bar1.vx , y: last_bar1.vy});
		Matter.Body.setPosition(this.bar[0].bar, {x: last_bar1.x, y: last_bar1.y});
		this.bar[0].mov = last_bar1.mov;
		this.bar[0].last = last_bar1.last;
		Matter.Body.setVelocity(this.bar[1].bar, {x: Last_bar2.vx , y: Last_bar2.vy});
		Matter.Body.setPosition(this.bar[1].bar, {x: Last_bar2.x, y: Last_bar2.y});
		this.bar[1].mov = Last_bar2.mov;
		this.bar[1].last = Last_bar2.last;
		this.frame = lastframe;
		
	}
	clean()
	{
		this.bar[0].reset();
		this.bar[1].reset();
		this.ball.reset();
	}
	simulate (bar1: Bar, bar2: Bar, current_time: number)
	{
		// this.ball.nb_events_pending = bar2.nb_events_pending;
		// this.bar[0].nb_events_pending = bar1.nb_events_pending;
		// this.bar[1].nb_events_pending = bar2.nb_events_pending;
		for (let i = 0; i < bar1.pending_events.length; ++i)
		{
			Matter.Engine.update(this.engine, bar1.pending_events[i].t - this.frame);
			this.frame = bar1.pending_events[i].t;
			this.bar[0].mov = bar1.pending_events[i].mov;
			this.bar[0].last = bar1.pending_events[i].last;
			this.bar[0].pending_events[this.bar[0].pending_events.length -1].t = bar1.pending_events[i].t;
			this.bar[1].mov = bar2.pending_events[i].mov;
			this.bar[1].last = bar2.pending_events[i].last;
			this.bar[1].pending_events[this.bar[1].pending_events.length -1].t = bar2.pending_events[i].t;
			this.ball.pending_events[this.ball.pending_events.length -1].t = bar2.pending_events[i].t;
		}
		console.log(current_time - this.frame);
		// this.bar[0].mov = bar1.mov;
		// this.bar[0].last = bar1.last;
		// this.bar[0].nb_events_pending = bar1.nb_events_pending;
		// this.bar[1].mov = bar2.mov;
		// this.bar[1].last = bar2.last;
		// this.bar[1].nb_events_pending = bar2.nb_events_pending;
		// this.ball.nb_events_pending = bar2.nb_events_pending;
		Matter.Engine.update(this.engine, current_time - this.frame);
	}
}

export class Game{
	public engine : Matter.Engine;
	public bar : Bar[] = [];
	public ball : Ball;
	public walls: { [x: string]: Matter.Body } = {};
	public runner : Matter.Runner;
	constructor(){
		this.engine = Matter.Engine.create();
		this.engine.gravity.y = 0;
		this.walls["top"] = Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true });
		this.walls["bottom"] = Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true });
		this.walls["left"] = Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true });
		this.walls["right"] = Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true });
		this.ball = new Ball(1280/2, 720/2, 10);
		Matter.Composite.add(this.engine.world, [this.ball.ball, this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
		this.runner = Matter.Runner.create();

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
	}
	start ()
	{
		for (let i = 0; i < this.bar.length; i++)
		{
			this.bar[i].reset();
		}
		this.ball.reset();
	}
	update(p: P5){
		for (let i = 0; i < this.bar.length; i++)
		{
			this.bar[i].show(p);
		}
		this.ball.show(p);
	}
}
