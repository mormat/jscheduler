var element = document.getElementById('scheduler');

jscheduler.render(element, {
    viewMode: 'month',
    events: [
        { 
            label: 'presentation',    
            start: '2024-10-02 09:00', 
            end: '2024-10-05 13:00' 
        }
    ],
    eventsDraggable: true,
    onEventDrop: function(vars) {
        
        document.getElementById('comments').innerHTML = 
            vars.label + ' event dropped' + 
            ' at (' + vars.start.toDateString() + ' ' + 
                      vars.start.toTimeString().substring(0, 5) +
            ','     + vars.end.toDateString()   + ' ' + 
                      vars.end.toTimeString().substring(0, 5) +
            ')';
            
    }
});
