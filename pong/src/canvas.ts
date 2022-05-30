import {Socket} from 'socket.io-client'

export class CanvasView {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public myball : Ball;
    private socket : Socket;
    public balls : { [x: string]: Ball } = {};
    private move: { [x: string]: number } = {};
    private lastframe : number | null;


    constructor(socket:Socket, canvasId: string, ball : Ball) {
        this.socket = socket;
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.myball = ball;
        this.canvas.id = canvasId;
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.move["ArrowDown"] = 0;
        this.move["ArrowUp"] = 0;
        this.move["ArrowLeft"] = 0;
        this.move["ArrowRight"] = 0;
        this.lastframe = null;
        document.body.appendChild(this.canvas);
        requestAnimationFrame(this.draw.bind(this));
    }

    public createBalls() {
        this.myball.drawBall(this.ctx);

        for (let key in this.balls) {
            this.balls[key].drawBall(this.ctx);
        }
    }

    public createZone(x: number, y: number, width: number, height: number, color: string) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    public keyup(move: string) {
        this.move[move] = 0;
    }

    public keydown(move: string) {
        this.move[move] = 1;
    }

    public draw(arg:number){
        requestAnimationFrame(this.draw.bind(this));
        if (this.lastframe === null) {
            this.lastframe = arg;
            return;
        }
        const diff = arg - this.lastframe;
        this.lastframe = arg;
        this.myball.move(this.socket, this.move, diff, this.canvas);


        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.createZone(0, 0, 1280, 720, 'white');
        this.createBalls();
    }
    public add_ball(ball: Ball) {
        console.log('add_ball')
        this.balls[ball.id] = ball;
    }
}

export class Ball{
    
    public id: string;
    public xpos: number;
    public ypos: number;
    private radius: number;
    private color: string;
    private speed: number;
    private dx: number;
    private dy: number;
    private nb: number;
    public validate: number;
    public pending : { [x: number]: [number, number, number, number]} = [];

    constructor(id:string, x: number, y: number, radius: number, color: string, speed:number) {
        this.id = id;
        this.xpos = x;
        this.ypos = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.dx =  1 * this.speed;
        this.dy =  1 * this.speed;
        this.nb = 0;
        this.validate = -1;
    }
    public drawBall(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    public move(socket: Socket, move : { [x: string]: number }, diff : number, canvas : HTMLCanvasElement) {
        if (this.validate !== -1)
        {
            if (this.pending[this.validate][3] === 1)
            {
                delete this.pending[this.validate];
            }
            else if (this.pending[this.validate][3] === -1)
            {
                let x = this.pending[this.validate][0];
                let y = this.pending[this.validate][1];
                for(let i = this.validate + 1; i <= this.nb; ++i)
                {
                    if (move["ArrowDown"] === 1) {
                        if (y + this.radius + this.dy * this.pending[i][2] < canvas.height) {
                            y += this.dy * this.pending[i][2];
                        }
                        else
                        {
                            y = canvas.height - this.radius;
                        }
                    }
                    if (move['ArrowUp'] === 1) {
                        if (y - this.radius - this.dy * this.pending[i][2] > 0) {
                            y -= this.dy * this.pending[i][2];
                        }
                        else
                        {
                            y = this.radius;
                        }
                    }
                    if (move['ArrowLeft'] === 1) {
                        if (x - this.radius - this.dx * this.pending[i][2] > 0) {
                            x -= this.dx * this.pending[i][2];
                        }
                        else
                        {
                            x = this.radius;
                        }
                    }
                    if (move['ArrowRight'] === 1) {
                        if (x + this.radius + this.dx * this.pending[i][2] < canvas.width) {
                            x += this.dx * this.pending[i][2];
                        }
                        else
                        {
                            x = canvas.width - this.radius;
                        }
                    }
                }
            }
        }
        let flag = false;
        if (move["ArrowDown"] === 1) {
            if (this.ypos + this.radius + this.dy * diff < canvas.height) {
                this.ypos += this.dy * diff;
            }
            else
            {
                this.ypos = canvas.height - this.radius;
            }
            flag = true;
        }
        if (move['ArrowUp'] === 1) {
            if (this.ypos - this.radius - this.dy * diff > 0) {
                this.ypos -= this.dy * diff;
            }
            else
            {
                this.ypos = this.radius;
            }
            flag = true;
        }
        if (move['ArrowLeft'] === 1) {
            if (this.xpos - this.radius - this.dx * diff > 0) {
                this.xpos -= this.dx * diff;
            }
            else
            {
                this.xpos = this.radius;
            }
            flag = true;
        }
        if (move['ArrowRight'] === 1) {
            if (this.xpos + this.radius + this.dx * diff < canvas.width) {
                this.xpos += this.dx * diff;
            }
            else
            {
                this.xpos = canvas.width - this.radius;
            }
            flag = true;
        }
        
        if (flag){
            this.pending[this.nb] = [this.xpos, this.ypos, diff, 0];
            socket.emit('input', this.id,  this.xpos, this.ypos, this.nb,diff ,move);
            ++this.nb;
        }
    }
    // public equals(obj: Ball) : boolean { 
    //     return this.id === obj.id;
    // }
}