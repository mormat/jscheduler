
function extract_sections(markdown) {

    const matches = [...markdown.matchAll(/\n#{1,5}\ /g)];
    const indexes = [0, ...matches.map(m => m.index)];
    const sections = indexes.map(function(start, nth) {
        const end = indexes[nth + 1];
        return markdown.substring(start, end).trim();
    });

    return sections;

}

function extract_codes(markdown) {

    const matches = [...markdown.matchAll(/\n```/g)];
    const indexes = matches.map(m => m.index);
    const codes = [];
    while (matches.length > 0) {
        const [opening, closing] = [matches.shift(), matches.shift()];

        const indexEnd = closing ? closing.index + closing[0].length : undefined;

        const code = markdown.substring(opening.index, indexEnd); 

        codes.push( code.trim() );
    }

    return codes;

}

// @todo missing unit test
function slugify(header, blacklist = []) {

    const prefix = header
        .replace(/^#{1,5}\ /, '#')
        .replaceAll(':', '')
        .replaceAll('|', '')
        .replaceAll('`', '')
        .replaceAll(' ', '-')
        .toLowerCase();
    var attempt = prefix, n = 1;
    while (blacklist.includes(attempt)) {
            attempt = prefix + '-' + n;
    }
    return attempt;
	
}

module.exports = { extract_sections, extract_codes, slugify }
