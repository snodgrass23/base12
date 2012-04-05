echo "User: {{constants.name}}"
echo "Creating user and group. Errors here on duplicates are okay."
# setup a deploy user
groupadd {{constants.name}}
useradd -g {{constants.name}} -m -s /usr/bin/bash {{constants.name}}
passwd -N {{constants.name}}

# ssh directory
echo "Creating home directory."
mkdir -p /home/{{constants.name}}/.ssh
touch /home/{{constants.name}}/.ssh/authorized_keys
touch /home/{{constants.name}}/.ssh/known_hosts

# Create a directory to hold our config, git, versions, and current deploy
mkdir -p /home/{{constants.name}}/config
#mkdir -p /home/{{constants.name}}/repo
mkdir -p /home/{{constants.name}}/versions
mkdir -p /home/{{constants.name}}/current

# ssh keys
echo "Copying public keys into authorized_keys."
echo "{{allkeys}}" > /home/{{constants.name}}/.ssh/authorized_keys

# chmod authorized_keys
chmod 600 /home/{{constants.name}}/.ssh/authorized_keys

# add private key
# echo "$privatekey" > /home/{{constants.name}}/.ssh/id_rsa

# chmod keys
#chmod 600 /home/$deployer/.ssh/id_rsa
chown -R {{constants.name}}:{{constants.name}} /home/{{constants.name}}/

# set node environment
echo "Setting NODE_ENV."
echo 'export NODE_ENV={{config.NODE_ENV}}' > /home/{{constants.name}}/.profile

# use our locally installed node binary
echo "Updating PATH."
echo 'export PATH=/home/{{constants.name}}/local/bin:$PATH' >> /home/{{constants.name}}/.profile

# don't use strict known_hosts checking (so we can pull from wherever we want to host our git repo)
echo "Disabling strict known_hosts checking for ssh."
cat <<'EOF' > /etc/ssh/ssh_config
Host *
  SendEnv LANG LC_*
  HashKnownHosts yes
  GSSAPIAuthentication yes
  GSSAPIDelegateCredentials no
  StrictHostKeyChecking no
  UserKnownHostsFile=/dev/null
EOF

