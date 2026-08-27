// ==================== STAR CONSTELLATION & MOUSE TRACKING ====================
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let stars = [];
let mouse = { x: null, y: null };
let constellationLines = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

class Star {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.brightness = Math.random();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    this.brightness += (Math.random() - 0.5) * 0.05;
    if (this.brightness > 1) this.brightness = 1;
    if (this.brightness < 0.3) this.brightness = 0.3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
    ctx.fill();

    // Glow effect
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 55, ${this.brightness * 0.1})`;
    ctx.fill();
  }
}

// Create stars
for (let i = 0; i < 150; i++) {
  stars.push(new Star());
}

// Mouse tracking
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

function drawConstellation() {
  if (!mouse.x || !mouse.y) return;

  for (let star of stars) {
    const dx = mouse.x - star.x;
    const dy = mouse.y - star.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 150) {
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(star.x, star.y);
      ctx.strokeStyle = `rgba(212, 175, 55, ${0.3 * (1 - distance / 150)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let star of stars) {
    star.update();
    star.draw();
  }

  drawConstellation();
  requestAnimationFrame(animate);
}

animate();

// ==================== METEOR SHOWER ====================
function createMeteor() {
  const meteor = document.createElement("div");
  meteor.className = "meteor";
  meteor.style.left = Math.random() * window.innerWidth + "px";
  meteor.style.top = Math.random() * (window.innerHeight / 2) + "px";
  meteor.style.animation = `meteorFall ${Math.random() * 2 + 1}s linear forwards`;
  document.body.appendChild(meteor);

  setTimeout(() => {
    meteor.remove();
  }, 3000);
}

setInterval(createMeteor, 2000);

// ==================== NAVBAR SCROLL ====================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ==================== CAROUSEL ====================

let currentSlide = 0;

const track = document.getElementById("carouselTrack");

function getCards() {
  return track.querySelectorAll(".activity-card");
}

function getCardWidth() {
  const card = getCards()[0];

  if (!card) return 0;

  const gap = parseFloat(getComputedStyle(track).gap) || 0;

  return card.offsetWidth + gap;
}

function moveCarousel(direction) {
  const cards = getCards();

  if (cards.length === 0) return;

  const cardWidth = getCardWidth();

  const containerWidth = track.parentElement.offsetWidth;

  const visibleCards = Math.floor(containerWidth / cardWidth);

  const maxSlide = Math.max(0, cards.length - visibleCards);

  currentSlide += direction;

  // Batas kiri
  if (currentSlide < 0) {
    currentSlide = 0;
  }

  // Batas kanan
  if (currentSlide > maxSlide) {
    currentSlide = maxSlide;
  }

  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
}

// ==================== AUTO SLIDE ====================

setInterval(() => {
  const cards = getCards();

  if (cards.length === 0) return;

  const cardWidth = getCardWidth();

  const containerWidth = track.parentElement.offsetWidth;

  const visibleCards = Math.floor(containerWidth / cardWidth);

  const maxSlide = Math.max(0, cards.length - visibleCards);

  currentSlide++;

  if (currentSlide > maxSlide) {
    currentSlide = 0;
  }

  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
}, 5000);
// ==================== SCROLL ANIMATION ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// ==================== FORM SUBMISSION TO GOOGLE SHEETS ====================
/*
        CARA MENGHUBUNGKAN KE GOOGLE SPREADSHEET:
        
        1. Buka Google Drive → Buat Spreadsheet baru
        2. Beri nama kolom: Timestamp | Nama | NIM | Email | Prodi | Semester | No HP | Alasan
        3. Klik Extensions → Apps Script
        4. Hapus semua kode, lalu paste kode berikut:
        
        -----------------------------------------------------------
        function doPost(e) {
          var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
          var data = e.parameter;
          
          sheet.appendRow([
            new Date(),
            data.nama,
            data.nim,
            data.divisi,
            data.prodi,
            data.semester,
            data.noHp,
            data.alasan
          ]);
          
          return ContentService.createTextOutput(JSON.stringify({
            'result': 'success',
            'message': 'Data berhasil disimpan!'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        function doGet(e) {
          return ContentService.createTextOutput(JSON.stringify({
            'status': 'active'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        -----------------------------------------------------------
        
        5. Klik Deploy → New Deployment
        6. Pilih Type: Web App
        7. Set Execute as: Me
        8. Set Who has access: Anyone
        9. Klik Deploy, lalu copy URL Web App-nya
        10. Paste URL tersebut di variabel GOOGLE_SCRIPT_URL di bawah ini
        */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxpEZ-HPFuf1pq40H-gCWmNkpqhMOseDFvyxJSxfeCFHaXUrLArgtG-OfQTuUp9JIgW/exec"; // GANTI DENGAN URL ANDA!

document
  .getElementById("registrationForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const alertBox = document.getElementById("alertBox");
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.innerHTML =
      '<span class="loader" style="display:inline-block"></span> Mengirim...';
    submitBtn.disabled = true;

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    try {
      // Kirim data ke Google Sheets
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      });

      // Tampilkan pesan sukses (karena no-cors, kita anggap sukses jika tidak error)
      alertBox.className = "alert success";
      alertBox.textContent =
        "Pendaftaran berhasil! Data kamu 😘 telah dikirim. Kami akan menghubungi kamu segera.";
      this.reset();
    } catch (error) {
      // Fallback: tampilkan data yang bisa di-copy
      alertBox.className = "alert error";
      alertBox.innerHTML = `
                    <strong>Perhatian:</strong> Pastikan kamu sudah mengganti GOOGLE_SCRIPT_URL di kode.<br>
                    Data yang akan dikirim: <br>
                    Nama: ${data.nama}, NIM: ${data.nim}, Email: ${data.email}
                `;
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
  const nav = document.querySelector(".nav-links");
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
  nav.style.position = "absolute";
  nav.style.top = "100%";
  nav.style.left = "0";
  nav.style.right = "0";
  nav.style.flexDirection = "column";
  nav.style.background = "rgba(45, 0, 0, 0.95)";
  nav.style.padding = "2rem";
  nav.style.gap = "1.5rem";
  nav.style.borderTop = "1px solid rgba(212, 175, 55, 0.2)";
}
