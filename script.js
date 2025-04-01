function updateClock() {
    const now = new Date();
    
    // Calculate degrees for each hand
    const secondsDegrees = ((now.getSeconds() / 60) * 360) + 90;
    const minutesDegrees = ((now.getMinutes() / 60) * 360) + ((now.getSeconds() / 60) * 6) + 90;
    const hoursDegrees = ((now.getHours() / 12) * 360) + ((now.getMinutes() / 60) * 30) + 90;
    
    // Update hand rotations
    document.querySelector('.second-hand').style.transform = `rotate(${secondsDegrees}deg)`;
    document.querySelector('.minute-hand').style.transform = `rotate(${minutesDegrees}deg)`;
    document.querySelector('.hour-hand').style.transform = `rotate(${hoursDegrees}deg)`;
}

// Update clock every second
setInterval(updateClock, 1000);
// Initial call to set correct position
updateClock(); 