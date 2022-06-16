// import {Socket, io} from 'socket.io-client'
import {Game} from './canvas'

class client{
    // private socket : Socket;
    private Game : Game;
 
    constructor() {
        // this.socket = io('http://10.12.12.2:4000');
        // this.socket = io('http://localhost:4000');
        // this.zone = null;
        this.Game = new Game();
        // this.socket.on('connect', function () {
        //     console.log('connect')
            
        // })
        
        document.addEventListener('keydown', (event) => {
            // console.log(event.key);
            this.Game.keydown(event.key);
            // if (this.zone !== null) {
            //     this.zone.keydown(event.key)
                // this.socket.emit('keydown', event.key ,this.zone.myball.id)
            // }
        })
        document.addEventListener('keyup', (event) => {
            // console.log(event.key);
            this.Game.keyup(event.key);
            // if (this.zone !== null) {
            //     this.zone.keyup(event.key)
                // this.socket.emit('keyup', event.key ,this.zone.myball.id)
            // }
        })

        // this.socket.on('destroy', (id:string) => {
        //     console.log('destroy')
            // if (this.zone !== null) {
            //     delete this.zone.balls[id];
            // }
        // })
        // this.socket.on('message', function (message: any) {
        //     console.log(message)
        //     document.body.innerHTML += message + '<br/>'
        // })
        // this.socket.on('welcome', (id: string, x:number, y:number) => {
        //     console.log('welcome', 'id: ' + id, 'x: ' + x, 'y: ' + y)
        //     // this.zone = new CanvasView(this.socket, 'canvas', new Ball(id, x, y, 50, 'white', 1));
        //     this.socket.emit('thanks');
        // })
        // this.socket.on('update', (id: string, x: number, y: number, nb:number) => {
            // console.log('update ' + nb);
            // if (this.zone !== null) {
            //     if ( this.zone.myball.id !== id){
            //         this.zone.balls[id].xpos = x;
            //         this.zone.balls[id].ypos = y;
            //     }
            //     else
            //     {
                    
            //         if (this.zone.myball.pending[nb][0] !== x || this.zone.myball.pending[nb][1] !== y)
            //         {
            //             this.zone.myball.pending[nb][3] = -1;
            //             this.zone.myball.pending[nb][0] = x;
            //             this.zone.myball.pending[nb][1] = y;
            //             this.zone.myball.validate = nb;
            //         }
            //         else
            //             delete this.zone.myball.pending[nb];
            //     }
            // }
        // })
        // this.socket.on('newPlayer', (id: string, x: number, y: number) => {
        //   console.log('newPlayer ' + id)
        //   if (this.zone !== null) {
        //     this.zone.add_ball(new Ball(id, x, y, 50, 'white', 1));
        //   }
        // })
    }
}

new client();
