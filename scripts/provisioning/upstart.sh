# node upstart script
cat <<'EOF' > /etc/init/node.conf 
description "node server"

start on filesystem or runlevel [2345]
stop on runlevel [!2345]

respawn
respawn limit 10 5
umask 022

script
  HOME=/home/deploy
  . $HOME/.profile
  exec /usr/local/bin/node $HOME/app/current/server.js >> /var/log/node.log 2>&1
end script

post-start script
  PID=`status node | awk '/post-start/ { print $4 }'`
  echo $PID > /var/run/node.pid
end script

post-stop script
  rm -f /var/run/node.pid
end script
EOF
