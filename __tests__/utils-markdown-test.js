
const { extract_sections, extract_codes } = require ('../src/utils/markdown');

const dedent = require('dedent');

test("extract_sections", () => {
	
	const markdown = dedent(`
		# schedule_it.js

		## Quick start
		Lorem ipsum dolor sit amet

		## Usage
		Suspendisse porttitor in felis in vulputate. 

		### Examples
		Pellentesque vehicula quis arcu eu rhoncus. 
	`);

	const expected = [
		"# schedule_it.js",
		"## Quick start\nLorem ipsum dolor sit amet",
		"## Usage\nSuspendisse porttitor in felis in vulputate.",
		"### Examples\nPellentesque vehicula quis arcu eu rhoncus.",
	];

	expect( extract_sections( markdown ) ).toStrictEqual( expected );
});

test("extract_codes", () => {

	const markdown = dedent(`
		# examples
	
		---
		print('hello world')
		---
		
		---html
		<h1>hello world</h1>
		<p>lorem ipsum</p>
		---
	`).replaceAll('---', '```');
	
	const actual = extract_codes( markdown );
	
	expect( actual.length ).toBe( 2 );
	expect( actual[0] ).toEqual(
		"```\nprint('hello world')\n```"
	);
	expect( actual[1] ).toEqual(
		"```html\n" + 
		"<h1>hello world</h1>\n" +
		"<p>lorem ipsum</p>\n" +
		"```"
	);

	
});

