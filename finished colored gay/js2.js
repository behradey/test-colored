const boxes = document.querySelectorAll('.box');
let index = 1;
let count = 0;


document.addEventListener('click', function(event) {
    // اول چک می‌کنیم که آیا روی المنت مورد نظر ما کلیک شده؟
    if (event.target.classList.contains('special-element')) {
        
        // حالا می‌فهمیم که والدش کی بوده
        const clickedElement = event.target;
        const parentElement = clickedElement.parentElement;
        
        // می‌تونیم والد رو بر اساس ID تشخیص بدیم
        if (parentElement.id === 'parent1') {
            console.log("Special element clicked inside parent1!");
            // اینجا می‌تونی کارهای مربوط به parent1 رو انجام بدی
            // مثلاً: clickedElement.style.color = 'blue';
        } else if (parentElement.id === 'parent2') {
            console.log("Special element clicked inside parent2!");
            // اینجا می‌تونی کارهای مربوط به parent2 رو انجام بدی
            // مثلاً: clickedElement.style.color = 'red';
        }

        // یا اگر المنت خاص، اطلاعاتی در data-attribute داره
        console.log("Clicked element data:", clickedElement.dataset.info);

    }
});
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
const stars = [];
const starCount = 180;
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.z = rand(0.2, 1);          // عمق
    this.r = rand(0.5, 2.2);         // اندازه
    this.speed = rand(0.02, 0.12) * this.z;
    this.alpha = rand(0.2, 1);
    this.twinkle = rand(0.002, 0.01);
    this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
  }
  update() {
    // حرکت خیلی نرم به سمت مخالف حرکت موس
    const dx = (mouse.x - canvas.width / 2) * 0.0006 * (1 / this.z);
    const dy = (mouse.y - canvas.height / 2) * 0.0006 * (1 / this.z);
    this.x -= dx;
    this.y -= dy;
    // حرکت طبیعی ستاره
    this.y += this.speed;
    // twinkle
    this.alpha += this.twinkle * this.twinkleDir;
    if (this.alpha > 1) this.twinkleDir = -1;
    if (this.alpha < 0.15) this.twinkleDir = 1;
    // اگر از پایین خارج شد، از بالا دوباره ظاهر شود
    if (this.y > canvas.height + 10) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
    }
    if (this.x < -10) this.x = canvas.width + 10;
    if (this.x > canvas.width + 10) this.x = -10;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * this.z, 0, Math.PI * 2);
    // رنگ ستاره‌ها مشکی شد
    ctx.fillStyle = `white`;
    ctx.fill();
  }
}
for (let i = 0; i < starCount; i++) {
  stars.push(new Star());
}
// چند ستاره دنباله‌دار
const shootingStars = [];
class ShootingStar {
  constructor() {
    this.spawn();
  }
  spawn() {
    this.x = rand(-canvas.width, canvas.width);
    this.y = rand(0, canvas.height * 0.5);
    this.len = rand(60, 160);
    this.speed = rand(8, 14);
    this.angle = Math.PI / 4;
    this.opacity = 1;
    this.delay = rand(80, 200);
  }
  update() {
    this.delay--;
    if (this.delay > 0) return;
    this.x += this.speed;
    this.y += this.speed;
    this.opacity -= 0.015;
    if (this.opacity <= 0) {
      this.spawn();
    }
  }
  draw() {
    if (this.delay > 0) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    // رنگ ستاره دنباله‌دار مشکی شد
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len, this.y - this.len);
    ctx.stroke();
    ctx.restore();
  }
}
for (let i = 0; i < 3; i++) {
  shootingStars.push(new ShootingStar());
}
function drawBackground() {
  // پس‌زمینه سفید
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function animate() {
  drawBackground();
  // ستاره‌ها
  for (const star of stars) {
    star.update();
    star.draw();
  }
  // ستاره‌های دنباله‌دار
  for (const s of shootingStars) {
    s.update();
    s.draw();
  }
  requestAnimationFrame(animate);
}
animate();

function createSmoothSlider(sliderId, leftBtnId, rightBtnId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let lastX = 0;
    let animFrame;

    // drag
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        velocity = 0;
        lastX = e.pageX;
        cancelAnimationFrame(animFrame);
    });

    slider.addEventListener('mouseleave', () => {
        if (!isDown) return;
        isDown = false;
        slider.style.cursor = 'grab';
        startMomentum();
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
        startMomentum();
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        velocity = e.pageX - lastX;
        lastX = e.pageX;
        const x = e.pageX - slider.offsetLeft;
        slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    // momentum
    function startMomentum() {
        cancelAnimationFrame(animFrame);
        function step() {
            if (Math.abs(velocity) < 0.5) return;
            slider.scrollLeft -= velocity;
            velocity *= 0.92;
            animFrame = requestAnimationFrame(step);
        }
        step();
    }

    // wheel
   

    // arrow buttons
    document.getElementById(leftBtnId)?.addEventListener('click', () => {
        smoothScrollTo(slider, slider.scrollLeft + 300);
    });
    document.getElementById(rightBtnId)?.addEventListener('click', () => {
        smoothScrollTo(slider, slider.scrollLeft - 300);
    });
}

function smoothScrollTo(el, target) {
    const start = el.scrollLeft;
    const diff = target - start;
    const duration = 400;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.scrollLeft = start + diff * ease;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

createSmoothSlider('slider', 'left', 'right');
createSmoothSlider('slider2', 'left2', 'right2');

document.getElementById('socialToggle').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('socialTray').classList.toggle('open');
});

// داده‌های آیتم‌ها
const itemsData = {
  'هدفون بی‌سیم':   { price: '2,000,000 تومان', img: 'photos/ChatGPT Image May 30, 2026, 11_18_36 PM.png' },
  'ماوس گیمینگ':    { price: '1,020,000 تومان', img: 'photos/ChatGPT Image May 30, 2026, 11_18_58 PM.png' },
  'کیبورد مکانیکی': { price: '2,100,000 تومان', img: 'photos/ChatGPT Image May 30, 2026, 11_19_07 PM.png' },
  'مانیتور 24 اینچ': { price: '7,200,000 تومان', img: 'photos/ChatGPT Image May 30, 2026, 11_19_29 PM.png' },
  'اسپیکر بلوتوثی': { price: '1,500,000 تومان', img: 'photos/ChatGPT Image May 30, 2026, 11_19_42 PM.png' },
};

function updateFavoritesGrid() {
  const grid = document.getElementById('favoritesGrid');
  const favBtns = document.querySelectorAll('.item-star.active, .item2-star.active');

  if (favBtns.length === 0) {
      grid.innerHTML = '<div class="fav-empty">هنوز چیزی به علاقه‌مندی‌ها اضافه نشده ❤️</div>';
      return;
  }

  grid.innerHTML = '';
  favBtns.forEach(btn => {
      const item = btn.closest('.item, .item2');
      const title = item.querySelector('.title, .title2')?.innerText?.trim() || '';
      const price = item.querySelector('.new-price, .new-price2')?.innerText?.trim() || '';
      const imgEl = item.querySelector('img');
      const img = imgEl ? imgEl.getAttribute('src') : '';

      const card = document.createElement('div');
      card.className = 'item-fav';
      card.innerHTML = `
  
                        <button class="item-star-fav">
                          <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        </button>
                        <span class="item-fav-badge">15% OFF</span>
                          <div class="info-fav">

                              <div class="price-box-fav">
                                <div>
                                  <div class="title-fav">${title}</div>
                                  <span class="title-detail2">ZAA 256GB 12GB</span>
                                </div>
                                <div>
                                  <div class="new-price-fav">${price}</div>
                                <span class="old-price-fav">1399$</span>
                              </div>
                            </div>
                          </div>
                          ${img ? `<img src="${img}" alt="${title}">` : ''}
                      


      `;

      grid.appendChild(card);
  });
}

document.querySelectorAll('.item-star, .item2-star').forEach(btn => {
  btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      updateFavoritesGrid();
  });
});

const loginIcon = document.querySelector(".login-icon");
const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");

const profile = document.getElementById("userProfile");

const profileName = document.getElementById("cardName");
const container = document.querySelector(".container")

// باز کردن پنجره لاگین
loginIcon.addEventListener("click", () => {
    loginModal.style.display = "flex";
    container.classList.add("hidden")
});

// ورود
loginBtn.addEventListener("click", () => {




    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username.trim() === "" || password.trim() === ""){
        alert("تمام فیلدها را پر کنید");
        return;
    }

    localStorage.setItem("username", username);

    showUser(username);

    loginModal.style.display = "none";
    container.classList.remove("hidden")
    document.getElementById("avatarLetter").innerHTML =
        username.charAt(0).toUpperCase();
});

// نمایش کاربر
function showUser(username){

    profileName.textContent = username;

    profile.style.display = "flex";

    document.querySelector(".login-icon").style.display = "none";
}


window.addEventListener("load", () => {

    const savedUser = localStorage.getItem("username");

    if(savedUser){
        showUser(savedUser);
    }
});

const userBtn = document.querySelector(".user-btn");
const profileCard = document.getElementById("profileCard");

if (userBtn && profileCard) {
    userBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileCard.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        profileCard.classList.remove("show");
    });

    profileCard.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("username");

    profile.style.display = "none";

    document.querySelector(".login-icon").style.display = "block";

    profileCard.classList.remove("show");

    location.reload();
});




    const username = localStorage.getItem("username");

if(username){
    document.getElementById("cardName").textContent = username;

    document.getElementById("avatarLetter").innerHTML =
        username.charAt(0).toUpperCase();
}



const themes = {
  galaxy: { accent: '#6c47ff', accent2: '#a855f7', bg1: 'rgba(15,15,25,0.7)',   bg2: 'rgba(15,15,25,0.8)',   item: 'rgba(20,18,40,0.85)',  glow: 'rgba(108,71,255,0.3)',  glow2: 'rgba(108,71,255,0.15)', border: 'rgba(108,71,255,0.2)',  canvas: '#0a0a1a' },
  ocean:  { accent: '#0077ff', accent2: '#00c6ff', bg1: 'rgba(5,20,40,0.8)',    bg2: 'rgba(5,20,40,0.85)',  item: 'rgba(5,20,35,0.85)',   glow: 'rgba(0,119,255,0.3)',   glow2: 'rgba(0,119,255,0.15)',  border: 'rgba(0,150,255,0.2)', canvas: '#020d1a' },
  matrix: { accent: '#00c853', accent2: '#00e676', bg1: 'rgba(0,15,5,0.85)',    bg2: 'rgba(0,15,5,0.9)',    item: 'rgba(0,12,4,0.88)',    glow: 'rgba(0,200,83,0.3)',    glow2: 'rgba(0,200,83,0.15)',   border: 'rgba(0,200,83,0.2)',  canvas: '#000d02' },
  fire:   { accent: '#ff1744', accent2: '#ff6d00', bg1: 'rgba(20,5,5,0.85)',    bg2: 'rgba(20,5,5,0.9)',    item: 'rgba(18,4,4,0.88)',    glow: 'rgba(255,23,68,0.3)',   glow2: 'rgba(255,23,68,0.15)',  border: 'rgba(255,50,50,0.2)', canvas: '#0d0202' },
  gold:   { accent: '#f5a623', accent2: '#f7c948', bg1: 'rgba(15,10,0,0.88)',   bg2: 'rgba(15,10,0,0.92)',  item: 'rgba(12,8,0,0.88)',    glow: 'rgba(245,166,35,0.3)',  glow2: 'rgba(245,166,35,0.15)', border: 'rgba(245,166,35,0.2)',canvas: '#0a0700' },
  cyber:  { accent: '#ff0080', accent2: '#ff6ec7', bg1: 'rgba(20,5,15,0.88)',   bg2: 'rgba(20,5,15,0.92)',  item: 'rgba(15,3,10,0.88)',   glow: 'rgba(255,0,128,0.3)',   glow2: 'rgba(255,0,128,0.15)',  border: 'rgba(255,0,150,0.2)', canvas: '#0d0209' },
  ice:    { accent: '#00bcd4', accent2: '#00e5ff', bg1: 'rgba(0,15,20,0.88)',   bg2: 'rgba(0,15,20,0.92)',  item: 'rgba(0,10,15,0.88)',   glow: 'rgba(0,188,212,0.3)',   glow2: 'rgba(0,188,212,0.15)',  border: 'rgba(0,188,212,0.2)', canvas: '#00080d' },
};

function applyTheme(name) {
  const t = themes[name];
  if (!t) return;
  const root = document.documentElement;
  root.style.setProperty('--accent',  t.accent);
  root.style.setProperty('--accent2', t.accent2);
  root.style.setProperty('--bg1',     t.bg1);
  root.style.setProperty('--bg2',     t.bg2);
  root.style.setProperty('--item-bg', t.item);
  root.style.setProperty('--glow',    t.glow);
  root.style.setProperty('--glow2',   t.glow2);
  root.style.setProperty('--border',  t.border);
  root.style.setProperty('--canvas-bg', t.canvas);

  document.querySelectorAll('.theme-option').forEach(o => {
      o.classList.toggle('active', o.dataset.theme === name);
  });

  document.querySelector('.theme-toggle-btn').style.background =
      `linear-gradient(135deg, ${t.accent}, ${t.accent2})`;

  localStorage.setItem('theme', name);
}

document.getElementById('themeToggleBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('themePanel').classList.toggle('open');
});

document.querySelectorAll('.theme-option').forEach(opt => {
  opt.addEventListener('click', (e) => {
      e.stopPropagation();
      applyTheme(opt.dataset.theme);
  });
});

document.addEventListener('click', () => {
  document.getElementById('themePanel')?.classList.remove('open');
});

// بارگذاری تم ذخیره شده

document.querySelectorAll('.item, .item2').forEach(item => {
  item.addEventListener('click', () => {

    const title = item.querySelector('.title, .title2')?.innerText;
    const price = item.querySelector('.new-price, .new-price2')?.innerText;
    const img = item.querySelector('img')?.src;

    const product = {
      title,
      price,
      img
    };

    localStorage.setItem("currentProduct", JSON.stringify(product));

    // رفتن به صفحه محصول بدون پیچیدگی
    window.location.href = "product.html";
  });
});

window.addEventListener("DOMContentLoaded", () => {

  const openBox = sessionStorage.getItem("openBox");

  if (openBox) {
    index = parseInt(openBox);

    boxes.forEach((b, i) => {
      b.classList.toggle("active", i === index);
    });

    sessionStorage.removeItem("openBox");
  }
});

let p8x = 1;

function qtyUp(){
  p8x++;
  document.querySelector(".h9k3p").textContent = p8x;
}

function qtyDown(){
  if(p8x > 1) p8x--;
  document.querySelector(".h9k3p").textContent = p8x;
}
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
  
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  });