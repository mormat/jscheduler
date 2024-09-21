const { Given, When, Then } = require('@cucumber/cucumber');
const { expect }  = require('expect');

When('I open the {string} page', async function (pageName) {

    let url = `http://localhost:8080/${pageName}.html`;

    const urlParams = new URLSearchParams(this.urlParams);
    if (urlParams.size > 0) {
        url += '?' + urlParams;
    }
    
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

Then('I should see {string}', async function (expectedText) {
    
    const pageText = await this.getPageText();
    
    expect(pageText).toContain(expectedText);
    
});

Then('I should see :', async function (dataTable) {
        
    const pageText = await this.getPageText();

    for (const [expectedText] of dataTable.raw()) {
        expect(pageText).toContain(expectedText);
    }

});

Then('I should not see :', async function (dataTable) {
    
    const pageText = await this.getPageText();

    for (const [expectedText] of dataTable.raw()) {
        expect(pageText).not.toContain(expectedText);
    }
    
});

When('I wait until I see {string}', async function (expectedText) {

    const selector = `:contains("${expectedText}")`;
    
    await this.waitForText(expectedText);

    
});

When('I click on {string}', async function (text) {
    
    const selectors = [
        `//label[text()='${text}']`,
        `a:contains("${text}")` ,
        `button:contains("${text}")` ,
    ];
    
    for (const selector of selectors) {
        const [ element ] = await this.findElements( selector );
        if (element) {
            await element.click();
            return;
        }
    }
    
    throw `No clickable item found with "${text}"`; 
});