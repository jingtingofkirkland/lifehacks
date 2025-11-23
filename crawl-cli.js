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

// Configuration for crawl targets
const CRAWL_TARGETS = {
    'falcon': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_Falcon_9_and_Falcon_Heavy_launches',
        filename: 'launches.json',
        description: 'SpaceX Falcon 9/Heavy launches'
    },
    'world-q1': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_January%E2%80%93March_2025',
        filename: 'world_launches_q1.json',
        description: 'World launches Q1 2025 (Jan-Mar)'
    },
    'world-q2': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_April%E2%80%93June_2025',
        filename: 'world_launches_q2.json',
        description: 'World launches Q2 2025 (Apr-Jun)'
    },
    'world-q3': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_July%E2%80%93September_2025',
        filename: 'world_launches_q3.json',
        description: 'World launches Q3 2025 (Jul-Sep)'
    },
    'world-q4': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_October%E2%80%93December_2025',
        filename: 'world_launches_q4.json',
        description: 'World launches Q4 2025 (Oct-Dec)'
    },
    'world-h1': {
        url: 'https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_January%E2%80%93June_2025',
        filename: 'world_launches_h1.json',
        description: 'World launches H1 2025 (Jan-Jun)'
    }
};

/**
 * Falcon 9/Heavy crawler implementation
 */
async function scrapeFalconLaunches(page) {
    console.log('   Executing Falcon crawler...');

    const data = await page.evaluate(() => {
        const FALCON_CONFIG = {
            START_FLIGHT: 551,
            HEADERS: ['time', 'rocket', 'site', 'mission', 'mass', 'orbit'],
            MASS_REGEX: /^(.*)kg/,
            ESTIMATED_MASSES: { LEO: '163000', GTO: '6000', DEFAULT: '3000' }
        };

        const transformUtils = {
            cleanNonBreakingSpace: (text) => text.replace('\xa0', ' '),
            cleanTime: (timeStr) => {
                const cleaned = timeStr.replace(/\[\d+\]/g, '');
                return cleaned.replace(/(\d{4})(\d{2}:\d{2})/, '$1 $2');
            },
            cleanRocket: (rocketStr) => rocketStr.replace('F9\xa0B5', '').replace(/\[\d+\]/, ''),
            cleanMass: (massStr) => {
                const match = massStr.match(FALCON_CONFIG.MASS_REGEX);
                return match ? match[1].replace(/[~,\s]/g, '') : massStr;
            }
        };

        const getTransformers = () => [
            transformUtils.cleanTime, transformUtils.cleanRocket,
            transformUtils.cleanNonBreakingSpace, transformUtils.cleanNonBreakingSpace,
            transformUtils.cleanMass, transformUtils.cleanNonBreakingSpace
        ];

        function estimateMass(mass, orbit) {
            if (!mass.startsWith('Unknown')) return mass;
            if (orbit.startsWith('LEO')) return FALCON_CONFIG.ESTIMATED_MASSES.LEO;
            if (orbit.startsWith('GTO')) return FALCON_CONFIG.ESTIMATED_MASSES.GTO;
            return FALCON_CONFIG.ESTIMATED_MASSES.DEFAULT;
        }

        const transformers = getTransformers();
        const json = [];

        for (let i = FALCON_CONFIG.START_FLIGHT; ; i++) {
            const selector = `#F9-${i} td`;
            const cells = Array.from(document.querySelectorAll(selector));

            if (cells.length === 0) break;

            const data = cells.map(x => x.textContent.trim());
            const obj = { flight: i };

            for (let j = 0; j < FALCON_CONFIG.HEADERS.length; j++) {
                obj[FALCON_CONFIG.HEADERS[j]] = transformers[j](data[j]);
            }

            obj['mass'] = estimateMass(obj['mass'], obj['orbit']);
            json.push(obj);
        }

        return json;
    });

    return data;
}

/**
 * World launches crawler implementation
 */
async function scrapeWorldLaunches(page) {
    console.log('   Executing World launches crawler...');

    // Inject jQuery
    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.6.0.min.js' });

    // Wait for jQuery to load
    await page.waitForFunction('typeof jQuery !== "undefined"');

    const data = await page.evaluate(() => {
        const monthes = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const header = ['time', 'rocket', 'mission', 'site', 'org'];
        const noOp = x => x;
        const takeInfo = x => x ? x.info : x;
        const timeTrans = t => {
            try {
                const cleanStr = t.replace(/\[\d+\]/g, '');
                return cleanStr.replace(/(\d{1,2}\s+[A-Za-z]+)(\d{2}:\d{2})/, '$1 $2');
            } catch (error) {
                console.error('Could not parse time:', t);
                return t;
            }
        };
        const transform = [timeTrans, takeInfo, noOp, takeInfo, noOp];
        const json = [];

        const $tables = jQuery('.wikitable');
        if (!$tables.length) {
            console.error('Table not found');
            return [];
        }

        let cnt = 1;
        let upcomming = false;

        $tables.each(function() {
            let subOrbital = false;
            let hasNormalData = false;
            const $table = jQuery(this);

            $table.find('tr').each(function() {
                const $tds = jQuery(this).find('td');
                if (!upcomming) {
                    upcomming = $tds.is(function() {
                        return jQuery(this).text().includes('Upcoming launches');
                    });
                }
                if (!subOrbital) {
                    subOrbital = $tds.is(function() {
                        return jQuery(this).text().includes('Suborbital');
                    });
                }
                if (!hasNormalData) {
                    hasNormalData = !upcomming && !subOrbital && $tds.length > 2 && $tds.first().is(function() {
                        const textContent = this.innerText;
                        return monthes.some(m => new RegExp(`\\b${m}\\b`).test(textContent));
                    });
                }
            });

            if (!hasNormalData && (upcomming || subOrbital)) {
                return false;
            }

            subOrbital = false;
            upcomming = false;

            $table.find('tr').each(function() {
                const $tds = jQuery(this).find('td');
                if (upcomming || subOrbital) return false;

                upcomming = $tds.is(function() {
                    return jQuery(this).text().includes('Upcoming launches');
                });
                subOrbital = $tds.is(function() {
                    return jQuery(this).text().includes('Suborbital');
                });

                if (upcomming || subOrbital) return false;

                const hasDate = $tds.length > 2 && $tds.first().is(function() {
                    const textContent = this.innerText;
                    return monthes.some(m => new RegExp(`\\b${m}\\b`).test(textContent));
                });

                if (hasDate) {
                    const tdTexts = $tds.map(function() {
                        const textContent = jQuery(this).text().trim();
                        const targetLink = jQuery(this).find('span.flagicon a').first();

                        if (targetLink && targetLink.length > 0) {
                            return {country: targetLink.attr('title') || targetLink.text(), info: textContent.trim()};
                        } else if (textContent.includes('img')) {
                            const altMatch = textContent.match(/alt="([^"]*)"/);
                            const textMatch = textContent.match(/>([^<]+)$/);
                            return {country: altMatch ? altMatch[1] : '', info: textMatch ? textMatch[1].trim() : ''};
                        }
                        return {info: textContent};
                    }).get();

                    const obj = { flight: cnt++ };
                    for (let j = 0; j < header.length; j++) {
                        let info;
                        if (header[j] === 'org') {
                            info = tdTexts[j];
                        } else {
                            info = tdTexts[j].info;
                        }
                        obj[header[j]] = transform[j](info);
                    }
                    json.push(obj);
                }
            });
        });

        return json;
    });

    return data;
}

/**
 * Main crawl function for a single target
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
        const page = await browser.newPage();

        // Set viewport and user agent
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

        console.log('   Loading page...');
        await page.goto(config.url, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log('   Page loaded, extracting data...');

        // Choose crawler based on target
        let data;
        if (targetKey === 'falcon') {
            data = await scrapeFalconLaunches(page);
        } else {
            data = await scrapeWorldLaunches(page);
        }

        await page.close();

        if (!data || data.length === 0) {
            console.error('   ⚠️  No data extracted!');
            return false;
        }

        // Save to file
        const outputPath = path.join(process.cwd(), config.filename);
        await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');

        console.log(`   ✅ Success! Extracted ${data.length} launches`);
        console.log(`   📁 Saved to: ${config.filename}`);

        return true;
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
    }
}

/**
 * Display help message
 */
function showHelp() {
    console.log(`
🚀 Wikipedia Launch Data Crawler - CLI

Usage:
  node crawl-cli.js <target>
  npm run crawl <target>

Available targets:
  falcon      - SpaceX Falcon 9/Heavy launches
  world-q1    - World launches Q1 2025 (Jan-Mar)
  world-q2    - World launches Q2 2025 (Apr-Jun)
  world-q3    - World launches Q3 2025 (Jul-Sep)
  world-q4    - World launches Q4 2025 (Oct-Dec)
  world-h1    - World launches H1 2025 (Jan-Jun)
  all         - Crawl all targets

Examples:
  node crawl-cli.js falcon
  node crawl-cli.js world-q1
  node crawl-cli.js all
  npm run crawl falcon
  npm run crawl:all
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
            console.log('\n📊 Crawling all targets...\n');
            let successCount = 0;
            let failCount = 0;

            for (const key of Object.keys(CRAWL_TARGETS)) {
                const success = await crawlTarget(browser, key);
                if (success) successCount++;
                else failCount++;
            }

            console.log('\n' + '='.repeat(50));
            console.log(`✅ Completed: ${successCount} successful, ${failCount} failed`);
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

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { crawlTarget, CRAWL_TARGETS };
