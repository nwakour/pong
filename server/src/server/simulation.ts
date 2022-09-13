import Matter from 'matter-js'

export class Ball {
	public ball : Matter.Body;
	public r: number;
	constructor(x: number, y: number, radius: number) {
		this.r = radius;
		this.ball = Matter.Bodies.polygon(x, y, 6, radius, {inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0,
			restitution: 1});
	}
}

export class Bar {
	public bar : Matter.Body;
	public width: number;
	public height: number;
	public key: { [x: string]: number } = {};
	public mov : number;
	public last : number;
	public check_nb : number;
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
		this.check_nb = 0;
		this.lastframe = null;
		this.lastkeytime = 0;
	}
}

export class Game{
	public engine : Matter.Engine;
	// public ball : Ball;
	public bars = new Map<string, Bar>()
	public walls =  new Map<string, Matter.Body>()
	// public start: boolean;
	public runner : Matter.Runner;
	public inter : NodeJS.Timer | null = null;
	constructor(){
		this.engine = Matter.Engine.create();
		// this.bar = new Bar(50, 300, 10, 100);
		this.engine.gravity.y = 0;
		this.walls.set("top",  Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true }))
		this.walls.set("bottom",  Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true }))
		this.walls.set("left",  Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true }))
		this.walls.set("right",  Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true }))
		Matter.World.add(this.engine.world, [this.walls.get("top")!, this.walls.get("bottom")!, this.walls.get("left")!, this.walls.get("right")!]);
		this.runner = Matter.Runner.create();
		Matter.Runner.run(this.runner, this.engine);
		// setInterval(this.update.bind(this), 1000/60);
	}

	public addBar(id: string, x: number, y: number, width: number, height: number){
		this.bars.set(id, new Bar(x, y, width, height));
		Matter.World.add(this.engine.world, this.bars.get(id)!.bar);
	}
	public removeBar(id: string){
		Matter.World.remove(this.engine.world, this.bars.get(id)!.bar);
		this.bars.delete(id);
	}
	public clear()
	{
		for (const bar of this.bars.values())
		{
			Matter.World.remove(this.engine.world, bar.bar);
		}
		this.bars.clear();
		for (const wall of this.walls.values())
		{
			Matter.World.remove(this.engine.world, wall);
		}
		this.walls.clear();
		clearInterval(this.inter!);
		this.inter = null;
		Matter.Runner.stop(this.runner);
	}
}
