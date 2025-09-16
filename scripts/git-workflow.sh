#!/bin/bash

# Git Workflow Script for Shiply Admin Portal
# Usage: ./scripts/git-workflow.sh "feature-branch-name" "commit message"

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Get arguments
FEATURE_BRANCH=$1
COMMIT_MESSAGE=$2

# Validate arguments
if [ -z "$FEATURE_BRANCH" ] || [ -z "$COMMIT_MESSAGE" ]; then
    print_error "Usage: $0 <feature-branch-name> <commit-message>"
    print_error "Example: $0 feature/add-new-widget \"Add new widget component\""
    exit 1
fi

<<<<<<< HEAD
# Determine the development branch (dev or develop)
DEV_BRANCH="dev"
if git show-ref --verify --quiet refs/heads/develop; then
    DEV_BRANCH="develop"
=======
# Determine the development branch (develop or dev)
DEV_BRANCH="develop"
if ! git show-ref --verify --quiet refs/heads/develop; then
    DEV_BRANCH="dev"
>>>>>>> develop
fi

print_status "Using development branch: $DEV_BRANCH"

# Step 1: Ensure we're on the latest dev/develop
print_status "Switching to $DEV_BRANCH and pulling latest changes..."
git checkout $DEV_BRANCH
git pull origin $DEV_BRANCH

# Step 2: Create feature branch
print_status "Creating feature branch: $FEATURE_BRANCH"
git checkout -b $FEATURE_BRANCH

print_success "Feature branch '$FEATURE_BRANCH' created and ready for changes!"
print_warning "Make your changes, then run:"
print_warning "  git add ."
print_warning "  git commit -m \"$COMMIT_MESSAGE\""
print_warning "  ./scripts/git-merge.sh $FEATURE_BRANCH"
