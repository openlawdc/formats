one.pdf: one.tex
	xelatex one.tex

one.tex: latex.js
	node latex.js > one.tex
