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
    
    // Calculate rotations with 90 degree offset (12 o'clock is at 90 degrees)
    const secondsDegrees = (seconds / 60) * 360 + 90;
    const minutesDegrees = (minutes / 60) * 360 + 90;
    const hoursDegrees = (hours / 12) * 360 + 90;
    
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
    
    // Update digital time display
    document.querySelector(`${clockSelector} .digital-time`).textContent = timeString;
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

// Start when the page is fully loaded
window.addEventListener('load', initializeClocks); 