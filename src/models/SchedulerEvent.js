
const { date_add_hour } = require('@src/utils/date.js');

let lastId = 0;

class SchedulerEvent {
    
    #originalEvent;
    #id;
    #start;
    #end;
    #label;
    #bgColor;
    #color; 
    
    static fromOriginalEvent( originalEvent ) {
        const id = lastId++;
        return new SchedulerEvent( { ...originalEvent, id, originalEvent } );
    }
    
    constructor( { id, start, end, label, bgColor, color, originalEvent }) {
        this.#originalEvent = originalEvent;
        this.#id    = id;
        this.#start = new Date(start);
        this.#end   = new Date(end ? end : date_add_hour(start, 2));
        this.#label = label;
        this.#bgColor = bgColor || '#0288d1';
        this.#color = color || 'white';
    }
    
    get id() {
        return this.#id;
    }
    
    get start() {
        return this.#start;
    }
    
    get end() {
        return this.#end;
    }
    
    get label() {
        return this.#label;
    }
    
    get color() {
        return this.#color;
    }
    
    get originalEvent() {
        return this.#originalEvent;
    }
    
    get length() {
        return this.end.getTime() - this.start.getTime();
    }
    
    get styles() {
        const styles = {
            'color': this.#color,
        }
        if (!bootstrapColors.includes(this.#bgColor)) {
            styles['background-color'] = this.#bgColor;
        }
        return styles;
    }
    
    get className() {
        if (bootstrapColors.includes(this.#bgColor)) {
            return 'bg-' + this.#bgColor;
        }
        return '';
    }
    
    withDateRange( { start, end } ) {
        const id            = this.#id;
        const originalEvent = this.#originalEvent;
        const label         = this.#label;
        const bgColor       = this.#bgColor;
        const color         = this.#color;
        
        return new SchedulerEvent( 
            { id, originalEvent, label, start, end, bgColor, color }
        );
    }
    
}

const bootstrapColors = [
    'primary', 'secondary', 'success', 'danger', 
    'warning', 'info', 'light', 'dark', 'white'
]

module.exports = { SchedulerEvent }
