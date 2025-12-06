# Quick Setup Guide

## 🚀 Get Started in 2 Minutes

### Option 1: Browser UI (No Installation Required)

**Just click and go!**

1. Open `crawl.html` in your browser
2. Click any button (e.g., "Falcon 9/Heavy")
3. Allow pop-ups when prompted
4. Wait for download to complete
5. Done! JSON file is in your Downloads folder

**That's it!** No installation, no dependencies, no command line.

---

### Option 2: CLI (One-time Setup)

**First time setup:**

```bash
# 1. Make sure Node.js is installed (check with: node --version)
# 2. Install dependencies
npm install

# This will install Puppeteer (~300MB)
```

**Usage:**

```bash
# Crawl specific target
npm run crawl:falcon

# Crawl all targets
npm run crawl:all

# See all options
npm run help
```

---

## 🎯 Which Method Should I Use?

| Use Case | Best Method |
|----------|-------------|
| Quick one-time extraction | **Browser UI** ✅ |
| Regular updates | **CLI** ✅ |
| Automation/scheduling | **CLI** ✅ |
| No technical background | **Browser UI** ✅ |
| Batch processing | **CLI** ✅ |

---

## 📋 Quick Command Reference

### Browser UI
```bash
# Open the UI
open crawl.html
# or double-click crawl.html
```

### CLI Commands
```bash
# Single target
npm run crawl:falcon         # SpaceX Falcon launches
npm run crawl:world-q1        # World Q1 launches
npm run crawl:world-q2        # World Q2 launches
npm run crawl:world-q3        # World Q3 launches
npm run crawl:world-q4        # World Q4 launches
npm run crawl:world-h1        # World H1 launches

# All targets at once
npm run crawl:all

# Help
npm run help
```

---

## ⚡ Quick Troubleshooting

**Problem: Pop-up blocked (UI method)**
- Allow pop-ups for the page in your browser settings

**Problem: Nothing happens (CLI method)**
- Run `npm install` first
- Check Node.js is installed: `node --version`

**Problem: Download not starting**
- Check your Downloads folder (it may have downloaded already)
- Try a different browser

---

## 📊 What You Get

All data is saved as JSON files:

- `launches.json` - Falcon 9/Heavy launches
- `world_launches_q1.json` - Q1 world launches
- `world_launches_q2.json` - Q2 world launches
- `world_launches_q3.json` - Q3 world launches
- `world_launches_q4.json` - Q4 world launches
- `world_launches_h1.json` - H1 world launches

---

## 🔗 Next Steps

- See `CRAWLER_README.md` for full documentation
- Open JSON files in any text editor to view data
- Import into Excel, Google Sheets, or your data tool
- Automate with cron jobs (see full README)

---

**That's all you need to know to get started! 🎉**

For more details, see [CRAWLER_README.md](./CRAWLER_README.md)
