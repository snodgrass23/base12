version=`mongo --version`
if [ "$version" = 'MongoDB shell version: 2.0.2' ]
then
  echo "mongo 2.0.2 is already installed"
  exit
fi

# Install mongodb
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" >> /etc/apt/sources.list
apt-get update
apt-get install mongodb-10gen

# stop mongo so we can configure it (otherwise until reboot it will run with /var/lib/mongodb)
stop mongodb

# Configure mongodb
mkdir -p /db/mongodb
sudo chown mongodb:mongodb /db/mongodb
cat <<'EOF' > /etc/mongodb.conf
logappend=true
dbpath=/db/mongodb
oplogSize = 10000
journal = true
logpath=/var/log/mongodb.log
EOF
touch /var/log/mongodb.log
chown mongodb:mongodb /var/log/mongodb.log
chown -R mongodb:mongodb /db/mongodb

# start mongo
start mongodb