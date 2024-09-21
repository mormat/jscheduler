@others
Feature: others features

    Scenario: Quick start
        When I open the "temp\quickstart" page
        Then the 'interview' event should be displayed at "2024-09-16" from '10:00' to '12:00'
        And the 'meeting' event should be displayed at "2024-09-17" from '14:00' to '16:00'
