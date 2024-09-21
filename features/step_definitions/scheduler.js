
const { Given, When, Then } = require('@cucumber/cucumber');

const { expect }  = require('expect');

Then('the scheduler should be in day view', async function () {

    await this.getElement('.jscheduler-day_view-header');

    const columns = await this.findElements('.jscheduler-day_view-body td');
    
    expect(columns.length).toBe(1);
    
});

Then('the scheduler should be in week view', async function () {

    await this.getElement('.jscheduler-day_view-header');

    const columns = await this.findElements('.jscheduler-day_view-body td');
    
    expect(columns.length).toBe(7);

});

Then('the scheduler should be in month view', async function () {
    
    await this.getElement('.jscheduler-month_view');
    
});
