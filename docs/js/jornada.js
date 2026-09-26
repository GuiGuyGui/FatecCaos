/**
 * Jornada Dev — Duolingo-Style Gamified Engine
 * Omni Void Studios
 */

class JornadaDev {
  constructor() {
    this.questions = [];
    this.filteredQuestions = [];
    this.activeQuizSession = null;
    this.userState = this.loadState();
    this.activeTab = 'path'; // 'path' | 'categories' | 'profile'
  }

  loadState() {
    const saved = localStorage.getItem('omni_jornada_state');
    const defaultState = {
      xp: 0,
      streak: 1,
      lastDate: new Date().toISOString().split('T')[0],
      hearts: 5,
      maxHearts: 5,
      level: 1,
      title: 'Dev Novato',
      completedLessons: [],
      solvedQuestions: {},
      categoryMastery: {}
    };

    if (!saved) return defaultState;
    try {
      const parsed = JSON.parse(saved);
      // Check streak
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastDate !== today) {
        const last = new Date(parsed.lastDate);
        const curr = new Date(today);
        const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          parsed.streak += 1;
        } else if (diffDays > 1) {
          parsed.streak = 1;
        }
        parsed.lastDate = today;
        // Refill hearts each new day
        parsed.hearts = parsed.maxHearts;
      }
      return { ...defaultState, ...parsed };
    } catch {
      return defaultState;
    }
  }

  saveState() {
    this.calcLevel();
    localStorage.setItem('omni_jornada_state', JSON.stringify(this.userState));
    this.updateStatsUI();
  }

  calcLevel() {
    const xp = this.userState.xp;
    if (xp < 50) {
      this.userState.level = 1;
      this.userState.title = 'Dev Novato';
    } else if (xp < 150) {
      this.userState.level = 2;
      this.userState.title = 'Estagiário Curioso';
    } else if (xp < 400) {
      this.userState.level = 3;
      this.userState.title = 'Dev Júnior';
    } else if (xp < 900) {
      this.userState.level = 4;
      this.userState.title = 'Dev Pleno';
    } else if (xp < 1800) {
      this.userState.level = 5;
      this.userState.title = 'Dev Sênior';
    } else if (xp < 3500) {
      this.userState.level = 6;
      this.userState.title = 'Arquiteto de Software';
    } else {
      this.userState.level = 7;
      this.userState.title = 'Tech Lead do Vazio';
    }
  }

  async init() {
    try {
      const res = await fetch('data/questions.json');
      this.questions = await res.json();
    } catch (e) {
      console.warn('Falha ao carregar banco local, utilizando fallback:', e);
      this.questions = this.getFallbackQuestions();
    }

    this.renderPathView();
    this.renderCategoriesView();
    this.renderProfileView();
    this.updateStatsUI();
    this.bindEvents();
  }

  updateStatsUI() {
    // Header & in-page stats
    const streakEls = document.querySelectorAll('.val-streak');
    const xpEls = document.querySelectorAll('.val-xp');
    const heartsEls = document.querySelectorAll('.val-hearts');
    const rankTitleEls = document.querySelectorAll('.val-rank-title');
    const rankLevelEls = document.querySelectorAll('.val-rank-level');

    streakEls.forEach(el => el.textContent = `${this.userState.streak} dias`);
    xpEls.forEach(el => el.textContent = `${this.userState.xp} JXP`);
    heartsEls.forEach(el => el.textContent = `${this.userState.hearts}/${this.userState.maxHearts}`);
    rankTitleEls.forEach(el => el.textContent = this.userState.title);
    rankLevelEls.forEach(el => el.textContent = `Nível ${this.userState.level}`);
  }

  renderPathView() {
    const container = document.getElementById('path-container');
    if (!container) return;

    // Define 4 Learning Units
    const units = [
      {
        id: 1,
        title: 'Unidade 1: Fundamentos & Lógica',
        desc: 'Construa os pilares de raciocínio, sintaxe básica e controle de fluxo.',
        themeClass: '',
        categories: ['Fundamentos', 'Lógica'],
        nodes: [
          { id: 'u1-n1', label: 'Variáveis & Tipos', category: 'Fundamentos', skill: 'variáveis', icon: '🌱' },
          { id: 'u1-n2', label: 'Controle de Fluxo', category: 'Lógica', skill: 'condicionais', icon: '🔀' },
          { id: 'u1-n3', label: 'Funções & Escopo', category: 'Fundamentos', skill: 'funções', icon: '📦' },
          { id: 'u1-n4', label: 'Desafio da Unidade 1', category: 'Fundamentos', icon: '🏆', isBoss: true }
        ]
      },
      {
        id: 2,
        title: 'Unidade 2: Web, JS & TypeScript',
        desc: 'Domine a linguagem da web, tipagem estática e manipulação dinâmica.',
        themeClass: 'unit-2',
        categories: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
        nodes: [
          { id: 'u2-n1', label: 'Estrutura Web HTML & CSS', category: 'HTML', icon: '🎨' },
          { id: 'u2-n2', label: 'JavaScript Moderno ES6+', category: 'JavaScript', icon: '⚡' },
          { id: 'u2-n3', label: 'Tipos Fortes com TypeScript', category: 'TypeScript', icon: '🛡️' },
          { id: 'u2-n4', label: 'Desafio da Unidade 2', category: 'JavaScript', icon: '👑', isBoss: true }
        ]
      },
      {
        id: 3,
        title: 'Unidade 3: Backend, APIs & Dados',
        desc: 'Conecte sistemas, faça queries SQL de alto desempenho e estruture APIs REST.',
        themeClass: 'unit-3',
        categories: ['Python', 'SQL', 'HTTP/APIs', 'Banco de Dados'],
        nodes: [
          { id: 'u3-n1', label: 'Protocolos HTTP & REST', category: 'HTTP/APIs', icon: '🌐' },
          { id: 'u3-n2', label: 'Python & Scripts', category: 'Python', icon: '🐍' },
          { id: 'u3-n3', label: 'Consultas & Bancos SQL', category: 'SQL', icon: '🗄️' },
          { id: 'u3-n4', label: 'Desafio da Unidade 3', category: 'SQL', icon: '💎', isBoss: true }
        ]
      },
      {
        id: 4,
        title: 'Unidade 4: Engenharia, DevOps & Arquitetura',
        desc: 'Git, Docker, Segurança, Testes Automatizados e Clean Code.',
        themeClass: 'unit-4',
        categories: ['Git/GitHub', 'Docker/DevOps', 'Testes', 'Segurança', 'Clean Code'],
        nodes: [
          { id: 'u4-n1', label: 'Git & Versionamento', category: 'Git/GitHub', icon: '🐙' },
          { id: 'u4-n2', label: 'Docker & Containers', category: 'Docker/DevOps', icon: '🐳' },
          { id: 'u4-n3', label: 'Testes & Clean Code', category: 'Testes', icon: '🧪' },
          { id: 'u4-n4', label: 'Mestre da Jornada Dev', category: 'Clean Code', icon: '🌌', isBoss: true }
        ]
      }
    ];

    let html = '';
    const completed = this.userState.completedLessons || [];

    units.forEach((u, uIdx) => {
      html += `
        <div class="unit-header-card ${u.themeClass}">
          <div class="unit-info">
            <h3>${u.title}</h3>
            <p>${u.desc}</p>
          </div>
          <span style="font-size: 2rem;">🚀</span>
        </div>
        <div class="path-nodes-flow">
      `;

      const positions = ['node-pos-center', 'node-pos-left', 'node-pos-center', 'node-pos-right'];

      u.nodes.forEach((node, nIdx) => {
        const isDone = completed.includes(node.id);
        const isPrevDone = (uIdx === 0 && nIdx === 0) || (nIdx > 0 && completed.includes(u.nodes[nIdx - 1].id)) || (nIdx === 0 && completed.includes(units[uIdx - 1]?.nodes.slice(-1)[0]?.id));
        const isLocked = !isDone && !isPrevDone;

        const posClass = positions[nIdx % positions.length];
        const stateClass = isDone ? 'completed' : (isLocked ? 'locked' : '');

        html += `
          <button class="path-node-btn ${posClass} ${stateClass}" 
                  data-node-id="${node.id}" 
                  data-category="${node.category}"
                  data-locked="${isLocked}"
                  title="${node.label}">
            <span class="node-label-popup">${node.label}</span>
            <span>${isLocked ? '🔒' : node.icon}</span>
          </button>
        `;
      });

      html += `</div>`;
    });

    container.innerHTML = html;

    // Attach click handlers to path nodes
    container.querySelectorAll('.path-node-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.locked === 'true') {
          if (window.soundEngine) window.soundEngine.playIncorrect();
          if (window.showToast) window.showToast('Conclua as lições anteriores para desbloquear esta fase!', 'warning');
          return;
        }
        const nodeId = btn.dataset.nodeId;
        const category = btn.dataset.category;
        this.startLesson(nodeId, category);
      });
    });
  }

  renderCategoriesView() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    // Group available questions by category
    const catCounts = {};
    this.questions.forEach(q => {
      const c = q.category || 'Outros';
      catCounts[c] = (catCounts[c] || 0) + 1;
    });

    const categoryIcons = {
      'Fundamentos': '🌱', 'Lógica': '🔀', 'JavaScript': '⚡', 'TypeScript': '🛡️',
      'HTML': '🌐', 'CSS': '🎨', 'Git/GitHub': '🐙', 'Terminal/Linux': '💻',
      'Debugging': '🔍', 'HTTP/APIs': '📡', 'SQL': '🗄️', 'Banco de Dados': '💾',
      'Testes': '🧪', 'Clean Code': '✨', 'Code Review': '👓', 'Arquitetura': '🏛️',
      'Segurança': '🔒', 'Performance': '⚡', 'Python': '🐍', 'Estruturas de Dados e Algoritmos': '📐',
      'Docker/DevOps': '🐳', 'Comunicação': '💬', 'Carreira e Rotina Dev': '💼'
    };

    let html = '';
    Object.keys(catCounts).sort().forEach(cat => {
      const count = catCounts[cat];
      const icon = categoryIcons[cat] || '📘';
      const solved = this.userState.categoryMastery[cat] || 0;

      html += `
        <div class="category-card" data-category="${cat}">
          <div>
            <div class="category-header-line">
              <span style="font-size: 1.6rem;">${icon}</span>
              <span class="cat-badge">${count} Questões</span>
            </div>
            <div class="category-name">${cat}</div>
            <div class="category-stats-line">Acertos: <strong>${solved}</strong> questões</div>
          </div>
          <button class="btn btn-duo" style="padding: 8px 14px; font-size: 0.9rem; margin-top: 14px; width: 100%;">
            Praticar
          </button>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Bind click to practice category
    grid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.dataset.category;
        this.startLesson(null, cat);
      });
    });
  }

  renderProfileView() {
    const container = document.getElementById('profile-stats-container');
    if (!container) return;

    const totalSolved = Object.keys(this.userState.solvedQuestions || {}).length;
    const completedUnits = this.userState.completedLessons?.length || 0;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 30px;">
        <div class="feature-card">
          <span style="font-size: 2rem; margin-bottom: 8px;">🔥</span>
          <h3>${this.userState.streak} Dias</h3>
          <p class="card-desc">Sequência atual de aprendizado contínuo.</p>
        </div>
        <div class="feature-card">
          <span style="font-size: 2rem; margin-bottom: 8px;">💎</span>
          <h3>${this.userState.xp} JXP</h3>
          <p class="card-desc">Experiência acumulada na plataforma.</p>
        </div>
        <div class="feature-card">
          <span style="font-size: 2rem; margin-bottom: 8px;">🎯</span>
          <h3>${totalSolved} Questões</h3>
          <p class="card-desc">Total de exercícios dominados com sucesso.</p>
        </div>
        <div class="feature-card">
          <span style="font-size: 2rem; margin-bottom: 8px;">⭐</span>
          <h3>${completedUnits} Fases</h3>
          <p class="card-desc">Módulos da trilha principal conquistados.</p>
        </div>
      </div>
    `;
  }

  startLesson(nodeId, category) {
    if (this.userState.hearts <= 0) {
      if (window.showToast) window.showToast('Você está sem vidas! Pratique no modo livre ou espere recarregar.', 'error');
      // Option to refill for practice
      this.userState.hearts = 5;
      this.saveState();
    }

    // Pick 5 questions from the chosen category
    let pool = this.questions.filter(q => !category || q.category.toLowerCase() === category.toLowerCase());
    if (pool.length === 0) pool = this.questions;

    // Shuffle and slice 5 questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const sessionQuestions = shuffled.slice(0, 5);

    this.activeQuizSession = {
      nodeId: nodeId,
      category: category,
      questions: sessionQuestions,
      currentIndex: 0,
      correctCount: 0,
      earnedXp: 0,
      answered: false
    };

    this.openQuizModal();
    this.renderCurrentQuestion();
  }

  openQuizModal() {
    const modal = document.getElementById('quiz-modal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeQuizModal() {
    const modal = document.getElementById('quiz-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    this.activeQuizSession = null;
  }

  renderCurrentQuestion() {
    if (!this.activeQuizSession) return;
    const session = this.activeQuizSession;
    const q = session.questions[session.currentIndex];
    session.answered = false;

    // Update Progress Bar
    const progress = (session.currentIndex / session.questions.length) * 100;
    const fillEl = document.getElementById('quiz-progress-fill');
    if (fillEl) fillEl.style.width = `${progress}%`;

    // Hearts
    const heartsEl = document.getElementById('quiz-hearts-val');
    if (heartsEl) heartsEl.textContent = this.userState.hearts;

    // Meta Tags
    const metaContainer = document.getElementById('quiz-meta-tags');
    if (metaContainer) {
      metaContainer.innerHTML = `
        <span class="quiz-tag category">${q.category}</span>
        <span class="quiz-tag difficulty">Nível: ${q.level} (Dificuldade ${q.difficulty}/5)</span>
        <span class="quiz-tag xp">+${q.xp || 10} JXP</span>
      `;
    }

    // Question Title
    const titleEl = document.getElementById('quiz-question-title');
    if (titleEl) titleEl.textContent = q.question;

    // Code Snippet (if any)
    const codeEl = document.getElementById('quiz-code-snippet');
    if (codeEl) {
      if (q.code) {
        codeEl.style.display = 'block';
        codeEl.textContent = q.code;
      } else {
        codeEl.style.display = 'none';
      }
    }

    // Options Grid
    const optionsGrid = document.getElementById('quiz-options-grid');
    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      const options = q.options || [];

      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
          <span>${opt}</span>
          <span class="option-key-badge">${idx + 1}</span>
        `;
        btn.addEventListener('click', () => {
          if (session.answered) return;
          if (window.soundEngine) window.soundEngine.playClick();
          optionsGrid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.checkAnswerBtnState(true);
        });
        optionsGrid.appendChild(btn);
      });
    }

    // Reset Dock
    const dock = document.getElementById('quiz-bottom-dock');
    dock.className = 'quiz-bottom-dock';
    dock.innerHTML = `
      <div class="dock-content-wrapper">
        <div class="feedback-details">
          <span style="color: var(--text-muted); font-size: 0.9rem;">Selecione a resposta correta acima</span>
        </div>
        <button id="btn-verify-answer" class="btn btn-duo" disabled>Verificar</button>
      </div>
    `;

    document.getElementById('btn-verify-answer').addEventListener('click', () => {
      this.handleVerify();
    });
  }

  checkAnswerBtnState(hasSelection) {
    const btn = document.getElementById('btn-verify-answer');
    if (btn) {
      btn.disabled = !hasSelection;
    }
  }

  handleVerify() {
    if (!this.activeQuizSession || this.activeQuizSession.answered) return;
    const session = this.activeQuizSession;
    const q = session.questions[session.currentIndex];

    const selectedBtn = document.querySelector('.option-btn.selected');
    if (!selectedBtn) return;

    session.answered = true;
    const chosenText = selectedBtn.querySelector('span').textContent.trim();
    const correctText = String(q.answer).trim();

    const isCorrect = chosenText === correctText;
    const dock = document.getElementById('quiz-bottom-dock');

    if (isCorrect) {
      if (window.soundEngine) window.soundEngine.playCorrect();
      selectedBtn.classList.add('correct-state');
      dock.className = 'quiz-bottom-dock feedback-correct';
      session.correctCount++;
      session.earnedXp += (q.xp || 10);
      this.userState.xp += (q.xp || 10);
      this.userState.solvedQuestions[q.id] = true;
      this.userState.categoryMastery[q.category] = (this.userState.categoryMastery[q.category] || 0) + 1;

      dock.innerHTML = `
        <div class="dock-content-wrapper">
          <div class="feedback-details">
            <div class="feedback-headline correct">✓ Excelente! Resposta Correta</div>
            <div class="feedback-explanation">${q.explanation || ''}</div>
            ${q.recommended_practice ? `<div class="feedback-tip">💡 <strong>Boa Prática:</strong> ${q.recommended_practice}</div>` : ''}
          </div>
          <button id="btn-next-question" class="btn btn-duo">Continuar</button>
        </div>
      `;
    } else {
      if (window.soundEngine) window.soundEngine.playIncorrect();
      selectedBtn.classList.add('incorrect-state');
      dock.className = 'quiz-bottom-dock feedback-incorrect';

      // Highlight the correct option
      document.querySelectorAll('.option-btn').forEach(btn => {
        if (btn.querySelector('span').textContent.trim() === correctText) {
          btn.classList.add('correct-state');
        }
      });

      this.userState.hearts = Math.max(0, this.userState.hearts - 1);
      const heartsEl = document.getElementById('quiz-hearts-val');
      if (heartsEl) heartsEl.textContent = this.userState.hearts;

      dock.innerHTML = `
        <div class="dock-content-wrapper">
          <div class="feedback-details">
            <div class="feedback-headline incorrect">✕ Não foi dessa vez</div>
            <div class="feedback-explanation"><strong>Resposta correta:</strong> ${correctText}</div>
            ${q.explanation ? `<div class="feedback-explanation">${q.explanation}</div>` : ''}
            ${q.common_mistake ? `<div class="feedback-tip">⚠️ <strong>Erro comum:</strong> ${q.common_mistake}</div>` : ''}
          </div>
          <button id="btn-next-question" class="btn btn-duo">Continuar</button>
        </div>
      `;
    }

    this.saveState();

    document.getElementById('btn-next-question').addEventListener('click', () => {
      this.nextQuestion();
    });
  }

  nextQuestion() {
    const session = this.activeQuizSession;
    if (!session) return;

    session.currentIndex++;
    if (session.currentIndex < session.questions.length) {
      this.renderCurrentQuestion();
    } else {
      this.finishLesson();
    }
  }

  finishLesson() {
    const session = this.activeQuizSession;
    if (!session) return;

    if (session.nodeId && !this.userState.completedLessons.includes(session.nodeId)) {
      this.userState.completedLessons.push(session.nodeId);
    }

    this.saveState();
    this.closeQuizModal();

    // Trigger Victory fanfare & confetti
    if (window.soundEngine) window.soundEngine.playVictory();
    this.showVictoryModal(session);
    this.renderPathView();
    this.renderCategoriesView();
    this.renderProfileView();
  }

  showVictoryModal(session) {
    const modal = document.getElementById('victory-modal');
    if (!modal) return;

    const accuracy = Math.round((session.correctCount / session.questions.length) * 100);
    document.getElementById('victory-xp-val').textContent = `+${session.earnedXp} JXP`;
    document.getElementById('victory-accuracy-val').textContent = `${accuracy}%`;

    modal.classList.add('active');

    // Confetti effect if confetti library exists
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    document.getElementById('btn-close-victory').onclick = () => {
      modal.classList.remove('active');
    };
  }

  bindEvents() {
    // Tab switching in Jornada Dev
    document.querySelectorAll('.jornada-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.jornada-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;
        document.getElementById('tab-path').style.display = tab === 'path' ? 'block' : 'none';
        document.getElementById('tab-categories').style.display = tab === 'categories' ? 'block' : 'none';
        document.getElementById('tab-profile').style.display = tab === 'profile' ? 'block' : 'none';
      });
    });

    // Close Quiz Modal button
    const closeBtn = document.getElementById('quiz-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeQuizModal();
      });
    }

    // Category search input
    const searchInput = document.getElementById('category-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.category-card').forEach(card => {
          const name = card.dataset.category.toLowerCase();
          card.style.display = name.includes(query) ? 'flex' : 'none';
        });
      });
    }

    // Keyboard navigation (1, 2, 3, 4 and Enter)
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('quiz-modal');
      if (!modal || !modal.classList.contains('active')) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const options = document.querySelectorAll('.option-btn');
        if (options[idx]) options[idx].click();
      } else if (e.key === 'Enter') {
        const verifyBtn = document.getElementById('btn-verify-answer');
        const nextBtn = document.getElementById('btn-next-question');
        if (nextBtn) {
          nextBtn.click();
        } else if (verifyBtn && !verifyBtn.disabled) {
          verifyBtn.click();
        }
      }
    });
  }

  getFallbackQuestions() {
    return [
      {
        id: "DJ-000001",
        category: "Fundamentos",
        skill: "variáveis",
        level: "beginner",
        difficulty: 1,
        type: "multiple_choice",
        question: "Qual opção descreve melhor o conceito fundamental de variáveis em programação?",
        options: [
          "Condicionais e laços que controlam o fluxo de instruções.",
          "Uma variável associa um nome a um valor armazenado que pode ser utilizado pelo programa.",
          "Um tipo de dado que define exclusivamente valores numéricos.",
          "Uma rotina para compilar e executar o código fonte."
        ],
        answer: "Uma variável associa um nome a um valor armazenado que pode ser utilizado pelo programa.",
        explanation: "Variáveis são identificadores que apontam para posições de memória armazenando dados manipuláveis.",
        recommended_practice: "Utilize nomes semânticos e declare constantes (const/final) quando o valor não deve mudar.",
        xp: 15
      },
      {
        id: "DJ-000002",
        category: "JavaScript",
        skill: "escopo",
        level: "beginner",
        difficulty: 2,
        type: "multiple_choice",
        question: "Qual a diferença principal entre as palavras-chave 'const' e 'let' no JavaScript ES6?",
        options: [
          "'const' cria variáveis com escopo global e 'let' com escopo de função.",
          "'const' impede a reatribuição da variável, enquanto 'let' permite reatribuições.",
          "'let' é assíncrono e 'const' é síncrono.",
          "Não há diferença prática entre elas."
        ],
        answer: "'const' impede a reatribuição da variável, enquanto 'let' permite reatribuições.",
        explanation: "'const' protege o binding da variável contra novas atribuições após a inicialização.",
        recommended_practice: "Adote 'const' por padrão e use 'let' apenas quando houver necessidade explícita de mutabilidade.",
        xp: 20
      }
    ];
  }
}

window.jornadaDev = new JornadaDev();
document.addEventListener('DOMContentLoaded', () => {
  window.jornadaDev.init();
});
