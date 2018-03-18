#!/usr/bin/env bash

sudo apt-get update -qq
sudo apt-get install mosquitto
sudo service mosquitto stop
killall mosquitto
mosquitto