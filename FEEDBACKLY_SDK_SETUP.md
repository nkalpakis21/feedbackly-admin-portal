# Feedbackly SDK Integration Setup

This document explains how to switch between the production NPM package and local development version of the Feedbackly SDK.

## 🎯 Overview

The admin portal now supports two modes for the Feedbackly SDK:

1. **NPM Package Mode** (Default): Uses the published [feedbackly-sdk](https://www.npmjs.com/package/feedbackly-sdk) package
2. **Local Development Mode**: Uses local SDK files for testing changes

## 🔧 Configuration Methods

### Method 1: Environment Variables (Recommended)

Create a `.env.local` file in the admin-portal directory:

```bash
# Use NPM package (default)
NEXT_PUBLIC_USE_LOCAL_FEEDBACKLY_SDK=false

# Use local development files
NEXT_PUBLIC_USE_LOCAL_FEEDBACKLY_SDK=true
```

### Method 2: URL Parameters (Quick Testing)

Add URL parameters to switch modes without changing files:

```bash
# Use NPM package
http://localhost:3000?use-local-sdk=false

# Use local development
http://localhost:3000?use-local-sdk=true
```

### Method 3: NPM Scripts

Use the provided npm scripts for easy switching:

```bash
# Development with NPM package
npm run dev:npm-sdk

# Development with local SDK
npm run dev:local-sdk

# Build with NPM package
npm run build:npm-sdk

# Build with local SDK
npm run build:local-sdk
```

### Method 4: Development Toggle (UI)

In development mode, a toggle widget appears in the top-left corner allowing you to switch between sources with a single click.

## 📁 File Structure

```
admin-portal/
├── src/
│   ├── lib/
│   │   ├── feedbackly-config.ts      # Environment-based configuration
│   │   ├── feedbackly-loader.ts      # Dynamic SDK loader
│   │   └── feedbackly/               # Local SDK files (when using local mode)
│   │       ├── core/
│   │       ├── api/
│   │       ├── widget/
│   │       └── utils/
│   └── components/
│       ├── FeedbacklyWidget.tsx      # Main widget component
│       └── FeedbacklyDevToggle.tsx   # Development toggle UI
├── package.json                      # NPM package dependency
└── .env.local                        # Environment configuration
```

## 🚀 Usage Examples

### Testing NPM Package Updates

1. **Publish new version to NPM**:
   ```bash
   cd ../feedbackly-sdk
   npm version patch
   npm publish
   ```

2. **Update admin portal to use new version**:
   ```bash
   cd ../admin-portal
   npm update feedbackly-sdk
   ```

3. **Test the new version**:
   ```bash
   npm run dev:npm-sdk
   ```

### Testing Local Changes

1. **Make changes to local SDK**:
   ```bash
   cd ../feedbackly-sdk
   # Make your changes
   npm run build
   ```

2. **Test changes in admin portal**:
   ```bash
   cd ../admin-portal
   npm run dev:local-sdk
   ```

### Quick Toggle During Development

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Use the development toggle** in the top-left corner to switch between sources
3. **Reload the page** when prompted to apply changes

## 🔍 Debugging

### Check Current Configuration

The console will show which SDK source is being used:

```
🔧 Feedbackly SDK Configuration: {
  useLocalSDK: false,
  source: 'NPM Package',
  version: '^1.0.0'
}
```

### Common Issues

1. **SDK not loading**: Check that the npm package is installed (`npm list feedbackly-sdk`)
2. **Local files not found**: Ensure the local SDK path is correct in configuration
3. **Build errors**: Make sure both SDK versions are compatible with your Next.js setup

## 📦 NPM Package Information

- **Package**: [feedbackly-sdk](https://www.npmjs.com/package/feedbackly-sdk)
- **Current Version**: 1.0.0
- **Repository**: [nkalpakis21/feedbackly-sdk](https://github.com/nkalpakis21/feedbackly-sdk)

## 🎯 Best Practices

1. **Default to NPM package** for production and most development
2. **Use local mode** only when testing SDK changes
3. **Always test both modes** before deploying
4. **Keep local SDK files in sync** with the npm package
5. **Use the development toggle** for quick testing during development

## 🔄 Workflow for SDK Updates

1. **Develop changes** in the feedbackly-sdk repository
2. **Test locally** using `npm run dev:local-sdk`
3. **Publish to NPM** when ready
4. **Update admin portal** to use the new version
5. **Test with NPM package** using `npm run dev:npm-sdk`
6. **Deploy** when everything works correctly

This setup provides maximum flexibility for development while maintaining production stability.
