#!/usr/bin/fish

cd (dirname (readlink -m (status --current-filename)) | rev | cut -d'/' -f3- | rev)/client

if ! type -q yarn
    echo "Please install yarn"
    exit 1
end

yarn install
yarn build

ssh (echo $CLIENT_SERVER_USER)@(echo $CLIENT_SERVER_ADDRESS) "rm -r /var/www/$CLIENT_DEPLOY_FILES_LOCATION"
scp -r ./build/* (echo $CLIENT_SERVER_USER)@(echo $CLIENT_SERVER_ADDRESS):"/var/www/$CLIENT_DEPLOY_FILES_LOCATION"