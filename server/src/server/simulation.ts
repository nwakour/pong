import * as SocketIO from 'socket.io'

export class simulation{
    private server : SocketIO.Server;
    // private lastframe : number | null;
    private width: number;
    private height: number;
    public balls : { [x: string]: Ball } = {};

    constructor(server: SocketIO.Server, width: number, height: number){
        this.server = server;
        // this.lastframe = null;
        this.width = width;
        this.height = height
        setInterval(this.draw.bind(this), 1000/60);

    }
    public add_ball(ball: Ball) {
        this.balls[ball.id] = ball;
            

    }
    // public keyup(id: string ,move: string|null) {
    //     if (this.balls[id].mymove === move) {
    //         this.balls[id].mymove = null;
    //     }

    // }
    // public keydown(id: string, move: string|null) {
    //     this.balls[id].mymove = move;

    // }
    public draw(){
        // if (this.lastframe === null) {
        //     this.lastframe = Date.now();
        //     return;
        // }
        // const diff = Date.now() - this.lastframe;
        // this.lastframe = Date.now();

        for (let key in this.balls) {
            this.balls[key].move(this.server , this.height, this.width);
        }
    }
}


export class Ball{
    
    public id: string;
    public xpos: number;
    public ypos: number;
    private radius: number;
    private speed: number;
    private dx: number;
    private dy: number;
    private nb: number;
    public events : { [x: number]: [number, number, number,  { [x: string]: number }]} = [];

    constructor(id:string, x: number, y: number, radius: number, speed:number) {
        this.id = id;
        this.xpos = x;
        this.ypos = y;
        this.radius = radius;
        this.speed = speed;
        this.dx =  1 * this.speed;
        this.dy =  1 * this.speed;
        this.nb = 0
    }
    public move(server: SocketIO.Server, height : number, width : number) {
        
        let flag = false;
        if (this.events[this.nb] === undefined)
            return;
        if (this.events[this.nb][3]['ArrowDown'] === 1) {
            if (this.ypos + this.radius + this.dy * this.events[this.nb][2] < height) {
                this.ypos += this.dy * this.events[this.nb][2];
            }
            else
            {
                this.ypos = height - this.radius;
            }
            flag = true;
        }
        if (this.events[this.nb][3]['ArrowUp'] === 1) {
            if (this.ypos - this.radius - this.dy * this.events[this.nb][2] > 0) {
                this.ypos -= this.dy * this.events[this.nb][2];
            }
            else
            {
                this.ypos = this.radius;
            }
            flag = true;
        }
        if (this.events[this.nb][3]['ArrowLeft'] === 1) {
            if (this.xpos - this.radius - this.dx * this.events[this.nb][2] > 0) {
                this.xpos -= this.dx * this.events[this.nb][2];
            }
            else
            {
                this.xpos = this.radius;
            }
            flag = true;
        }
        if (this.events[this.nb][3]['ArrowRight'] === 1) {
            if (this.xpos + this.radius + this.dx * this.events[this.nb][2] < width) {
                this.xpos += this.dx * this.events[this.nb][2];
            }
            else
            {
                this.xpos = width - this.radius;
            }
            flag = true;
        }
        if (flag){
            this.events[this.nb][0] = this.xpos;
            this.events[this.nb][1] = this.ypos;
            server.emit('update', this.id, this.xpos, this.ypos, this.nb);
            ++this.nb;
        }

    }
    // public equals(obj: Ball) : boolean { 
    //     return this.id === obj.id;
    // }
}