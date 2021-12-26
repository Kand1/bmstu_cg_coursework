import "./color"
import "./shape"
import "./vector"

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


let spherePos = [vec3(0, 0, 0)];
let sphereRad = [1];

for (let i = 1; i <= electronsAmount; i++) {
    sphereRad[i] =  0.5;
    spherePos[i] = findSpherePos(i);
}

let traceRay = (ro, rd) => {
    let col = castRay(ro, rd);
    if (col.x === 0) {return col}
    if (castRay(ro, light).x !== 0) {
        col = mulS3(col, 0.5);
    }

    return col;
}

let castRay = (ro, rd) => {
    let col;
    let minDist = vec2(MAX_DIST, MAX_DIST);
    let dist;
    let n;

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
    return mulS3(col, diffuse);
}

function update() {
    t += delta;
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