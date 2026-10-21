/**
 * Plantão TI - Sistema Unificado de Carreira, Estatísticas & 100 Títulos
 * OmniVoid Studios © 2026
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PlantaoTIProfile = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const STORAGE_KEY = 'omnivoid_plantaoti_profile';

  // ==========================================
  // CATÁLOGO DOS 100 TÍTULOS DESBLOQUEÁVEIS
  // ==========================================
  const TITLES = [
    // 1 a 25: SOLO & FUNDAMENTOS
    { id: 1, name: 'Estagiário de Bancada', desc: 'Iniciou a carreira técnica na assistência.', cat: 'solo', check: s => true },
    { id: 2, name: 'Limpador de Memória', desc: 'Consertou seu 1º computador jogando sozinho.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 1 },
    { id: 3, name: 'Mestre da Borracha Branca', desc: 'Consertou 3 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 3 },
    { id: 4, name: 'Caçador de Poeira', desc: 'Consertou 5 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 5 },
    { id: 5, name: 'Espátula de Ouro', desc: 'Consertou 8 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 8 },
    { id: 6, name: 'Técnico de Bairro', desc: 'Consertou 12 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 12 },
    { id: 7, name: 'Decodificador de Bips', desc: 'Consertou 15 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 15 },
    { id: 8, name: 'Especialista em POST', desc: 'Consertou 20 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 20 },
    { id: 9, name: 'Desmistificador de BSoD', desc: 'Consertou 25 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 25 },
    { id: 10, name: 'Exterminador de Trojan', desc: 'Consertou 30 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 30 },
    { id: 11, name: 'Cirurgião de Placa-Mãe', desc: 'Consertou 35 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 35 },
    { id: 12, name: 'Amigo dos Jumpers', desc: 'Consertou 40 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 40 },
    { id: 13, name: 'Formatador Nato', desc: 'Consertou 50 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 50 },
    { id: 14, name: 'Resgatador de Arquivos', desc: 'Consertou 60 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 60 },
    { id: 15, name: 'Mão Firme na Solda', desc: 'Consertou 70 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 70 },
    { id: 16, name: 'Guardião da Pilha CMOS', desc: 'Consertou 80 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 80 },
    { id: 17, name: 'Consultor de Hardware', desc: 'Consertou 90 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 90 },
    { id: 18, name: 'Mestre do Silício', desc: 'Consertou 100 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 100 },
    { id: 19, name: 'Especialista em Pasta Prata', desc: 'Consertou 115 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 115 },
    { id: 20, name: 'Inspetor de Capacitores', desc: 'Consertou 130 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 130 },
    { id: 21, name: 'Mestre dos Cabos Modulares', desc: 'Consertou 150 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 150 },
    { id: 22, name: 'Guru do Airflow', desc: 'Consertou 175 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 175 },
    { id: 23, name: 'Engenheiro de Bancada Solo', desc: 'Consertou 200 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 200 },
    { id: 24, name: 'Ás da Preventiva', desc: 'Consertou 250 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 250 },
    { id: 25, name: 'Patriarca da Assistência', desc: 'Consertou 300 computadores solo.', cat: 'solo', check: s => (s.repairedSolo || 0) >= 300 },

    // 26 a 50: DUO (JOGANDO COM 1 JOGADOR JUNTO)
    { id: 26, name: 'Parceria Inaugural', desc: 'Consertou 1 computador jogando em dupla (com 1 parceiro).', cat: 'duo', check: s => (s.repairedDuo || 0) >= 1 },
    { id: 27, name: 'Dupla Dinâmica da TI', desc: 'Consertou 3 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 3 },
    { id: 28, name: 'Sintonia em Dobro', desc: 'Consertou 5 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 5 },
    { id: 29, name: 'Linha de Montagem a Dois', desc: 'Consertou 8 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 8 },
    { id: 30, name: 'Multímetro Compartilhado', desc: 'Consertou 10 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 10 },
    { id: 31, name: 'Técnico e Auxiliar de Elite', desc: 'Consertou 12 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 12 },
    { id: 32, name: 'Suporte em Duas Frentes', desc: 'Consertou 15 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 15 },
    { id: 33, name: 'Troca Ágil de Ferramentas', desc: 'Consertou 18 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 18 },
    { id: 34, name: 'Par de Chaves Philips', desc: 'Consertou 20 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 20 },
    { id: 35, name: 'Operação em Espelho', desc: 'Consertou 25 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 25 },
    { id: 36, name: 'Diagnóstico Cruzado', desc: 'Consertou 30 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 30 },
    { id: 37, name: 'Bancada Colaborativa Duo', desc: 'Consertou 35 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 35 },
    { id: 38, name: 'Socorro Técnico Relâmpago', desc: 'Consertou 40 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 40 },
    { id: 39, name: 'Divisão Perfeita de Tarefas', desc: 'Consertou 45 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 45 },
    { id: 40, name: 'Padrão Ouro de Produtividade', desc: 'Consertou 50 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 50 },
    { id: 41, name: 'Irmãos de Chave de Fenda', desc: 'Consertou 55 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 55 },
    { id: 42, name: 'Blindagem a Dois', desc: 'Consertou 60 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 60 },
    { id: 43, name: 'Resgate Concorrente Duo', desc: 'Consertou 70 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 70 },
    { id: 44, name: 'Quatro Olhos no Circuito', desc: 'Consertou 80 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 80 },
    { id: 45, name: 'Parceria Inabalável', desc: 'Consertou 90 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 90 },
    { id: 46, name: 'Mestres do Suporte Nível 2', desc: 'Consertou 100 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 100 },
    { id: 47, name: 'Dupla Campeã da Oficina', desc: 'Consertou 120 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 120 },
    { id: 48, name: 'Engenheiros Siameses', desc: 'Consertou 140 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 140 },
    { id: 49, name: 'Sinergia Quântica', desc: 'Consertou 160 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 160 },
    { id: 50, name: 'Lendas do Modo Duo', desc: 'Consertou 200 computadores jogando com 1 parceiro.', cat: 'duo', check: s => (s.repairedDuo || 0) >= 200 },

    // 51 a 75: TRIO (JOGANDO COM 2 JOGADORES JUNTOS)
    { id: 51, name: 'Trindade do Suporte', desc: 'Consertou 1 computador jogando com 2 parceiros (trio).', cat: 'trio', check: s => (s.repairedTrio || 0) >= 1 },
    { id: 52, name: 'Trio Elétrico de TI', desc: 'Consertou 3 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 3 },
    { id: 53, name: 'Esquadrão Tríplice', desc: 'Consertou 5 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 5 },
    { id: 54, name: 'Força-Tarefa de Bancada', desc: 'Consertou 8 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 8 },
    { id: 55, name: 'Ordem dos Três Resistores', desc: 'Consertou 10 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 10 },
    { id: 56, name: 'Triunvirato dos Chips', desc: 'Consertou 12 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 12 },
    { id: 57, name: 'Três Cabos, Uma Missão', desc: 'Consertou 15 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 15 },
    { id: 58, name: 'Engenharia Triangular', desc: 'Consertou 18 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 18 },
    { id: 59, name: 'Defesa em Três Frentes', desc: 'Consertou 20 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 20 },
    { id: 60, name: 'Sindicato dos 3 Técnicos', desc: 'Consertou 25 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 25 },
    { id: 61, name: 'Trio Sem Folga', desc: 'Consertou 30 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 30 },
    { id: 62, name: 'Harmonia Trifásica', desc: 'Consertou 35 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 35 },
    { id: 63, name: 'Aliança dos Três Slots', desc: 'Consertou 40 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 40 },
    { id: 64, name: 'Protocolo de Emergência 3P', desc: 'Consertou 45 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 45 },
    { id: 65, name: 'Mestres do Rack Triplo', desc: 'Consertou 50 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 50 },
    { id: 66, name: 'Tríade de Silício', desc: 'Consertou 55 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 55 },
    { id: 67, name: 'Resgate em 3 Etapas', desc: 'Consertou 60 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 60 },
    { id: 68, name: 'Comitê de Alta Velocidade', desc: 'Consertou 70 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 70 },
    { id: 69, name: 'Linha Tríplice de Produção', desc: 'Consertou 80 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 80 },
    { id: 70, name: 'Terno de Ases da TI', desc: 'Consertou 90 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 90 },
    { id: 71, name: 'Esquadrão Delta de Hardware', desc: 'Consertou 100 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 100 },
    { id: 72, name: 'Panteão dos Três Mestres', desc: 'Consertou 120 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 120 },
    { id: 73, name: 'Vórtice Triplo de Reparo', desc: 'Consertou 140 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 140 },
    { id: 74, name: 'Trindade Invicta', desc: 'Consertou 160 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 160 },
    { id: 75, name: 'Soberanos do Modo Trio', desc: 'Consertou 200 computadores jogando com 2 parceiros.', cat: 'trio', check: s => (s.repairedTrio || 0) >= 200 },

    // 76 a 85: SQUAD / 4 JOGADORES (HOST + 3 FUNCIONÁRIOS)
    { id: 76, name: 'Quarteto Fantástico', desc: 'Consertou 1 computador com a equipe de 4 técnicos completa.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 1 },
    { id: 77, name: 'Batalhão de Suporte', desc: 'Consertou 3 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 3 },
    { id: 78, name: 'Loja a Todo Vapor', desc: 'Consertou 5 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 5 },
    { id: 79, name: 'Gestão Corporativa', desc: 'Consertou 10 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 10 },
    { id: 80, name: 'Oficina Lotada, Caixa Alto', desc: 'Consertou 15 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 15 },
    { id: 81, name: 'Central NOC das Quatro Salas', desc: 'Consertou 20 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 20 },
    { id: 82, name: 'Quatro Mestres do Firmware', desc: 'Consertou 30 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 30 },
    { id: 83, name: 'Mega Corporação de Suporte', desc: 'Consertou 40 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 40 },
    { id: 84, name: 'Esquadrão Supremo 4P', desc: 'Consertou 50 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 50 },
    { id: 85, name: 'Império das Quatro Cabines', desc: 'Consertou 100 computadores com 4 técnicos na oficina.', cat: 'squad', check: s => (s.repairedSquad || 0) >= 100 },

    // 86 a 100: REPUTAÇÃO, QUEIMAS, TEMPO E NÍVEL LENTO
    { id: 86, name: 'Primeira Fagulha', desc: 'Queimou seu 1º computador (aprendizado doloroso!).', cat: 'resilience', check: s => (s.burntCount || 0) >= 1 },
    { id: 87, name: 'Sobrevivente do Curto', desc: 'Queimou 3 equipamentos e não desistiu da profissão.', cat: 'resilience', check: s => (s.burntCount || 0) >= 3 },
    { id: 88, name: 'Fênix do Capacitor', desc: 'Recuperou a reputação da loja após registrar queimas.', cat: 'resilience', check: s => (s.burntCount || 0) >= 1 && (s.currentReputation || 0) >= 80 },
    { id: 89, name: 'Técnico Cuidadoso', desc: 'Arrumou 20 computadores mantendo menos de 2 queimados.', cat: 'resilience', check: s => (s.repairedTotal || 0) >= 20 && (s.burntCount || 0) <= 1 },
    { id: 90, name: 'Cirurgião Sem Falhas', desc: 'Arrumou 50 computadores sem queimar nenhum.', cat: 'resilience', check: s => (s.repairedTotal || 0) >= 50 && (s.burntCount || 0) === 0 },
    { id: 91, name: 'Dedicação de Bancada', desc: 'Acumulou 15 minutos jogados na oficina.', cat: 'time', check: s => (s.totalSecondsPlayed || 0) >= 900 },
    { id: 92, name: 'Turno Noturno', desc: 'Acumulou 1 hora total de jogo.', cat: 'time', check: s => (s.totalSecondsPlayed || 0) >= 3600 },
    { id: 93, name: 'Maratonista do Hardware', desc: 'Acumulou 3 horas totais de jogo.', cat: 'time', check: s => (s.totalSecondsPlayed || 0) >= 10800 },
    { id: 94, name: 'Veterano do Suporte 24/7', desc: 'Acumulou 5 horas totais de jogo.', cat: 'time', check: s => (s.totalSecondsPlayed || 0) >= 18000 },
    { id: 95, name: 'Bem Avaliado no Google', desc: 'Manteve reputação média acima de 80%.', cat: 'reputation', check: s => (s.currentReputation || 0) >= 80 },
    { id: 96, name: 'Cinco Estrelas Inabalável', desc: 'Alcançou e manteve 95% de reputação.', cat: 'reputation', check: s => (s.currentReputation || 0) >= 95 },
    { id: 97, name: 'Técnico Nível 5', desc: 'Alcançou o Nível Geral 5 (progressão lenta).', cat: 'level', check: s => (s.level || 1) >= 5 },
    { id: 98, name: 'Técnico Nível 10', desc: 'Alcançou o Nível Geral 10.', cat: 'level', check: s => (s.level || 1) >= 10 },
    { id: 99, name: 'Engenheiro Sênior Nível 20', desc: 'Alcançou o Nível Geral 20.', cat: 'level', check: s => (s.level || 1) >= 20 },
    { id: 100, name: 'Lenda Suprema da Manutenção', desc: 'Arrumou 300+ PCs totais e atingiu Nível 15+.', cat: 'master', check: s => (s.repairedTotal || 0) >= 300 && (s.level || 1) >= 15 }
  ];

  // ==========================================
  // PROGRESSÃO DE NÍVEL GERAL LENTA
  // ==========================================
  // Nível N requer: floor(120 * (N ^ 1.65)) XP acumulado
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
  // CARREGAR E SALVAR ESTADO
  // ==========================================
  function loadStats() {
    let stats = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stats = JSON.parse(raw);
    } catch (e) {}

    if (!stats || typeof stats !== 'object') {
      stats = {
        repairedTotal: 0,
        repairedSolo: 0,
        repairedDuo: 0,
        repairedTrio: 0,
        repairedSquad: 0,
        burntCount: 0,
        totalSecondsPlayed: 0,
        currentReputation: 70,
        repSum: 70,
        repSamples: 1,
        xp: 0,
        level: 1,
        unlockedTitles: [1],
        equippedTitle: 'Estagiário de Bancada',
        sessionsCount: 1,
        lastUpdated: new Date().toISOString()
      };
    }

    // Garante tipos numéricos
    stats.repairedTotal = Number(stats.repairedTotal || 0);
    stats.repairedSolo = Number(stats.repairedSolo || 0);
    stats.repairedDuo = Number(stats.repairedDuo || 0);
    stats.repairedTrio = Number(stats.repairedTrio || 0);
    stats.repairedSquad = Number(stats.repairedSquad || 0);
    stats.burntCount = Number(stats.burntCount || 0);
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
      stats.equippedTitle = 'Estagiário de Bancada';
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
      // Dispara evento para telas ouvintes (perfil, jogo, iframe)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('plantaoti_stats_changed', { detail: stats }));
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
  // DISPARADORES DE EVENTOS DO JOGO
  // ==========================================
  function recordRepair({ coopPlayers = 1, repGain = 1, wasBurntRecovery = false } = {}) {
    const stats = loadStats();
    stats.repairedTotal++;

    // Classifica por número de jogadores na sessão
    if (coopPlayers === 2) {
      stats.repairedDuo++;
      stats.xp += 25; // Bônus Duo
    } else if (coopPlayers === 3) {
      stats.repairedTrio++;
      stats.xp += 35; // Bônus Trio
    } else if (coopPlayers >= 4) {
      stats.repairedSquad++;
      stats.xp += 45; // Bônus Equipe Completa
    } else {
      stats.repairedSolo++;
      stats.xp += 15; // Solo Padrão
    }

    if (wasBurntRecovery) {
      stats.xp += 20; // Bônus de resgate heroico
    }

    // Reputação
    stats.currentReputation = Math.min(100, Math.max(0, stats.currentReputation + repGain));
    stats.repSum += stats.currentReputation;
    stats.repSamples++;

    saveStats(stats);
    return stats;
  }

  function recordBurn() {
    const stats = loadStats();
    stats.burntCount++;
    stats.currentReputation = Math.max(0, stats.currentReputation - 30);
    stats.repSum += stats.currentReputation;
    stats.repSamples++;

    saveStats(stats);
    return stats;
  }

  function recordSeconds(secs = 1) {
    const stats = loadStats();
    stats.totalSecondsPlayed += secs;
    // A cada minuto na bancada ganha 1 XP lento
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
    saveStats,
    recordRepair,
    recordBurn,
    recordSeconds,
    equipTitle,
    calculateLevelData,
    formatTime
  };
});
