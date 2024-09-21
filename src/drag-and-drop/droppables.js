const { Rectangle, calcDistance } = require('@src/utils/geom');

// @todo ElementDroppable ?
class ElementDraggableArea {
    
    #element;
    
    constructor(element) {
        this.#element = element;
    }
    
    getData(mouseEvent) {
        const data = { ...this.#element.dataset };

        if (mouseEvent) {
            const {x, y, width, height } = this.getRect();
            data['percentX'] = (mouseEvent.pageX - x) * 100 / width ;
            data['percentY'] = (mouseEvent.pageY - y) * 100 / height;
        }

        return data;
    }

    getRect() {
        const { x, y, width, height } = this.#element.getBoundingClientRect();
        
        return {
            x: x + window.scrollX, 
            y: y + window.scrollY,
            width, height
        };
    }


}

// @todo CompositeDroppable ?
class CompositeDraggableArea {

    #children;
    #type;

    constructor(children, type) {
        this.#children = children;
        this.#type     = type;
    }

    get type(){
        return this.#type;
    }

    getChildren()
    {
        this.#children;
    }

    getData(mouseEvent) {
        const child = this.getClosestChild(mouseEvent);
        return child ? child.getData(mouseEvent) : {}
    }

    getRect() {
        const rects = [];
        for (let child of this.#children) {
            rects.push(child.getRect());
        }
        return Rectangle.createBounding(rects);
        return new Rectangle({x: 0, y: 0, width: 0, height: 0});
    }

    getClosestChild(mouseEvent) {
        const point = {x: mouseEvent.pageX, y: mouseEvent.pageY}
        const childrenByDistance = {}

        const distances = [];
        for (let child of this.#children) {
            const childRect = new Rectangle(child.getRect());
            if (!childRect) continue;
            const distance = calcDistance(point, childRect.getCenter());
            distances.push(distance);

            childrenByDistance[distance] = child;
        }

        const lowest = Math.min(...distances);

        return childrenByDistance[lowest];
    }

}

function createDroppable( { draggableElement }) {
    
    const droppableTarget = draggableElement.getAttribute(
        'data-jscheduler-droppable-target'
    );
    const element = document.querySelector(droppableTarget);
    const type    = element.getAttribute('data-jscheduler-droppable-type');

    switch (type) {

        case 'days': {

            const children = [ ...element.querySelectorAll(
                'td[data-jscheduler-day]'
            ) ];

            return new CompositeDraggableArea(
                children.map( elt => new ElementDraggableArea(elt) )  ,
                type
            );

        }
        
        case 'timeline': {
               
            const children = [ ...element.querySelectorAll(
                '[data-daterange_start][data-daterange_end]'
            ) ];
            
            return new CompositeDraggableArea(
                children.map( elt => new ElementDraggableArea(elt) ),
                type
            );
            
        }
        
    }    
}

module.exports = { 
    createDroppable
}