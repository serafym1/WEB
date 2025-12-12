const displayContainer = document.getElementById('content-display');
const lastUpdateSpan = document.getElementById('last-update');

async function loadData() {
    try {
        // Асинхронний запит (GET)
        const response = await fetch('server.php?t=' + Date.now()); // Date.now() щоб уникнути кешування браузером
        if (!response.ok) throw new Error("Помилка мережі");

        const data = await response.json();
        renderHTML(data);
        const now = new Date();
        lastUpdateSpan.innerText = now.toLocaleTimeString();

    } catch (error) {
        console.error('Error loading data:', error);
        displayContainer.innerHTML = "<p style='color:red'>Не вдалося отримати дані з сервера.</p>";
    }
}

function renderHTML(dataArray) {
    displayContainer.innerHTML = '';

    if (dataArray.length === 0) {
        displayContainer.innerHTML = '<p>Список порожній.</p>';
        return;
    }

    dataArray.forEach(item => {
    const card = document.createElement('div');
    card.className = 'animal-card';
    
    if (item.size === 'large') {
        card.style.fontSize = "1.2em";
        card.style.backgroundColor = "#e3f2fd";
        card.style.minHeight = "200px";
    } else if (item.size === 'small') {
        card.style.fontSize = "0.9em";
        card.style.minHeight = "50px";
    }

    const title = document.createElement('h3');
    title.textContent = item.name;
    
    const desc = document.createElement('p');
    desc.textContent = item.description;

    card.appendChild(title);
    card.appendChild(desc);
    displayContainer.appendChild(card);
});
}
loadData();
setInterval(loadData, 3000);