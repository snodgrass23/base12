cd /tmp
rm -rf node
wget http://nodejs.org/dist/v0.6.6/node-v0.6.6.tar.gz
tar xzvf node-v0.6.6.tar.gz
cd node-v0.6.6
export JOBS=4
./configure
make
make install
#node_upstart /etc/init/node.conf