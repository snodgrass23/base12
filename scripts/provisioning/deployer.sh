# setup a deploy user
useradd -U -s /bin/bash -m $deployer

# ssh directory
mkdir -p /home/$deployer/.ssh
touch /home/$deployer/.ssh/authorized_keys
touch /home/$deployer/.ssh/known_hosts

# github known_hosts - hopefully don't need this

# ssh keys
echo "$allkeys" > /home/$deployer/.ssh/authorized_keys

# chmod authorized_keys
chmod 600 /home/$deployer/.ssh/authorized_keys

# add private key
echo "$privatekey" > /home/$deployer/.ssh/id_rsa

# chmod keys
#chmod 600 /home/$deployer/.ssh/id_rsa.pub
chmod 600 /home/$deployer/.ssh/id_rsa
chown -R $deployer:$deployer /home/$deployer/

# sudoers
# TODO: Make sure this is limited enough
cat <<EOF > /etc/sudoers.d/node
$deployer     ALL=NOPASSWD: /sbin/restart $project
$deployer     ALL=NOPASSWD: /sbin/stop $project
$deployer     ALL=NOPASSWD: /sbin/start $project
EOF
chmod 0440 /etc/sudoers.d/node

# set node environment
echo 'export NODE_ENV=$environment' >> /home/$deployer/.profile

