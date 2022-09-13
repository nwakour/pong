import P5 from 'p5'
import Matter from 'matter-js'

export class Snap{
	public x : number;
	public y : number;
	public vx : number;
	public vy : number;
	public t : number;
	public mov : number;
	constructor(x : number, y : number, vx : number, vy : number, t : number, mov : number) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.t = t;
		this.mov = mov;
	}
}

export class Ball {
	public ball : Matter.Body;
	public r: number;
	public ev :[[number, number], [number, number], [string, number]][] = [];
	constructor(x: number, y: number, radius: number) {
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
}

export class Bar {
	public bar : Matter.Body;
	public width: number;
	public height: number;
	public key: { [x: string]: number } = {};
	public mov : number;
	public last : number;
	public pending_events = new Map<number, Snap>();
	public corr_events = new Map<number, Snap>();
	public nb_events_pending : number;
	public nb_events_corrected : number;
	public lastframe : number | null;
	public lastkeytime : number;
	constructor(x: number, y: number, width: number, height: number) {
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
		this.lastkeytime = 0;
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

	check(){
		if (!(this.corr_events.has(this.nb_events_corrected) && this.pending_events.has(this.nb_events_corrected)))
			return;
		let x = 0;
		let y = 0;
		let smt_changed : boolean = false;
		while (this.corr_events.has(this.nb_events_corrected) && this.pending_events.has(this.nb_events_corrected))
		{
			const last_corr_event = this.corr_events.get(this.nb_events_corrected);
			if (last_corr_event !== undefined) {
				x = last_corr_event.x;
				y = last_corr_event.y;
				smt_changed = true;
				console.log("corrected " + this.nb_events_corrected + " x " + x + " y " + y + " vx " + last_corr_event.vx + " vy " + last_corr_event.vy + " t " + last_corr_event.t + " mov " + last_corr_event.mov);
				console.log("delete pending " + this.pending_events.delete(this.nb_events_corrected));
				console.log("delete corr " + this.corr_events.delete(this.nb_events_corrected));
				++this.nb_events_corrected;
			}
		}
		if (smt_changed === false)
			return;
		for (let i = this.nb_events_corrected; i < this.nb_events_pending; ++i)
		{
			const last_pending_event = this.pending_events.get(i);
			if (last_pending_event === undefined)
			{
				console.log("missing event");
				return;
			}
			x += last_pending_event.vx;
			y += last_pending_event.vy;
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
	public walls: { [x: string]: Matter.Body } = {};
	
	constructor(){
		this.engine = Matter.Engine.create();
		this.engine.gravity.y = 0;
		this.walls["top"] = Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true });
		this.walls["bottom"] = Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true });
		this.walls["left"] = Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true });
		this.walls["right"] = Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true });
		Matter.World.add(this.engine.world, [this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
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
		this.bar[id].lastkeytime = new Date().getTime();
		this.bar[id].pending_events.set(this.bar[id].nb_events_pending, new Snap(this.bar[id].bar.position.x, this.bar[id].bar.position.y, this.bar[id].bar.velocity.x, this.bar[id].bar.velocity.y, this.bar[id].lastkeytime, this.bar[id].mov));
		this.bar[id].last = this.bar[id].mov;
		console.log("new event " + this.bar[id].nb_events_pending);
		console.log(this.bar[id].pending_events.get(this.bar[id].nb_events_pending));
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
		this.bar[id].lastkeytime = new Date().getTime();
		this.bar[id].pending_events.set(this.bar[id].nb_events_pending, new Snap(this.bar[id].bar.position.x, this.bar[id].bar.position.y, this.bar[id].bar.velocity.x, this.bar[id].bar.velocity.y, this.bar[id].lastkeytime, this.bar[id].mov));
		this.bar[id].last = this.bar[id].mov;
		console.log("new event " + this.bar[id].nb_events_pending);
		console.log(this.bar[id].pending_events.get(this.bar[id].nb_events_pending));
		++this.bar[id].nb_events_pending;
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
		}
	}
}
