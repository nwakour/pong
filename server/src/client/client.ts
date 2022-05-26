import {Socket, io} from 'socket.io-client'

import { CanvasView } from '../canvas/canvas'

class client{
    private socket : Socket;

    constructor() {
        this.socket = io();
        this.socket.on('connect', function () {
            console.log('connect')
            document.body.innerHTML = ''
        })
        
        document.addEventListener('keydown', () => {
            console.log('keydown')
            this.socket.emit('message', 'keydown')
        })

        this.socket.on('disconnect', function (message: any) {
            console.log('disconnect ' + message)
            document.body.innerHTML +=
                'Disconnected from Server : ' + message + '<br/>'
            //location.reload();
        })

        this.socket.on('message', function (message: any) {
            console.log(message)
            document.body.innerHTML += message + '<br/>'
        })
    }
}

new client();
new CanvasView('canvas');
