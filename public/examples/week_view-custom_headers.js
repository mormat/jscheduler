var element = document.getElementById('scheduler');

jscheduler.render(element, {
    viewMode: 'week',
    headerRenderer: function(vars) {
        var date = new Date(vars.year, vars.monthIndex, vars.day);
        return date.toLocaleString(
            'en-GB', 
            { 
                weekday: 'short', 
                month: 'short',  
                day:'numeric',
                // year: "numeric"
            }
        ) 
    }
});
