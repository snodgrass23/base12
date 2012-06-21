PRIVATE_IP=`ifconfig -a | grep 'inet 10.' | grep -v '127.0.0.1' | awk '{ print $2}'`

echo "Creating /mongodb/mongodb.conf with private IP $PRIVATE_IP"

cat <<'EOF' > /mongodb/mongodb.conf
# This is an example config file for MongoDB.
dbpath = /data/db
bind_ip = $PRIVATE_IP
port = 27017
pidfilepath = /data/db/mongodb.pid
logpath = /var/log/mongodb/mongodb.log
logappend = true
journal = true
nohttpinterface = true
directoryperdb = true
auth = true
EOF

echo "Restarting mongodb service"
svcadm restart mongodb