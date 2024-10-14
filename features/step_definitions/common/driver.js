const { Given, When, Then } = require('@cucumber/cucumber');
const { AfterAll } = require('@cucumber/cucumber');
const { expect }  = require('expect');
const { Builder, By, until } = require('selenium-webdriver');
const chrome          = require("selenium-webdriver/chrome");
const css2xpath       = require('css2xpath');

const { setWorldConstructor} = require('@cucumber/cucumber');

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

Then('I should not see {string}', async function (expectedText) {
        
    const pageText = await this.getPageText();
    
    expect(pageText).not.toContain(expectedText);
    
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
        `a:contains("${text}")`,
        `a[title="${text}"]`,
        `button:contains("${text}")`,
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

AfterAll(async function() {
    
    if (!process.argv.includes('--fail-fast')) {
        SeleniumWorld.driver.close();
    }
    
});


class SeleniumWorld {
    
    static driver;
    
    constructor() {
        
        if (!SeleniumWorld.driver) {
            
            const builder = new Builder().withCapabilities({
                'browserName': 'chrome',
                'goog:loggingPrefs': { 'browser':'ALL' },
            });

            const options = new chrome.Options();
            options.addArguments("--lang=en");
            builder.setChromeOptions(options);

            SeleniumWorld.driver = builder.build();
            
        }
    
        this.driver = SeleniumWorld.driver;
    }
    
    async getPageText(selector = 'body') {

        const elements = await this.findElements(selector);

        if (elements.length === 0) {
            throw `No elements found matching '${selector}'`
        }

        let texts = [];
        for (const element of elements) {
            texts.push(await element.getText());
        }

        return texts.join(' ').replace(/\s+/g,' ');

    }
    
    async waitForText(expectedText, timeout = 1000) {

        const selector = `:contains("${expectedText}")`;

        await this.driver.wait(
            until.elementIsVisible( 
                this.driver.findElement( By.xpath(css2xpath(selector)) )
            ), 
            timeout
        );

    }
    
    async findElements(selector, parent = null) {

        const attempts = [
            () => By.css(selector),
            () => By.xpath(css2xpath(selector)),
            () => By.xpath(selector),
        ];

        for (let attempt of attempts) {
            try {
                return await (parent ? parent : this.driver).findElements(attempt());
            } catch (err) {
                if (err.constructor.name !== 'InvalidSelectorError') {
                    throw err;
                }
            }
        }        

        return [];

    }
    
    async getElement(selector, ...vars) {
        const elements = await this.findElements(selector, ...vars);
        if (elements.length) {
            return elements[0];
        }
        throw `Couldn't find element matching ${selector}`;
    }

    async dragAndDrop(fromPoint, toPoint) {

        const fn = ({x, y}) => ({
            x: Math.floor(x),
            y: Math.floor(y)
        });
        const actions = this.driver.actions({async: true});
        await actions.move(fn(fromPoint)).press().perform();
        await actions.move(fn(toPoint)).click().perform();

    }
    
}

setWorldConstructor(SeleniumWorld);

SeleniumWorld.driver = (function() {
    const builder = new Builder().withCapabilities({
        'browserName': 'chrome',
        'goog:loggingPrefs': { 'browser':'ALL' },
    });

    const options = new chrome.Options();
    options.addArguments("--lang=en");
    builder.setChromeOptions(options);

    return builder.build();
})();
