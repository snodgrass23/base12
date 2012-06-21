PRIVATE_IP=`ifconfig -a | grep 'inet 10.' | grep -v '127.0.0.1' | awk '{ print $2}'`

echo "Master IP: {{{config.deployment.riak.master}}}"
echo "Private IP: $PRIVATE_IP"

echo "Disabling riak service"
svcadm disable riak
sleep 5

echo "Setting cookie"
sed -i "s/-setcookie.*/-setcookie {{{config.deployment.riak.cookie}}}/" /opt/local/etc/riak/vm.args
sleep 5

echo "Enabling riak service"
svcadm enable riak
sleep 10

# Abort if this IP is already in our ring
(riak-admin status | grep ring_members | grep {{{config.deployment.riak.master}}}) || (

  echo "Joining to cluster via {{{config.deployment.riak.master}}}"
  /opt/local/sbin/riak-admin join riak@{{{config.deployment.riak.master}}}

  sleep 10
  riak-admin status | grep ring_members
)

sleep 10
riak-admin status | grep ring_members