function updateClock() {
    // Get current time in EST
    const now = new Date();
    const estOffset = -4; // EDT offset (UTC-4)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const estDate = new Date(utc + (3600000 * estOffset));
    
    // Calculate degrees for each hand
    const secondsDegrees = ((estDate.getSeconds() / 60) * 360) + 90;
    const minutesDegrees = ((estDate.getMinutes() / 60) * 360) + ((estDate.getSeconds() / 60) * 6) + 90;
    const hoursDegrees = ((estDate.getHours() / 12) * 360) + ((estDate.getMinutes() / 60) * 30) + 90;
    
    // Update hand rotations
    document.querySelector('.second-hand').style.transform = `rotate(${secondsDegrees}deg)`;
    document.querySelector('.minute-hand').style.transform = `rotate(${minutesDegrees}deg)`;
    document.querySelector('.hour-hand').style.transform = `rotate(${hoursDegrees}deg)`;
}

// Update clock every second
setInterval(updateClock, 1000);
// Initial call to set correct position
updateClock(); 