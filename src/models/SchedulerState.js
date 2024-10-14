
const { SchedulerEvent } = require('./SchedulerEvent');

class SchedulerState {

    #settings;
    
    constructor( settings ) {
        this.#settings = settings;
    }
    
    get currentDate() {
        if ( this.#settings.currentDate ) {
            return new Date( this.#settings.currentDate );
        }

        const dates = this.events.map(e => new Date(e.start)).filter(d => !isNaN(d));

        if (dates.length) {
            return Math.min( ...dates.map( d => d.getTime() ) );
        }

        return Date.now();
    }
    
    get events() {
        const { events } = this.#settings;
        return events.filter(function(event) {
            if (!event.start || !event.end || !event.label) {
                return false;
            }
            
            return true;
        });
    }
    
}

module.exports = { SchedulerState }
