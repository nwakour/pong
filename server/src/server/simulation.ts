import * as SocketIO from 'socket.io'

export class simulation{
    private lastframe : number | null;
    private width: number;
    private height: number;
    public balls : { [x: string]: Ball } = {};

    constructor(width: number, height: number){
        this.lastframe = null;
        this.width = width;
        this.height = height
        setInterval(this.draw.bind(this), 10);

    }
    public add_ball(ball: Ball) {
        this.balls[ball.id] = ball;
            

    }
    public keyup(id: string ,move: string|null) {
        if (this.balls[id].mymove === move) {
            this.balls[id].mymove = null;
        }

    }
    public keydown(id: string, move: string|null) {
        this.balls[id].mymove = move;

    }
    public draw(){
        if (this.lastframe === null) {
            this.lastframe = Date.now();
            return;
        }
        const diff = Date.now() - this.lastframe;
        this.lastframe = Date.now();

        for (let key in this.balls) {
            this.balls[key].move(diff, this.height, this.width);
        }
    }
}


export class Ball{
    
    public socket : SocketIO.Socket;
    public id: string;
    public xpos: number;
    public ypos: number;
    public mymove: string|null;
    private radius: number;
    private speed: number;
    private dx: number;
    private dy: number;


    constructor(socket: SocketIO.Socket, id:string, x: number, y: number, radius: number, speed:number) {
        this.socket = socket;
        this.id = id;
        this.xpos = x;
        this.ypos = y;
        this.radius = radius;
        this.speed = speed;
        this.dx =  1 * this.speed;
        this.dy =  1 * this.speed;
        this.mymove = null;
    }
    public move(diff : number, height : number, width : number) {
       
        if (this.mymove === 'ArrowDown') {
            if (this.ypos + this.radius + this.dy * diff < height) {
                this.ypos += this.dy * diff;
            }
            else
            {
                this.ypos = height - this.radius;
            }
        }
        else if (this.mymove === 'ArrowUp') {
            if (this.ypos - this.radius - this.dy * diff > 0) {
                this.ypos -= this.dy * diff;
            }
            else
            {
                this.ypos = this.radius;
            }
        }
        else if (this.mymove === 'ArrowLeft') {
            if (this.xpos - this.radius - this.dx * diff > 0) {
                this.xpos -= this.dx * diff;
            }
            else
            {
                this.xpos = this.radius;
            }
        }
        else if (this.mymove === 'ArrowRight') {
            if (this.xpos + this.radius + this.dx * diff < width) {
                this.xpos += this.dx * diff;
            }
            else
            {
                this.xpos = width - this.radius;
            }
        }
        this.socket.broadcast.emit('update', this.id, this.xpos, this.ypos);

    }
    public equals(obj: Ball) : boolean { 
        return this.id === obj.id;
    }
}