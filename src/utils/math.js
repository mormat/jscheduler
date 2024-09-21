
function ceil(number, precision = 0) {
 
    const n = Math.pow(10, precision);
 
    return Math.round(number * n) / n;
    
}

module.exports = { ceil }