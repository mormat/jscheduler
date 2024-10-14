const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect }  = require('expect');

const urlParams = new URLSearchParams();

When('I open the {string} page', async function (pageName) {

    const url = `http://localhost:8080/${pageName}.html?` + urlParams;
    
    await this.driver.get( url );
    
});

When(
    'I select the {string} example in {string}', 
    async function (exampleName, sectionName) {
        const element = await this.getElement([
            `.list-group-item:contains( "${sectionName}" )`,
            `.list-group-item:contains( "${exampleName}" )`
        ].join(' ~ '));

        await element.click();
    }            
);

Given('the {string} prop equals {string}', function (prop, value) {
    
    urlParams.set('scheduler__' + prop, value);
    
});

Given('today is {string}', function (value) {
    
    urlParams.set('today', value);
    
});

Then(
    '{string} should be loaded from {string} to {string}', 
    async function (url, startDate, endDate) {

        const start = (new Date(startDate)).getTime();
        const end   = (new Date(endDate)).getTime();
    
        const expectedText = `loading '${url}?start=${start}&end=${end}'`;

        const pageText = await this.getPageText();

        expect(pageText).toContain(expectedText);

    }
);

Before(function() {
            
    urlParams.forEach( (_, k) => urlParams.delete(k) );
        
});
