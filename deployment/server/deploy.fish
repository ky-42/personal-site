#!/usr/bin/fish

cd (dirname (readlink -m (status --current-filename)) | rev | cut -d'/' -f3- | rev)/server

if ! type -q cargo
    echo "Please install cargo"
    exit 1
end

cargo build --release

ssh (echo $SERVER_SERVER_USER)@(echo $SERVER_SERVER_ADDRESS) "rm -r $CLIENT_DEPLOY_FILES_LOCATION"
scp -r ./target/release/server (echo $SERVER_SERVER_USER)@(echo $CLIENT_SERVER_ADDRESS):(echo $SERVER_DEPLOY_FILES_LOCATION)