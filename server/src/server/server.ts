import path from 'path'
import express from 'express'

import * as http from 'http'
import * as SocketIO from 'socket.io'

import { simulation , Ball } from './simulation'

const port: number = 4000

class App {
    private server: http.Server
    private port: number
    private io: SocketIO.Server
    private simu : simulation

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../../../pong')))

        this.server = new http.Server(app)
        this.io = new SocketIO.Server(this.server, {
            cors: {
                // origin: 'http://10.12.13.4:3000',
                origin: 'http://localhost:3000',
                credentials: true
            }
        })
        this.simu = new simulation(1280, 720) ;
        this.io.on('connection', (socket: SocketIO.Socket) => {
            console.log('a user connected : ' + socket.id)
            let x = Math.floor(Math.random() * 1280)
            let y = Math.floor(Math.random() * 720)
            socket.emit('welcome', socket.id, x, y)

            socket.broadcast.emit('newPlayer',socket.id, x, y)

            for (let key in this.simu.balls) {
                socket.emit('newPlayer', this.simu.balls[key].id, this.simu.balls[key].xpos, this.simu.balls[key].ypos)
            }
            this.simu.add_ball(new Ball(socket, socket.id, x, y, 50, 1));
            
            socket.on('thanks', function () {
                console.log('thanks from ' + socket.id)
            })
            socket.on('keydown', (key:string, id: string) => {
                this.simu.keydown(id, key)

            })

            socket.on('keyup', (key:string, id: string) => {
                this.simu.keyup(id, key);
  
            })

            socket.on('disconnect', () => {
                console.log('socket disconnected : ' + socket.id)
                socket.broadcast.emit('destroy', socket.id);
                delete this.simu.balls[socket.id];
                
            })
        })
    }

    public Start() {
        this.server.listen(this.port)
        console.log(`Server listening on port ${this.port}.`)
    }
}

new App(port).Start()
