const SCHEDULE = [
    { id: 'se-row', startMins: 18 * 60, endMins: 19 * 60, label: 'Software Engineering 2' },
    { id: 'gvc-row', startMins: 19 * 60, endMins: 20 * 60, label: 'Graphics & Visual Computing' }
];

const CLASS_DAYS = [1, 3, 5];

const MANILA_TZ = 'Asia/Manila';

const manilaFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: MANILA_TZ,
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
});

function getManilaTimeData() {
    const parts = manilaFormatter.formatToParts(new Date());
    const data = {};
    
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    
    const nowManila = new Date(`${year}/${month}/${day} ${new Date().toLocaleTimeString('en-US', { timeZone: MANILA_TZ })}`);
    
    data.dow = nowManila.getDay();
    data.dayName = parts.find(p => p.type === 'weekday').value;
    data.hours = nowManila.getHours();
    data.mins = nowManila.getMinutes();
    data.totalMins = data.hours * 60 + data.mins;
    
    data.timeString = nowManila.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    
    return data;
}

function updateTimeDisplay() {
    const data = getManilaTimeData();
    const timeEl = document.getElementById('current-time-display');
    const dayEl = document.getElementById('current-day');
    
    timeEl.textContent = data.timeString;
    dayEl.textContent = data.dayName;
}

function updateScheduleStatus() {
    const data = getManilaTimeData();
    const dow = data.dow;
    const totalMins = data.totalMins;
    const isClassDay = CLASS_DAYS.includes(dow);
    const subEl = document.getElementById('current-sub');

    document.querySelectorAll('.schedule-item').forEach(r => {
        r.classList.remove('current-class');
        r.removeAttribute('aria-current');
    });
    const timeDisplayEl = document.getElementById('current-time-display');
    timeDisplayEl.classList.remove('glow');
    subEl.textContent = isClassDay ? 'Class day — check the active slot below.' : 'No classes scheduled today.';

    if (!isClassDay) return;

    for (const entry of SCHEDULE) {
        if (totalMins >= entry.startMins && totalMins < entry.endMins) {
            const row = document.getElementById(entry.id);
            if (row) {
                row.classList.add('current-class');
                row.setAttribute('aria-current', 'true');
                
                timeDisplayEl.classList.add('glow');
                
                subEl.textContent = `Now running — ${entry.label}`;
                
                break; 
            }
        }
    }
}

updateTimeDisplay();
updateScheduleStatus();

setInterval(updateTimeDisplay, 1000);
setInterval(updateScheduleStatus, 15000);

document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('user-tabbed');
}, { once: true });
