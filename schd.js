// Define the class schedule times in 24-hour format
const SCHEDULE = [
    { id: 'se-row', start: 18, end: 19 }, // 6:00 PM to 7:00 PM
    { id: 'gvc-row', start: 19, end: 20 }  // 7:00 PM to 8:00 PM
];

// Days of the week where classes run (1=Monday, 3=Wednesday, 5=Friday)
const CLASS_DAYS = [1, 3, 5]; 

function updateScheduleStatus() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHour = now.getHours();
    
    // 1. Reset all highlights
    document.querySelectorAll('.schedule-item').forEach(row => {
        row.classList.remove('current-class');
    });

    // 2. Check if it's a class day (MWF)
    const isClassDay = CLASS_DAYS.includes(dayOfWeek);

    // 3. Update Current Day display
    const dayDisplay = document.getElementById('current-day');
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (isClassDay) {
        dayDisplay.textContent = `${dayName} - Class Day!`;
    } else {
        dayDisplay.textContent = `${dayName} - No Classes Scheduled.`;
    }

    // 4. Highlight the current class
    if (isClassDay) {
        SCHEDULE.forEach(item => {
            // Check if current hour is within the class time range
            if (currentHour >= item.start && currentHour < item.end) {
                const row = document.getElementById(item.id);
                if (row) {
                    row.classList.add('current-class');
                }
            }
        });
    }
}

function updateTimeDisplay() {
    const now = new Date();
    
    // Get formatted time (e.g., 10:30:00 AM)
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    });

    const timeDisplay = document.getElementById('current-time-display');
    timeDisplay.textContent = timeString;
}

// Initial calls
updateTimeDisplay();
updateScheduleStatus();

// Update every second (1000ms)
setInterval(updateTimeDisplay, 1000);

// Update status every minute (60000ms) to check for class change
setInterval(updateScheduleStatus, 60000);