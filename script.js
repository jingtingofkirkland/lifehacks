// Global variable to store booster data
let boosterData ;

// Function to sort and return data
function getSortedData() {
    return boosterData.sort((a, b) => b.flights - a.flights);
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
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        // Chart parameters
        const chartWidth = canvas.width;
        const barHeight = 30;
        const barGap = 10;
        
        // Calculate dynamic height (minimum height of 400px)
        const calculatedHeight = Math.max(400, data.length * (barHeight + barGap) + barGap);
        canvas.height = calculatedHeight; // Set dynamic height

        const maxFlights = Math.max(...data.map(booster => booster.flights));

        // Clear the canvas
        ctx.clearRect(0, 0, chartWidth, calculatedHeight);

        // Draw bars
        data.forEach((booster, index) => {
            const barWidth = (booster.flights / maxFlights) * (chartWidth - 100);
            const x = 50;
            const y = index * (barHeight + barGap) + barGap;

            // Draw bar
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw labels
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText(booster.name, 5, y + barHeight / 2 + 5);
            ctx.fillText(booster.flights, x + barWidth + 5, y + barHeight / 2 + 5);
        });
    }
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
        const response = await fetch('/booster.json', {
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
        if (Array.isArray(loadedData) && loadedData.every(item => 
            typeof item.name === 'string' && typeof item.flights === 'number' && item.flights >= 0)) {
            return loadedData;
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
    boosterData = await loadFromJson();
    drawBarChart(getSortedData());
});