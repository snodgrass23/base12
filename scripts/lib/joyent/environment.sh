echo "Copying {{config_file}} to {{constants.name}}@{{host}}:~/.env.json..."
scp -Bp {{config_file}} {{constants.name}}@{{host}}:~/.env.json
