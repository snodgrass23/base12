echo "User: {{constants.name}}"
echo "Creating user and group. Errors here on duplicates are okay."
# setup a deploy user
useradd -s /bin/bash {{constants.name}}
groupadd {{constants.name}}

# ssh directory
echo "Creating home directory."
mkdir -p /home/{{constants.name}}/.ssh
touch /home/{{constants.name}}/.ssh/authorized_keys
touch /home/{{constants.name}}/.ssh/known_hosts

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
echo 'export PATH=$HOME/local/bin:$PATH' >> /home/{{constants.name}}/.profile

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

# Create a directory to hold our config
mkdir -p ~/config

# Create a directory to hold our app's git repository
mkdir -p ~/repo

# Create directory to hold all the versions of our app
mkdir -p ~/versions

# Create a directory to hold the current version of our app
mkdir -p ~/current