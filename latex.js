var glob = require('glob'),
    fs = require('fs');

var sections = glob.sync('sections/*.json').map(function(f) {
// var sections = glob.sync('sections/1-*.json').map(function(f) {
    return JSON.parse(fs.readFileSync(f));
}).filter(function(section) {
    return section.heading && section.heading.identifier;
});

var title = null, chapter = null;

// To properly order identifiers, we need to sort them by leading integers
// rather than lexicographically or with the +'10a' hack which will break here
function pi(x) {
    var alpha = x.match(/([A-Z]+)$/);
    var plus = 0;
    if (alpha) {
        plus = (alpha[1].charCodeAt(0) - 64) / 100;
    }
    return parseInt(x, 10) + plus;
}

function esc(x) { return x.replace(/&/g, '\\&')
    .replace(/\$/g, '\\$')
    .replace(/\#/g, '\\#')
    .replace(/%/g, '\\%')
    .replace(/\_/g, '\\_');
}

sections.sort(function(a, b) {
    // sort by title, then chapter, then identifier
    return (pi(a.title.identifier) - pi(b.title.identifier)) ||
        (pi(a.chapter.identifier) - pi(b.chapter.identifier)) ||
        (pi(a.heading.identifier) - pi(b.heading.identifier));
});

console.log('\\documentclass[11pt,oneside]{book}');

console.log('\\usepackage{color}');

console.log('\\usepackage{hyperref}');
console.log('\\hypersetup{colorlinks,citecolor=black,filecolor=black,linkcolor=blue,urlcolor=blue}');

console.log('\\title{Unofficial DC Code}');
console.log('\\author{The DC Council}');
console.log('\\date{December 11, 2012}');

console.log('\\begin{document}');

console.log('\\maketitle\n');

console.log('\\tableofcontents\n');

// # Title
// ## Chapter
// ### Section
// #### Subsection
sections.forEach(function(s) {
    if (title !== s.title.identifier) {
        console.log('\\section*{' + s.title.identifier + '\\quad ' + esc(s.title.text) + '}\n');
        console.log('\\addcontentsline{toc}{section}{' + s.title.identifier + '\\quad ' + esc(s.title.text) + '}\n');
        title = s.title.identifier;
    }
    if (chapter !== s.chapter.identifier) {
        console.log('\\subsection*{' + s.chapter.identifier + '\\quad ' + esc(s.chapter.text) + '}\n');
        console.log('\\addcontentsline{toc}{subsection}{' + s.chapter.identifier + '\\quad ' + esc(s.chapter.text) + '}\n');
        chapter = s.chapter.identifier;
    }
    console.log('\\subsubsection*{' + s.heading.identifier + '\\quad ' + esc(s.heading.catch_text) + '}');
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
