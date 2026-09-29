/**
 * Omni Void Studios — Main Application Controller & Visual Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarsCanvas();
  initNavigation();
  initMobileMenu();
  initSoundToggle();
});

// Toast Notification helper
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icon = type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : '✨');
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Seamless Tab & Page Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('[data-view-target]');
  const views = document.querySelectorAll('.page-view');

  function switchView(targetId) {
    views.forEach(v => {
      v.classList.remove('active');
    });

    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('data-view-target') === targetId) {
        l.classList.add('active');
      }
    });

    const targetView = document.getElementById(targetId);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sync URL hash
    window.location.hash = targetId.replace('view-', '');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-view-target');
      switchView(target);
      // Close mobile menu if open
      const navMenu = document.getElementById('nav-menu');
      if (navMenu) navMenu.classList.remove('show');
    });
  });

  // Handle direct hash navigation
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const target = `view-${hash}`;
    if (document.getElementById(target)) {
      switchView(target);
    }
  }
}

// Mobile Menu
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
    });
  }
}

// Sound Mute Toggle
function initSoundToggle() {
  const btn = document.getElementById('btn-toggle-sound');
  if (!btn) return;

  function updateIcon() {
    const isMuted = localStorage.getItem('omni_muted') === 'true';
    btn.innerHTML = isMuted ? '🔇' : '🔊';
    btn.title = isMuted ? 'Ativar Efeitos Sonoros' : 'Desativar Sons';
  }

  updateIcon();

  btn.addEventListener('click', () => {
    if (window.soundEngine) {
      const active = window.soundEngine.toggleMute();
      updateIcon();
      window.showToast(active ? 'Sons ativados!' : 'Sons mutados.');
    }
  });
}

// Animated Starfield Canvas
function initStarsCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const starCount = Math.min(100, Math.floor(width * 0.08));
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      speed: Math.random() * 0.3 + 0.05,
      alpha: Math.random() * 0.8 + 0.2
    });
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// Global 500-character input safeguard
document.addEventListener('input', (e) => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
    if (e.target.value && e.target.value.length > 500) {
      e.target.value = e.target.value.slice(0, 500);
    }
  }
});
