#!/bin/bash

# Versioning script for microservices monorepo
# Usage: ./scripts/version.sh <service-name> <version-type>
# Version types: major, minor, patch

set -e

SERVICE_NAME=$1
VERSION_TYPE=$2

if [ -z "$SERVICE_NAME" ] || [ -z "$VERSION_TYPE" ]; then
    echo "Usage: $0 <service-name> <version-type>"
    echo "Services: auth-service, user-service, timetracking-service, gateway"
    echo "Version types: major, minor, patch"
    exit 1
fi

# Validate service name
case $SERVICE_NAME in
    auth-service|user-service|timetracking-service|gateway)
        ;;
    *)
        echo "Invalid service name: $SERVICE_NAME"
        exit 1
        ;;
esac

# Validate version type
case $VERSION_TYPE in
    major|minor|patch)
        ;;
    *)
        echo "Invalid version type: $VERSION_TYPE"
        exit 1
        ;;
esac

SERVICE_DIR="./$SERVICE_NAME"
if [ ! -d "$SERVICE_DIR" ]; then
    echo "Service directory not found: $SERVICE_DIR"
    exit 1
fi

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('$SERVICE_DIR/package.json').version")
echo "Current version of $SERVICE_NAME: $CURRENT_VERSION"

# Calculate new version
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

case $VERSION_TYPE in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    patch)
        PATCH=$((PATCH + 1))
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"

# Update package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$SERVICE_DIR/package.json', 'utf8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('$SERVICE_DIR/package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Update version.json
node -e "
const fs = require('fs');
const versionFile = './version.json';
let versions = {};
if (fs.existsSync(versionFile)) {
    versions = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
}
if (!versions.services) versions.services = {};
versions.services['$SERVICE_NAME'] = {
    version: '$NEW_VERSION',
    changelog: 'Version bump to $NEW_VERSION'
};
versions.lastUpdated = new Date().toISOString();
fs.writeFileSync(versionFile, JSON.stringify(versions, null, 2) + '\n');
"

# Create git tag
TAG_NAME="$SERVICE_NAME-v$NEW_VERSION"
git add "$SERVICE_DIR/package.json" version.json
git commit -m "chore($SERVICE_NAME): bump version to $NEW_VERSION"
git tag "$TAG_NAME"

echo "✅ Successfully updated $SERVICE_NAME to version $NEW_VERSION"
echo "📦 Created git tag: $TAG_NAME"
echo "🚀 To push changes: git push origin main --tags"