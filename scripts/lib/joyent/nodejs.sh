echo "Installing node.js..."
version=`~/local/bin/node --version`
echo "Current version: $version"
if [ "$version" = "v0.6.13" ]
then
  echo "node v0.6.13 is already installed"
  exit
fi

mkdir -p ~/tmp
cd ~/tmp
#rm -rf ./node-v0.6.13
#wget http://nodejs.org/dist/node-v0.6.13.tar.gz
gtar -xpf node-v0.6.13.tar.gz
cd node-v0.6.13
export JOBS=4
mkdir -p ~/local
./configure --with-dtrace --prefix=~/local
gmake
gmake install