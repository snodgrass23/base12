echo "Installing rubygems..."
pkgin in ruby18-rubygems
pkgin in ruby18-gemcutter
pkgin in ruby18-gem_plugin
ln -s /opt/local/bin/gem18 /opt/local/bin/gem

echo "Installing puppet..."
gem install puppet
groupadd puppet #installer isn't smart enough to create this; http://projects.puppetlabs.com/issues/9862

echo "Installing puppet-module gem..."
gem install puppet-module

echo "Installing pkgin puppet module rubygem..."
mkdir -p /etc/puppet/modules
cd /etc/puppet/modules
puppet-module install mudge/pkgin

