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
    // public key: { [x: string]: number } = {};
    public mov : number;
    public last : number;
    constructor(x: number, y: number, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.bar = Matter.Bodies.rectangle(x, y, width, height, {isStatic: true});
        // this.key["ArrowDown"] = 0;
        // this.key["ArrowUp"] = 0;
        this.mov = 0;
        this.last = 0;
    }
}

export class Game{
    public engine : Matter.Engine;
    // public ball : Ball;
    public bar : Bar;
    public walls: { [x: string]: Matter.Body } = {};
    public start: boolean;
    public runner : Matter.Runner;
    public lastframe : number | null;
    constructor(){
        this.engine = Matter.Engine.create();
        this.start = false;
        // this.ball = new Ball(300, 300, 20);
        this.bar = new Bar(400, 300, 10, 100);
        this.engine.gravity.y = 0;
        this.walls["top"] = Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true });
        this.walls["bottom"] = Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true });
        this.walls["left"] = Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true });
        this.walls["right"] = Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true });
        // Matter.World.add(this.engine.world, [this.ball.ball, this.bar.bar, this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
        Matter.World.add(this.engine.world, [this.bar.bar, this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
        this.runner = Matter.Runner.create();
        Matter.Runner.run(this.runner, this.engine);
        this.lastframe = null;
        // Matter.Body.setVelocity(this.ball.ball, {x: -10, y: 0});
        // setInterval(this.update.bind(this), 1000/60);
    }
    // Gamestart(ball: [number, number, number, number], bar: [number, number])
    // {
    //     this.start = true;
    //     Matter.Body.setVelocity(this.ball.ball, {x: ball[2], y: ball[3]});
    //     Matter.Body.setPosition(this.ball.ball, {x: ball[0], y: ball[1]});
    //     Matter.Body.setVelocity(this.bar.bar, {x: 0, y: 0});
    //     Matter.Body.setPosition(this.bar.bar, {x: bar[0], y: bar[1]});
    // }
    // keydown(key: string){
    //     if (key === 'ArrowUp'){
    //         this.bar.mov = -1;
    //         this.bar.key['ArrowUp'] = 1;
    //     }
    //     if (key === 'ArrowDown'){
    //         this.bar.mov = 1;
    //         this.bar.key['ArrowDown'] = 1;
    //     }
    // }
    // keyup(key: string){
    //     if (key === 'ArrowUp'){
    //         this.bar.key['ArrowUp'] = 0;
    //         if (this.bar.key['ArrowDown'] === 1)
    //             this.bar.mov = 1;
    //         else
    //             this.bar.mov = 0;
    //     }
    //     if (key === 'ArrowDown'){
    //         this.bar.key['ArrowDown'] = 0;
    //         if (this.bar.key['ArrowUp'] === 1)
    //             this.bar.mov = -1;
    //         else
    //             this.bar.mov = 0;
    //     }
    // }
}
