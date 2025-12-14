#!/usr/bin/env node

/**
 * Wikipedia Launch Data Crawler - CLI Version
 * Automates extraction of launch data from Wikipedia pages using Puppeteer
 *
 * Usage:
 *   node crawl-cli.js falcon
 *   node crawl-cli.js world-q1
 *   node crawl-cli.js all
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Constants
const PAGE_CONFIG = {
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timeout: 60000
};

const DATA_DIR = 'data';

// Configuration for crawl targets
const CRAWL_TARGETS = {
    'falcon': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_Falcon_9_and_Falcon_Heavy_launches',
        filename: 'f9_launches.json',
        description: 'SpaceX Falcon 9/Heavy launches',
        scraper: 'falcon'
    },
    'world-q1': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_January%E2%80%93March_2025',
        filename: 'world_launches_q1.json',
        description: 'World launches Q1 2025 (Jan-Mar)',
        scraper: 'world'
    },
    'world-q2': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_April%E2%80%93June_2025',
        filename: 'world_launches_q2.json',
        description: 'World launches Q2 2025 (Apr-Jun)',
        scraper: 'world'
    },
    'world-q3': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_July%E2%80%93September_2025',
        filename: 'world_launches_q3.json',
        description: 'World launches Q3 2025 (Jul-Sep)',
        scraper: 'world'
    },
    'world-q4': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_October%E2%80%93December_2025',
        filename: 'world_launches_q4.json',
        description: 'World launches Q4 2025 (Oct-Dec)',
        scraper: 'world'
    },
    'world-h1': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_January%E2%80%93June_2025',
        filename: 'world_launches_h1.json',
        description: 'World launches H1 2025 (Jan-Jun)',
        scraper: 'world'
    }
};

/**
 * Create and configure a new browser page
 */
async function createPage(browser) {
    const page = await browser.newPage();
    await page.setViewport(PAGE_CONFIG.viewport);
    await page.setUserAgent(PAGE_CONFIG.userAgent);
    return page;
}

/**
 * Navigate to URL and wait for page load
 */
async function navigateTo(page, url) {
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: PAGE_CONFIG.timeout
    });
}

/**
 * Fetch and scrape data from a URL
 */
async function fetchData(browser, url, scraperType) {
    const page = await createPage(browser);
    await navigateTo(page, url);

    const scraper = scraperType === 'falcon' ? scrapeFalconLaunches : scrapeWorldLaunches;
    const data = await scraper(page);

    await page.close();
    return data;
}

/**
 * Save data to JSON file
 */
async function saveJson(filename, data) {
    const outputPath = path.join(process.cwd(), DATA_DIR, filename);
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    return outputPath;
}

/**
 * Read JSON file
 */
async function readJson(filename) {
    const filePath = path.join(process.cwd(), DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Falcon 9/Heavy crawler implementation
 */
async function scrapeFalconLaunches(page) {
    console.log('   Executing Falcon crawler...');

    return await page.evaluate(() => {
        const CONFIG = {
            START_FLIGHT: 418,
            HEADERS: ['time', 'rocket', 'site', 'mission', 'mass', 'orbit'],
            MASS_REGEX: /^(.*)kg/,
            ESTIMATED_MASSES: { LEO: '16300', GTO: '6000', DEFAULT: '3000' }
        };

        const clean = {
            space: (t) => t.replace('\xa0', ' '),
            time: (t) => t.replace(/\[\d+\]/g, '').replace(/(\d{4})(\d{2}:\d{2})/, '$1 $2'),
            rocket: (t) => t.replace('F9\xa0B5', '').replace(/\[\d+\]/, ''),
            mass: (t) => {
                const match = t.match(CONFIG.MASS_REGEX);
                return match ? match[1].replace(/[~,\s]/g, '') : t;
            }
        };

        const transformers = [clean.time, clean.rocket, clean.space, clean.space, clean.mass, clean.space];

        const estimateMass = (mass, orbit) => {
            if (!mass.startsWith('Unknown')) return mass;
            if (orbit.startsWith('LEO')) return CONFIG.ESTIMATED_MASSES.LEO;
            if (orbit.startsWith('GTO')) return CONFIG.ESTIMATED_MASSES.GTO;
            return CONFIG.ESTIMATED_MASSES.DEFAULT;
        };

        const json = [];
        for (let i = CONFIG.START_FLIGHT; ; i++) {
            const cells = Array.from(document.querySelectorAll(`#F9-${i} td`));
            if (cells.length === 0) break;

            const data = cells.map(x => x.textContent.trim());
            const obj = { flight: i };

            CONFIG.HEADERS.forEach((header, j) => {
                obj[header] = transformers[j](data[j]);
            });

            obj.mass = estimateMass(obj.mass, obj.orbit);
            json.push(obj);
        }

        return json;
    });
}

/**
 * World launches crawler implementation
 */
async function scrapeWorldLaunches(page) {
    console.log('   Executing World launches crawler...');

    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.6.0.min.js' });
    await page.waitForFunction('typeof jQuery !== "undefined"');

    return await page.evaluate(() => {
        const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const HEADERS = ['time', 'rocket', 'mission', 'site', 'org'];

        const transform = {
            time: (t) => {
                try {
                    return t.replace(/\[\d+\]/g, '').replace(/(\d{1,2}\s+[A-Za-z]+)(\d{2}:\d{2})/, '$1 $2');
                } catch {
                    return t;
                }
            },
            info: (x) => x?.info ?? x,
            noop: (x) => x
        };

        const transformers = [transform.time, transform.info, transform.noop, transform.info, transform.noop];

        const hasMonth = (text) => MONTHS.some(m => new RegExp(`\\b${m}\\b`).test(text));

        const checkCondition = ($tds, text) => $tds.is(function() {
            return jQuery(this).text().includes(text);
        });

        const json = [];
        let cnt = 1;
        let upcoming = false;

        jQuery('.wikitable').each(function() {
            let subOrbital = false;
            let hasNormalData = false;
            const $table = jQuery(this);

            $table.find('tr').each(function() {
                const $tds = jQuery(this).find('td');
                if (!upcoming) upcoming = checkCondition($tds, 'Upcoming launches');
                if (!subOrbital) subOrbital = checkCondition($tds, 'Suborbital');
                if (!hasNormalData) {
                    hasNormalData = !upcoming && !subOrbital && $tds.length > 2 &&
                        $tds.first().is(function() { return hasMonth(this.innerText); });
                }
            });

            if (!hasNormalData && (upcoming || subOrbital)) return false;

            subOrbital = false;
            upcoming = false;

            $table.find('tr').each(function() {
                const $tds = jQuery(this).find('td');
                if (upcoming || subOrbital) return false;

                upcoming = checkCondition($tds, 'Upcoming launches');
                subOrbital = checkCondition($tds, 'Suborbital');
                if (upcoming || subOrbital) return false;

                const hasDate = $tds.length > 2 && $tds.first().is(function() {
                    return hasMonth(this.innerText);
                });

                if (hasDate) {
                    const tdTexts = $tds.map(function() {
                        const text = jQuery(this).text().trim();
                        const link = jQuery(this).find('span.flagicon a').first();

                        if (link?.length) {
                            return { country: link.attr('title') || link.text(), info: text };
                        }
                        if (text.includes('img')) {
                            const alt = text.match(/alt="([^"]*)"/);
                            const txt = text.match(/>([^<]+)$/);
                            return { country: alt?.[1] ?? '', info: txt?.[1]?.trim() ?? '' };
                        }
                        return { info: text };
                    }).get();

                    const obj = { flight: cnt++ };
                    HEADERS.forEach((header, j) => {
                        const val = header === 'org' ? tdTexts[j] : tdTexts[j].info;
                        obj[header] = transformers[j](val);
                    });
                    json.push(obj);
                }
            });
        });

        return json;
    });
}

/**
 * Crawl a single target
 */
async function crawlTarget(browser, targetKey) {
    const config = CRAWL_TARGETS[targetKey];
    if (!config) {
        console.error(`❌ Unknown target: ${targetKey}`);
        return false;
    }

    console.log(`\n📡 Crawling: ${config.description}`);
    console.log(`   URL: ${config.url}`);

    try {
        console.log('   Loading page...');
        const data = await fetchData(browser, config.url, config.scraper);

        if (!data?.length) {
            console.error('   ⚠️  No data extracted!');
            return false;
        }

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
async function fetchAndMergeFullYear(browser) {
    console.log('\n📊 Fetching Q4 data and merging with 3Q data...\n');

    const q4Config = CRAWL_TARGETS['world-q4'];
    const threeQFile = 'world_launches_all_3q.json';
    const outputFile = 'world_launches.json';

    try {
        // Read existing 3Q data
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

        // Fetch Q4 data
        console.log(`\n   📡 Fetching Q4 data from Wikipedia...`);
        console.log(`   URL: ${q4Config.url}`);
        console.log('   Loading page...');

        const q4Data = await fetchData(browser, q4Config.url, 'world');

        if (!q4Data?.length) {
            console.error('   ⚠️  No Q4 data extracted!');
            return false;
        }
        console.log(`   ✅ Extracted ${q4Data.length} launches from Q4`);

        // Merge the data
        console.log('\n   🔄 Merging Q4 data with 3Q data...');
        const maxFlight = Math.max(...threeQData.map(item => item.flight));
        console.log(`   Max flight number in 3Q: ${maxFlight}`);

        const renumberedQ4 = q4Data.map((item, i) => ({ ...item, flight: maxFlight + i + 1 }));
        const fullYearData = [...threeQData, ...renumberedQ4];

        // Save merged data
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

/**
 * Fetch all 4 quarters and merge into full year dataset
 */
async function fetchAllAndMerge(browser) {
    console.log('\n📊 Fetching all quarters and merging into full year data...\n');

    const quarters = ['world-q1', 'world-q2', 'world-q3', 'world-q4'];
    const outputFile = 'world_launches.json';
    const allData = [];

    try {
        // Fetch each quarter
        for (const quarter of quarters) {
            const config = CRAWL_TARGETS[quarter];
            console.log(`\n📡 Fetching ${config.description}...`);
            console.log(`   URL: ${config.url}`);
            console.log('   Loading page...');

            const data = await fetchData(browser, config.url, 'world');

            if (!data?.length) {
                console.error(`   ⚠️  No data extracted for ${quarter}!`);
                continue;
            }

            console.log(`   ✅ Extracted ${data.length} launches`);

            // Save individual quarter file
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
        const fullYearData = [];

        for (const { quarter, data } of allData) {
            const renumbered = data.map(item => ({ ...item, flight: flightNumber++ }));
            fullYearData.push(...renumbered);
            console.log(`   ${quarter}: ${data.length} launches (flights ${flightNumber - data.length}-${flightNumber - 1})`);
        }

        // Save merged data
        console.log(`\n💾 Saving full year data...`);
        await saveJson(outputFile, fullYearData);

        console.log(`\n✅ Success! Full year data created`);
        console.log(`📊 Total launches: ${fullYearData.length}`);
        for (const { quarter, data } of allData) {
            const config = CRAWL_TARGETS[quarter];
            console.log(`   - ${config.description}: ${data.length} launches`);
        }
        console.log(`📁 Saved to: ${path.join(DATA_DIR, outputFile)}`);

        return true;
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        return false;
    }
}

/**
 * Display help message
 */
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
  all              - Fetch all Q1-Q4 and merge into full year data

Examples:
  node crawl-cli.js falcon
  node crawl-cli.js world-q1
  node crawl-cli.js world-full-inc
  node crawl-cli.js all
`);
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        showHelp();
        process.exit(0);
    }

    const target = args[0];

    console.log('🚀 Wikipedia Launch Data Crawler');
    console.log('='.repeat(50));

    let browser;
    try {
        console.log('\n🌐 Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        if (target === 'all') {
            await fetchAllAndMerge(browser);
        } else if (target === 'world-full-inc') {
            await fetchAndMergeFullYear(browser);
        } else {
            await crawlTarget(browser, target);
        }
    } catch (error) {
        console.error(`\n❌ Fatal error: ${error.message}`);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
            console.log('\n🔒 Browser closed');
        }
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
