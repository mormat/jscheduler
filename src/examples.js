const { Day } = require('./utils/date');

const sources = __EXAMPLES_SOURCES__;
const webpack_mode = __WEBPACK_MODE__;

var urlParams = new URLSearchParams(
    window.location.href.split('?')[1]
);

function buildModel(table) {
    
    const scripts = table.map( row => row[1]).filter( v => v);
    var currentScript = urlParams.has('p') ? urlParams.get('p'): scripts[0];
    
    const rows = table.map( ([label, script]) => {
        const updatedUrlParams = new URLSearchParams(urlParams);
        updatedUrlParams.set('p', script);
        
        const url    = '?' + updatedUrlParams;
        const active = (currentScript === script );
        const source = script in sources ? sources[script] : '';
        
        return { label, script, url, active, source }
    } );
    
    const activeRow = rows.find( r => r.active);
    
    return { rows, activeRow }
        
}

function getToday() {
    
    return new Day(Date.now());
    
}

function getEventsSample() {
    
    const today = new Day(Date.now());
    const start = today.getFirstDayOfWeek();
    
    return [
        { 
            start: start.addDays(1) + " 10:00", 
            label: "interview",
            bgColor: 'success',
        },
        { 
            start: start.addDays(5) + "2024-08-17 14:00", 
            label: "meeting",
            bgColor: 'warning',
        },
        { 
          label: "training course",
          start: start.addDays(3) + " 09:00",
          end  : start.addDays(5) + " 18:00",
          bgColor: "primary" 
        }
    ]
    
}

if (webpack_mode !== 'production') {
    // date stub
    if (urlParams.has('today')) {
        Date.now = function() { 
            return new Date(urlParams.get('today')).getTime()
        };
    }

    if (urlParams.has('debug')) {
        window.addEventListener('mousemove', function(e) {
            document.title = 'x=' + e.pageX + ',y=' + e.pageY;
        });
    }
}

module.exports = { buildModel, getToday };
