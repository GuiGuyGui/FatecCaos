// ============================================================================
// PLANTÃO DEV - 20 PUZZLES DE CLUSTER (NOC) & 40 PUZZLES DE SERVIDOR DEDICADO
// Puzzles e Mini-Games Próprios com Diagnósticos, Snippets de Terminal e Opções
// ============================================================================

const CLUSTER_PUZZLES_DATABASE = [
  {
    id: 'cl_01',
    num: 1,
    icon: '⚖️',
    title: 'Balanceamento de Carga Nginx & Algoritmo Least-Conn',
    category: 'Load Balancer',
    desc: 'Um dos nós do cluster está recebendo 95% das conexões e sofrendo throttling, enquanto os outros nós estão ociosos.',
    codeSnippet: 'upstream k8s_cluster {\n  # ALGORITMO INADEQUADO: round-robin estático sem peso\n  server 10.0.1.10:8080;\n  server 10.0.1.11:8080;\n  server 10.0.1.12:8080;\n}',
    options: [
      { text: 'Alterar upstream para "least_conn" com verificação de integridade ativa (health checks)', correct: true },
      { text: 'Aumentar o keepalive_timeout para 600s para manter conexões presas no nó lento', correct: false },
      { text: 'Remover dois nós do pool para forçar todo o tráfego em um único servidor', correct: false }
    ],
    explanation: 'O algoritmo least_conn direciona novas requisições para a instância com menor número de conexões ativas, equalizando o cluster.',
    rewardMoney: 950,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'cl_02',
    num: 2,
    icon: '🛡️',
    title: 'Ataque DDoS SYN Flood & Proteção WAF com SYN Cookies',
    category: 'Segurança de Rede',
    desc: 'Tabela de conexões TCP do cluster lotada com 1.000.000 de pacotes SYN semi-abertos vindos de botnet.',
    codeSnippet: '# netstat -s | grep "SYNs to LISTEN"\nTCP: drop open request, table full: 1048576\nkernel: [WARN] Possible SYN flooding on port 443.',
    options: [
      { text: 'Habilitar "sysctl -w net.ipv4.tcp_syncookies=1" e ativar taxa de limite no WAF', correct: true },
      { text: 'Desligar a porta 443 temporariamente para parar o log de avisos', correct: false },
      { text: 'Aumentar o timeout de espera SYN para 120 segundos para reter mais conexões', correct: false }
    ],
    explanation: 'SYN Cookies permitem aceitar conexões sem alocar slots na tabela TCP antes do handshake ACK ser concluído.',
    rewardMoney: 1200,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'cl_03',
    num: 3,
    icon: '🚀',
    title: 'Autoscaling Kubernetes HPA com Métrica Customizada de CPU',
    category: 'Orquestração',
    desc: 'Os pods de backend estão caindo com OOM (Out Of Memory) antes do HPA escalar novos pods.',
    codeSnippet: 'apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nspec:\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target: { type: Utilization, averageUtilization: 95 }',
    options: [
      { text: 'Reduzir o gatilho de CPU para 65% e adicionar métrica combinada de memória e fila', correct: true },
      { text: 'Desativar o HPA e fixar 1 réplica para evitar consumo de memória', correct: false },
      { text: 'Remover o limite de memória (limits.memory) de todos os contêineres', correct: false }
    ],
    explanation: 'Escalar aos 65% de uso dá tempo hábil para os novos pods inicializarem antes do limite de memória estourar.',
    rewardMoney: 1100,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'cl_04',
    num: 4,
    icon: '💾',
    title: 'Sincronização de Réplicas Redis Sentinel com Split-Brain',
    category: 'Cache Distribuído',
    desc: 'Após uma falha de rede temporária, dois nós do cluster Redis se auto-promoveram a Master (Split-Brain).',
    codeSnippet: 'redis-cli -p 6379 info replication\nrole:master\nconnected_slaves:0\n# Outro nó em 6380 também reporta role:master!',
    options: [
      { text: 'Configurar "min-replicas-to-write 1" e forçar failover pelo quórum Sentinel', correct: true },
      { text: 'Manter ambos como master e deixar os clientes gravarem dados divergentes', correct: false },
      { text: 'Limpar todos os dados usando FLUSHALL em todos os nós', correct: false }
    ],
    explanation: 'A diretiva min-replicas-to-write impede que um master isolado aceite escritas se perder comunicação com o cluster.',
    rewardMoney: 1300,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'cl_05',
    num: 5,
    icon: '🔄',
    title: 'Failover Automático PostgreSQL com Patroni & Raft',
    category: 'Banco de Dados',
    desc: 'O nó primário de banco de dados sofreu kernel panic e a aplicação parou de gravar registros.',
    codeSnippet: 'patroni.log: [ERROR] Master 10.0.2.1 is unresponsive.\npatroni.log: [INFO] Initiating leader election via DCS consensus...',
    options: [
      { text: 'Promover a réplica com menor lag de LSN WAL e atualizar o endpoint de escrita', correct: true },
      { text: 'Aguardar o servidor reinicializar sem promover réplica para evitar escritas', correct: false },
      { text: 'Mudar a aplicação para gravar diretamente nas réplicas em modo read-only', correct: false }
    ],
    explanation: 'A réplica com menor atraso de Log Sequence Number garante failover sem perda de transações aprovadas (RPO=0).',
    rewardMoney: 1400,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'cl_06',
    num: 6,
    icon: '⚡',
    title: 'Pool de Conexões PgBouncer em Modo Transação',
    category: 'Performance',
    desc: 'O PostgreSQL atingiu o limite de "max_connections=500" e passou a rejeitar novas requisições da API.',
    codeSnippet: 'psql: FATAL: remaining connection slots are reserved for non-replication superuser connections\nAPI logs: Connection pool exhausted (HTTP 503)',
    options: [
      { text: 'Implementar PgBouncer em pool_mode=transaction com 50 conexões permanentes', correct: true },
      { text: 'Aumentar max_connections para 20.000 até esgotar toda a RAM do servidor', correct: false },
      { text: 'Desligar o banco de dados e usar arquivos JSON no disco', correct: false }
    ],
    explanation: 'Pool em nível de transação multiplexa milhares de conexões de clientes em poucas conexões reais no banco de dados.',
    rewardMoney: 1050,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'cl_07',
    num: 7,
    icon: '🌐',
    title: 'Roteamento Anycast BGP & Resolução DNS com TTL Baixo',
    category: 'Roteamento',
    desc: 'Clientes da região Sul estão sendo roteados para o datacenter da Europa devido a rota BGP com métrica incorreta.',
    codeSnippet: 'traceroute api.empresa.com\n1  10.0.0.1  0.5ms\n2  spo-core-01  2.1ms\n3  lon-edge-01 (Londres)  184.2ms  # Rota cruzando o oceano!',
    options: [
      { text: 'Ajustar BGP AS-Path Prepending e anunciar rotas locais com comunidade geográfica', correct: true },
      { text: 'Aumentar o TTL do DNS para 86.400 segundos para fixar a rota ruim no cache', correct: false },
      { text: 'Pedir para os clientes usarem VPN para acessar o datacenter distante', correct: false }
    ],
    explanation: 'O ajuste de AS-Path prepending penaliza rotas intercontinentais e força o tráfego regional a ficar no nó local.',
    rewardMoney: 1250,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'cl_08',
    num: 8,
    icon: '📜',
    title: 'Renovação Automatizada TLS com Cert-Manager & ACME DNS-01',
    category: 'Criptografia',
    desc: 'O certificado wildcard *.studio.dev expira em 2 horas e o desafio HTTP-01 está bloqueado pelo firewall.',
    codeSnippet: 'cert-manager.log: [FAILED] Challenge "acme-http-01" failed: Connection timed out 443.\nStatus: Certificate expiring in 01h:58m!',
    options: [
      { text: 'Mudar o emissor para o desafio DNS-01 com chave de API do provedor de DNS', correct: true },
      { text: 'Desativar o HTTPS e passar a transmitir dados de clientes em HTTP puro', correct: false },
      { text: 'Ignorar o aviso de certificado inválido no navegador dos clientes', correct: false }
    ],
    explanation: 'O desafio DNS-01 valida a titularidade do domínio inserindo registros TXT sem precisar de portas abertas na internet.',
    rewardMoney: 1150,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'cl_09',
    num: 9,
    icon: '🛡️',
    title: 'Malha de Serviços Istio com mTLS Estrito e Certificados SPIFFE',
    category: 'Segurança Zero-Trust',
    desc: 'Comunicação interna entre microsserviços está trafegando em texto plano vulnerável a sniffing de rede interna.',
    codeSnippet: 'apiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nspec:\n  mtls:\n    mode: PERMISSIVE  # Modo inseguro!',
    options: [
      { text: 'Alterar o modo de autenticação para "STRICT" e aplicar políticas de autorização mTLS', correct: true },
      { text: 'Desativar os sidecars do Envoy para reduzir o uso de CPU', correct: false },
      { text: 'Adicionar senha no header HTTP de cada requisição manual', correct: false }
    ],
    explanation: 'O mTLS STRICT exige criptografia mútua com certificados x509 rotacionados automaticamente a cada poucas horas.',
    rewardMoney: 1350,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'cl_10',
    num: 10,
    icon: '📊',
    title: 'Redução de Lag de Partições no Apache Kafka',
    category: 'Mensageria',
    desc: 'O tópico de processamento de pedidos está acumulando 500.000 mensagens em atraso (consumer lag).',
    codeSnippet: 'kafka-consumer-groups.sh --describe --group order-processors\nTOPIC: orders-stream  PARTITIONS: 12  CURRENT-OFFSET: 12000  LOG-END: 512000  LAG: 500000',
    options: [
      { text: 'Aumentar número de instâncias consumidoras até o limite das 12 partições e tunar fetch.min.bytes', correct: true },
      { text: 'Deletar o tópico inteiro com todos os pedidos para zerar o lag', correct: false },
      { text: 'Reduzir o cluster Kafka para apenas 1 broker monolítico', correct: false }
    ],
    explanation: 'No Kafka, cada partição pode ser lida por no máximo 1 consumidor do mesmo grupo, permitindo paralelismo linear até 12.',
    rewardMoney: 1450,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'cl_11',
    num: 11,
    icon: '📦',
    title: 'Vazamento de Memória JVM & OOMKilled no Kubernetes',
    category: 'Tuning de Pod',
    desc: 'O pod da API Java é finalizado a cada 20 minutos com status OOMKilled (Exit Code 137).',
    codeSnippet: 'dmesg: [oom-killer] Killed process 14920 (java) total-vm:4194304kB, anon-rss:2097152kB\nk8s: pod/api-service-78f status: OOMKilled',
    options: [
      { text: 'Ajustar "-XX:MaxRAMPercentage=75.0" e habilitar dump de heap no OOM para análise', correct: true },
      { text: 'Configurar a memória do pod para infinito sem declarar limits no yaml', correct: false },
      { text: 'Reiniciar o pod a cada 5 minutos através de um cron job no host', correct: false }
    ],
    explanation: 'MaxRAMPercentage faz a JVM respeitar os cgroups do contêiner sem tentar alocar a memória física da máquina hospedeira.',
    rewardMoney: 1200,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'cl_12',
    num: 12,
    icon: '🔐',
    title: 'Rotação de Credenciais Dinâmicas com HashiCorp Vault',
    category: 'Segurança',
    desc: 'Uma chave de acesso de produção com permissão de banco vazou em um log aberto de debug.',
    codeSnippet: 'vault-agent.log: [WARN] Hardcoded secret exposed in log: db_pass="SuperSecret123!"\nAudit: Root key active since 2024!',
    options: [
      { text: 'Revogar a chave vazada, rotacionar o segredo e configurar leasing dinâmico com TTL de 1h', correct: true },
      { text: 'Apagar o arquivo de log e continuar usando a mesma senha no banco', correct: false },
      { text: 'Tornar o banco de dados público sem senha para não precisar de chaves', correct: false }
    ],
    explanation: 'Segredos dinâmicos têm validade curta e são gerados sob demanda, neutralizando vazamentos de credenciais antigas.',
    rewardMoney: 1300,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'cl_13',
    num: 13,
    icon: '🧹',
    title: 'Expurgo de Imagens Órfãs no Docker Registry Privado',
    category: 'Armazenamento',
    desc: 'O volume do Container Registry atingiu 99% de ocupação devido a tags de compilação antigas.',
    codeSnippet: 'df -h /var/lib/registry\n/dev/sda1  500G  495G  5G  99% /var/lib/registry\nDocker daemon: [ERR] no space left on device',
    options: [
      { text: 'Executar "registry garbage-collect" e configurar política de retenção de 30 dias', correct: true },
      { text: 'Excluir a pasta /var/lib/registry inteira enquanto o registry está gravando', correct: false },
      { text: 'Comprimir todas as imagens em zip sem descarregar do registry', correct: false }
    ],
    explanation: 'O comando garbage-collect remove camadas de blobs não referenciadas após a exclusão lógica dos manifestos.',
    rewardMoney: 900,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'cl_14',
    num: 14,
    icon: '🚦',
    title: 'Algoritmo Token Bucket para Rate Limiting na API Gateway',
    category: 'API Gateway',
    desc: 'Um scraper não autorizado está fazendo 4.000 requisições/s e degradando o tempo de resposta da loja.',
    codeSnippet: 'Kong / Envoy: Ingress request rate: 4200 req/s\nOrigin response time: 3850ms (Normal: 45ms)\nHTTP 504 Gateway Timeout: 18%',
    options: [
      { text: 'Aplicar plugin de rate limit com Token Bucket permitindo 100 req/minuto por IP com burst de 20', correct: true },
      { text: 'Duplicar o número de servidores da loja para sustentar o tráfego do bot', correct: false },
      { text: 'Desligar a API Gateway e ligar os clientes diretamente ao banco de dados', correct: false }
    ],
    explanation: 'Token bucket amortece picos normais de usuários reais mas bloqueia requisições abusivas que esgotam os tokens.',
    rewardMoney: 1100,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'cl_15',
    num: 15,
    icon: '🔀',
    title: 'Deadlock Distribuído em Transações Multi-Shard',
    category: 'Consistência',
    desc: 'Dois nós do cluster de microsserviços estão aguardando mutuamente travas de registro (Two-Phase Commit).',
    codeSnippet: 'cluster.log: [DEADLOCK] Transaction #491 waits for lock on shard_A held by #492.\nTransaction #492 waits for lock on shard_B held by #491.',
    options: [
      { text: 'Implementar padrão Saga com transações compensatórias e timeouts de lock decrescentes', correct: true },
      { text: 'Desativar o isolamento ACID e permitir gravações sujas sem verificação', correct: false },
      { text: 'Congelar o cluster por 24 horas até os nós liberarem as travas', correct: false }
    ],
    explanation: 'O padrão Saga divide a transação em passos assíncronos com compensações idempotentes, eliminando locks distribuídos longos.',
    rewardMoney: 1500,
    rewardRep: 4,
    rewardStack: 2
  },
  {
    id: 'cl_16',
    num: 16,
    icon: '💾',
    title: 'Snapshots Imutáveis & Backup Off-Site em Storage Ceph S3',
    category: 'Resiliência',
    desc: 'Auditoria de segurança exige proteção contra ransomware com retenção WORM (Write Once, Read Many).',
    codeSnippet: 'ceph s3: Bucket "db-backups-production" versioning: disabled\nObject Lock: DISABLED\nCompliance status: NON-COMPLIANT',
    options: [
      { text: 'Habilitar Object Lock no Ceph em modo Compliance com retenção legal de 90 dias', correct: true },
      { text: 'Fazer backup em pendrive manual e deixar conectado na porta do servidor', correct: false },
      { text: 'Enviar backups por e-mail em anexo compactado sem criptografia', correct: false }
    ],
    explanation: 'O modo Compliance do S3 Object Lock impede que qualquer usuário (inclusive root) apague ou altere os dados no período.',
    rewardMoney: 1350,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'cl_17',
    num: 17,
    icon: '📈',
    title: 'Estratégia FinOps com Instâncias Spot e Graceful Drain',
    category: 'FinOps & Cloud',
    desc: 'A fatura de nuvem subiu 300% devido ao uso de instâncias On-Demand para processamento de filas em lote.',
    codeSnippet: 'AWS Cost Explorer: On-Demand EC2: $ 18.400 / mês\nSpot Advisor: Economia potencial de 72% com interrupções estimadas em <5%.',
    options: [
      { text: 'Migrar workers assíncronos para Spot Instances com Node Termination Handler para drain gracioso', correct: true },
      { text: 'Diminuir a memória de todos os servidores de banco em produção pela metade', correct: false },
      { text: 'Cancelar os testes automatizados para economizar poder computacional', correct: false }
    ],
    explanation: 'Instâncias Spot custam até 80% menos e o drain gracioso intercepta o aviso de 2 minutos antes do encerramento.',
    rewardMoney: 1250,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'cl_18',
    num: 18,
    icon: '🚨',
    title: 'Resolução de CrashLoopBackOff por Falha de ConfigMap',
    category: 'Kubernetes',
    desc: 'Após um deploy, 8 réplicas do pod de autenticação entraram em CrashLoopBackOff contínuo.',
    codeSnippet: 'kubectl describe pod auth-service-6d8f\nEvents: [Warning] Failed to mount volume "env-config": configmap "auth-jwt-keys" not found.',
    options: [
      { text: 'Criar o ConfigMap "auth-jwt-keys" no namespace correto e reexecutar o rollout', correct: true },
      { text: 'Apagar o deployment inteiro de autenticação da empresa', correct: false },
      { text: 'Hardcodar as chaves no código-fonte e fazer push na branch master', correct: false }
    ],
    explanation: 'O pod não consegue iniciar se uma chave obrigatória referenciada no ConfigMap estiver ausente no namespace.',
    rewardMoney: 1100,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'cl_19',
    num: 19,
    icon: '🕵️',
    title: 'Rastreabilidade Distribuída com OpenTelemetry & Jaeger',
    category: 'Observabilidade',
    desc: 'Uma requisição de checkout demora 6 segundos mas os logs individuais não revelam qual microsserviço causou a lentidão.',
    codeSnippet: 'OpenTelemetry Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736\nSpan: checkout-api (12ms) -> auth-api (18ms) -> inventory-api (???) -> payment-api (???)',
    options: [
      { text: 'Propagar headers W3C TraceContext nas chamadas HTTP e instrumentar os spans pendentes', correct: true },
      { text: 'Inserir console.log("passou aqui") em todos os arquivos do repositório', correct: false },
      { text: 'Desativar o rastreamento para que as requisições fiquem mais rápidas', correct: false }
    ],
    explanation: 'A propagação correta dos cabeçalhos traceparent e tracestate conecta os spans em um gráfico de cascata completo.',
    rewardMoney: 1400,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'cl_20',
    num: 20,
    icon: '💥',
    title: 'Simulação de Chaos Engineering (Chaos Mesh / Pod Chaos)',
    category: 'Resiliência Avançada',
    desc: 'Preparação para a Black Friday: validar se o cluster sobrevive à queda repentina da zona de disponibilidade principal (AZ-1).',
    codeSnippet: 'apiVersion: chaos-mesh.org/v1alpha1\nkind: PodChaos\nspec:\n  action: pod-kill\n  mode: fixed-percent\n  value: "50%"\n  selector: { namespaces: ["production"] }',
    options: [
      { text: 'Executar o experimento simulando perda de AZ e validar se os pods remanescentes atendem 100% do tráfego sem 5xx', correct: true },
      { text: 'Derrubar o cluster em plena madrugada de Black Friday sem avisar ninguém', correct: false },
      { text: 'Cancelar o experimento e confiar que nada falhará em produção', correct: false }
    ],
    explanation: 'O Chaos Engineering intencional valida a resiliência dos sistemas distribuídos antes de incidentes reais acontecerem.',
    rewardMoney: 1600,
    rewardRep: 4,
    rewardStack: 2
  }
];

// ============================================================================
// 40 PUZZLES & MINI-GAMES DE SERVIDOR DEDICADO BARE-METAL (HARDWARE & REDES)
// Disponíveis após adquirir o Servidor Dedicado na Loja Tech!
// ============================================================================

const SERVER_RACK_PUZZLES_DATABASE = [
  {
    id: 'srv_01',
    num: 1,
    icon: '🖧',
    title: 'Reconstrução de RAID 5 com Hot-Spare Ativo',
    category: 'Armazenamento RAID',
    desc: 'O disco /dev/sdc da controladora MegaRAID falhou com erro de I/O e o array está em estado DEGRADED.',
    codeSnippet: 'megacli -AdpAllInfo -aALL\nDevice: /dev/sdc  Status: FAILED (Unrecoverable Read Error)\nRAID Level: 5  State: DEGRADED  Spares: 1 Hot-Spare Ready',
    options: [
      { text: 'Iniciar rebuild no disco Hot-Spare e substituir o drive defeituoso por um SAS de 10k RPM', correct: true },
      { text: 'Formatar o array RAID inteiro para tentar recuperar os setores ruins', correct: false },
      { text: 'Desligar o servidor e retirar todos os discos da gaveta ao mesmo tempo', correct: false }
    ],
    explanation: 'O RAID 5 suporta a perda de 1 disco usando paridade distribuída. O hot-spare reconstrói os dados automaticamente.',
    rewardMoney: 1200,
    rewardRep: 2,
    rewardStack: 2
  },
  {
    id: 'srv_02',
    num: 2,
    icon: '⚡',
    title: 'Substituição Hot-Swap de Fonte Redundante (PSU)',
    category: 'Alimentação Elétrica',
    desc: 'A fonte PSU-2 do rack apresentou falha de ventilador e parou de fornecer energia. O servidor está rodando na PSU-1.',
    codeSnippet: 'ipmitool sensor reading "PSU2 Status"\nStatus: CRITICAL (Power Lost / Fan Failure)\nPSU1 Output: 480W (100% Load Sharing Active)',
    options: [
      { text: 'Puxar a trava de segurança da PSU-2 e deslizar a nova fonte sobressalente sem desligar o servidor', correct: true },
      { text: 'Desligar a chave geral do prédio para trocar a fonte com tranquilidade', correct: false },
      { text: 'Ignorar o alarme enquanto a primeira fonte não explodir', correct: false }
    ],
    explanation: 'Fontes redundantes de servidor corporativo suportam hot-swap completo, mantendo a carga operacional ininterrupta.',
    rewardMoney: 950,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_03',
    num: 3,
    icon: '🧠',
    title: 'Correção de Erro de Memória ECC Single-Bit',
    category: 'Memória RAM',
    desc: 'O módulo DIMM_A2 registrou 1.500 erros corrigíveis por paridade ECC e está perto de falha catastrófica.',
    codeSnippet: 'dmesg | grep -i edac\nEDAC MC0: 1542 CE (Correctable Errors) on DIMM_A2 (Bank 1, Channel 0)\nRisk of Uncorrectable Multi-bit Error: HIGH',
    options: [
      { text: 'Agendar substituição do pente DDR4 ECC Registered e isolar o canal no kernel com memmap', correct: true },
      { text: 'Substituir a memória ECC por uma memória desktop comum sem correção de erros', correct: false },
      { text: 'Aumentar a voltagem do módulo para 3.3V na BIOS para forçar os bits a funcionarem', correct: false }
    ],
    explanation: 'A memória ECC corrige erros de 1 bit mas avisa que o chip físico está degradando antes de um erro de múltiplos bits travar o sistema.',
    rewardMoney: 1100,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_04',
    num: 4,
    icon: '❄️',
    title: 'Tuning Térmico e Throttling de Ventoinhas Delta',
    category: 'Refrigeração',
    desc: 'Processador Xeon atingiu 92°C e a placa mãe ativou Thermal Throttling, derrubando o clock de 3.2GHz para 800MHz.',
    codeSnippet: 'sensors | grep -i "Core 0"\nCore 0: +92.0°C (crit = +98.0°C) [THROTTLED]\nFan 1: 1800 RPM (Speed Profile: QUIET - Incorreto para Datacenter)',
    options: [
      { text: 'Alterar o perfil do BMC para "Performance Cooling" elevando as ventoinhas Delta para 8.000 RPM', correct: true },
      { text: 'Colocar gelo seco em cima da tampa do servidor com o rack ligado', correct: false },
      { text: 'Desativar o sensor de temperatura na BIOS para o processador parar de reclamar', correct: false }
    ],
    explanation: 'O perfil Performance aciona a pressão estática das ventoinhas Delta, forçando fluxo de ar massivo pelo túnel do dissipador.',
    rewardMoney: 1000,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_05',
    num: 5,
    icon: '🔌',
    title: 'Link Aggregation LACP (802.3ad) Dual 10GbE SFP+',
    category: 'Rede Local',
    desc: 'A porta eno1 está saturando com 9.8 Gbps de tráfego de backup e travando o acesso aos microsserviços.',
    codeSnippet: 'ethtool eno1 | grep Speed\nSpeed: 10000Mb/s (Saturation: 99.2%)\neno2: Link Detected: yes, Speed: 10000Mb/s (Idle/Unbonded)',
    options: [
      { text: 'Criar interface bond0 com modo 4 (802.3ad LACP) agregando eno1 + eno2 para 20 Gbps de throughput', correct: true },
      { text: 'Trocar o cabo de fibra ótica por um cabo de telefone antigo', correct: false },
      { text: 'Limitar o tráfego de rede da empresa para 100 Mbps', correct: false }
    ],
    explanation: 'O protocolo LACP agrega múltiplas portas físicas em uma interface lógica com balanceamento de carga e tolerância a falhas.',
    rewardMoney: 1300,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_06',
    num: 6,
    icon: '🖥️',
    title: 'Configuração de Gerenciamento Out-of-Band IPMI / iDRAC',
    category: 'Gerenciamento Remoto',
    desc: 'O servidor travou durante o boot do kernel e não responde a SSH. É necessário acessar a porta dedicada de serviço.',
    codeSnippet: 'ipmitool lan print 1\nIP Address: 0.0.0.0 (Unconfigured)\nMAC Address: d4:85:64:a1:b2:c3 (Dedicated NIC 1)',
    options: [
      { text: 'Atribuir IP estático na VLAN de gerência e abrir o console KVM virtual HTML5 pelo iDRAC', correct: true },
      { text: 'Ligar um monitor de tubo de 20kg na traseira do rack e sentar no chão do corredor', correct: false },
      { text: 'Chutar a porta do rack para ver se o servidor reinicia', correct: false }
    ],
    explanation: 'O IPMI/BMC possui processador e placa de rede independentes, permitindo ligar, desligar e ver a BIOS mesmo sem sistema operacional.',
    rewardMoney: 1150,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_07',
    num: 7,
    icon: '💾',
    title: 'Atualização Segura de Firmware de BIOS UEFI & Microcódigo',
    category: 'Firmware',
    desc: 'Vulnerabilidade de execução especulativa na CPU detectada. É necessário aplicar o patch de microcódigo via UEFI.',
    codeSnippet: 'dmidecode -t bios\nVersion: 1.2.0 (Release: 01/15/2019 - VULNERABLE)\nAvailable Update: 2.8.4 (Fixes Spectre/Meltdown & Memory Stability)',
    options: [
      { text: 'Fazer backup das configurações NVRAM, conectar na no-break e aplicar o arquivo .bin assinado criptograficamente', correct: true },
      { text: 'Puxar o cabo de força no meio do processo de gravação da memória flash', correct: false },
      { text: 'Instalar uma BIOS de placa de videogame no servidor corporativo', correct: false }
    ],
    explanation: 'Atualizações de BIOS corporativa devem ser feitas sob no-break para evitar corrupção irreparável do chip SPI Flash.',
    rewardMoney: 1250,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'srv_08',
    num: 8,
    icon: '🚀',
    title: 'Instalação de Servidor de Boot Remoto PXE via iPXE & TFTP',
    category: 'Provisionamento',
    desc: 'É necessário instalar o sistema operacional em 10 servidores novos sem precisar de pendrive USB em cada máquina.',
    codeSnippet: 'dhcpd.conf:\nnext-server 10.0.0.5;\nfilename "ipxe.efi";\nStatus: TFTP service ready on port 69.',
    options: [
      { text: 'Configurar a opção 66/67 do DHCP e servir a imagem ISO via HTTP com kickstart automatizado', correct: true },
      { text: 'Gravar 10 CDs virgens com gravador de mesa e rodar de máquina em máquina', correct: false },
      { text: 'Digitar o código binário do Linux manualmente pelo teclado na tela preta', correct: false }
    ],
    explanation: 'O PXE (Preboot Execution Environment) baixa o kernel e o instalador pela placa de rede, automatizando 100% da instalação.',
    rewardMoney: 1350,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_09',
    num: 9,
    icon: '🛡️',
    title: 'Criptografia Total de Disco LUKS com Chaveiro TPM 2.0',
    category: 'Segurança Bare-Metal',
    desc: 'Exigência de segurança: se um invasor roubar um disco físico do rack, os dados devem estar ilegíveis.',
    codeSnippet: 'systemd-cryptenroll --tpm2-device=list\nFound TPM 2.0 device: /dev/tpmrm0\nPartition: /dev/nvme0n1p3 (LUKS2 Encryption: Active)',
    options: [
      { text: 'Vincular a chave de descriptografia aos PCRs 0, 2 e 7 do TPM para desbloqueio seguro no boot', correct: true },
      { text: 'Salvar a senha de descriptografia em um arquivo "senha.txt" no desktop sem criptografia', correct: false },
      { text: 'Colocar fita adesiva sobre o disco para impedir que leiam os dados', correct: false }
    ],
    explanation: 'O chip TPM 2.0 só libera a chave de descriptografia se o firmware e os arquivos de boot não tiverem sofrido adulteração.',
    rewardMoney: 1400,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_10',
    num: 10,
    icon: '🔋',
    title: 'Calibração de Bateria e Teste de Carga de No-Break Online',
    category: 'Energia & UPS',
    desc: 'O no-break APC Smart-UPS 3000VA não realiza teste de autonomia há 12 meses e está com alerta de bateria fraca.',
    codeSnippet: 'apcaccess status\nBCHARGE: 100.0 Percent\nTIMELEFT: 12.0 Minutes\nLASTXFER: Automatic Self-Test Overdue',
    options: [
      { text: 'Iniciar rotina de auto-teste calibrada pelo software apcupsd e registrar a curva de descarga das células', correct: true },
      { text: 'Desconectar o cabo terra para ver se o choque elétrico diminui', correct: false },
      { text: 'Ligar uma cafeteira e um micro-ondas no mesmo no-break dos servidores', correct: false }
    ],
    explanation: 'O auto-teste de UPS valida a capacidade real dos acumuladores sob carga sem desestabilizar as fontes dos servidores.',
    rewardMoney: 1050,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_11',
    num: 11,
    icon: '🔀',
    title: 'Mapeamento de LUNs em Storage SAN via Fibre Channel 16G',
    category: 'Storage SAN',
    desc: 'O servidor não está enxergando o volume de 20TB do storage central através da placa HBA QLogic.',
    codeSnippet: 'systool -c fc_host -v\nport_state = "Linkdown"\nWWPN: 21:00:00:24:ff:5b:12:34\nFabric Zoning: Missing zoning on Brocade Switch',
    options: [
      { text: 'Configurar o zoneamento de portas no Switch Fibre Channel Brocade e adicionar o WWPN na LUN Masking', correct: true },
      { text: 'Usar cabo P2 de áudio para conectar o storage no servidor', correct: false },
      { text: 'Trocar o storage por um pendrive de 32GB', correct: false }
    ],
    explanation: 'Na arquitetura SAN, o zoneamento no switch e o LUN Masking garantem que somente o servidor autorizado acesse o volume.',
    rewardMoney: 1500,
    rewardRep: 4,
    rewardStack: 2
  },
  {
    id: 'srv_12',
    num: 12,
    icon: '🌡️',
    title: 'Substituição de Pasta Térmica nos Processadores Dual-Socket',
    category: 'Manutenção Física',
    desc: 'Após 3 anos de uso contínuo, a pasta térmica do Socket 1 ressecou, gerando delta de 25°C em relação ao Socket 0.',
    codeSnippet: 'sensors | grep "Package id"\nPackage id 0: +52.0°C (Normal)\nPackage id 1: +77.0°C (Delta anômalo de +25°C com 10% de carga)',
    options: [
      { text: 'Remover o dissipador, limpar com álcool isopropílico 99.8% e aplicar pasta de alta condutividade com aperto em cruz', correct: true },
      { text: 'Passar pasta de dente no processador porque tem consistência parecida', correct: false },
      { text: 'Assoprar a poeira com o ventilador de mesa virado para a tomada', correct: false }
    ],
    explanation: 'Pasta térmica degradada cria micro-bolsas de ar isolantes. O torque em cruz evita pressão desigual sobre o die do processador.',
    rewardMoney: 1100,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_13',
    num: 13,
    icon: '🏎️',
    title: 'Habilitação de IOMMU e SR-IOV para Virtualização Direta',
    category: 'Virtualização',
    desc: 'A máquina virtual de firewall precisa de acesso direto à placa de rede 10G sem overhead do switch virtual.',
    codeSnippet: 'dmesg | grep -E "DMAR|IOMMU"\nDMAR: IOMMU enabled: Intel-VT-d\nVirtual function count: 0 (SR-IOV disabled on Mellanox NIC)',
    options: [
      { text: 'Habilitar "num_vfs=8" no driver mlx5_core e repassar a Virtual Function (VF) via PCI-Passthrough', correct: true },
      { text: 'Compartilhar a conexão via cabo crossover ligado na placa de som', correct: false },
      { text: 'Desinstalar o hipervisor e rodar o firewall em uma aba do Chrome', correct: false }
    ],
    explanation: 'O SR-IOV particiona uma porta física de rede em várias interfaces virtuais com aceleração de hardware nativa.',
    rewardMoney: 1350,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_14',
    num: 14,
    icon: '🧹',
    title: 'Comando TRIM e Desgaste de SSDs Enterprise NVMe U.2',
    category: 'Discos SSD',
    desc: 'A velocidade de gravação dos SSDs NVMe caiu de 3.500 MB/s para 400 MB/s devido à falta de expurgo de blocos.',
    codeSnippet: 'nvme smart-log /dev/nvme0\npercentage_used: 12%\nwear_leveling_count: OK\nfstrim: Last execution was 8 months ago!',
    options: [
      { text: 'Executar "fstrim -av" e ativar o timer do systemd "fstrim.timer" para execução semanal periódica', correct: true },
      { text: 'Desfragmentar o SSD com o desfragmentador antigo do Windows 98', correct: false },
      { text: 'Bater com uma chave de fenda no SSD para soltar os blocos presos', correct: false }
    ],
    explanation: 'O TRIM avisa a controladora flash sobre blocos apagados, permitindo que o Garbage Collector limpe os setores antes de novas gravações.',
    rewardMoney: 1000,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_15',
    num: 15,
    icon: '🧯',
    title: 'Monitoramento de Sensores de Supressão de Incêndio FM-200',
    category: 'Segurança Física',
    desc: 'Sensor óptico do teto do rack acusou falso positivo de partículas e ameaça disparar o gás de extinção em 60s.',
    codeSnippet: 'fire-alarm-panel.log\nZONE 3: RACK 01 - Optical smoke sensor triggered!\nDischarge countdown: 60 SECONDS REMAINING!',
    options: [
      { text: 'Acionar botão manual de Abort/Hold no painel, verificar ausência de fumaça e limpar poeira do sensor', correct: true },
      { text: 'Jogar baldes de água em cima de todos os servidores para ajudar no combate', correct: false },
      { text: 'Sair correndo e trancar a porta da oficina com a chave por fora', correct: false }
    ],
    explanation: 'O botão de aborto impede o disparo prematuro do agente extintor FM-200, preservando os equipamentos e a integridade da sala.',
    rewardMoney: 1450,
    rewardRep: 4,
    rewardStack: 2
  },
  {
    id: 'srv_16',
    num: 16,
    icon: '📜',
    title: 'Análise de Crash Dump de Kernel Panic com Crash & Kdump',
    category: 'Diagnóstico de SO',
    desc: 'O servidor travou durante a madrugada. O kdump gravou o vmcore em /var/crash/2026-10-22.',
    codeSnippet: 'crash /usr/lib/debug/vmlinux /var/crash/vmcore\nPANIC: "BUG: unable to handle page fault for address 0000000000000028"\nSTACK: nvme_queue_rq+0x42/0x180 [nvme]',
    options: [
      { text: 'Identificar bug no driver NVMe antigo e aplicar atualização estável do kernel com hot-patching', correct: true },
      { text: 'Apagar o arquivo vmcore para não ocupar espaço no disco e fingir que nada aconteceu', correct: false },
      { text: 'Reinstalar o Windows XP no servidor de produção', correct: false }
    ],
    explanation: 'A ferramenta crash inspeciona a pilha de chamadas e os registradores no momento exato do travamento, isolando o driver defeituoso.',
    rewardMoney: 1300,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_17',
    num: 17,
    icon: '📡',
    title: 'Certificação de Cabo Cat6A e Teste de Atenuação NEXT',
    category: 'Cabeamento Estruturado',
    desc: 'Conexão entre o servidor e o switch core está negociando apenas em 100 Mbps com alta taxa de perda de pacotes.',
    codeSnippet: 'Fluke Networks CableIQ Test:\nLength: 18m | Wiremap: SPLIT PAIR on pins 3-6\nNear-End Crosstalk (NEXT): FAIL (-14.2 dB)',
    options: [
      { text: 'Recrimpar o conector RJ45 no padrão T568A/B correto mantendo o trançado até 13mm do contato', correct: true },
      { text: 'Emendar o cabo de rede com fita isolante no meio do conduíte', correct: false },
      { text: 'Prender o cabo com pregos na parede de concreto', correct: false }
    ],
    explanation: 'Pares destrançados geram diafonia (crosstalk) e reflexão de sinal, degradando conexões Gigabit para 100 Mbps ou menos.',
    rewardMoney: 950,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_18',
    num: 18,
    icon: '📦',
    title: 'Configuração de ZFS Storage Pool RAID-Z2 no Hipervisor',
    category: 'Sistemas de Arquivos',
    desc: 'Criação de um pool seguro para máquinas virtuais com proteção contra falha simultânea de até 2 discos.',
    codeSnippet: 'zpool create -f tank raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde /dev/sdf /dev/sdg\nCompression: off\nAshift: 9 (Incorreto para discos modernos de 4K)',
    options: [
      { text: 'Criar pool com ashift=12 para setores 4K nativos e habilitar compressão transparente lz4', correct: true },
      { text: 'Usar sistema FAT32 para formatar todos os discos do storage corporativo', correct: false },
      { text: 'Desligar a checagem de integridade SHA-256 do ZFS para poupar memória', correct: false }
    ],
    explanation: 'O parâmetro ashift=12 alinha as gravações aos setores físicos de 4096 bytes dos discos modernos, evitando penalidades de I/O.',
    rewardMoney: 1400,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_19',
    num: 19,
    icon: '🔒',
    title: 'Isolamento de VLANs Trunking 802.1Q no Switch Top-of-Rack',
    category: 'Segurança de Rede',
    desc: 'Tráfego de rede dos clientes da recepção está vazando na mesma rede dos servidores de banco de dados.',
    codeSnippet: 'show interface gigabitEthernet 1/0/1 switchport\nMode: Access\nAccess Mode VLAN: 1 (DEFAULT / UNTAGGED)  # Falha de isolamento!',
    options: [
      { text: 'Configurar a porta como Trunk 802.1Q permitindo apenas VLAN 10 (Servidores) e isolar VLAN 30 (Visitantes)', correct: true },
      { text: 'Ligar todos os computadores em um hub antigo de 10 Mbps compartilhado', correct: false },
      { text: 'Colocar todos os IPs na mesma faixa 192.168.1.x sem máscara de sub-rede', correct: false }
    ],
    explanation: 'Trunks com tags 802.1Q separam o tráfego lógico no switch físico, impedindo que dispositivos de clientes interceptem pacotes de servidores.',
    rewardMoney: 1200,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'srv_20',
    num: 20,
    icon: '⏱️',
    title: 'Sincronização de Relógio de Alta Precisão NTP Stratum 1',
    category: 'Tempo & Timestamp',
    desc: 'O relógio de hardware do servidor está com drift de 4 segundos, causando invalidação de tokens JWT e transações bancárias.',
    codeSnippet: 'chronyc tracking\nReference ID: none\nStratum: 16 (Unsynchronized)\nSystem time: 4.120582 seconds slow of NTP time',
    options: [
      { text: 'Configurar chrony com pool ntp.br e servidor GPS Stratum 1 com RTC sincronizado via hwclock', correct: true },
      { text: 'Ajustar as horas olhando no relógio de pulso e digitando no comando date', correct: false },
      { text: 'Desativar a data e hora do servidor para que nada mais expire', correct: false }
    ],
    explanation: 'Sistemas distribuídos exigem relógios sincronizados via Chrony/NTP para validar assinaturas criptográficas e ordens de transação.',
    rewardMoney: 1050,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_21',
    num: 21,
    icon: '🛡️',
    title: 'Configuração de Hardware Watchdog contra Travamento de SO',
    category: 'Alta Disponibilidade',
    desc: 'Se o sistema operacional entrar em kernel deadlock, o watchdog deve reiniciar o servidor fisicamente.',
    codeSnippet: 'modprobe iTCO_wdt\ncat /dev/watchdog\nStatus: Hardware timer armed (Timeout: 60s without ping triggers cold reboot)',
    options: [
      { text: 'Ativar o daemon watchdogd para enviar pings regulares e acionar reinicialização limpa em caso de congelamento', correct: true },
      { text: 'Deixar o servidor travado esperando alguém passar e apertar o botão manual', correct: false },
      { text: 'Desinstalar o módulo do watchdog para o sistema nunca mais reiniciar', correct: false }
    ],
    explanation: 'O watchdog de hardware reseta a placa mãe caso o kernel pare de alimentar o timer por esgotamento de threads críticas.',
    rewardMoney: 1150,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_22',
    num: 22,
    icon: '💾',
    title: 'Expansão On-Line de Volume LVM e Filesystem XFS',
    category: 'Sistemas de Arquivos',
    desc: 'O volume lógico /var/lib/docker está com 98% de uso e os contêineres não conseguem mais alocar camadas.',
    codeSnippet: 'df -h /var/lib/docker\n/dev/mapper/vg0-docker  100G  98G  2G  98% /var/lib/docker\nvgdisplay vg0: Free PE: 200 GB available',
    options: [
      { text: 'Executar "lvextend -L +100G /dev/vg0/docker" seguido de "xfs_growfs /var/lib/docker" a quente', correct: true },
      { text: 'Desmontar a partição e formatar com FAT16 para caber mais arquivos', correct: false },
      { text: 'Deletar o kernel do sistema operacional para liberar 50MB de espaço', correct: false }
    ],
    explanation: 'O LVM e o sistema de arquivos XFS suportam expansão online imediata sem necessidade de desmontar volumes nem parar serviços.',
    rewardMoney: 1100,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_23',
    num: 23,
    icon: '🔌',
    title: 'Diagnóstico de Transceptor Ótico SFP+ com Perda de Pacotes',
    category: 'Fibra Ótica',
    desc: 'Interface 10G acusando CRC Errors contínuos devido a conector LC com poeira no espelho de cristal.',
    codeSnippet: 'ethtool -m enp4s0f0\nOptical Rx Power: -22.4 dBm (Threshold: Min -14.0 dBm - LOW SIGNAL)\nInterface RX Errors: 142.091 CRC frames',
    options: [
      { text: 'Limpar os conectores de fibra com caneta de limpeza ótica One-Click de 2.5mm e medir com Optical Power Meter', correct: true },
      { text: 'Passar cuspe na ponta da fibra ótica para limpar a lente', correct: false },
      { text: 'Dobrar o cabo de fibra ótica em 90 graus para prensar a luz dentro do fio', correct: false }
    ],
    explanation: 'Partículas microscópicas no núcleo de 9 micrômetros da fibra atenuam a luz do laser gerando erros de paridade CRC.',
    rewardMoney: 1250,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'srv_24',
    num: 24,
    icon: '🧱',
    title: 'Tuning de Buffer de Anel de Placa de Rede (Ring Buffer)',
    category: 'Performance de Rede',
    desc: 'Sob carga intensa de 8 Gbps, a placa de rede Intel X520 está descartando pacotes por buffer ring overflow.',
    codeSnippet: 'ethtool -g eno1\nPre-set maximums: RX: 4096, TX: 4096\nCurrent hardware settings: RX: 512, TX: 512\nethtool -S eno1 | grep rx_dropped: 849201',
    options: [
      { text: 'Aumentar os ring buffers de hardware para o valor máximo: "ethtool -G eno1 rx 4096 tx 4096"', correct: true },
      { text: 'Diminuir os buffers para zero para liberar memória do controlador', correct: false },
      { text: 'Desligar a placa de rede e usar conexão Wi-Fi compartilhada do celular', correct: false }
    ],
    explanation: 'Ring buffers maiores evitam que rajadas de pacotes sejam descartadas pela placa de rede antes do processamento pela CPU.',
    rewardMoney: 1200,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_25',
    num: 25,
    icon: '📊',
    title: 'Monitoramento de Barramento de Voltagem VRM da Placa-Mãe',
    category: 'Eletrônica de Servidor',
    desc: 'Módulo Regulador de Voltagem (VRM) da placa-mãe está registrando flutuações anormais na linha de 12V.',
    codeSnippet: 'ipmitool sdr type "Voltage"\nVRM Vcore: 1.18 V (OK)\n+12V Rail: 10.92 V (CRITICAL LOW: Tolerance +/- 5% min is 11.40V)',
    options: [
      { text: 'Testar a linha com multímetro calibrado e substituir o cabo modular EPS 8-pin da fonte', correct: true },
      { text: 'Ligar uma bateria de 9V comum com jacarés na placa-mãe', correct: false },
      { text: 'Aumentar o limite de tolerância para ignorar quedas de energia', correct: false }
    ],
    explanation: 'Quedas na linha de 12V causam congelamentos imprevisíveis sob carga alta devido a cabo com mau contato ou resistor fadigado.',
    rewardMoney: 1350,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_26',
    num: 26,
    icon: '🚀',
    title: 'Ajuste de Parâmetros Sysctl de Rede TCP Gigabit (somaxconn)',
    category: 'Tuning de SO',
    desc: 'A fila de backlog TCP do kernel está transbordando em picos de conexões e rejeitando clientes válidos.',
    codeSnippet: 'cat /proc/sys/net/core/somaxconn\n128 (Default arcaico de servidores pequenos!)\ndmesg: TCP: request_sock_TCP: Possible SYN flooding on port 80.',
    options: [
      { text: 'Aumentar "net.core.somaxconn = 65535" e "net.ipv4.tcp_max_syn_backlog = 32768" em /etc/sysctl.conf', correct: true },
      { text: 'Reduzir o somaxconn para 1 para atender apenas uma pessoa por vez', correct: false },
      { text: 'Deletar o arquivo /proc/sys/net do sistema operacional', correct: false }
    ],
    explanation: 'O somaxconn define o limite de conexões completas em fila de espera do socket antes do comando accept() na aplicação.',
    rewardMoney: 1100,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_27',
    num: 27,
    icon: '🔐',
    title: 'Sensor de Intrusão Física de Chassi (Chassis Intrusion)',
    category: 'Segurança Física',
    desc: 'O micro-switch da tampa do servidor acusou abertura indevida do chassi durante a noite.',
    codeSnippet: 'ipmitool sel list\nSEL Record 0042: Chassis Intrusion Detected | Assertion Event\nStatus: Server tampered or cover open while powered!',
    options: [
      { text: 'Inspecionar travas de segurança do rack, validar registros de CFTV e rearmar o sensor no BMC', correct: true },
      { text: 'Colocar fita adesiva no interruptor e ignorar o aviso de violação física', correct: false },
      { text: 'Remover a tampa do chassi para sempre para refrescar os componentes', correct: false }
    ],
    explanation: 'Sensores de chassi evitam ataques físicos onde um invasor conecta dispositivos espiões ou retira unidades criptografadas.',
    rewardMoney: 1000,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_28',
    num: 28,
    icon: '💾',
    title: 'Alinhamento de Setores de 4K (Advanced Format) em Discos',
    category: 'Performance de Disco',
    desc: 'Partição antiga criada com offset desalinhado (Setor 63) forçando a controladora a fazer 2 leituras por bloco.',
    codeSnippet: 'fdisk -l /dev/sdb\nDevice     Boot Start        End    Sectors  Size\n/dev/sdb1        63  1953525167 1953525105  931G  # DESALINHADO! (Não divisível por 8)',
    options: [
      { text: 'Recriar a tabela de partições alinhando o primeiro setor em 2048 (1 MiB boundary)', correct: true },
      { text: 'Continuar usando o setor 63 porque números ímpares trazem sorte', correct: false },
      { text: 'Reduzir o tamanho do disco pela metade', correct: false }
    ],
    explanation: 'Setores desalinhados forçam operação Read-Modify-Write a cada gravação física, reduzindo o IOPS em até 40%.',
    rewardMoney: 1150,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_29',
    num: 29,
    icon: '🛡️',
    title: 'Mitigação de Vulnerabilidades Speculative Execution (Spectre)',
    category: 'Segurança de Processador',
    desc: 'Relatório de conformidade do banco central exige mitigação ativa para Spectre V2 e Retbleed nos núcleos Xeon.',
    codeSnippet: 'cat /sys/devices/system/cpu/vulnerabilities/spectre_v2\nVulnerable: IBPB: disabled, IBRS: disabled\nSpectre V2: Exploitable by unprivileged user space',
    options: [
      { text: 'Habilitar "spectre_v2=on" e ativar IBRS com microcódigo atualizado no carregador GRUB', correct: true },
      { text: 'Desinstalar o antivírus para o computador ficar mais leve', correct: false },
      { text: 'Desligar a CPU e usar um bloco de papel e caneta', correct: false }
    ],
    explanation: 'As barreiras IBRS e retpolines impedem que código em espaço de usuário acerte previsões de salto para ler memória do kernel.',
    rewardMoney: 1300,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_30',
    num: 30,
    icon: '⚡',
    title: 'Substituição de Bateria de Lítio CMOS CR2032 do RTC',
    category: 'Hardware Básico',
    desc: 'A bateria da placa-mãe está com voltagem em 1.9V (nominal 3.0V). Se a energia cair, as configurações de BIOS serão perdidas.',
    codeSnippet: 'ipmitool sensor reading "VBAT"\nSensor: VBAT | Reading: 1.92 Volts (CRITICAL LOW: Min 2.40V)\nCMOS Battery Life Remaining: <5%',
    options: [
      { text: 'Trocar a bateria tipo moeda CR2032 com o servidor conectado à rede elétrica para preservar o circuito RTC', correct: true },
      { text: 'Esquentar a bateria velha no isqueiro para ver se ela ganha carga', correct: false },
      { text: 'Colocar uma moeda de 10 centavos no soquete da bateria', correct: false }
    ],
    explanation: 'Ao trocar a bateria CR2032 com o cabo de standby conectado, o trilho de 3.3Vsb mantém a memória CMOS alimentada.',
    rewardMoney: 900,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_31',
    num: 31,
    icon: '🧮',
    title: 'Alocação de Transparent HugePages (THP) para Banco de Dados',
    category: 'Memória & Kernel',
    desc: 'O banco de dados relacional está sofrendo travamentos momentâneos devido ao overhead de compactação de memória do THP.',
    codeSnippet: 'cat /sys/kernel/mm/transparent_hugepage/enabled\n[always] madvise never  # Modo "always" inadequado para bancos OLTP!\nkhugepaged CPU usage: 98%',
    options: [
      { text: 'Configurar "echo never > /sys/kernel/mm/transparent_hugepage/enabled" e alocar HugePages estáticas de 2MB', correct: true },
      { text: 'Aumentar a swap para 1 terabyte no disco rígido mecânico', correct: false },
      { text: 'Desligar a memória RAM do servidor', correct: false }
    ],
    explanation: 'Bancos de dados como PostgreSQL e Redis sofrem degradação com THP dinâmico devido à fragmentação de páginas em memória.',
    rewardMoney: 1250,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'srv_32',
    num: 32,
    icon: '🔀',
    title: 'Configuração de Roteamento Multipath I/O (MPIO) em Storage',
    category: 'Caminhos Redundantes',
    desc: 'O storage corporativo possui 4 caminhos de fibra ótica mas o Linux está criando 4 discos separados idênticos (/dev/sdb, sdc, sdd, sde).',
    codeSnippet: 'multipath -ll\n# Saída vazia! Mapeador multipathd desativado.\nlsblk: 4 discos idênticos de 10TB aparecendo duplicados sem redundância',
    options: [
      { text: 'Habilitar o daemon multipathd com política round-robin para agrupar os caminhos no dispositivo único /dev/mapper/mpatha', correct: true },
      { text: 'Formatar cada um dos 4 discos com sistemas de arquivos diferentes', correct: false },
      { text: 'Desconectar 3 cabos de fibra ótica para não ver mais nomes repetidos', correct: false }
    ],
    explanation: 'O Device Mapper Multipath agrega múltiplos caminhos físicos de controladoras e switches SAN em um único disco lógico confiável.',
    rewardMoney: 1450,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_33',
    num: 33,
    icon: '🌡️',
    title: 'Detecção de Ponto Quente (Hot Spot) com Câmera Termográfica',
    category: 'Termografia',
    desc: 'Inspeção termográfica revelou um ponto em 108°C no painel traseiro do servidor devido a uma barra de barramento frouxa.',
    codeSnippet: 'FLIR Thermal Camera Analysis:\nHotspot location: PDU Input L2 Connector\nTemperature: 108.4°C (Normal: 42°C) - RISK OF MELTING / FIRE',
    options: [
      { text: 'Desenergizar o segmento, reapertar os bornes com torquímetro calibrado e substituir o conector oxidado', correct: true },
      { text: 'Ligar um ar condicionado portátil apontado direto para o conector em chamas', correct: false },
      { text: 'Pintar o conector com spray preto para disfarçar o calor na câmera', correct: false }
    ],
    explanation: 'Mau contato elétrico aumenta a resistência ôhmica da conexão, gerando aquecimento extremo pela Lei de Joule ($P = R \\cdot I^2$).',
    rewardMoney: 1500,
    rewardRep: 4,
    rewardStack: 2
  },
  {
    id: 'srv_34',
    num: 34,
    icon: '📦',
    title: 'Atualização de Firmware de Controladora MegaRAID SAS LSI',
    category: 'Controladora',
    desc: 'Bug conhecido no firmware 4.2 da controladora LSI 9361-8i causa descarte espúrio de comandos SATA NCQ.',
    codeSnippet: 'storcli /c0 show\nFirmware Package: 24.12.0-0024 (Known bug: NCQ Command Timeout)\nRecommended Version: 24.21.0-0065',
    options: [
      { text: 'Fazer flash da ROM assinado via utilitário storcli e programar reinicialização com flush de cache', correct: true },
      { text: 'Remover a controladora RAID com o servidor ligado no meio da gravação de dados', correct: false },
      { text: 'Instalar o driver de placa de som da Realtek na controladora de disco', correct: false }
    ],
    explanation: 'Firmwares de controladoras SAS gerenciam a fila de comandos nativos (NCQ) e cache de escrita BBU garantindo estabilidade.',
    rewardMoney: 1350,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_35',
    num: 35,
    icon: '📡',
    title: 'Conexão de Console Serial RS-232 / RJ45 para Recuperação',
    category: 'Console Físico',
    desc: 'O subsistema gráfico e de rede caíram simultaneamente. O único acesso disponível é a porta serial traseira COM1.',
    codeSnippet: 'Connecting via /dev/ttyUSB0 (Baud: 115200, 8-N-1)\nGrub bootloader prompt ready: "grub> "',
    options: [
      { text: 'Acessar com emulador de terminal (115200 8N1) e carregar o kernel em modo single-user (init=/bin/bash)', correct: true },
      { text: 'Escrever comandos na carcaça do servidor com pincel atômico', correct: false },
      { text: 'Tentar enviar sinais de fumaça na porta serial', correct: false }
    ],
    explanation: 'A porta serial é o canal mais resiliente de depuração de baixo nível de arquiteturas x86_64 quando drivers complexos falham.',
    rewardMoney: 1150,
    rewardRep: 2,
    rewardStack: 1
  },
  {
    id: 'srv_36',
    num: 36,
    icon: '🧹',
    title: 'Recuperação de Journal Corrompido no Sistema XFS',
    category: 'Filesystem Repair',
    desc: 'Após queda abrupta de energia, o disco /dev/sdb1 recusa a montagem com erro de metadados no journal de transações.',
    codeSnippet: 'mount /dev/sdb1 /data\nmount: /data: mount(2) system call failed: Structure needs cleaning.\ndmesg: XFS (sdb1): Metadata corruption detected',
    options: [
      { text: 'Executar "xfs_repair -L /dev/sdb1" para zerar o log de transações corrompido e restabelecer a consistência', correct: true },
      { text: 'Apagar a partição e criar outra sem verificar os arquivos existentes', correct: false },
      { text: 'Renomear o arquivo corrompido para .mp3 para ver se toca música', correct: false }
    ],
    explanation: 'A ferramenta xfs_repair limpa o journal pendente e reconstrói as árvores B-tree de alocação de blocos do sistema de arquivos.',
    rewardMoney: 1300,
    rewardRep: 3,
    rewardStack: 2
  },
  {
    id: 'srv_37',
    num: 37,
    icon: '🔌',
    title: 'Aterramento Elétrico e Isolação de Loop de Terra no Rack',
    category: 'Infraestrutura Elétrica',
    desc: 'Corrente parasita de 18V detectada entre a carcaça de metal do rack e o barramento de terra principal do data center.',
    codeSnippet: 'Multimeter AC Voltage between Rack Chassis and Ground Rod:\nReading: 18.2 VAC (Permissível: < 1.0 VAC) - Risco de choque e estática!',
    options: [
      { text: 'Conectar cabo de cobre estanhado de 16mm² diretamente no barramento de aterramento equipotencial (TMGB)', correct: true },
      { text: 'Colocar o pé descalço no chão molhado para descarregar a energia do rack', correct: false },
      { text: 'Enrolar o rack em papel alumínio', correct: false }
    ],
    explanation: 'O aterramento equipotencial unifica os potenciais de terra de todos os equipamentos, evitando loops parasitas e descargas eletrostáticas.',
    rewardMoney: 1200,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'srv_38',
    num: 38,
    icon: '🚀',
    title: 'Instalação de Placa Aceleradora PCIe FPGA / SmartNIC',
    category: 'Hardware Avançado',
    desc: 'Instalação de uma placa SmartNIC com processamento de pacotes na placa para descarregar 80% da CPU dos servidores.',
    codeSnippet: 'lspci | grep -i xilinx\n03:00.0 Processing accelerators: Xilinx Corporation Alveo U50\nKernel driver in use: xclmgmt (Ready for bitstream flashing)',
    options: [
      { text: 'Carregar o bitstream de aceleração de rede e ativar o driver de kernel XRT para offload de eBPF na placa', correct: true },
      { text: 'Plugar a placa PCIe na gaveta de gavetas do armário de escritório', correct: false },
      { text: 'Cortar a placa ao meio com uma tesoura para caber no slot menor', correct: false }
    ],
    explanation: 'SmartNICs com FPGA executam filtragem e roteamento de pacotes em silício dedicado com latência na casa dos nanossegundos.',
    rewardMoney: 1600,
    rewardRep: 4,
    rewardStack: 2
  },
  {
    id: 'srv_39',
    num: 39,
    icon: '🛡️',
    title: 'Bloqueio de Portas USB Físicas contra Rubber Ducky (BadUSB)',
    category: 'Segurança Física',
    desc: 'Auditoria de segurança exige que nenhuma porta USB do painel frontal aceite teclados emulados por invasores.',
    codeSnippet: 'usbguard list-devices\nDevice 1: ID 046d:c31c Logitech Keyboard (Allowed)\nDevice 2: ID 1234:5678 Unknown Rubber Ducky HID (BLOCKED)',
    options: [
      { text: 'Implementar a política estrita do USBGuard bloqueando dispositivos HID desconhecidos e travar as portas no BMC', correct: true },
      { text: 'Passar cola instantânea super bonder dentro de todas as entradas USB', correct: false },
      { text: 'Deixar pendrives encontrados na calçada plugados nos servidores de produção', correct: false }
    ],
    explanation: 'O daemon USBGuard autoriza somente dispositivos USB com IDs e assinaturas conhecidas, impedindo ataques de injeção de teclas.',
    rewardMoney: 1250,
    rewardRep: 3,
    rewardStack: 1
  },
  {
    id: 'srv_40',
    num: 40,
    icon: '💾',
    title: 'Recuperação de Superblock Ext4 Danificado com Backup Block',
    category: 'Sistemas de Arquivos',
    desc: 'O primeiro setor do sistema de arquivos foi corrompido por queda de energia e o fsck padrão abortou.',
    codeSnippet: 'dumpe2fs /dev/sda2 | grep -i superblock\nPrimary superblock is corrupt!\nBackup superblocks stored at blocks: 32768, 98304, 163840, 229376...',
    options: [
      { text: 'Executar "e2fsck -b 32768 -y /dev/sda2" utilizando o superblock alternativo gravado no bloco 32768', correct: true },
      { text: 'Formatar o disco e perder todas as fotos e códigos dos últimos 10 anos', correct: false },
      { text: 'Desligar o monitor para o erro desaparecer da tela', correct: false }
    ],
    explanation: 'Sistemas Ext4 guardam cópias redundantes do superblock em múltiplos pontos do disco para permitir restauração total após corrupção.',
    rewardMoney: 1500,
    rewardRep: 4,
    rewardStack: 2
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLUSTER_PUZZLES_DATABASE,
    SERVER_RACK_PUZZLES_DATABASE
  };
}
