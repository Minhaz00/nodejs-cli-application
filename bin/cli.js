#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs').promises;
const path = require('path');

const program = new Command();

// Main organizer function
async function organizeFiles(directory, options = {}) {
  try {
    const files = await fs.readdir(directory);
    const stats = { moved: 0, folders: 0, errors: 0 };
    
    console.log(chalk.blue(`\n📁 Organizing files in: ${directory}\n`));
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      
      try {
        const stat = await fs.stat(filePath);
        
        // Skip directories
        if (stat.isDirectory()) continue;
        
        const ext = path.extname(file).toLowerCase().slice(1);
        if (!ext) continue; // Skip files without extensions
        
        const folderName = `${ext}_files`;
        const folderPath = path.join(directory, folderName);
        
        // Create folder if it doesn't exist
        let folderExists = false;
        try {
          await fs.access(folderPath);
          folderExists = true;
        } catch {
          folderExists = false;
        }
        
        if (!folderExists) {
          if (!options.dryRun) {
            await fs.mkdir(folderPath);
          }
          stats.folders++;
          console.log(chalk.green(`✓ ${options.dryRun ? '[DRY RUN] Would create' : 'Created'} folder: ${folderName}`));
        }
        
        // Move file
        const newPath = path.join(folderPath, file);
        if (!options.dryRun) {
          await fs.rename(filePath, newPath);
        }
        
        stats.moved++;
        console.log(chalk.yellow(`→ ${options.dryRun ? '[DRY RUN] ' : ''}Moved: ${file} → ${folderName}/`));
        
      } catch (error) {
        stats.errors++;
        console.log(chalk.red(`✗ Error processing ${file}: ${error.message}`));
      }
    }
    
    // Summary
    console.log(chalk.cyan(`\n📊 Summary:`));
    console.log(`   Files processed: ${stats.moved}`);
    console.log(`   Folders created: ${stats.folders}`);
    console.log(`   Errors: ${stats.errors}`);
    
    if (options.dryRun) {
      console.log(chalk.magenta('\n🔍 This was a dry run. Use --execute to actually move files.'));
    }
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// Interactive mode
async function interactiveMode() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'directory',
      message: 'Enter the directory path to organize:',
      default: process.cwd(),
      validate: async (input) => {
        try {
          const stat = await fs.stat(input);
          return stat.isDirectory() || 'Please enter a valid directory path';
        } catch {
          return 'Directory does not exist';
        }
      }
    },
    {
      type: 'confirm',
      name: 'dryRun',
      message: 'Do you want to preview changes first (dry run)?',
      default: true
    }
  ]);
  
  await organizeFiles(answers.directory, { dryRun: answers.dryRun });
  
  if (answers.dryRun) {
    const { execute } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'execute',
        message: 'Execute the file organization?',
        default: false
      }
    ]);
    
    if (execute) {
      await organizeFiles(answers.directory, { dryRun: false });
    }
  }
}

// CLI setup
program
  .name('file-organizer')
  .description('Organize files by extension into folders')
  .version('1.0.0');

program
  .command('organize [directory]')
  .description('Organize files in specified directory')
  .option('-d, --dry-run', 'preview changes without moving files')
  .option('-e, --execute', 'execute file organization immediately')
  .action(async (directory, options) => {
    const targetDir = directory || process.cwd();
    
    try {
      const stat = await fs.stat(targetDir);
      if (!stat.isDirectory()) {
        console.error(chalk.red('Error: Path is not a directory'));
        process.exit(1);
      }
    } catch {
      console.error(chalk.red('Error: Directory does not exist'));
      process.exit(1);
    }
    
    const dryRun = options.dryRun || !options.execute;
    await organizeFiles(targetDir, { dryRun });
  });

program
  .command('interactive')
  .alias('i')
  .description('Run in interactive mode')
  .action(interactiveMode);

program
  .command('info')
  .description('Show information about the CLI')
  .action(() => {
    console.log(chalk.cyan('\n📋 File Organizer CLI'));
    console.log('Version: 1.0.0');
    console.log('Author: Your Name');
    console.log('\nThis tool organizes files by their extensions into separate folders.');
    console.log('\nExamples:');
    console.log('  file-organizer organize /path/to/directory --dry-run');
    console.log('  file-organizer organize --execute');
    console.log('  file-organizer interactive');
  });

// Default action (interactive mode)
program.action(interactiveMode);

program.parse();