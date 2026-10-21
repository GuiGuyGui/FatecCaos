const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const target = `    standoffs9: [false, false, false, false, false, false, false, false, false],
    moboMounted: false,
    bitA: 0,
    bitB: 1,
    bitC: 1
  };
}`;

const replacement = `    standoffs9: [false, false, false, false, false, false, false, false, false],
    moboMounted: false,
    cpuLocked: false,
    bitA: 0,
    bitB: 1,
    bitC: 1,

    // Hardware Mini-Games
    dustSpots: [1, 1, 1, 1, 1, 1],
    crustScraped: [false, false, false],
    newPasteApplied: false,
    fanHairsRemoved: [false, false, false],
    fanOiled: [false, false, false],
    roachesCleared: [false, false, false, false, false],
    eggsDisinfected: false,
    bentPins: [false, false, false, false],
    oxidationCleaned: [false, false, false, false],
    cmosTested: false,
    cmosReplaced: false,
    clrCmosJumper: false,
    fittingsTightened: [false, false, false],
    bubblesPurged: false,
    gapMm: 2.5,
    voltageTen: 100,
    fanPct: 30,
    smdPads: [
      { id: 0, label: 'Fase 1 (MOSFET)', bad: true, fixed: false },
      { id: 1, label: 'Fase 2 (MOSFET)', bad: true, fixed: false },
      { id: 2, label: 'Fase 3 (MOSFET)', bad: true, fixed: false },
      { id: 3, label: 'Fase 4 (MOSFET)', bad: true, fixed: false }
    ],
    ihsRemoved: false,
    kaptonApplied: false,
    liquidMetalSpread: false,

    // Software Mini-Games
    trojans: [
      { id: 0, name: 'svch0st.exe', bad: true, quarantined: false },
      { id: 1, name: 'explorer.exe', bad: false, quarantined: false },
      { id: 2, name: 'winlogin.scr', bad: true, quarantined: false },
      { id: 3, name: 'RuntimeBroker.exe', bad: false, quarantined: false }
    ],
    cookieCategories: {
      supercookies: false,
      telemetry: false,
      shadow_history: false,
      ad_beacons: false
    },
    popups: [
      { id: 0, title: '⚠️ SEU PC ESTÁ INFECTADO COM 99 VÍRUS!', closed: false },
      { id: 1, title: '🎉 PARABÉNS! VOCÊ É O VISITANTE 1.000.000!', closed: false },
      { id: 2, title: '⚡ ACELERE SUA INTERNET EM 500% AGORA!', closed: false },
      { id: 3, title: '🛡️ ATUALIZAÇÃO CRÍTICA DO SEU NAVEGADOR!', closed: false },
      { id: 4, title: '🎁 VOCÊ GANHOU UM IPHONE 15 PRO MAX GRÁTIS!', closed: false }
    ],
    defragBlocks: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
    bsodLogs: [
      { id: 0, name: 'Dump 0x00000116 (VIDEO_TDR_ERROR)', driver: 'nvlddmkm.sys', isolated: false },
      { id: 1, name: 'Dump 0x0000007E (SYSTEM_THREAD_EXCEPTION)', driver: 'atikmpag.sys', isolated: false }
    ],
    missingDlls: [
      { id: 0, name: 'MSVCP140.dll (Visual C++ Redistributable)', fixed: false },
      { id: 1, name: 'VCRUNTIME140.dll (C++ Runtime Engine)', fixed: false },
      { id: 2, name: 'D3DCOMPILER_47.dll (DirectX Shader Compiler)', fixed: false }
    ],
    biosProgress: 0,
    voltageDial: 1.2,
    processes: [
      { id: 0, name: 'xmrig_silent.exe', cpu: '58%', malicious: true, killed: false, desc: 'Minerador Monero em segundo plano' },
      { id: 1, name: 'system_idle.exe', cpu: '0%', malicious: false, killed: false, desc: 'Processo ocioso legítimo' },
      { id: 2, name: 'cryptonight_worker.exe', cpu: '41%', malicious: true, killed: false, desc: 'Processo malicioso de injeção de CPU' },
      { id: 3, name: 'taskmgr.exe', cpu: '1%', malicious: false, killed: false, desc: 'Gerenciador de Tarefas do Windows' }
    ],
    bcdSteps: [
      { id: 0, cmd: 'bootrec /fixmbr', done: false },
      { id: 1, cmd: 'bootrec /fixboot', done: false },
      { id: 2, cmd: 'bootrec /rebuildbcd', done: false }
    ],
    dduSafeMode: false,
    dduDriverRemoved: false,
    dduRegistryCleaned: false,
    bloatwareList: [
      { id: 0, name: 'Baidu Antivirus & PC Faster (Trial Chato)', uninstalled: false },
      { id: 1, name: 'McAfee LiveSafe 30-Dias (Pop-ups Invasivos)', uninstalled: false },
      { id: 2, name: 'WildTangent Games Arcade (Jogos Piratas)', uninstalled: false },
      { id: 3, name: 'Ask.com Toolbar & Search Assistant', uninstalled: false }
    ],
    rsaHexBlocks: [
      { id: 0, code: '0x7F2A_B4', solved: false },
      { id: 1, code: '0x9C11_E0', solved: false },
      { id: 2, code: '0x3D88_F5', solved: false },
      { id: 3, code: '0xAA55_01', solved: false }
    ],
    firewallPorts: [
      { id: 0, port: 4444, name: 'Metasploit Backdoor Handler', mustBlock: true, blocked: false },
      { id: 1, port: 1337, name: 'Elite Hacker Trojan Port', mustBlock: true, blocked: false },
      { id: 2, port: 443, name: 'Tráfego Web HTTPS Criptografado', mustBlock: false, blocked: false }
    ],
    tempCleanPurged: [false, false, false, false],
    cryptoSeedUser: []
  };
}`;

const targetCRLF = target.replace(/\n/g, '\r\n');
const replacementCRLF = replacement.replace(/\n/g, '\r\n');

if (code.includes(targetCRLF)) {
  code = code.replace(targetCRLF, replacementCRLF);
  console.log("Successfully replaced with CRLF!");
} else if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Successfully replaced with LF!");
} else {
  console.error("Target NOT found in game.js!");
  process.exit(1);
}

fs.writeFileSync('game.js', code, 'utf8');
console.log("Updated game.js with complete minigame states!");
