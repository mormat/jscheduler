var element = document.getElementById('scheduler');

jscheduler.render(element, {
    viewMode: 'week',
    viewMode: 'week',
    events: [
        { label: 'presentation',    start: '2024-10-03 09:00', end: '2024-10-03 13:00' }
    ],
    eventsResizeable: true,
    onEventResize: function(vars) {
        document.getElementById('comments').innerHTML = 
            vars.label + ' event resized' + 
            ' to ' + vars.end.toTimeString().substring(0, 5);
            
    }
});
