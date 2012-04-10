echo "Copying environment file into ~/node-service/current"
cp /home/node/.env.json /home/node/node-service/current/.env.json
echo "Restarting node-service"
node-service-restart