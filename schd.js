const SCHEDULE_MWF = [
    { id: 'se-row', startMins: 18 * 60, endMins: 19 * 60, label: 'Software Engineering 2' },
    { id: 'gvc-row', startMins: 19 * 60, endMins: 20 * 60, label: 'Graphics & Visual Computing' },
    { id: 'hci-row', startMins: 20 * 60, endMins: 21 * 60, label: 'Human Computer Interaction' }
];

const SCHEDULE_TTH = [
    { id: 'ias-row', startMins: 18 * 60, endMins: 19 * 60, label: 'Information Assurance & Security' },
    { id: 'ca-row', startMins: 19 * 60, endMins: 20 * 60, label: 'Architecture and Organization' },
    { id: 'cs-row', startMins: 20 * 60, endMins: 21 * 60, label: 'Computational Science' }
];

const MWF_DAYS = [1, 3, 5];
const TTH_DAYS = [2, 4];

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
    
    const nowManila = new Date(new Date().toLocaleString('en-US', { timeZone: MANILA_TZ }));
    
    data.dow = nowManila.getDay();
    data.dayName = parts.find(p => p.type === 'weekday').value;
    data.hours = nowManila.getHours();
    data.mins = nowManila.getMinutes();
    data.totalMins = data.hours * 60 + data.mins;
    
    data.timeString = nowManila.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: MANILA_TZ
    });
    
    return data;
}

function updateTimeDisplay() {
    const data = getManilaTimeData();
    document.getElementById('current-time-display').textContent = data.timeString;
    document.getElementById('current-day').textContent = data.dayName;
}

function updateScheduleStatus() {
    const data = getManilaTimeData();
    const dow = data.dow;
    const totalMins = data.totalMins;
    const subEl = document.getElementById('current-sub');

    let activeSchedule = null;
    let dayGroupName = '';
    
    if (MWF_DAYS.includes(dow)) {
        activeSchedule = SCHEDULE_MWF;
        dayGroupName = 'M-W-F';
    } else if (TTH_DAYS.includes(dow)) {
        activeSchedule = SCHEDULE_TTH;
        dayGroupName = 'T-TH';
    }

    document.querySelectorAll('.schedule-item').forEach(r => {
        r.classList.remove('current-class');
    });

    const timeDisplayEl = document.getElementById('current-time-display');
    timeDisplayEl.classList.remove('glow');

    if (!activeSchedule) {
        subEl.textContent = 'No classes scheduled today.';
        return;
    }

    subEl.textContent = `${dayGroupName} Class day — check the active slot below.`;

    let classFound = false;
    for (const entry of activeSchedule) {
        if (totalMins >= entry.startMins && totalMins < entry.endMins) {
            const row = document.getElementById(entry.id);
            if (row) {
                row.classList.add('current-class');
                timeDisplayEl.classList.add('glow');
                subEl.textContent = `Now running — ${entry.label}`;
                classFound = true;
                break;
            }
        }
    }

    if (!classFound) {
        const last = activeSchedule[activeSchedule.length - 1];
        if (totalMins >= last.endMins) {
            subEl.textContent = `Classes concluded for ${dayGroupName} today.`;
        }
    }
}

updateTimeDisplay();
updateScheduleStatus();

setInterval(updateTimeDisplay, 1000);
setInterval(updateScheduleStatus, 15000);
