
# install nginx
apt-get install --yes python-software-properties
add-apt-repository --yes ppa:nginx/stable
apt-get update --yes
apt-get install --yes nginx

# configure nginx
cat <<'EOF' > /etc/nginx/nginx.conf
user www-data;
worker_processes 4;
pid /var/run/nginx.pid;

events {
  worker_connections 768;
  # multi_accept on;
}

http {

  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 65;
  types_hash_max_size 2048;

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

  gzip on;
  gzip_disable "msie6";

  ##
  # If HTTPS, then set a variable so it can be passed along.
  ##

  map \$scheme \$server_https {
    default off;
    https on;
  }

  server {
    root /home/$deployer/app/current/app/public;

    server_name localhost;

    location / {
      try_files \$uri \$uri/;
    }
  }

  # HTTPS server
  #
  #server {
  #       listen 443;
  #       server_name localhost;
  #
  #       root html;
  #       index index.html index.htm;
  #
  #       ssl on;
  #       ssl_certificate cert.pem;
  #       ssl_certificate_key cert.key;
  #
  #       ssl_session_timeout 5m;
  #
  #       ssl_protocols SSLv3 TLSv1;
  #       ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv3:+EXP;
  #       ssl_prefer_server_ciphers on;
  #
  #       location / {
  #               try_files \$uri \$uri/ /index.html;
  #       }
  #}
}
EOF

# keep nginx alive
cat <<'EOF' > /etc/init/nginx.conf
description "nginx"

start on (filesystem and net-device-up IFACE=lo)
stop on runlevel [!2345]

exec nginx

expect fork
respawn
EOF

#start nginx
start nginx
