import "./index"

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
        camera.x += 0.25;
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 68) {
        camera.y += 0.25;
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 83) {
        camera.x -= 0.25;
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 65) {
        camera.y -= 0.25;
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 38) {
        light.x += 0.25;
        light = norm3(light);
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 39) {
        light.y += 0.25;
        light = norm3(light);
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 40) {
        light.x -= 0.25;
        light = norm3(light);
        if (interval === null) {
            t -= delta;
            update();
        }
    }
    if (event.keyCode === 37) {
        light.y -= 0.25;
        light = norm3(light);
        if (interval === null) {
            t -= delta;
            update();
        }
    }
}

document.addEventListener("keydown", direction);