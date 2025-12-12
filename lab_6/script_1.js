let count = 0;
const container = document.getElementById('form-container');

async function loadInitialData() {
    try {
        const response = await fetch('server.php?t=' + Date.now());
        
        if (response.ok) {
            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    addBlock(item.name, item.description, item.size);
                });
            } else {
                addBlock(); 
            }
        }
    } catch (error) {
        addBlock();
    }
}

function addBlock(savedName = '', savedDesc = '', savedSize = 'medium') {
    count++;
    
    const div = document.createElement('div');
    div.className = 'animal-input-group';
    
    div.innerHTML = `
        <label>Тварина ${count}:</label>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <input type="text" class="animal-name" placeholder="Назва (обов'язково для заповнення)" value="${savedName}">
            
            <select class="animal-size">
                <option value="small" ${savedSize === 'small' ? 'selected' : ''}>Маленька</option>
                <option value="medium" ${savedSize === 'medium' ? 'selected' : ''}>Середня</option>
                <option value="large" ${savedSize === 'large' ? 'selected' : ''}>Велика</option>
            </select>
        </div>
        
        <textarea class="animal-desc" placeholder="Опис...">${savedDesc}</textarea>
        <button onclick="removeBlock(this)">Видалити</button>
    `;
    
    container.appendChild(div);
}

function removeBlock(button) {
    button.parentElement.remove();
}

async function saveData() {
    const statusMsg = document.getElementById('status_msg');
    const groups = document.querySelectorAll('.animal-input-group');
    const dataToSave = [];

    groups.forEach(group => {
        const name = group.querySelector('.animal-name').value;
        const desc = group.querySelector('.animal-desc').value;
        const size = group.querySelector('.animal-size').value;
        
        if(name.trim() !== "") {
            dataToSave.push({ name: name, description: desc, size: size });
        }
    });

    try {
        const response = await fetch('server.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave)
        });

        const result = await response.json();
        statusMsg.innerText = result.message;
        statusMsg.style.color = "green";
        
        setTimeout(() => { statusMsg.innerText = ""; }, 3000);

    } catch (error) {
        console.error('Error:', error);
        statusMsg.innerText = "Помилка збереження";
        statusMsg.style.color = "red";
    }
}

window.onload = loadInitialData;