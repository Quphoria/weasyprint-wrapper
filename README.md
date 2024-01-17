# weasyprint

*A NodeJS wrapper module for Weasyprint Python package (HTML to PDF converter).*

This module is a fork of [Trim/weasyprint-wrapper](https://github.com/Trim/weasyprint-wrapper) uploaded to npm as [weasyprint](https://www.npmjs.com/package/@quphoria/weasyprint-wrapper) due to both [weasyprint-wrapper](https://www.npmjs.com/package/weasyprint-wrapper) and [weasyprint](https://www.npmjs.com/package/weasyprint) still not supporting passed in options, so I have uploaded the patch in [Trim's pull request to weasyprint](https://github.com/bob6664569/weasyprint-wrapper/pull/1).  

Yeah, I know, It's confusing.

## Getting started
Install the package (Python3 required):
```
pip3 install weasyprint
```

Add this NodeJS wrapper to your project:
```
npm i @quphoria/weasyprint-wrapper
```

## Usage
Example:

```javascript
const weasyprint = require('@quphoria/weasyprint-wrapper');

// URL, specifying the format & default command to spawn weasyprint
const resBuffer = await weasyprint('http://google.com/', { 
    command: '~/programs/weasyprint',
    pageSize: 'letter'
});
  
// HTML
const resbuffer = await weasyprint('<h1>Test</h1><p>Hello world</p>');

// Save in a file
try {
    const buffer = await weasyprint('<h1>Test</h1><p>Hello world</p>');
    fs.writeFileSync('test.pdf', buffer);
} catch (err) {
    console.error(err);
}
```

## License
MIT
