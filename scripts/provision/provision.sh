#!/usr/bin/env bash

VERSION="0.1.1"
CONFIG=./deploy.conf
LOG=/tmp/provision.log
KEYS=./provisioning/keys
SCRIPTS=./provisioning
TEST=1
REF=
ENV=
USER=$2
REMOTEPATH=
PROJECTNAME=

#
# Output usage information.
#

usage() {
  cat <<-EOF

  Usage: provision <server> <user> [command]

  Example: provision staging root
           provision production john keys

  <remote> should match a [remote] section in deploy.conf

  Options:

    -C, --chdir <path>    change the working directory to <path>
    -h, --help            output help information
    -v, --version         output version

  Commands:

    all (default)         runs all provisioning scripts
    keys                  adds keys/* to root and deploy /.ssh
    deployer              creates deploy user
    environment           updates ubuntu, pulls common apt packages
    node                  installs node (and npm, part of node now)
    upstart               creates upstart script in /etc/init
    mongo                 installs mongodb
    redis                 installs redis
    nginx                 installs nginx

EOF
}

#
# Abort with <msg>
#

abort() {
  echo
  echo "  $@" 1>&2
  echo
  exit 1
}

hr() {
  echo "============================================================="
}

#
# Log <msg>.
#

log() {
  echo ""
  echo "  ○ $@"
  echo ""
}

#
# Check if config <section> exists.
#

config_section() {
  grep "^\[$1" $CONFIG &> /dev/null
}

#
# Get config value by <key>.
#

config_get() {
  local key=$1
  test -n "$key" \
    && grep "^\[$ENV" -A 20 $CONFIG \
    | grep "^$key" \
    | head -n 1 \
    | cut -d ' ' -f 2-999
}

#
# Output version.
#

version() {
  echo $VERSION
}

#
# Run the given remote <cmd>.
#

run() {
  local url="$USER@`config_get host`"
  #login only:
  #expect -c "spawn ssh $url ; expect assword ; send \"$adminpass\n\" ; interact"
  #old:
  #expectprogram="spawn -noecho ssh $url ; log_user 0 ; expect assword ; send \"$adminpass\r\" ; log_user 1 ; send \"$@\r\" ; close"
  #loud:
  expectprogram="set timeout 5 ; spawn ssh $url ; expect assword ; send \"$adminpass\r\" ; sleep 1 ; send \"$@\r\" ; sleep 1 ; send \"exit\r\" ; interact"
  #current:
  #expectprogram="log_user 1 ; set timeout 5 ; spawn -noecho ssh -o \"PubkeyAuthentication no\" $url ; expect assword ; send \"$adminpass\r\" ; sleep 1 ; send \"$@\r\" ; sleep 1 ; send \"exit\r\" ; interact" 
  expect -c "$expectprogram" > $LOG 2>&1
}

#
# Run a script remotely
#

script() {
  local url="$1@`config_get host`"
  local shell="ssh $url"
  $shell 'bash -s' < $2
}

template() {
  { echo "cat <<EOFNOREALLY"
   cat "$@"
   echo "EOFNOREALLY"
  } | sh > "/tmp/templated.sh"

  script $USER "/tmp/templated.sh"
  rm /tmp/templated.sh
}

#
# Output config or [key].
#

config() {
  if test $# -eq 0; then
    cat $CONFIG
  else
    config_get $1
  fi
}

#
# Execute hook <name> relative to the path configured.
#

hook() {
  test -n "$1" || abort hook name required
  local hook=$1
  local path=$REMOTEPATH
  local cmd=`config_get $hook`
  if test -n "$cmd"; then
    log "executing $hook \`$cmd\`"
    run "cd $path/current; \
      SHARED=\"$path/shared\" \
      $cmd 2>&1 | tee -a $LOG; \
      exit \${PIPESTATUS[0]}"
    test $? -eq 0
  else
    log hook $hook
  fi
}

#
# Provision the environment
#

environment() {
  hr
  log "setting up the environment"
  script "$SCRIPTS/environment.sh"
}

#
# Add users and public keys
#

# TODO: Pipe errors from the server back. Right now I think it will fail silently.
keys() {
  hr
  log "adding admin public keys"
  export allkeys="`awk 'FNR==1{print ""}1' $KEYS/*.pub`"
  template "$SCRIPTS/keys.sh"
}

#
# Add deploy user
#

deployer() {
  hr
  log "setting up deployer user $PROJECTNAME@`config_get host`"
  export deployer=$PROJECTNAME
  export allkeys="`awk 'FNR==1{print ""}1' $KEYS/*.pub`"
  export privatekeypath=`config_get private`
  test -n "$privatekeypath" && export privatekey=`cat $privatekeypath` || export privatekey=""
  export environment=`config_get environment`
  export project=`config_get project`
  template "$SCRIPTS/deployer.sh"
}

#
# Install node
#

node() {
  if [[ `config_get stack` != 'node' ]]; then return 0; fi
  hr
  log "installing node" 
  script $PROJECTNAME "$SCRIPTS/node.sh"
}

#
# Install upstart script
#

upstart() {
  if [[ `config_get stack` != 'node' ]]; then return 0; fi
  hr
  log "configuring upstart"
  export project=`config_get project`
  export deployer=$PROJECTNAME
  export path=$REMOTEPATH
  template "$SCRIPTS/upstart.sh"
}

#
# Install mongo
#

mongo() {
  if [[ `config_get stack` != 'node' ]]; then return 0; fi
  hr
  log "installing mongo"
  script $USER "$SCRIPTS/mongo.sh"
}

#
# Install redis
#

redis() {
  if [[ `config_get stack` != 'node' ]]; then return 0; fi
  hr
  log "installing redis"
  script $USER "$SCRIPTS/redis.sh"
}

#
# Install nginx
#

nginx() {
  if [[ `config_get stack` != 'nginx' ]]; then return 0; fi
  log "installing nginx"
  export deployer=$PROJECTNAME
  template "$SCRIPTS/nginx.sh"
}

#
# Run all provisioning scripts
#

all() {
  keys
  deployer  
  environment
  node
  upstart
  mongo
  redis
  nginx
  #mysql
}

#
# Provision
#

provision() {
  all
}

#
# Require environment arg.
#

require_env() {
  config_section $ENV || abort "[$ENV] config section not found in deploy.conf"
  test -z "$ENV" && usage && exit
  test -z "$USER" && usage && exit

  # settings that can be computed from the deploy.conf vars
  PROJECTNAME=`config_get project`
  test -z "$PROJECTNAME" && abort "project name must be specified in deploy.conf"
  REMOTEPATH="/home/$PROJECTNAME/app"
}

# parse argv

while test $# -ne 0; do
  arg=$1; shift
  case $arg in
    -h|--help) usage; exit ;;
    -V|--version) version; exit ;;
    -C|--chdir) log cd $1; cd $1; shift ;;
    all) require_env; all; exit ;;
    keys) require_env; keys; exit ;;
    deployer) require_env; deployer; exit ;;
    environment) require_env; environment; exit ;;    
    node) require_env; node; exit ;;
    upstart) require_env; upstart; exit;;
    mongo) require_env; mongo; exit ;;
    redis) require_env; redis; exit ;;
    nginx) require_env; nginx; exit ;;
    config) config $@; exit ;;
    *)
      if test -z "$ENV"; then
        ENV=$arg;
      else
        REF="$REF $arg";
      fi
      ;;
  esac
done

require_env

# provision
provision