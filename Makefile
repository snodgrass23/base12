setup:
	rm -rf node_modules
	npm install

start:
	node app.js $(filter-out $@,$(MAKECMDGOALS))

open:
	(sleep 2 && open http://localhost:3000) &
	npm start


.PHONY: setup test start open