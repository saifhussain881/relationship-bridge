# Deployment Guide for GraceBridge

This document provides instructions for deploying the GraceBridge application to various free hosting platforms.

## Prerequisites

- A Cohere API key (sign up at https://cohere.ai/)
- Git installed on your computer
- GitHub account (for some deployment options)

## Option 1: Deploy to Render.com (Recommended)

Render.com offers a free tier that works well for this application.

1. Sign up for a free account at [Render.com](https://render.com/)

2. From your dashboard, click "New" and select "Web Service"

3. Connect your GitHub repository or use the "Public Git repository" option with your repo URL

4. Configure your web service:
   - Name: `gracebridge` (or your preferred name)
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `node server.js`

5. Add the following environment variable:
   - Key: `COHERE_API_KEY`
   - Value: Your Cohere API key

6. Click "Create Web Service"

Render will automatically deploy your application and provide you with a URL.

## Option 2: Deploy to Heroku

1. Sign up for a free account at [Heroku](https://www.heroku.com/)

2. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

3. Login to Heroku from your terminal:
   ```
   heroku login
   ```

4. Navigate to your project directory and create a Heroku app:
   ```
   cd gracebridge
   heroku create gracebridge-app
   ```

5. Add your Cohere API key to Heroku:
   ```
   heroku config:set COHERE_API_KEY=your_api_key_here
   ```

6. Deploy your application:
   ```
   git push heroku master
   ```

7. Open your application:
   ```
   heroku open
   ```

## Option 3: Deploy to Glitch

1. Sign up for a free account at [Glitch](https://glitch.com/)

2. Create a new project and select "Import from GitHub"

3. Enter your GitHub repository URL

4. Once imported, add your Cohere API key in the `.env` file:
   ```
   COHERE_API_KEY=your_api_key_here
   ```

5. Your app will be automatically deployed and available at a Glitch URL

## Option 4: Deploy to Vercel

For this option, you'll need to separate the frontend and backend:

1. Sign up for a free account at [Vercel](https://vercel.com/)

2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Deploy the frontend:
   ```
   cd gracebridge
   npm run build
   vercel
   ```

4. For the backend, you can use Render.com as described in Option 1, or another service like Railway.app

## Important Notes

- The free tiers of these services may have limitations such as:
  - Sleep after inactivity (your app may take a moment to "wake up")
  - Limited compute resources
  - Bandwidth restrictions

- For production use, consider upgrading to a paid tier for better reliability and performance.

- Remember to keep your Cohere API key secure and never commit it to your repository. 