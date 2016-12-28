const formatter = require('voorhoede-ocelot-formatter');
const fs = require('fs');
const pkg = require('../package.json');
const path = require('path');
const makeDir = require('mkdirp');
const rebaseRelativeUrls = require('../lib/rebase-relative-urls');

const masterBranchUrl = pkg.repository.url + '/blob/master/';
const outputFilePath = 'gh-pages/index.html';
const dirName = path.dirname(outputFilePath);

fs.readFile('README.md', 'utf8', (err, readme) => {
    if (err) {
        console.error('Error reading README.md', err);
        return;
    }
    formatter(readme, { github: 'voorhoede/email-template-guide' })
        .then(html => rebaseRelativeUrls(html, masterBranchUrl))
        .then(html => {
            makeDir(dirName, () => fs.writeFile(outputFilePath, html))
        });
});
