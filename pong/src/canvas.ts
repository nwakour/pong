import {Socket} from 'socket.io-client'
import P5 from 'p5'
import Matter from 'matter-js'
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
    public pending_events :[[number, number], [number, number], [number, number]][] = [];
    public corr_events :[[number, number], [number, number], [number, number]][] = [];
    constructor(x: number, y: number, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.bar = Matter.Bodies.rectangle(x, y, width, height, {isStatic: true});
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
    check(corr_ev : [ pos :[x: number, y:number], v: [vx: number, vy: number], par: [mov: number, diff: number]]){
        if (this.pending_events.length == 0)
        {
            // console.log("no ev");
            return;
        }
        const first_ev = this.pending_events[this.pending_events.length - 1];
        // console.log(first_ev);
        // console.log(corr_ev);
        if (first_ev !== undefined)
        {
            if (Math.floor(corr_ev[0][1] - corr_ev[1][1]) === Math.floor(first_ev[0][1] - first_ev[1][1]))
                this.pending_events.pop();
            else
            {
                // console.log("not same " + Math.floor(corr_ev[0][1] - corr_ev[1][1]) + " " + Math.floor(first_ev[0][1] - first_ev[1][1]));
                this.pending_events[this.pending_events.length - 1] = [[first_ev[0][0], corr_ev[0][1] - corr_ev[1][1] + first_ev[1][1]], [first_ev[1][0], first_ev[1][1]], [corr_ev[2][0],  first_ev[2][1]]];
                // console.log (this.pending_events[this.pending_events.length - 1]);
                for(let i = this.pending_events.length - 1; i > 0; --i)
                {
                    // const diff = this.ev[i - 1][2][1] - this.ev[i][2][1];
                    let py = this.pending_events[i][0][1] + (this.pending_events[i - 1][1][1] * this.pending_events[i - 1][2][1]);
                    if (py < 51)
                        py = 51;
                    else if (py > 669)
                        py = 669;
                    this.pending_events[i - 1] = [[this.pending_events[i - 1][0][0], py], [this.pending_events[i - 1][1][0], this.pending_events[i - 1][1][1]], [this.pending_events[i - 1][2][0], this.pending_events[i - 1][2][1]]];
                }
                Matter.Body.setVelocity(this.bar, {x: 0, y: this.pending_events[0][0][1] - this.bar.position.y});
                Matter.Body.setPosition(this.bar, {x: this.bar.position.x, y: this.pending_events[0][0][1]});
                // console.log(ev);
                this.pending_events.pop();
            }
        }
        else 
            console.log("undefined");
    }
}

export class Game{
    public engine : Matter.Engine;
    // public ball : Ball;
    public bar : Bar[] = [];
    public walls: { [x: string]: Matter.Body } = {};
    public start: boolean;
    public lastframe : number | null;
    constructor(){
        this.engine = Matter.Engine.create();
        this.start = false;
        // this.socket = socket;
        // this.ball = new Ball(300, 300, 20);
        // this.bar.push(new Bar(50, 300, 10, 100))
        this.engine.gravity.y = 0;
        this.walls["top"] = Matter.Bodies.rectangle(1280/2, 0, 1280, 10, { isStatic: true });
        this.walls["bottom"] = Matter.Bodies.rectangle(1280/2, 720, 1280, 10, { isStatic: true });
        this.walls["left"] = Matter.Bodies.rectangle(0, 720/2, 10, 720, { isStatic: true });
        this.walls["right"] = Matter.Bodies.rectangle(1280, 720/2, 10, 720, { isStatic: true });
        this.lastframe = null;
        // Matter.World.add(this.engine.world, [this.ball.ball, this.bar.bar, this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
        Matter.World.add(this.engine.world, [this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
        
        Matter.Runner.run(Matter.Runner.create(), this.engine);
        // Matter.Body.setVelocity(this.ball.ball, {x: -10, y: 0});
        
    }
    // Gamestart(ball: [number, number, number, number], bar: [number, number])
    // {
    //     this.start = true;
    //     Matter.Body.setVelocity(this.ball.ball, {x: ball[2], y: ball[3]});
    //     Matter.Body.setPosition(this.ball.ball, {x: ball[0], y: ball[1]});
    //     Matter.Body.setVelocity(this.bar.bar, {x: 0, y: 0});
    //     Matter.Body.setPosition(this.bar.bar, {x: bar[0], y: bar[1]});
    // }
    keydown(key: string, id : number){
        if (key === 'ArrowUp'){
            this.bar[id].mov = -1;
            this.bar[id].key['ArrowUp'] = 1;
        }
        if (key === 'ArrowDown'){
            this.bar[id].mov = 1;
            this.bar[id].key['ArrowDown'] = 1;
        }
    }
    keyup(key: string, id : number){
        if (key === 'ArrowUp'){
            this.bar[id].key['ArrowUp'] = 0;
            if (this.bar[id].key['ArrowDown'] === 1)
                this.bar[id].mov = 1;
            else
                this.bar[id].mov = 0;
        }
        if (key === 'ArrowDown'){
            this.bar[id].key['ArrowDown'] = 0;
            if (this.bar[id].key['ArrowUp'] === 1)
                this.bar[id].mov = -1;
            else
                this.bar[id].mov = 0;
        }
    }
    
    update(p: P5, sock:Socket){
        // if (this.start)
        // {
        //     // client.socket.emit('update', client.socket.id, ball.ball.position, bar.bar.position);
        //     this.ball.ev.push([this.ball.ball.position.x, this.ball.ball.position.y]);
        //     this.bar.ev.push([this.bar.bar.position.x, this.bar.bar.position.y]);
        // }

        if (this.lastframe === null)
        {
            this.lastframe = p.millis();
            return;
        }
        const diff = p.millis() - this.lastframe;
        this.lastframe = p.millis();
        // console.log(this.bar[0].corr_events.length, this.bar[0].pending_events.length);
        for (let i = 0; i < this.bar.length; i++)
        {
            while (this.bar[i].corr_events.length > 0)
            {
                this.bar[i].check(this.bar[i].corr_events[this.bar[i].corr_events.length - 1]);
                this.bar[i].corr_events.pop();
            }
            let py = this.bar[i].bar.position.y + (this.bar[i].mov * diff);
            if (py < 51)
                py = 51;
            else if (py > 669)
                py = 669;
            Matter.Body.setVelocity(this.bar[i].bar, {x: 0, y: py - this.bar[i].bar.position.y});
            Matter.Body.setPosition(this.bar[i].bar, {x: this.bar[i].bar.position.x, y: py});
            if (this.bar[i].last !== this.bar[i].mov)
            {
                const ev : [[number, number], [number, number], [number, number]] = [[this.bar[i].bar.position.x, this.bar[i].bar.position.y], [this.bar[i].bar.velocity.x, this.bar[i].bar.velocity.y] , [this.bar[i].mov, diff]];
                this.bar[i].pending_events.push(ev);
                this.bar[i].last = this.bar[i].mov;
                // console.log('push');
                // if (i === 0)
                sock.emit('move', this.bar[i].last);
            }
            this.bar[i].show(p);
        }
        
        // this.ball.show(p);
    }
}
