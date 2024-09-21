@examples
Feature: examples page

    Background:
        Given today is "2023-05-04" 

    Scenario: Week view - Init scheduler
        When I open the "examples" page
        And I select the "Init scheduler" example in "Week view"
        Then the scheduler should be in week view
        And I should see :
            | 2023-05-01 2023-05-02 |
            | 2023-05-06 2023-05-07 |
            | 08:00 |
            | 19:00 |

    Scenario: Week view - Displaying events
        When I open the "examples" page
        And I select the "Displaying events" example in "Week view"
        Then the 'interview' event should be displayed at "2024-08-13" from '10:00' to '12:00'
        And the 'meeting' event should be displayed at "2024-08-15" from '14:00' to '18:00'
        And the "training course" event should be displayed from "2024-08-15" to "2024-08-17"

    @ajax
    Scenario: Week view - Loading events with ajax
        When I open the "examples" page
        And I select the "Loading events with ajax" example in "Week view"
        And I wait until I see "meeting"
        Then the 'meeting' event should be displayed at "2024-08-15" from '14:00' to '18:00'
        And the events should be loaded from "2024-08-12 00:00:00.000" to "2024-08-18 23:59:59.999"

    Scenario: Week view - Custom headers
        When I open the "examples" page
        And I select the "Custom headers" example in "Week view"
        Then I should see :
            | Mon, 1 May |
            | Sun, 7 May |

    Scenario: Week view - Custom hours range
        When I open the "examples" page
        And I select the "Custom hours range" example in "Week view"
        Then I should see :
            | 09:00 |
            | 18:00 |
        And I should not see :
            | 08:00 |
            | 19:00 |
               
    Scenario Outline: Week view - Click on events
        When I open the "examples" page
        And I select the "Click on events" example in "Week view"
        And I click on the "<eventName>" event
        Then I should see "clicked on <eventName>"

    Examples:
        | eventName       |
        | presentation    |
        | training course |

    @drag_and_drop
    Scenario Outline: Week view - Drag and drop events
        When I open the "examples" page
        And I select the "Drag and drop events" example in "Week view"
        And I drag the "<eventName>" event to <dropTarget>
        Then the '<eventName>' event should be displayed <expectedDisplay>
        And I should see "<eventName> event dropped"
        And I should see "<expectedComment>"
        
    Examples:
        | eventName       | dropTarget              | expectedDisplay                         | expectedComment                                  |
        | presentation    | "2024-10-02" at "09:00" | at "2024-10-02" from '09:00' to '13:00' | at (Wed Oct 02 2024 09:00,Wed Oct 02 2024 13:00) |
        | training course | "2024-10-04"            | from "2024-10-04" to "2024-10-05"       | at (Fri Oct 04 2024 08:00,Sat Oct 05 2024 19:00) |

    @drag_and_drop
    Scenario: Week view - Resize events
        When I open the "examples" page
        And I select the "Resize events" example in "Week view"
        And I resize the "presentation" event to "16:00"
        Then the "presentation" event should be displayed at "2024-10-03" from "09:00" to "16:00"
        And I should see "presentation event resized to 16:00"

    Scenario: Month view - Init scheduler
        When I open the "examples" page
        And I select the "Init scheduler" example in "Month view"
        Then the scheduler should be in month view
        And I should see :
            | Mon Tue Wed Thu Fri Sat Sun |
            | 1 2 3 4 5 6 7    |
            | 29 30 31 |

    Scenario: Month view - Displaying events
        When I open the "examples" page
        And I select the "Displaying events" example in "Month view"
        Then the "training course" event should be displayed from "1" to "2"
        And the "presentation (1)" event should be displayed from "5" to "6"
        And the "presentation (2)" event should be displayed from "7" to "8"

    @ajax
    Scenario: Month view - Loading events with ajax
        When I open the "examples" page
        And I select the "Loading events with ajax" example in "Month view"
        And I wait until I see "meeting"
        Then the 'meeting' event should be displayed from "15" to "15"
        And the events should be loaded from "2024-07-29 00:00:00.000" to "2024-09-01 23:59:59.999"

    @drag_and_drop
    Scenario: Month view - Drag and drop events
        When I open the "examples" page
        And I select the "Drag and drop events" example in "Month view"
        And I drag the "presentation" event to "8"
        Then the "presentation" event should be displayed from "8" to "11"
        When I drag the "presentation" event to "12"
        Then the "presentation (1)" event should be displayed from "12" to "13"
        And the "presentation (2)" event should be displayed from "14" to "15"