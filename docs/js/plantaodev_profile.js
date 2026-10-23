/**
 * Plantão Dev - Sistema Unificado de Carreira, Estatísticas & 100 Títulos
 * OmniVoid Studios © 2026
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PlantaoDevProfile = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const STORAGE_KEY = 'omnivoid_plantaodev_profile';

  // ==========================================
  // CATÁLOGO DOS 100 TÍTULOS DESBLOQUEÁVEIS (PLANTÃO DEV)
  // ==========================================
  const TITLES = [
    // 1 a 25: SOLO & FUNDAMENTOS DEV
    { id: 1, name: 'Estagiário Dev', desc: 'Iniciou a carreira na Software House.', cat: 'solo', check: s => true },
    { id: 2, name: 'Primeiro Hello World', desc: 'Entregou seu 1º software jogando sozinho.', cat: 'solo', check: s => (s.developedSolo || 0) >= 1 },
    { id: 3, name: 'Caçador de Ponto-e-Vírgula', desc: 'Entregou 3 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 3 },
    { id: 4, name: 'Mestre do CSS Flexbox', desc: 'Entregou 5 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 5 },
    { id: 5, name: 'Dev Front-End Júnior', desc: 'Entregou 8 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 8 },
    { id: 6, name: 'Domador de Loops', desc: 'Entregou 12 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 12 },
    { id: 7, name: 'Mestre das Funções Puras', desc: 'Entregou 15 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 15 },
    { id: 8, name: 'Alquimista do JavaScript', desc: 'Entregou 20 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 20 },
    { id: 9, name: 'Arquiteto de CRUDs', desc: 'Entregou 25 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 25 },
    { id: 10, name: 'Especialista em REST APIs', desc: 'Entregou 30 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 30 },
    { id: 11, name: 'Mágico do LocalStorage', desc: 'Entregou 35 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 35 },
    { id: 12, name: 'Engenheiro de Queries SQL', desc: 'Entregou 40 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 40 },
    { id: 13, name: 'Domador de Async/Await', desc: 'Entregou 50 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 50 },
    { id: 14, name: 'Mestre do Git Rebase', desc: 'Entregou 60 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 60 },
    { id: 15, name: 'Dev Fullstack Solo', desc: 'Entregou 70 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 70 },
    { id: 16, name: 'Guardião dos Webhooks', desc: 'Entregou 80 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 80 },
    { id: 17, name: 'Arquiteto de Componentes', desc: 'Entregou 90 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 90 },
    { id: 18, name: 'Mestre dos Microsserviços', desc: 'Entregou 100 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 100 },
    { id: 19, name: 'Engenheiro de Alta Concorrência', desc: 'Entregou 115 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 115 },
    { id: 20, name: 'Mago dos Design Patterns', desc: 'Entregou 130 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 130 },
    { id: 21, name: 'Guardião dos Tokens JWT', desc: 'Entregou 150 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 150 },
    { id: 22, name: 'Guru do Clean Code', desc: 'Entregou 175 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 175 },
    { id: 23, name: 'Desenvolvedor Sênior Solo', desc: 'Entregou 200 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 200 },
    { id: 24, name: 'Mestre da Resiliência de Código', desc: 'Entregou 250 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 250 },
    { id: 25, name: 'Patriarca do Silício & Software', desc: 'Entregou 300 softwares solo.', cat: 'solo', check: s => (s.developedSolo || 0) >= 300 },

    // 26 a 50: DUO (PAIR PROGRAMMING / 1 PARCEIRO)
    { id: 26, name: 'Primeiro Pair Programming', desc: 'Desenvolveu 1 software em dupla com 1 colega dev.', cat: 'duo', check: s => (s.developedDuo || 0) >= 1 },
    { id: 27, name: 'Dupla Dinâmica do Git', desc: 'Desenvolveu 3 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 3 },
    { id: 28, name: 'Code Review a Dois', desc: 'Desenvolveu 5 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 5 },
    { id: 29, name: 'Ping-Pong de Commits', desc: 'Desenvolveu 8 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 8 },
    { id: 30, name: 'Mestre do Fork & Pull', desc: 'Desenvolveu 10 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 10 },
    { id: 31, name: 'Front & Back em Sintonia', desc: 'Desenvolveu 12 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 12 },
    { id: 32, name: 'Sprint em Duas Frentes', desc: 'Desenvolveu 15 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 15 },
    { id: 33, name: 'Refatoração em Dupla', desc: 'Desenvolveu 18 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 18 },
    { id: 34, name: 'Par de Chaves SSH', desc: 'Desenvolveu 20 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 20 },
    { id: 35, name: 'Merge Sem Conflitos', desc: 'Desenvolveu 25 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 25 },
    { id: 36, name: 'Auditoria Cruzada de Código', desc: 'Desenvolveu 30 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 30 },
    { id: 37, name: 'Estação de Dev Colaborativa', desc: 'Desenvolveu 35 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 35 },
    { id: 38, name: 'Hotfix Relâmpago a Dois', desc: 'Desenvolveu 40 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 40 },
    { id: 39, name: 'Divisão Perfeita de Tarefas Dev', desc: 'Desenvolveu 45 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 45 },
    { id: 40, name: 'Padrão Ouro de Entrega Duo', desc: 'Desenvolveu 50 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 50 },
    { id: 41, name: 'Irmãos de Terminal Bash', desc: 'Desenvolveu 55 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 55 },
    { id: 42, name: 'Blindagem de API a Dois', desc: 'Desenvolveu 60 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 60 },
    { id: 43, name: 'Deploy Concorrente Duo', desc: 'Desenvolveu 70 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 70 },
    { id: 44, name: 'Quatro Olhos no Pull Request', desc: 'Desenvolveu 80 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 80 },
    { id: 45, name: 'Parceria Inabalável de Código', desc: 'Desenvolveu 90 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 90 },
    { id: 46, name: 'Mestres da Engenharia Ágil', desc: 'Desenvolveu 100 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 100 },
    { id: 47, name: 'Dupla Campeã do Hackathon', desc: 'Desenvolveu 120 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 120 },
    { id: 48, name: 'Arquitetos Siameses', desc: 'Desenvolveu 140 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 140 },
    { id: 49, name: 'Aliança Inquebrável de Software', desc: 'Desenvolveu 160 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 160 },
    { id: 50, name: 'Soberanos do Pair Programming', desc: 'Desenvolveu 200 softwares jogando com 1 parceiro.', cat: 'duo', check: s => (s.developedDuo || 0) >= 200 },

    // 51 a 75: TRIO (TRIUNVIRATO FULLSTACK / 2 PARCEIROS)
    { id: 51, name: 'Trio Inaugural de Sprints', desc: 'Desenvolveu 1 software com equipe de 3 devs.', cat: 'trio', check: s => (s.developedTrio || 0) >= 1 },
    { id: 52, name: 'Tríade dos Microsserviços', desc: 'Desenvolveu 3 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 3 },
    { id: 53, name: 'Engenharia Triangular', desc: 'Desenvolveu 5 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 5 },
    { id: 54, name: 'Front, Back e Banco', desc: 'Desenvolveu 8 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 8 },
    { id: 55, name: 'Equipe de Três Terminais', desc: 'Desenvolveu 10 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 10 },
    { id: 56, name: 'Triunvirato do Código Limpo', desc: 'Desenvolveu 12 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 12 },
    { id: 57, name: 'Três Commits, Um Deploy', desc: 'Desenvolveu 15 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 15 },
    { id: 58, name: 'Arquitetura em Três Camadas', desc: 'Desenvolveu 18 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 18 },
    { id: 59, name: 'Defesa em Três Frentes de API', desc: 'Desenvolveu 20 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 20 },
    { id: 60, name: 'Sindicato dos 3 Devs', desc: 'Desenvolveu 25 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 25 },
    { id: 61, name: 'Trio Sem Downtime', desc: 'Desenvolveu 30 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 30 },
    { id: 62, name: 'Harmonia Trifásica de Software', desc: 'Desenvolveu 35 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 35 },
    { id: 63, name: 'Aliança dos Três Repositórios', desc: 'Desenvolveu 40 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 40 },
    { id: 64, name: 'Protocolo de Emergência 3P Dev', desc: 'Desenvolveu 45 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 45 },
    { id: 65, name: 'Mestres do Pipeline Triplo', desc: 'Desenvolveu 50 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 50 },
    { id: 66, name: 'Tríade de Algoritmos', desc: 'Desenvolveu 55 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 55 },
    { id: 67, name: 'Desenvolvimento em 3 Etapas', desc: 'Desenvolveu 60 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 60 },
    { id: 68, name: 'Comitê de Alta Performance Tech', desc: 'Desenvolveu 70 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 70 },
    { id: 69, name: 'Linha Tríplice de Produção de Código', desc: 'Desenvolveu 80 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 80 },
    { id: 70, name: 'Terno de Ases da Programação', desc: 'Desenvolveu 90 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 90 },
    { id: 71, name: 'Esquadrão Delta de Software', desc: 'Desenvolveu 100 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 100 },
    { id: 72, name: 'Panteão dos Três Mestres Dev', desc: 'Desenvolveu 120 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 120 },
    { id: 73, name: 'Vórtice Triplo de Release', desc: 'Desenvolveu 140 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 140 },
    { id: 74, name: 'Trindade Invicta de Deploy', desc: 'Desenvolveu 160 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 160 },
    { id: 75, name: 'Soberanos do Modo Trio Dev', desc: 'Desenvolveu 200 softwares jogando com 2 parceiros.', cat: 'trio', check: s => (s.developedTrio || 0) >= 200 },

    // 76 a 85: SQUAD (4 DEVS - TECH LEAD + 3 PROGRAMADORES)
    { id: 76, name: 'Quarteto Fantástico Dev', desc: 'Desenvolveu 1 software com a equipe completa de 4 programadores.', cat: 'squad', check: s => (s.developedSquad || 0) >= 1 },
    { id: 77, name: 'Batalhão de Desenvolvimento', desc: 'Desenvolveu 3 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 3 },
    { id: 78, name: 'Software House a Todo Vapor', desc: 'Desenvolveu 5 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 5 },
    { id: 79, name: 'Gestão de Engenharia de Elite', desc: 'Desenvolveu 10 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 10 },
    { id: 80, name: 'Fábrica de Software Lotada', desc: 'Desenvolveu 15 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 15 },
    { id: 81, name: 'War Room das Quatro Estações', desc: 'Desenvolveu 20 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 20 },
    { id: 82, name: 'Quatro Mestres da Nuvem', desc: 'Desenvolveu 30 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 30 },
    { id: 83, name: 'Mega Corporação Tech', desc: 'Desenvolveu 40 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 40 },
    { id: 84, name: 'Squad Supremo 4P Dev', desc: 'Desenvolveu 50 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 50 },
    { id: 85, name: 'Império das Quatro Cabines Dev', desc: 'Desenvolveu 100 softwares com 4 devs na Software House.', cat: 'squad', check: s => (s.developedSquad || 0) >= 100 },

    // 86 a 100: RESILIÊNCIA, CRASHES, TEMPO, REPUTAÇÃO E NÍVEL LENTO
    { id: 86, name: 'Primeiro Erro 500', desc: 'Sofreu seu 1º Crash Crítico em produção (aprendizado doloroso!).', cat: 'resilience', check: s => (s.crashCount || 0) >= 1 },
    { id: 87, name: 'Sobrevivente do Crash', desc: 'Teve 3 bugs críticos em produção e continuou codificando.', cat: 'resilience', check: s => (s.crashCount || 0) >= 3 },
    { id: 88, name: 'Fênix do Rollback', desc: 'Recuperou a reputação da Software House após registrar crashes.', cat: 'resilience', check: s => (s.crashCount || 0) >= 1 && (s.currentReputation || 0) >= 80 },
    { id: 89, name: 'Dev Cuidadoso', desc: 'Desenvolveu 20 softwares com no máximo 1 crash em produção.', cat: 'resilience', check: s => (s.developedTotal || 0) >= 20 && (s.crashCount || 0) <= 1 },
    { id: 90, name: 'Cirurgião Sem Bugs', desc: 'Desenvolveu 50 softwares sem derrubar a produção nenhuma vez.', cat: 'resilience', check: s => (s.developedTotal || 0) >= 50 && (s.crashCount || 0) === 0 },
    { id: 91, name: 'Dedicação de Terminal', desc: 'Acumulou 15 minutos codificando na Software House.', cat: 'time', check: s => (s.totalSecondsPlayed || 0) >= 900 },
    { id: 92, name: 'Madrugada de Código', desc: 'Acumulou 1 hora total desenvolvendo.', cat: 'time', check: s => (s.totalSecondsPlayed || 0) >= 3600 },
    { id: 93, name: 'Maratonista do Teclado', desc: 'Acumulou 3 horas totais desenvolvendo softwares.', cat: 'time', check: s => (s.totalSecondsPlayed || 0) >= 10800 },
    { id: 94, name: 'Veterano do Suporte 24/7', desc: 'Acumulou 5 horas totais de desenvolvimento.', cat: 'time', check: s => (s.totalSecondsPlayed || 0) >= 18000 },
    { id: 95, name: 'Software House 5 Estrelas', desc: 'Manteve reputação média acima de 80%.', cat: 'reputation', check: s => (s.currentReputation || 0) >= 80 },
    { id: 96, name: 'SLA de 99.9% Inabalável', desc: 'Alcançou e manteve 95% de reputação na Software House.', cat: 'reputation', check: s => (s.currentReputation || 0) >= 95 },
    { id: 97, name: 'Desenvolvedor Nível 5', desc: 'Alcançou o Nível Geral 5 (progressão própria dev).', cat: 'level', check: s => (s.level || 1) >= 5 },
    { id: 98, name: 'Engenheiro Pleno Nível 10', desc: 'Alcançou o Nível Geral 10.', cat: 'level', check: s => (s.level || 1) >= 10 },
    { id: 99, name: 'Tech Lead Sênior Nível 20', desc: 'Alcançou o Nível Geral 20.', cat: 'level', check: s => (s.level || 1) >= 20 },
    { id: 100, name: 'CTO Lendário da Engenharia', desc: 'Entregou 300+ softwares e atingiu Nível 15+.', cat: 'master', check: s => (s.developedTotal || 0) >= 300 && (s.level || 1) >= 15 }
  ];

  // ==========================================
  // PROGRESSÃO DE NÍVEL GERAL LENTA
  // ==========================================
  function getXpRequiredForLevel(lvl) {
    if (lvl <= 1) return 0;
    return Math.floor(120 * Math.pow(lvl - 1, 1.65));
  }

  function calculateLevelData(totalXp) {
    const xp = Math.max(0, totalXp || 0);
    let lvl = 1;
    while (lvl < 100) {
      const nextXp = getXpRequiredForLevel(lvl + 1);
      if (xp >= nextXp) {
        lvl++;
      } else {
        break;
      }
    }
    const currentBaseXp = getXpRequiredForLevel(lvl);
    const nextLevelXp = getXpRequiredForLevel(lvl + 1);
    const needed = Math.max(1, nextLevelXp - currentBaseXp);
    const progress = Math.max(0, xp - currentBaseXp);
    const percent = Math.min(100, Math.floor((progress / needed) * 100));

    return {
      level: lvl,
      currentXp: xp,
      progressInLevel: progress,
      xpForNextLevel: needed,
      totalForNextLevel: nextLevelXp,
      percent: percent
    };
  }

  // ==========================================
  // CARREGAR E SALVAR ESTADO VINCULADO AO USUÁRIO
  // ==========================================
  function loadStats() {
    let stats = null;
    try {
      // Prioridade: dados salvos no usuário logado
      const currUserRaw = localStorage.getItem('omnivoid_current_user') || localStorage.getItem('omnivoid_user');
      if (currUserRaw) {
        const u = JSON.parse(currUserRaw);
        if (u && u.plantaoDev && typeof u.plantaoDev === 'object') {
          stats = u.plantaoDev;
        }
      }

      if (!stats) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) stats = JSON.parse(raw);
      }
    } catch (e) {}

    if (!stats || typeof stats !== 'object') {
      stats = {
        developedTotal: 0,
        developedSolo: 0,
        developedDuo: 0,
        developedTrio: 0,
        developedSquad: 0,
        crashCount: 0,
        totalSecondsPlayed: 0,
        currentReputation: 70,
        repSum: 70,
        repSamples: 1,
        xp: 0,
        level: 1,
        unlockedTitles: [1],
        equippedTitle: 'Estagiário Dev',
        sessionsCount: 1,
        lastUpdated: new Date().toISOString()
      };
    }

    // Normaliza tipos numéricos
    stats.developedTotal = Number(stats.developedTotal || 0);
    stats.developedSolo = Number(stats.developedSolo || 0);
    stats.developedDuo = Number(stats.developedDuo || 0);
    stats.developedTrio = Number(stats.developedTrio || 0);
    stats.developedSquad = Number(stats.developedSquad || 0);
    stats.crashCount = Number(stats.crashCount || 0);
    stats.totalSecondsPlayed = Number(stats.totalSecondsPlayed || 0);
    stats.currentReputation = Number(stats.currentReputation !== undefined ? stats.currentReputation : 70);
    stats.repSum = Number(stats.repSum || 70);
    stats.repSamples = Number(stats.repSamples || 1);
    stats.xp = Number(stats.xp || 0);

    const lvlData = calculateLevelData(stats.xp);
    stats.level = lvlData.level;

    if (!Array.isArray(stats.unlockedTitles) || stats.unlockedTitles.length === 0) {
      stats.unlockedTitles = [1];
    }
    if (!stats.equippedTitle) {
      stats.equippedTitle = 'Estagiário Dev';
    }

    return stats;
  }

  function saveStats(stats) {
    if (!stats) return;
    stats.lastUpdated = new Date().toISOString();
    const lvlData = calculateLevelData(stats.xp);
    stats.level = lvlData.level;

    // Avalia desbloqueio de títulos
    checkTitleUnlocks(stats);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

      // Sincroniza diretamente na conta do usuário logado
      const currUserRaw = localStorage.getItem('omnivoid_current_user') || localStorage.getItem('omnivoid_user');
      if (currUserRaw) {
        const u = JSON.parse(currUserRaw);
        if (u) {
          u.plantaoDev = stats;
          localStorage.setItem('omnivoid_current_user', JSON.stringify(u));
          localStorage.setItem('omnivoid_user', JSON.stringify(u));

          // Atualiza banco de usuários registrados
          const dbRaw = localStorage.getItem('omnivoid_users_db');
          if (dbRaw) {
            let db = JSON.parse(dbRaw);
            let idx = db.findIndex(item => item.email === u.email || item.nickname === u.nickname);
            if (idx !== -1) {
              db[idx].plantaoDev = stats;
              localStorage.setItem('omnivoid_users_db', JSON.stringify(db));
            }
          }
        }
      }

      // Dispara evento para telas ouvintes (perfil, jogo, iframe)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('plantaodev_stats_changed', { detail: stats }));
      }
    } catch (e) {}
  }

  function checkTitleUnlocks(stats) {
    const unlockedSet = new Set(stats.unlockedTitles || []);
    let newUnlock = false;

    TITLES.forEach(t => {
      if (!unlockedSet.has(t.id)) {
        try {
          if (t.check(stats)) {
            unlockedSet.add(t.id);
            newUnlock = true;
          }
        } catch (e) {}
      }
    });

    if (newUnlock) {
      stats.unlockedTitles = Array.from(unlockedSet).sort((a, b) => a - b);
    }
    return newUnlock;
  }

  // ==========================================
  // DISPARADORES DE EVENTOS DO JOGO DEV
  // ==========================================
  function recordProject({ coopPlayers = 1, repGain = 1, wasCrashRecovery = false, tier = 1, isHybrid = false } = {}) {
    const stats = loadStats();
    stats.developedTotal++;

    // Classifica por número de jogadores na sessão
    if (coopPlayers === 2) {
      stats.developedDuo++;
      stats.xp += 25; // Bônus Duo
    } else if (coopPlayers === 3) {
      stats.developedTrio++;
      stats.xp += 35; // Bônus Trio
    } else if (coopPlayers >= 4) {
      stats.developedSquad++;
      stats.xp += 45; // Bônus Equipe Completa
    } else {
      stats.developedSolo++;
      stats.xp += 15; // Solo Padrão
    }

    // Bônus escalonado por Dificuldade / Tier do Projeto
    const tierBonusXp = { 1: 0, 2: 8, 3: 18, 4: 32, 5: 55 };
    stats.xp += (tierBonusXp[tier] || 0);

    if (isHybrid) {
      stats.xp += 45; // Mega bônus de Projeto Híbrido Multietapa (Frontend + Backend/DevOps)
    }

    if (wasCrashRecovery) {
      stats.xp += 20; // Bônus de resgate heroico pós-crash
    }

    // Reputação
    stats.currentReputation = Math.min(100, Math.max(0, stats.currentReputation + repGain));
    stats.repSum += stats.currentReputation;
    stats.repSamples++;

    saveStats(stats);
    return stats;
  }

  function recordCrash() {
    const stats = loadStats();
    stats.crashCount++;
    stats.currentReputation = Math.max(0, stats.currentReputation - 30);
    stats.repSum += stats.currentReputation;
    stats.repSamples++;

    saveStats(stats);
    return stats;
  }

  function recordSeconds(secs = 1) {
    const stats = loadStats();
    stats.totalSecondsPlayed += secs;
    if (stats.totalSecondsPlayed % 60 === 0) {
      stats.xp += 1;
    }
    saveStats(stats);
    return stats;
  }

  function equipTitle(titleId) {
    const stats = loadStats();
    const t = TITLES.find(x => x.id === Number(titleId));
    if (!t) return false;
    if (!(stats.unlockedTitles || []).includes(t.id)) return false;

    stats.equippedTitle = t.name;
    saveStats(stats);
    return true;
  }

  function formatTime(totalSeconds) {
    const s = Math.max(0, totalSeconds || 0);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} min`;
  }

  return {
    TITLES,
    loadStats,
    getStats: loadStats,
    saveStats,
    recordProject,
    recordCrash,
    recordSeconds,
    equipTitle,
    calculateLevelData,
    formatTime
  };
});
