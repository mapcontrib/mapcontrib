#!/bin/sh

PWD=$(pwd)
DIR=$(realpath `dirname $0`)

cd $DIR/..

docker build -t mapcontrib/mapcontrib -f docker/Dockerfile .

cd $PWD
