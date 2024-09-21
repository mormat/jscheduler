
const { extract_sections, extract_codes } = require('../utils/markdown');

const fs   = require('fs');
const path = require('path');

const PROJECT_FOLDER = path.join(__dirname, '..', '..');
const TEMP_FOLDER    = path.join(PROJECT_FOLDER, 'public',  'temp');
const README_PATH    = path.join(PROJECT_FOLDER, 'README.md');
const QUICKSTART_PAGE_PATH = path.join(TEMP_FOLDER, 'quickstart.html');

if (!fs.existsSync(TEMP_FOLDER)) {
    fs.mkdirSync(TEMP_FOLDER);
}

const source = fs.readFileSync(README_PATH, 'utf8');
    
const sections   = extract_sections(source);
const quickstart = sections.find(function(section) {
   const header = section.split("\n")[0];
   return header.toLowerCase().includes('quick start');
});
const code = extract_codes(quickstart)[0];
const html = code.split("\n").slice(1, -1).join('\n')
    .replaceAll('https://unpkg.com/@mormat/jscheduler"', '../jscheduler.js"')
;

fs.writeFileSync( QUICKSTART_PAGE_PATH, html );
