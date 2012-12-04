setup:
	rm -rf node_modules
	npm install

start:
	node app $(processes)

open:
	(sleep 2 && open http://localhost:3000) &
	npm start


.PHONY: setup test start open