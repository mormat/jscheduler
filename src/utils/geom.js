
class Rectangle
{
    x;
    y;
    width;
    height;

    constructor({ x, y, width, height }) {

        this.x = x;
        this.y = y;
        this.width  = width;
        this.height = height;
    }

    get top() {
        return this.y;
    }   

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }

    contains(anotherRect) {
        
        return (
            this.x  <=  anotherRect.x &&
            this.y  <=  anotherRect.y &&
            anotherRect.x + anotherRect.width  <= this.x + this.width &&
            anotherRect.y + anotherRect.height <= this.y + this.height
        )
    }

    // @todo missing test
    includes(point) {
        return (
            this.x <= point.x &&
            this.y <= point.y &&
            point.x <= this.x + this.width &&
            point.y <= this.y + this.height
        )
    }

    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
        }
    }

    intersectsWith(rect) {
        return  !(
            rect.x > this.x + this.width ||
            rect.x + rect.width < this.x ||
            rect.y > this.y + this.height || 
            rect.y + rect.height < this.y
        );

    }

    static createBounding(rects) {
        const x = Math.min(...rects.map(r => r.x));
        const y = Math.min(...rects.map(r => r.y));
        const right = Math.max(...rects.map(r => r.x + r.width)); 
        const bottom = Math.max(...rects.map(r => r.y + r.height));

        return new Rectangle({x, y, width: right - x, height: bottom - y})
    }
}

function calcDistance(a, b) {
    return Math.sqrt(
        Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)
    )
}

module.exports = { Rectangle, calcDistance }
