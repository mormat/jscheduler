var element = document.getElementById('scheduler');

jscheduler.render(element, {
    viewMode: 'month',
    events: [
        { label: 'training course', start: '2024-10-01 08:00', end: '2024-10-02 19:00' },
        { label: 'presentation',    start: '2024-10-05 09:00', end: '2024-10-08 13:00' }
    ]
});
