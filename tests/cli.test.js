const { execSync, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

describe('File Organizer CLI', () => {
  let testDir;
  
  beforeEach(async () => {
    // Create a temporary test directory
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-organizer-test-'));
    
    // Create test files
    const testFiles = [
      'document.pdf',
      'image.jpg',
      'image2.png',
      'script.js',
      'style.css',
      'data.json',
      'README.md'
    ];
    
    for (const file of testFiles) {
      await fs.writeFile(path.join(testDir, file), 'test content');
    }
  });
  
  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  });
  
  test('should organize files by extension', async () => {
    // Run the CLI command
    const command = `node ${path.join(__dirname, '..', 'bin', 'cli.js')} organize "${testDir}" --execute`;
    
    try {
      execSync(command, { stdio: 'pipe' });
      
      // Check if folders were created
      const folders = await fs.readdir(testDir);
      const expectedFolders = ['pdf_files', 'jpg_files', 'png_files', 'js_files', 'css_files', 'json_files', 'md_files'];
      
      expectedFolders.forEach(folder => {
        expect(folders).toContain(folder);
      });
      
      // Check if files were moved
      const pdfFiles = await fs.readdir(path.join(testDir, 'pdf_files'));
      expect(pdfFiles).toContain('document.pdf');
      
      const jpgFiles = await fs.readdir(path.join(testDir, 'jpg_files'));
      expect(jpgFiles).toContain('image.jpg');
      
    } catch (error) {
      throw new Error(`CLI execution failed: ${error.message}`);
    }
  });
  
  test('should perform dry run without moving files', async () => {
    const command = `node ${path.join(__dirname, '..', 'bin', 'cli.js')} organize "${testDir}" --dry-run`;
    
    try {
      const output = execSync(command, { encoding: 'utf8' });
      
      // Check that dry run messages are shown
      expect(output).toContain('[DRY RUN]');
      expect(output).toContain('This was a dry run');
      
      // Files should still be in original location
      const files = await fs.readdir(testDir);
      expect(files).toContain('document.pdf');
      expect(files).toContain('image.jpg');
      
      // No folders should be created in dry run
      const directories = [];
      for (const file of files) {
        const stat = await fs.stat(path.join(testDir, file));
        if (stat.isDirectory()) {
          directories.push(file);
        }
      }
      expect(directories.length).toBe(0);
      
    } catch (error) {
      throw new Error(`Dry run test failed: ${error.message}`);
    }
  });
  
  test('should show version information', () => {
    const command = `node ${path.join(__dirname, '..', 'bin', 'cli.js')} --version`;
    const output = execSync(command, { encoding: 'utf8' });
    expect(output.trim()).toBe('1.0.0');
  });
  
  test('should show help information', () => {
    const command = `node ${path.join(__dirname, '..', 'bin', 'cli.js')} --help`;
    const output = execSync(command, { encoding: 'utf8' });
    expect(output).toContain('Organize files by extension into folders');
    expect(output).toContain('organize');
    expect(output).toContain('interactive');
  });
});