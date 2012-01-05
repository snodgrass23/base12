# Install mongodb
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" >> /etc/apt/sources.list
apt-get update
apt-get install mongodb-10gen

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