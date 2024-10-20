#!/bin/bash

# Define the container name and image
CONTAINER_NAME="notifyworker"
IMAGE_NAME="notifyworker"
PORT_MAPPING="1122:1122"

# Function to start the container
start_container() {
    echo "Starting the container..."
    docker run -d --restart unless-stopped -p $PORT_MAPPING --name $CONTAINER_NAME $IMAGE_NAME
    echo "Container started."
}

# Function to stop the container
stop_container() {
    echo "Stopping the container..."
    docker stop $CONTAINER_NAME
    echo "Container stopped."
}

# Function to remove the container
remove_container() {
    echo "Removing the container..."
    stop_container
    docker rm -f $CONTAINER_NAME
    echo "Container removed."
}

# Function to rebuild the container
rebuild_container() {
    echo "Rebuilding the container..."
    stop_container
    remove_container
    bash build.sh
}

# Function to display the menu
show_menu() {
    echo "Choose an option:"
    echo "1) Start the container"
    echo "2) Stop the container"
    echo "3) Remove the container"
    echo "4) Rebuild the container"
    echo "5) Exit"
}

# Main menu loop
while true; do
    show_menu
    read -p "Enter your choice (1-5): " choice

    case "$choice" in
        1)
            start_container
            ;;
        2)
            stop_container
            ;;
        3)
            remove_container
            ;;
        4)
            rebuild_container
            ;;
        5)
            echo "Exiting..."
            break
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac
    echo
done
