class db_server {

  $manager = $operatingsystem ? {
    solaris => 'pkgin',
    ubuntu => 'apt',
  }

  package { "mongodb":
    ensure => present,
    provider => $manager,
  }

  package { "redis":
    ensure => present,
    provider => $manager
  }

  if $operatingsystem == "solaris" {
    exec { "svcadm enable redis": 
      path => ["/usr/bin", "/usr/sbin"]
    }
  }
}

class { 'db_server': }