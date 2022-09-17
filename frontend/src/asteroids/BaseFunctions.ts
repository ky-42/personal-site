import p5 from "p5";

export const setup = (p: p5) => {
    p.createCanvas(p.windowWidth, p.windowHeight);
};

export const draw = (p: p5) => {
    p.background(34, 40, 49);
}

export const windowResized = (p: p5) => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    // TODO Check if ship is out the resized window
    // TODO Recenter the ship
}

export const mousePressed = (p: p5) => {
    
}
