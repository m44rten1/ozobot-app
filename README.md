# Ozobot Drawing App

A simple web-based drawing application with color selection, undo functionality, and fullscreen support.

## Features

- Draw with different colors (black, red, green, blue)
- Undo last drawn line
- Clear entire canvas
- Fullscreen mode (with iOS/iPad support)
- Responsive design for various devices

## GitHub Pages Deployment

This project is set up to be easily deployed to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Fork or clone this repository**

2. **Enable GitHub Pages in your repository settings**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"

3. **Push your changes to the main branch**
   - The GitHub Actions workflow will automatically build and deploy your app
   - Your app will be available at `https://[your-username].github.io/ozobot-playground/`

4. **Customize the base path (if needed)**
   - If your repository has a different name than `ozobot-playground`, update the `base` property in `vite.config.js`
   - Change `base: '/ozobot-playground/'` to match your repository name

### Manual Deployment

If you prefer to deploy manually:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the contents of the `dist` folder to GitHub Pages**
   - You can use the [gh-pages](https://www.npmjs.com/package/gh-pages) package:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

## Local Development

To run the app locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173/