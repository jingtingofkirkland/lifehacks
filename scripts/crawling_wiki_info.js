// wiki url: https://en.m.wikipedia.org/wiki/List_of_Falcon_9_and_Falcon_Heavy_launches
// jq -s '.[0] + .[1]' f9_launches_550.json launches.json > f9_launches.json

// Configuration
const FALCON_CONFIG = {
    START_FLIGHT: 551,
    HEADERS: ['time', 'rocket', 'site', 'mission', 'mass', 'orbit'],
    MASS_REGEX: /^(.*)kg/,
    ESTIMATED_MASSES: {
        LEO: '163000',
        GTO: '6000',
        DEFAULT: '3000'
    }
};

// Data transformation utilities
const transformUtils = {
    cleanNonBreakingSpace: (text) => text.replace('\xa0', ' '),

    cleanTime: (timeStr) => {
        const cleaned = timeStr.replace(/\[\d+\]/g, '');
        return cleaned.replace(/(\d{4})(\d{2}:\d{2})/, '$1 $2');
    },

    cleanRocket: (rocketStr) => rocketStr
        .replace('F9\xa0B5', '')
        .replace(/\[\d+\]/, ''),

    cleanMass: (massStr) => {
        const match = massStr.match(FALCON_CONFIG.MASS_REGEX);
        return match ? match[1].replace(/[~,\s]/g, '') : massStr;
    }
};

// Get transformers array
const getTransformers = () => [
    transformUtils.cleanTime,
    transformUtils.cleanRocket,
    transformUtils.cleanNonBreakingSpace,
    transformUtils.cleanNonBreakingSpace,
    transformUtils.cleanMass,
    transformUtils.cleanNonBreakingSpace
];

// Function to estimate mass based on orbit
function estimateMass(mass, orbit) {
    if (!mass.startsWith('Unknown')) {
        return mass;
    }

    if (orbit.startsWith('LEO')) {
        return FALCON_CONFIG.ESTIMATED_MASSES.LEO;
    } else if (orbit.startsWith('GTO')) {
        return FALCON_CONFIG.ESTIMATED_MASSES.GTO;
    }
    return FALCON_CONFIG.ESTIMATED_MASSES.DEFAULT;
}

// Function to create launch object
function createLaunchObject(flightNumber, data, headers, transformers) {
    const obj = { flight: flightNumber };

    for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = transformers[j](data[j]);
    }

    // Estimate mass if unknown
    obj['mass'] = estimateMass(obj['mass'], obj['orbit']);

    return obj;
}

// Function to download JSON data
function downloadJSON(data, filename) {
    const blob = new Blob([data], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

// Main function to scrape Falcon launches
(function scrapeFalconLaunches() {
    const transformers = getTransformers();
    const json = [];

    for (let i = FALCON_CONFIG.START_FLIGHT; ; i++) {
        const data = $$(`#F9-${i} td`).map(x => $(x).text().trim());

        if (data.length === 0) {
            break;
        }

        const launchObj = createLaunchObject(
            i,
            data,
            FALCON_CONFIG.HEADERS,
            transformers
        );
        json.push(JSON.stringify(launchObj));
    }

    const finalContent = `[${json.join(',\n')}]`;
    downloadJSON(finalContent, 'launches.json');
})();

// World launches https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_January%E2%80%93March_2025
// Q4: https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_October%E2%80%93December_2025#October
// {"flight":1,"time":"4 January 01:27","rocket":"Falcon 9 Block 5","mission":"F9-418","site":"Cape Canaveral SLC-40","org":{"country":"United States","info":"SpaceX"}}
// jq -s '.[0] + .[1]' world_launches_all_3q.json world_launches_q4.json > world_launches.json
(function findRowsWithDate(selector) {
    const debug = false;
    const monthes = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const header = ['time', 'rocket',  'mission', 'site', 'org'];
    const noOp = x => x;
    const takeInfo = x => x ? x.info: x;
    const timeTrans = t => {
      try {
        //console.log('Before:', t);
        const cleanStr = t.replace(/\[\d+\]/g, '');
        //console.log('after:', cleanStr);
        return cleanStr.replace(/(\d{1,2}\s+[A-Za-z]+)(\d{2}:\d{2})/, '$1 $2');
      } catch (error) {
        console.error(`could not prase time as: ${JSON.stringify(t)}`);
        return t;
      }
    };
    const transform = [timeTrans,takeInfo, noOp, takeInfo, noOp];
    let json = [];

    // Array to store matching rows
    const matchingRows = [];

    // Select table
    const $tables = $(`${selector}`)
    if (!$tables.length) {
        console.error('Table not found');
        return matchingRows;
    }
    console.log(`Found ${$tables.length} tables`);
    // Iterate on each table
    // Iterate through each row
    let cnt =1;
    let upcomming = false;
    $tables.each(function() {

      let subOrbital = false;
      let hasNormalData = false;

      let $table = $(this);
      // check if its upcoming or suborbital table
      $table.find('tr').each(function() {
        const $row = $(this);
          // Check if any td in the row contains a date
          const $tds = $row.find('td');
          if(!upcomming) {
            //once upcoming, ignore all the rest.
            upcomming = $tds.is(function() {
              return $(this).text().includes('Upcoming launches');
            });
          }
          if(!subOrbital) {
          subOrbital = $tds.is(function() {
              return $(this).text().includes('Suborbital');
          });
        }
          // normla data only from not upcoming or subortibal process
          if(!hasNormalData) {
          hasNormalData = !upcomming && !subOrbital &&  $tds.length > 2 && $tds.first().is(function() {
              const textContent = this.innerText;
              //return monthes.some(m => $(this).text().includes('April'));
              return monthes.some(m => new RegExp(`\\b${m}\\b`).test(textContent));
          });
        }
      });
      //early return for only subOrbital or upcoming
      if(!hasNormalData && (upcomming || subOrbital)) {
            console.log('ignore only upcommings or subOrbital:'+cnt);
            return false;
      }
      subOrbital = false;
      upcomming = false;
      // process table (might still have mixed with upcoming or subOrbital)
      $table.find('tr').each(function() {
          const $row = $(this);
          // Check if any td in the row contains a date
          const $tds = $row.find('td');
          // eager return if processed to upcoming or suborbital
          if((upcomming || subOrbital)) {
            console.log('ignore upcommings or subOrbital inner:'+cnt);
            return false;
          }

          upcomming = $tds.is(function() {
              return $(this).text().includes('Upcoming launches');
          });

          subOrbital = $tds.is(function() {
              return $(this).text().includes('Suborbital');
          });

          if((upcomming || subOrbital)) {
            console.log('ignore upcommings or subOrbital:'+cnt);
            return false;
          }

          const hasDate = $tds.length > 2 && $tds.first().is(function() {
              const textContent = this.innerText;
              //return monthes.some(m => $(this).text().includes('April'));
              return monthes.some(m => new RegExp(`\\b${m}\\b`).test(textContent));
          });
          if (hasDate) { // row has date, indicate a valid row
              // Push an array of all td texts
              const tdTexts = $tds.map(function() {
                const textContent = $(this).text().trim()
                  // there are multiple possible columns having flag icon
                  const targetLink = $(this).find('span.flagicon a').first();

                  if(targetLink && targetLink.length > 0) {
                    //console.log({country: targetLink.attr('title') || targetLink.text(), info: textContent.trim()});
                    return {country: targetLink.attr('title') || targetLink.text(), info: textContent.trim()};
                  }
                  else if(textContent.includes('img')) {
                    // img tag
                    // Regex to match the alt attribute
                    const altRegex = /alt="([^"]*)"/;
                    // Regex to match the text after the closing img tag
                    const textRegex = />([^<]+)$/;

                    // Extract alt
                    const altMatch = textContent.match(altRegex);
                    const alt = altMatch ? altMatch[1] : '';

                    // Extract text
                    const textMatch = textContent.match(textRegex);
                    const text = textMatch ? textMatch[1].trim() : '';
                    return {country: alt, info: text};
                  }
                  return {info:textContent};
              }).get();

              matchingRows.push(tdTexts);
              const obj = {};
              obj['flight']=cnt; cnt++;
              for(var j =0;j<header.length;j++) {
                let info;
                if(header[j] =='org') {
                  info = tdTexts[j]
                } else {
                  info = tdTexts[j].info;
                }
                obj[header[j]] = transform[j](info);
              }
              json.push(JSON.stringify(obj));
          }
      });
    });
    // download
    const finalContent = `[${json.join(',\n')}]`;
    if(debug) {
      console.log(finalContent);
    }
// Create a Blob with the CSV content
  const blob = new Blob([finalContent], { type: 'application/json;charset=utf-8;' });

  // Create a temporary link to trigger download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  if(!debug) {
    link.setAttribute('href', url);
  }
  link.setAttribute('download', 'world_launches_q4.json'); // File name
  link.style.display = 'none';

  // Append link to body, trigger click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})('.wikitable')
