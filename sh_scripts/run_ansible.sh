#!/bin/bash

INVENTORY="inventory.yml"

case "$1" in
    "deploy")
        echo "Deploying application..."
        ansible-playbook -i $INVENTORY deploy.yml
        ;;
    "stop")
        echo "Stopping servers..."
        ansible-playbook -i $INVENTORY stop.yml
        ;;
esac
