# 💻 PLANTÃO DEV: Software House & Consultoria Tech

Bem-vindo ao **Plantão Dev**, o jogo de simulação e gerenciamento de uma Software House corporativa e consultoria técnica de alto nível. O jogo suporta partidas no modo **Solo (1P)** ou em equipe no modo **Dev Squad Online (até 5 jogadores simultâneos via código de sala P2P)**.

---

## 📁 Estrutura da Pasta `/dev`

| Arquivo | Função / Conteúdo |
| :--- | :--- |
| [`index.html`](file:///c:/Users/Guilherme/Desktop/TI/dev/index.html) | Ponto de entrada principal do jogo na pasta `dev` |
| [`software.html`](file:///c:/Users/Guilherme/Desktop/TI/dev/software.html) | Cópia idêntica e compatível de execução do jogo |
| [`software.js`](file:///c:/Users/Guilherme/Desktop/TI/dev/software.js) | Motor gráfico Canvas 2D, lógica de clientes, física, P2P e escalonamento |
| [`software.css`](file:///c:/Users/Guilherme/Desktop/TI/dev/software.css) | Estilização da interface, HUD, modais de engenharia e cards |
| [`software_cases_database.js`](file:///c:/Users/Guilherme/Desktop/TI/dev/software_cases_database.js) | Banco com mais de **4.200 chamados únicos** de clientes e empresas |
| [`software_puzzles_database.js`](file:///c:/Users/Guilherme/Desktop/TI/dev/software_puzzles_database.js) | Banco de **190 puzzles técnicos** de engenharia de software |
| [`software_hardware_puzzles.js`](file:///c:/Users/Guilherme/Desktop/TI/dev/software_hardware_puzzles.js) | **20 puzzles de Cluster (NOC)** + **40 puzzles de Servidor Físico** |
| `assets/` | Sprites procedurais de móveis, racks, bancadas, sofás e decorações |

---

## 🏢 As 5 Estações de Trabalho do Estúdio

O escritório foi projetado para acomodar até 5 desenvolvedores, cada um com sua especialidade técnica:

| Estação | Especialidade | Linguagens / Ferramentas | Localização |
| :---: | :--- | :--- | :--- |
| **#01** | 👑 **Tech Lead & Fundador** | Arquitetura, Decisões Técnicas, Gestão | Cabine Principal (Inferior) |
| **#02** | 🤝 **Dev Backend & APIs** | Node.js, Go, Python, PostgreSQL, REST | Sala Superior #02 (Laranja) |
| **#03** | 🎨 **Dev Frontend & Mobile** | React, Vue, Flutter, Swift, UI/UX | Sala Superior #03 (Roxa) |
| **#04** | 🛡️ **Dev QA & Cybersecurity** | Testes E2E, Cypress, Pentest, Code Audit | Sala Superior #04 (Verde) |
| **#05** | 🚀 **Engenheiro DevOps & Cloud** | Docker, Kubernetes, AWS, Terraform, IA | Sala Superior #05 (Azul) |

---

## 🌐 Multiplayer Online via Código de Sala (Dev Squad)

O jogo conta com arquitetura de rede híbrida em tempo real:
* **BroadcastChannel:** Conexão instantânea entre abas no mesmo computador;
* **PeerJS (WebRTC):** Conexão P2P real entre amigos pela Internet através do **Código da Sala** (ex: `DEV-4820`).
* **Sincronização em Tempo Real:**
  * Movimentação e posicionamento dos avatares chibi de todos os desenvolvedores;
  * Balões de fala e rádio de figurinhas instantâneo;
  * Indicador de presença `● Online` na lista lateral de técnicos;
  * Progresso financeiro, reputação da empresa e chamados atendidos.
* **Botão `[🤖 +1 Dev]`:** Permite simular a entrada e saída de desenvolvedores diretamente na tela para testes imediatos.

---

## ⚡ Escalonamento Dinâmico de Dificuldade & Paciência

A dificuldade e a velocidade de esgotamento da paciência dos clientes escalam proporcionalmente ao número de técnicos conectados na sede:

| Técnicos Ativos | Dreno de Paciência | Tempo Médio de Espera | Choque de Erro | SLA do Cluster |
| :---: | :---: | :---: | :---: | :---: |
| **1 Dev (Solo)** | **1.0x** (Base) | ~95 a 100 segundos | -8% Paciência | 180s |
| **2 Devs (Duo)** | **1.9x** mais rápido | ~50 segundos | -13% Paciência | 158s |
| **3 Devs (Trio)** | **2.8x** mais rápido | ~34 segundos | -18% Paciência | 136s |
| **4 Devs (Squad)** | **3.7x** mais rápido | ~25 segundos | -22% Paciência | 114s |
| **5 Devs (Campus)** | **4.6x** mais rápido | ~20 a 22 segundos | -27% Paciência | 92s |

### Impactos da Alta Dificuldade em Equipe:
1. **Retrabalho Técnico:** Errar uma solução de engenharia custa de R\$ 200 (1 dev) até R\$ 600 (5 devs).
2. **Multa por Abandono:** Se um cliente sair furioso da fila por demora, a multa sobe de R\$ 400 até R\$ 1.200 e perda de até -36% de reputação.
3. **Bônus Co-op de Entrega:** Cada projeto concluído com sucesso concede **+20% de dinheiro extra por colega conectado**!

---

## 🧩 Bancos de Dados & Desafios Técnicos

1. **4.200 Chamados de Clientes Únicos:**
   * Briefings completos gerados a partir de 28 clientes, 35 empresas, 30 tipos de sistemas e 16 modificadores especiais (SLA Crítico, LGPD, Crunch, Falha Zero-Day, etc.).
   * Mais de 446 milhões de combinações possíveis pelo motor procedural.
2. **190 Puzzles Técnicos de Engenharia:**
   * 40 Puzzles Backend e APIs
   * 40 Puzzles Frontend e Mobile
   * 40 Puzzles QA e Cybersecurity
   * 40 Puzzles Cloud, DevOps e Inteligência Artificial
   * 30 Puzzles Tech Lead e Arquitetura Distribuída
3. **20 Puzzles do Cluster Cloud (NOC):**
   * Desafios de alta disponibilidade, Kubernetes, Ingress, Etcd, Kafka, Redis Sentinel e DDoS.
4. **40 Puzzles do Servidor Dedicado Físico (Bare-Metal):**
   * Desbloqueados após a compra do Servidor na Loja Tech (RAID 5/10, placas SAS, barramentos PCIe, BIOS/UEFI, fontes redundantes, transceivers SFP+ e cabos ópticos).

---

## 🛒 Loja & Setup de Upgrades

* **Bancadas de Software (Níveis 1 a 5):** Aumentam remuneração base e velocidade de compilação.
* **Servidor Físico Dedicado (Racks 1 e 2):** Habilita módulos de cache local e os 40 puzzles de hardware.
* **Sofá Executivo VIP:** Reduz o dreno de estresse dos clientes na recepção em 30%.
* **Máquina de Café Barista & Bebedouro:** Concede boost de velocidade de corrida aos desenvolvedores.
* **Ar-Condicionado Inverter (Níveis 1 a 3):** Mantém a estabilidade térmica dos equipamentos e adiciona bônus de entrega.
