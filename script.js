let is24HourFormat = true;
let currentTimezone = 'local';
let timerInterval;
let alarmTimes = [];
let stopwatchInterval;
let stopwatchStartTime;
let stopwatchElapsedTime = 0;
let stopwatchRunning = false;

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (!is24HourFormat) {
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
    }
    hours = String(hours).padStart(2, '0');

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('milliseconds').textContent = milliseconds;
    document.getElementById('ampm').textContent = is24HourFormat ? '' : ampm;

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('date').textContent = currentDate;

    checkAlarms();
}

function toggleFormat() {
    is24HourFormat = !is24HourFormat;
    updateClock();
}

function changeTimezone(event) {
    currentTimezone = event.target.value;
    updateClock();
}

function startTimer() {
    const timerInput = document.getElementById('timer-input').value;
    const [hours, minutes, seconds] = timerInput.split(':').map(Number);
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            alert('Timer Ended!');
            return;
        }

        totalSeconds--;
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');

        document.getElementById('timer-hours').textContent = hrs;
        document.getElementById('timer-minutes').textContent = mins;
        document.getElementById('timer-seconds').textContent = secs;
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer-hours').textContent = '00';
    document.getElementById('timer-minutes').textContent = '00';
    document.getElementById('timer-seconds').textContent = '00';
    document.getElementById('timer-input').value = '';
}

function setAlarm() {
    const alarmTime = document.getElementById('alarm-time').value;
    alarmTimes.push(alarmTime);
    updateAlarmList();
}

function updateAlarmList() {
    const alarmList = document.getElementById('alarmList');
    alarmList.innerHTML = '';

    alarmTimes.forEach((time, index) => {
        const alarmItem = document.createElement('div');
        alarmItem.className = 'alarm-item';
        alarmItem.textContent = time;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            alarmTimes.splice(index, 1);
            updateAlarmList();
        };

        alarmItem.appendChild(deleteButton);
        alarmList.appendChild(alarmItem);
    });
}

function checkAlarms() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    if (alarmTimes.includes(currentTime)) {
        document.getElementById('alarmSound').play();
        alert('Alarm ringing!');
    }
}

function startStopwatch() {
    if (stopwatchRunning) return;
    stopwatchRunning = true;
    stopwatchStartTime = Date.now() - stopwatchElapsedTime;
    stopwatchInterval = setInterval(updateStopwatch, 10);
}

function stopStopwatch() {
    if (!stopwatchRunning) return;
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchElapsedTime = Date.now() - stopwatchStartTime;
}

function resetStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchElapsedTime = 0;
    document.getElementById('stopwatch-hours').textContent = '00';
    document.getElementById('stopwatch-minutes').textContent = '00';
    document.getElementById('stopwatch-seconds').textContent = '00';
    document.getElementById('stopwatch-milliseconds').textContent = '000';
    document.getElementById('stopwatchLaps').innerHTML = '';
}

function lapStopwatch() {
    if (!stopwatchRunning) return;
    const lapTime = document.getElementById('stopwatch-hours').textContent + ':' +
        document.getElementById('stopwatch-minutes').textContent + ':' +
        document.getElementById('stopwatch-seconds').textContent + ':' +
        document.getElementById('stopwatch-milliseconds').textContent;
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.textContent = lapTime;
    document.getElementById('stopwatchLaps').appendChild(lapItem);
}

function updateStopwatch() {
    const elapsedTime = Date.now() - stopwatchStartTime;
    const hours = String(Math.floor(elapsedTime / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedTime % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(elapsedTime % 1000).padStart(3, '0');

    document.getElementById('stopwatch-hours').textContent = hours;
    document.getElementById('stopwatch-minutes').textContent = minutes;
    document.getElementById('stopwatch-seconds').textContent = seconds;
    document.getElementById('stopwatch-milliseconds').textContent = milliseconds;
}

document.getElementById('toggleFormat').addEventListener('click', toggleFormat);
document.getElementById('timezone').addEventListener('change', changeTimezone);

document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);

document.getElementById('setAlarm').addEventListener('click', setAlarm);

document.getElementById('startStopwatch').addEventListener('click', startStopwatch);
document.getElementById('stopStopwatch').addEventListener('click', stopStopwatch);
document.getElementById('resetStopwatch').addEventListener('click', resetStopwatch);
document.getElementById('lapStopwatch').addEventListener('click', lapStopwatch);

document.getElementById('clockMode').addEventListener('click', () => {
    document.getElementById('clock-container').classList.remove('hidden');
    document.getElementById('timer-container').classList.add('hidden');
    document.getElementById('alarm-container').classList.add('hidden');
    document.getElementById('stopwatch-container').classList.add('hidden');
});

document.getElementById('timerMode').addEventListener('click', () => {
    document.getElementById('clock-container').classList.add('hidden');
    document.getElementById('timer-container').classList.remove('hidden');
    document.getElementById('alarm-container').classList.add('hidden');
    document.getElementById('stopwatch-container').classList.add('hidden');
});

document.getElementById('alarmMode').addEventListener('click', () => {
    document.getElementById('clock-container').classList.add('hidden');
    document.getElementById('timer-container').classList.add('hidden');
    document.getElementById('alarm-container').classList.remove('hidden');
    document.getElementById('stopwatch-container').classList.add('hidden');
});

document.getElementById('stopwatchMode').addEventListener('click', () => {
    document.getElementById('clock-container').classList.add('hidden');
    document.getElementById('timer-container').classList.add('hidden');
    document.getElementById('alarm-container').classList.add('hidden');
    document.getElementById('stopwatch-container').classList.remove('hidden');
});

setInterval(updateClock, 10);
updateClock();
