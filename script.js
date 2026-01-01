// แก้จาก Function เป็น function (ตัวเล็ก) เพื่อให้ Captcha เรียกใช้งานได้
function onCaptchaSuccess(token) {
    console.log("Captcha Verified!");
    const btn = document.getElementById('btnBypass');
    if (btn) {
        btn.disabled = false; // ปลดล็อกปุ่มเมื่อติ๊กถูกสำเร็จ
        btn.style.opacity = "1";
    }
}

async function startBypass() {
    const targetUrl = document.getElementById('targetUrl').value;
    const btn = document.getElementById('btnBypass');
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');

    if (!targetUrl) return alert("Please enter a URL!");

    // ตรวจสอบว่าไฟล์ config.js โหลดมาจริงไหม
    if (typeof XEO_CONFIG === 'undefined') {
        alert("Error: config.js not found. Please check your files.");
        return;
    }

    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        // ดึงค่า BASE_URL และ API_KEY จากไฟล์ config ที่คุณเตรียมไว้
        const fetchUrl = `${XEO_CONFIG.BASE_URL}?key=${XEO_CONFIG.API_KEY}&url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(fetchUrl);
        const result = await response.json();

        resultBox.classList.remove('hidden');
        
        if (response.ok && result.status === "success") {
            resultBox.style.borderColor = "#ccff00";
            resultText.innerText = result.destination || JSON.stringify(result);
            btn.innerText = "Bypass Now";
            resultBox.scrollIntoView({ behavior: 'smooth' });
        } else {
            const errorMsg = result.message || result.error || "Unknown API Error";
            resultBox.style.borderColor = "#ff4444";
            resultText.innerText = `Error ${response.status}: ${errorMsg}`;
            btn.innerText = "Try Again";
        }
    } catch (err) {
        alert("Connection Failed: Cannot reach Xeo Bypass API.");
        btn.innerText = "Bypass Now";
    } finally {
        if (typeof turnstile !== 'undefined') {
            turnstile.reset();
            btn.disabled = true; // บังคับให้ติ๊ก Captcha ใหม่เพื่อความปลอดภัย
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
