const SERVER_URL = 'server.php';
const TICK_RATE = 20;
const SPEED_PX = 10;

const workLayer = document.getElementById('work');
const animArea = document.getElementById('anim');
const square = document.getElementById('square');
const logDiv = document.getElementById('msg_log');
const tableContainer = document.getElementById('table_container');

const btnPlay = document.getElementById('btn_play');
const btnClose = document.getElementById('btn_close');
const btnStart = document.getElementById('btn_start');
const btnStop = document.getElementById('btn_stop');
const btnReload = document.getElementById('btn_reload');

let timer = null;
let eventCount = 0;
let x = 0, y = 0;
let dx = 0, dy = 0;
let animW = 0, animH = 0;

btnPlay.onclick = () => {
    workLayer.style.display = 'block';
    fetch(SERVER_URL + '?action=clear');
    localStorage.removeItem('lab7_events');
    tableContainer.innerHTML = '';
    resetGame();
};

btnClose.onclick = async () => {
    stopAnim();
    workLayer.style.display = 'none';
    await syncLocalStorage();
    renderComparisonTable();
};

btnStart.onclick = () => {
    logEvent("Button Start Clicked");
    startAnim();
    updateButtons('run');
};

btnStop.onclick = () => {
    logEvent("Button Stop Clicked");
    stopAnim();
    updateButtons('stop');
};

btnReload.onclick = () => {
    logEvent("Button Reload Clicked");
    resetGame();
    updateButtons('init');
};

function updateButtons(state) {
    btnStart.style.display = (state === 'init' || state === 'stop') ? 'block' : 'none';
    btnStop.style.display = (state === 'run') ? 'block' : 'none';
    btnReload.style.display = (state === 'end') ? 'block' : 'none';
}

function resetGame() {
    animW = animArea.clientWidth;
    animH = animArea.clientHeight;
    
    x = Math.random() * (animW - 20);
    y = 0;
    
    dx = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1) * SPEED_PX;
    dy = Math.abs(Math.random() * 2 + 1) * SPEED_PX;

    square.style.left = x + 'px';
    square.style.top = y + 'px';
    square.style.display = 'block';
    
    eventCount = 0;
    logDiv.innerHTML = '';
}

function startAnim() {
    if (timer) return;
    timer = setInterval(update, TICK_RATE);
}

function stopAnim() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function update() {
    x += dx;
    y += dy;
    let msg = "Step";

    if (x <= 0) {
        x = 0; dx = -dx;
        msg = "Hit Left Wall";
    } else if (x >= animW - 10) {
        x = animW - 10; dx = -dx;
        msg = "Hit Right Wall";
    }

    if (y > animH) {
        stopAnim();
        square.style.display = 'none';
        updateButtons('end');
        logEvent("Exited Anim Area");
        return;
    }

    square.style.left = x + 'px';
    square.style.top = y + 'px';

    logEvent(msg);
}

function logEvent(msg) {
    eventCount++;
    const now = Date.now();
    
    const logItem = document.createElement('div');
    logItem.textContent = `#${eventCount} ${msg}`;
    logDiv.prepend(logItem);

    fetch(SERVER_URL + '?action=save_immediate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: eventCount,
            msg: msg,
            time: now
        })
    }).catch(err => console.error(err));

    const lsData = JSON.parse(localStorage.getItem('lab7_events') || '[]');
    lsData.push({
        id: eventCount,
        msg: msg,
        time: now,
        saved_at: Date.now()
    });
    localStorage.setItem('lab7_events', JSON.stringify(lsData));
}

async function syncLocalStorage() {
    const lsData = JSON.parse(localStorage.getItem('lab7_events') || '[]');
    if (lsData.length === 0) return;

    try {
        await fetch(SERVER_URL + '?action=save_batch', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(lsData)
        });
    } catch (e) {
        console.error(e);
    }
}

async function renderComparisonTable() {
    const localData = JSON.parse(localStorage.getItem('lab7_events') || '[]');
    
    let serverData = [];
    try {
        const response = await fetch(SERVER_URL + '?action=get');
        serverData = await response.json();
    } catch (e) {
        console.error(e);
    }

    const serverImmediate = serverData.filter(item => item.mode === 'immediate');

    let html = `
    <h4>Результати (Блок 5)</h4>
    <table class="comparison-table">
        <thead>
            <tr>
                <th colspan="2">LocalStorage (Клієнт)</th>
                <th colspan="2">Server Immediate (Миттєво)</th>
            </tr>
            <tr>
                <th>ID - Msg</th>
                <th>Time</th>
                <th>Server Time (Recv)</th>
                <th>Lag (ms)</th>
            </tr>
        </thead>
        <tbody>`;

    const maxLen = Math.max(localData.length, serverImmediate.length);

    for (let i = 0; i < maxLen; i++) {
        const localItem = localData[i] || { id: '-', msg: '-', time: 0 };
        const serverItem = serverImmediate.find(it => it.id == localItem.id) || null;

        let serverTimeStr = "-";
        let lag = "-";
        
        if (serverItem) {
            const sTime = parseFloat(serverItem.server_time);
            serverTimeStr = new Date(sTime).toLocaleTimeString();
            lag = (sTime - localItem.time).toFixed(1);
        }

        html += `
        <tr>
            <td><b>#${localItem.id}</b> ${localItem.msg}</td>
            <td>${new Date(localItem.time).toLocaleTimeString()}</td>
            <td>${serverTimeStr}</td>
            <td style="color: ${lag > 100 ? 'red' : 'green'}">${lag}</td>
        </tr>
        `;
    }

    html += `</tbody></table>`;
    tableContainer.innerHTML = html;
}