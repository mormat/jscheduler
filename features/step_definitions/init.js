
const { Before } = require('@cucumber/cucumber');
const { setDefaultTimeout }  = require('@cucumber/cucumber');

setDefaultTimeout( 60 * 1000 );

Before(async function() {
    
    this.driver.manage().window().setRect({width: 1200, height: 1024});
    
});
