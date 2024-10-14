/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

const { Scheduler } = require('./component');
const { format_date } = require('./utils/date');

function render(element, eventsOrSettings)
{
    
    const settings = Array.isArray(eventsOrSettings) ? 
        { events: eventsOrSettings } : 
        eventsOrSettings;
    
    const scheduler = new Scheduler(element, settings);
    
    scheduler.init(element);
    
    return scheduler;
    
}

const utils = { format_date }

module.exports = { render, utils }
