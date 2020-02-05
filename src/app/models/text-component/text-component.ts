export class TextComponent {
    width: number;
    height: number;
    x_coordinate: number;
    y_coordinate: number;
    color: string;

    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x_coordinate = x;
        this.y_coordinate = y;
    }

    updateScore(ctx, text) {
        ctx.font = this.width + ' ' + this.height;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x_coordinate, this.y_coordinate);
    }
}
