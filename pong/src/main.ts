import {Socket, io} from 'socket.io-client'
import {CanvasView, Ball} from './canvas'

class client{
    private socket : Socket;
    private zone: CanvasView | null;
 
    constructor() {
        // this.socket = io('http://10.12.13.4:4000');
        this.socket = io('http://localhost:4000');
        this.zone = null;

        this.socket.on('connect', function () {
            console.log('connect')
            
        })
        
        document.addEventListener('keydown', (event) => {
            if (this.zone !== null) {
                this.zone.keydown(event.key)
                this.socket.emit('keydown', event.key ,this.zone.myball.id)
            }
        })
        document.addEventListener('keyup', (event) => {
            if (this.zone !== null) {
                this.zone.keyup(event.key)
                this.socket.emit('keyup', event.key ,this.zone.myball.id)
            }
        })

        this.socket.on('destroy', (id:string) => {
            console.log('destroy')
            if (this.zone !== null) {
                delete this.zone.balls[id];
            }
        })
        this.socket.on('message', function (message: any) {
            console.log(message)
            document.body.innerHTML += message + '<br/>'
        })
        this.socket.on('welcome', (id: string, x:number, y:number) => {
            console.log('welcome', 'id: ' + id, 'x: ' + x, 'y: ' + y)
            this.zone = new CanvasView('canvas', new Ball(id, x, y, 50, 'white', 1));
            this.socket.emit('thanks');
        })
        this.socket.on('update', (id: string, x: number, y: number) => {
            if (this.zone !== null && this.zone.myball.id !== id) {

                this.zone.balls[id].xpos = x;
                this.zone.balls[id].ypos = y;
            }

        })
        this.socket.on('newPlayer', (id: string, x: number, y: number) => {
          console.log('newPlayer ' + id)
          if (this.zone !== null) {
            this.zone.add_ball(new Ball(id, x, y, 50, 'white', 1));
          }
        })
        
    }
}

new client();
