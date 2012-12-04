setup:
	rm -rf node_modules
	npm install

test:
	scripts/test $(tests)

start:
	npm start

open:
	(sleep 2 && open http://localhost:3000) &
	npm start


.PHONY: setup test start open