
function escape_html( unsafe )
{
    return ('' + unsafe) /* Forces the conversion to string. */
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    
}

function build_html_style( values ) {
    return Object.entries(values).map( ([k, v]) => k + ':' + v ).join(';');
}

module.exports = { 
    build_html_style,
    escape_html
}