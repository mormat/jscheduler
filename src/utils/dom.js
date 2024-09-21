
const getUniqueId = (function() {
    let lastId = 0;
    return () => ++lastId;    
})();

function appendClass(element, className) {
    
    if (element.className) {
        element.className += ' ' + className;
    } else {
        element.className = className;
    }
    
}

module.exports = {
    appendClass,
    getUniqueId
}
