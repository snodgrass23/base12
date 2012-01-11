cd /root
apt-get update --yes
apt-get upgrade --yes
ulimit -n 64000
sysctl -w fs.file-max=100000
apt-get install --yes build-essential git-core libssl-dev curl python-setuptools sendmail upstart python-software-properties imagemagick libmagickcore-dev libmagickwand-dev