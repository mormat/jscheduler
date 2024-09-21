var element = document.getElementById('scheduler');

jscheduler.render(element, {
    viewMode: 'week',
    events: [
        { label: 'presentation',    start: '2024-10-03 09:00', end: '2024-10-03 13:00' },
        { label: 'training course', start: '2024-10-01 08:00', end: '2024-10-02 19:00' }
    ],
    eventsClickable: true,
    onEventClick: function(subject) {
        document.getElementById('comments').innerHTML = 'clicked on ' + subject.label;
    }
});