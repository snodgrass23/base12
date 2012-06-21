#!/usr/bin/env bash
#
# Add new version of nodejs to a nodejs or no.de SmartMachine
#

# Check to see if script is being run as the root user

if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root. Aborting..." 1>&2
  echo "ssh -p XXXX root@HOSTNAME"
  exit 1
fi

VERSION="{{config.deployment.nodejs.version}}"
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version> (e.g. 0.6.0)"
  exit 127
fi

# Is the gcc compiler installed? If not, install
pkgin list | grep -q gcc-compiler

if [ $? -eq 1 ]; then
    pkgin -f update # make sure the local repo is up to date
  pkgin -y install gcc-compiler
fi

# Don't create the src dir if it already exists
if [ ! -e ~/src/ ]; then
  mkdir ~/src
fi

cd ~/src

# Check if the version of node is installed, if so exit
if [ -e /opt/nodejs/v${VERSION}/ ]; then
  echo "/opt/nodejs/v${VERSION}/ exists. ${VERSION} Already installed?"
  exit
fi

# Download, make and compile node
curl -O http://nodejs.org/dist/v${VERSION}/node-v${VERSION}.tar.gz
gtar -xpf  node-v${VERSION}.tar.gz
cd node-v${VERSION}/
./configure --with-dtrace --prefix=/opt/nodejs/v${VERSION}/
gmake install

# Clean up but leave the ~/src directory
cd ~/
rm -rf ~/src/node-v${VERSION}*

# Update the symlink so the local version of node is in sync
rm  /home/node/local/nodejs
ln -s /opt/nodejs/v${VERSION}/ /home/node/local/nodejs