#!/bin/bash

INVENTORY="../ansible/inventory.yml"

case "$1" in
    "deploy")
        echo "Deploying application..."
        ansible-playbook -i $INVENTORY ../ansible/deploy.yml
        ;;
    "stop")
        echo "Stopping servers..."
        ansible-playbook -i $INVENTORY ../ansible/stop.yml
        ;;
esac
