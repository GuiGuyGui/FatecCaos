/**
 * Kairo Cyberpunk HUD & Terminal Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  initKairoTerminal();
  initKairoForm();
});

function initKairoTerminal() {
  const logContainer = document.getElementById('kairo-terminal-logs');
  if (!logContainer) return;

  const logMessages = [
    { type: 'info', text: 'Iniciando diagnóstico de barramentos cuánticos...' },
    { type: 'prefix', text: 'CARREGANDO NÚCLEO KAIRO v0.9.8-BETA' },
    { type: 'success', text: 'Módulos de física e renderização espacial: 100% OK' },
    { type: 'info', text: 'Ajustando taxa de sincronização de rede multi-região...' },
    { type: 'prefix', text: 'AVISO: Servidores centrais em recalibração de memória' },
    { type: 'info', text: 'Otimizando pipelines de shader para GPU de nova geração...' },
    { type: 'success', text: 'Criptografia de save states e inventário validada' },
    { type: 'prefix', text: 'PROTOCOLO KAIRO-7: STATUS ATUAL -> MANUTENÇÃO ATIVA' }
  ];

  let currentIdx = 0;

  function addNextLog() {
    if (currentIdx >= logMessages.length) {
      currentIdx = 0;
    }
    const msg = logMessages[currentIdx];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const logEl = document.createElement('div');
    logEl.className = 'log-line';

    let content = `<span class="log-time">[${timeStr}]</span> `;
    if (msg.type === 'prefix') {
      content += `<span class="log-prefix">⚠ [KAIRO]</span> ${msg.text}`;
    } else if (msg.type === 'success') {
      content += `<span class="log-success">✓ [OK]</span> ${msg.text}`;
    } else {
      content += `<span class="log-info">ℹ [SYS]</span> ${msg.text}`;
    }

    logEl.innerHTML = content;
    logContainer.appendChild(logEl);
    logContainer.scrollTop = logContainer.scrollHeight;

    currentIdx++;
  }

  // Initial logs
  for (let i = 0; i < 4; i++) {
    addNextLog();
  }

  // Periodic logs stream
  setInterval(() => {
    addNextLog();
  }, 4000);
}

function initKairoForm() {
  const form = document.getElementById('kairo-waitlist-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('kairo-email-input');
    const email = input.value.trim();

    if (!email || !email.includes('@')) {
      if (window.showToast) window.showToast('Por favor, insira um e-mail válido.', 'error');
      return;
    }

    // Save to local storage mock
    const waitlist = JSON.parse(localStorage.getItem('kairo_waitlist') || '[]');
    if (!waitlist.includes(email)) {
      waitlist.push(email);
      localStorage.setItem('kairo_waitlist', JSON.stringify(waitlist));
    }

    if (window.soundEngine) window.soundEngine.playVictory();
    if (window.showToast) {
      window.showToast('Acesso VIP registrado! Avisaremos assim que os servidores abrirem.');
    }

    input.value = '';
  });
}
