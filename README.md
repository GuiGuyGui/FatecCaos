# 🧟‍♂️ FatecCaos - Jogo Cooperativo de Sobrevivência Zumbi

> **Web Service Multiplayer em Tempo Real para até 7 Jogadores Simultâneos**

O **FatecCaos** é um jogo de tiro 2D estilo arcade/sobrevivência zumbi construído em Godot 4.3+, empacotado como um Web Service Node.js com WebSockets de baixa latência e preparado para deploy direto no **Render** e publicação no **GitHub**.

---

## 🎮 Funcionalidades Principais

- **Co-op Multiplayer em Rede:** Suporte para até **7 jogadores simultâneos** em sala cooperativa.
- **Mecânica de Equipe & Reanimação:** Quando um jogador é derrubado por zumbis, ele entra no estado caído e os colegas podem reanimá-lo com `[E] Ajudar`.
- **Hordas Progressivas & Escalonamento por Jogador:** O número de zumbis se adapta automaticamente à quantidade de jogadores conectados (15 zumbis por player na Onda 1, aumentando progressivamente a cada rodada).
- **IA Tática dos Zumbis:** Os zumbis caçam primeiro os jogadores isolados, quebram barricadas e portas de segurança, e escalam em vida e velocidade.
- **Sistema de 3 Slots de Armas & Terminais:**
  - Comece com a pistola e compre até 3 armas diferentes nas paredes ou na Caixa Misteriosa.
  - **3 Terminais de Munição** espalhados pelo mapa para reabastecer 100% das armas e arremessáveis por $ 400.
  - **Terminal Bélico Especial** com minigame de decodificação de 20 setas para armas pesadas/lendárias.
  - **Máquina de Aprimoramento (Upgrade Machine):** +60% dano, +50% pente/reserva e tiro acelerado.

---

## 📁 Estrutura do Projeto `FatecCaos`

```text
FatecCaos/
├── public/                 # Build WebAssembly / HTML5 pronta do Godot 4
│   ├── index.html
│   ├── index.js
│   ├── index.wasm
│   ├── index.pck
│   └── coi-serviceworker.js
├── src/                    # Código-fonte completo do projeto Godot
├── server.js               # Servidor Node.js Express + WebSocket Relay
├── package.json            # Configuração e dependências do Node.js
├── render.yaml             # Blueprint de deploy em 1 clique no Render
├── Dockerfile              # Imagem de container Docker de produção
└── README.md               # Manual de instruções e deploy
```

---

## 🚀 Como Subir no GitHub

1. Abra o terminal (PowerShell ou Bash) dentro da pasta `FatecCaos`:
   ```bash
   cd "C:\Users\Guilherme\Desktop\FatecCaos"
   ```

2. Inicialize o repositório Git e faça o commit inicial:
   ```bash
   git init
   git add .
   git commit -m "feat: FatecCaos v1.4.0 - Co-op 7 players and Render Web Service"
   ```

3. Crie um novo repositório no seu GitHub (ex: `https://github.com/SEU_USUARIO/FatecCaos.git`).

4. Conecte o repositório remoto e envie os arquivos:
   ```bash
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/FatecCaos.git
   git push -u origin main
   ```

---

## 🌐 Como Fazer o Deploy no Render

### Método 1: Deploy Automático (Web Service Node.js) - **Recomendado**

1. Acesse o painel do [Render Dashboard](https://dashboard.render.com/).
2. Clique em **New +** e selecione **Web Service**.
3. Conecte a sua conta do GitHub e escolha o repositório **FatecCaos**.
4. O Render detectará automaticamente as configurações:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
5. Clique em **Deploy Web Service**!
6. Em cerca de 1 a 2 minutos o Render gerará sua URL pública (ex: `https://fateccaos.onrender.com`).

---

### Método 2: Deploy com Docker

1. No Render, escolha **New +** -> **Web Service**.
2. Selecione o repositório **FatecCaos**.
3. O Render identificará o arquivo `Dockerfile` na raiz e construirá a imagem do container automaticamente.
4. Clique em **Create Web Service**.

---

## 🕹️ Como Jogar com os Amigos

1. Compartilhe o link do Render gerado (ex: `https://fateccaos.onrender.com`) com até 7 pessoas.
2. O **Jogador 1** clica em **CRIAR SALA (HOST)**.
3. Os outros jogadores (Jogadores 2 a 7) clicam em **ENTRAR** e digitam o código da sala ou entram diretamente.
4. O Host clica em **INICIAR PARTIDA** e todos jogam juntos em tempo real!

---

## 💻 Teste Local no Computador

Para testar o servidor localmente antes de enviar para o Render:

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor
npm start
```

Abra seu navegador em [http://localhost:10000](http://localhost:10000).
