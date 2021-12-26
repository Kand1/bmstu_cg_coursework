class vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add2(b) {
      return {x: this.x + b.x, y: this.y + b.y}
    }
    sub2(b) {
        return {x: this.x - b.x, y: this.y - b.y}
    }
    mulS2(b) {
        return {x: this.x * b.x, y: this.y * b.y}
    }
    dot2(b) {
        return this.x * b.x + this.y * b.y
    }
    length2() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    norm2() {
        return {x: this.x / length2(), y: this.y / length2()}
    }
}

class vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add3(b) {
        return {x: this.x + b.x, y: this.y + b.y, z: this.z + b.z}
    }
    sub3(b) {
        return {x: this.x - b.x, y: this.y - b.y, z: this.z - b.z}
    }
    mulS3(b) {
        return {x: this.x * b.x, y: this.y * b.y, z: this.z * b.z}
    }
    dot3(b) {
        return this.x * b.x + this.y * b.y + this.z * b.z
    }
    length3() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    norm3() {
        return {x: this.x / length3(), y: this.y / length3(), z: this.z / length3()}
    }
}

