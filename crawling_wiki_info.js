// wiki url: https://en.m.wikipedia.org/wiki/List_of_Falcon_9_and_Falcon_Heavy_launches
const header = ['time', 'rocket', 'site', 'mission', 'mass', 'orbit']
const startFlight25=418;

const noOp = x => x.replace('\xa0',' ');
const timeTrans = t => {const cleanStr = t.replace(/\[\d+\]/, ''); return cleanStr.replace(/(\d{4})(\d{2}:\d{2})/, '$1 $2');};
const rocketTrans = x => x.replace('F9\xa0B5','').replace(/\[\d+\]/, '');
const massRegx = /^(.*)kg/
const massTrans = x => {const m = x.match(massRegx); return m? m[1]: x};
const transform = [timeTrans,rocketTrans, noOp, noOp, massTrans, noOp];
let json = [];
for(var i=startFlight25;;i++) {
  let data = $$(`#F9-${i} td`).map(x => $(x).text().trim());
  if(data.length ==0) {
    break;
  }
  obj = {};
  obj['flight']=i;
  for(var j =0;j<6;j++) {
    obj[header[j]] = transform[j](data[j]);
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
  link.setAttribute('download', 'table_data.json'); // File name
  link.style.display = 'none';

  // Append link to body, trigger click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
