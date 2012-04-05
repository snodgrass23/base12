echo "Copying keys to admin@{{host}}..."
scp -Bp config/keys/*.pub admin@{{host}}:~/.ssh/

echo "Copying keys to root@{{host}}..."
scp -Bp config/keys/*.pub root@{{host}}:~/.ssh/