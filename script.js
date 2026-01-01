const SERVER_URL = ""; 

function onCaptchaPassed(token) {
    const btn = document.getElementById('btnBypass');
    btn.disabled = false;
}

async function startBypass() {
    const targetUrl = document.getElementById('targetUrl').value;
    const btn = document.getElementById('btnBypass');
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');

    if (!targetUrl) return alert("กรุณาวางลิงก์!");

    btn.innerText = "กำลังประมวลผล...";
    btn.disabled = true;

    try {
        const response = await fetch(`${SERVER_URL}/api/public/bypass?url=${encodeURIComponent(targetUrl)}`);
        const result = await response.json();

        if (result.status === "success") {
            resultBox.classList.remove('hidden');
            resultText.innerText = result.destination;
            btn.innerText = "Bypass Now";
        } else {
            alert("ล้มเหลว: " + result.message);
            btn.innerText = "ลองใหม่อีกครั้ง";
        }
    } catch (err) {
        alert("ไม่สามารถเชื่อมต่อกับ Server ได้");
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
    navigator.clipboard.writeText(text);
    alert("คัดลอกแล้ว!");
}