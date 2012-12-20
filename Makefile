setup:
	rm -rf node_modules
	npm install

run:
	node app.js run $(filter-out $@,$(MAKECMDGOALS))

cycle:
	node app.js cycle $(filter-out $@,$(MAKECMDGOALS))

open:
	(sleep 2 && open http://localhost:3000) &
	node app.js run $(filter-out $@,$(MAKECMDGOALS))


.PHONY: setup run cycle open