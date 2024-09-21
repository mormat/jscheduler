// Init the world parameters used in scenarios

const { Before, BeforeStep, BeforeAll } = require('@cucumber/cucumber');
const { After,  AfterStep,  AfterAll  } = require('@cucumber/cucumber');
const { Given  } = require('@cucumber/cucumber');
const { setDefaultTimeout }  = require('@cucumber/cucumber');
const { setWorldConstructor} = require('@cucumber/cucumber');
const { createDriver, buildSeleniumHelper } = require('../../src/utils/selenium');

const fs   = require('fs');
const path = require('path');

const driver = createDriver();

setDefaultTimeout( 60 * 1000 );
setWorldConstructor(function() {
    this.driver = driver;
    
    const helpers = buildSeleniumHelper(driver);
    for (const [name, fn] of Object.entries(helpers)) {
        this[name] = fn;
    }
});

Before(function() {
    
    this.debugRects = {};
        
    this.urlParams  = {};
        
});


BeforeStep(function({ pickleStep }) {
    
    this.currentStepText = pickleStep.text;
        
});

BeforeAll(async function() {
    await driver.manage().window().setRect({width: 1024, height: 1024});
});

AfterAll(async function() {
    
    if (!process.argv.includes('--fail-fast')) {
        driver.close();
    }
    
});

Given('today is {string}', function (string) {
    
    this.urlParams['today'] = string;
    
});

