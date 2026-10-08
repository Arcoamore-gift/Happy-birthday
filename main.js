/* ====== Ubah teks ucapan di sini ====== */
const GREETING = {
  title: 'Happy Birthday',
  lines: [
    'Happy birthday! May your day be filled with joy and laughter.',
    'Wishing you a year ahead filled with happiness, success, and all your heart desires.',
    'Enjoy your special day!',
  ],
  sign: '- ricc',
};

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isLight = window.matchMedia('(max-width: 560px)').matches || (navigator.hardwareConcurrency || 4) <= 4;
const bgMusic = $('bg-music');
const musicToggle = $('music-toggle');

function updateMusicButton() {
  if (!musicToggle) return;

  const icon = musicToggle.querySelector('.speaker-icon');
  if (!icon) return;

  if (bgMusic && !bgMusic.paused) {
    icon.textContent = '🔊';
    musicToggle.classList.add('is-playing');
    musicToggle.setAttribute('aria-label', 'Mute background music');
    musicToggle.title = 'Mute background music';
  } else {
    icon.textContent = '🔇';
    musicToggle.classList.remove('is-playing');
    musicToggle.setAttribute('aria-label', 'Play background music');
    musicToggle.title = 'Play background music';
  }
}

function startBackgroundMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 0.25;
  bgMusic.play().then(updateMusicButton).catch(updateMusicButton);
}

function toggleBackgroundMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    startBackgroundMusic();
  } else {
    bgMusic.pause();
    updateMusicButton();
  }
}

if (musicToggle) {
  musicToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleBackgroundMusic();
  });
  updateMusicButton();
}

function goTo(id) {
  document.querySelectorAll('section').forEach((s) => s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo(0, 0);
}

/* ---- Dekorasi latar melayang ---- */
(function initDecor() {
  const box = $('bg-decor');
  for (let i = 0; i < (isLight ? 8 : 14); i++) {
    const s = document.createElement('span');
    s.className = 'star-particle';
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDelay = -Math.random() * 14 + 's';
    s.style.animationDuration = 8 + Math.random() * 12 + 's';
    const size = 14 + Math.random() * 28;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.opacity = (0.3 + Math.random() * 0.7).toFixed(2);
    box.appendChild(s);
  }
})();

/* ---- 1. Amplop -> kertas ucapan ---- */
function openLetter() {
  const env = $('envelope');
  if (env.classList.contains('opening')) return;
  startBackgroundMusic();
  env.classList.add('opening');
  $('letter-container').classList.add('hint-hidden');
  setTimeout(() => env.classList.add('fading-out'), 1000);
  setTimeout(() => { buildPaper(); goTo('page2'); }, 1600);
}
$('envelope').addEventListener('click', openLetter);
$('envelope').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); }
});

/* ---- 2. Kertas ucapan ---- */
/* ---- 2. Kertas ucapan ---- */
function buildPaper() {
  const paper = $('paper');
  paper.innerHTML = '';
  
  const h = document.createElement('h2');
  h.textContent = GREETING.title;
  paper.appendChild(h);

  let t = 0.9;
  GREETING.lines.forEach((text) => {
    const p = document.createElement('p');
    p.className = 'line';
    p.textContent = text;
    p.style.animationDelay = t + 's';
    paper.appendChild(p);
    t += 0.55;
  });

  // Buat pembungkus footer (Flexbox) untuk Tombol + Sign
  const footer = document.createElement('div');
  footer.className = 'paper-footer';
  footer.style.animationDelay = t + 's';

  const btn = document.createElement('button');
  btn.className = 'next-btn';
  btn.type = 'button';
  btn.textContent = 'Go to suprise';
  btn.addEventListener('click', () => goTo('page3'));

  const sign = document.createElement('p');
  sign.className = 'sign';
  sign.textContent = GREETING.sign;

  // Masukkan tombol dan sign ke dalam footer
  footer.appendChild(btn);
  footer.appendChild(sign);

  // Masukkan footer ke dalam kertas
  paper.appendChild(footer);
}

/* ---- 3. Kue ---- */
function confetti() {
  const box = $('confetti');
  const colors = ['#ff6fae', '#ffcf4d', '#b9a4ff', '#ffb27a', '#d63a86', '#ffffff'];
  for (let i = 0; i < (isLight ? 35 : 70); i++) {
    const c = document.createElement('i');
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 2.2 + Math.random() * 2.2 + 's';
    c.style.animationDelay = Math.random() * 0.6 + 's';
    box.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
}

$('blow-btn').addEventListener('click', () => {
  const cake = $('cake');
  if (cake.classList.contains('out')) return;
  cake.classList.add('out');
  $('cake-title').textContent = 'May it be granted';
  $('cake-sub').textContent = 'Happy Birthday';
  $('blow-btn').style.display = 'none';
  if (!reduceMotion) confetti();
  $('page3').classList.add('fade-out');
  setTimeout(() => {
    $('page3').classList.remove('fade-out');
    showHappyBirthday();
  }, reduceMotion ? 0 : 900);
});

/* ---- 4. Happy Birthday ---- */
function showHappyBirthday() {
  const h = $('hb-text');
  h.innerHTML = '';
  let i = 0;
  'Happy Birthday'.split(' ').forEach((word, w) => {
    const line = document.createElement('span');
    line.className = 'hb-word';
    [...word].forEach((ch) => {
      const l = document.createElement('span');
      l.className = 'hb-letter';
      l.textContent = ch;
      l.style.animationDelay = 0.2 + i++ * 0.07 + 's';
      line.appendChild(l);
    });
    h.appendChild(line);
  });
  goTo('page4');
  if (!reduceMotion) setTimeout(confetti, 900);
}
