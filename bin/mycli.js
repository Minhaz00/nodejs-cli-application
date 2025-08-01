#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const program = new Command();

// CLI Information
program
  .name('mycli')
  .description('A simple CLI application')
  .version('1.0.0');

// Hello command
program
  .command('hello')
  .description('Say hello')
  .option('-n, --name <name>', 'specify name', 'World')
  .action((options) => {
    console.log(chalk.green(`Hello, ${options.name}!`));
  });

// List files command
program
  .command('list [directory]')
  .alias('ls')
  .description('List files in directory')
  .option('-a, --all', 'show hidden files')
  .action((directory = '.', options) => {
    try {
      const targetDir = path.resolve(directory);
      console.log(chalk.blue(`Contents of ${targetDir}:`));
      
      const files = fs.readdirSync(targetDir);
      
      files.forEach(file => {
        if (!options.all && file.startsWith('.')) return;
        
        const filePath = path.join(targetDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          console.log(chalk.blue(`📁 ${file}/`));
        } else {
          console.log(chalk.white(`📄 ${file}`));
        }
      });
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Info command
program
  .command('info')
  .description('Show system information')
  .action(() => {
    console.log(chalk.yellow('System Information:'));
    console.log(`Node.js: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`Architecture: ${process.arch}`);
    console.log(`Working Directory: ${process.cwd()}`);
    console.log(`Home Directory: ${require('os').homedir()}`);
  });

// Create file command
program
  .command('create <filename>')
  .description('Create a new file')
  .option('-c, --content <content>', 'file content', 'Hello from mycli!')
  .action((filename, options) => {
    try {
      fs.writeFileSync(filename, options.content);
      console.log(chalk.green(`✅ Created file: ${filename}`));
    } catch (error) {
      console.error(chalk.red(`Error creating file: ${error.message}`));
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}