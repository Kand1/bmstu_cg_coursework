let vec2 = (x, y) => ({x, y});
let vec3 = (x, y, z) => ({x, y, z});
let vec4 = (vec3, w) => ({xyz: vec3, w});
let add2 = (a, b) => ({x: a.x + b.x, y: a.y + b.y});
let sub2 = (a, b) => ({x: a.x - b.x, y: a.y - b.y});
let mulS2 = (a, b) => ({x: a.x * b, y: a.y * b});
let mulS3 = (a, b) => ({x: a.x * b, y: a.y * b, z: a.z * b});
let add3 = (a, b) => ({x: a.x + b.x, y: a.y + b.y, z: a.z + b.z});
let sub3 = (a, b) => ({x: a.x - b.x, y: a.y - b.y, z: a.z - b.z});
let mul3 = (a, b) => ({x: a.x * b.x, y: a.y * b.y, z: a.z * b.z});
let dot2 = (a, b) => a.x * b.x + a.y * b.y;
let dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
let length2 = a => Math.sqrt(a.x * a.x + a.y * a.y);
let length3 = a => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
let norm2 = a => ({x: a.x / length2(a), y: a.y / length2(a)});
let norm3 = a => ({x: a.x / length3(a), y: a.y / length3(a), z: a.z / length3(a)});

let sphIntersect = (ro, rd, ce, ra) => {
    let oc = sub3(ro, ce)
    let b = dot3(oc, rd);
    let c = dot3(oc, oc) - ra * ra;
    let h = b * b - c;
    if(h < 0.0) return vec2(-1.0, -1.0);
    h = Math.sqrt(h);
    return vec2(-b - h, -b + h);
}

let plaIntersect = (ro, rd, p) => {
    return vec2(-(dot3(ro, p.xyz) + p.w) / dot3(rd, p.xyz), null);
}

let reflect = (rd, n) => {
    return sub3(rd, mulS3(mulS3(n, dot3(n, rd)), 2));
}

let findSpherePos = (number) => {
    let n = 1;
    let set = 0;
    while(true) {
        if(number > (2 * n * n + set)){
            set += 2 * n * n;
            n++;
        }
        else {
            break;
        }
    }
    posOnRing = number - set - 1;
    step = 3.1415 * 2 / (2*n*n)
    return vec3((n*2+1) * Math.cos(t / n + step * posOnRing),
                (n*2+1) * Math.sin(t / n + step * posOnRing), 0);
}
//-----------------------------------------------------

const MAX_DIST = 99999;
let camera = vec3(-12, 0, -5);
let light = norm3(vec3(-0.5, 0.75, -1));
let electronsAmount = 3;
let t = 0;
let delta = 0.1;


let cnv = document.getElementById('cnv');
let ctx = cnv.getContext('2d');
let w = cnv.width;
let h = cnv.height;
let decrease = 7;
let interval = null;

let startButton = document.getElementById('start_button');
startButton.addEventListener("click", () => {
    if (interval === null) {
        interval = setInterval(update, 34);
    } else {
        clearInterval(interval);
        interval = null;
    }
})

let scaleButton = document.getElementById('scale_button');
let scaleInput = document.getElementById('scale_input');
scaleButton.addEventListener("click", () => {
    if (scaleInput.value && scaleInput.value > 0) {
        decrease = scaleInput.value;
        update();
    }
})

let setButton = document.getElementById('set_button');
let setInput = document.getElementById('set_input');
setButton.addEventListener("click", () => {
    if (setInput.value && setInput.value >= 0) {
        electronsAmount = setInput.value;
        update();
    }
})


let direction =(event) => {
    if (event.keyCode === 87) {
        camera.x += 1;
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 68) {
        camera.y += 1;
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 83) {
        camera.x -= 1;
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 65) {
        camera.y -= 1;
        if (interval === null) {
            t -= delta;
            update();
        }
    }
}

document.addEventListener("keydown", direction);

let castRay = (ro, rd) => {
    let col;
    let minDist = vec2(MAX_DIST, MAX_DIST);
    let dist;
    let n;

    let spherePos = [vec3(0, 0, 0)];
    let sphereRad = [1];

    for (let i = 1; i <= electronsAmount; i++) {
        sphereRad[i] =  0.5;
        spherePos[i] = findSpherePos(i);
    }

    for (let i = 0; i <= electronsAmount; i++) {
        dist = sphIntersect(ro, rd, spherePos[i], sphereRad[i]);
        if (dist.x > 0 && dist.x < minDist.x) {
            minDist = dist;
            n = sub3(add3(ro, mulS3(rd, dist.x)), spherePos[i]);
            col = vec3(1, 0.2, 0.1);
        }
    }


    let planeNormal = vec3(0, 0, -1);
    dist = plaIntersect(ro, rd, vec4(planeNormal, 1));
    if (dist.x > 0 && dist.x < minDist.x) {
        minDist = dist;
        n = planeNormal;
        col = vec3(0.5, 0.5, 0.5);
    }


    if (minDist.x === MAX_DIST) {return vec3(0, 0, 0)}
    let diffuse = Math.max(0, dot3(light, n)) * 0.5 + 0.1;
    let reflected = sub3(rd, mulS3(mulS3(n, dot3(n, rd)), 2));
    let specular = Math.pow(Math.max(0, dot3(reflect(rd, n), light)), 16)*2;
    diffuse += specular;
    ro.x = add3(ro, mulS3(rd, (minDist.x - 0.001))).x;
    ro.y = add3(ro, mulS3(rd, (minDist.x - 0.001))).y;
    ro.z = add3(ro, mulS3(rd, (minDist.x - 0.001))).z;
    rd = n;
    return mulS3(col, diffuse);
}

let traceRay = (ro, rd) => {
    let col = castRay(ro, rd);
    if (col.x == 0) {return col}
    if (castRay(ro, light).x != 0) {

        col = mulS3(col, 0.5);

    }
    return col;
}

function update() {
    t += delta;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < w / decrease; i++) {
        for (let j = 0; j < h / decrease; j++) {
            let y = i / w * decrease * 2 - 1;
            let z = j / h * decrease * 2 - 1;
            let rayDirection = norm3(vec3(1, y, z));
            let ro = vec3(camera.x, camera.y, camera.z);
            let rd = vec3(rayDirection.x, rayDirection.y, rayDirection.z);
            let col = traceRay(ro, rd);
            col = `rgb(
            ${Math.floor(255 * Math.pow(col.x, 0.45))},
            ${Math.floor(255 * Math.pow(col.y, 0.45))},
            ${Math.floor(255 * Math.pow(col.z, 0.45))})`;
            ctx.fillStyle = col;
            ctx.fillRect(i * decrease, j * decrease, decrease, decrease);
        }
    }


}




update();



