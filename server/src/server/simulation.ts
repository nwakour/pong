import Matter from 'matter-js'

export class Snap{
	public check_nb : number;
	public x : number;
	public y : number;
	public vx : number;
	public vy : number;
	public mov : number;
	public t : number;
	constructor(check_nb: number ,x : number, y : number, vx : number, vy : number, mov : number, t: number) {
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
	public r: number;
	public x : number;
	public y : number;
	public pending_events : Snap[] = [];
	public check_nb : number;
	public lastframe : number | null;
	constructor(x: number, y: number, radius: number) {
		this.x = x;
		this.y = y;
		this.r = radius;
		this.ball = Matter.Bodies.polygon(x, y, 6, radius, {inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0,
			restitution: 1});
		this.check_nb = 0;
		this.lastframe = null;
	}
	reset()
	{
		console.log("ball reset");
		Matter.Body.setVelocity(this.ball, {x: this.x - this.ball.position.x, y: this.y - this.ball.position.y});
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
	public pending_events : Snap[] = [];
	public mov : number;
	public last : number;
	public check_nb : number;
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
		this.check_nb = 0;
		this.lastframe = null;
	}
	public reset()
	{
		console.log("reset");
		this.mov = 0;
		this.last = 0;
		this.check_nb = 0;
		this.lastframe = null;
		this.key["ArrowDown"] = 0;
		this.key["ArrowUp"] = 0;
		Matter.Body.setVelocity(this.bar, {x: this.x - this.bar.position.x, y: this.y - this.bar.position.y});
		Matter.Body.setPosition(this.bar, {x: this.x, y: this.y});
		Matter.Body.setVelocity(this.bar, {x: 0, y: 0});
	}
}

export class Game{
	public engine : Matter.Engine;
	public ball : Ball;
	public bars = new Map<string, Bar>()
	public walls: { [x: string]: Matter.Body } = {};
	public runner : Matter.Runner;
	public inter : NodeJS.Timer | null = null;
	public inter_updates : NodeJS.Timer | null = null;
	constructor(){
		console.log("Game created");
		this.engine = Matter.Engine.create();
		// this.bar = new Bar(50, 300, 10, 100);
		this.engine.gravity.y = 0;
		this.walls["top"] = Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true });
		this.walls["bottom"] = Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true });
		this.walls["left"] = Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true });
		this.walls["right"] = Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true });
		this.ball = new Ball(1280/2, 720/2, 10);
		Matter.Composite.add(this.engine.world, [this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
		this.runner = Matter.Runner.create();
		Matter.Runner.run(this.runner, this.engine);
		// setInterval(this.update.bind(this), 1000/60);
	}

	public addBar(id: string, x: number, y: number, width: number, height: number){
		console.log("Bar added");
		this.bars.set(id, new Bar(x, y, width, height));
		Matter.Composite.add(this.engine.world, this.bars.get(id)!.bar);
	}

	public removeBar(id: string){
		console.log("Bar removed");
		Matter.Composite.remove(this.engine.world, this.bars.get(id)!.bar);
		this.bars.delete(id);
	}

	public start(){
		console.log("Game started");
		for (const bar of this.bars.values())
		{
			bar.reset();
		}
		this.ball.reset();
		Matter.World.add(this.engine.world, this.ball.ball);
	}

	public clear()
	{
		console.log("Clear");
		for (const bar of this.bars.values())
		{
			Matter.Composite.remove(this.engine.world, bar.bar);
		}
		this.bars.clear();
		Matter.Composite.remove(this.engine.world, this.walls["top"]);
		Matter.Composite.remove(this.engine.world, this.walls["bottom"]);
		Matter.Composite.remove(this.engine.world, this.walls["left"]);
		Matter.Composite.remove(this.engine.world, this.walls["right"]);
		Matter.Composite.remove(this.engine.world, this.ball.ball);
		this.walls = {};
		Matter.Runner.stop(this.runner);
	}
}
