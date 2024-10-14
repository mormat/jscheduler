// This example show how can an event can be created from a form
var element = document.getElementById('scheduler');

var scheduler = jscheduler.render(element, {
    viewMode: 'week',
    currentDate: '2024-09-17'
});

var newEvent = scheduler.createEvent();

// When validating the form, update the event like this
newEvent.update({ label: 'meeting', start: '2024-09-17 10:00'});
