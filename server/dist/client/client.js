import { io } from 'socket.io-client';
import { createCanvas } from 'canvas';
const canvas = createCanvas(200, 200);
class client {
    socket;
    constructor() {
        this.socket = io();
        this.socket.on('connect', function () {
            console.log('connect');
            document.body.innerHTML = '';
        });
        document.addEventListener('keydown', () => {
            console.log('keydown');
            this.socket.emit('message', 'keydown');
        });
        this.socket.on('disconnect', function (message) {
            console.log('disconnect ' + message);
            document.body.innerHTML +=
                'Disconnected from Server : ' + message + '<br/>';
            //location.reload();
        });
        this.socket.on('message', function (message) {
            console.log(message);
            document.body.innerHTML += message + '<br/>';
        });
    }
}
new client();
