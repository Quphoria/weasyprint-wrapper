(async () => {
    const fs = require('fs');
    const weasyprint = require('@quphoria/weasyprint-wrapper');

    // URL
    try {
        const res = await weasyprint('https://www.google.com/', {pageSize: 'letter'});
        fs.writeFileSync('google.pdf', res);
    } catch(err) {
        console.error(err);
    }
})();
