const { Builder, By, until } = require('selenium-webdriver');
const css2xpath       = require('css2xpath');
const chrome          = require("selenium-webdriver/chrome");
const { World }       = require('@cucumber/cucumber');

function createDriver() {
    
    const builder = new Builder().withCapabilities({
        'browserName': 'chrome',
        'goog:loggingPrefs': { 'browser':'ALL' },
    });

    const options = new chrome.Options();
    options.addArguments("--lang=en");
    builder.setChromeOptions(options);

    return builder.build();
    
}

function buildSeleniumHelper(driver) {
            
    async function getPageText(selector = 'body') {

        const elements = await findElements(selector);

        if (elements.length === 0) {
            throw `No elements found matching '${selector}'`
        }

        let texts = [];
        for (const element of elements) {
            texts.push(await element.getText());
        }

        return texts.join(' ').replace(/\s+/g,' ');

    }
    
    async function waitForText(expectedText, timeout = 1000) {
        
        const selector = `:contains("${expectedText}")`;
        
        await driver.wait(
            until.elementIsVisible( 
                driver.findElement( By.xpath(css2xpath(selector)) )
            ), 
            timeout
        );
        
    }
    
    async function findElements(selector, parent = null) {

        const attempts = [
            () => By.css(selector),
            () => By.xpath(css2xpath(selector)),
            () => By.xpath(selector),
        ];

        for (let attempt of attempts) {
            try {
                return await (parent ? parent : driver).findElements(attempt());
            } catch (err) {}
        }        

        return [];

    }
    
    async function getElement(selector, ...vars) {
        const elements = await findElements(selector, ...vars);
        if (elements.length) {
            return elements[0];
        }
        throw `Couldn't find element matching ${selector}`;
    }
    
    async function dragAndDrop(fromPoint, toPoint) {
        
        const fn = ({x, y}) => ({
            x: Math.floor(x),
            y: Math.floor(y)
        });
        const actions = driver.actions({async: true});
        await actions.move(fn(fromPoint)).press().perform();
        await actions.move(fn(toPoint)).click().perform();
                
    }
    
    return { 
        getPageText, 
        findElements, 
        getElement,
        dragAndDrop,
        waitForText
    }
    
}

module.exports = { createDriver, buildSeleniumHelper }
