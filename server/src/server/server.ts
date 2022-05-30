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
                // origin: 'http://10.12.12.2:3000',
                origin: 'http://localhost:3000',
                credentials: true
            }
        })
        this.simu = new simulation(this.io, 1280, 720) ;
        this.io.on('connection', (socket: SocketIO.Socket) => {
            console.log('a user connected : ' + socket.id)
            const rand = (min:number, max:number) => Math.floor(Math.random() * (max - min)) + min;
            const x = rand(50, 1280 - 50);
            const y = rand(50, 720 - 50);
            socket.emit('welcome', socket.id, x, y)

            socket.broadcast.emit('newPlayer',socket.id, x, y)

            for (let key in this.simu.balls) {
                socket.emit('newPlayer', this.simu.balls[key].id, this.simu.balls[key].xpos, this.simu.balls[key].ypos)
            }
            this.simu.add_ball(new Ball(socket.id, x, y, 50, 1));
            
            socket.on('thanks', function () {
                console.log('thanks from ' + socket.id)
            })
            socket.on('input', (id: string, xpos: number, ypos: number, nb:number, speed: number ,move:{ [x: string]: number }) => {
                console.log(nb);
                this.simu.balls[id].events[nb] = [xpos, ypos, speed, move];

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
