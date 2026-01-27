import './style.css'

// --- Matrix Rain Animation ---
const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');

let width, height;
let columns;
const fontSize = 16;
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*';
const drops = []; // Array of drop positions

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  const colCount = Math.floor(width / fontSize);
  // Initialize drops if count changed significantly or first run
  if (drops.length === 0 || Math.abs(drops.length - colCount) > 10) {
    drops.length = 0; // Clear
    for (let i = 0; i < colCount; i++) {
      drops[i] = 1; // Start at top
    }
  }
}

window.addEventListener('resize', resize);
resize();

// Throttle frame rate
let lastTime = 0;
const fps = 30;
const interval = 1000 / fps;

function draw(currentTime) {
  requestAnimationFrame(draw);

  const deltaTime = currentTime - lastTime;
  if (deltaTime < interval) return;

  lastTime = currentTime - (deltaTime % interval);

  // Semi-transparent black to create trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);

  // ctx.fillStyle = '#0F0'; // Green text
  // Random color variation for cyberpunk feel
  // ctx.fillStyle = Math.random() > 0.9 ? '#FFF' : '#0F0'; 

  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    // Random character
    const text = chars[Math.floor(Math.random() * chars.length)];

    // Curved Effect
    // Use sine wave based on Y position + time to create a "windy" or "wavy" curve
    const curveAmplitude = 30;
    const curveFreq = 0.005;
    const timeFactor = currentTime * 0.001; // Slower time movement

    // Calculate lateral offset with dynamic wave
    const xOffset = Math.sin((drops[i] * fontSize * curveFreq) + timeFactor) * curveAmplitude;

    const x = i * fontSize + xOffset;
    const y = drops[i] * fontSize;

    // "Hiding" effect: Randomly don't draw some characters
    if (Math.random() > 0.05) {
      // Opacity variation (Gray scale)
      const alpha = Math.random() * 0.5 + 0.3; // 0.3 to 0.8
      // Using strict white color with alpha for "grey" shades
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

      // Occasional bright white character
      if (Math.random() > 0.98) {
        ctx.fillStyle = '#FFF';
      }

      ctx.fillText(text, x, y);
    }

    // Reset drop to top randomly or when off screen
    if (y > height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Start animation
requestAnimationFrame(draw);


// --- Scroll Interactions ---

// 1. Reveal Sections
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// 2. Copy to Clipboard
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  });
});

// 3. Typing Effect Reset on Hero Entry (Optional but nice)
// We handled this with CSS animation mainly, but JS could restart it if needed.
