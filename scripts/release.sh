#!/bin/bash

# Release script for microservices
# Creates release tags and builds Docker images with version tags

set -e

SERVICE_NAME=$1

if [ -z "$SERVICE_NAME" ]; then
    echo "Usage: $0 <service-name>"
    echo "Services: auth-service, user-service, timetracking-service, gateway, all"
    exit 1
fi

build_service() {
    local service=$1
    local version=$(node -p "require('./$service/package.json').version")
    
    echo "🏗️  Building $service:$version"
    
    # Build Docker image with version tag
    docker build -t "$service:$version" -t "$service:latest" "./$service"
    
    echo "✅ Built $service:$version"
}

if [ "$SERVICE_NAME" = "all" ]; then
    echo "🚀 Building all services..."
    build_service "auth-service"
    build_service "user-service" 
    build_service "timetracking-service"
    build_service "gateway"
    echo "🎉 All services built successfully!"
else
    build_service "$SERVICE_NAME"
fi