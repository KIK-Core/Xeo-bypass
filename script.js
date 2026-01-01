function onCaptchaSuccess(token) {
    console.log("Captcha Verified!");
    const btn = document.getElementById('btnBypass');
    if (btn) {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

async function startBypass() {
    const targetUrl = document.getElementById('targetUrl').value;
    const btn = document.getElementById('btnBypass');
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');

    if (!targetUrl) return alert("Please enter a URL!");
    if (typeof XEO_CONFIG === 'undefined') return alert("Error: config.js not found.");

    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        // สร้าง URL สำหรับ Fetch (ตรวจสอบใน config.js ว่ามี /bypass หรือยัง)
        const fetchUrl = `${XEO_CONFIG.BASE_URL}?key=${XEO_CONFIG.API_KEY}&url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(fetchUrl);
        const result = await response.json();

        resultBox.classList.remove('hidden');
        
        // ตรวจสอบ status "success" ที่เราตั้งค่าไว้ใน API
        if (response.ok && result.status === "success") {
            resultBox.style.borderColor = "#ccff00";
            // ดึงค่า destination มาแสดงผล
            resultText.innerText = result.destination; 
            btn.innerText = "Bypass Now";
            resultBox.scrollIntoView({ behavior: 'smooth' });
        } else {
            const errorMsg = result.message || result.error || "Bypass Failed";
            resultBox.style.borderColor = "#ff4444";
            resultText.innerText = `Error: ${errorMsg}`;
            btn.innerText = "Try Again";
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Connection Failed: Cannot reach Xeo Bypass API.");
        btn.innerText = "Bypass Now";
    } finally {
        if (typeof turnstile !== 'undefined') {
            turnstile.reset();
            btn.disabled = true;
        }
    }
}

function copyResult() {
    const text = document.getElementById('resultText').innerText;
    if (!text || text.includes("Error")) return;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    });
}
