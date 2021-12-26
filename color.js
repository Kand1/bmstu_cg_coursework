import "./vector"
import "./shape"

class color {

    constructor(x, y, z) {
        this.r = x;
        this.g = y;
        this.b = z;
    }

    colorToStr() {
        return `rgb(
            ${Math.floor(255 * Math.pow(this.x, 0.45))},
            ${Math.floor(255 * Math.pow(this.y, 0.45))},
            ${Math.floor(255 * Math.pow(this.z, 0.45))})`;
    }
}