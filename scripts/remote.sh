echo "Removing {{remote}}"
git remote rm {{remote}}
echo "Adding {{remote}} as {{constants.name}}@{{host}}:repo"
git remote add {{remote}} {{constants.name}}@{{host}}:repo
