// Chart configuration constants
const CHART_CONFIG = {
    BAR_HEIGHT: 30,
    BAR_GAP: 10,
    ANIMATION_DURATION: 1000,
    WORLD_ANIMATION_HOURS_PER_RENDER: 10,
    WORLD_ANIMATION_INTERPOLATION: 2,
    MIN_CANVAS_HEIGHT: 400,
    CHART_MARGINS: { top: 20, right: 80, bottom: 50, left: 60 },
    COLORS: {
        PRIMARY_BAR: '#00ff88',        // Neon green for bars
        BACKGROUND_BAR: '#3a4156',     // Dark gray background
        TEXT: '#e0e6ed',               // Light text
        COUNT_LINE: '#00d9ff',         // Neon cyan for count line
        MASS_LINE: '#ff2e97',          // Neon pink for mass line
        LEADER_HIGHLIGHT: '#ffd700',   // Gold for leader
        AXIS_COLOR: '#8b95a8',         // Light gray for axes
        DATE_TEXT: '#00d9ff'           // Cyan for dates
    }
};

const DATA_PATHS = {
    SPACEX: '/f9_launches.json',
    WORLD: '/world_launches.json'
};

// Global data storage
let boosterData = null;
let launchesData = null;

// Utility function to sort and remove duplicate data
function getSortedUniqueData(data) {
    const sortedData = [...data].sort((a, b) => b.flights - a.flights);
    const uniqueNames = new Set();

    return sortedData.filter(item => {
        if (uniqueNames.has(item.name)) {
            return false;
        }
        uniqueNames.add(item.name);
        return true;
    });
}

// Utility function to format dates
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Utility function to calculate dynamic canvas height
function calculateCanvasHeight(dataLength, barHeight, barGap, minHeight = CHART_CONFIG.MIN_CANVAS_HEIGHT) {
    return Math.max(minHeight, dataLength * (barHeight + barGap) + barGap);
}

// Validate canvas and context
function getCanvasContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with id "${canvasId}" not found`);
        return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error(`Cannot get 2D context for canvas "${canvasId}"`);
        return null;
    }

    return { canvas, ctx };
}

// Validate data before processing
function validateData(data, requiredFields = []) {
    if (!Array.isArray(data) || data.length === 0) {
        console.error('Data must be a non-empty array');
        return false;
    }

    if (requiredFields.length > 0) {
        const hasRequiredFields = data.every(item =>
            requiredFields.every(field => field in item)
        );
        if (!hasRequiredFields) {
            console.error(`Data items must contain fields: ${requiredFields.join(', ')}`);
            return false;
        }
    }

    return true;
}

// Draw single bar with labels
function drawBar(ctx, config) {
    const { x, y, width, height, color, name, value, showValue } = config;

    // Draw bar
    ctx.fillStyle = color || CHART_CONFIG.COLORS.PRIMARY_BAR;
    ctx.fillRect(x, y, width, height);

    // Draw labels
    ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
    ctx.font = '12px Arial';
    ctx.fillText(name, 5, y + height / 2 + 5);

    if (showValue) {
        ctx.fillText(value, x + width + 5, y + height / 2 + 5);
    }
}

// Function to draw the horizontal bar chart with dynamic height
function drawBarChart(data) {
    if (!validateData(data, ['name', 'flights'])) {
        console.error('Invalid data for bar chart');
        return;
    }

    const canvasInfo = getCanvasContext('barChart');
    if (!canvasInfo) return;

    const { canvas, ctx } = canvasInfo;
    const chartWidth = canvas.width;

    // Calculate dynamic height
    const calculatedHeight = calculateCanvasHeight(
        data.length,
        CHART_CONFIG.BAR_HEIGHT,
        CHART_CONFIG.BAR_GAP
    );
    canvas.height = calculatedHeight;

    const maxFlights = Math.max(...data.map(booster => booster.flights));
    const startTime = performance.now();

    function animate(currentTime) {
        ctx.clearRect(0, 0, chartWidth, calculatedHeight);

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / CHART_CONFIG.ANIMATION_DURATION, 1);

        // Draw bars
        data.forEach((booster, index) => {
            const finalBarWidth = (booster.flights / maxFlights) * (chartWidth - 100);
            const currentBarWidth = finalBarWidth * progress;
            const x = 50;
            const y = index * (CHART_CONFIG.BAR_HEIGHT + CHART_CONFIG.BAR_GAP) + CHART_CONFIG.BAR_GAP;

            drawBar(ctx, {
                x,
                y,
                width: currentBarWidth,
                height: CHART_CONFIG.BAR_HEIGHT,
                name: booster.name,
                value: booster.flights,
                showValue: progress === 1
            });
        });

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Helper function to draw axis lines
function drawAxes(ctx, dimensions, margins) {
    const { width, height } = dimensions;

    ctx.beginPath();
    ctx.strokeStyle = CHART_CONFIG.COLORS.TEXT;
    ctx.lineWidth = 1;

    // X-axis (time)
    ctx.moveTo(margins.left, height - margins.bottom);
    ctx.lineTo(width - margins.right, height - margins.bottom);
    ctx.stroke();

    // Y-axis left
    ctx.moveTo(margins.left, height - margins.bottom);
    ctx.lineTo(margins.left, margins.top);
    ctx.stroke();

    // Y-axis right
    ctx.moveTo(width - margins.right, height - margins.bottom);
    ctx.lineTo(width - margins.right, margins.top);
    ctx.stroke();
}

// Helper function to draw axis labels
function drawAxisLabels(ctx, config) {
    const { dimensions, margins, xLabel, yLeftLabel, yRightLabel } = config;
    const { width, height } = dimensions;

    ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // X-axis label
    ctx.fillText(xLabel, width / 2, height - 10);

    // Y-axis left label
    ctx.save();
    ctx.translate(margins.left - 40, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLeftLabel, 0, 0);
    ctx.restore();

    // Y-axis right label
    ctx.save();
    ctx.translate(width - margins.right + 40, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yRightLabel, 0, 0);
    ctx.restore();
}

// Helper function to draw legend
function drawLegend(ctx, legendItems, position) {
    const { x, y } = position;

    legendItems.forEach((item, index) => {
        const yOffset = index * 20;

        // Draw color box
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y + yOffset, 10, 10);

        // Draw label
        ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
        ctx.textAlign = 'left';
        ctx.fillText(item.label, x, y + yOffset + 20);
    });
}

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
        country: d.org.country
    }));
    //Change title
    document.getElementById('word_launch_title').textContent =
    `World Counts 2025 (Total: ${parsedData.length})`;

    parsedData.sort((a, b) => a.time - b.time);

    // Group by country/org
    const groupbyCountry = parsedData.reduce((acc, item) => {
        const key = item.org === 'SpaceX' ? 'SpaceX' : item.country;
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});

    const dataToDraw = Object.keys(groupbyCountry).map(name => ({
        name,
        launches: groupbyCountry[name]
    }));

    // Sort by total launches (descending) — just for initial order
    dataToDraw.sort((a, b) => b.launches.length - a.launches.length);

    // Dynamic canvas height
    const calculatedHeight = Math.max(400, (dataToDraw.length + 1) * (barHeight + barGap) + barGap);
    canvas.height = calculatedHeight;

    // Animation setup
    const hoursPerRender = 10;
    const startDate = new Date(2025, 0, 1);
    let hours = 0;

    const interplant = 2;
    const cumulativeIndex = {}; // tracks progress per org
    const currentCounts = {};   // current launch count per org at this time

    // Initialize
    dataToDraw.forEach(org => {
        cumulativeIndex[org.name] = 0;
        currentCounts[org.name] = 0;
    });

    function animate() {
        ctx.clearRect(0, 0, chartWidth, canvas.height);

        // Advance time
        const currentDate = new Date(startDate);
        currentDate.setHours(startDate.getHours() + hours);
        hours += hoursPerRender;

        // Update launch counts based on time
        let maxCurrentLaunches = 0;
        let leaderName = null;

        dataToDraw.forEach(org => {
            const launches = org.launches;
            const stepsSoFar = cumulativeIndex[org.name] ?? 0;
            const dataIdx = Math.floor(stepsSoFar / interplant);

            // Advance if we passed a launch
            if (dataIdx < launches.length && currentDate >= launches[dataIdx].time) {
                cumulativeIndex[org.name] = stepsSoFar + 1;
            }

            const updatedIdx = Math.floor((cumulativeIndex[org.name] ?? 0) / interplant);
            currentCounts[org.name] = Math.min(updatedIdx + 1, launches.length);

            // Track current leader
            if (currentCounts[org.name] > maxCurrentLaunches) {
                maxCurrentLaunches = currentCounts[org.name];
                leaderName = org.name;
            }
        });

        // If no launches yet, skip drawing
        if (maxCurrentLaunches === 0) {
            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(currentDate.toISOString().split('T')[0], chartWidth / 2, barGap * 2);
            requestAnimationFrame(animate);
            return;
        }

        // Draw date
        ctx.fillStyle = CHART_CONFIG.COLORS.DATE_TEXT;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentDate.toISOString().split('T')[0], chartWidth / 2, barGap * 2);

        // Draw bars
        dataToDraw.forEach((org, index) => {
            const count = currentCounts[org.name];
            const isLeader = org.name === leaderName;

            // Full usable width for leader
            const fullWidth = chartWidth - 150;

            // Leader gets full bar, others are relative
            const barLength = isLeader
                ? fullWidth
                : (count / maxCurrentLaunches) * fullWidth;

            const x = 80;
            const y = (index + 1) * (barHeight + barGap) + barGap;

            // Draw full background (for non-leaders, shows potential)
            ctx.fillStyle = CHART_CONFIG.COLORS.BACKGROUND_BAR;
            ctx.fillRect(x, y, fullWidth, barHeight);

            // Draw actual bar (up to current relative length)
            ctx.fillStyle = CHART_CONFIG.COLORS.PRIMARY_BAR;
            ctx.fillRect(x, y, barLength, barHeight);

            // Labels
            ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            const displayName = org.name === 'United States' ? 'US' : org.name;
            ctx.fillText(displayName, 5, y + barHeight / 2 + 5);
            ctx.fillText(count, x + barLength + 5, y + barHeight / 2 + 5);

            // Optional: highlight leader
            if (isLeader) {
                ctx.strokeStyle = CHART_CONFIG.COLORS.LEADER_HIGHLIGHT;
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, barLength, barHeight);
            }
        });

        // Continue if any org has unprocessed launches
        const anyLeft = dataToDraw.some(org => {
            const steps = cumulativeIndex[org.name] ?? 0;
            return Math.floor(steps / interplant) < org.launches.length;
        });

        if (anyLeft) {
            requestAnimationFrame(animate);
        }
    }

    // Start
    requestAnimationFrame(animate);
}

function drawCountAndMassChart(data) {
    const canvas = document.getElementById('countAndMass');
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');

    // Chart parameters
    const chartWidth = canvas.width;
    const chartHeight = 600;
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
        mass: Math.floor((cumulativeMass += d.mass)/1000) // Cumulative mass (ton)
    }));
    // Change Title spacex_title
    document.getElementById('spacex_title').textContent =
    `SpaceX Lanuches and Mass 2025 (${parsedData.length}/${Math.floor(cumulativeMass/1000)} ton)`;

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
        ctx.strokeStyle = CHART_CONFIG.COLORS.AXIS_COLOR;
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
        ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
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
        ctx.fillText('Cumulative Mass (Ton)', 0, 0);
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
            ctx.strokeStyle = CHART_CONFIG.COLORS.AXIS_COLOR;
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
            ctx.strokeStyle = CHART_CONFIG.COLORS.AXIS_COLOR;
            ctx.moveTo(chartWidth - margin.right, y);
            ctx.lineTo(chartWidth - margin.right + 5, y);
            ctx.stroke();
        }

        // Draw lines (up to visiblePoints)
        // Count line (blue)
        ctx.beginPath();
        ctx.strokeStyle = CHART_CONFIG.COLORS.COUNT_LINE;
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
        ctx.strokeStyle = CHART_CONFIG.COLORS.MASS_LINE;
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
        ctx.fillStyle = CHART_CONFIG.COLORS.COUNT_LINE;
        ctx.fillRect(chartWidth - margin.right + 25, margin.top +10, 10, 10);
        ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
        ctx.textAlign = 'left';
        ctx.fillText('Count', chartWidth - margin.right + 25, margin.top + 30);

        ctx.fillStyle = CHART_CONFIG.COLORS.MASS_LINE;
        ctx.fillRect(chartWidth - margin.right + 25, margin.top + 30, 10, 10);
        ctx.fillStyle = CHART_CONFIG.COLORS.TEXT;
        ctx.fillText('Mass', chartWidth - margin.right + 25, margin.top + 50);

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
    const spaceXJson = await loadFromJson('/f9_launches.json');
    launchesData = spaceXJson;
    drawCountAndMassChart(launchesData);
    boosterData = launchesData.map(x => { r = x['rocket'].split(/[-\.‑]/); return {name: r[0].trim(), flights: Number(r[1])}});
    drawBarChart(getSortedUniqueData(boosterData));
    const worldJson = await loadFromJson('/world_launches.json');
    drawBarChartWorld(worldJson);

});
