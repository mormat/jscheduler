const { Given, When, Then } = require('@cucumber/cucumber');
const { Before, After, BeforeStep } = require('@cucumber/cucumber');
const { expect }  = require('expect');
const css2xpath   = require('css2xpath');

const debugRects = {}
const currentStep = {}

When('I click on the {string} event', async function (eventName) {
    
    const element = await this.getElement(
        getEventSelector(eventName) + ' a'
    );
    
    await element.click();

});

Then(
    'the {string} event should be displayed from {string} to {string}', 
    async function (eventName, fromDate, toDate) {
        
        const eventElement = await this.getElement(
            getEventSelector(eventName)
        );
        
        const expectedRect = await getDayRangeRect(this, fromDate, toDate);
        
        debugRects[currentStep.text] = expectedRect;
        
        const actualRect = await eventElement.getRect();
                
        expect(Math.abs(actualRect.x     - expectedRect.x)    ).toBeLessThan(1.1);
        expect(Math.abs(actualRect.width - expectedRect.width)).toBeLessThan(4);
        expect(actualRect.y).toBeGreaterThanOrEqual(expectedRect.y);
        expect(actualRect.height).toBeLessThanOrEqual(expectedRect.height);
                
    }
);

Then('the {string} event should not be displayed', async function (eventName) {
    
    const elements = await this.findElements(
        getEventSelector(eventName)            
    );
    
    expect(elements.length).toBe(0);
    
});

Then(
    'the {string} event should be displayed at {string} from {string} to {string}', 
    async function (eventName, atDate, fromHour, toHour) {
    
        const eventElement = await this.getElement(
            getEventSelector(eventName)            
        );
       
        const expectedRect  = await getDayRect(this, atDate);
        expectedRect.y      = await getHourTop(this, fromHour);
        expectedRect.height = await getHourTop(this, toHour) - expectedRect.y;
        debugRects[currentStep.text] = expectedRect;
        
        const eventRect = await eventElement.getRect();
        
        expect(Math.abs(eventRect.x      - expectedRect.x)    ).toBeLessThan(2);
        expect(Math.abs(eventRect.width  - expectedRect.width)).toBeLessThan(4);
        expect(Math.abs(eventRect.y      - expectedRect.y)    ).toBeLessThan(2);
        expect(Math.abs(eventRect.height - expectedRect.height)).toBeLessThan(4);
    
    }
);

When(
    'I drag the {string} event to {string} at {string}', 
    async function (eventName, toDate, atHour) {

        const eventElement = await this.getElement(
            getEventSelector(eventName)
        );

        const eventRect  = await eventElement.getRect();
        const dayRect = await getDayRect(this, toDate);
        
        const yHour = await getHourTop(this, atHour);
        
        const fromPoint = {
            x: eventRect.x + eventRect.width / 2,
            y: yHour + 2,
            color: 'blue'
        };
        const toPoint = {
            x: dayRect.x + dayRect.width / 2,
            y: yHour + 2,
            color: 'red'
        };
        
        debugRects[currentStep.text + ' (fromPoint)'] = fromPoint;
        debugRects[currentStep.text + ' (toPoint)'] = toPoint;
        
        await this.dragAndDrop(fromPoint, toPoint);

    }
);

 When(
    'I drag the {string} event to {string}', 
    async function (eventName, atDate) {
        
        const eventElement = await this.getElement(
            getEventSelector(eventName)
        );

        const eventRect = await eventElement.getRect();        
        
        const targetRect = await getDayRangeRect(this, atDate, atDate);
        
        const fromPoint = {
            x: eventRect.x + 2,
            y: eventRect.y + 2,
            color: 'blue'
        }
        const toPoint = {
            x: targetRect.x + targetRect.width  / 2,
            y: targetRect.y + targetRect.height / 2,
            color: 'red'
        };
        debugRects[currentStep.text + '(fromPoint)'] = fromPoint;
        debugRects[currentStep.text + '(toPoint)']   = toPoint;
        
        await this.dragAndDrop(fromPoint, toPoint);
        
    }
);

When('I resize the {string} event to {string}', async function (eventName, toHour) {
    
    const eventElement = await this.getElement(
        getEventSelector(eventName)
    );
    
    const eventRect = await eventElement.getRect();
    
    const fromPoint = {
        x: eventRect.x + eventRect.width / 2,
        y: eventRect.y + eventRect.height - 8
    }
    debugRects[currentStep.text + '(fromPoint)'] = fromPoint;
    
    const toPoint = {
        x: fromPoint.x,
        y: (await getHourTop(this, toHour)) + 4,
    }
    debugRects[currentStep.text + '(toPoint)'] = toPoint;
    
    await this.dragAndDrop(fromPoint, toPoint);
    
});

Before(function() {
    for (const key in debugRects) {
        delete debugRects[key];
    }
});

BeforeStep(function({ pickleStep }) {
    currentStep.text = pickleStep.text;
});

// render some specifics rects on the page for debugging
After(function() {
    for (const k in debugRects) {
        
        const {x, y, width = 1, height = 1, color = 'blue'} = debugRects[k];
        
        const styles = [
            'position: absolute',
            `border: 3px dashed ${ color }`,
            `left:   ${x}px`,
            `top:    ${y}px`,
            `width:  ${width}px`,
            `height: ${height}px`,
        ];
        
        const title = k.replaceAll(/"/g, '\\"');
        
        const scripts = [
            `var elt = document.createElement('div')`,
            `elt.style.cssText = "${ styles.join(';') }"`,
            `elt.setAttribute("title", "${ title }")`,
            `document.body.appendChild(elt)`

        ];
        
        this.driver.executeScript(
            `(function() { ${scripts.join(';')} })();`        
        );
    }
})

function getEventSelector(eventName) {
    
    const fn = (s) => `.jscheduler-event:contains("${s}")`;
    
    const match = eventName.match(/ \(\d\)/);
    if (match) {
        const nth = match[0].slice(2, -1);
        const selector = fn(eventName.substring(0, match.index));
        return `(${ css2xpath(selector) })[${nth}]`;
    }
    
    return fn(eventName);
    
}

async function getHourTop(self, atHour) {
    const element = await self.getElement(
        `[data-hour]:contains('${atHour}')`
    );

    const { y } = await element.getRect();
    return y;
}

async function getDayRect(self, atDay) {

    const dayHeaderElement = await self.getElement(
        `.jscheduler-day-header:contains('${atDay}')`
    );

    const bodyElement = await self.getElement(
        `.jscheduler-day_view-body`
    );

    const { x, width }  = await dayHeaderElement.getRect();
    const { y, height } = await bodyElement.getRect();

    return { x, y, width, height }

}


async function getDayRangeRect(self, fromDate, toDate) {

    const selectors = {
        'fromDate': `.jscheduler-daterange-header:contains('${fromDate}')`,
        'toDate':   `.jscheduler-daterange-header:contains('${toDate}')`,
        'row':      `.jscheduler-daterange-row`,
    }

    const parent = await self.getElement(
        '.jscheduler-daterange' + 
        Object.values(selectors).map(s => `:has(${s})`).join('')
    );

    const rects = {};
    for (const key in selectors) {
        const node = await self.getElement(selectors[key], parent);
        rects[key] = await node.getRect();
    }

    return {
        x:      rects['fromDate'].x,
        width:  rects['toDate'].x + rects['toDate'].width - rects['fromDate'].x,
        y:      rects['row'].y,
        height: rects['row'].height
    }

}
