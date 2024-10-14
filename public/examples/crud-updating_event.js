// This example show how can an event can be updated from a form when clicking on it
var element = document.getElementById('scheduler');

jscheduler.render(element, {
    viewMode: 'week',
    events: [{ 
        label: 'meeting', 
        start: '2024-09-17 10:00', 
        end:   '2024-09-17 12:00',
        custom_id: '1234',
    }],
    eventsClickable: true,
    onEventClick: function(editedEvent) {
        
        // Retrieve the current values to display on the form
        var values = editedEvent.values;
        document.getElementById('comments').innerHTML = 
            'label=' + values.label + ',' +
            'start=' + values.start.getTime() + ',' +
            'end='   + values.end.getTime() + ',' +
            'custom_id' + values.custom_id;
    
        // When validating the form, update the event like this
        editedEvent.update({ 
            label: 'interview', 
            start: '2024-09-17 14:00',
            end:   '2024-09-17 16:00',
        });

    }
});
