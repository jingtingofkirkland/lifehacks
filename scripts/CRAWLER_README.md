# 🚀 Wikipedia Launch Data Crawler

Automated tool for extracting rocket launch data from Wikipedia pages. Supports both UI (browser-based) and CLI (command-line) workflows.

## Features

- ✅ **Two Ways to Crawl**: Browser UI or CLI command
- ✅ **Multiple Data Sources**: SpaceX Falcon launches & World launches (Q1-Q4, H1)
- ✅ **Automatic Data Extraction**: Parses Wikipedia tables into structured JSON
- ✅ **Smart Data Cleaning**: Handles formatting, estimates missing data
- ✅ **One-Click Operation**: Simple button click or single command

---

## 🌐 Method 1: Browser UI (Easiest)

### Quick Start

1. **Open the crawler page**:
   ```bash
   open crawl.html
   # Or just double-click crawl.html
   ```

2. **Click any button** to start crawling:
   - 🚀 Falcon 9/Heavy - SpaceX launches
   - 🌍 World Q1-Q4 - Quarterly world launches
   - 🌏 World H1 - First half year launches

3. **Allow pop-ups** when prompted (required for Wikipedia access)

4. **Download completes automatically** - JSON file saves to your Downloads folder

### How It Works

The UI:
- Opens Wikipedia in a new tab
- Executes the crawler script
- Extracts and formats data
- Triggers automatic download
- Closes the tab when done

### Browser Compatibility

- ✅ Chrome, Edge, Safari, Firefox
- ⚠️ Requires pop-ups to be allowed
- ⚠️ Must allow JavaScript

---

## 💻 Method 2: CLI (Developer-Friendly)

### Prerequisites

Install Node.js and npm dependencies:

```bash
# Install dependencies (first time only)
npm install
```

This installs Puppeteer, which provides a headless browser for crawling.

### Usage

#### Single Target

```bash
# Basic usage
node crawl-cli.js falcon
node crawl-cli.js world-q1

# Or use npm scripts
npm run crawl falcon
npm run crawl:falcon
npm run crawl:world-q1
```

#### All Targets

```bash
# Crawl everything at once
node crawl-cli.js all
npm run crawl:all
```

#### Get Help

```bash
node crawl-cli.js --help
npm run help
```

### Available Targets

| Target | Description | Output File |
|--------|-------------|-------------|
| `falcon` | SpaceX Falcon 9/Heavy launches | `launches.json` |
| `world-q1` | World launches Q1 (Jan-Mar) | `world_launches_q1.json` |
| `world-q2` | World launches Q2 (Apr-Jun) | `world_launches_q2.json` |
| `world-q3` | World launches Q3 (Jul-Sep) | `world_launches_q3.json` |
| `world-q4` | World launches Q4 (Oct-Dec) | `world_launches_q4.json` |
| `world-h1` | World launches H1 (Jan-Jun) | `world_launches_h1.json` |
| `all` | All targets above | All JSON files |

### Example Output

```bash
$ node crawl-cli.js falcon

🚀 Wikipedia Launch Data Crawler
==================================================

🌐 Launching browser...

📡 Crawling: SpaceX Falcon 9/Heavy launches
   URL: https://en.m.wikipedia.org/wiki/List_of_Falcon_9_and_Falcon_Heavy_launches
   Loading page...
   Page loaded, extracting data...
   Executing Falcon crawler...
   ✅ Success! Extracted 45 launches
   📁 Saved to: launches.json

🔒 Browser closed

✨ Done!
```

---

## 📊 Output Format

### Falcon 9/Heavy Data

```json
[
  {
    "flight": 551,
    "time": "2025-01-15 10:30",
    "rocket": "Falcon 9 Block 5",
    "site": "Cape Canaveral SLC-40",
    "mission": "Starlink 6-78",
    "mass": "15600",
    "orbit": "LEO"
  }
]
```

### World Launches Data

```json
[
  {
    "flight": 1,
    "time": "4 January 01:27",
    "rocket": "Falcon 9 Block 5",
    "mission": "F9-418",
    "site": "Cape Canaveral SLC-40",
    "org": {
      "country": "United States",
      "info": "SpaceX"
    }
  }
]
```

---

## 🛠 Advanced Configuration

### Customizing Crawl Targets

Edit the configuration in `crawl-cli.js` or `crawl.html`:

```javascript
const CRAWL_TARGETS = {
    'my-custom-target': {
        url: 'https://en.m.wikipedia.org/wiki/Your_Page',
        filename: 'custom_output.json',
        crawler: 'WORLD_CRAWLER' // or 'FALCON_CRAWLER'
    }
};
```

### Crawler Types

- **FALCON_CRAWLER**: For SpaceX Falcon launch pages (uses ID-based selectors)
- **WORLD_CRAWLER**: For general launch pages (uses table-based extraction)

---

## 🐛 Troubleshooting

### Browser UI Issues

**Problem**: Pop-up blocked
- **Solution**: Allow pop-ups for the crawler page in browser settings

**Problem**: No download triggered
- **Solution**: Check browser's download settings, try a different browser

**Problem**: "Table not found" error
- **Solution**: Wikipedia page structure may have changed, check URL

### CLI Issues

**Problem**: `puppeteer` module not found
- **Solution**: Run `npm install`

**Problem**: Browser fails to launch
- **Solution**: Make sure you have Chrome or Chromium installed
- **Alternative**: Use the browser UI method instead

**Problem**: Timeout errors
- **Solution**: Check internet connection, try again
- **Solution**: Increase timeout in `crawl-cli.js` (line: `timeout: 60000`)

---

## 📁 File Structure

```
lifehacks/
├── crawl.html              # Browser UI for crawling
├── crawl-cli.js            # CLI crawler script
├── crawling_wiki_info.js   # Legacy crawler (for reference)
├── package.json            # NPM dependencies & scripts
├── launches.json           # Falcon launch data (output)
├── world_launches_q1.json  # World Q1 data (output)
├── world_launches_q2.json  # World Q2 data (output)
├── world_launches_q3.json  # World Q3 data (output)
├── world_launches_q4.json  # World Q4 data (output)
└── world_launches_h1.json  # World H1 data (output)
```

---

## 🔄 Updating Data

To refresh your launch data:

### Option 1: UI
1. Open `crawl.html`
2. Click the relevant button
3. New data replaces old file

### Option 2: CLI
```bash
# Update single target
npm run crawl:falcon

# Update all targets
npm run crawl:all
```

### Automation Ideas

Set up a cron job or scheduled task:

```bash
# Add to crontab (Linux/Mac)
# Runs every Monday at 9 AM
0 9 * * 1 cd /path/to/lifehacks && npm run crawl:all

# Windows Task Scheduler
# Create task to run: npm run crawl:all
# Trigger: Weekly on Monday at 9 AM
```

---

## 🤝 Contributing

To add a new data source:

1. Add target to `CRAWL_TARGETS` in both `crawl.html` and `crawl-cli.js`
2. Determine if it needs `FALCON_CRAWLER` or `WORLD_CRAWLER`
3. If new crawler needed, implement in both files
4. Add corresponding npm script to `package.json`
5. Test thoroughly

---

## 📝 License

MIT License - Feel free to use and modify

---

## 🙏 Acknowledgments

- Wikipedia for maintaining comprehensive launch data
- Puppeteer team for excellent browser automation
- jQuery for DOM manipulation simplicity

---

## 📞 Support

For issues or questions:
- Check the Troubleshooting section
- Review Wikipedia page structure hasn't changed
- Ensure all dependencies are installed
- Try the alternative method (UI vs CLI)

---

**Made with ❤️ for space data enthusiasts**
