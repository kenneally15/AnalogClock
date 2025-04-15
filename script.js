// Time zone offsets in hours from UTC
const timeZones = {
    london: 0,      // GMT/UTC
    newyork: -4,    // EDT (UTC-4)
    sanfrancisco: -7, // PDT (UTC-7)
    tokyo: 9,       // JST (UTC+9)
    beijing: 8,     // CST (UTC+8)
    newdelhi: 5.5   // IST (UTC+5:30)
};

// Initialize transition state
let transitionsActive = true;

// Set smooth transitions initially
function initializeTransitions() {
    document.querySelectorAll('.second-hand').forEach(hand => {
        // Remove transition for second hand to allow continuous movement
        hand.style.transition = 'none';
    });
    
    document.querySelectorAll('.minute-hand, .hour-hand').forEach(hand => {
        hand.style.transition = 'transform 0.2s cubic-bezier(0.4, 1.7, 0.3, 0.8)';
    });
}

// Fix for transition issue at second 0/60
function handleSecondTransition() {
    // This function is no longer needed for the second hand since we're using continuous motion
    // We keep it empty to avoid breaking existing code references
}

function updateClocks() {
    const now = new Date();
    
    // Update local time clock
    updateClock(now, 'local');
    
    // Update each city clock with its timezone
    for (const [city, offset] of Object.entries(timeZones)) {
        // Calculate time for this timezone
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utc + (3600000 * offset));
        updateClock(cityTime, city);
    }
}

function updateClock(time, clockId) {
    // Calculate precise degrees for each hand
    const seconds = time.getSeconds() + (time.getMilliseconds() / 1000);
    const minutes = time.getMinutes() + (seconds / 60);
    const hours = (time.getHours() % 12) + (minutes / 60);
    
    // Calculate rotations without the 90 degree offset
    const secondsDegrees = (seconds / 60) * 360;
    const minutesDegrees = (minutes / 60) * 360;
    const hoursDegrees = (hours / 12) * 360;
    
    const clockSelector = clockId === 'local' ? '.local-clock' : `.${clockId}-clock`;
    
    // Update hand rotations
    document.querySelector(`${clockSelector} .second-hand`).style.transform = `rotate(${secondsDegrees}deg)`;
    document.querySelector(`${clockSelector} .minute-hand`).style.transform = `rotate(${minutesDegrees}deg)`;
    document.querySelector(`${clockSelector} .hour-hand`).style.transform = `rotate(${hoursDegrees}deg)`;
    
    // Format time for digital display
    const displayHours = time.getHours().toString().padStart(2, '0');
    const displayMinutes = time.getMinutes().toString().padStart(2, '0');
    const displaySeconds = time.getSeconds().toString().padStart(2, '0');
    const timeString = `${displayHours}:${displayMinutes}:${displaySeconds}`;
    
    // Update digital time display - update selector to find adjacent element
    const clockWrapper = document.querySelector(`${clockSelector}`).parentElement;
    clockWrapper.querySelector('.digital-time').textContent = timeString;
}

// Add a small visual ticking effect to the second hands
function addTickEffect() {
    // Remove ticking effect for smooth continuous motion
}

// Setup and start the clocks
function initializeClocks() {
    // Set initial transitions
    initializeTransitions();
    
    // Handle transition edge case for minute and hour hands
    handleSecondTransition();
    
    // Update clocks frequently for smooth second hand motion
    setInterval(updateClocks, 16); // ~60fps for smooth animation
    
    // Initial call to set correct positions
    updateClocks();
}

// Function to create a new clock element
function createClockElement(cityName, timezoneOffset) {
    const clockWrapper = document.createElement('div');
    clockWrapper.className = 'clock-wrapper';
    
    const sanitizedCityName = cityName.toLowerCase().replace(/\s+/g, '');
    
    clockWrapper.innerHTML = `
        <h2>${cityName}</h2>
        <div class="clock ${sanitizedCityName}-clock">
            <div class="hand hour-hand"></div>
            <div class="hand minute-hand"></div>
            <div class="hand second-hand"></div>
            <div class="center-dot"></div>
            <div class="number number1">1</div>
            <div class="number number2">2</div>
            <div class="number number3">3</div>
            <div class="number number4">4</div>
            <div class="number number5">5</div>
            <div class="number number6">6</div>
            <div class="number number7">7</div>
            <div class="number number8">8</div>
            <div class="number number9">9</div>
            <div class="number number10">10</div>
            <div class="number number11">11</div>
            <div class="number number12">12</div>
        </div>
        <div class="digital-time">00:00:00</div>
        <div class="timezone">GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}</div>
    `;
    
    return clockWrapper;
}

// Function to handle adding a new clock
function handleAddClock() {
    const addClockBtn = document.getElementById('addClockBtn');
    const addClockForm = document.getElementById('addClockForm');
    const cityNameInput = document.getElementById('cityName');
    const timezoneOffsetInput = document.getElementById('timezoneOffset');
    const submitBtn = addClockForm.querySelector('.submit-clock-btn');
    
    // Toggle form visibility
    addClockBtn.addEventListener('click', () => {
        addClockForm.style.display = addClockForm.style.display === 'none' ? 'flex' : 'none';
    });
    
    // Handle form submission
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const cityName = cityNameInput.value.trim();
        const timezoneOffset = parseFloat(timezoneOffsetInput.value);
        
        if (cityName && !isNaN(timezoneOffset)) {
            // Add to timeZones object
            timeZones[cityName.toLowerCase().replace(/\s+/g, '')] = timezoneOffset;
            
            // Create and add new clock
            const newClock = createClockElement(cityName, timezoneOffset);
            document.querySelector('.clocks-grid').appendChild(newClock);
            
            // Reset form
            cityNameInput.value = '';
            timezoneOffsetInput.value = '';
            addClockForm.style.display = 'none';
            
            // Update transitions for new clock
            initializeTransitions();
        }
    });
}

// Initialize add clock functionality
handleAddClock();

// Start when the page is fully loaded
window.addEventListener('load', initializeClocks); 