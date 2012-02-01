version=`node --version`
if [ "$version" = "v0.6.6" ]
then
  echo "node v0.6.6 is already installed"
  exit
fi

cd /tmp
rm -rf node
wget http://nodejs.org/dist/v0.6.6/node-v0.6.8.tar.gz
tar xzvf node-v0.6.8.tar.gz
cd node-v0.6.8
export JOBS=4
mkdir ~/local
./configure --prefix=$HOME/local/node
make
make install
