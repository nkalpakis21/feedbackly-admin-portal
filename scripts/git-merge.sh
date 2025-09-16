#!/bin/bash

# Git Merge Script for Shiply Admin Portal
# Usage: ./scripts/git-merge.sh "feature-branch-name"

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

# Validate arguments
if [ -z "$FEATURE_BRANCH" ]; then
    print_error "Usage: $0 <feature-branch-name>"
    print_error "Example: $0 feature/add-new-widget"
    exit 1
fi

# Check if feature branch exists
if ! git show-ref --verify --quiet refs/heads/$FEATURE_BRANCH; then
    print_error "Feature branch '$FEATURE_BRANCH' does not exist!"
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

# Step 1: Switch to feature branch and push if not already pushed
print_status "Switching to feature branch: $FEATURE_BRANCH"
git checkout $FEATURE_BRANCH

# Check if branch has been pushed
if ! git rev-parse --verify --quiet origin/$FEATURE_BRANCH; then
    print_status "Pushing feature branch to origin..."
    git push origin $FEATURE_BRANCH
fi

# Step 2: Merge into dev/develop
print_status "Merging $FEATURE_BRANCH into $DEV_BRANCH..."
git checkout $DEV_BRANCH
git pull origin $DEV_BRANCH
git merge $FEATURE_BRANCH
git push origin $DEV_BRANCH

print_success "Successfully merged $FEATURE_BRANCH into $DEV_BRANCH!"

# Step 3: Merge into main
print_status "Merging $DEV_BRANCH into main..."
git checkout main
git pull origin main
git merge $DEV_BRANCH
git push origin main

print_success "Successfully merged $DEV_BRANCH into main!"

# Step 4: Clean up feature branch
print_status "Cleaning up feature branch..."
git branch -d $FEATURE_BRANCH
git push origin --delete $FEATURE_BRANCH

print_success "Feature branch '$FEATURE_BRANCH' has been deleted!"

print_success "🎉 Complete workflow finished successfully!"
print_status "Changes are now in both $DEV_BRANCH and main branches"
