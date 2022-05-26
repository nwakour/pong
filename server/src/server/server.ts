import express from 'express'
import path from 'path'
import { Server as NetServer } from 'http'
import {Server, Socket} from 'socket.io'

const port: number = 3000

class App {
    private server: NetServer
    private port: number
    private io: Server

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        this.server = new NetServer(app)
        this.io = new Server(this.server)

        this.io.on('connection', (socket: Socket) => {
            console.log('a user connected : ' + socket.id)

            socket.emit('message', 'Hello ' + socket.id)

            socket.broadcast.emit(
                'message',
                'Everybody, say hello to ' + socket.id
            )
            socket.on('message', function (message: any) {
                console.log(message + ' from ' + socket.id)
            })
            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id)
            })
        })
    }

    public Start() {
        this.server.listen(this.port)
        console.log(`Server listening on port ${this.port}.`)
    }
}

new App(port).Start()
