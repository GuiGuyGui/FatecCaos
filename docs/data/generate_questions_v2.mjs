import fs from 'fs';

const questionsPath = 'c:/Users/Guilherme/Desktop/Site/data/questions.json';
const existing = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

console.log(`Initial questions count: ${existing.length}`);

const extraQuestions = [
	// ==================== CIBERSEGURANÇA & HACKING ====================
	{
		id: "SEC-000007",
		category: "Segurança",
		skill: "owasp ssrf",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Compreender vulnerabilidades de Server-Side Request Forgery (SSRF).",
		question: "Em uma aplicação web, o que caracteriza uma vulnerabilidade de SSRF (Server-Side Request Forgery)?",
		code: "// Backend vulnerável:\nconst url = req.query.imageUrl;\nconst response = await fetch(url); // Atacante envia http://169.254.169.254/latest/meta-data/",
		options: [
			"O servidor backend é induzido a fazer requisições HTTP para recursos internos restritos ou serviços da nuvem (como metadados da AWS/GCP)",
			"O navegador do usuário envia requisições sem os cabeçalhos de segurança CORS",
			"O banco de dados executa código em Python dentro da procedure SQL",
			"O certificado SSL expira durante a transmissão"
		],
		answer: "O servidor backend é induzido a fazer requisições HTTP para recursos internos restritos ou serviços da nuvem (como metadados da AWS/GCP)",
		explanation: "SSRF ocorre quando um invasor manipula uma URL processada no backend para fazer o servidor consultar endereços da rede interna (localhost, 127.0.0.1, 169.254.169.254) que deveriam ser inacessíveis pela internet.",
		xp: 25,
		tags: ["seguranca", "owasp", "ssrf"]
	},
	{
		id: "SEC-000008",
		category: "Segurança",
		skill: "idor e controle de acesso",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Identificar vulnerabilidade IDOR (Insecure Direct Object Reference).",
		question: "Um usuário acessa a URL `GET /api/faturas/1042`. Ao alterar o ID para `1043`, ele consegue visualizar a fatura sigilosa de outro cliente sem restrição. Qual vulnerabilidade ocorreu?",
		code: null,
		options: [
			"IDOR (Insecure Direct Object Reference / Quebra de Controle de Acesso)",
			"SQL Injection cego",
			"Buffer Overflow de pilha",
			"Negação de Serviço Distribuída (DDoS)"
		],
		answer: "IDOR (Insecure Direct Object Reference / Quebra de Controle de Acesso)",
		explanation: "IDOR ocorre quando uma aplicação expõe uma referência direta a um objeto interno sem validar se o usuário autenticado possui permissão legítima para acessar aquele recurso específico.",
		xp: 20,
		tags: ["seguranca", "idor", "autorizacao"]
	},
	{
		id: "SEC-000009",
		category: "Segurança",
		skill: "wireshark e analise de redes",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Analisar captura de tráfego de rede HTTP em texto claro.",
		question: "Ao analisar uma captura de tráfego .pcap no Wireshark em uma rede pública sem HTTPS, o que um analista consegue extrair de pacotes HTTP puros?",
		code: null,
		options: [
			"Cabeçalhos, parâmetros de URL, cookies de sessão e credenciais em texto claro",
			"Apenas os endereços MAC criptografados com chave assimétrica",
			"Apenas o handshake de criptografia TLS 1.3",
			"Nenhuma informação legível, pois o protocolo TCP mascara os dados automaticamente"
		],
		answer: "Cabeçalhos, parâmetros de URL, cookies de sessão e credenciais em texto claro",
		explanation: "O protocolo HTTP trafega em texto puro (Cleartext). Qualquer intermediário na rede pode interceptar e ler todas as informações enviadas caso o canal não esteja protegido com TLS/HTTPS.",
		xp: 20,
		tags: ["seguranca", "redes", "wireshark"]
	},
	{
		id: "SEC-000010",
		category: "Segurança",
		skill: "privilege escalation linux",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Compreender os riscos do bit de permissão SUID no Linux.",
		question: "No Linux, o que o bit de permissão especial SUID (`chmod u+s /bin/binario`) faz quando um usuário comum executa o arquivo?",
		code: "-rwsr-xr-x 1 root root 85400 /usr/bin/executavel",
		options: [
			"Executa o programa temporariamente com os privilégios do proprietário do arquivo (geralmente root)",
			"Impede que qualquer usuário, incluindo root, modifique o arquivo",
			"Cria um contêiner Docker isolado em memória RAM",
			"Bloqueia a execução do binário por usuários fora do grupo wheel"
		],
		answer: "Executa o programa temporariamente com os privilégios do proprietário do arquivo (geralmente root)",
		explanation: "O bit SUID (Set User ID) faz o binário rodar com os privilégios do seu dono (ex: root). Se esse binário tiver vulnerabilidades ou comandos embutidos de shell, ele permite escalação de privilégios (Privilege Escalation).",
		xp: 25,
		tags: ["linux", "seguranca", "suid"]
	},

	// ==================== HARDWARE & CIRCUITOS ====================
	{
		id: "HD-000006",
		category: "Hardware",
		skill: "portas universais",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Identificar portas lógicas universais na eletrônica digital.",
		question: "Quais portas lógicas são chamadas de 'Portas Universais' porque qualquer outra porta lógica (AND, OR, NOT, XOR) pode ser construída utilizando apenas combinações delas?",
		code: null,
		options: [
			"NAND e NOR",
			"AND e OR",
			"XOR e XNOR",
			"NOT e BUFFER"
		],
		answer: "NAND e NOR",
		explanation: "As portas NAND e NOR são funcionalmente completas (universais). Com arranjos exclusivos de portas NAND ou NOR, é possível sintetizar qualquer função ou circuito booleano existente.",
		xp: 20,
		tags: ["hardware", "logica-digital", "circuitos"]
	},
	{
		id: "HD-000007",
		category: "Hardware",
		skill: "flip-flops e memoria",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Compreender o papel do Flip-Flop como célula elementar de memória.",
		question: "Qual circuito sequencial digital é a unidade fundamental utilizada para armazenar 1 bit de informação em memórias estáticas (SRAM) e registradores de CPU?",
		code: null,
		options: [
			"Flip-Flop (ou Latch)",
			"Multiplexador (MUX)",
			"Somador Completo (Full Adder)",
			"Decodificador de 7 segmentos"
		],
		answer: "Flip-Flop (ou Latch)",
		explanation: "Flip-flops (como o Tipo D ou JK) são circuitos biestáveis que mantêm seu estado de saída (0 ou 1) sincronizados por um sinal de clock, formando a base do armazenamento de registradores e SRAM.",
		xp: 20,
		tags: ["hardware", "flip-flop", "memoria"]
	},
	{
		id: "HD-000008",
		category: "Hardware",
		skill: "arquitetura de computadores von neumann vs harvard",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Diferenciar as arquiteturas Von Neumann e Harvard.",
		question: "Qual é a principal diferença entre a Arquitetura Harvard (usada em microcontroladores) e a Arquitetura Von Neumann clássica?",
		code: null,
		options: [
			"Harvard possui barramentos e memórias físicas separadas para código (instruções) e dados, enquanto Von Neumann compartilha o mesmo barramento",
			"Von Neumann não suporta execução de código compilado em C",
			"Harvard opera exclusivamente em frequência de clock analógica sem registradores",
			"Von Neumann utiliza exclusivamente transistores ópticos"
		],
		answer: "Harvard possui barramentos e memórias físicas separadas para código (instruções) e dados, enquanto Von Neumann compartilha o mesmo barramento",
		explanation: "Na arquitetura Harvard, o processador pode buscar uma instrução na memória de código ao mesmo tempo em que lê ou grava dados na memória de dados, eliminando o gargalo de barramento compartilhado de Von Neumann.",
		xp: 25,
		tags: ["hardware", "arquitetura", "cpu"]
	},

	// ==================== BAIXO NÍVEL / C / ASSEMBLY ====================
	{
		id: "BN-000006",
		category: "Baixo Nível",
		skill: "ponteiros e aritmetica",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Calcular avanço de endereço em aritmética de ponteiros em C.",
		question: "Se um ponteiro `int *p` aponta para o endereço `0x1000` em um sistema de 64 bits onde `sizeof(int) == 4`, para qual endereço `p + 2` apontará?",
		code: "int *p = (int*)0x1000;\n// O que vale p + 2?",
		options: [
			"0x1008",
			"0x1002",
			"0x1016",
			"0x1004"
		],
		answer: "0x1008",
		explanation: "Na aritmética de ponteiros em C, somar `N` a um ponteiro avança `N * sizeof(*p)` bytes na memória. Logo: `0x1000 + (2 * 4) = 0x1008`.",
		xp: 20,
		tags: ["c", "ponteiros", "memoria"]
	},
	{
		id: "BN-000007",
		category: "Baixo Nível",
		skill: "registradores assembly x86",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Identificar o registrador Instruction Pointer na arquitetura x86-64.",
		question: "Qual registrador da CPU na arquitetura x86-64 contém o endereço de memória da próxima instrução a ser buscada e executada?",
		code: null,
		options: [
			"RIP (Instruction Pointer)",
			"RSP (Stack Pointer)",
			"RBP (Base Pointer)",
			"RAX (Accumulator Register)"
		],
		answer: "RIP (Instruction Pointer)",
		explanation: "O RIP (64-bit Instruction Pointer, ou EIP em 32-bit) aponta continuamente para o endereço de memória da próxima instrução que a unidade de controle do processador irá buscar e decodificar.",
		xp: 25,
		tags: ["assembly", "x86", "cpu"]
	},
	{
		id: "BN-000008",
		category: "Baixo Nível",
		skill: "structs e memory alignment",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Entender alinhamento e preenchimento (padding) de structs em C.",
		question: "Por que o tamanho de uma struct em C com `char c; int x;` em um sistema de 32/64 bits é geralmente 8 bytes e não 5 bytes?",
		code: "struct Exemplo {\n    char c; // 1 byte\n    // 3 bytes de padding invisível\n    int x;  // 4 bytes\n};",
		options: [
			"Devido ao Alinhamento de Memória (Memory Padding) para permitir acessos alinhados em limites de 4 bytes mais rápidos pela CPU",
			"Porque o compilador C reserva 3 bytes para a tabela de métodos virtuais",
			"Porque caracteres em C são convertidos automaticamente para UTF-32",
			"É um erro de alocação que causa Segmentation Fault"
		],
		answer: "Devido ao Alinhamento de Memória (Memory Padding) para permitir acessos alinhados em limites de 4 bytes mais rápidos pela CPU",
		explanation: "CPUs modernas leem memória com mais eficiência quando tipos de 4 bytes iniciam em endereços múltiplos de 4. Compiladores inserem bytes de padding automaticamente para garantir alinhamento de alta velocidade.",
		xp: 25,
		tags: ["c", "baixo-nivel", "structs"]
	},

	// ==================== SISTEMAS EMBARCADOS & IOT ====================
	{
		id: "EM-000006",
		category: "Sistemas Embarcados",
		skill: "barramento spi",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Explicar os 4 fios do barramento SPI.",
		question: "Quais são as 4 linhas de comunicação padrão utilizadas pelo barramento SPI (Serial Peripheral Interface)?",
		code: null,
		options: [
			"MOSI, MISO, SCK (Clock) e CS/SS (Chip Select)",
			"TX, RX, VCC e GND",
			"SDA, SCL, INT e RESET",
			"CAN-H, CAN-L, D+ e D-"
		],
		answer: "MOSI, MISO, SCK (Clock) e CS/SS (Chip Select)",
		explanation: "O SPI utiliza: MOSI (Master Out Slave In), MISO (Master In Slave Out), SCK (Clock sincronizado) e CS/SS (Chip Select ativo em nível baixo para selecionar o periférico que vai transmitir).",
		xp: 20,
		tags: ["embarcados", "spi", "sensores"]
	},
	{
		id: "EM-000007",
		category: "Sistemas Embarcados",
		skill: "watchdog timer",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Compreender a função do Watchdog Timer (WDT) em microcontroladores.",
		question: "Qual é o objetivo primordial de habilitar o Watchdog Timer (WDT) em um sistema embarcado crítico ou automotivo?",
		code: null,
		options: [
			"Reiniciar automaticamente o microcontrolador se o firmware travar em um loop infinito ou sofrer deadlock",
			"Aumentar a velocidade do clock da CPU para 5 GHz",
			"Economizar 90% do consumo de energia solar do circuito",
			"Calcular a hora real e o fuso horário via satélite GPS"
		],
		answer: "Reiniciar automaticamente o microcontrolador se o firmware travar em um loop infinito ou sofrer deadlock",
		explanation: "O Watchdog Timer é um temporizador independente. O código principal precisa 'alimentar' o cão de guarda periodicamente. Se o sistema travar e parar de alimentá-lo, o WDT estoura e dispara um reset seguro de hardware.",
		xp: 25,
		tags: ["embarcados", "firmware", "watchdog"]
	},
	{
		id: "EM-000008",
		category: "Sistemas Embarcados",
		skill: "conversores adc",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Calcular tensão lida por conversor ADC de 10 bits.",
		question: "Em um microcontrolador com ADC de 10 bits (resolução de 0 a 1023) alimentado a 5.0V, qual é a tensão aproximada lida quando o valor retornado é 512?",
		code: "Resolução: 10 bits = 1024 degraus\nVref = 5.0V\nValor lido no ADC = 512",
		options: [
			"2.5V",
			"1.0V",
			"5.0V",
			"0.5V"
		],
		answer: "2.5V",
		explanation: "A fórmula de conversão é: `V = (Valor / 1023) * Vref`. Para 512 em 1023 (aproximadamente a metade), a tensão analógica é `5.0V / 2 = 2.5V`.",
		xp: 20,
		tags: ["embarcados", "adc", "sensores"]
	},
	{
		id: "EM-000009",
		category: "Sistemas Embarcados",
		skill: "freertos e tarefas",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Compreender o escalonador preemptivo do FreeRTOS.",
		question: "Em sistemas embarcados rodando FreeRTOS, o que o escalonador preemptivo por prioridades faz quando uma tarefa de maior prioridade sai do estado bloqueado?",
		code: "xTaskCreate(TaskSensor, \"Sens\", 2048, NULL, 3, NULL); // Prioridade 3\nxTaskCreate(TaskDisplay, \"Disp\", 2048, NULL, 1, NULL); // Prioridade 1",
		options: [
			"Interrompe imediatamente a tarefa de menor prioridade e entrega o tempo de CPU para a tarefa de maior prioridade",
			"Aguarda a tarefa atual terminar completamente toda a sua execução antes de trocar",
			"Duplica o número de núcleos da CPU em tempo de execução",
			"Envia um pacote HTTP com o log do escalonamento"
		],
		answer: "Interrompe imediatamente a tarefa de menor prioridade e entrega o tempo de CPU para a tarefa de maior prioridade",
		explanation: "O FreeRTOS preemptivo garante tempo de resposta em tempo real: qualquer tarefa com prioridade superior que se torne 'Ready' preempta (interrompe) a tarefa de menor prioridade de forma instantânea.",
		xp: 25,
		tags: ["freertos", "rtos", "embarcados"]
	},

	// ==================== PROGRAMAÇÃO, BACKEND & ARQUITETURA ====================
	{
		id: "PR-000001",
		category: "JavaScript",
		skill: "event loop microtasks vs macrotasks",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Analisar a ordem de execução do Event Loop no JavaScript.",
		question: "Qual será a ordem de impressão no console do seguinte trecho de código JavaScript?",
		code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
		options: [
			"1, 4, 3, 2",
			"1, 2, 3, 4",
			"1, 4, 2, 3",
			"3, 1, 4, 2"
		],
		answer: "1, 4, 3, 2",
		explanation: "Primeiro roda o código síncrono (1 e 4). Antes de verificar a fila de macrotarefas (setTimeout), o motor JS esvazia a fila de Microtarefas (Promises), imprimindo 3 e, por último, a macrotarefa (2).",
		xp: 25,
		tags: ["javascript", "event-loop", "async"]
	},
	{
		id: "PR-000002",
		category: "Clean Code",
		skill: "solid aberto fechado",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Explicar o princípio Aberto/Fechado (OCP) do SOLID.",
		question: "No acrônimo SOLID, o que dita o Princípio Aberto/Fechado (Open/Closed Principle - O)?",
		code: null,
		options: [
			"Entidades de software devem estar abertas para extensão, mas fechadas para modificação",
			"Arquivos de código devem ser abertos apenas em modo leitura",
			"Todas as classes devem ter um único método público e nenhum privado",
			"Bancos de dados devem estar abertos na porta 80 para facilitar integrações"
		],
		answer: "Entidades de software devem estar abertas para extensão, mas fechadas para modificação",
		explanation: "O OCP preconiza que novas funcionalidades devem ser adicionadas por meio de herança, composição ou polimorfismo (extensão), sem a necessidade de alterar código pré-existente e testado.",
		xp: 20,
		tags: ["solid", "clean-code", "arquitetura"]
	},
	{
		id: "PR-000003",
		category: "Arquitetura",
		skill: "padrao repository",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Compreender o objetivo do padrão Repository na Clean Architecture.",
		question: "Qual é a principal responsabilidade do padrão Repository em uma arquitetura limpa (Clean Architecture)?",
		code: null,
		options: [
			"Mediar o acesso à camada de dados, desacoplando a lógica de negócio dos detalhes de persistência (SQL, NoSQL, ORM)",
			"Gerar documentação Swagger automática de endpoints REST",
			"Criar branches e commits automáticos no repositório Git",
			"Compactar imagens estáticas para aumentar performance no navegador"
		],
		answer: "Mediar o acesso à camada de dados, desacoplando a lógica de negócio dos detalhes de persistência (SQL, NoSQL, ORM)",
		explanation: "O Repository encapsula a lógica necessária para acessar fontes de dados. As regras de negócio dependem de interfaces abstratas de repositório, permitindo trocar o banco de dados sem quebrar o core do sistema.",
		xp: 20,
		tags: ["arquitetura", "clean-architecture", "design-patterns"]
	}
];

// Add unique extra questions
const idSet = new Set(existing.map(q => q.id));
let count = 0;
for (const q of extraQuestions) {
	if (!idSet.has(q.id)) {
		existing.push(q);
		idSet.add(q.id);
		count++;
	}
}

fs.writeFileSync(questionsPath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`Successfully added ${count} deep specialization questions. Total questions in database: ${existing.length}`);
