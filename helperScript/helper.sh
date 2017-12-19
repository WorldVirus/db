#!/bin/bash

docker rm -f $1
docker build -t veniamin .
docker run -p 5000:5000 --name $1 -t veniamin

///docker run -p 5000:5000 --name veniamin -t veniamin
