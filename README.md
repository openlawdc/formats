# formats

[Turn the JSON documents created by our parser](https://github.com/openlawdc/dc-decoded) into
formats. Eventual goals:

* High-quality PDF for printing & storage
* Documentation-friendly formats for autogeneration in systems like Sphinx and Jekyll

Approach:

Everything is up in the air. Initial approach is to generate [Markdown](http://daringfireball.net/projects/markdown/)
with `markdown.js` because it's a relatively tolerant format, especially
compared to LaTeX. From there, possibly [pandoc](http://johnmacfarlane.net/pandoc/)
to other formats, or [wkhtmltopdf](http://code.google.com/p/wkhtmltopdf/) to
PDF output.
