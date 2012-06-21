curl -O http://wiki.joyent.com/download/attachments/1639170/mongodbnode.sh
bash mongodbnode.sh 2.0.2
source ~/.bashrc
pfexec svcadm enable mongodb