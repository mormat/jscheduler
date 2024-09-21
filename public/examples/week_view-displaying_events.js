var element = document.getElementById('scheduler');

jscheduler.render(element, {
    viewMode: 'week',
    events: [
        // dates as string
        { 
            label: "interview", 
            start: "2024-08-13 10:00",
            end:   "2024-08-13 12:00",
        },
        // using the Date object
        { 
            label: "meeting",   
            start: new Date("2024-08-15 14:00"),
            end:   new Date("2024-08-15 18:00"),
        },
        // spanned event
        { 
            label: "training course",
            start: "2024-08-15 09:00",
            end  : "2024-08-17 18:00",
        }
    ]
});
