/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

const { Scheduler } = require('./component');

function render(element, eventsOrSettings)
{
    
    const settings = Array.isArray(eventsOrSettings) ? 
        { events: eventsOrSettings } : 
        eventsOrSettings;
    
    const scheduler = new Scheduler(element, settings);
    
    scheduler.init(element);
    
    return scheduler;
    
}

module.exports = { render }
