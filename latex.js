var glob = require('glob'),
    fs = require('fs');

// var sections = glob.sync('sections/*.json').map(function(f) {
var sections = glob.sync('sections/1-*.json').map(function(f) {
    return JSON.parse(fs.readFileSync(f));
}).filter(function(section) {
    return section.heading && section.heading.identifier;
});

var title = null, chapter = null;

// To properly order identifiers, we need to sort them by leading integers
// rather than lexicographically or with the +'10a' hack which will break here
function pi(x) { return parseInt(x, 10); }
function esc(x) { return x.replace(/&/g, '\\&').replace(/\$/g, '\\$').replace(/\_/g, '\\_'); }

sections.sort(function(a, b) {
    // sort by title, then chapter, then identifier
    return (pi(a.title.identifier) - pi(b.title.identifier)) ||
        (pi(a.chapter.identifier) - pi(b.chapter.identifier)) ||
        (pi(a.heading.identifier) - pi(b.heading.identifier));
});

console.log('\\documentclass[11pt]{article}');
console.log('\\begin{document}');

// # Title
// ## Chapter
// ### Section
// #### Subsection
sections.forEach(function(s) {
    if (title !== s.title.identifier) {
        console.log('\\setcounter{section}{' + s.title.identifier + '}');
        console.log('\\section{' + esc(s.title.text) + '}\n');
        title = s.title.identifier;
    }
    if (chapter !== s.chapter.identifier) {
        console.log('\\setcounter{subsection}{' + s.chapter.identifier + '}');
        console.log('\\subsection{' + esc(s.chapter.text) + '}\n');
        chapter = s.chapter.identifier;
    }
    console.log('\\setcounter{subsection}{' + s.heading.identifier + '}');
    console.log('\\subsection{' + esc(s.heading.catch_text) + '}');
    if (s.text) {
        console.log('\n');
        console.log(esc(s.text));
        console.log('\n');
    }
    if (s.sections) {
        s.sections.forEach(function(a) {
            console.log('\\paragraph{' + a.prefix + '}');
            console.log(esc(a.text.trim()));
            console.log('\n');
        });
    }
});

console.log('\\end{document}');
