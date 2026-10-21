// Script to generate all 30 problem themes and verify them
const fs = require('fs');

const HARDWARE_THEMES = [
  // 1. dust_blower (Soprador de ar & poeira)
  {
    minigameType: 'dust_blower',
    requiredPart: 'dust_cleaner',
    urgency: 'Limpeza Física',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Gabinete com 3kg de Poeira e Teias de Aranha',
        quote: "\"Meu ${d} parece uma múmia do Egito! Quando ligo, sobe um tornado de poeira cinza e o cooler nem consegue girar de tanta teia!\"",
        questions: [
          { q: '1. Há quanto tempo esse computador não é aberto?', a: '"Comprei em 2011 e nunca tirei a tampa lateral, virou um fóssil!"' },
          { q: '2. As ventoinhas tentam girar?', a: '"Dão meia volta, engasgam num tufo de pelo de gato e param!"' },
          { q: '3. Você tentou limpar com pano úmido?', a: '"Quase joguei água sanitária, mas fiquei com medo de dar curto."' },
          { q: '4. O computador desliga por superaquecimento?', a: '"Bate 95°C só de olhar para a área de trabalho!"' }
        ],
        tools: [
          { name: '🔍 1. Inspeção Visual de Chassi', result: 'Camada de 1.5cm de poeira compactada nas aletas do dissipador e teias no VRM.' },
          { name: '🌡️ 2. Sensor Térmico em Idle', result: '92°C na CPU devido a fluxo de ar 100% bloqueado.' },
          { name: '💨 3. Anemômetro de Bancada', result: 'Vazão de ar: 0 CFM. Bloqueio mecânico total.' }
        ],
        correct: { title: 'Usar Soprador Antiestático, Pincel Macio e Desobstruir Aletas do Dissipador', desc: 'Remove toda a poeira e teias sem gerar eletricidade estática, restaurando fluxo de ar.' },
        wrongs: [
          { title: 'Lavar o Chassi com Mangueira de Pressão de Lavajato Ligado na Tomada', desc: 'Jato de água de alta pressão.', burnReason: 'A água sob pressão destruiu todos os componentes e explodiu a fonte!' },
          { title: 'Tocar Fogo com Isqueiro nas Teias de Aranha Dentro do Gabinete', desc: 'Queimar as teias com chama.', burnReason: 'As partes plásticas pegaram fogo e o gabinete inteiro derreteu!' }
        ]
      }
    ]
  },
  // 2. thermal_spatula (Espátula térmica & álcool isopropílico)
  {
    minigameType: 'thermal_spatula',
    requiredPart: 'cpu_ram',
    urgency: 'Limpeza Física',
    tagClass: 'tag-urgente',
    variations: [
      {
        theme: 'Pasta Térmica Original Petrificada Há 8 Anos',
        quote: "\"O processador do meu ${d} virou uma chapa de hamburgueria! A pasta térmica secou tanto que parece cimento Portland colado no silício!\"",
        questions: [
          { q: '1. O dissipador sai facilmente?', a: '"Parece soldado! Tive medo de arrancar o soquete junto se puxasse forte."' },
          { q: '2. Qual a consistência da pasta?', a: '"Uma casca dura e quebradiça que solta lascas marrons."' },
          { q: '3. A temperatura bate 100°C?', a: '"Basta abrir o bloco de notas que ele já começa a apitar de febre!"' },
          { q: '4. Você tem pasta nova?', a: '"Não, achei que pasta térmica vinha com validade eterna."' }
        ],
        tools: [
          { name: '🔬 1. Teste de Resistência Térmica', result: 'Zero transferência de calor condutiva. Pasta totalmente cristalizada.' },
          { name: '🌡️ 2. Termografia do Die', result: 'Hotspot de 104°C no núcleo central.' },
          { name: '🧴 3. Análise de Solvência', result: 'Requer solvente isopropílico e raspador não abrasivo.' }
        ],
        correct: { title: 'Remover Crosta com Espátula Plástica, Limpar Die com Álcool Isopropílico e Aplicar Pasta de Prata', desc: 'Restaura a condutividade térmica perfeita entre o die da CPU e a base do cooler.' },
        wrongs: [
          { title: 'Raspar a Crosta Usando uma Furadeira com Broca de Concreto', desc: 'Remoção com furadeira.', burnReason: 'A broca perfurou o die de silício e destruiu o soquete da placa-mãe!' },
          { title: 'Passar Super Cola Instantânea para Colar o Cooler no Silício', desc: 'Colar com cianoacrilato.', burnReason: 'A cola isolou o calor e o processador fritou até rachar em dois!' }
        ]
      }
    ]
  },
  // 3. fan_unjam (Desobstrução & lubrificação de ventoinha)
  {
    minigameType: 'fan_unjam',
    requiredPart: 'dust_cleaner',
    urgency: 'Hardware',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Ventoinhas Enroscadas com Cabelo e Mancal Seco',
        quote: "\"As ventoinhas do meu ${d} estão gritando como uma taquara rachada! Estão cheias de fios de cabelo e não giram mais direito!\"",
        questions: [
          { q: '1. O barulho é constante?', a: '"Parece um helicóptero caindo quando ligo o computador!"' },
          { q: '2. Tem animais de estimação perto do PC?', a: '"Dois gatos persas que adoram dormir em cima do exaustor!"' },
          { q: '3. As pás da hélice estão quebradas?', a: '"Estão inteiras, mas travadas por uma peruca de fios enrolados no eixo."' },
          { q: '4. O motor está quente ao toque?', a: '"A carcaça plástica do cooler está quase derretendo de esforço."' }
        ],
        tools: [
          { name: '🔍 1. Estroboscópio Óptico', result: 'Ventoinha girando a apenas 320 RPM (esperado: 2200 RPM).' },
          { name: '🪛 2. Teste de Rotação Manual', result: 'Eixo emperrado por fios de nylon e resíduos de poeira no rolamento.' },
          { name: '🌡️ 3. Termômetro do Motor', result: 'Bobina do fan a 80°C por sobrecarga mecânica.' }
        ],
        correct: { title: 'Remover Resíduos com Pinça Cirúrgica, Limpar Eixo e Aplicar Micro-Gota de Óleo Sintético', desc: 'Libera a rotação mecânica e lubrifica o mancal de rolamento para máxima durabilidade.' },
        wrongs: [
          { title: 'Injetar Óleo de Cozinha Velho de Fritura de Pastel no Motor', desc: 'Óleo vegetal culinário.', burnReason: 'O óleo vegetal esquentou, virou graxa grudenta e travou o cooler em chamas!' },
          { title: 'Quebrar as Pás Travadas com Alicate de Bico pra Fazer Vento Rápido', desc: 'Arrancar as pás do fan.', burnReason: 'O desbalanceamento quebrou o eixo em alta velocidade estilhaçando a carcaça!' }
        ]
      }
    ]
  },
  // 4. cockroach_nest (Expurgo de ninho de baratas na fonte)
  {
    minigameType: 'cockroach_nest',
    requiredPart: 'dust_cleaner',
    urgency: 'Limpeza Crítica',
    tagClass: 'tag-critica',
    variations: [
      {
        theme: 'Colônia de Baratas Alemãs Morando na Fonte de 750W',
        quote: "\"Socorro! Fui ligar meu ${d} e saiu faísca com cheiro de inseto assado! Tem anteninhas saindo pela grade da fonte de energia!\"",
        questions: [
          { q: '1. O PC estava em local úmido ou perto da cozinha?', a: '"Ficava no chão embaixo da pia da lanchonete!"' },
          { q: '2. Você viu insetos andando por dentro?', a: '"Uma família inteira com filhotes passeando nos capacitores!"' },
          { q: '3. A fonte ainda dá sinal de vida?', a: '"Dá um estalo forte e desarma o disjuntor da casa inteira."' },
          { q: '4. Tem ninho com ovos na placa?', a: '"Está cheio de casulos marrons atrás da bobina indutora."' }
        ],
        tools: [
          { name: '🔍 1. Endoscópio de Bancada', result: 'Carcaça de baratas fechando contato elétrico entre a linha primária de 380V e o terra.' },
          { name: '⚡ 2. Medidor de Curto-Circuito', result: 'Resistência de 0.2 Ohms provocada por carcaça condutiva de pragas.' },
          { name: '🧴 3. Reagente Químico Sanitizante', result: 'Necessário expurgo total a seco com aspirador antiestático e sanitizante.' }
        ],
        correct: { title: 'Aspirar Insetos com Sugador Antiestático, Descontaminar Carcaça e Trocar Isoladores', desc: 'Elimina os condutores biológicos em curto e higieniza a placa da fonte de alimentação.' },
        wrongs: [
          { title: 'Espirrar Inseticida Spray Aerossol Altamente Inflamável com PC Ligado', desc: 'Inseticida inflamável na fonte.', burnReason: 'O gás do spray entrou em combustão com as faíscas da fonte e explodiu o laboratório!' },
          { title: 'Mergulhar a Fonte Aberta em Bacia com Álcool 70% Conectada na Força', desc: 'Banho de álcool ligado.', burnReason: 'Arco voltaico de alta tensão eletrocutou a bancada e pulverizou a fonte!' }
        ]
      }
    ]
  },
  // 5. socket_pins (Alinhamento de pinos tortos LGA com agulha)
  {
    minigameType: 'socket_pins',
    requiredPart: 'mobo_build',
    urgency: 'Hardware',
    tagClass: 'tag-urgente',
    variations: [
      {
        theme: 'Pinos do Soquete LGA1700 Entortados por Dedo Apressado',
        quote: "\"Fui tirar o plástico protetor do soquete do ${d} com uma chave de fenda e esbarrei nos pinos! Agora tem 4 pinos deitados e o PC não liga nem com reza!\"",
        questions: [
          { q: '1. Quantos pinos parecem fora do alinhamento?', a: '"Vejo uns 4 pinos brilhando tortos para a esquerda sob a luz."' },
          { q: '2. Você tentou ligar o processador com os pinos tortos?', a: '"Coloquei o Core i9 por cima e apertei a alavanca, ouvi um estalo."' },
          { q: '3. A placa-mãe mostra código de erro?', a: '"Debug LED trava em CPU (vermelho) sem dar vídeo."' },
          { q: '4. Algum pino chegou a quebrar?', a: '"Parecem apenas entortados, nenhum decepou ainda."' }
        ],
        tools: [
          { name: '🔬 1. Microscópio Estereoscópico', result: 'Pinos A1, B3, C7 e D4 inclinados em 45°. Curto entre linhas VCC e SENSE.' },
          { name: '⚡ 2. Teste de Linha de Alimentação', result: 'Pino VCCSA em contato indevido com terra.' },
          { name: '🪡 3. Inspeção de Elasticidade do Ouro', result: 'Pinos conservam maleabilidade para desentortar com ponta ultrafina.' }
        ],
        correct: { title: 'Alinhar Pinos Sob Microscópio com Pinça de Precisão e Agulha Cirúrgica em 90°', desc: 'Restaura a geometria original dos contatos do soquete sem quebrar as hastes douradas.' },
        wrongs: [
          { title: 'Passar um Rolo de Massa de Pastel com Força por Cima do Soquete', desc: 'Pressionar com rolo pesado.', burnReason: 'O rolo amassou e decepou todos os 1700 pinos do soquete de uma vez só!' },
          { title: 'Lixar os Pinos Tortos com Lixa de Ferro Grossa até Nivelar', desc: 'Desgastar contatos.', burnReason: 'A lixa destruiu a camada condutiva de ouro e inutilizou permanentemente a placa-mãe!' }
        ]
      }
    ]
  },
  // 6. ram_contacts (Limpeza de contatos dourados da RAM com borracha)
  {
    minigameType: 'ram_contacts',
    requiredPart: 'cpu_ram',
    urgency: 'Limpeza Física',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Contatos Dourados da Memória RAM Oxidados com Azinhavre',
        quote: "\"O meu ${d} dá 3 beeps longos e não liga! Tirei os pentes de memória e os contatos dourados estão verdes e manchados parecendo moeda velha enterrada!\"",
        questions: [
          { q: '1. O ambiente onde o PC fica tem maresia ou umidade?', a: '"Moro a 20 metros da praia de Santos, a maresia come tudo aqui!"' },
          { q: '2. O pente está bem firme no slot?', a: '"Encaixei várias vezes mas a máquina só apita sem reconhecer a memória."' },
          { q: '3. A oxidação está cobrindo muitos pinos?', a: '"Pelo menos uns 6 contatos dourados estão escurecidos e sem brilho."' },
          { q: '4. Você já limpou contatos antes?', a: '"Ouvi dizer que passar borracha escolar branca resolve na hora!"' }
        ],
        tools: [
          { name: '🔍 1. Lupa de Precisão 20x', result: 'Camada de óxido de cobre (azinhavre) isolando 6 pinos de dados DDR.' },
          { name: '⚡ 2. Ohmímetro de Alta Precisão', result: 'Resistência infinita (circuito aberto) nos barramentos DQ0-DQ5.' },
          { name: '🧽 3. Teste de Abrasão Leve', result: 'Remoção com elastômero isento de resíduos recupera 100% da condutividade.' }
        ],
        correct: { title: 'Friccionar Borracha Branca Macia nos Contatos até Obter Brilho Espelhado e Limpar Resíduos', desc: 'Remove a película de oxidação isolante sem danificar a camada nobre de ouro dos contatos.' },
        wrongs: [
          { title: 'Mergulhar a Memória RAM em Ácido Muriático para Corroer a Sujeira', desc: 'Corrosão química com ácido.', burnReason: 'O ácido dissolveu todas as trilhas de cobre e os chips de silício da memória!' },
          { title: 'Raspar os Contatos com Bombril Seco Ligado na Tomada para Tirar Faísca', desc: 'Palha de aço condutiva.', burnReason: 'Os fiapos de aço entraram no slot, deram curto maciço e queimaram o chipset!' }
        ]
      }
    ]
  },
  // 7. cmos_battery (Troca de bateria CR2032 e reset do CMOS)
  {
    minigameType: 'cmos_battery',
    requiredPart: 'cmos_bios',
    urgency: 'Hardware',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Bateria CR2032 Zerada e Relógio Voltando para 1970',
        quote: "\"Toda vez que desligo o ${d} da tomada, ele esquece a data e hora, volta para 01/01/1970 e pede F1 para entrar no Setup da BIOS!\"",
        questions: [
          { q: '1. Você já trocou essa bateria tipo moeda alguma vez?', a: '"Essa bateria veio de fábrica quando o PC foi montado em 2015!"' },
          { q: '2. As configurações de XMP e boot se perdem?', a: '"Perde tudo! Tenho que configurar o SSD de boot manualmente todo dia."' },
          { q: '3. A bateria está estufada ou vazando líquido?', a: '"Está desbotada e sem pressão na trava metálica do soquete."' },
          { q: '4. A data errada impede navegação na internet?', a: '"Sim! Todos os sites dão erro de certificado SSL inválido!"' }
        ],
        tools: [
          { name: '⚡ 1. Multímetro Digital DC', result: 'Tensão da bateria atual: 0.92V (Mínimo operacional: 2.80V, Nominal: 3.00V).' },
          { name: '💾 2. Leitor de NVRAM BIOS', result: 'Checksum Error permanente ao cortar alimentação da rede elétrica.' },
          { name: '🔌 3. Diagnóstico de RTC (Real Time Clock)', result: 'Oscilador de 32.768 kHz parando por falta de polarização de backup.' }
        ],
        correct: { title: 'Substituir Bateria Esgotada por Nova CR2032 de Lítio 3V e Resetar Jumper CLR_CMOS', desc: 'Restaura a retenção de dados da memória CMOS e a precisão do relógio em tempo real do sistema.' },
        wrongs: [
          { title: 'Ligar Fios da Tomada de 110V Direto no Soquete da Bateria Moeda', desc: 'Injetar 110V no circuito CMOS.', burnReason: 'A sobretensão de 110V explodiu o chip Super I/O e a ponte sul da placa-mãe!' },
          { title: 'Tentar Recarregar a Pilha de Lítio Comum no Fogão a Gás', desc: 'Aquecer bateria no fogo.', burnReason: 'A bateria de lítio estourou com o calor e lançou estilhaços na cozinha!' }
        ]
      }
    ]
  },
  // 8. custom_water_leak (Vedação de fittings de water cooler custom)
  {
    minigameType: 'custom_water_leak',
    requiredPart: 'watercooler_wires',
    urgency: 'Hardware Crítico',
    tagClass: 'tag-critica',
    variations: [
      {
        theme: 'Gotejamento de Fluido Azul nos Conectores da Placa de Vídeo',
        quote: "\"O water cooler custom do meu ${d} está vazando gotas de corante azul direto no conector PCIe da placa de vídeo de 15 mil reais!\"",
        questions: [
          { q: '1. Onde você notou o início do vazamento?', a: '"Bem na rosca do fitting angular perto do reservatório da bomba!"' },
          { q: '2. Você apertou as roscas com a mão ou ferramenta?', a: '"Achei que rosca de acrílico só precisava de um toquezinho frouxo."' },
          { q: '3. A bomba está fazendo barulho de sucção de ar?', a: '"Está borbulhando alto porque o nível de fluido está baixando rápido!"' },
          { q: '4. O líquido chegou a pingar na placa ligada?', a: '"Desliguei correndo assim que vi a primeira gota escorrendo pelo tubo!"' }
        ],
        tools: [
          { name: '🔦 1. Luz Negra UV Forense', result: 'Trilhas de fluido fluorescente vazando em 3 conexões de compressão frouxas.' },
          { name: '📊 2. Manômetro de Pressão de Loop', result: 'Pressão caindo de 0.6 bar para 0.1 bar em 30 segundos. Falha de estanqueidade.' },
          { name: '🧲 3. Teste de O-Ring de Vedação', result: 'Anéis de borracha intactos, requer aperto correto e purga de bolhas.' }
        ],
        correct: { title: 'Apertar Conexões Compression Fittings, Trocar O-Rings Frouxos e Purgar Ar do Sistema', desc: 'Garante estanqueidade total de 0.6 bar no circuito fechado e elimina risco de curto elétrico.' },
        wrongs: [
          { title: 'Passar Chiclete Mastigado em Volta dos Tubos para Vedar o Vazamento', desc: 'Vedar com goma de mascar.', burnReason: 'O chiclete cedeu com a pressão quente e espirrou fluido condutivo em todos os chips!' },
          { title: 'Deixar Vazando e Colocar uma Toalha de Banho Encharcada Dentro do Chassi', desc: 'Toalha molhada no gabinete.', burnReason: 'A toalha encostou nos circuitos da fonte e provocou um curto explosivo!' }
        ]
      }
    ]
  },
  // 9. cpu_ram (CPU & RAM Dual Channel clássico)
  {
    minigameType: 'cpu_ram',
    requiredPart: 'cpu_ram',
    urgency: 'Hardware',
    tagClass: 'tag-urgente',
    variations: [
      {
        theme: 'Memórias RAM em Single-Channel e Trava do Soquete Frouxa',
        quote: "\"Minha Workstation com processador de 16 núcleos no ${d} desliga do nada e perdeu metade da velocidade nos jogos!\"",
        questions: [
          { q: '1. Em quais canais você encaixou os módulos de memória?', a: '"Coloquei nos slots 1 e 2 (A1 e A2) colados um no outro."' },
          { q: '2. O cooler está bem travado com pressão correta?', a: '"Acho que esqueci de dar a última volta na mola de fixação do parafuso."' },
          { q: '3. O CPU-Z reconhece 128 bits de largura de banda?', a: '"Mostra apenas 64-bit Single Channel!"' },
          { q: '4. A temperatura atinge níveis de estrangulamento térmico?', a: '"Bate 102°C assim que começa a compilar código."' }
        ],
        tools: [
          { name: '🌡️ 1. Termografia de Die', result: 'Temperatura de 102°C por contato irregular entre CPU e dissipador.' },
          { name: '📊 2. Diagnóstico de Topologia SPD', result: 'Pentes em A1+A2. Requer canais alternados A2+B2 para ativar Dual-Channel.' },
          { name: '⚡ 3. Teste de Estabilidade AIDA64', result: 'Throttling de 38% e metade da taxa de transferência de memória.' }
        ],
        correct: { title: 'Reaplicar Pasta Térmica com Pressão Uniforme e Mover Pentes para os Slots A2 e B2', desc: 'Ativa barramento Dual-Channel de 128-bit e reduz a temperatura em mais de 35°C.' },
        wrongs: [
          { title: 'Soldar os Dois Pentes de RAM Juntos com Solda de Estanho', desc: 'Unir memórias com ferro de solda.', burnReason: 'A solda uniu os pinos de alimentação aos pinos de dados e destruiu a controladora de memória!' },
          { title: 'Colocar Gelo Seco Direto na Placa sem Proteção Anticondensação', desc: 'Gelo seco sem isolamento.', burnReason: 'A condensação de água pingou nas fases do VRM e explodiu a placa-mãe!' }
        ]
      }
    ]
  },
  // 10. rj45 (Crimpagem RJ45)
  {
    minigameType: 'rj45',
    requiredPart: 'rj45',
    urgency: 'Rede',
    tagClass: 'tag-rede',
    variations: [
      {
        theme: 'Cabo de Rede Crimpado na Ordem Errada Perdendo 90% dos Pacotes',
        quote: "\"O cabo de rede que liga o ${d} ao servidor cai a cada 10 segundos e a velocidade não passa de 10 Mbps!\"",
        questions: [
          { q: '1. Qual sequência de cores foi usada na ponta do conector?', a: '"Coloquei as cores que achei mais bonitas sem seguir nenhuma tabela!"' },
          { q: '2. O cabo foi destrançado por um trecho muito longo?', a: '"Destrancei quase 10 centímetros antes de enfiar no conector de plástico."' },
          { q: '3. Os contatos de cobre chegaram até o fim do conector?', a: '"Alguns fios parecem ter ficado mais curtos que os outros por dentro."' },
          { q: '4. O testador de cabos acende todos os 8 LEDs?', a: '"Os LEDs 3 e 6 ficam piscando fora de ordem e o LED 7 está apagado."' }
        ],
        tools: [
          { name: '🔌 1. Testador de Cabo RJ45 Master/Remote', result: 'Pinagem incorreta. Pares invertidos gerando diafonia (crosstalk) destrutiva.' },
          { name: '📶 2. Analisador de Ruído e Atenuação', result: 'Perda de pacotes de 87% na frequência Gigabit de 250 MHz.' },
          { name: '📏 3. Certificador Fluke Networks', result: 'Falha no teste NEXT (Near-End Crosstalk). Não atende padrão Cat6.' }
        ],
        correct: { title: 'Decapar Cabo, Alinhar os 8 Fios na Norma T-568B e Crimpar Conector Cat6 Blindado', desc: 'Restaura a pinagem correta e o cancelamento eletromagnético para Gigabit 1000 Mbps estável.' },
        wrongs: [
          { title: 'Emendar os Fios de Rede com Fita Isolante e Ligar na Tomada de 220V', desc: 'Energizar par trançado.', burnReason: 'A corrente de 220V entrou na porta de rede do computador e fritou a placa de rede onboard!' },
          { title: 'Passar Durex no Lugar do Conector RJ45 de Plástico', desc: 'Fixar cabo com fita adesiva.', burnReason: 'Os fios soltos encostaram na carcaça do conector e fecharam curto na linha PoE!' }
        ]
      }
    ]
  },
  // 11. psu_wires (Fonte ATX modular)
  {
    minigameType: 'psu_wires',
    requiredPart: 'psu_wires',
    urgency: 'Hardware',
    tagClass: 'tag-urgente',
    variations: [
      {
        theme: 'Cabos Modulares Conectados nas Entradas Invertidas da Fonte',
        quote: "\"Comprei uma fonte modular de 1000W para o ${d}, mas enfiei o cabo da placa de vídeo no conector da CPU e agora não dá partida!\"",
        questions: [
          { q: '1. Os conectores EPS 12V e PCIe foram diferenciados?', a: '"Achei que conector de 8 pinos era tudo igual e enfiei onde coube!"' },
          { q: '2. O cabo principal ATX de 24 pinos está travado com o clique?', a: '"Está meio solto balançando de um lado."' },
          { q: '3. A fonte desarma com clique mecânico do relé de proteção?', a: '"Faz um TEC seco e não gira nenhuma ventoinha."' },
          { q: '4. Cheirou a queimado?', a: '"Deu um leve cheiro de plástico quente antes de desarmar."' }
        ],
        tools: [
          { name: '⚡ 1. Testador Digital de Fonte ATX', result: 'Proteção OCP (Over Current) e SCP (Short Circuit) disparada por pinagem invertida.' },
          { name: '🔌 2. Verificação de Conectores de Saída', result: 'Cabo PCIe (polaridade inversa) conectado no soquete EPS da placa-mãe.' },
          { name: '📊 3. Medidor de Linhas 12V, 5V e 3.3V', result: 'Linhas zeradas devido ao travamento de segurança do circuito PWM.' }
        ],
        correct: { title: 'Conectar Cada Cabo Modular Exclusivamente em Seu Barramento Específico (24P, EPS, PCIe e SATA)', desc: 'Restaura o equilíbrio elétrico correto e permite a liberação do sinal POWER_GOOD.' },
        wrongs: [
          { title: 'Forçar o Conector com Chave de Fenda para Ligar Invertido Mesmo Assim', desc: 'Inversão forçada de polaridade.', burnReason: 'A polaridade inversa de 12V no terra explodiu todos os MOSFETs da placa!' },
          { title: 'Jumpear os Pinos da Fonte com um Arame de Caderno para Ignorar o Curto', desc: 'Burlar circuito de proteção.', burnReason: 'Sem proteção contra curto, a fonte explodiu os capacitores principais em labaredas!' }
        ]
      }
    ]
  },
  // 12. mobo_build (Tabuleiro de 9 espaçadores)
  {
    minigameType: 'mobo_build',
    requiredPart: 'mobo_build',
    urgency: 'Montagem',
    tagClass: 'tag-urgente',
    variations: [
      {
        theme: 'Placa-Mãe Aparafusada Direto no Metal Sem Espaçadores',
        quote: "\"Montei minha placa Z790 no gabinete do meu ${d}, mas aparafusei a placa de circuito direto na chapa de lata sem os pininhos de latão!\"",
        questions: [
          { q: '1. Quantos espaçadores (standoffs) você instalou antes da placa?', a: '"Nenhum! Achei que aqueles parafusos dourados compridos eram peças sobressalentes!"' },
          { q: '2. As soldas das costas da placa estão encostando na lata?', a: '"A placa inteira está encostada na chapa de metal do gabinete."' },
          { q: '3. Quando liga na tomada, dá curto geral?', a: '"Os LEDs piscam por meio segundo e apagam na hora."' },
          { q: '4. O processador foi assentado com alinhamento correto?', a: '"Instalei no soquete LGA mas não tenho certeza se o triângulo bateu."' }
        ],
        tools: [
          { name: '🔍 1. Inspeção de Chassi', result: '9 pontos de contato direto entre trilhas de solda da placa e chassi aterrado.' },
          { name: '⚡ 2. Testador de Continuidade', result: 'Curto generalizado entre alimentação VCC e plano de terra do gabinete.' },
          { name: '📏 3. Gabarito de Furação ATX', result: 'Furação padrão ATX requer 9 espaçadores de latão de 6.5mm de altura.' }
        ],
        correct: { title: 'Instalar os 9 Espaçadores de Latão, Isolar a Chapa Traseira e Rosquear Placa com Torque Correto', desc: 'Garante o isolamento dielétrico perfeito entre o verso do circuito impresso e o gabinete metálico.' },
        wrongs: [
          { title: 'Bater com Martelo nas Costas da Placa para Amassar as Soldas que Encostam', desc: 'Martelar trilhas de circuito.', burnReason: 'O impacto partiu a placa de circuito impresso em múltiplos pedaços e rompeu as 8 camadas!' },
          { title: 'Passar Óleo de Freio no Metal para Conduzir Melhor a Energia da Lata', desc: 'Fluido de freio condutivo.', burnReason: 'O fluido de freio corroeu as trilhas e provocou curto de alta amperagem!' }
        ]
      }
    ]
  },
  // 13. gpu_12vhpwr (Cabo 12VHPWR 600W)
  {
    minigameType: 'gpu_12vhpwr',
    requiredPart: 'gpu_12vhpwr',
    urgency: 'Hardware Crítico',
    tagClass: 'tag-critica',
    variations: [
      {
        theme: 'Conector de 16 Pinos da RTX 4090 Frouxo Cheirando a Queimado',
        quote: "\"Minha RTX 4090 no ${d} está cheirando a baquelite queimado! O conector de 16 pinos está com folga e quase derretendo o plástico!\"",
        questions: [
          { q: '1. O conector foi inserido até ouvir o clique mecânico da trava?', a: '"Ficou com um vão de uns 2 milímetros porque o cabo do gabinete era duro."' },
          { q: '2. O cabo faz uma curva muito fechada antes de 35mm da ponta?', a: '"Dobrei em 90 graus bem rente ao conector pra fechar a tampa de vidro."' },
          { q: '3. A placa de vídeo consome até 450W em jogos pesados?', a: '"Basta abrir o simulador que o sensor mostra corrente de 50 Amperes!"' },
          { q: '4. Você notou descoloração nos pinos metálicos centrais?', a: '"Dois pinos do meio estão ficando com tom bronze escuro queimado."' }
        ],
        tools: [
          { name: '🌡️ 1. Câmera Termográfica Flir', result: 'Temperatura do conector atingindo 118°C nos 4 pinos centrais de alimentação.' },
          { name: '📏 2. Calibrador de Folga Micrométrico', result: 'Folga de 2.2mm. Contato elétrico parcial gerando alta resistência de contato (R_contact).' },
          { name: '⚡ 3. Análise de Queda de Tensão (Voltage Drop)', result: 'Queda de 12.0V para 11.1V na entrada da GPU. Risco iminente de fusão plástica.' }
        ],
        correct: { title: 'Calibrar Folga em 0.0mm com Encaixe Completo, Ajustar Tensão em 12.0V e Curva de Ventilação', desc: 'Garante resistência de contato inferior a 0.05 Ohms e opera dentro da zona térmica segura de 45°C.' },
        wrongs: [
          { title: 'Amarrar o Conector com Arame de Pão de Forma e Cobrir com Fita Crepe', desc: 'Fixação com arame condutivo.', burnReason: 'O arame esquentou com a alta amperagem, fundiu os 16 pinos e queimou o VRM da placa!' },
          { title: 'Derramar Cola Quente Fervendo Dentro dos 16 Pinos para Vedar Folga', desc: 'Preencher pinos com cola.', burnReason: 'A cola isolou os pinos de sensoriamento e provocou arco elétrico destrutivo de 600W!' }
        ]
      }
    ]
  },
  // 14. vrm_soldering (Solda VRM MOSFETs)
  {
    minigameType: 'vrm_soldering',
    requiredPart: 'vrm_soldering',
    urgency: 'Eletrônica',
    tagClass: 'tag-urgente',
    variations: [
      {
        theme: 'MOSFETs de Alta em Curto Desarmando a Linha de 12V da Placa',
        quote: "\"O VRM do ${d} soltou um estalo alto com cheiro de pólvora! O multímetro apita continuidade entre a linha de 12V e o terra!\"",
        questions: [
          { q: '1. O computador sofreu pico de tensão ou queda de raio?', a: '"Caiu um raio na rua e a luz deu um tranco forte antes do estalo."' },
          { q: '2. Tem algum componente chamuscado perto do soquete da CPU?', a: '"Tem uma manchinha escura em cima de dois chips quadradinhos do VRM."' },
          { q: '3. A fonte desarma instantaneamente ao tentar ligar a placa?', a: '"Desarma no mesmo milissegundo de apertar o Power."' },
          { q: '4. Você tem estação de solda com ar quente e fluxo de qualidade?', a: '"Tenho a estação aqui pronta para substituir os componentes defeituosos."' }
        ],
        tools: [
          { name: '⚡ 1. Multímetro em Escala de Diodo/Continuidade', result: 'Curto franco (0.000V) nas fases #02, #05, #08 e #11 do regulador de tensão.' },
          { name: '🌡️ 2. Termografia com Injeção de 1V na Linha', result: 'MOSFETs com queima de junção interna dissipando 45W em ponto único.' },
          { name: '🔬 3. Microscópio Óptico SMD', result: 'Encapsulamento PowerStage rachado por avalanche térmica.' }
        ],
        correct: { title: 'Dessoldar os 4 MOSFETs em Curto com Ar Quente a 380°C, Limpar Ilhas e Soldar Novos Componentes', desc: 'Elimina o curto-circuito na linha principal de 12V e restabelece as 12 fases do VRM.' },
        wrongs: [
          { title: 'Ligar 220V Direto nas Trilhas para Fazer o Curto Explodir e Desaparecer', desc: 'Injetar sobretensão destrutiva.', burnReason: 'A explosão de 220V destruiu todas as 8 camadas da placa-mãe e estilhaçou o silício!' },
          { title: 'Raspar os MOSFETs com Chave de Fenda até Arrancar as Trilhas de Cobre', desc: 'Arrancar ilhas com força mecânica.', burnReason: 'Arrancar as ilhas rompeu os planos internos de alimentação tornando o conserto impossível!' }
        ]
      }
    ]
  },
  // 15. delid_liquid_metal (Delid & Metal Líquido)
  {
    minigameType: 'delid_liquid_metal',
    requiredPart: 'cpu_ram',
    urgency: 'Hardware Avançado',
    tagClass: 'tag-urgente',
    variations: [
      {
        theme: 'Delid Extremo para Redução de 25°C com Metal Líquido',
        quote: "\"O Core i9 do ${d} bate 100°C mesmo com water cooler de 360mm! Preciso remover a tampa de cobre (IHS) e aplicar metal líquido no silício!\"",
        questions: [
          { q: '1. Você possui a guilhotina mecânica especial de delid?', a: '"Sim, ferramenta de descolagem com parafuso de torque progressivo."' },
          { q: '2. Os capacitores SMD em volta do die precisam ser isolados?', a: '"Com certeza, o metal líquido é altamente condutor e não pode encostar neles!"' },
          { q: '3. A cola original de fábrica é de silicone preto de alta resistência?', a: '"Sim, cola dura que precisa ser raspada antes de reassentar o IHS."' },
          { q: '4. Qual a redução de temperatura esperada com metal líquido?', a: '"Em média 20°C a 28°C de queda imediata nos testes pesados."' }
        ],
        tools: [
          { name: '🔧 1. Guilhotina de Precisão Delid-Die-Mate', result: 'Lâmina ajustada para separar a tampa de cobre do substrato sem tracionar o silício.' },
          { name: '🛡️ 2. Fita Kapton Isolante de Alta Temperatura', result: 'Isolamento dielétrico de 5000V para blindagem dos capacitores SMD vizinhos.' },
          { name: '🧪 3. Metal Líquido Galinstan (73 W/mK)', result: 'Condutividade térmica 9x superior a qualquer pasta térmica convencional de prata.' }
        ],
        correct: { title: 'Separar IHS com Ferramenta Delid, Isolar SMDs com Esmalte/Kapton e Espalhar Filme de Metal Líquido', desc: 'Elimina o estrangulamento térmico na transferência direta de calor do silício para o cobre.' },
        wrongs: [
          { title: 'Cortar a Tampa do Processador com uma Makita de Obra sem Proteção', desc: 'Corte mecânico abrasivo.', burnReason: 'O disco da serra cortou o die de silício pela metade e pulverizou o processador!' },
          { title: 'Derramar Metal Líquido sem Isolar os Capacitores e Ligar na Tomada', desc: 'Metal líquido nos capacitores.', burnReason: 'O metal líquido fechou curto em todos os capacitores SMD e carbonizou a CPU!' }
        ]
      }
    ]
  }
];

const SOFTWARE_THEMES = [
  // 16. trojan_hunter (Caça a cavalos de troia & backdoors)
  {
    minigameType: 'trojan_hunter',
    requiredPart: 'software_toolkit',
    urgency: 'Limpeza Lógica',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Cavalos de Troia Camuflados de Processos do Sistema',
        quote: "\"O ${d} está com a webcam piscando sozinha, mouse mexendo sem ninguém encostar e processos estranhos como svch0st.exe gastando 70% de CPU!\"",
        questions: [
          { q: '1. O que foi baixado recentemente na máquina?', a: '"Um ativador pirata de Windows e um gerador de gemas de jogo!"' },
          { q: '2. A internet fica lenta como se estivesse enviando arquivos?', a: '"O tráfego de upload está no talo enviando dados para servidores desconhecidos."' },
          { q: '3. O gerenciador de tarefas fecha sozinho quando tenta abrir?', a: '"Ele fecha em 2 segundos para tentar esconder os processos falsos!"' },
          { q: '4. Você notou processos com nomes parecidos com os do Windows?', a: '"Tem um svch0st com zero e um winlogon32 com ícone de bloco de notas."' }
        ],
        tools: [
          { name: '🛡️ 1. Scanner Forense de Processos na Memória', result: 'Detectados 3 binários com injeção de código DLL maliciosa e porta 4444 aberta.' },
          { name: '🌐 2. Monitor de Conexões TCP/IP Netstat', result: 'Conexão ativa de Reverse Shell enviando telas capturadas para IP externo.' },
          { name: '📑 3. Analisador de Assinatura Digital de Binários', result: 'Processos sem assinatura Microsoft fingindo ser serviços legítimos do sistema.' }
        ],
        correct: { title: 'Encerrar Processos Falsificados, Enviar Trojans para Quarentena Segura e Purgar Chaves do Registro', desc: 'Elimina as portas dos invasores e restabelece a integridade operacional do sistema operacional.' },
        wrongs: [
          { title: 'Dar Permissão de Administrador Total para os Trojans no Firewall', desc: 'Liberar acesso total aos invasores.', burnReason: 'Os hackers criptografaram todo o sistema operacional e roubaram as senhas bancárias!' },
          { title: 'Deletar a Pasta Windows/System32 Inteira Para Eliminar os Vírus', desc: 'Deletar pasta vital do sistema.', burnReason: 'A deleção destruiu o boot do Windows e causou tela azul irreversível!' }
        ]
      }
    ]
  },
  // 17. cookie_cleaner (Triturador de 4000 cookies e rastreadores)
  {
    minigameType: 'cookie_cleaner',
    requiredPart: 'software_toolkit',
    urgency: 'Limpeza Lógica',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Mais de 4.000 Rastreadores, Supercookies e Histórico Oculto',
        quote: "\"Basta eu pesquisar um sapato no ${d} que começam a pipocar 800 anúncios me perseguindo em todos os sites! O navegador consome 8GB de RAM só de lixo!\"",
        questions: [
          { q: '1. Há quanto tempo o cache do navegador não é limpo?', a: '"Desde que comprei o computador em 2018! Nunca apaguei nada."' },
          { q: '2. O navegador demora mais de 30 segundos para abrir?', a: '"Trava o computador inteiro só para carregar a página inicial."' },
          { q: '3. Você aceitou todos os cookies em todos os sites?', a: '"Sempre clico em Aceitar Todos para sair da frente rápido!"' },
          { q: '4. Existem extensões desconhecidas instaladas?', a: '"Tem umas 5 barras de busca e cupons que eu nunca vi."' }
        ],
        tools: [
          { name: '🧹 1. Varredura de Armazenamento DOM e LSO', result: '4.218 cookies de terceiros, 1.4 GB de cache zumbi e 850 beacons de rastreamento.' },
          { name: '📊 2. Análise de Telemetria e Perfil Publicitário', result: 'Perfis de rastreamento cruzado gravando hábitos de navegação em segundo plano.' },
          { name: '⚡ 3. Benchmark de Inicialização do Navegador', result: 'Atraso de 28 segundos causado por banco SQLite de histórico corrompido.' }
        ],
        correct: { title: 'Purgar Supercookies, Limpar Histórico Oculto, Apagar Beacons e Zerar Cache de Navegação', desc: 'Libera gigabytes de memória RAM e elimina todo o rastreamento invasivo de telemetria.' },
        wrongs: [
          { title: 'Instalar Mais 10 Extensões Gratuitas de Limpeza de Cookies Duvisosas', desc: 'Instalar mais adwares.', burnReason: 'As extensões instalaram mineradores ocultos e travaram o navegador para sempre!' },
          { title: 'Tentar Desinstalar o Monitor Físico para Parar os Anúncios Visuais', desc: 'Desconectar periférico.', burnReason: 'Arrancar os cabos com força entortou os pinos da porta HDMI da placa de vídeo!' }
        ]
      }
    ]
  },
  // 18. popups_closer (Chuva de 5 pop-ups do Baidu e adwares)
  {
    minigameType: 'popups_closer',
    requiredPart: 'software_toolkit',
    urgency: 'Limpeza Lógica',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Chuva de 5 Janelas Pop-up com Botões Falsos de Fechar',
        quote: "\"O navegador do meu ${d} virou um circo! Abrem 5 janelas piscando dizendo que ganhei um milhão de dólares e que o PC vai explodir se eu não clicar!\"",
        questions: [
          { q: '1. As janelas têm botões de fechar enganosos?', a: '"Sim! Se clico no X vermelho falso ele abre mais 3 páginas de propaganda!"' },
          { q: '2. Começou depois de instalar algum programa grátis?', a: '"Baixei um conversor de PDF e desmarquei nada nas caixas de seleção."' },
          { q: '3. Toca som de alerta ou música irritante?', a: '"Fica uma sirene de polícia tocando em loop dizendo que tenho vírus!"' },
          { q: '4. A página inicial do navegador foi sequestrada?', a: '"Foi trocada por um portal de notícias desconhecido cheio de anúncios."' }
        ],
        tools: [
          { name: '🔍 1. Mapeamento de Camadas DOM Hijack', result: 'Detectadas janelas modais com overlays invisíveis e botões de fechar fraudulentos.' },
          { name: '🛡️ 2. Inspetor de Notificações Push do Navegador', result: '3 sites suspeitos com permissão de enviar notificações invasivas na área de trabalho.' },
          { name: '📑 3. Análise de Injeção de Scripts de Adware', result: 'Scripts externos injetando banners em todos os sites legítimos visitados.' }
        ],
        correct: { title: 'Identificar e Fechar Todos os Pop-ups pelo Botão Autêntico, Revogar Notificações e Desativar Scripts', desc: 'Cessa a inundação de anúncios fraudulentos e restaura o controle do usuário sobre o navegador.' },
        wrongs: [
          { title: 'Clicar em Todos os Banners Que Dizem Ganhe um Carro Grátis Agora', desc: 'Clicar nos links maliciosos.', burnReason: 'Os links baixaram um ransomware que trancou todos os arquivos em 10 segundos!' },
          { title: 'Passar Fita Isolante Preta por Cima da Tela Onde os Pop-ups Aparecem', desc: 'Tapar a tela com fita.', burnReason: 'A fita arrancou o filme polarizador do monitor LCD arruinando o painel!' }
        ]
      }
    ]
  },
  // 19. disk_defrag (Desfragmentador retrô anos 90)
  {
    minigameType: 'disk_defrag',
    requiredPart: 'software_toolkit',
    urgency: 'Otimização',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'HD com 78% de Fragmentação e Acesso em Milhares de Pedaços',
        quote: "\"O disco do meu ${d} parece uma peneira! Para abrir uma foto de família o HD mecânico fica estalando a agulha por 3 minutos procurando os pedaços!\"",
        questions: [
          { q: '1. Há quanto tempo você não roda uma otimização de disco?', a: '"Acho que nunca rodei desfragmentador desde que comprei o computador!"' },
          { q: '2. O disco mecânico fica em 100% de uso no Gerenciador?', a: '"Fica em 100% o tempo todo mesmo sem nenhum programa aberto."' },
          { q: '3. O som da agulha de leitura é de arranhão ou tec-tec contínuo?', a: '"Parece uma máquina de costura a toda velocidade batendo na lata."' },
          { q: '4. O disco tem bastante espaço livre para manobrar os arquivos?', a: '"Tem cerca de 30% de espaço livre, perfeito para reorganizar."' }
        ],
        tools: [
          { name: '📊 1. Mapa de Clusters de Alocação de Disco', result: 'Taxa de fragmentação crítica de 78%. Mais de 42.000 fragmentos de arquivos espalhados.' },
          { name: '⏱️ 2. Tempo Médio de Acesso aos Setores (Seek Time)', result: 'Tempo de busca em 24ms (ideal: < 8ms) devido ao vai-e-vem excessivo do braço mecânico.' },
          { name: '💾 3. Verificação de Saúde S.M.A.R.T.', result: 'Mecânica saudável, sem setores defeituosos (bad blocks), apenas desorganização lógica severa.' }
        ],
        correct: { title: 'Executar Desfragmentação e Consolidação dos Blocos Fragmentados em Setores Contíguos', desc: 'Reúne os pedaços dos arquivos em blocos sequenciais, reduzindo em 70% o tempo de carregamento.' },
        wrongs: [
          { title: 'Abrir a Tampa de Metal do HD Mecânico Ligado para Empurrar a Agulha com a Mão', desc: 'Abrir disco fora de sala limpa.', burnReason: 'A poeira do ar riscou os pratos magnéticos e destruiu todos os dados instantaneamente!' },
          { title: 'Passar um Imã Potente de Alto-Falante no HD para Puxar os Pedaços', desc: 'Aproximar ímã de neodímio.', burnReason: 'O campo magnético desmagnetizou os pratos e apagou todas as partições do HD!' }
        ]
      }
    ]
  },
  // 20. bsod_analyzer (Análise forense BSOD dump)
  {
    minigameType: 'bsod_analyzer',
    requiredPart: 'software_toolkit',
    urgency: 'Diagnóstico',
    tagClass: 'tag-critica',
    variations: [
      {
        theme: 'Tela Azul da Morte em Loop por Driver Corrompido',
        quote: "\"Meu ${d} só dá Tela Azul! Aparece MEMORY_MANAGEMENT e IRQL_NOT_LESS_OR_EQUAL toda vez que entra no Windows e reinicia sozinho!\"",
        questions: [
          { q: '1. O problema começou após alguma atualização de driver?', a: '"Atualizei um driver de vídeo beta que peguei num fórum russo ontem à noite."' },
          { q: '2. Qual arquivo .sys ou código de parada é citado no minidump?', a: '"Apareceu nvlddmkm_buggy.sys escrito bem pequeno no rodapé da tela azul."' },
          { q: '3. Em Modo de Segurança o sistema consegue inicializar?', a: '"Sim! No Modo de Segurança básico ele liga sem a tela azul."' },
          { q: '4. Você fez teste nas memórias físicas com MemTest86?', a: '"Passei o MemTest por 2 horas e as memórias RAM passaram com zero erros."' }
        ],
        tools: [
          { name: '📋 1. Analisador Forense WinDbg de Minidump (MEMORY.DMP)', result: 'BugCheck 0x0000001A causado por violação de ponteiro no driver nvlddmkm_buggy.sys.' },
          { name: '🔍 2. Verificador de Assinatura WHQL', result: 'Driver de vídeo não possui certificado digital Microsoft e invade memória não paginável.' },
          { name: '💻 3. Teste de Kernel Paging', result: 'Falha de endereço de memória quando o driver tenta acessar buffer de textura corrompido.' }
        ],
        correct: { title: 'Isolar Driver Instável no Dump de Memória, Reverter para Versão Certificada WHQL e Limpar BCD', desc: 'Corrige a corrupção de ponteiros de memória e restabelece a inicialização estável do Windows.' },
        wrongs: [
          { title: 'Tentar Pintar a Tela Azul de Preto com Canetinha Hidrográfica', desc: 'Pintar o monitor.', burnReason: 'A canetinha manchou a película anti-reflexo do painel LCD sem resolver o travamento!' },
          { title: 'Ignorar a Tela Azul e Apertar o Reset 200 Vezes Seguidas em 1 Minuto', desc: 'Reinicializações violentas.', burnReason: 'Os desligamentos abruptos corromperam a tabela MFT do sistema de arquivos do SSD!' }
        ]
      }
    ]
  },
  // 21. dll_fixer (Reparo de DLLs ausentes no System32)
  {
    minigameType: 'dll_fixer',
    requiredPart: 'software_toolkit',
    urgency: 'Reparo Lógico',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Arquivos DLL Ausentes Impedindo Abertura de Programas e Jogos',
        quote: "\"Nenhum jogo abre no meu ${d}! Dá erro de msvcr120.dll e d3dx9_43.dll ausentes e diz para reinstalar o programa, mas nunca resolve!\"",
        questions: [
          { q: '1. Os pacotes redistribuíveis do Visual C++ e DirectX estão instalados?', a: '"Formatei a máquina ontem e não instalei nenhum pacote complementar."' },
          { q: '2. Você tentou baixar DLLs soltas de sites aleatórios da internet?', a: '"Baixei uma DLL solta e joguei na área de trabalho, mas continuou dando erro."' },
          { q: '3. Os binários foram devidamente registrados com regsvr32?', a: '"Não sei o que é regsvr32, só dei duplo clique no arquivo."' },
          { q: '4. O sistema operacional é 64 bits ou 32 bits?', a: '"É Windows 11 de 64 bits rodando aplicativos antigos de 32 bits."' }
        ],
        tools: [
          { name: '🔍 1. Dependency Walker / Dependencies Inspector', result: '3 bibliotecas dinâmicas essenciais faltando nas pastas System32 e SysWOW64.' },
          { name: '📑 2. Verificador de Arquivos do Sistema SFC /Scannow', result: 'Associações COM/OLE corrompidas no registro de componentes de runtime.' },
          { name: '📦 3. Auditor de Versões dos Pacotes Visual C++', result: 'Runtimes de 2010 a 2019 ausentes, impedindo a carga de dependências nativas.' }
        ],
        correct: { title: 'Instalar Pacotes Oficiais de Runtime e Registrar DLLs Ausentes com o Utilitário Regsvr32', desc: 'Restaura as bibliotecas compartilhadas essenciais e as chamadas de API do sistema operacional.' },
        wrongs: [
          { title: 'Renomear Arquivos de Fotos JPEG para o Nome das DLLs e Jogar no Windows', desc: 'Substituir DLL por foto.', burnReason: 'O Windows tentou carregar a imagem como código executável e travou o explorer.exe!' },
          { title: 'Desativar Todas as Mensagens de Erro do Sistema no Registro para Ignorar', desc: 'Silenciar mensagens de erro.', burnReason: 'Os programas passaram a fechar instantaneamente em silêncio sem abrir nada!' }
        ]
      }
    ]
  },
  // 22. bios_flashing (Gravação de BIOS sob tensão instável)
  {
    minigameType: 'bios_flashing',
    requiredPart: 'cmos_bios',
    urgency: 'Firmware Crítico',
    tagClass: 'tag-critica',
    variations: [
      {
        theme: 'Atualização Crítica de BIOS com Queda de Tensão na EEPROM',
        quote: "\"Preciso atualizar a BIOS do ${d} para reconhecer o novo processador de 14ª geração, mas a rede elétrica aqui oscila e tenho medo de brickar a placa!\"",
        questions: [
          { q: '1. A versão atual da BIOS suporta a CPU que você quer colocar?', a: '"Não suporta! Sem atualizar a tela fica preta e nem dá sinal de vida."' },
          { q: '2. A placa-mãe tem botão traseiro de BIOS Flashback de emergência?', a: '"Tem o botão e a porta USB dedicada para gravação direta."' },
          { q: '3. A tensão na tomada está oscilando entre 110V e 95V?', a: '"Moro no fim da linha e a luz pisca quando o vizinho liga o chuveiro."' },
          { q: '4. O arquivo de ROM (.CAP ou .BIN) é oficial do fabricante?', a: '"Baixei diretamente da página oficial de suporte da placa-mãe."' }
        ],
        tools: [
          { name: '⚡ 1. Monitor de Tensão do Gravador SPI', result: 'Tensão de gravação em 11.9V. Requer estabilização para não corromper os blocos flash.' },
          { name: '💾 2. Leitor de Checksum SHA-256 da Imagem ROM', result: 'Hash verificado e íntegro: 64 MB de microcódigo e AGESA atualizados.' },
          { name: '📊 3. Medidor de Progresso de Gravação de Setores', result: 'Blocos 0x00 a 0xFF prontos para escrita sequencial com verificação CRC.' }
        ],
        correct: { title: 'Estabilizar Tensão Acima de 11.8V com No-Break e Executar Gravação dos Blocos da EEPROM até 100%', desc: 'Garante a escrita perfeita de todos os setores do firmware sem risco de brick da placa-mãe.' },
        wrongs: [
          { title: 'Arrancar o PC da Tomada bem no Meio da Gravação aos 50% de Progresso', desc: 'Cortar energia durante flash.', burnReason: 'A EEPROM ficou corrompida pela metade e a placa-mãe virou um peso de papel inutilizável!' },
          { title: 'Esquentar o Chip da BIOS com Maçarico para Gravar os Dados Mais Rápido', desc: 'Queimar o chip com maçarico.', burnReason: 'O chip da BIOS explodiu com o calor extremo e carbonizou o circuito ao redor!' }
        ]
      }
    ]
  },
  // 23. malware_task (Gerenciador de tarefas minerador 100% CPU)
  {
    minigameType: 'malware_task',
    requiredPart: 'malware',
    urgency: 'Limpeza Lógica',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Minerador Oculto Monopolizando 100% da CPU em Segundo Plano',
        quote: "\"O cooler do meu ${d} parece uma turbina de avião 24 horas por dia! Abro o Gerenciador e o uso de CPU está cravado em 100% mesmo sem nada aberto!\"",
        questions: [
          { q: '1. Quais processos mostram maior consumo de recursos na tabela?', a: '"Tem um tal de svch0st_miner e um keylogger_spy32 consumindo quase 100% juntos."' },
          { q: '2. Quando você abre o navegador o computador quase congela?', a: '"Leva 2 minutos só para abrir uma nova guia porque a CPU está esganada."' },
          { q: '3. Você reconhece esses dois processos de alta utilização?', a: '"Nunca vi na vida! Não têm descrição e estão instalados na pasta AppData."' },
          { q: '4. O computador esquenta mesmo com o gabinete destampado?', a: '"Fica pelando de quente porque os núcleos estão todos em carga máxima."' }
        ],
        tools: [
          { name: '📊 1. Monitor de Recursos de CPU por Thread', result: 'Processo malicioso explorando instruções AVX2 para mineração de criptomoeda oculta.' },
          { name: '🔍 2. Auditoria de Caminho de Executável', result: 'Executáveis rodando a partir de pastas temporárias ocultas com persistência no registro.' },
          { name: '🛡️ 3. Análise Heurística de Memória', result: 'Tentativa de camuflagem usando o nome de serviços legítimos do Windows Explorer.' }
        ],
        correct: { title: 'Finalizar Processos de Mineração no Gerenciador de Tarefas, Apagar Binários e Desativar Inicialização', desc: 'Libera 100% dos ciclos de clock da CPU e reduz a temperatura operacional imediatamente.' },
        wrongs: [
          { title: 'Finalizar o Processo explorer.exe e o Kernel do Windows ao Mesmo Tempo', desc: 'Matar serviços vitais do sistema.', burnReason: 'A área de trabalho desapareceu, o sistema entrou em colapso e perdeu o controle!' },
          { title: 'Tentar Rodar Mais 5 Jogos Pesados para Afogar o Minerador no Cansaço', desc: 'Sobrecarga de software.', burnReason: 'A temperatura atingiu o limite crítico, o silício fritou e a máquina desligou com cheiro de queimado!' }
        ]
      }
    ]
  },
  // 24. boot_loop_fix (Reparo de Boot BCD/MBR)
  {
    minigameType: 'boot_loop_fix',
    requiredPart: 'software_toolkit',
    urgency: 'Reparo Lógico',
    tagClass: 'tag-urgente',
    variations: [
      {
        theme: 'Loop Infinito de Reparo Automático do Windows Após Queda de Energia',
        quote: "\"O ${d} não passa da tela preta! Dá Preparando Reparo Automático, tenta diagnosticar o PC, diz que não pôde reparar e reinicia de novo em loop!\"",
        questions: [
          { q: '1. O que aconteceu imediatamente antes de começar o loop?', a: '"O computador desligou na tomada enquanto estava atualizando o Windows."' },
          { q: '2. Você consegue acessar o Prompt de Comando no menu avançado?', a: '"Sim! Consigo abrir a janela preta do CMD nas opções de recuperação."' },
          { q: '3. A partição EFI de inicialização está com o arquivo BCD corrompido?', a: '"Diz que o arquivo BCD não contém uma instalação válida do sistema operacional."' },
          { q: '4. O disco rígido ou SSD está com os arquivos pessoais intactos?', a: '"Consigo ver minhas pastas e arquivos pelo comando dir C:, está tudo lá."' }
        ],
        tools: [
          { name: '💻 1. Diagnóstico do Registro de Boot (BCDedit)', result: 'Ponteiro {bootmgr} corrompido e partição de boot desconfigurada.' },
          { name: '🔍 2. Verificador de Setores de Partição (Bootrec /ScanOS)', result: '1 instalação de Windows detectada em C:\\Windows sem apontamento no BCD.' },
          { name: '📑 3. Análise da Tabela MBR/GPT', result: 'Tabela de partições intacta, requer apenas reconstrução da cadeia de inicialização.' }
        ],
        correct: { title: 'Executar Comandos bootrec /fixmbr, /fixboot e /rebuildbcd no Prompt para Reconstruir a Inicialização', desc: 'Recria o armazenamento de dados de configuração da inicialização (BCD) e resolve o loop de reparo.' },
        wrongs: [
          { title: 'Formatar o Disco Inteiro com o Comando format C: /y sem Backup', desc: 'Formatação destrutiva.', burnReason: 'Todos os arquivos, documentos e fotos do cliente foram apagados permanentemente!' },
          { title: 'Apertar a Tecla Enter Repetidamente com uma Furadeira', desc: 'Impacto mecânico na tecla.', burnReason: 'A broca quebrou o teclado, perfurou a placa-mãe por baixo e rompeu as trilhas!' }
        ]
      }
    ]
  },
  // 25. ddu_driver_sweep (Limpeza profunda DDU em Modo de Segurança)
  {
    minigameType: 'ddu_driver_sweep',
    requiredPart: 'software_toolkit',
    urgency: 'Limpeza Lógica',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Conflito de Drivers de Placa de Vídeo Antiga Causando Artefatos',
        quote: "\"Troquei de placa de vídeo no meu ${d}, mas os drivers antigos continuam brigando no registro! A tela pisca preta e congela em qualquer jogo!\"",
        questions: [
          { q: '1. Você desinstalou os drivers da placa antiga antes de colocar a nova?', a: '"Não! Só tirei uma da placa-mãe e espetei a outra achando que o Windows se virava."' },
          { q: '2. Havia drivers de fabricantes diferentes instalados juntos?', a: '"Tinha sobras de driver AMD misturadas com o driver da NVIDIA novo."' },
          { q: '3. O Windows Update tentou baixar um driver antigo por cima?', a: '"Toda vez que desinstalo, o Windows Update baixa um driver de 2021 sozinho."' },
          { q: '4. Você sabe inicializar no Modo de Segurança?', a: '"Sim, segurando Shift e clicando em Reiniciar."' }
        ],
        tools: [
          { name: '🔍 1. Varredura de Chaves Órfãs do Driver no Registro', result: 'Mais de 1.800 chaves de registro antigas e arquivos .dll residentes em System32/DriverStore.' },
          { name: '🖥️ 2. Inspetor de Camada de Vídeo DirectX/Vulkan', result: 'Conflito de chamadas de API entre bibliotecas de diferentes fabricantes de GPU.' },
          { name: '🛡️ 3. Status do Ambiente do Sistema Operacional', result: 'Necessário expurgo completo com DDU (Display Driver Uninstaller) sem conexão de rede.' }
        ],
        correct: { title: 'Reiniciar em Modo de Segurança, Limpar Arquivos de Driver Antigo com DDU e Purgar Registro', desc: 'Remove todas as sobras de drivers residuais e prepara o Windows para uma instalação limpa e sem conflitos.' },
        wrongs: [
          { title: 'Tentar Apagar a Pasta C:\\Windows\\System32 com o Mouse no Modo Normal', desc: 'Deleção de arquivos vitais.', burnReason: 'Apagar arquivos essenciais travou o Windows e inutilizou o sistema operacional!' },
          { title: 'Instalar Mais 4 Drivers Diferentes em Cima para Ver Qual Funciona', desc: 'Empilhar drivers incompatíveis.', burnReason: 'A mistura de drivers corrompeu o subsistema de vídeo e causou tela preta total!' }
        ]
      }
    ]
  },
  // 26. bloatware_remover (Desinstalador em massa de bloatware)
  {
    minigameType: 'bloatware_remover',
    requiredPart: 'software_toolkit',
    urgency: 'Limpeza Lógica',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'PC Novo de Fábrica Atolado com 30 Programas Inúteis de Fábrica',
        quote: "\"Comprei esse ${d} ontem na loja e já veio com 40 programas de propaganda instalados! Tem barra de busca, antivírus de teste vencido e assistente de compras chato!\"",
        questions: [
          { q: '1. Quantos programas iniciam junto com o Windows?', a: '"Tem mais de 35 ícones brilhando na bandeja do relógio ao mesmo tempo!"' },
          { q: '2. O antivírus de teste fica exibindo avisos para assinar a versão paga?', a: '"Aparece uma janela gigante no meio da tela a cada 5 minutos pedindo cartão de crédito."' },
          { q: '3. Tem aplicativo de previsão do tempo e cupons pesando na memória?', a: '"Consomem mais de 4GB de RAM só para mostrar anúncios que eu não quero ver."' },
          { q: '4. O computador tem desempenho muito abaixo do hardware que possui?', a: '"Tem processador potente, mas demora 2 minutos para abrir qualquer pasta."' }
        ],
        tools: [
          { name: '📑 1. Inventário de Softwares Instalados de Fábrica', result: '4 programas inúteis com alta carga de inicialização automática identificados.' },
          { name: '📊 2. Impacto no Tempo de Boot (Startup Impact)', result: 'Atraso de 45 segundos no carregamento da área de trabalho provocado por bloatwares.' },
          { name: '🛡️ 3. Análise de Serviços em Segundo Plano', result: 'Serviços zumbis enviando telemetria e exibindo banners promocionais indesejados.' }
        ],
        correct: { title: 'Desinstalar Barra Ask, Antivírus Demo Expirado, Assistente de Compras e Notícias em Massa', desc: 'Libera recursos vitais de processamento e reduz o consumo de memória RAM pela metade.' },
        wrongs: [
          { title: 'Clicar em Assinar Plano Premium de R$ 500 em Todos os Bloatwares', desc: 'Comprar os softwares inúteis.', burnReason: 'O cliente gastou uma fortuna em programas lixo que continuaram deixando o PC lento!' },
          { title: 'Apagar os Atalhos da Área de Trabalho Achando que Isso Desinstala', desc: 'Deletar apenas atalhos.', burnReason: 'Os programas continuaram rodando em segundo plano e drenando a memória do sistema!' }
        ]
      }
    ]
  },
  // 27. ransomware_decrypt (Decifrador de ransomware .locked RSA)
  {
    minigameType: 'ransomware_decrypt',
    requiredPart: 'software_toolkit',
    urgency: 'Segurança Máxima',
    tagClass: 'tag-critica',
    variations: [
      {
        theme: 'Arquivos Criptografados com Extensão .locked e Pedido de Resgate',
        quote: "\"Todos os meus documentos no ${d} viraram arquivos com final .locked! Tem um bloco de notas na área de trabalho pedindo 2 Bitcoins para devolver minhas fotos!\"",
        questions: [
          { q: '1. Quando os arquivos começaram a ficar bloqueados?', a: '"Ontem depois que abri um boleto falso que recebi por e-mail."' },
          { q: '2. O vírus ainda está em execução criptografando novas pastas?', a: '"Desconectei o cabo de rede imediatamente para não passar para o resto da casa."' },
          { q: '3. Você possui a chave de descriptografia de emergência ou backup?', a: '"Achei um arquivo de log com os 4 blocos hexadecimais da chave RSA na memória temporária!"' },
          { q: '4. Você tem intenção de pagar o resgate aos criminosos?', a: '"De jeito nenhum! Quero que o técnico use ferramentas forenses para quebrar a criptografia!"' }
        ],
        tools: [
          { name: '🔍 1. Analisador Criptográfico de Assinatura de Arquivo', result: 'Criptografia RSA-2048 com vetor de inicialização parcialmente recuperável da RAM.' },
          { name: '🔐 2. Extrator de Chave de Descriptografia em Dump de Memória', result: '4 blocos hexadecimais válidos identificados: 0x7A, 0x4F, 0xB2 e 0x9C.' },
          { name: '🛡️ 3. Módulo de Desinfecção Forense Anti-Ransomware', result: 'Ransomware isolado e impedido de se propagar para outras unidades de disco.' }
        ],
        correct: { title: 'Combinar os 4 Blocos da Chave Hexadecimal na Ordem Correta para Decifrar e Restaurar Arquivos', desc: 'Quebra o bloqueio dos arquivos criptografados e recupera 100% dos dados dos documentos do cliente.' },
        wrongs: [
          { title: 'Fazer um Pix de R$ 5.000 para o E-mail dos Hackers Criminosos', desc: 'Pagar o resgate.', burnReason: 'Os criminosos pegaram o dinheiro, não mandaram a chave e riram da cara do cliente!' },
          { title: 'Tentar Abrir os Arquivos .locked no Bloco de Notas e Salvar por Cima', desc: 'Salvar dados corrompidos.', burnReason: 'Sobrescrever os arquivos destruiu os cabeçalhos originais tornando a recuperação impossível!' }
        ]
      }
    ]
  },
  // 28. firewall_rules (Regras de firewall portas 4444 e 1337)
  {
    minigameType: 'firewall_rules',
    requiredPart: 'software_toolkit',
    urgency: 'Segurança',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Portas de Entrada Vulneráveis Abertas para Invasores na Rede',
        quote: "\"O roteador avisou que o ${d} está recebendo milhares de tentativas de ataque externo por portas suspeitas como a 4444 e a 1337!\"",
        questions: [
          { q: '1. O firewall do Windows estava completamente desativado?', a: '"Desativei para conseguir jogar um jogo online pirata e esqueci desligado."' },
          { q: '2. Quais portas estão recebendo maior volume de conexões estranhas?', a: '"A porta 4444 (Reverse Shell) e a porta 1337 (RAT Backdoor) estão abertas e expostas."' },
          { q: '3. A porta 443 de navegação segura (HTTPS) deve continuar aberta?', a: '"Sim! Sem a porta 443 não consigo navegar em nenhum site seguro."' },
          { q: '4. Existem regras de exceção suspeitas criadas no sistema?', a: '"Tem regras permitindo qualquer conexão de entrada sem nenhuma restrição."' }
        ],
        tools: [
          { name: '🌐 1. Scanner de Portas Nmap Interno', result: 'Portas 4444 (Metasploit) e 1337 (Backdoor) em estado LISTENING totalmente expostas à internet.' },
          { name: '🛡️ 2. Inspetor de Regras de Entrada do Windows Defender Firewall', result: 'Regras de entrada permissivas autorizando qualquer IP externo a conectar sem senha.' },
          { name: '📊 3. Analisador de Tráfego Wireshark', result: 'Pacotes SYN de sondagem de portas sendo recebidos a cada 200 milissegundos.' }
        ],
        correct: { title: 'Bloquear Portas Vulneráveis 4444 e 1337 no Firewall Mantendo Liberada Apenas a Porta Segura 443', desc: 'Fecha todas as brechas de intrusão externa e blinda a rede do computador contra invasores.' },
        wrongs: [
          { title: 'Abrir Todas as Portas de 1 a 65535 para Qualquer Computador da Terra', desc: 'Liberar todas as portas.', burnReason: 'O computador foi invadido por dezenas de botnets em menos de 2 minutos!' },
          { title: 'Desconectar o Fio do Mouse Achando que Isso Protege o Tráfego de Rede', desc: 'Desconectar mouse.', burnReason: 'Desconectar o mouse não teve efeito na rede e o usuário ficou sem controle da tela!' }
        ]
      }
    ]
  },
  // 29. temp_cleaner (Esvaziamento de %TEMP% e logs lixo)
  {
    minigameType: 'temp_cleaner',
    requiredPart: 'software_toolkit',
    urgency: 'Limpeza Lógica',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Disco C: Totalmente Cheio com 120GB de Arquivos Lixo e Logs Mortos',
        quote: "\"O disco do meu ${d} está com a barra vermelha dizendo que resta apenas 100 Megabytes livres! Não consigo nem salvar um trabalho da faculdade!\"",
        questions: [
          { q: '1. Há quanto tempo a pasta %TEMP% não é limpa?', a: '"Nunca limpei! Tem arquivos temporários gravados ali desde o primeiro dia de uso."' },
          { q: '2. A Lixeira do Windows está com dezenas de gigabytes acumulados?', a: '"Tem mais de 45GB de vídeos pesados que deletei mas nunca esvaziei da Lixeira."' },
          { q: '3. As atualizações antigas do Windows Update continuam ocupando espaço?', a: '"A pasta WinSxS e o cache de download de updates estão gigantescos."' },
          { q: '4. Existem arquivos de despejo de memória (Memory Dumps) antigos?', a: '"Tem vários arquivos de despejo de 15GB de telas azuis do ano passado."' }
        ],
        tools: [
          { name: '💾 1. Analisador de Uso de Disco TreeSize / WizTree', result: '124 GB ocupados exclusivamente por lixo temporário, relatórios mortos e cache corrompido.' },
          { name: '🧹 2. Inspetor de Componentes do Windows (Dism Component Cleanup)', result: 'Backups antigos de Service Packs ocupando 32GB de espaço não reclamado.' },
          { name: '⚡ 3. Status de Espaço Livre da Unidade C:', result: 'Apenas 108 MB livres. SSD com desempenho degradado por falta de blocos livres para TRIM.' }
        ],
        correct: { title: 'Purgar Pasta %TEMP%, Esvaziar Lixeira Ocupada, Limpar Cache do Windows Update e Apagar Dumps', desc: 'Recupera mais de 120GB de espaço livre imediato e restabelece a velocidade máxima do SSD.' },
        wrongs: [
          { title: 'Deletar a Pasta Arquivos de Programas e Windows para Liberar Espaço Rápido', desc: 'Apagar pastas de programas.', burnReason: 'Apagar a pasta de programas quebrou todo o funcionamento do sistema operacional!' },
          { title: 'Comprimir Todos os Arquivos com Senha sem Lembrar Qual Senha Colocou', desc: 'Comprimir e esquecer senha.', burnReason: 'Todos os arquivos ficaram bloqueados por senha perdida e ninguém conseguiu abrir!' }
        ]
      }
    ]
  },
  // 30. crypto_wallet_rescue (Reconstrução de seed mnemônica de carteira)
  {
    minigameType: 'crypto_wallet_rescue',
    requiredPart: 'software_toolkit',
    urgency: 'Resgate de Dados',
    tagClass: 'tag-alerta',
    variations: [
      {
        theme: 'Frase Seed de Carteira Cripto Perdida e Fora de Ordem',
        quote: "\"Esqueci a ordem das 4 palavras de recuperação da minha carteira de criptomoedas no ${d}! Se eu não acertar a sequência, minhas economias ficam trancadas para sempre!\"",
        questions: [
          { q: '1. Você anotou as palavras em algum pedaço de papel?', a: '"Anotei as 4 palavras num guardanapo, mas esqueci a numeração de cada uma!"' },
          { q: '2. As palavras são do padrão BIP-39 oficial em inglês?', a: '"Sim! São palavras oficiais: alpha, saturn, crypto e shield."' },
          { q: '3. A carteira possui backup de arquivo keystore ou chave pública?', a: '"Tenho a chave pública e o hash mnemônico para conferir a ordem exata."' },
          { q: '4. Você já tentou adivinhar muitas vezes seguidas?', a: '"Tentei uma vez e parei para não bloquear o tempo de tentativa."' }
        ],
        tools: [
          { name: '🔐 1. Verificador Mnemônico Padrão BIP-39', result: '4 palavras identificadas no dicionário criptográfico padrão com checksum de derivação.' },
          { name: '📋 2. Analisador de Entropia de Hash SHA-256', result: 'Assinatura matemática da carteira corresponde à sequência lógica de 4 elementos.' },
          { name: '🛡️ 3. Ambiente Seguro Offline de Recuperação', result: 'Execução em máquina isolada sem conexão de rede para evitar vazamento da chave privada.' }
        ],
        correct: { title: 'Ordenar as 4 Palavras Mnemônicas na Sequência Criptográfica Correta para Restaurar a Chave Privada', desc: 'Gera a derivação da chave privada correta e restabelece o acesso total aos ativos da carteira.' },
        wrongs: [
          { title: 'Digitar as Palavras Num Chat Público do Discord para Estranhos Ajudarem', desc: 'Vazar palavras na internet.', burnReason: 'Um bot raspou a frase na hora e roubou todos os fundos da carteira do cliente!' },
          { title: 'Tentar Adivinhar a Senha Digitando com os Olhos Fechados', desc: 'Tentativas cegas no escuro.', burnReason: 'O aplicativo da carteira bloqueou o acesso temporariamente após tentativas incorretas!' }
        ]
      }
    ]
  }
];

const ALL_30_THEMES = [...HARDWARE_THEMES, ...SOFTWARE_THEMES];
console.log("Hardware themes count:", HARDWARE_THEMES.length);
console.log("Software themes count:", SOFTWARE_THEMES.length);
console.log("Total themes:", ALL_30_THEMES.length);

fs.writeFileSync('scratch/all_30_themes.json', JSON.stringify(ALL_30_THEMES, null, 2));
console.log("Saved all_30_themes.json successfully!");
