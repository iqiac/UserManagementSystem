#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$0")

echo "USER=$(whoami)
UID=$(id -u $USER)" > ${SCRIPT_DIR}/.env

exit 0
