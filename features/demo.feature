@demo
Feature: demo page

    Background:
        Given today is "2024-08-13" 

    Scenario: Switch between multiple weeks
        When I open the "index" page
        Then the scheduler should be in week view
        When I click on "month"
        Then the scheduler should be in month view
        When I click on "week"
        Then the scheduler should be in week view
        When I click on "day"
        Then the scheduler should be in day view

    Scenario: Browse dates in week view
        When I open the "index" page
        And I click on "day"
        Then I should see "Tuesday, August 13, 2024"
        When I click on ">"
        Then I should see "Wednesday, August 14, 2024"
        When I click on "today"
        Then I should see "Tuesday, August 13, 2024"
        When I click on "<"
        Then I should see "Monday, August 12, 2024"

    Scenario: Browse dates in week view
        When I open the "index" page
        Then I should see "Aug 12, 2024 - Aug 18, 2024"
        When I click on ">"
        Then I should see "Aug 19, 2024 - Aug 25, 2024"
        When I click on "today"
        Then I should see "Aug 12, 2024 - Aug 18, 2024"
        When I click on "<"
        Then I should see "Aug 5, 2024 - Aug 11, 2024"
        
    Scenario: Browse dates in month view
        When I open the "index" page
        And I click on "month"
        Then I should see "August 2024"
        When I click on ">"
        Then I should see "September 2024"
        When I click on "today"
        Then I should see "August 2024"
        When I click on "<"
        Then I should see "July 2024"
        
        