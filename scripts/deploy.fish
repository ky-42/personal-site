#!/usr/bin/fish

cd (dirname (readlink -m (status --current-filename)))

source ../config/deploy.fish.env

fish ./client/deploy.fish

fish ./server/deploy.fish