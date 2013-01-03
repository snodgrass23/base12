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

simple:
	node app.js simple

profile: 
	node --prof --prof_lazy app.js simple

debug:
	node --debug app.js run

debug-brk:
	node --debug-brk app.js run


.PHONY: setup run cycle open