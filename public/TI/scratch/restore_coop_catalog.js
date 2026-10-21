const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

const coopCatalogCode = `
function buildClientExitPath(c) {
  const map = currentMap();
  const exitX = (map && map.exitPos) ? map.exitPos.x : 640;
  const exitY = (map && map.exitPos) ? map.exitPos.y : 955;
  return typeof buildDoorwayPath === 'function' ? buildDoorwayPath(c.x, c.y, exitX, exitY) : [{ x: exitX, y: exitY }];
}

// ============================================================================
// CATÁLOGO DOS 18 PUZZLES COOPERATIVOS (6 DE 2P, 6 DE 3P, 6 DE 4P)
// ============================================================================
const COOP_PUZZLES_CATALOG = [
  // 6 Puzzles 2P
  {
    id: 'coop_2p_1', coopPlayers: 2, hqTier: 1,
    title: '2P #1 – Servidor Bancário Hot-Swap PSU & SAS',
    device: '🖥️ Servidor Bancário Hot-Swap',
    stations: [
      { title: 'Estação A (Alimentação Redundante)', options: ['Desligar Chave Geral', 'Ejetar Módulo PSU 02', 'Curto no Barramento'], correctOpt: 1 },
      { title: 'Estação B (Controladora SAS RAID)', options: ['Reconstruir Array SAS', 'Formatar sem Backup', 'Remover Disco Paridade'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_2p_2', coopPlayers: 2, hqTier: 1,
    title: '2P #2 – Link de Fibra Óptica Dupla & SFP+ 10G',
    device: '⚡ Switch Core 10G SFP+',
    stations: [
      { title: 'Estação A (Transceiver SFP+ Tx/Rx)', options: ['Inverter Fibras Tx/Rx', 'Limpar Conector LC', 'Puxar com Força'], correctOpt: 1 },
      { title: 'Estação B (OTDR & Testador de Perda)', options: ['Atenuação a 0.2dB/km', 'Zerar Potência Óptica', 'Desativar Laser'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_2p_3', coopPlayers: 2, hqTier: 2,
    title: '2P #3 – Cluster de Virtualização Proxmox HA',
    device: '📦 Nó de Virtualização HA',
    stations: [
      { title: 'Estação A (Migração Dinâmica VM)', options: ['Desconectar Storage', 'Live Migration via Corosync', 'Forçar Desligamento'], correctOpt: 1 },
      { title: 'Estação B (Quórum de Clustering)', options: ['Configurar Quorum Vote', 'Ignorar Heartbeat', 'Reset de Rede'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_2p_4', coopPlayers: 2, hqTier: 2,
    title: '2P #4 – Firewall FortiGate HA & Túnel IPsec',
    device: '🛡️ Firewall FortiGate HA',
    stations: [
      { title: 'Estação A (Sincronia Heartbeat HA)', options: ['Cabo Cruzado Porta HA', 'Liberar Any Any', 'Trocar MAC Manual'], correctOpt: 0 },
      { title: 'Estação B (Criptografia Fase 1 & 2)', options: ['DES 56-bit Fraco', 'AES-256 + SHA-384 DH14', 'Sem Chave Pré-Compartilhada'], correctOpt: 1 }
    ]
  },
  {
    id: 'coop_2p_5', coopPlayers: 2, hqTier: 3,
    title: '2P #5 – Banco de Dados PostgreSQL & WAL Streaming',
    device: '💽 Cluster PostgreSQL 16',
    stations: [
      { title: 'Estação A (Promoção de Réplica Read-Only)', options: ['Promover Standby a Primary', 'Deletar base de dados', 'Travar pg_stat'], correctOpt: 0 },
      { title: 'Estação B (Arquivo WAL e Replicação)', options: ['Desligar wal_receiver', 'Sincronizar LSN e Slots', 'Deletar pg_wal'], correctOpt: 1 }
    ]
  },
  {
    id: 'coop_2p_6', coopPlayers: 2, hqTier: 3,
    title: '2P #6 – Storage All-Flash NVMe-oF & RDMA',
    device: '⚡ SAN NVMe-oF 100Gbps',
    stations: [
      { title: 'Estação A (Configuração RoCEv2)', options: ['Habilitar PFC e ECN', 'Desativar MTU 9000', 'Ignorar QCN'], correctOpt: 0 },
      { title: 'Estação B (Mapeamento de Namespaces)', options: ['Excluir Volume LUN', 'Mapear NQN no Subsystem', 'Ativar Cache L1'], correctOpt: 1 }
    ]
  },

  // 6 Puzzles 3P
  {
    id: 'coop_3p_1', coopPlayers: 3, hqTier: 2,
    title: '3P #1 – Cluster Kubernetes Ingress & Cert-Manager',
    device: '☸️ Cluster K8s Control Plane',
    stations: [
      { title: 'Estação A (DNS Core & MetalLB)', options: ['Configurar IP Pool VIP', 'Bloquear porta 53', 'Deletar CNI'], correctOpt: 0 },
      { title: 'Estação B (Ingress NGINX Controller)', options: ['Desinstalar Pods', 'Reescrever Rotas SSL', 'Forçar HTTP 80'], correctOpt: 1 },
      { title: 'Estação C (Cert-Manager Let\\\'s Encrypt)', options: ['Emitir Certificado TLS ACME', 'Ignorar Challenge HTTP', 'Excluir Secret'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_3p_2', coopPlayers: 3, hqTier: 2,
    title: '3P #2 – Estação de Transmissão 4K SDI & OBS NDI',
    device: '🎥 Ilha de Produção Broadcast 4K',
    stations: [
      { title: 'Estação A (Matriz SDI 12G)', options: ['Travar Genlock Blackburst', 'Desconectar BNC', 'Inverter Áudio'], correctOpt: 0 },
      { title: 'Estação B (Encoder Hardware AV1)', options: ['Buffer em 0kbps', '60 FPS CBR 25.000 kbps', 'Resolução 480p'], correctOpt: 1 },
      { title: 'Estação C (Mixer DANTE Áudio IP)', options: ['PTP Clock Master Lock', 'Mute Geral', 'Sem Sincronia'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_3p_3', coopPlayers: 3, hqTier: 3,
    title: '3P #3 – Mainframe IBM Z & Emulador 3270',
    device: '🏛️ Mainframe Corporativo z/OS',
    stations: [
      { title: 'Estação A (IPL & Carregamento do Kernel)', options: ['Carregar IPL no Endereço 0A0', 'Desligar CBU', 'Desativar LPAR'], correctOpt: 0 },
      { title: 'Estação B (Sessão TSO/ISPF & JCL)', options: ['Submeter Job de Reorganização', 'Deletar Catálogo VSAM', 'Cancelar CICS'], correctOpt: 0 },
      { title: 'Estação C (DASD Array & FICON)', options: ['Zerar Volser', 'Validar Canais FICON Redundantes', 'Desmontar Sysplex'], correctOpt: 1 }
    ]
  },
  {
    id: 'coop_3p_4', coopPlayers: 3, hqTier: 3,
    title: '3P #4 – Farm de Render 3D Blender Cycles & OptiX',
    device: '🎬 Render Farm 8x RTX 4090',
    stations: [
      { title: 'Estação A (Distribuidor de Tiles)', options: ['Dividir Cenas em 512x512 Tiles', 'Renderizar em 1 Core', 'Travar VRAM'], correctOpt: 0 },
      { title: 'Estação B (Drivers CUDA & OptiX Denoise)', options: ['Desativar RT Cores', 'Compilar Shaders OptiX AI', 'Drivers Legados de 2018'], correctOpt: 1 },
      { title: 'Estação C (Storage NFS Cache SSD)', options: ['Desativar Cache', 'Alocar 128GB RAM Drive p/ Texturas', 'Apagar Assets'], correctOpt: 1 }
    ]
  },
  {
    id: 'coop_3p_5', coopPlayers: 3, hqTier: 4,
    title: '3P #5 – NOC Telecom GPON & OLT 128 Clientes',
    device: '🌐 Chassi OLT GPON 16 Portas',
    stations: [
      { title: 'Estação A (Alinhamento Laser B+ / C+)', options: ['Potência Óptica +3dBm a +7dBm', 'Desligar Laser Diode', 'Superaquecer Módulo'], correctOpt: 0 },
      { title: 'Estação B (Provisionamento DBA & T-CONT)', options: ['Limitar banda a 10kbps', 'Vincular Perfil T-CONT Tipo 4', 'Bloquear OMCI'], correctOpt: 1 },
      { title: 'Estação C (Sincronia VLAN Q-in-Q)', options: ['Adicionar Service Tag 802.1ad', 'Desativar Switching', 'Inverter Portas Uplink'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_3p_6', coopPlayers: 3, hqTier: 4,
    title: '3P #6 – Supercomputador Slurm & InfiniBand NDR',
    device: '⚛️ Cluster HPC InfiniBand 400G',
    stations: [
      { title: 'Estação A (Subnet Manager OpenSM)', options: ['Iniciar Subnet Manager NDR', 'Zerar GUIDs', 'Desativar Switches'], correctOpt: 0 },
      { title: 'Estação B (Fila Slurm Workload Manager)', options: ['Travar Nó em DRAIN', 'Alocar Partição GPU c/ Prioridade', 'Apagar slurmctld'], correctOpt: 1 },
      { title: 'Estação C (MPI & Comunicação RDMA)', options: ['Executar Benchmark All-Reduce', 'Bloquear portas MPI', 'Desativar CUDA-Aware'], correctOpt: 0 }
    ]
  },

  // 6 Puzzles 4P
  {
    id: 'coop_4p_1', coopPlayers: 4, hqTier: 3,
    title: '4P #1 – NOC Datacenter Tier III: Gerador, BGP & SAN',
    device: '🏢 Datacenter Tier III Completo',
    stations: [
      { title: 'Técnico 1 (Grupo Gerador Diesel & ATS)', options: ['Iniciar Partida Automática ATS', 'Drenar Tanque de Combustível', 'Desarmar Disjuntor Principal'], correctOpt: 0 },
      { title: 'Técnico 2 (Roteamento BGP & ASN)', options: ['Anunciar Prefixo /24 para Upstreams', 'Retirar Anúncio BGP', 'Filtrar Toda a Tabela Global'], correctOpt: 0 },
      { title: 'Técnico 3 (Ar-Condicionado de Precisão CRAC)', options: ['Temperatura em 21°C e Umidade 45%', 'Desligar Chiller', 'Subir para 50°C'], correctOpt: 0 },
      { title: 'Técnico 4 (SAN Fibre Channel Brocade)', options: ['Zoneamento WWN Ativo', 'Desativar Portas FC', 'Zerar Fabric OS'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_2', coopPlayers: 4, hqTier: 3,
    title: '4P #2 – Resposta a Incidente Ransomware & SOC',
    device: '🚨 Sala de Crise SOC & CSIRT',
    stations: [
      { title: 'Técnico 1 (Isolamento de Rede Zero-Trust)', options: ['Bloquear Tráfego Leste-Oeste', 'Liberar RDP Global', 'Desligar IDS'], correctOpt: 0 },
      { title: 'Técnico 2 (Dump de Memória Forense RAM)', options: ['Extrair Chaves RSA da Volatilidade', 'Reiniciar Máquina Infectada', 'Sobrescrever RAM'], correctOpt: 0 },
      { title: 'Técnico 3 (Active Directory Kerberos & Krbtgt)', options: ['Reset Duplo da Conta Krbtgt', 'Dar Admin a Todos', 'Desinstalar AD DC'], correctOpt: 0 },
      { title: 'Técnico 4 (Restauração Air-Gapped Imutável)', options: ['Restaurar Snapshot WORM Off-line', 'Formatar sem Backup', 'Pagar Resgate em Bitcoin'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_3', coopPlayers: 4, hqTier: 4,
    title: '4P #3 – Usina Nuclear SCADA / PLC & Sistema de Resfriamento',
    device: '☢️ Sistema SCADA Reator Crítico',
    stations: [
      { title: 'Técnico 1 (Válvula de Alívio Primária)', options: ['Pressurizar a 155 Bar Nominal', 'Fechar Todas as Válvulas', 'Drenar Fluido Refrigerante'], correctOpt: 0 },
      { title: 'Técnico 2 (Barras de Controle de Boro)', options: ['Inserir Barras a 78% p/ Estabilizar', 'Ejetar Barras de Controle', 'Travar Mecanismo'], correctOpt: 0 },
      { title: 'Técnico 3 (Barramento Modbus TCP Redundante)', options: ['Sincronizar PLC Master e Standby', 'Enviar Pacotes Broadcast Loop', 'Cortar Linha Serial'], correctOpt: 0 },
      { title: 'Técnico 4 (Turbina a Vapor e Gerador 1.2GW)', options: ['Sincronizar Fase 60Hz com a Rede', 'Acelerar sem Carga', 'Desconectar Excitatriz'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_4', coopPlayers: 4, hqTier: 4,
    title: '4P #4 – Missão Aeroespacial & Telemetria de Satélite LEO',
    device: '🛰️ Estação de Solo & Satélite LEO',
    stations: [
      { title: 'Técnico 1 (Antena Parabólica Azimute & Elevação)', options: ['Acompanhamento Doppler Automático', 'Desapontar Antena', 'Travar Motores'], correctOpt: 0 },
      { title: 'Técnico 2 (Orientação Giroscópios & Magnetorquers)', options: ['Estabilizar 3 Eixos Apontado à Terra', 'Girar em Descontrole', 'Descarregar Baterias'], correctOpt: 0 },
      { title: 'Técnico 3 (Link de Descarga Banda X 800Mbps)', options: ['Desmodulação QPSK e Correção FEC', 'Inverter Polarização', 'Desligar Transmissor'], correctOpt: 0 },
      { title: 'Técnico 4 (Painéis Solares & Controle Térmico)', options: ['Orientar Painéis em 90° ao Sol', 'Bloquear Painéis na Sombra', 'Desativar Aquecedores'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_5', coopPlayers: 4, hqTier: 4,
    title: '4P #5 – Acelerador de Partículas & Eletroímãs Supercondutores',
    device: '🔬 Túnel do Acelerador Síncrotron',
    stations: [
      { title: 'Técnico 1 (Criogenia de Hélio Líquido 1.9K)', options: ['Pressão de Hélio Estável a 1.9 Kelvin', 'Subir Temperatura para 100K', 'Ventilar Hélio'], correctOpt: 0 },
      { title: 'Técnico 2 (Fonte de Corrente DC 12.000A)', options: ['Rampa Gradual de 12.000A sem Quench', 'Queda Abrupta de Corrente', 'Sobrecarregar Bobina'], correctOpt: 0 },
      { title: 'Técnico 3 (Câmaras de Vácuo Ultra-Alto UHV)', options: ['Vácuo Ultra-Alto 10^-10 Torr', 'Abrir Válvula de Ar', 'Desligar Bombas Turbo'], correctOpt: 0 },
      { title: 'Técnico 4 (Cavidades de Radiofrequência RF)', options: ['Injetar Pulso RF 400MHz em Fase', 'Desfasear Feixe de Prótons', 'Emitir Harmônicos Ruído'], correctOpt: 0 }
    ]
  },
  {
    id: 'coop_4p_6', coopPlayers: 4, hqTier: 4,
    title: '4P #6 – Computador Quântico Criogênico Qubit Decoherence',
    device: '❄️ Diluição Quântica 15mK & 128 Qubits',
    stations: [
      { title: 'Técnico 1 (Refrigerador de Diluição He3/He4)', options: ['Temperatura Base em 15 Milikelvin', 'Desligar Bomba Criogênica', 'Aquecer Criostato'], correctOpt: 0 },
      { title: 'Técnico 2 (Micro-ondas Pulsadas & Portas Lógicas)', options: ['Calibrar Pulsos π/2 com Portas Hadamard', 'Ruído Gaussiano Descalibrado', 'Aumentar Amplitude ao Máximo'], correctOpt: 0 },
      { title: 'Técnico 3 (Blindagem Magnética Mu-Metal)', options: ['Campo Magnético Residual < 1 nT', 'Colocar Imã de Neodímio', 'Retirar Blindagem'], correctOpt: 0 },
      { title: 'Técnico 4 (Correção de Erro Quântico Surface Code)', options: ['Medição de Síndromes X e Z Contínua', 'Ignorar Bit-Flips e Phase-Flips', 'Zerar Estados de Prova'], correctOpt: 0 }
    ]
  }
];

function buildCoopTemplateFromCatalog(puz) {
  return {
    clientName: 'Chamado Corporativo ' + puz.title,
    urgency: 'Co-op ' + puz.coopPlayers + 'P',
    tagClass: 'tag-urgente',
    hqTier: puz.hqTier || 1,
    coopPlayers: puz.coopPlayers,
    device: puz.device || 'Cluster Co-op',
    quote: 'Precisamos de ' + puz.coopPlayers + ' técnicos operando juntos neste sistema!',
    mentorHint: 'Chame os outros técnicos para sincronizarem suas estações!',
    minigameType: puz.id,
    requiredPart: 'cpu_ram',
    questions: [],
    tools: [],
    diagnoses: []
  };
}

function getUnlockedTemplates() {
  if (typeof COOP_PUZZLES_CATALOG !== 'undefined' && Array.isArray(COOP_PUZZLES_CATALOG)) {
    const curTier = typeof getCurrentHQTier === 'function' ? getCurrentHQTier() : 1;
    return COOP_PUZZLES_CATALOG.filter(p => (p.hqTier || 1) <= curTier);
  }
  return [];
}
`;

const insertTarget = 'function getWaitingSlotPosition';
code = code.replace(insertTarget, coopCatalogCode + '\n' + insertTarget);
console.log('COOP_PUZZLES_CATALOG, buildClientExitPath and getUnlockedTemplates inserted!');

fs.writeFileSync('game.js', code, 'utf8');
console.log('game.js updated! Length:', code.length);
