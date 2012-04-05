echo "Copying {{config_file}} to {{constants.name}}@{{host}}:~/config/.env.json..."
scp -Bp {{config_file}} {{constants.name}}@{{host}}:~/config/.env.json
