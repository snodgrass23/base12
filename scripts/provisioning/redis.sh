version=`redis-server --version`
if [ "$version" = 'Redis server version 2.4.5 (00000000:0)' ]
then
  echo "redis 2.2.12 is already installed"
  exit
fi

stop redis

# Install Redis
cd /tmp
wget http://redis.googlecode.com/files/redis-2.4.5.tar.gz
tar -zxf redis-2.4.5.tar.gz
cd redis-2.4.5
make
sudo make install

# Configure redis
mkdir -p /db/redis
cat <<'EOF' > /etc/redis.conf
daemonize no
pidfile /var/run/redis.pid
logfile /var/log/redis.log

port 6379
bind 127.0.0.1
timeout 300

loglevel notice

## Default configuration options
databases 16

save 900 1
save 300 10
save 60 10000

rdbcompression yes
dbfilename dump.rdb

dir /db/redis/
appendonly no

glueoutputbuf yes
EOF

# Set redis to autostart
cat <<'EOF' > /etc/init/redis.conf 
description "redis"

start on runlevel [23]
stop on shutdown

exec sudo -u redis /usr/local/bin/redis-server /etc/redis.conf

respawn
EOF

# create redis user
adduser --system --no-create-home --disabled-login --disabled-password --group redis
chown -R redis:redis /db/redis
touch /var/log/redis.log
chown redis:redis /var/log/redis.log

start redis
