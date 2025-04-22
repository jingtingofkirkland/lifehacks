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

// Function to increment flights for a specific booster
function incrementBooster() {
    let boosterName = document.getElementById('boosterName').value.trim();
    if (!boosterName) {
        alert('Please enter a booster name');
        return;
    }
    if(!boosterName.startsWith("B")){
        boosterName = "B"+boosterName;
    }
    const booster = boosterData.find(b => b.name.toLowerCase() === boosterName.toLowerCase());
    if (booster) {
        booster.flights += 1;
    } else {
        boosterData.push({"name": boosterName.toUpperCase(), "flights": 1});
    }
    drawBarChart(getSortedData());
    document.getElementById('boosterName').value = ''; // Clear input
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
    const maxCount = Math.max(...chartData.map(d => d.count));
    const maxMass = Math.max(...chartData.map(d => d.mass));

    // Animation parameters
    const animationDuration = 1000; // 1 second for 1 day
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
async function loadFromJson() {
    try {
        const response = await fetch('/launches.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const loadedData = await response.json();
        // Validate the loaded data
        if (Array.isArray(loadedData)) {
            const mapped = loadedData.map(x => { r = x['rocket'].split('.'); return {name: r[0].trim(), flights: Number(r[1])}});
            //console.log(mapped);
            return {raw:loadedData, booster:mapped};
        } else {
            throw new Error('Invalid JSON format from server. Expected array of {name: string, flights: number}');
        }
    } catch (error) {
        console.error('Error loading from server:', error);
        return null;
    }
}

// When the DOM is fully loaded, draw the initial chart
document.addEventListener('DOMContentLoaded', async function() {
    const json = await loadFromJson();
    launchesData = json.raw;
    boosterData = json.booster;
    drawBarChart(getSortedData());
    drawCountAndMassChart(launchesData);
});