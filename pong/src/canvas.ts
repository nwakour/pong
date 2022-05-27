
export class CanvasView {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public myball : Ball;
    public balls : { [x: string]: Ball } = {};
    private move: string|null;
    private lastframe : number | null;


    constructor(canvasId: string, ball : Ball) {
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.myball = ball;
        this.canvas.id = canvasId;
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.move = null;
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

    public keyup(move: string|null) {
        if (this.move === move) {
            this.move = null;
        }
    }

    public keydown(move: string|null) {
        this.move = move;
    }

    public draw(arg:number){
        requestAnimationFrame(this.draw.bind(this));
        if (this.lastframe === null) {
            this.lastframe = arg;
            return;
        }
        const diff = arg - this.lastframe;
        this.lastframe = arg;
        this.myball.move(this.move, diff, this.canvas);


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


    constructor(id:string, x: number, y: number, radius: number, color: string, speed:number) {
        this.id = id;
        this.xpos = x;
        this.ypos = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.dx =  1 * this.speed;
        this.dy =  1 * this.speed;
    }
    public drawBall(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    public move(move : string | null, diff : number, canvas : HTMLCanvasElement) {
        
        if (move === 'ArrowDown') {
            if (this.ypos + this.radius + this.dy * diff < canvas.height) {
                this.ypos += this.dy * diff;
            }
            else
            {
                this.ypos = canvas.height - this.radius;
            }
        }
        else if (move === 'ArrowUp') {
            if (this.ypos - this.radius - this.dy * diff > 0) {
                this.ypos -= this.dy * diff;
            }
            else
            {
                this.ypos = this.radius;
            }
        }
        else if (move === 'ArrowLeft') {
            if (this.xpos - this.radius - this.dx * diff > 0) {
                this.xpos -= this.dx * diff;
            }
            else
            {
                this.xpos = this.radius;
            }
        }
        else if (move === 'ArrowRight') {
            if (this.xpos + this.radius + this.dx * diff < canvas.width) {
                this.xpos += this.dx * diff;
            }
            else
            {
                this.xpos = canvas.width - this.radius;
            }
        }
    }
    public equals(obj: Ball) : boolean { 
        return this.id === obj.id;
    }
}