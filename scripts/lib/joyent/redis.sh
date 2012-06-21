version=`redis-server --version`
if [ "$version" = 'Redis server version 2.2.2 (00000000:0)' ]
then
  echo "redis 2.2.2 is already installed"
  svccfg import /opt/local/share/smf/manifest/redis.xml

  svcadm enable redis
  exit
fi

pkgin -y in redis

svccfg import /opt/local/share/smf/manifest/redis.xml

svcadm enable redis