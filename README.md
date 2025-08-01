# File Organizer CLI

A simple command-line tool that organizes files by their extensions into separate folders.

## About

File Organizer CLI helps you clean up messy directories by automatically sorting files into folders based on their file extensions. For example, all `.pdf` files go into a `pdf_files` folder, all `.jpg` files go into a `jpg_files` folder, and so on.

Perfect for organizing Downloads folders, project directories, or any workspace that needs tidying up.

## Installation

### Quick Install (Ubuntu/Linux)

```bash
wget -O file-organizer https://github.com/Minhaz00/nodejs-cli-application/releases/latest/download/file-organizer && chmod +x file-organizer && sudo mv file-organizer /usr/local/bin/
```

### Manual Installation

1. Download the binary from [releases](https://github.com/Minhaz00/nodejs-cli-application/releases/latest)
2. Make it executable: `chmod +x file-organizer`
3. Move to PATH: `sudo mv file-organizer /usr/local/bin/`

## Usage

### Interactive Mode (Recommended)

Simply run without any arguments for a guided experience:

```bash
file-organizer
```

### Command Line Mode

```bash
# Preview what will happen (dry run)
file-organizer organize /path/to/directory --dry-run

# Actually organize the files
file-organizer organize /path/to/directory --execute

# Organize current directory
file-organizer organize . --execute
```

## Example

**Before:**
```
Downloads/
├── photo.jpg
├── document.pdf
├── song.mp3
├── script.js
└── archive.zip
```

**After running `file-organizer organize Downloads --execute`:**
```
Downloads/
├── jpg_files/
│   └── photo.jpg
├── pdf_files/
│   └── document.pdf
├── mp3_files/
│   └── song.mp3
├── js_files/
│   └── script.js
└── zip_files/
    └── archive.zip
```

## Commands

- `file-organizer` - Start interactive mode
- `file-organizer organize [directory]` - Organize files in directory
- `file-organizer --help` - Show help
- `file-organizer --version` - Show version

## Options

- `--dry-run` - Preview changes without moving files
- `--execute` - Actually move the files

## Safety

- Always use `--dry-run` first to preview changes
- Files are moved, not copied or deleted
- Original files remain intact, just in new folders
- No data is ever lost

## Development

To build from source:

```bash
git clone https://github.com/Minhaz00/nodejs-cli-application.git
cd nodejs-cli-application
npm install
npm test
npm run build
```

## License

MIT License - see [LICENSE](LICENSE) file for details.