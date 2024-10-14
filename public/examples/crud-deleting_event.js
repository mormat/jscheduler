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
    onEventClick: function(clickedEvent) {
        clickedEvent.delete();
    }
});
