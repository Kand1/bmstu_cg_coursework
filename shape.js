import "./vector"

class sphere {
    constructor(r, pos, col) {
        this.r = r;
        this.pos = pos;
        this.col = col;
    }

    sphIntersection (ro, rd) {
        let oc = sub3(ro, this.pos)
        let b = dot3(oc, rd);
        let c = dot3(oc, oc) - this.r * this.r;
        let h = b * b - c;
        if(h < 0.0) return vec2(-1.0, -1.0);
        h = Math.sqrt(h);
        return vec2(-b - h, -b + h);
    }
}

class plane {
    constructor(vec3, w, col) {
        this.xyz = vec3;
        this.w = w;
        this.col = col;
    }

    plaIntersection (ro, rd) {
        return vec2(-(dot3(ro, this.xyz) + this.w) / dot3(rd, this.xyz), null);
    }
}