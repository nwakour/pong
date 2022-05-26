export class CanvasView {
    canvas;
    ctx;
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        console.log(this.canvas);
    }
}
