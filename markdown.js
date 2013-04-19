var glob = require('glob'),
    fs = require('fs');

var sections = glob.sync('sections/*.json').map(function(f) {
    return JSON.parse(fs.readFileSync(f));
}).filter(function(section) {
    return section.heading && section.heading.identifier;
});

var title = null, chapter = null;

// To properly order identifiers, we need to sort them by leading integers
// rather than lexicographically or with the +'10a' hack which will break here
function pi(x) { return parseInt(x, 10); }

sections.sort(function(a, b) {
    // sort by title, then chapter, then identifier
    return (pi(a.title.identifier) - pi(b.title.identifier)) ||
        (pi(a.chapter.identifier) - pi(b.chapter.identifier)) ||
        (pi(a.heading.identifier) - pi(b.heading.identifier));
});

// # Title
// ## Chapter
// ### Section
// #### Subsection
sections.forEach(function(s) {
    if (title !== s.title.identifier) {
        console.log('# ' + s.title.identifier + ' ' + s.title.text + '\n');
        title = s.title.identifier;
    }
    if (chapter !== s.chapter.identifier) {
        console.log('## ' + s.chapter.identifier + ' ' + s.chapter.text + '\n');
        chapter = s.chapter.identifier;
    }
    console.log('### ' + s.heading.identifier + ' ' + s.heading.catch_text);
    if (s.text) {
        console.log('\n');
        console.log(s.text);
        console.log('\n');
    }
    if (s.sections) {
        s.sections.forEach(function(a) {
            console.log('#### ' + a.prefix + '\n');
            console.log(a.text.trim());
            console.log('\n');
        });
    }
});
