.PHONY: init collect split

all:	collect split

init:
	npm install

collect:
	npm run collect

split:
	npm run split
