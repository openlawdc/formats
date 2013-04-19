one.pdf: one.tex
	latex one.tex

one.tex: latex.js
	node latex.js > one.tex
