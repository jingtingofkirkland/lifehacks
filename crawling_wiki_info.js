// wiki url: https://en.m.wikipedia.org/wiki/List_of_Falcon_9_and_Falcon_Heavy_launches
(function () {
const header = ['time', 'rocket', 'site', 'mission', 'mass', 'orbit']
const startFlight25=418;

const noOp = x => x.replace('\xa0',' ');
const timeTrans = t => {const cleanStr = t.replace(/\[\d+\]/g, ''); return cleanStr.replace(/(\d{4})(\d{2}:\d{2})/, '$1 $2');};
const rocketTrans = x => x.replace('F9\xa0B5','').replace(/\[\d+\]/, '');
const massRegx = /^(.*)kg/
const massTrans = (x) => {
  const m = x.match(massRegx);
  return m? m[1].replace(/[~,\s]/g,''): x;
  }
const transform = [timeTrans,rocketTrans, noOp, noOp, massTrans, noOp];
let json = [];
for(var i=startFlight25;;i++) {
  let data = $$(`#F9-${i} td`).map(x => $(x).text().trim());
  if(data.length ==0) {
    break;
  }
  const obj = {};
  obj['flight']=i;
  for(var j =0;j<6;j++) {
    obj[header[j]] = transform[j](data[j]);
  }
  // gen estimate mass
  if(obj['mass'].startsWith('Unknown')) {
    // provide an estimate based on the landing  
    if(obj['orbit'].startsWith('LEO')) {
      obj['mass'] = "163000";
    } else if(obj['orbit'].startsWith('GTO')){
      obj['mass'] = "6000";
    } else {
      obj['mass'] = "3000";
    }
  }
  json.push(JSON.stringify(obj));
}
 const finalContent = `[${json.join(',\n')}]`;
// Create a Blob with the CSV content
  const blob = new Blob([finalContent], { type: 'application/json;charset=utf-8;' });

  // Create a temporary link to trigger download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'launches.json'); // File name
  link.style.display = 'none';

  // Append link to body, trigger click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})();

// World launches https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_January%E2%80%93March_2025
// Q2: https://en.m.wikipedia.org/wiki/List_of_spaceflight_launches_in_April%E2%80%93June_2025#April
// {"flight":1,"time":"4 January 01:27","rocket":"Falcon 9 Block 5","mission":"F9-418","site":"Cape Canaveral SLC-40","org":{"country":"United States","info":"SpaceX"}}
// jq -s '.[0] + .[1]' world_launches_q1.json world_launches_q2.json > world_launches.json
(function findRowsWithDate(selector) {
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
        console.error(`could not prase: ${JSON.stringify(t)}`);
        return t;
      }
    };
    const transform = [timeTrans,takeInfo, noOp, takeInfo, noOp];
    let json = [];

    // Array to store matching rows
    const matchingRows = [];
    
    // Select table
    const $table = $(`${selector}`).first();
    if (!$table.length) {
        console.error('Table not found');
        return matchingRows;
    }
    // Iterate through each row
    let cnt =1;
    $table.find('tr').each(function() {
        const $row = $(this);
        // Check if any td in the row contains a date
        const $tds = $row.find('td');
        const upcomming = $tds.is(function() {
            return $(this).text().includes('Upcoming launches');
        });
        if(upcomming) {
          console.log('ignore upcommings:'+cnt);
          return false;
        }
        const hasDate = $tds.length > 2 && $tds.first().is(function() {
            return monthes.some(m => $(this).text().includes(m));
        });
        if (hasDate) {
            // Push an array of all td texts
            const tdTexts = $tds.map(function() {
              const textContent = $(this).text().trim()
                if(textContent.includes('img')) {
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
                return textContent;
            }).get();
            matchingRows.push(tdTexts);
            const obj = {};
            obj['flight']=cnt; cnt++;
            for(var j =0;j<header.length;j++) {
              obj[header[j]] = transform[j](tdTexts[j]);
            }
            json.push(JSON.stringify(obj));
        }
    });
    // download
    const finalContent = `[${json.join(',\n')}]`;
// Create a Blob with the CSV content
  const blob = new Blob([finalContent], { type: 'application/json;charset=utf-8;' });

  // Create a temporary link to trigger download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'world_launches.json'); // File name
  link.style.display = 'none';

  // Append link to body, trigger click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})('.wikitable')