const SCHEDULE_MWF = [
    { id: 'se-row', startMins: 18 * 60, endMins: 19 * 60, label: 'Software Engineering 2' },
    { id: 'gvc-row', startMins: 19 * 60, endMins: 20 * 60, label: 'Graphics & Visual Computing' },
    { id: 'hci-row', startMins: 20 * 60, endMins: 21 * 60, label: 'Human Computer Interaction' }
];

const SCHEDULE_TTH = [
    { id: 'ias-row', startMins: 18 * 60, endMins: 19 * 60, label: 'Information Assurance & Security' },
    { id: 'ca-row', startMins: 19 * 60, endMins: 20 * 60 + 30, label: 'Architecture and Organization' },
    { id: 'cs-row', startMins: 20 * 60 + 30, endMins: 22 * 60, label: 'Computational Science' }
];

const MWF_DAYS = [1, 3, 5];
const TTH_DAYS = [2, 4];

function getManilaTime() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    return {
        dow: now.getDay(),
        hour: now.getHours(),
        mins: now.getMinutes(),
        total: now.getHours() * 60 + now.getMinutes(),
        formatted: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        dayText: now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Manila" })
    };
}

function updateTime() {
    const t = getManilaTime();
    document.getElementById("current-time-display").textContent = t.formatted;
    document.getElementById("current-day").textContent = t.dayText;
}

function updateClassHighlight() {
    const t = getManilaTime();

    let schedule = null;
    let label = "";

    if (MWF_DAYS.includes(t.dow)) {
        schedule = SCHEDULE_MWF;
        label = "(M-W-F)";
    } else if (TTH_DAYS.includes(t.dow)) {
        schedule = SCHEDULE_TTH;
        label = "(T-TH)";
    } else {
        document.getElementById("current-sub").textContent = "No classes today.";
        document.querySelectorAll(".schedule-item").forEach(row => 
            row.classList.remove("current-class")
        );
        return;
    }

    document.getElementById("current-sub").textContent = `Class Day ${label}`;

    document.querySelectorAll(".schedule-item").forEach(row =>
        row.classList.remove("current-class")
    );

    let active = schedule.find(s => t.total >= s.startMins && t.total < s.endMins);

    if (active) {
        document.getElementById(active.id).classList.add("current-class");
        document.getElementById("current-sub").textContent = "Now Running — " + active.label;
    } else {
        document.getElementById("current-sub").textContent = `Today's Schedule ${label}`;
    }
}

setInterval(updateTime, 1000);
setInterval(updateClassHighlight, 8000);

updateTime();
updateClassHighlight();
