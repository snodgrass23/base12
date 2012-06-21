echo "Copying environment file into ~/node-service/current"
cp /home/node/.env.json /home/node/node-service/current/.env.json
chown -R node:node /home/node
echo "Restarting node-service"
/opt/nodejs/bin/node-service-restart