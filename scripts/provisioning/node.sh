version=`node --version`
if [ "$version" = "v0.6.9" ]
then
  echo "node v0.6.9 is already installed"
  exit
fi

mkdir ~/tmp
cd ~/tmp
rm -rf ./node-v0.6.9
wget http://nodejs.org/dist/v0.6.9/node-v0.6.9.tar.gz
tar xzvf node-v0.6.9.tar.gz
cd node-v0.6.9
export JOBS=4
mkdir -p ~/local/node
./configure --prefix=~/local/node
make
make install
