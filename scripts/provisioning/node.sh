version=`node --version`
if [ $version = "v0.6.6" ]
then
  echo "node v0.6.6 is already installed"
  exit
fi

cd /tmp
rm -rf node
wget http://nodejs.org/dist/v0.6.6/node-v0.6.6.tar.gz
tar xzvf node-v0.6.6.tar.gz
cd node-v0.6.6
export JOBS=4
./configure
make
make install
