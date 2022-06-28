// import {Socket} from 'socket.io-client'
import P5 from 'p5'
import Matter from 'matter-js'
export class Ball {
    public ball : Matter.Body;
    public r: number;
    
    constructor(x: number, y: number, radius: number) {
        this.r = radius;
        this.ball = Matter.Bodies.polygon(x, y, 6, radius, { restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0, inertia: Infinity});
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
    
    constructor(x: number, y: number, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.bar = Matter.Bodies.rectangle(x, y, width, height, { restitution: 1, friction: 0, frictionAir : 0, frictionStatic: 0 , density: Infinity});
    }

    show(p : P5) {
        Matter.Body.setVelocity(this.bar, {x: 0 , y: this.bar.velocity.y});
        let pos = this.bar.position;
        let angle = this.bar.angle;
        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(angle);
        p.rectMode(p.CENTER);
        p.rect(0, 0, this.width, this.height);
        p.pop();
    }
}

export class Game{
    // public socket : Socket;
    public engine : Matter.Engine;
    public ball : Ball;
    public bar : Bar;

    constructor(){
        this.engine = Matter.Engine.create();
        // this.socket = socket;
        this.ball = new Ball(50, 300, 50);
        this.bar = new Bar(1230, 300, 10, 100);
        this.engine.gravity.y = 0;
        Matter.World.add(this.engine.world, [
            Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true }),
            Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true }),
            Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true }),
            Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true })
        ]);
        Matter.Composite.add(this.engine.world, this.ball.ball);
        Matter.Composite.add(this.engine.world, this.bar.bar);
        let runner = Matter.Runner.create();
        Matter.Runner.run(runner, this.engine);
        Matter.Body.setVelocity(this.ball.ball, {x: 10, y: 5});
    }
    keyup(key: string){
        // console.log(this.ball);
        let bar = this.bar.bar;
        if (key === 'ArrowUp'){
            Matter.Body.setVelocity(bar, {x: bar.velocity.x, y: 0});
        }
        if (key === 'ArrowDown'){
            Matter.Body.setVelocity(bar, {x: bar.velocity.x, y: 0});
        }
    }

    keydown(key: string){
        // console.log(this.ball);
        let bar = this.bar.bar;
        if (key === 'ArrowUp'){
            Matter.Body.setVelocity(bar, {x: bar.velocity.x, y: -10});
        }
        if (key === 'ArrowDown'){
            Matter.Body.setVelocity(bar, {x: bar.velocity.x, y: 10});
        }
        console.log(bar);
    }

    

}

// export class CanvasView {
//     private canvas: HTMLCanvasElement;
//     private ctx: CanvasRenderingContext2D;
//     public myball : Ball;
//     private socket : Socket;
//     public balls : { [x: string]: Ball } = {};
//     private move: { [x: string]: number } = {};
//     private lastframe : number | null;


//     constructor(socket:Socket, canvasId: string, ball : Ball) {
//         this.socket = socket;
//         this.canvas = document.createElement('canvas') as HTMLCanvasElement;
//         this.myball = ball;
//         this.canvas.id = canvasId;
//         this.canvas.width = 1280;
//         this.canvas.height = 720;
//         this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
//         this.move["ArrowDown"] = 0;
//         this.move["ArrowUp"] = 0;
//         this.move["ArrowLeft"] = 0;
//         this.move["ArrowRight"] = 0;
//         this.lastframe = null;
//         document.body.appendChild(this.canvas);
//         requestAnimationFrame(this.draw.bind(this));
//     }

//     public createBalls() {
//         this.myball.drawBall(this.ctx);

//         for (let key in this.balls) {
//             this.balls[key].drawBall(this.ctx);
//         }
//     }

//     public createZone(x: number, y: number, width: number, height: number, color: string) {
//         this.ctx.beginPath();
//         this.ctx.rect(x, y, width, height);
//         this.ctx.fillStyle = color;
//         this.ctx.fill();
//         this.ctx.stroke();
//         this.ctx.closePath();
//     }

//     public keyup(move: string) {
//         this.move[move] = 0;
//     }

//     public keydown(move: string) {
//         this.move[move] = 1;
//     }

//     public draw(arg:number){
//         requestAnimationFrame(this.draw.bind(this));
//         if (this.lastframe === null) {
//             this.lastframe = arg;
//             return;
//         }
//         const diff = arg - this.lastframe;
//         this.lastframe = arg;
//         this.myball.move(this.socket, this.move, diff, this.canvas);


//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.createZone(0, 0, 1280, 720, 'white');
//         this.createBalls();
//     }
//     public add_ball(ball: Ball) {
//         console.log('add_ball')
//         this.balls[ball.id] = ball;
//     }
// }

// export class Ball{
    
//     public id: string;
//     public xpos: number;
//     public ypos: number;
//     private radius: number;
//     private color: string;
//     private speed: number;
//     private dx: number;
//     private dy: number;
//     private nb: number;
//     public validate: number;
//     public pending : { [x: number]: [number, number, number, number]} = [];

//     constructor(id:string, x: number, y: number, radius: number, color: string, speed:number) {
//         this.id = id;
//         this.xpos = x;
//         this.ypos = y;
//         this.radius = radius;
//         this.color = color;
//         this.speed = speed;
//         this.dx =  1 * this.speed;
//         this.dy =  1 * this.speed;
//         this.nb = 0;
//         this.validate = -1;
//     }
//     public drawBall(ctx : CanvasRenderingContext2D) {
//         ctx.beginPath();
//         ctx.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
//         ctx.fillStyle = this.color;
//         ctx.fill();
//         ctx.stroke();
//         ctx.closePath();
//     }
//     public move(socket: Socket, move : { [x: string]: number }, diff : number, canvas : HTMLCanvasElement) {
//         if (this.validate !== -1)
//         {
//             if (this.pending[this.validate][3] === 1)
//             {
//                 delete this.pending[this.validate];
//             }
//             else if (this.pending[this.validate][3] === -1)
//             {
//                 let x = this.pending[this.validate][0];
//                 let y = this.pending[this.validate][1];
//                 for(let i = this.validate + 1; i <= this.nb; ++i)
//                 {
//                     if (move["ArrowDown"] === 1) {
//                         if (y + this.radius + this.dy * this.pending[i][2] < canvas.height) {
//                             y += this.dy * this.pending[i][2];
//                         }
//                         else
//                         {
//                             y = canvas.height - this.radius;
//                         }
//                     }
//                     if (move['ArrowUp'] === 1) {
//                         if (y - this.radius - this.dy * this.pending[i][2] > 0) {
//                             y -= this.dy * this.pending[i][2];
//                         }
//                         else
//                         {
//                             y = this.radius;
//                         }
//                     }
//                     if (move['ArrowLeft'] === 1) {
//                         if (x - this.radius - this.dx * this.pending[i][2] > 0) {
//                             x -= this.dx * this.pending[i][2];
//                         }
//                         else
//                         {
//                             x = this.radius;
//                         }
//                     }
//                     if (move['ArrowRight'] === 1) {
//                         if (x + this.radius + this.dx * this.pending[i][2] < canvas.width) {
//                             x += this.dx * this.pending[i][2];
//                         }
//                         else
//                         {
//                             x = canvas.width - this.radius;
//                         }
//                     }
//                 }
//             }
//         }
//         let flag = false;
//         if (move["ArrowDown"] === 1) {
//             if (this.ypos + this.radius + this.dy * diff < canvas.height) {
//                 this.ypos += this.dy * diff;
//             }
//             else
//             {
//                 this.ypos = canvas.height - this.radius;
//             }
//             flag = true;
//         }
//         if (move['ArrowUp'] === 1) {
//             if (this.ypos - this.radius - this.dy * diff > 0) {
//                 this.ypos -= this.dy * diff;
//             }
//             else
//             {
//                 this.ypos = this.radius;
//             }
//             flag = true;
//         }
//         if (move['ArrowLeft'] === 1) {
//             if (this.xpos - this.radius - this.dx * diff > 0) {
//                 this.xpos -= this.dx * diff;
//             }
//             else
//             {
//                 this.xpos = this.radius;
//             }
//             flag = true;
//         }
//         if (move['ArrowRight'] === 1) {
//             if (this.xpos + this.radius + this.dx * diff < canvas.width) {
//                 this.xpos += this.dx * diff;
//             }
//             else
//             {
//                 this.xpos = canvas.width - this.radius;
//             }
//             flag = true;
//         }
        
//         if (flag){
//             this.pending[this.nb] = [this.xpos, this.ypos, diff, 0];
//             socket.emit('input', this.id,  this.xpos, this.ypos, this.nb,diff ,move);
//             ++this.nb;
//         }
//     }
    // public equals(obj: Ball) : boolean { 
    //     return this.id === obj.id;
    // }
// }

