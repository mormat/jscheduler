
const { DateRange, format_date } = require('@src/utils/date');

class AbstractDraggable {

    drag() {};

    move() {};

    drop() {};

    // @todo missing unit test
    startDragAndDrop({ mouseEvent, observer, droppable }) {

        mouseEvent.preventDefault();
        if (mouseEvent.button !== 0) return;

        const draggable = this;

        this.drag({ mouseEvent, droppable });
        observer.onDrag({ mouseEvent, draggable, droppable });

        const onMouseMove = (mouseEvent) => {
            this.move({ mouseEvent, droppable });
            observer.onMove({ mouseEvent, draggable, droppable });
        }
        const onMouseUp   = (mouseEvent) => {
            this.drop({ mouseEvent, droppable });
            observer.onDrop({ mouseEvent, draggable, droppable });
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

}

class TimelineDraggable extends AbstractDraggable {
    
    #initialValue;
    #currentValue;
    #onChange;

    constructor(schedulerEvent, onChange)
    {
        super();
        this.#initialValue = schedulerEvent;
        this.#onChange = onChange;
    }

    getCurrentValue() {
        return this.#currentValue;
    }

    drag() {
        this.#currentValue = this.#initialValue;
    }

    move({ mouseEvent, droppable }) {
        
        const droppableData = droppable.getData(mouseEvent);
        
        const timelineDaterange = new DateRange(
            droppableData['daterange_start'],
            droppableData['daterange_end'],
        );
        
        let { percentX } = droppableData;
        percentX = Math.min(percentX, 100);
        percentX = Math.max(percentX, 0);
        
        let start = timelineDaterange.start.getTime();
        start += timelineDaterange.length * percentX / 100;
        start = new Date(
            format_date('yyyy-mm-dd', start) + ' ' + 
            format_date('hh:ii:ss', this.#initialValue.start)
        );
        const end = start.getTime() + this.#initialValue.length;
        
        this.#currentValue = this.#currentValue.cloneWith( { start, end } );
        
    }

    drop() {
        
        const { start, end } = this.#currentValue;
        const valuesBefore = this.#initialValue.values;
        this.#initialValue.update({ ...valuesBefore, start, end });
        this.#onChange(this.#initialValue, valuesBefore);
        
    }

}

class MoveEventDraggable extends AbstractDraggable {

    #initialValue;
    #currentValue = null;
    #onChange;
    #diff = 0;

    constructor(schedulerEvent, onChange)
    {
        super();
        this.#initialValue = schedulerEvent;
        this.#onChange     = onChange;
    }

    getCurrentValue() {
        return this.#currentValue;
    }

    getCurrentTimestamp({ mouseEvent, droppable }) {

        const { percentY, day, minhour, maxhour } = droppable.getData(mouseEvent);
        
        const constraint = new DateRange(
            day + ' ' + minhour,
            day + ' ' + maxhour,
        );
        
        return constraint.start.getTime() + (constraint.length * percentY / 100);

    }

    drag({ mouseEvent, droppable }) {
        
        this.#currentValue = this.#initialValue;
        
        const currentTimestamp = this.getCurrentTimestamp({ mouseEvent, droppable });
        
        this.#diff = this.#initialValue.start.getTime() - currentTimestamp;
        
    }

    move({ mouseEvent, droppable }) {

        const { day, minhour, maxhour } = droppable.getData(mouseEvent);
        
        const constraint = new DateRange(
            day + ' ' + minhour,
            day + ' ' + maxhour,
        );

        const currentTimestamp = this.getCurrentTimestamp({ mouseEvent, droppable });

        let startTime = currentTimestamp + this.#diff;
        
        startTime = startTime - (startTime % (15 * 60 * 1000));

        if (startTime < constraint.start.getTime()) {
            startTime = constraint.start.getTime();
        }
        
        if (startTime + this.#initialValue.length > constraint.end.getTime()) {
            startTime = constraint.end.getTime() - this.#initialValue.length;
        }
        
        this.#currentValue = this.#currentValue.cloneWith({
            start: startTime,
            end:   startTime + this.#initialValue.length
        });

    }

    drop() {
        
        const { start, end } = this.#currentValue;
        const valuesBefore = this.#initialValue.values;
        this.#initialValue.update({ ...valuesBefore, start, end });
        this.#onChange(this.#initialValue, valuesBefore);
        
    }

}

class ResizeEventDraggable extends AbstractDraggable {

    #initialValue;
    #onChange;
    #currentValue = null;
    #initialConstraint = null;

    constructor(value, onChange)
    {
        super();
        this.#initialValue = value;
        this.#onChange     = onChange;
    }

    getCurrentValue()
    {
        return this.#currentValue;
    }
    
    get type() {
        return 'resize_event';
    }

    getCurrentTimestamp( { mouseEvent, droppable }) {

        const { percentY, day, minhour, maxhour } = droppable.getData(mouseEvent);
        
        const constraint = new DateRange(
            day + ' ' + minhour,
            day + ' ' + maxhour
        );

        return constraint.start.getTime() + (constraint.length * percentY / 100);
    }

    drag({ mouseEvent, droppable }) {
        
        const { day, minhour, maxhour } = droppable.getData(mouseEvent);
        
        this.#initialConstraint = new DateRange(
            day + ' ' + minhour,
            day + ' ' + maxhour
        );
        
        this.#currentValue = this.#initialValue;
    }

    move({ mouseEvent, droppable }) {
        
        const { percentY, day, minhour, maxhour } = droppable.getData(mouseEvent);
        
        const constraint = new DateRange(
            day + ' ' + minhour,
            day + ' ' + maxhour
        );

        let endTime = this.getCurrentTimestamp( { mouseEvent, droppable } );
        endTime = endTime - (endTime % (15 * 60 * 1000));

        if (endTime > this.#initialConstraint.end.getTime()) {
            endTime = this.#initialConstraint.end.getTime();
        }

        if (endTime < this.#initialValue.start.getTime()) {
            endTime = this.#initialValue.start.getTime() + 15 * 60 * 1000;
        }

        this.#currentValue = this.#currentValue.cloneWith({
            start: this.#currentValue.start,
            end:   endTime
        });

    }

    drop() {
        
        const { start, end } = this.#currentValue;
        const valuesBefore = this.#initialValue.values;
        this.#initialValue.update({ ...valuesBefore, start, end });
        this.#onChange(this.#initialValue, valuesBefore);
        
    }

}


function createDraggable( draggableType, { schedulerEvent, onChange } ) {
    
    if (draggableType === 'move_event_timeline') {
        return new TimelineDraggable( schedulerEvent, onChange);
    }
    
    if (draggableType === 'move_event_day') {
        return new MoveEventDraggable(schedulerEvent, onChange);
    }
    
    if (draggableType === 'resize_event') {
        return new ResizeEventDraggable(schedulerEvent, onChange);
    }
}

module.exports = { createDraggable }