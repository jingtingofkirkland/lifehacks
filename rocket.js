// Global variable to store booster data
let boosterData ;

let launchesData ;

// Function to sort and remove duplicate data
function getSortedData() {
    const s = boosterData.sort((a, b) => b.flights - a.flights);
    const seen = new Set();
    return s.filter(x => {
        if(seen.has(x.name)){
            return false;
        }
        seen.add(x.name);
        return true;
    });

}

// Function to draw the horizontal bar chart with dynamic height
function drawBarChart(data) {
    const canvas = document.getElementById('barChart');
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');

    // Chart parameters
    const chartWidth = canvas.width;
    const barHeight = 30;
    const barGap = 10;
    
    // Calculate dynamic height
    const calculatedHeight = Math.max(400, data.length * (barHeight + barGap) + barGap);
    canvas.height = calculatedHeight;

    const maxFlights = Math.max(...data.map(booster => booster.flights));
    
    // Animation parameters
    const animationDuration = 1000; // 1 second
    const startTime = performance.now();
    
    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, calculatedHeight);

    function animate(currentTime) {
        // Clear canvas for each frame
        ctx.clearRect(0, 0, chartWidth, calculatedHeight);

        // Calculate progress (0 to 1)
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Draw bars
        data.forEach((booster, index) => {
            const finalBarWidth = (booster.flights / maxFlights) * (chartWidth - 100);
            const currentBarWidth = finalBarWidth * progress;
            const x = 50;
            const y = index * (barHeight + barGap) + barGap;

            // Draw bar
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(x, y, currentBarWidth, barHeight);

            // Draw labels
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText(booster.name, 5, y + barHeight / 2 + 5);
            
            // Show flight numbers only when animation is complete
            if (progress === 1) {
                ctx.fillText(booster.flights, x + currentBarWidth + 5, y + barHeight / 2 + 5);
            }
        });

        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    // Start animation
    requestAnimationFrame(animate);
}

/*
 * {
    "flight": 1,
    "time": "4 January 01:27",
    "rocket": "Falcon 9 Block 5",
    "mission": "F9-418",
    "site": "Cape Canaveral SLC-40",
    "org": {
      "country": "United States",
      "info": "SpaceX"
    }
  },
*/

// Function to draw the horizontal bar chart For World Data
function drawBarChartWorld(data) {
    const canvas = document.getElementById('worldData');
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');

    // Chart parameters
    const chartWidth = canvas.width;
    const barHeight = 30;
    const barGap = 10;
    const currentYear = new Date().getFullYear(); // 2025

    // Parse data
    const parsedData = data.map((d) => ({
        time: new Date(`${d.time} ${currentYear}`),
        org: d.org.info,
        country:d.org.country
    }));
    parsedData.sort((a, b) => a.time - b.time); // Sort by time
    // Calculate cumulative values

    const groupbyCountry = parsedData.reduce((acc, item) => {
      const country  = item.org == 'SpaceX'? 'SpaceX(+Starship)' : item.country;
      acc[country] = acc[country] || []; // Initialize array if it doesn't exist
      acc[country].push(item);
      return acc;
    }, {});
    

    // const dataToDraw = [{name:'SpaceX', launches: parsedData}]
    const dataToDraw = Object.keys(groupbyCountry).map( x => ({name:x, launches:groupbyCountry[x]}));
    
    dataToDraw.sort((b, a) => a.launches.length - b.launches.length); // Sort by luanches
    // Calculate dynamic height
    const calculatedHeight = Math.max(400, (dataToDraw.length +1) * (barHeight + barGap) + barGap);
    canvas.height = calculatedHeight;

    
    
    // Animation parameters
    const maxDataLength = Math.max(...dataToDraw.map(x => x.launches.length));
    const startTime = performance.now();
    const hoursPerRender = 10; // hours Per Render. 
    const startDate = new Date(2025, 0, 1);
    // variable for animation loop
    let cumulativeMass = 0;
    let cumulativeIndex = {};
    let progress ={};
    //console.log(currentDate);
    let interplant = 2; // use 3 points to represent 1 data point, need less than 6
    let hours = 0;
    
    
    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, calculatedHeight);
    console.log(dataToDraw);

    

    function animate(currentTime) {
        
        // Clear canvas for each frame
        ctx.clearRect(0, 0, chartWidth, calculatedHeight);

        const currentDate = new Date(startDate.getTime());
        currentDate.setHours(startDate.getHours() + hours);
        hours+=hoursPerRender;
        //console.log(currentDate);
        // draw the date. 
        ctx.fillText(currentDate.toISOString().split('T')[0], chartWidth/2, barGap*2);
        
        let minProgress = 1;
        // Draw bars
        dataToDraw.forEach((org, index) => {
            const d = org.launches
            const finalBarWidth = (d.length / maxDataLength) * (chartWidth-150);
            const luanchIdx = cumulativeIndex[org.name] ?? 0;
            const dataIdx = Math.floor(luanchIdx/interplant); // 0, 1 2 will represent the first data.
            const maxLen = d.length * interplant;
            //console.log(luanchIdx, dataIdx, maxLen);
            if(dataIdx < d.length && currentDate>=d[dataIdx].time) {
                cumulativeMass+=d[dataIdx].mass;
                cumulativeIndex[org.name] = luanchIdx+1;
            }
            progress[org.name] = Math.min((luanchIdx+1) / maxLen, 1);
            minProgress = Math.min(minProgress, progress[org.name]);
            const currentBarWidth = finalBarWidth * progress[org.name];
            const x = 80;
            const y = (index+1) * (barHeight + barGap) + barGap;

            // Draw bar
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(x, y, currentBarWidth, barHeight);

            // Draw labels
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            const name = org.name =='United States' ? 'US' : org.name;
            ctx.fillText(name, 5, y + barHeight / 2 + 5);
            ctx.fillText(dataIdx+1, x + currentBarWidth + 5, y + barHeight / 2 + 5);
        });
        if (minProgress < 1) {
            //console.log(progress);
            requestAnimationFrame(animate);
        }
    }

    // Start animation
    requestAnimationFrame(animate);
}

// Function to draw the horizontal bar chart For World Data
function drawBarChartWorldMass(data) {
    const canvas = document.getElementById('worldDataMass');
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');

    // Chart parameters
    const chartWidth = canvas.width;
    const barHeight = 30;
    const barGap = 10;
    const currentYear = new Date().getFullYear(); // 2025

    // Parse data
    const parsedData = data.map((d) => ({
        time: new Date(`${d.time} ${currentYear}`),
        org: d.org.info,
        country:d.org.country
    }));
    parsedData.sort((a, b) => a.time - b.time); // Sort by time
    // Calculate cumulative values

    const groupbyCountry = parsedData.reduce((acc, item) => {
      const country  = item.org == 'SpaceX'? item.org : item.country;
      acc[country] = acc[country] || []; // Initialize array if it doesn't exist
      acc[country].push(item);
      return acc;
    }, {});
    

    // const dataToDraw = [{name:'SpaceX', launches: parsedData}]
    const dataToDraw = Object.keys(groupbyCountry).map( x => ({name:x, launches:groupbyCountry[x]}));
    
    dataToDraw.sort((b, a) => a.launches.length - b.launches.length); // Sort by luanches
    // Calculate dynamic height
    const calculatedHeight = Math.max(400, (dataToDraw.length +1) * (barHeight + barGap) + barGap);
    canvas.height = calculatedHeight;

    
    
    // Animation parameters
    const maxDataLength = Math.max(...dataToDraw.map(x => x.launches.length));
    const startTime = performance.now();
    const msPerHours = 4; // how much ms will render for a Hours. 
    const startDate = new Date(2025, 0, 1);
    // variable for animation loop
    let cumulativeMass = 0;
    let cumulativeIndex = {};
    let progress ={};
    //console.log(currentDate);
    let interplant = 6; // use 3 points to represent 1 data point, need less than 6
    let hours = 0;
    
    
    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, calculatedHeight);

    

    function animate(currentTime) {
        
        // Clear canvas for each frame
        ctx.clearRect(0, 0, chartWidth, calculatedHeight);

        const currentDate = new Date(startDate.getTime());
        currentDate.setHours(startDate.getHours() + hours);
        hours+=msPerHours;
        //console.log(currentDate);
        // draw the date. 
        ctx.fillText(currentDate.toISOString().split('T')[0], chartWidth/2, barGap*2);
        
        let minProgress = 1;
        // Draw bars
        dataToDraw.forEach((org, index) => {
            const d = org.launches
            const finalBarWidth = (d.length / maxDataLength) * (chartWidth - 100);
            const luanchIdx = cumulativeIndex[org.name] ?? 0;
            const dataIdx = Math.floor(luanchIdx/interplant); // 0, 1 2 will represent the first data.
            const maxLen = d.length * interplant;
            //console.log(luanchIdx, dataIdx, maxLen);
            if(dataIdx < d.length && currentDate>=d[dataIdx].time) {
                cumulativeMass+=d[dataIdx].mass;
                cumulativeIndex[org.name] = luanchIdx+1;
            }
            progress[org.name] = Math.min((luanchIdx+1) / maxLen, 1);
            minProgress = Math.min(minProgress, progress[org.name]);
            const currentBarWidth = finalBarWidth * progress[org.name];
            const x = 50;
            const y = (index+1) * (barHeight + barGap) + barGap;

            // Draw bar
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(x, y, currentBarWidth, barHeight);

            // Draw labels
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            const name = org.name =='United States' ? 'US' : org.name;
            ctx.fillText(name, 5, y + barHeight / 2 + 5);
            ctx.fillText(dataIdx+1, x + currentBarWidth + 5, y + barHeight / 2 + 5);
        });
        if (minProgress < 1) {
            //console.log(progress);
            requestAnimationFrame(animate);
        }
    }

    // Start animation
    requestAnimationFrame(animate);
}

function drawCountAndMassChart(data) {
    const canvas = document.getElementById('countAndMass');
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');

    // Chart parameters
    const chartWidth = canvas.width;
    const chartHeight = 400;
    canvas.height = chartHeight;
    const margin = { top: 20, right: 80, bottom: 50, left: 60 };
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = chartHeight - margin.top - margin.bottom;

    // Parse data, ignoring flight and rocket
    const parsedData = data.map(d => ({
        time: new Date(d.time),
        mass: parseFloat(d.mass) // Convert string to number
    }));
    parsedData.sort((a, b) => a.time - b.time); // Sort by time

    // Calculate cumulative values
    let cumulativeMass = 0;
    const chartData = parsedData.map((d, i) => ({
        time: d.time,
        count: i + 1, // Cumulative count of events
        mass: (cumulativeMass += d.mass) // Cumulative mass
    }));

    // Scales
    const minTime = chartData[0].time;
    const maxTime = chartData[chartData.length - 1].time;
    const maxCount = chartData.length;
    const maxMass = Math.max(...chartData.map(d => d.mass));

    // Animation parameters
    const animationDuration = 10000; // 1 second for 1 day
    const startTime = performance.now();

    function animate(currentTime) {
        // Clear canvas
        ctx.clearRect(0, 0, chartWidth, chartHeight);

        // Calculate progress (0 to 1)
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const visiblePoints = Math.min(Math.ceil(chartData.length * progress), chartData.length);

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        // X-axis (time)
        ctx.moveTo(margin.left, chartHeight - margin.bottom);
        ctx.lineTo(chartWidth - margin.right, chartHeight - margin.bottom);
        ctx.stroke();

        // Y-axis left (count)
        ctx.moveTo(margin.left, chartHeight - margin.bottom);
        ctx.lineTo(margin.left, margin.top);
        ctx.stroke();

        // Y-axis right (mass)
        ctx.moveTo(chartWidth - margin.right, chartHeight - margin.bottom);
        ctx.lineTo(chartWidth - margin.right, margin.top);
        ctx.stroke();

        // Draw axis labels
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Time', chartWidth / 2, chartHeight - 10);
        ctx.save();
        ctx.translate(margin.left - 40, chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Cumulative Event Count', 0, 0);
        ctx.restore();
        ctx.save();
        ctx.translate(chartWidth - margin.right + 40, chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Cumulative Mass (kg)', 0, 0);
        ctx.restore();

        // Draw tick marks and labels
        // X-axis (time, show first and last)
        ctx.textAlign = 'center';
        const formatDate = (date) => date.toISOString().split('T')[0];
        ctx.fillText(formatDate(chartData[0].time), margin.left, chartHeight - margin.bottom + 20);
        ctx.fillText(formatDate(chartData[chartData.length - 1].time), chartWidth - margin.right, chartHeight - margin.bottom + 20);

        // Y-axis left (count)
        ctx.textAlign = 'right';
        for (let i = 0; i <= maxCount; i += Math.ceil(maxCount / 5)) {
            const y = chartHeight - margin.bottom - (i / maxCount) * plotHeight;
            ctx.fillText(i, margin.left - 10, y + 5);
            ctx.beginPath();
            ctx.moveTo(margin.left - 5, y);
            ctx.lineTo(margin.left, y);
            ctx.stroke();
        }

        // Y-axis right (mass)
        ctx.textAlign = 'left';
        for (let i = 0; i <= maxMass; i += Math.ceil(maxMass / 5)) {
            const y = chartHeight - margin.bottom - (i / maxMass) * plotHeight;
            ctx.fillText(i.toLocaleString(), chartWidth - margin.right + 10, y + 5);
            ctx.beginPath();
            ctx.moveTo(chartWidth - margin.right, y);
            ctx.lineTo(chartWidth - margin.right + 5, y);
            ctx.stroke();
        }

        // Draw lines (up to visiblePoints)
        // Count line (blue)
        ctx.beginPath();
        ctx.strokeStyle = '#1E90FF'; // Blue for count
        ctx.lineWidth = 2;
        for (let i = 0; i < visiblePoints; i++) {
            const x = margin.left + (chartData[i].time - minTime) / (maxTime - minTime) * plotWidth;
            const y = chartHeight - margin.bottom - (chartData[i].count / maxCount) * plotHeight;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Mass line (red)
        ctx.beginPath();
        ctx.strokeStyle = '#FF4500'; // Red for mass
        ctx.lineWidth = 2;
        for (let i = 0; i < visiblePoints; i++) {
            const x = margin.left + (chartData[i].time - minTime) / (maxTime - minTime) * plotWidth;
            const y = chartHeight - margin.bottom - (chartData[i].mass / maxMass) * plotHeight;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw legend
        ctx.fillStyle = '#1E90FF';
        ctx.fillRect(chartWidth - margin.right + 20, margin.top, 10, 10);
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.fillText('Event Count', chartWidth - margin.right + 35, margin.top + 10);

        ctx.fillStyle = '#FF4500';
        ctx.fillRect(chartWidth - margin.right + 20, margin.top + 20, 10, 10);
        ctx.fillStyle = '#000';
        ctx.fillText('Mass', chartWidth - margin.right + 35, margin.top + 30);

        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    // Start animation
    requestAnimationFrame(animate);
}

// Function to save booster data to a JSON file
async function saveToJson() {
    try {
        const jsonData = JSON.stringify(boosterData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Use File System Access API if available (modern browsers)
        if ('showSaveFilePicker' in window) {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'booster_data.json',
                types: [{
                    description: 'JSON File',
                    accept: { 'application/json': ['.json'] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            alert('Data saved successfully!');
        } else {
            // Fallback for older browsers
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'booster_data.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Data downloaded successfully!');
        }
    } catch (error) {
        console.error('Error saving JSON:', error);
        alert('Failed to save data: ' + error.message);
    }
}

// Function to load booster data from server
async function loadFromJson(path) {
    try {
        const response = await fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error('Error loading from server:', error);
        return null;
    }
}

// When the DOM is fully loaded, draw the initial chart
document.addEventListener('DOMContentLoaded', async function() {
    const spaceXJson = await loadFromJson('/launches.json');
    launchesData = spaceXJson;
    drawCountAndMassChart(launchesData);
    boosterData = launchesData.map(x => { r = x['rocket'].split(/[-\.‑]/); return {name: r[0].trim(), flights: Number(r[1])}});
    drawBarChart(getSortedData());
    const worldJson = await loadFromJson('/world_launches.json');
    drawBarChartWorld(worldJson);
    drawBarChartWorldMass(worldJson);
    
});