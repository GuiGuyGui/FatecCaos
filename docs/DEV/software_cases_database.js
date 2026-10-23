// ============================================================================
// PLANTÃO DEV - BANCO DE MAIS DE 4.000 CASOS ÚNICOS DE ENGENHARIA DE SOFTWARE
// 4.200 Casos Únicos com Detalhes Especiais, Regras de Desenvolvimento e 5 Pilares
// ============================================================================

const SPECIAL_DETAILS_CATALOG = [
  {
    "id": "SLA_CRITICO",
    "icon": "🚨",
    "title": "SLA de Missão Crítica (99.999%)",
    "badge": "SLA CRÍTICO",
    "tagClass": "tag-urgent",
    "desc": "Qualquer falha contratual gera multa dobrada (-R$ 4.000 e -40% Reputação). Em contrapartida, entrega pontual paga bônus de +100% no valor contratado.",
    "penaltyMult": 2.0,
    "payoutBonusMult": 2.0,
    "repLossMult": 1.33,
    "hint": "Tolerância zero a falhas. Exija arquitetura tolerante a falhas e valide todos os requisitos antes de assinar!"
  },
  {
    "id": "COMPLIANCE_RIGOROSO",
    "icon": "🛡️",
    "title": "Conformidade Regulatória Estrita (LGPD / BACEN / HIPAA)",
    "badge": "COMPLIANCE",
    "tagClass": "tag-compliance",
    "desc": "Auditoria governamental obrigatória. O módulo de QA & Cybersecurity DEVE atender 100% aos requisitos de blindagem; divergências travam a validação de escopo imediatamente.",
    "penaltyMult": 1.0,
    "payoutBonusMult": 1.25,
    "enforceQAMatch": true,
    "hint": "Sem atalhos na segurança! O módulo de QA & Cybersecurity deve obrigatoriamente estar alinhado às exigências."
  },
  {
    "id": "CRUNCH_RELAMPAGO",
    "icon": "⏱️",
    "title": "Sprint Crunch Relâmpago (Prazo Imediato)",
    "badge": "CRUNCH",
    "tagClass": "tag-urgent",
    "desc": "O cliente tem urgência extrema para lançar na mídia. A paciência esgota 2.5x mais rápido! Se entregue com sucesso, garante bônus de agilidade de +R$ 1.500.",
    "patienceDecayMult": 2.5,
    "timeBonus": 1500,
    "payoutBonusMult": 1.2,
    "hint": "Cliente com pressa extrema! Atenda com rapidez para não perder a paciência dele na recepção."
  },
  {
    "id": "CLIENTE_VIP_INVESTIDOR",
    "icon": "💎",
    "title": "Cliente VIP Investidor Série B",
    "badge": "VIP INVESTIDOR",
    "tagClass": "tag-vip",
    "desc": "Orçamento massivo com aporte de Venture Capital (+R$ 8.000 de remuneração base). Exige tolerância zero no Desafio Técnico: erros custam -R$ 1.000 de retrabalho.",
    "baseBonus": 8000,
    "puzzleMistakeCost": 1000,
    "payoutBonusMult": 1.5,
    "hint": "Cliente VIP de alto poder aquisitivo. Não cometa nenhum deslize no código para não queimar o caixa!"
  },
  {
    "id": "OFFLINE_FIRST",
    "icon": "📶",
    "title": "Arquitetura Offline-First & Baixa Conectividade",
    "badge": "OFFLINE-FIRST",
    "tagClass": "tag-normal",
    "desc": "Operação em áreas remotas ou subterrâneas. O módulo de Frontend & Mobile deve obrigatoriamente usar cache PWA ou banco local IndexedDB; bundles pesados são rejeitados.",
    "enforceFrontendMatch": true,
    "payoutBonusMult": 1.15,
    "hint": "A aplicação funcionará sem internet contínua. Priorize IndexedDB, PWA e sincronização em segundo plano."
  },
  {
    "id": "HIGH_THROUGHPUT_BLACKFRIDAY",
    "icon": "⚡",
    "title": "Tráfego Massivo / Black Friday Scale",
    "badge": "ALTA ESCALA",
    "tagClass": "tag-urgent",
    "desc": "Picos imprevisíveis de 1 milhão de requisições por minuto. Módulos de Backend e Cloud devem ser totalmente stateless com Redis e autoscaling ativo.",
    "enforceBackendCloudMatch": true,
    "payoutBonusMult": 1.4,
    "hint": "Monólitos travam aqui. Garanta que a arquitetura distribua carga com Redis e autoscaling."
  },
  {
    "id": "ZERO_TRUST_SECURITY",
    "icon": "🔒",
    "title": "Políticas de Segurança Corporativa Zero-Trust",
    "badge": "ZERO-TRUST",
    "tagClass": "tag-compliance",
    "desc": "Nenhum tráfego interno é confiável. Backend e QA exigem autenticação mTLS e rotação de chaves. Erro no escopo acarreta multa de -R$ 3.000.",
    "penaltyMult": 1.5,
    "payoutBonusMult": 1.3,
    "hint": "Políticas Zero-Trust eliminam confiança implícita. Proteja todos os endpoints com autenticação mútua."
  },
  {
    "id": "IA_RAG_PIPELINE",
    "icon": "🤖",
    "title": "Pipeline de IA Generativa & Embeddings em Larga Escala",
    "badge": "IA & RAG",
    "tagClass": "tag-ai",
    "desc": "Integração profunda com LLMs, vetores semânticos e governança de custos FinOps. Recompensa financeira ampliada em +R$ 3.500.",
    "baseBonus": 3500,
    "payoutBonusMult": 1.3,
    "hint": "Modelos de linguagem necessitam de cache de prompt, chunking semântico e bancos vetoriais otimizados."
  },
  {
    "id": "LEGADO_SEM_DOWNTIME",
    "icon": "🏢",
    "title": "Migração de Monólito Legado sem Downtime",
    "badge": "LEGADO ZERO-DT",
    "tagClass": "tag-normal",
    "desc": "O sistema legado fatura R$ 100k/minuto e não pode parar. Tech Lead exige padrão Strangler Fig e Circuit Breaker para migração segura.",
    "enforceTechLeadMatch": true,
    "baseBonus": 2500,
    "payoutBonusMult": 1.25,
    "hint": "Reescritas totais quebram empresas. Use o padrão estrangulador (Strangler Fig) para migrar módulo a módulo."
  },
  {
    "id": "DISASTER_RECOVERY_MULTIREGION",
    "icon": "🌐",
    "title": "Resiliência Multi-Região & Disaster Recovery",
    "badge": "MULTI-CLOUD",
    "tagClass": "tag-normal",
    "desc": "Failover ativo-ativo geodistribuído. Se a AWS Leste cair, o tráfego migra em segundos para Frankfurt sem perda de sessão.",
    "enforceCloudMatch": true,
    "baseBonus": 3000,
    "payoutBonusMult": 1.3,
    "hint": "Replicação síncrona com latência baixa e DNS distribuído com health check periódico."
  },
  {
    "id": "ACCESSIBILITY_WCAG",
    "icon": "♿",
    "title": "Acessibilidade Universal Estrita (WCAG 2.1 AAA)",
    "badge": "ACESSIBILIDADE",
    "tagClass": "tag-normal",
    "desc": "Aplicativo governamental ou de saúde que exige navegação completa por leitor de tela e alto contraste. O Frontend não pode falhar nos testes semânticos.",
    "enforceFrontendMatch": true,
    "repBonus": 1,
    "hint": "HTML semântico estrito, roles ARIA completas, foco de teclado visível e contraste de cores superior a 7:1."
  },
  {
    "id": "FINTECH_IDEMPOTENCY",
    "icon": "💳",
    "title": "Transações Financeiras com Idempotência Estrita",
    "badge": "IDEMPOTÊNCIA",
    "tagClass": "tag-compliance",
    "desc": "Processamento de pagamentos com chave de idempotência e locks transacionais no Postgres. Bloqueia qualquer risco de cobrança duplicada.",
    "enforceBackendMatch": true,
    "baseBonus": 2800,
    "hint": "Headers com Idempotency-Key e transações com isolamento Serializable para evitar double-spending."
  },
  {
    "id": "OPEN_SOURCE_COMMUNITY",
    "icon": "⭐",
    "title": "Projeto Open-Source de Impacto Global",
    "badge": "OPEN-SOURCE",
    "tagClass": "tag-normal",
    "desc": "Projeto mantido pela comunidade mundial de desenvolvedores. Paga menos em caixa, mas concede o DOBRO de reputação (+2% de reputação) para a Software House!",
    "baseBonus": -500,
    "doubleReputation": true,
    "hint": "Foco em transparência, documentação exemplar e contribuições da comunidade. Excelente para elevar reputação!"
  },
  {
    "id": "GREEN_COMPUTING_FINOPS",
    "icon": "🌱",
    "title": "Green Computing & Eficiência Energética de Nuvem",
    "badge": "GREEN FINOPS",
    "tagClass": "tag-normal",
    "desc": "Otimização milimétrica de consumo de vCPU e memória para redução da pegada de carbono. Concede bônus de reputação e economia.",
    "baseBonus": 1200,
    "repBonus": 1,
    "hint": "Containers leves em Alpine/Distroless, ARM64 Graviton e desligamento automático de nós ociosos."
  },
  {
    "id": "HARDWARE_IOT_EMBEDDED",
    "icon": "📡",
    "title": "Telemetria Industrial & IoT com Baixa Latência",
    "badge": "IOT TELEMETRIA",
    "tagClass": "tag-normal",
    "desc": "Sensores operam com baterias de longa duração transmitindo pacotes binários compactados via MQTT e Protobuf com latência sub-milissegundo.",
    "enforceBackendMatch": true,
    "baseBonus": 2200,
    "hint": "Payloads binários compactos com compressão Zstandard e brokers MQTT clusterizados com QoS 1."
  },
  {
    "id": "CYBER_ZERO_DAY_SHIELD",
    "icon": "🛡️",
    "title": "Escudo Anti Zero-Day & DevSecOps Avançado",
    "badge": "DEVSECOPS",
    "tagClass": "tag-compliance",
    "desc": "Alvo frequente de ataques de negação de serviço e scanners de vulnerabilidade. Exige linters SAST/DAST e blindagem contra injeções.",
    "enforceQAMatch": true,
    "baseBonus": 3200,
    "hint": "Pipeline CI/CD com bloqueio automático em caso de CVEs altas e sanitização estrita em todas as bordas."
  }
];

const CASE_METADATA_CONFIG = {
  firstNames: ["Lucas", "Gabriel", "Mateus", "Rodrigo", "Felipe", "Thiago", "Guilherme", "Bruno", "Leonardo", "Eduardo", "Mariana", "Beatriz", "Camila", "Larissa", "Juliana", "Fernanda", "Carolina", "Amanda", "Letícia", "Patrícia", "Carlos", "Roberto", "Antônio", "Marcos", "Fernando", "Ricardo", "Alexandre", "Marcelo", "Sérgio", "Paulo", "Helena", "Isabela", "Natália", "Renata", "Clarice", "Débora", "Daniela", "Vanessa", "Tatiana", "Simone", "André", "Rafael", "Danilo", "Caio", "Vinícius", "Leandro", "Murilo", "Otávio", "Diego", "Igor", "Dra. Viviane", "Dr. Bernardo", "Eng. Fábio", "Prof. Maurício", "Dra. Cecília", "Eng. Flávia", "Prof. Alberto", "Dra. Renata", "Alex", "Sam", "Taylor", "Jordan", "Kim", "Robin", "Cris", "Dany", "Ariel", "Renan", "Kuro", "Viper", "Zero", "Nyx", "Byte", "Neo", "Echo", "Glitch", "Spark", "Shadow"],
  lastNames: ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Lima", "Carvalho", "Ferreira", "Ribeiro", "Rodrigues", "Almeida", "Nascimento", "Alves", "Araújo", "Monteiro", "Mendes", "Barros", "Freitas", "Barbosa", "Pinto", "Moura", "Cavalcanti", "Dias", "Castro", "Campos", "Cardoso", "Teixeira", "Vieira", "Rocha", "Correia", "Takahashi", "Nakamura", "Tanaka", "Watanabe", "Yamamoto", "Sato", "Suzuki", "Kobayashi", "Kato", "Ito", "Schmidt", "Müller", "Weber", "Fischer", "Schneider", "Hoffmann", "Wagner", "Becker", "Bauer", "Klein", "Rossi", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Boaventura", "Vasconcelos", "Albuquerque", "Bittencourt", "Guimarães", "Castelo Branco", "Macedo", "Vilar", "Fontoura", "Dornelles"],
  nicknames: ["Zigue", "Pixel", "CodeMaster", "Kuro", "GamerBR", "StreamerPro", "Bit", "Turbo", "TechGuru", "Cyber", "DevOpsGod", "QAQueen", "CloudNinja", "Apex", "Nova", "Vortex", "Pulse", "Syntax", "Lambda", "Root"],
  sectors: [
  {
    "id": "content_creator",
    "name": "Pessoa Física · Criador de Conteúdo",
    "companies": [
      "Canal StreamerTech",
      "Podcast Byte & Prosa",
      "Coletivo PixelArt Brasil",
      "Canal Games & Café",
      "Comunidade OpenDev"
    ],
    "deviceTypes": [
      "Twitch Bot & Overlay Interativo",
      "Hub de Membros & Doações Pix",
      "Extensão de Navegador para VODs",
      "App Mobile de Comunidade & Feed Exclusivo",
      "Dashboard de Métricas Multi-Streaming"
    ]
  },
  {
    "id": "local_business",
    "name": "Comércio Local & Gastronomia",
    "companies": [
      "Pizzaria Forno Nobre",
      "Rede Padaria Central",
      "Hamburgueria Artesanal Smash",
      "Cafeteria Grão Raro",
      "Bistrô Sabor & Prosa",
      "Açougue Premium Cortes Nobres"
    ],
    "deviceTypes": [
      "App de Delivery & Cardápio com Pix Automático",
      "Frente de Caixa (PDV) Offline-First",
      "Totem de Autoatendimento Touchscreen",
      "Sistema de Comanda Eletrônica & Cozinha (KDS)",
      "Clube de Fidelidade & Cashback Local"
    ]
  },
  {
    "id": "fintech",
    "name": "Fintech & Banco Digital Corporativo",
    "companies": [
      "Apex Bank Digital",
      "Nexus Pagamentos S/A",
      "OmniCrédito Tech",
      "Câmbio Global FX",
      "Vanguard Investimentos",
      "Plataforma Quântica de Pagamentos"
    ],
    "deviceTypes": [
      "Core Bancário & Liquidação Pix 24/7",
      "Gateway de Pagamentos com Anti-Fraude ML",
      "Motor de Crédito & Score em Tempo Real",
      "App de Investimentos & Livro de Ofertas",
      "Plataforma de Split de Pagamentos Multi-Vendedor"
    ]
  },
  {
    "id": "healthtech",
    "name": "Saúde Pública & Hospitais Privados",
    "companies": [
      "Hospital Municipal São Lucas",
      "Rede Laboratorial BioVida",
      "Clínica Oftalmológica Visão",
      "Instituto de Oncologia Esperança",
      "HealthHub Telemedicina"
    ],
    "deviceTypes": [
      "Prontuário Eletrônico Hospitalar Resiliente (PEP)",
      "Plataforma de Telemedicina com WebRTC Criptografado",
      "App de Agendamento & Fila SUS Inteligente",
      "Sistema de Dispensação Segura de Medicamentos",
      "Portal de Laudos & Imagens DICOM em Nuvem"
    ]
  },
  {
    "id": "govtech",
    "name": "Setor Público & GovTech",
    "companies": [
      "Prefeitura Municipal de Metrópole",
      "Secretaria da Fazenda Estadual",
      "Tribunal de Justiça Digital",
      "Câmara de Vereadores Metropolitana",
      "Agência Reguladora de Transportes"
    ],
    "deviceTypes": [
      "Portal da Transparência & Contratos Públicos",
      "App de Serviços ao Cidadão (IPTU, Luz, Buracos)",
      "Sistema de Protocolo Digital & Assinatura ICP-Brasil",
      "Painel de Controle de Frotas Públicas via GPS",
      "Sistema Eletrônico de Pregão & Licitações"
    ]
  },
  {
    "id": "ngo",
    "name": "Terceiro Setor & ONGs Humanitárias",
    "companies": [
      "ONG Patinhas com Amor",
      "Instituto Criança Futuro",
      "Fundação SOS Florestas Tropicais",
      "Coletivo Prato Cheio Alimenta",
      "Associação Abrigo Esperança"
    ],
    "deviceTypes": [
      "Plataforma de Adoção & Resgate Animal",
      "Sistema de Arrecadação de Doações Recorrentes",
      "App de Voluntários & Gestão de Escalas",
      "Portal de Prestação de Contas Pública & Auditoria",
      "Banco de Alimentos & Rastreamento de Doações"
    ]
  },
  {
    "id": "edtech",
    "name": "EdTech & Ensino Superior",
    "companies": [
      "Universidade Aberta do Saber",
      "Escola Tech Futuro",
      "Plataforma Idiomas Sem Fronteiras",
      "Instituto Politécnico Educar",
      "Colegio Modelo Integrado"
    ],
    "deviceTypes": [
      "Ambiente Virtual de Aprendizagem (LMS) Escalável",
      "App de Quizzes Gamificados em Tempo Real",
      "Sistema de Provas com Anti-Cola e Câmera WebRTC",
      "Portal do Aluno com Matrícula & Boleto Automático",
      "Plataforma de Mentorias 1-on-1 com IA"
    ]
  },
  {
    "id": "gamedev",
    "name": "GameDev & Estúdios de Jogos",
    "companies": [
      "PixelForge Studios",
      "Lumina Games Indie",
      "IronByte Interactive",
      "NeonDragon Entertainment",
      "VoxelCraft Interactive"
    ],
    "deviceTypes": [
      "Backend Multiplayer Autoritativo com UDP/WebSockets",
      "Sistema de Matchmaking & Ranking ELO Global",
      "Loja In-Game com Anti-Cheat & Microtransações",
      "Leaderboard Distribuído com Milhões de Jogadores",
      "Painel de Analytics de Gameplay & Retenção"
    ]
  },
  {
    "id": "agrotech",
    "name": "AgroTech & Fazendas Inteligentes",
    "companies": [
      "AgroVerde Grãos do Cerrado",
      "Fazendas Reunidas Sol Poente",
      "Cooperativa Agrícola Raízes",
      "BioSafra Insumos",
      "AgroSensor Telemetria"
    ],
    "deviceTypes": [
      "Telemetria de Tratores Autônomos via Satélite",
      "App Offline-First de Coleta de Pragas no Campo",
      "Dashboard de Umidade do Solo & Irrigação Automática",
      "Rastreabilidade de Grãos da Colheita ao Porto",
      "Sistema de Cotação de Commodities em Tempo Real"
    ]
  },
  {
    "id": "logistics",
    "name": "Logística & Transportes de Carga",
    "companies": [
      "Rápido Express Transportes",
      "CargaSegura Frotas",
      "TransContinental Log",
      "EntregaJá Last-Mile",
      "PortoSeco Operador Logístico"
    ],
    "deviceTypes": [
      "Roteirizador de Frotas com Otimização de Combustível",
      "App do Motorista com Comprovante Digital & Assinatura",
      "Rastreamento de Cargas Frigoríficas via Sensores IoT",
      "Sistema de Gestão de Armazéns (WMS) com Código de Barras",
      "Plataforma de Leilão Reverso de Fretes"
    ]
  },
  {
    "id": "cyberdefense",
    "name": "Cybersecurity & Defesa Cibernética",
    "companies": [
      "CyberShield Defense S/A",
      "ZeroDay Incident Response",
      "IronVault Segurança da Informação",
      "Sentinela Threat Intel",
      "CipherGuard Compliance"
    ],
    "deviceTypes": [
      "SIEM Cloud com Detecção de Anomalias em Tempo Real",
      "Portal de Bug Bounty & Divulgação Responsável",
      "Sistema de Cofre de Senhas e Rotação de Segredos",
      "Scanner de Vulnerabilidades SAST/DAST em CI/CD",
      "Honeypot Distribuído & Análise de Ataques DDoS"
    ]
  },
  {
    "id": "ecommerce",
    "name": "E-Commerce & Varejo Omnichannel",
    "companies": [
      "MegaStore Varejo Online",
      "ModaViva Fashion E-Commerce",
      "TechEletrônicos Direto da Fábrica",
      "MundoPet Marketplace",
      "Livraria Universal Virtual"
    ],
    "deviceTypes": [
      "Checkout de Alta Conversão com Pix & Cartão 1-Click",
      "Motor de Busca & Recomendação Semântica com IA",
      "Sistema de Carrinho com Reserva de Estoque Concorrente",
      "Hub de Integração com 15 Marketplaces",
      "App de Compras com Notificações Push Personalizadas"
    ]
  },
  {
    "id": "biotech",
    "name": "Biotech & Pesquisa Genômica",
    "companies": [
      "GenomaLab Diagnósticos Moleculares",
      "BioSynthetica Terapêutica",
      "Helix DNA Analytics",
      "BioTech ImunoPesquisa",
      "PharmaNova Desenvolvimento"
    ],
    "deviceTypes": [
      "Pipeline de Alinhamento de Sequenciamento Genético",
      "Sistema de Catálogo de Amostras Biológicas a -80°C",
      "Plataforma de Ensaios Clínicos com Validação Dupla",
      "Dashboard de Interações Medicamentosas com IA",
      "Repositório de Dados de Bioinformática com Criptografia"
    ]
  },
  {
    "id": "cleantech",
    "name": "CleanTech & Energia Solar/Eólica",
    "companies": [
      "SolVerde Energia Solar",
      "Eólica dos Ventos Brasil",
      "EcoWatt Baterias Industriais",
      "TerraClean Reciclagem Inteligente",
      "GridZero Redes Elétricas"
    ],
    "deviceTypes": [
      "Monitoramento de Painéis Solares & Inversores em Tempo Real",
      "Mercado Livre de Energia com Smart Contracts",
      "App de Gestão de Recarga de Carros Elétricos",
      "Sistema de Manutenção Preditiva de Turbinas Eólicas",
      "Dashboard de Pegada de Carbono Corporativa (ESG)"
    ]
  },
  {
    "id": "legaltech",
    "name": "LegalTech & Gestão Jurídica",
    "companies": [
      "LexAdvocacia Corporativa",
      "JurisTech Inteligência Legal",
      "TribunalSoft Processos",
      "Consensu Mediação Online",
      "ContratoSeguro Automação"
    ],
    "deviceTypes": [
      "Leitor Automatizado de Diários Oficiais com IA",
      "Sistema de Redação e Assinatura Digital de Contratos",
      "Gestão de Prazos Processuais com Notificação WhatsApp",
      "Pesquisa de Jurisprudência com Busca Semântica",
      "Portal do Cliente Jurídico com Acompanhamento Processual"
    ]
  },
  {
    "id": "realestate",
    "name": "PropTech & Gestão Imobiliária",
    "companies": [
      "ImóvelFácil Digital",
      "HabitaBem Locações",
      "MetroAluguel Inteligente",
      "Skyline Empreendimentos",
      "CondomínioConectado Tech"
    ],
    "deviceTypes": [
      "Portal de Imóveis com Tour Virtual 360° e Filtros",
      "Sistema de Assinatura de Contrato de Locação Sem Fiador",
      "App de Gestão de Condomínios (Portaria, Boletos, Salão)",
      "Motor de Precificação Dinâmica de Aluguéis com IA",
      "Vistoria Imobiliária Digital com Fotos Georreferenciadas"
    ]
  }
],
  skinColors: ["#ffdbb5", "#f1c27d", "#e0ac69", "#8d5524", "#c68642", "#ffd1b3", "#ecc0a0"],
  hairColors: ["#1e293b", "#7c3aed", "#ec4899", "#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#64748b", "#854d0e", "#ffffff"],
  shirtColors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#64748b", "#ef4444", "#1e293b", "#e11d48"],
  categoryPreferences: ["backend_api", "frontend_mobile", "qa_cybersecurity", "cloud_devops_ai", "tech_lead"],
  puzzleIdsByCat: {
  "backend_api": [
    "be_01",
    "be_02",
    "be_03",
    "be_04",
    "be_05",
    "be_06",
    "be_07",
    "be_08",
    "be_09",
    "be_10",
    "be_11",
    "be_12",
    "be_13",
    "be_14",
    "be_15",
    "be_16",
    "be_17",
    "be_18",
    "be_19",
    "be_20",
    "be_21",
    "be_22",
    "be_23",
    "be_24",
    "be_25",
    "be_26",
    "be_27",
    "be_28",
    "be_29",
    "be_30",
    "be_31",
    "be_32",
    "be_33",
    "be_34",
    "be_35",
    "be_36",
    "be_37",
    "be_38",
    "be_39",
    "be_40"
  ],
  "frontend_mobile": [
    "fe_01",
    "fe_02",
    "fe_03",
    "fe_04",
    "fe_05",
    "fe_06",
    "fe_07",
    "fe_08",
    "fe_09",
    "fe_10",
    "fe_11",
    "fe_12",
    "fe_13",
    "fe_14",
    "fe_15",
    "fe_16",
    "fe_17",
    "fe_18",
    "fe_19",
    "fe_20",
    "fe_21",
    "fe_22",
    "fe_23",
    "fe_24",
    "fe_25",
    "fe_26",
    "fe_27",
    "fe_28",
    "fe_29",
    "fe_30",
    "fe_31",
    "fe_32",
    "fe_33",
    "fe_34",
    "fe_35",
    "fe_36",
    "fe_37",
    "fe_38",
    "fe_39",
    "fe_40"
  ],
  "qa_cybersecurity": [
    "sec_01",
    "sec_02",
    "sec_03",
    "sec_04",
    "sec_05",
    "sec_06",
    "sec_07",
    "sec_08",
    "sec_09",
    "sec_10",
    "sec_11",
    "sec_12",
    "sec_13",
    "sec_14",
    "sec_15",
    "sec_16",
    "sec_17",
    "sec_18",
    "sec_19",
    "sec_20",
    "sec_21",
    "sec_22",
    "sec_23",
    "sec_24",
    "sec_25",
    "sec_26",
    "sec_27",
    "sec_28",
    "sec_29",
    "sec_30",
    "sec_31",
    "sec_32",
    "sec_33",
    "sec_34",
    "sec_35",
    "sec_36",
    "sec_37",
    "sec_38",
    "sec_39",
    "sec_40"
  ],
  "cloud_devops_ai": [
    "ops_01",
    "ops_02",
    "ops_03",
    "ops_04",
    "ops_05",
    "ops_06",
    "ops_07",
    "ops_08",
    "ops_09",
    "ops_10",
    "ops_11",
    "ops_12",
    "ops_13",
    "ops_14",
    "ops_15",
    "ops_16",
    "ops_17",
    "ops_18",
    "ops_19",
    "ops_20",
    "ops_21",
    "ops_22",
    "ops_23",
    "ops_24",
    "ops_25",
    "ops_26",
    "ops_27",
    "ops_28",
    "ops_29",
    "ops_30",
    "ops_31",
    "ops_32",
    "ops_33",
    "ops_34",
    "ops_35",
    "ops_36",
    "ops_37",
    "ops_38",
    "ops_39",
    "ops_40"
  ],
  "tech_lead": [
    "tl_01",
    "tl_02",
    "tl_03",
    "tl_04",
    "tl_05",
    "tl_06",
    "tl_07",
    "tl_08",
    "tl_09",
    "tl_10",
    "tl_11",
    "tl_12",
    "tl_13",
    "tl_14",
    "tl_15",
    "tl_16",
    "tl_17",
    "tl_18",
    "tl_19",
    "tl_20",
    "tl_21",
    "tl_22",
    "tl_23",
    "tl_24",
    "tl_25",
    "tl_26",
    "tl_27",
    "tl_28",
    "tl_29",
    "tl_30"
  ]
}
};

// ============================================================================
// FÁBRICA PROCEDURAL DE CASOS ÚNICOS (4.200 CASOS COMPLETAMENTE HIDRATADOS)
// ============================================================================
function buildUniqueCaseInstance(i) {
  const cfg = CASE_METADATA_CONFIG;
  const caseNum = i + 1;
  const caseId = 'case_' + String(caseNum).padStart(4, '0');
  const caseCode = 'CASE-' + String(caseNum).padStart(4, '0');

  // Setor e Empresa
  const sectorData = cfg.sectors[i % cfg.sectors.length];
  const sectorName = sectorData.name;
  const companyName = sectorData.companies[Math.floor(i / cfg.sectors.length) % sectorData.companies.length];
  const deviceName = sectorData.deviceTypes[Math.floor(i / (cfg.sectors.length * sectorData.companies.length)) % sectorData.deviceTypes.length];

  // Nome do Cliente
  const fn = cfg.firstNames[(i * 7) % cfg.firstNames.length];
  const ln = cfg.lastNames[(i * 13) % cfg.lastNames.length];
  let clientName = fn + ' ' + ln;
  if (i % 11 === 0) {
    const nick = cfg.nicknames[(i * 3) % cfg.nicknames.length];
    clientName = `${fn} "${nick}" ${ln}`;
  }

  // Detalhe Especial
  const specDetail = SPECIAL_DETAILS_CATALOG[i % SPECIAL_DETAILS_CATALOG.length];

  // Categoria de Engenharia e Puzzle
  const catPref = cfg.categoryPreferences[i % cfg.categoryPreferences.length];
  const availablePuzzles = cfg.puzzleIdsByCat[catPref];
  const assignedPuzzleId = availablePuzzles[i % availablePuzzles.length];

  // Urgência
  const urgencies = ['NORMAL', 'MÉDIA', 'ALTA', 'URGENTE', 'CRÍTICA'];
  const urgency = urgencies[(i + (specDetail.id === 'CRUNCH_RELAMPAGO' ? 3 : 0)) % urgencies.length];

  // Recompensa
  let baseReward = 2800 + (i % 25) * 120 + (specDetail.baseBonus || 0);
  if (['ALTA', 'URGENTE', 'CRÍTICA'].includes(urgency)) baseReward += 800;
  baseReward = Math.round(baseReward * (specDetail.payoutBonusMult || 1.0));

  // Look do Chibi
  const look = {
    skin: cfg.skinColors[i % cfg.skinColors.length],
    hair: cfg.hairColors[(i * 3) % cfg.hairColors.length],
    shirt: cfg.shirtColors[(i * 5) % cfg.shirtColors.length],
    glasses: (i % 3 === 0),
    headset: (i % 4 === 0),
    mood: (i % 2 === 0) ? 'happy' : 'neutral'
  };

  // Citação e Mentor
  const quote = `Estamos construindo o ${deviceName} para a ${companyName}. Atenção especial à diretriz: ${specDetail.title}!`;
  const mentorHint = `💡 <b>Engenharia para ${deviceName}:</b> ${specDetail.hint}`;

  // Requisitos dos 5 Pilares
  const requirements = {
    backend: `Arquitetura modular de APIs e microsserviços com resiliência (${specDetail.title}).`,
    frontend: `Interface fluida e responsiva para ${deviceName} com alta fidelidade visual e latência <100ms.`,
    qa: `Bateria de testes automatizados e proteção de segurança (${specDetail.badge}).`,
    cloud: `Infraestrutura em nuvem escalável com containers e monitoramento contínuo (${specDetail.title}).`,
    techLead: `Governança de Clean Architecture, separação rígida de camadas e registro de decisões técnicas (ADR).`
  };

  // 5 Módulos de Montagem do App
  const appModules = {
    backend: {
      id: 'backend',
      title: '⚡ 1. Módulo Backend & APIs',
      options: [
        {
          title: `API Otimizada para ${deviceName} (Alinhada)`,
          desc: requirements.backend,
          matches: true
        },
        {
          title: 'Monólito Legado Sem Índices nem Cache',
          desc: 'Banco em arquivo local com consultas N+1 que travam com mais de 10 conexões.',
          matches: false
        },
        {
          title: 'Arquitetura Superdimensionada Inflexível',
          desc: 'Microsserviços desnecessários com comunicação síncrona encadeada gerando 5s de latência.',
          matches: false
        }
      ]
    },
    frontend: {
      id: 'frontend',
      title: '🎨 2. Módulo Frontend & Mobile',
      options: [
        {
          title: `Interface Responsiva & Acessível (Alinhada)`,
          desc: requirements.frontend,
          matches: true
        },
        {
          title: 'Bundle Pesado Sem Suporte a Celular (38MB)',
          desc: 'Interface estática não-responsiva que estoura a memória do navegador e falha sem internet.',
          matches: false
        },
        {
          title: 'Design Inconsistente Sem Componentização',
          desc: 'Estilos CSS inline duplicados, layout quebrado em telas HD e sem contraste de cores.',
          matches: false
        }
      ]
    },
    qa: {
      id: 'qa',
      title: '🛡️ 3. Módulo QA & Cybersecurity',
      options: [
        {
          title: `Blindagem DevSecOps & Testes Automatizados (Alinhada)`,
          desc: requirements.qa,
          matches: true
        },
        {
          title: 'Deploy Sem Testes e Sem Sanitização',
          desc: 'Código sem linters, inputs sem validação e vulnerável a SQL Injection e XSS.',
          matches: false
        },
        {
          title: 'CORS Aberto em Asterisco e Senhas Expostas',
          desc: 'Cookies sem HttpOnly, tokens expostos em localStorage e logs vazando credenciais.',
          matches: false
        }
      ]
    },
    cloud: {
      id: 'cloud',
      title: '🚀 4. Módulo Cloud, DevOps & IA',
      options: [
        {
          title: `Cluster em Nuvem com Autoscaling & FinOps (Alinhada)`,
          desc: requirements.cloud,
          matches: true
        },
        {
          title: 'Servidor VPS Compartilhado Sem Backup',
          desc: 'Instância única sem redundância, sem certificado SSL e sem monitoramento de integridade.',
          matches: false
        },
        {
          title: 'Cluster Superdimensionado com Custo Excessivo',
          desc: 'Recursos ociosos custando 10x mais por mês sem políticas de desligamento noturno.',
          matches: false
        }
      ]
    },
    techLead: {
      id: 'techLead',
      title: '👑 5. Módulo Tech Lead & Arquitetura',
      options: [
        {
          title: `Clean Architecture & Padrões Sustentáveis (Alinhada)`,
          desc: requirements.techLead,
          matches: true
        },
        {
          title: 'Big Ball of Mud Sem Separação de Camadas',
          desc: 'Lógica de banco misturada com componentes de tela em arquivos únicos de 8.000 linhas.',
          matches: false
        },
        {
          title: 'Engenharia Teórica Inviável',
          desc: 'Complexidade excessiva sem código funcional que adia o MVP em mais de 18 meses.',
          matches: false
        }
      ]
    }
  };

  // Diagnósticos de Escopo
  const diagnoses = [
    {
      title: `Arquitetura Homologada para ${deviceName}`,
      desc: `Consolida as diretrizes do cliente com foco em ${specDetail.title}. Requisitos atendidos e SLA garantido.`,
      correct: true
    },
    {
      title: 'Stack Obsoleta em Servidor Único Desprotegido',
      desc: 'Scripts antigos sem criptografia, sem escalabilidade e sem suporte a concorrência.',
      correct: false,
      burnReason: `O sistema caiu no primeiro pico de acessos e a diretoria da ${companyName} cancelou o contrato!`
    },
    {
      title: 'Engenharia Fraturada com Tecnologias Conflitantes',
      desc: 'Tenta conectar microsserviços sem mensageria com frameworks incompatíveis e sem tolerância a falhas.',
      correct: false,
      burnReason: 'Deadlock distribuído em produção! O sistema ficou indisponível e a reputação despencou.'
    }
  ];

  // 5 Perguntas do Briefing
  const questions = [
    { q: `1. Qual a meta de Backend para o ${deviceName}?`, a: requirements.backend, category: 'backend', asked: false },
    { q: `2. Como deve ser a experiência de Frontend & Mobile?`, a: requirements.frontend, category: 'frontend', asked: false },
    { q: `3. Quais as políticas de QA & Segurança (${specDetail.badge})?`, a: requirements.qa, category: 'qa', asked: false },
    { q: `4. Qual a estratégia de Cloud, DevOps & IA?`, a: requirements.cloud, category: 'cloud', asked: false },
    { q: `5. Qual o direcionamento arquitetural de Tech Lead?`, a: requirements.techLead, category: 'techLead', asked: false }
  ];

  return {
    caseIndex: i,
    id: caseId,
    code: caseCode,
    clientName: clientName,
    company: companyName,
    sector: sectorName,
    device: deviceName,
    urgency: urgency,
    reward: baseReward,
    quote: quote,
    mentorHint: mentorHint,
    look: look,
    categoryPreference: catPref,
    puzzleId: assignedPuzzleId,
    specialDetail: specDetail,
    requirements: requirements,
    appModules: appModules,
    diagnoses: diagnoses,
    questions: questions
  };
}

// ============================================================================
// PRÉ-COMPILAÇÃO DE 4.200 CASOS ÚNICOS EM MEMÓRIA
// ============================================================================
const TOTAL_SOFTWARE_CASES = 4200;
const SOFTWARE_CASES_DATABASE = new Array(TOTAL_SOFTWARE_CASES);

for (let i = 0; i < TOTAL_SOFTWARE_CASES; i++) {
  SOFTWARE_CASES_DATABASE[i] = buildUniqueCaseInstance(i);
}

function getSoftwareCaseById(id) {
  if (typeof id === 'number') return SOFTWARE_CASES_DATABASE[id] || null;
  return SOFTWARE_CASES_DATABASE.find(c => c.id === id || c.code === id) || null;
}

function getRandomSoftwareCase() {
  const idx = Math.floor(Math.random() * SOFTWARE_CASES_DATABASE.length);
  return SOFTWARE_CASES_DATABASE[idx];
}

// Isomorfismo Node.js / Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SPECIAL_DETAILS_CATALOG,
    TOTAL_SOFTWARE_CASES,
    SOFTWARE_CASES_DATABASE,
    buildUniqueCaseInstance,
    getSoftwareCaseById,
    getRandomSoftwareCase
  };
}
