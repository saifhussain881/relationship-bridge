/**
 * GraceBridge Deployment Helper
 * 
 * This script helps prepare your application for deployment.
 * Run it with: node deploy.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env file exists
const envCheck = () => {
  console.log('Checking environment configuration...');
  
  if (!fs.existsSync(path.join(__dirname, '.env'))) {
    console.log('\x1b[33m%s\x1b[0m', 'Warning: No .env file found.');
    console.log('Creating .env file from env.example...');
    
    try {
      fs.copyFileSync(
        path.join(__dirname, 'env.example'),
        path.join(__dirname, '.env')
      );
      console.log('\x1b[32m%s\x1b[0m', 'Created .env file. Please edit it with your actual API keys.');
    } catch (err) {
      console.error('\x1b[31m%s\x1b[0m', 'Error creating .env file:', err.message);
    }
  } else {
    console.log('\x1b[32m%s\x1b[0m', '.env file exists.');
    
    // Check if COHERE_API_KEY is set
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    if (!envContent.includes('COHERE_API_KEY=') || envContent.includes('COHERE_API_KEY=your_cohere_api_key_here')) {
      console.log('\x1b[33m%s\x1b[0m', 'Warning: COHERE_API_KEY not properly set in .env file.');
    }
  }
};

// Build the application
const buildApp = () => {
  console.log('Building application...');
  
  try {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('Building React application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('\x1b[32m%s\x1b[0m', 'Build completed successfully!');
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Build failed:', err.message);
    process.exit(1);
  }
};

// Main function
const main = async () => {
  console.log('\x1b[36m%s\x1b[0m', '=== GraceBridge Deployment Helper ===');
  
  // Check environment
  envCheck();
  
  // Ask for confirmation to build
  rl.question('Do you want to build the application now? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      buildApp();
    }
    
    console.log('\n\x1b[36m%s\x1b[0m', '=== Deployment Instructions ===');
    console.log('1. Make sure your COHERE_API_KEY is set in your .env file or deployment platform.');
    console.log('2. See DEPLOYMENT.md for detailed instructions on how to deploy to various platforms.');
    console.log('\nGood luck with your deployment!');
    
    rl.close();
  });
};

// Run the main function
main().catch(err => {
  console.error('\x1b[31m%s\x1b[0m', 'Error:', err.message);
  process.exit(1);
}); 