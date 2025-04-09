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
        
        // Update map marker times
        updateMapMarker(cityTime, city);
    }
}

// Add new function to update map markers
function updateMapMarker(time, cityId) {
    // Format time for map marker display
    const displayHours = time.getHours().toString().padStart(2, '0');
    const displayMinutes = time.getMinutes().toString().padStart(2, '0');
    const displaySeconds = time.getSeconds().toString().padStart(2, '0');
    const timeString = `${displayHours}:${displayMinutes}:${displaySeconds}`;
    
    // Find the marker for this city
    const marker = document.querySelector(`.${cityId}-marker .marker-time`);
    if (marker) {
        marker.textContent = timeString;
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
    
    // Add interactive features to map markers
    setupMapMarkerInteractions();
}

// Add map marker interactions
function setupMapMarkerInteractions() {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        const city = marker.getAttribute('data-city');
        
        marker.addEventListener('mouseenter', () => {
            // Highlight the corresponding clock
            const clockElement = document.querySelector(`.${city}-clock`);
            if (clockElement) {
                clockElement.classList.add('highlight-clock');
                
                // Scroll to the clock if it's out of view
                clockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        marker.addEventListener('mouseleave', () => {
            // Remove highlight
            const clockElement = document.querySelector(`.${city}-clock`);
            if (clockElement) {
                clockElement.classList.remove('highlight-clock');
            }
        });
    });
}

// Start when the page is fully loaded
window.addEventListener('load', initializeClocks);

// Update map marker times
function updateMapMarkers() {
    const cities = ['london', 'newyork', 'sanfrancisco', 'tokyo', 'beijing', 'newdelhi'];
    cities.forEach(city => {
        const marker = document.querySelector(`.${city}-marker`);
        if (marker) {
            const timeElement = marker.querySelector('.marker-time');
            const time = getCityTime(city);
            timeElement.textContent = time;
        }
    });
}

// Add hover effects for map markers
function setupMapMarkerInteractions() {
    const markers = document.querySelectorAll('.map-marker');
    markers.forEach(marker => {
        const city = marker.dataset.city;
        
        marker.addEventListener('mouseenter', () => {
            const clock = document.querySelector(`.${city}-clock`);
            if (clock) {
                clock.classList.add('highlight-clock');
                clock.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        marker.addEventListener('mouseleave', () => {
            const clock = document.querySelector(`.${city}-clock`);
            if (clock) {
                clock.classList.remove('highlight-clock');
            }
        });
    });
}

// Initialize map functionality
setupMapMarkerInteractions();

// Update map markers every second
setInterval(updateMapMarkers, 1000); 