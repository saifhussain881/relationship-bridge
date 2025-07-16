/**
 * Script to prepare files for Render.com deployment
 * This script creates a render-ready structure in the parent directory
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Source and destination directories
const sourceDir = __dirname; // Current directory (gracebridge)
const destDir = path.join(__dirname, '..'); // Parent directory

console.log('Preparing files for Render.com deployment...');

// Function to copy a file
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    console.log(`Copied: ${path.relative(sourceDir, source)} -> ${path.relative(destDir, destination)}`);
  } catch (err) {
    console.error(`Error copying ${source}: ${err.message}`);
  }
}

// Function to create directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${path.relative(destDir, directory)}`);
  }
}

// Function to copy directory recursively
function copyDirectory(source, destination) {
  ensureDirectoryExists(destination);
  
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules
      if (entry.name === 'node_modules') {
        console.log('Skipping node_modules directory');
        continue;
      }
      
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// Create a package.json in the parent directory
const packageJson = JSON.parse(fs.readFileSync(path.join(sourceDir, 'package.json'), 'utf8'));
fs.writeFileSync(
  path.join(destDir, 'package.json'),
  JSON.stringify(packageJson, null, 2),
  'utf8'
);
console.log('Created package.json in parent directory');

// Copy all directories except node_modules
copyDirectory(path.join(sourceDir, 'public'), path.join(destDir, 'public'));
copyDirectory(path.join(sourceDir, 'src'), path.join(destDir, 'src'));
copyDirectory(path.join(sourceDir, 'routes'), path.join(destDir, 'routes'));

// Copy individual files
const filesToCopy = [
  'server.js',
  'postcss.config.js',
  'tailwind.config.js',
  '.env',
  'env.example',
  'README.md',
  'DEPLOYMENT.md',
  'render.yaml'
];

for (const file of filesToCopy) {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(sourcePath)) {
    copyFile(sourcePath, destPath);
  } else {
    console.log(`File not found, skipping: ${file}`);
  }
}

// Update render.yaml to use the root directory
const renderYamlPath = path.join(destDir, 'render.yaml');
if (fs.existsSync(renderYamlPath)) {
  let renderYaml = fs.readFileSync(renderYamlPath, 'utf8');
  renderYaml = renderYaml.replace(/rootDir: .*/, 'rootDir: .');
  fs.writeFileSync(renderYamlPath, renderYaml, 'utf8');
  console.log('Updated render.yaml to use root directory');
}

console.log('\nDeployment files prepared successfully!');
console.log('\nNext steps:');
console.log('1. Navigate to the parent directory: cd ..');
console.log('2. Commit these changes: git add . && git commit -m "Prepare for Render deployment"');
console.log('3. Push to GitHub: git push origin render-deploy');
console.log('4. Deploy on Render.com using the render-deploy branch'); 