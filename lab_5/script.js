// --- 1. SWAP CONTENT LOGIC (Executed on Load) ---
function swapContent() {
    // Swap Header and Footer
    const head = document.getElementById('header_desc');
    const foot = document.getElementById('footer_desc');
    const tempText = head.innerHTML;
    head.innerHTML = foot.innerHTML;
    foot.innerHTML = tempText;

    // Swap Block 3 and Block 6
    const block3 = document.getElementById('div_3');
    const block6 = document.getElementById('div_6');
    const tempBlock = block3.innerHTML;
    block3.innerHTML = block6.innerHTML;
    block6.innerHTML = tempBlock;
}


// --- 2. IMAGE LOGIC (With LocalStorage) ---

function showImageForm() {
    document.getElementById('img_form_block').style.display = 'block';
}

function renderImage(url) {
    const container = document.getElementById('img_output_container');
    
    const wrapper = document.createElement('div');
    wrapper.style.margin = "10px 0";
    wrapper.style.borderBottom = "1px solid #ccc";

    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '100%';
    img.style.display = 'block';
    
    const delBtn = document.createElement('button');
    delBtn.innerText = "Delete this image";
    delBtn.onclick = function() {
        wrapper.remove();
        updateImageStorage(); 
    };

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    container.appendChild(wrapper);
}

function updateImageStorage() {
    const container = document.getElementById('img_output_container');
    const images = container.querySelectorAll('img');
    const urls = [];
    images.forEach(img => urls.push(img.src));
    localStorage.setItem('savedImages', JSON.stringify(urls));
}

function loadImages() {
    const stored = localStorage.getItem('savedImages');
    if (stored) {
        const urls = JSON.parse(stored);
        urls.forEach(url => renderImage(url));
    }
}

function addImage() {
    const url = document.getElementById('img_url_input').value;
    if(!url) return;
    
    renderImage(url);       
    updateImageStorage();   
}


// --- 3. TRAPEZOID AREA (Block 5) ---
const trap_a = 10, trap_b = 20, trap_h = 5;

function calculateTrapezoid() {
    const area = ((trap_a + trap_b) / 2) * trap_h;
    document.getElementById('trapezoid_result').innerText = `Trapezoid Area: ${area}`;
}


// --- 4. CAPITALIZE (With LocalStorage) ---

function toggleCapitalize() {
    const checkbox = document.getElementById('capitalize_check');
    const textBlock = document.getElementById('block_4_text');
    
    // Apply style
    const isChecked = checkbox.checked;
    textBlock.style.textTransform = isChecked ? 'capitalize' : 'none';

    // Save state to LocalStorage
    localStorage.setItem('capitalizeState', isChecked);
}

function loadCapitalizeState() {
    const checkbox = document.getElementById('capitalize_check');
    const textBlock = document.getElementById('block_4_text');
    
    // Retrieve state
    const savedState = localStorage.getItem('capitalizeState');
    
    // Check if saved state is 'true' string
    if (savedState === 'true') {
        checkbox.checked = true;
        textBlock.style.textTransform = 'capitalize';
    } else {
        checkbox.checked = false;
        textBlock.style.textTransform = 'none';
    }
}


// --- 5. COOKIES & DIVISORS (Block 5) ---
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function deleteCookie(name) {
    document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

function checkCookies() {
    const savedDivisors = getCookie('divisors');
    const formBlock = document.getElementById('divisors_form_block');

    if (savedDivisors) {
        formBlock.style.display = 'none';
        const userKeep = confirm(`Cookies found: ${savedDivisors}\nDo you want to keep this data?`);

        if (userKeep) {
            alert("Cookies are present. Please reload the page if needed.");
        } else {
            deleteCookie('divisors');
            location.reload();
        }
    } else {
        formBlock.style.display = 'block';
    }
}

function calculateDivisors() {
    const input = document.getElementById('num_input');
    const num = parseInt(input.value);

    if (!num || num <= 0) {
        alert("Enter natural number");
        return;
    }

    let divisors = [];
    for (let i = 1; i <= num; i++) {
        if (num % i === 0) divisors.push(i);
    }
    const resultStr = divisors.join(', ');

    alert(`Divisors: ${resultStr}`);
    document.cookie = `divisors=${resultStr}; path=/; max-age=86400`;
    location.reload();
}


// --- INIT ---
window.onload = function() {
    swapContent();          // Content Swap
    calculateTrapezoid();   // Trapezoid
    checkCookies();         // Cookies Logic
    loadImages();           // Load Images from Storage
    loadCapitalizeState();  // Load Checkbox State from Storage
};