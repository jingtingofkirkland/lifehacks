#!/usr/bin/env node

/**
 * Wikipedia Launch Data Crawler - CLI Version
 * Extracts launch data from Wikipedia using fetch + cheerio (no browser needed)
 *
 * Usage:
 *   node crawl-cli.js falcon
 *   node crawl-cli.js world-q1
 *   node crawl-cli.js all
 */

const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Constants
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
const DATA_DIR = 'data';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// Configuration for crawl targets
const CRAWL_TARGETS = {
    'falcon': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_Falcon_9_and_Falcon_Heavy_launches',
        filename: 'f9_launches_2026.json',
        description: 'SpaceX Falcon 9/Heavy launches',
        scraper: 'falcon'
    },
    'world-q1': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_January%E2%80%93March_2026',
        filename: 'world_launches_q1.json',
        description: 'World launches Q1 2026 (Jan-Mar)',
        scraper: 'world'
    },
    'world-q2': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_April%E2%80%93June_2026',
        filename: 'world_launches_q2.json',
        description: 'World launches Q2 2026 (Apr-Jun)',
        scraper: 'world'
    },
    'world-q3': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_July%E2%80%93September_2026',
        filename: 'world_launches_q3.json',
        description: 'World launches Q3 2026 (Jul-Sep)',
        scraper: 'world'
    },
    'world-q4': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_October%E2%80%93December_2026',
        filename: 'world_launches_q4.json',
        description: 'World launches Q4 2026 (Oct-Dec)',
        scraper: 'world'
    }
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ─── Network Layer ───────────────────────────────────────────────

/**
 * Retry wrapper with exponential backoff
 */
async function withRetry(fn, label = '') {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === MAX_RETRIES) throw error;
            const delay = RETRY_DELAY_MS * attempt;
            console.log(`   ⚠️  Attempt ${attempt} failed${label ? ` (${label})` : ''}: ${error.message}. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

/**
 * Fetch a URL and return a cheerio instance
 */
async function fetchHTML(url) {
    return withRetry(async () => {
        const response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT }
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const html = await response.text();
        return cheerio.load(html);
    }, url);
}

// ─── File I/O ────────────────────────────────────────────────────

async function saveJson(filename, data) {
    const outputPath = path.join(process.cwd(), DATA_DIR, filename);
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    return outputPath;
}

async function readJson(filename) {
    const filePath = path.join(process.cwd(), DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}

// ─── Data Validation ─────────────────────────────────────────────

function validateFalconLaunch(obj) {
    const warnings = [];
    if (!obj.time) warnings.push(`Flight ${obj.flight}: missing time`);
    if (!obj.rocket) warnings.push(`Flight ${obj.flight}: missing rocket`);
    if (!obj.site) warnings.push(`Flight ${obj.flight}: missing site`);
    if (!obj.mission) warnings.push(`Flight ${obj.flight}: missing mission`);
    if (!obj.mass || obj.mass === '0') warnings.push(`Flight ${obj.flight}: suspicious mass "${obj.mass}"`);
    if (!obj.orbit) warnings.push(`Flight ${obj.flight}: missing orbit`);
    return warnings;
}

function validateWorldLaunch(obj) {
    const warnings = [];
    if (!obj.time) warnings.push(`Flight ${obj.flight}: missing time`);
    if (!obj.rocket) warnings.push(`Flight ${obj.flight}: missing rocket`);
    if (!obj.site) warnings.push(`Flight ${obj.flight}: missing site`);
    if (!obj.org?.country) warnings.push(`Flight ${obj.flight}: missing country`);
    if (!obj.org?.info) warnings.push(`Flight ${obj.flight}: missing org info`);
    return warnings;
}

function logValidationWarnings(data, validateFn) {
    const warnings = data.flatMap(item => validateFn(item));
    if (warnings.length > 0) {
        console.log(`   ⚠️  ${warnings.length} validation warning(s):`);
        warnings.forEach(w => console.log(`      ${w}`));
    }
}

// ─── Falcon 9/Heavy Scraper ─────────────────────────────────────

/**
 * Falcon 9/Heavy crawler - uses cheerio on fetched HTML
 */
function scrapeFalconLaunches($) {
    console.log('   Executing Falcon crawler...');

    const HEADERS = ['time', 'rocket', 'site', 'mission', 'mass', 'orbit'];
    const MASS_REGEX = /^(.*)kg/;
    const ESTIMATED_MASSES = { LEO: '16300', GTO: '6000', DEFAULT: '3000' };

    const clean = {
        space: (t) => t.replace(/\xa0/g, ' '),
        time: (t) => t.replace(/\[\d+\]/g, '').replace(/(\d{4})(\d{2}:\d{2})/, '$1 $2'),
        rocket: (t) => t.replace(/F9\xa0B5/g, '').replace(/\[\d+\]/g, ''),
        mass: (t) => {
            const match = t.match(MASS_REGEX);
            return match ? match[1].replace(/[~,\s]/g, '') : t;
        }
    };

    const transformers = [clean.time, clean.rocket, clean.space, clean.space, clean.mass, clean.space];

    const estimateMass = (mass, orbit) => {
        if (!mass.startsWith('Unknown')) return mass;
        if (orbit.startsWith('LEO')) return ESTIMATED_MASSES.LEO;
        if (orbit.startsWith('GTO')) return ESTIMATED_MASSES.GTO;
        return ESTIMATED_MASSES.DEFAULT;
    };

    // Dynamically find the first F9-* row in the current year's table
    const currentYear = new Date().getFullYear();
    const yearTable = $(`#${currentYear}ytd`);
    const searchScope = yearTable.length ? yearTable : $('body');
    const firstRow = searchScope.find('tr[id^="F9-"]').first();
    if (!firstRow.length) {
        console.log(`   ⚠️  No F9-* rows found${yearTable.length ? ` in #${currentYear}ytd table` : ' on page'}`);
        return [];
    }
    const startFlight = parseInt(firstRow.attr('id').replace('F9-', ''), 10);
    console.log(`   📌 Detected first flight: F9-${startFlight} (from ${yearTable.length ? `#${currentYear}ytd` : 'page'})`);

    const json = [];
    for (let i = startFlight; ; i++) {
        const cells = $(`#F9-${i} td`);
        if (cells.length === 0) break;

        const data = cells.map((_, el) => $(el).text().trim()).get();
        const obj = { flight: i };

        HEADERS.forEach((header, j) => {
            obj[header] = transformers[j](data[j]);
        });

        obj.mass = estimateMass(obj.mass, obj.orbit);
        json.push(obj);
    }

    return json;
}

// ─── World Launches Scraper ──────────────────────────────────────

/**
 * World launches crawler - uses cheerio on fetched HTML
 * Uses structural HTML cues: td[scope="row"] for launch rows,
 * "Upcoming launches" text and "Suborbital" section for boundaries
 */
function scrapeWorldLaunches($) {
    console.log('   Executing World launches crawler...');

    const HEADERS = ['time', 'rocket', 'mission', 'site', 'org'];

    const cleanTime = (t) => {
        try {
            return t.replace(/\[\d+\]/g, '').replace(/(\d{1,2}\s+[A-Za-z]+)(\d{2}:\d{2})/, '$1 $2');
        } catch {
            return t;
        }
    };
    const takeInfo = (x) => x?.info ?? x;
    const noop = (x) => x;
    const transformers = [cleanTime, takeInfo, noop, takeInfo, noop];

    const hasMonth = (text) => MONTHS.some(m => new RegExp(`\\b${m}\\b`).test(text));

    const json = [];
    let cnt = 1;
    let reachedUpcoming = false;

    // Process each .wikitable
    $('.wikitable').each((_, tableEl) => {
        const $table = $(tableEl);
        const tableText = $table.text();

        // Pre-scan: check if this table is purely suborbital or upcoming (no normal data)
        let tableHasUpcoming = tableText.includes('Upcoming launches');
        let tableHasSuborbital = tableText.includes('Suborbital');
        let tableHasNormalData = false;

        $table.find('tr').each((_, row) => {
            const tds = $(row).find('td');
            if (tds.length > 2) {
                const firstTd = tds.first();
                const isLaunchRow = firstTd.attr('scope') === 'row' || hasMonth(firstTd.text());
                if (isLaunchRow && !reachedUpcoming) {
                    tableHasNormalData = true;
                    return false; // break early
                }
            }
        });

        // Skip tables that only contain upcoming/suborbital data,
        // or if we've already passed the "Upcoming launches" boundary globally
        if (reachedUpcoming || (!tableHasNormalData && (tableHasUpcoming || tableHasSuborbital))) {
            return; // skip this table
        }

        // Reset per-table flags for the second pass
        let tableUpcoming = false;
        let tableSuborbital = false;

        // Extract data rows
        const rows = $table.find('tr').toArray();
        for (const row of rows) {
            const $row = $(row);
            const tds = $row.find('td');

            if (tableUpcoming || tableSuborbital) break;

            // Check for boundary markers
            const rowText = tds.text();
            if (rowText.includes('Upcoming launches')) {
                tableUpcoming = true;
                reachedUpcoming = true;
                break;
            }
            if (rowText.includes('Suborbital')) {
                tableSuborbital = true;
                break;
            }

            // Identify main launch rows using scope="row" or month-name fallback
            const firstTd = tds.first();
            const isLaunchRow = tds.length > 2 &&
                (firstTd.attr('scope') === 'row' || hasMonth(firstTd.text()));

            if (isLaunchRow) {
                const tdTexts = tds.map((_, td) => {
                    const $td = $(td);
                    const text = $td.text().trim();
                    const flagLink = $td.find('span.flagicon a').first();

                    if (flagLink.length) {
                        return { country: flagLink.attr('title') || flagLink.text(), info: text };
                    }
                    return { info: text };
                }).get();

                const obj = { flight: cnt++ };
                HEADERS.forEach((header, j) => {
                    const val = header === 'org' ? tdTexts[j] : tdTexts[j]?.info;
                    obj[header] = transformers[j](val);
                });
                json.push(obj);
            }
        }
    });

    return json;
}

// ─── Fetch + Scrape ──────────────────────────────────────────────

async function fetchData(url, scraperType) {
    const $ = await fetchHTML(url);
    const scraper = scraperType === 'falcon' ? scrapeFalconLaunches : scrapeWorldLaunches;
    return scraper($);
}

// ─── Crawl Commands ──────────────────────────────────────────────

async function crawlTarget(targetKey) {
    const config = CRAWL_TARGETS[targetKey];
    if (!config) {
        console.error(`❌ Unknown target: ${targetKey}`);
        return false;
    }

    console.log(`\n📡 Crawling: ${config.description}`);
    console.log(`   URL: ${config.url}`);

    try {
        console.log('   Fetching page...');
        const data = await fetchData(config.url, config.scraper);

        if (!data?.length) {
            console.error('   ⚠️  No data extracted!');
            return false;
        }

        const validateFn = config.scraper === 'falcon' ? validateFalconLaunch : validateWorldLaunch;
        logValidationWarnings(data, validateFn);

        await saveJson(config.filename, data);
        console.log(`   ✅ Success! Extracted ${data.length} launches`);
        console.log(`   📁 Saved to: ${path.join(DATA_DIR, config.filename)}`);
        return true;
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
    }
}

/**
 * Fetch Q4 data and merge with existing 3Q data to create full year dataset
 */
async function fetchAndMergeFullYear() {
    console.log('\n📊 Fetching Q4 data and merging with 3Q data...\n');

    const q4Config = CRAWL_TARGETS['world-q4'];
    const threeQFile = 'world_launches_all_3q.json';
    const outputFile = 'world_launches.json';

    try {
        console.log('   📁 Reading existing 3Q data...');
        let threeQData;
        try {
            threeQData = await readJson(threeQFile);
            console.log(`   ✅ Found ${threeQData.length} launches in 3Q data`);
        } catch (error) {
            console.error(`   ❌ Error reading 3Q data: ${error.message}`);
            console.error(`   Please ensure ${path.join(DATA_DIR, threeQFile)} exists`);
            return false;
        }

        console.log(`\n   📡 Fetching Q4 data from Wikipedia...`);
        console.log(`   URL: ${q4Config.url}`);
        console.log('   Fetching page...');

        const q4Data = await fetchData(q4Config.url, 'world');

        if (!q4Data?.length) {
            console.error('   ⚠️  No Q4 data extracted!');
            return false;
        }
        console.log(`   ✅ Extracted ${q4Data.length} launches from Q4`);

        console.log('\n   🔄 Merging Q4 data with 3Q data...');
        const maxFlight = Math.max(...threeQData.map(item => item.flight));
        console.log(`   Max flight number in 3Q: ${maxFlight}`);

        const renumberedQ4 = q4Data.map((item, i) => ({ ...item, flight: maxFlight + i + 1 }));
        const fullYearData = [...threeQData, ...renumberedQ4];

        console.log(`\n   💾 Saving full year data...`);
        await saveJson(outputFile, fullYearData);

        console.log(`\n   ✅ Success! Full year data created`);
        console.log(`   📊 Total launches: ${fullYearData.length}`);
        console.log(`      - Q1-Q3: ${threeQData.length} launches`);
        console.log(`      - Q4: ${q4Data.length} launches`);
        console.log(`   📁 Saved to: ${path.join(DATA_DIR, outputFile)}`);
        return true;
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
    }
}

// ─── Date Parsing & Filtering ────────────────────────────────────

function parseLaunchDate(timeStr) {
    if (!timeStr) return null;

    const tbdPatterns = /\b(TBD|TBA|NET|No earlier than|Unknown|\?)\b/i;
    if (tbdPatterns.test(timeStr)) return null;

    const months = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3,
        'May': 4, 'June': 5, 'July': 6, 'August': 7,
        'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    const match = timeStr.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i);
    if (!match) return null;

    const day = parseInt(match[1], 10);
    const month = months[match[2]];
    if (month === undefined) return null;

    const year = new Date().getFullYear();
    return new Date(year, month, day);
}

function filterPastLaunches(launches) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return launches.filter(launch => {
        const launchDate = parseLaunchDate(launch.time);
        if (launchDate === null) {
            console.log(`   ⏭️  Filtering out (TBD/unparseable): ${launch.time}`);
            return false;
        }
        if (launchDate > today) {
            console.log(`   ⏭️  Filtering out (future): ${launch.time}`);
            return false;
        }
        return true;
    });
}

// ─── Fetch All Quarters & Merge ──────────────────────────────────

async function fetchAllAndMerge() {
    console.log('\n📊 Fetching all quarters and merging into full year data...\n');

    // Only crawl up to the current quarter — future quarters only have planned launches
    // which we exclude, so crawling them is unnecessary
    const currentMonth = new Date().getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    const allQuarters = ['world-q1', 'world-q2', 'world-q3', 'world-q4'];
    const quarters = allQuarters.slice(0, currentQuarter);
    console.log(`   📅 Current quarter: Q${currentQuarter} — crawling Q1${currentQuarter > 1 ? `-Q${currentQuarter}` : ''} (skipping future quarters)\n`);

    const outputFile = 'world_launches_2026.json';
    const allData = [];

    try {
        for (const quarter of quarters) {
            const config = CRAWL_TARGETS[quarter];
            console.log(`\n📡 Fetching ${config.description}...`);
            console.log(`   URL: ${config.url}`);
            console.log('   Fetching page...');

            const data = await fetchData(config.url, 'world');

            if (!data?.length) {
                console.error(`   ⚠️  No data extracted for ${quarter}!`);
                continue;
            }

            console.log(`   ✅ Extracted ${data.length} launches`);
            logValidationWarnings(data, validateWorldLaunch);

            await saveJson(config.filename, data);
            console.log(`   📁 Saved to: ${path.join(DATA_DIR, config.filename)}`);

            allData.push({ quarter, data });
        }

        if (allData.length === 0) {
            console.error('\n❌ No data extracted from any quarter!');
            return false;
        }

        // Merge all quarters with continuous flight numbering
        console.log('\n🔄 Merging all quarters...');
        let flightNumber = 1;
        let fullYearData = [];

        for (const { quarter, data } of allData) {
            const renumbered = data.map(item => ({ ...item, flight: flightNumber++ }));
            fullYearData.push(...renumbered);
            console.log(`   ${quarter}: ${data.length} launches (flights ${flightNumber - data.length}-${flightNumber - 1})`);
        }

        // Filter out future and TBD launches
        console.log('\n🔍 Filtering out future/TBD launches...');
        const beforeCount = fullYearData.length;
        fullYearData = filterPastLaunches(fullYearData);
        const afterCount = fullYearData.length;
        console.log(`   Filtered: ${beforeCount} → ${afterCount} (removed ${beforeCount - afterCount} future/TBD launches)`);

        // Renumber flights after filtering
        fullYearData = fullYearData.map((item, i) => ({ ...item, flight: i + 1 }));

        // Save merged data
        console.log(`\n💾 Saving full year data...`);
        await saveJson(outputFile, fullYearData);

        console.log(`\n✅ Success! Full year data created`);
        console.log(`📊 Total launches: ${fullYearData.length}`);
        for (const { quarter, data } of allData) {
            const config = CRAWL_TARGETS[quarter];
            console.log(`   - ${config.description}: ${data.length} launches (raw)`);
        }
        console.log(`📁 Saved to: ${path.join(DATA_DIR, outputFile)}`);

        return true;
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        return false;
    }
}

// ─── CLI ─────────────────────────────────────────────────────────

function showHelp() {
    const targets = Object.entries(CRAWL_TARGETS)
        .map(([key, val]) => `  ${key.padEnd(16)} - ${val.description}`)
        .join('\n');

    console.log(`
🚀 Wikipedia Launch Data Crawler - CLI

Usage:
  node crawl-cli.js <target>
  npm run crawl <target>

Available targets:
${targets}
  world-full-inc   - Fetch Q4 and merge with existing 3Q data (incremental)
  all              - Crawl Falcon + fetch all Q1-Q4 world launches (filters future/TBD)

Examples:
  node crawl-cli.js falcon
  node crawl-cli.js world-q1
  node crawl-cli.js world-full-inc
  node crawl-cli.js all
`);
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        showHelp();
        process.exit(0);
    }

    const target = args[0];

    console.log('🚀 Wikipedia Launch Data Crawler');
    console.log('='.repeat(50));

    try {
        if (target === 'all') {
            console.log('\n🎯 Running all crawlers (Falcon + World)...\n');
            await crawlTarget('falcon');
            await fetchAllAndMerge();
        } else if (target === 'world-full-inc') {
            await fetchAndMergeFullYear();
        } else {
            await crawlTarget(target);
        }
    } catch (error) {
        console.error(`\n❌ Fatal error: ${error.message}`);
        process.exit(1);
    }

    console.log('\n✨ Done!\n');
}

if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { crawlTarget, fetchAndMergeFullYear, CRAWL_TARGETS };
