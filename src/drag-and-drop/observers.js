
const { DateRange, format_date } = require('@src/utils/date');

function getColumnDragAndDropObserver( { views, parentElement } ) {
    
    let clone = null;
    let initialDragArea = null;
    
    function onDrag( { mouseEvent, droppable } ) {
        clone = parentElement.cloneNode(true);
        clone.style['display'] = 'none';
        document.body.appendChild(clone);
                
        // @targetRole should not be in dataset
        initialDragArea = droppable.getClosestChild(mouseEvent);
    }
    
    function onMove( { mouseEvent, draggable, droppable }) {
        
        const area = (
            draggable.type === 'resize_event' ? 
            initialDragArea :
            droppable.getClosestChild(mouseEvent)
        );

        const { day, minhour, maxhour } = area.getData(mouseEvent);

        const constraint = new DateRange(
            day + ' ' + minhour,
            day + ' ' + maxhour
        );

        const currentValue = draggable.getCurrentValue();
        const { start, end } = currentValue;
        
        const topPercent    = Math.max(constraint.calcPercentPosition(start) / 100, 0);
        const heightPercent = Math.min(constraint.calcPercentPosition(end  ) / 100, 1) - topPercent;

        const rect  = area.getRect();
        clone.style['position'] = 'absolute';
        clone.style['display']  = 'block';
        clone.style['left']     = rect.x + 'px';
        clone.style['width']    = rect.width + 'px';
        clone.style['height']   = (rect.height * heightPercent) + 'px';
        clone.style['top']      = (rect.y + rect.height * topPercent) + 'px';

        clone.innerHTML = views['days'].renderInnerEvent({
            event: currentValue
        });

        parentElement.style['display'] = 'none';
    }
    
    function onDrop() {
        document.body.removeChild(clone);
        clone = null;
    }

    return { onDrag, onMove, onDrop }
}

function getTimelineDragAndDropObserver( { parentElement } ) {
    
    let clone = null;
    
    function onDrag({ mouseEvent }) {
        
        clone = parentElement.cloneNode(true);
        clone.style['display'] = 'none';
        document.body.appendChild(clone);
    }
    
    function onMove({ mouseEvent, draggable, droppable }) {
        
        const child  = droppable.getClosestChild(mouseEvent);

        const droppableData = child.getData(mouseEvent);

        const constraint = new DateRange(
            droppableData['daterange_start'],
            droppableData['daterange_end'],
        );

        const currentValue = draggable.getCurrentValue();
        const start = format_date("yyyy-mm-dd", currentValue.start) + ' 00:00:00';
        const end   = format_date("yyyy-mm-dd", currentValue.start) + ' 23:59:59';
        
        const leftPercent  = Math.max(constraint.calcPercentPosition(start) / 100, 0);
        const widthPercent = Math.min(constraint.calcPercentPosition(end  ) / 100, 1) - leftPercent;

        const rect  = child.getRect();
        clone.style['position'] = 'absolute';
        clone.style['display']  = 'block';
        clone.style['top']      = rect.y + 'px';
        clone.style['width']   = (rect.width * widthPercent) + 'px';
        clone.style['left']    = (rect.x + rect.width * leftPercent) + 'px';
        
        parentElement.style['display'] = 'none';

    }
    
    function onDrop({ mouseEvent }) {
        
        document.body.removeChild(clone);
        clone = null;
    }
    
    return { onDrag, onMove, onDrop }
}

// @todo rename parentElement to draggableElement
function createDragAndDropObserver({ droppable, views, parentElement }) {
    
    switch (droppable.type) {

        case 'days': 
        
            return getColumnDragAndDropObserver( { views, parentElement } );
            
        case 'timeline':
            
            return getTimelineDragAndDropObserver( { parentElement } );
        
    }
    
}

module.exports = { 
    createDragAndDropObserver
} 
