
const formatters = {
    'yyyy': (d) => String(d.getFullYear()),
    'mm':   (d) => ('0' + (d.getMonth() + 1)).slice(-2),
    'dd':   (d) => ('0' + d.getDate()).slice(-2),
    'yyyy-mm': (d) => formatters['yyyy'](d) + '-' + formatters['mm'](d),
    'yyyy-mm-dd': (d) => formatters['yyyy-mm'](d) + '-' + formatters['dd'](d),
    'hh':   (d) => ('0' + d.getHours()).slice(-2),
    'ii':   (d) => ('0' + d.getMinutes()).slice(-2),
    'ss':   (d) => ('0' + d.getSeconds()).slice(-2),
    'hh:ii': (d) => formatters['hh'](d) + ':' + formatters['ii'](d),
    'hh:ii:ss': (d) => formatters['hh'](d) + ':' + formatters['ii'](d) + ':' + formatters['ss'](d),
    'yyyy-mm-dd hh:ii': (d) => formatters['yyyy-mm-dd'](d) + ' ' + formatters['hh:ii'](d),
    'yyyy-mm-dd hh:ii:ss': (d) => formatters['yyyy-mm-dd'](d) + ' ' + formatters['hh:ii:ss'](d)
}

function date_add_hour(date, numHours) {
    
    const output = new Date(date);
    output.setTime(output.getTime() + (numHours * 60 * 60 * 1000));
    
    return output;
    
}

function format_date(format, value) {
    
    const date = new Date(value);
    
    return formatters[format](date);
    
}

class Day {
    
    constructor(date) {
        this.date = new Date(date);
    }
    
    get vars() {
        return {
            year:       this.date.getFullYear(),
            monthIndex: this.date.getMonth(),
            day:        this.date.getDate()
        }
    }
    
    getFirstDayOfWeek()
    {
        const d = new Date(this.date);
        d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1) );
        
        return new Day(d);
    }
    
    getLastDayOfWeek()
    {
        const d = new Date(this.date);
        d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? 0 : 7) );

        return new Day(d);
    }
    
    getFirstDayOfMonth()
    {
        const d = new Date(this.date);
        d.setDate(1);
        
        return new Day(d);
    }
    
    getLastDayOfMonth()
    {
        const d = new Date(this.date);
        d.setDate(1);
        d.setMonth( d.getMonth() + 1 );
        d.setDate( d.getDate() - 1);
        
        return new Day(d);
    }
    
    addDays(numDays) {
        const output = new Date(this.date);

        output.setDate(this.date.getDate() + numDays);
        
        return new Day(output);
    }
    
    addMonths(numMonths) {
        
        const output = new Date(this.date);
        
        output.setMonth(this.date.getMonth() + numMonths);
        
        return new Day(output);
        
    }
    
    getDate() {
        return this.date;
    }
    
    toString()
    {
        return formatters['yyyy-mm-dd'](this.date);
    }
    
}

class DateRange {
    
    constructor(start, end) {
        this.start = new Date(start);
        this.end   = new Date(end);
    }
    
    get length() {
        return this.end.getTime() - this.start.getTime();
    }
    
    contains(anotherDateRange) {
        const start = new Date(anotherDateRange.start);
        const end   = new Date(anotherDateRange.end);
        
        return this.start <= start && end <= this.end;
    }
        
    intersects(anotherDateRange) {
        const start = new Date(anotherDateRange.start);
        const end   = new Date(anotherDateRange.end);

        if (end < this.start || this.end < start) {
            return null;
        }

        return new DateRange(
            Math.max(this.start.getTime(), start.getTime()),
            Math.min(this.end.getTime(),   end.getTime()),
        );
        
    }
        
    calcPercentPosition(date) {
        const value  = new Date(date);
        const length = this.end.getTime() - this.start.getTime();
        
        return (value.getTime() - this.start.getTime()) * 100 / length;
    }
    
}

// @todo missing unittest
function groupDateRangedItemsByPosition(dateRangeditems) {

    const results = [];

    loop_items: for (const item of dateRangeditems) {

        const constraint = new DateRange(item.start, item.end - 1);

        for (const position in results) {

            const overlapping = results[position].find(
                (v) => {
                    const other = new DateRange(v.start, v.end - 1);
                    return constraint.intersects(other);
                }
            );

            if (!overlapping) {
                results[position].push(item);
                continue loop_items;
            }

        }

        results.push([item]);

    }

    return results;

}


module.exports = { 
    format_date,
    DateRange,
    Day,
    date_add_hour,
    groupDateRangedItemsByPosition
}