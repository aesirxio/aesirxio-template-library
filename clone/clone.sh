#/bin/bash

source <(grep -v '^#' .env | sed -E 's|^(.+)=(.*)$|: ${\1=\2}; export \1|g')

echo "Create project template"

rm -rf $projectPath/$projectName-template
git clone $templateSrc $projectPath/$projectName-template

cd $projectPath/$projectName-template

find . -type f -exec sed -i "s/$search/$projectName/g" {} \;

git remote set-url origin $templateDest
git commit -am "$projectName"
git push origin master

# DB
echo "Download database..."
sshpass -p $passwordSrc ssh $usernameSrc@$hostSrc -p 4975 -o StrictHostKeyChecking=no "mysqldump -u $usernameSrc -p$passwordSrc --default-character-set=utf8 --no-tablespaces deepc | gzip -9" > db.sql.gz 
gzip -d db.sql.gz

find . -type f -name "db.sql" -exec sed -i "s/$search/$projectName/g" {} \;

echo "Restoring database..."

sshpass -p $passwordDest ssh $usernameDest@$hostDest -p 4975 -o StrictHostKeyChecking=no "mysql -u$usernameDest -p$passwordDest --default-character-set=utf8 $usernameDest" < db.sql

rm db.sql

