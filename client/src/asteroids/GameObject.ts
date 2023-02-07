import p5 from 'p5';

interface GameObjectOptions {
    p: p5;
    x: number;
    y: number;
    visability?: boolean;
}

class GameObject {

    protected readonly p: p5;
    protected _position: p5.Vector;
    protected _visability: boolean;

    constructor({p, x, y, visability = false}: GameObjectOptions) {
        this.p = p;
        this._position = p.createVector(x, y);
        this._visability = visability;
    };
    
    get position(): p5.Vector {
        return this._position;
    }
    
    get visability(): boolean {
        return this._visability;
    }
    
    _draw(): void {
        if (this.visability) {
            this.p.push();
            this.draw();
            this.p.pop();
        };
    };
    
    // Meant to be over writen
    draw(): void {
        return;
    };
}