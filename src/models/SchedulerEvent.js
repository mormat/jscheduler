
const { date_add_hour } = require('@src/utils/date.js');

let lastId = 0;

class SchedulerEvent {
    
    #id;
    #values = {};
    #options = {};
    #deleted = false;
    
    constructor( values, options ) {
        this.#id      = options.id || lastId++;
        this.#values  = values || {};
        this.#options = options || {};
        this.init();
    }
    
    get values() {
        return this.#values;
    }
    
    get id() {
        return this.#id;
    }
    
    get start() {
        return this.#values['start'];
    }
    
    get end() {
        return this.#values['end'];
    }
    
    get label() {
        return this.#values['label'];
    }
    
    get color() {
        return this.#values['color'];
    }
    
    get bgColor() {
        return this.#values['bgColor'];
    }
    
    get length() {
        return this.end.getTime() - this.start.getTime();
    }
    
    get deleted() {
        return this.#deleted;
    }
    
    get styles() {
        const styles = {
            'color': this.color,
        }
        if (!bootstrapColors.includes(this.bgColor)) {
            styles['background-color'] = this.bgColor;
        }
        return styles;
    }
    
    get className() {
        if (bootstrapColors.includes(this.bgColor)) {
            return 'bg-' + this.bgColor;
        }
        return '';
    }
    
    // clone the current instance with a new Date Range
    cloneWith( newValues ) {
        const id            = this.#id;
        
        return new SchedulerEvent( 
            { ...this.values, ...newValues },
            this.#options
        );
    }
    
    update( values ) {
        this.#values = values;
        this.init();
        
        this.#options.onUpdate( this );
    }
    
    delete() {
        this.#deleted = true;
        
        this.#options.onUpdate( this );
    }
    
    init() {
        
        const start = new Date(this.#values.start);
        const end   = new Date(this.#values.end ? this.#values.end : date_add_hour(start, 2));
        
        const defaults = { bgColor: '#0288d1', color: 'white' };
        this.#values = { ...defaults, ...this.#values, start, end }
        
        this.#options = { onUpdate: () => {}, ...this.#options };
    }
    
}

const bootstrapColors = [
    'primary', 'secondary', 'success', 'danger', 
    'warning', 'info', 'light', 'dark', 'white'
]

module.exports = { SchedulerEvent }
