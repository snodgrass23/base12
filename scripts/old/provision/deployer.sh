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
chmod 600 /home/$deployer/.ssh/id_rsa
chown -R $deployer:$deployer /home/$deployer/

# sudoer capability just for this project
cat <<EOF > /etc/sudoers.d/node
$deployer     ALL=NOPASSWD: /sbin/restart $project
$deployer     ALL=NOPASSWD: /sbin/stop $project
$deployer     ALL=NOPASSWD: /sbin/start $project
EOF
chmod 0440 /etc/sudoers.d/node

# set node environment
echo 'export NODE_ENV=$environment' > /home/$deployer/.profile

# use our locally installed node binary
echo 'export PATH=\$HOME/local/node/bin:\$PATH' >> /home/$deployer/.profile

# don't use strict known_hosts checking (so we can pull from wherever we want to host our git repo)
cat <<'EOF' > /etc/ssh/ssh_config
Host *
  SendEnv LANG LC_*
  HashKnownHosts yes
  GSSAPIAuthentication yes
  GSSAPIDelegateCredentials no
  StrictHostKeyChecking no
  UserKnownHostsFile=/dev/null
EOF
