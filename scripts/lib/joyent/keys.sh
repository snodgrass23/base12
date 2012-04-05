

echo "Copying keys to admin@{{host}}..."
scp config/keys/*.pub admin@{{host}}:~/.ssh/

echo "Copying keys to root@{{host}}..."
scp config/keys/*.pub root@{{host}}:~/.ssh/