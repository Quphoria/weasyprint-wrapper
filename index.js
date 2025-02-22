const { spawn } = require('child_process');
const debug = require('debug');
const log = debug('weasyprint-wrapper:log');
const err = debug('weasyprint-wrapper:error');

const dasher = input => input
    .replace(/\W+/g, '-')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase();

const quote = val => (typeof val === 'string' && process.platform !== 'win32')
    ? '"' + val.replace(/(["\\$`])/g, '\\$1') + '"'
    : val;

const weasyprint = async (input, { command = 'weasyprint', ...opts } = {}) => {
    let child;
    const isUrl = /^(https?|file):\/\//.test(input);
    const args = [command];

    Object.entries(opts).forEach(([key, value]) => {
        // Don't add --output to args
        if (key == "output") return;

        args.push(key.length === 1 ? '-' + key : '--' + dasher(key));
        // only add value if it is not a boolean
        if (value !== false && value !== true) {
            args.push(value);
        }
    });

    args.push(isUrl ? quote(input) : '-'); // stdin if HTML given directly
    args.push(opts.output ? quote(opts.output) : '-'); // stdout if no output file

    log('Spawning %s with args %o...', args[0], args);
    if (process.platform === 'win32') {
        child = spawn(args[0], args.slice(1));
    } else {
        child = spawn('/bin/sh', ['-c', args.join(' ') + ' | cat']);
    }

    // write input to stdin if it isn't a url
    if (!isUrl) child.stdin.end(input);

    return new Promise((resolve, reject) => {
        const buffers = [];
        const errBuffers = [];
        child.stdout.on('data', chunk => {
            buffers.push(Buffer.from(chunk));
        });
        child.stderr.on('data', chunk => {
            errBuffers.push(Buffer.from(chunk));
            err(chunk.toString('utf8').trim());
        });
        child.on('exit', function () {
            // Debug info is returned on stderr, if we ONLY get DEBUG and INFO messages, and we are outputting to a file, just pretend they came over stdout
            var hasErrors = false;
            if (opts.output) {
                for (const errBuf of errBuffers) {
                    const errStr = errBuf.toString('utf8');
                    // Ignore it if is a DEBUG or INFO message
                    if (errStr.startsWith("INFO") || errStr.startsWith("DEBUG")) continue;
                    // It has errors, stop here
                    hasErrors = true;
                    break;
                }
            }
            
            if (opts.output && !hasErrors) {
                log('Success, returning stdout buffer...');
                if (buffers.length) reject("Unexpected stdout!");
                else resolve(Buffer.concat(errBuffers));
            } else if (!opts.output && buffers.length !== 0) {
                log('Success, returning PDF buffer...');
                resolve(Buffer.concat(buffers));
            } else {
                reject(new Error(Buffer.concat(errBuffers).toString('utf8')));
            }
        });
    });
}

module.exports = weasyprint;
