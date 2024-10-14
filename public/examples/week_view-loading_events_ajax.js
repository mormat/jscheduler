var element = document.getElementById('scheduler');

var scheduler = jscheduler.render(element, {
    viewMode: 'week',
    currentDate: '2024-08-15'
});

var dateRange = scheduler.getEventsDateRange();
// `dateRange.start` and `dateRange.end` are js Date objects
url = './examples/events.json' +
    '?start=' + dateRange.start.getTime() + 
    '&end='  + dateRange.end.getTime();

$.get(url, function( data ) {
    scheduler.setOptions( { events: data } );
});

document.getElementById('comments').innerHTML = "loading '" + url + "'";