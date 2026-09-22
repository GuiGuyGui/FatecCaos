import fs from 'fs';
import path from 'path';

const DOCS_DIR = 'C:/Users/Guilherme/Desktop/FatecCaos/docs';
const PUBLIC_DIR = 'C:/Users/Guilherme/Desktop/FatecCaos/public';

const COMMON_HEAD = `
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="icon" type="image/png" href="index.icon.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">
	<script src="coi-serviceworker.js"></script>
	<style>
		:root {
			--bg-base: #0a0a0f;
			--bg-surface: #12121a;
			--bg-card: #181824;
			--bg-card-hover: #222233;
			--border-color: rgba(255, 255, 255, 0.15);
			--border-bright: rgba(255, 255, 255, 0.35);
			--accent-primary: #00f0ff;
			--accent-danger: #ff0055;
			--accent-purple: #9d4edd;
			--accent-emerald: #00ff88;
			--accent-gold: #ffd60a;
			--text-white: #ffffff;
			--font-title: 'Orbitron', sans-serif;
			--font-sub: 'Rajdhani', sans-serif;
			--font-body: 'Inter', sans-serif;
			--font-code: 'Fira Code', monospace;
		}

		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			font-family: var(--font-body);
			color: #ffffff !important;
		}

		body {
			background-color: var(--bg-base);
			background-image: 
				radial-gradient(circle at 15% 15%, rgba(0, 240, 255, 0.08) 0%, transparent 40%),
				radial-gradient(circle at 85% 85%, rgba(157, 78, 221, 0.08) 0%, transparent 40%),
				linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
			background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
			min-height: 100vh;
			display: flex;
			flex-direction: column;
			overflow-x: hidden;
		}

		h1, h2, h3, h4, h5, h6 {
			font-family: var(--font-title);
			font-weight: 700;
			color: #ffffff !important;
			letter-spacing: 0.5px;
		}

		p, span, div, a, button, input, textarea, select, li, td, th, b, strong, label {
			color: #ffffff !important;
		}

		a {
			text-decoration: none;
			transition: all 0.25s ease;
		}

		#navbar {
			position: sticky;
			top: 0;
			z-index: 1000;
			background: rgba(10, 10, 15, 0.92);
			backdrop-filter: blur(14px);
			-webkit-backdrop-filter: blur(14px);
			border-bottom: 1px solid var(--border-color);
			padding: 12px 28px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6);
		}

		.nav-brand {
			display: flex;
			align-items: center;
			gap: 12px;
		}

		.nav-logo {
			height: 44px;
			width: auto;
			object-fit: contain;
			filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4));
			transition: transform 0.3s ease;
		}

		.nav-logo:hover {
			transform: scale(1.05);
		}

		.nav-links {
			display: flex;
			align-items: center;
			gap: 8px;
			list-style: none;
		}

		.nav-link {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 8px 16px;
			border-radius: 8px;
			font-size: 14px;
			font-weight: 600;
			letter-spacing: 0.3px;
			color: #ffffff !important;
			background: transparent;
			border: 1px solid transparent;
			transition: all 0.2s ease;
		}

		.nav-link:hover {
			background: rgba(255, 255, 255, 0.08);
			border-color: rgba(255, 255, 255, 0.2);
			transform: translateY(-1px);
		}

		.nav-link.active {
			background: linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%);
			border-color: var(--accent-primary);
			box-shadow: 0 0 12px rgba(0, 240, 255, 0.25);
		}

		.nav-user-panel {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.nav-auth-btn {
			background: rgba(255, 255, 255, 0.05);
			border: 1px solid var(--border-color);
			padding: 7px 14px;
			border-radius: 8px;
			font-size: 13px;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.2s ease;
		}

		.nav-auth-btn:hover {
			background: rgba(255, 255, 255, 0.12);
			border-color: #ffffff;
		}

		.user-pill-btn {
			display: flex;
			align-items: center;
			gap: 8px;
			background: var(--bg-card);
			border: 1px solid var(--border-bright);
			padding: 6px 12px;
			border-radius: 20px;
			cursor: pointer;
			transition: all 0.2s ease;
		}

		.user-pill-btn:hover {
			border-color: var(--accent-primary);
			box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
		}

		.user-level-badge {
			background: var(--accent-purple);
			padding: 2px 8px;
			border-radius: 12px;
			font-size: 11px;
			font-weight: 800;
		}

		.btn-primary {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			background: linear-gradient(135deg, #00f0ff 0%, #0088ff 100%);
			color: #05050a !important;
			font-family: var(--font-title);
			font-weight: 800;
			font-size: 14px;
			padding: 12px 24px;
			border-radius: 8px;
			border: none;
			cursor: pointer;
			box-shadow: 0 4px 15px rgba(0, 240, 255, 0.4);
			transition: all 0.25s ease;
			text-transform: uppercase;
		}

		.btn-primary * {
			color: #05050a !important;
		}

		.btn-primary:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 22px rgba(0, 240, 255, 0.65);
			filter: brightness(1.1);
		}

		.btn-secondary {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			background: rgba(255, 255, 255, 0.08);
			border: 1px solid var(--border-bright);
			font-family: var(--font-title);
			font-weight: 700;
			font-size: 13px;
			padding: 10px 20px;
			border-radius: 8px;
			cursor: pointer;
			transition: all 0.2s ease;
		}

		.btn-secondary:hover {
			background: rgba(255, 255, 255, 0.16);
			border-color: #ffffff;
			transform: translateY(-2px);
		}

		.container {
			max-width: 1280px;
			margin: 0 auto;
			padding: 30px 20px;
			width: 100%;
			flex: 1;
		}

		.card {
			background: var(--bg-card);
			border: 1px solid var(--border-color);
			border-radius: 14px;
			padding: 24px;
			box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
			transition: all 0.25s ease;
		}

		.card:hover {
			border-color: var(--border-bright);
			transform: translateY(-2px);
		}

		.badge {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			padding: 4px 10px;
			border-radius: 6px;
			font-size: 12px;
			font-weight: 700;
			background: rgba(255, 255, 255, 0.08);
			border: 1px solid rgba(255, 255, 255, 0.15);
		}

		.input-field {
			width: 100%;
			background: rgba(0, 0, 0, 0.4);
			border: 1px solid var(--border-color);
			border-radius: 8px;
			padding: 10px 14px;
			font-size: 14px;
			color: #ffffff !important;
			outline: none;
			margin-top: 6px;
			margin-bottom: 14px;
			transition: border-color 0.2s;
		}

		.input-field:focus {
			border-color: var(--accent-primary);
			box-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
		}

		.modal-backdrop {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.85);
			backdrop-filter: blur(10px);
			z-index: 2000;
			display: none;
			align-items: center;
			justify-content: center;
			padding: 20px;
		}

		.modal-box {
			background: var(--bg-surface);
			border: 1px solid var(--border-bright);
			border-radius: 16px;
			padding: 30px;
			max-width: 500px;
			width: 100%;
			position: relative;
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.2);
		}

		.modal-close-btn {
			position: absolute;
			top: 18px;
			right: 18px;
			background: rgba(255, 255, 255, 0.1);
			border: none;
			width: 32px;
			height: 32px;
			border-radius: 50%;
			cursor: pointer;
			font-size: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.avatar-picker-row {
			display: flex;
			gap: 8px;
			margin: 10px 0 16px 0;
			flex-wrap: wrap;
		}

		.avatar-choice {
			font-size: 26px;
			padding: 6px;
			border-radius: 10px;
			border: 2px solid transparent;
			cursor: pointer;
			transition: all 0.2s;
			background: rgba(255, 255, 255, 0.05);
		}

		.avatar-choice:hover, .avatar-choice.selected {
			border-color: var(--accent-primary);
			background: rgba(0, 240, 255, 0.2);
			transform: scale(1.1);
		}

		footer {
			background: #07070a;
			border-top: 1px solid var(--border-color);
			padding: 30px 20px;
			text-align: center;
			margin-top: auto;
		}

		.footer-links {
			display: flex;
			justify-content: center;
			gap: 20px;
			margin-bottom: 14px;
			flex-wrap: wrap;
		}

		.footer-links a {
			font-size: 13px;
			color: #ffffff !important;
			opacity: 0.8;
		}

		.footer-links a:hover {
			opacity: 1;
			color: var(--accent-primary) !important;
		}

		@media (max-width: 900px) {
			#navbar {
				flex-wrap: wrap;
				gap: 12px;
				padding: 12px 16px;
			}
			.nav-links {
				order: 3;
				width: 100%;
				overflow-x: auto;
				padding-bottom: 4px;
			}
		}
	</style>
`;

function getNavbar(activeTab) {
	return `
		<nav id="navbar">
			<a href="index.html" class="nav-brand">
				<img src="logo_omnivoid.png" alt="OmniVoid Studios" class="nav-logo">
			</a>

			<ul class="nav-links">
				<li><a href="index.html" class="nav-link ${activeTab === 'inicio' ? 'active' : ''}">Início</a></li>
				<li><a href="zombiessurvive.html" class="nav-link ${activeTab === 'zombies' ? 'active' : ''}">🧟‍♂️ Zombies Survive</a></li>
				<li><a href="skyrush.html" class="nav-link ${activeTab === 'skyrush' ? 'active' : ''}">☁️ SkyRush</a></li>
				<li><a href="quiz.html" class="nav-link ${activeTab === 'quiz' ? 'active' : ''}">🧠 Teste de Programação</a></li>
				<li><a href="projetos.html" class="nav-link ${activeTab === 'projetos' ? 'active' : ''}">🚀 Projetos</a></li>
				<li><a href="devchat.html" class="nav-link ${activeTab === 'devchat' ? 'active' : ''}">💬 Conversa Dev</a></li>
			</ul>

			<div class="nav-user-panel">
				<div id="auth-logged-out" style="display: flex; align-items: center; gap: 8px;">
					<button class="nav-auth-btn" onclick="openAuthModal('login')">
						<span>👤 Entrar</span>
					</button>
					<button class="btn-primary" style="padding: 7px 15px; font-size: 13px;" onclick="openAuthModal('register')">
						Cadastrar
					</button>
				</div>

				<div id="auth-logged-in" style="display: none; align-items: center; gap: 8px;">
					<button class="user-pill-btn" onclick="openProfileModal()">
						<span id="nav-user-avatar">🧑‍🚀</span>
						<span id="nav-user-name">Jogador</span>
						<span class="user-level-badge" id="nav-user-level">Nvl 1</span>
					</button>
				</div>
			</div>
		</nav>
	`;
}

const COMMON_AUTH_MODALS = `
		<div id="modal-auth" class="modal-backdrop" onclick="closeModalOnBackdrop(event, 'modal-auth')">
			<div class="modal-box">
				<button class="modal-close-btn" onclick="closeModal('modal-auth')">✕</button>
				
				<div id="auth-tab-row" style="display: flex; gap: 12px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 10px;">
					<button id="tab-btn-login" class="nav-link active" onclick="switchAuthTab('login')">Entrar na Conta</button>
					<button id="tab-btn-register" class="nav-link" onclick="switchAuthTab('register')">Novo Cadastro</button>
				</div>

				<form id="form-login" onsubmit="handleLoginSubmit(event)">
					<h3 style="font-size: 18px; margin-bottom: 12px;">Entrar no Portal OmniVoid</h3>
					<p style="font-size: 13px; margin-bottom: 16px; opacity: 0.85;">Acesse seu perfil para salvar recordes, missões e participar da Conversa Dev.</p>

					<label style="font-size: 12px; font-weight: 600;">E-mail ou Nickname:</label>
					<input type="text" id="login-identifier" class="input-field" placeholder="ex: dev@omnivoid.com ou Sniper_99" required>

					<label style="font-size: 12px; font-weight: 600;">Senha:</label>
					<input type="password" id="login-password" class="input-field" placeholder="Sua senha de acesso" required>

					<button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 10px;">
						🚀 Entrar no Universo OmniVoid
					</button>
				</form>

				<form id="form-register" style="display: none;" onsubmit="handleRegisterSubmit(event)">
					<h3 style="font-size: 18px; margin-bottom: 12px;">Criar Conta de Sobrevivente & Dev</h3>
					<p style="font-size: 13px; margin-bottom: 16px; opacity: 0.85;">Registre seu perfil único para sincronizar progresso no Zombies Survive, SkyRush e Fórum.</p>

					<label style="font-size: 12px; font-weight: 600;">Nome Completo:</label>
					<input type="text" id="reg-name" class="input-field" placeholder="ex: Guilherme Silva" required>

					<label style="font-size: 12px; font-weight: 600;">Nickname no Jogo / Fórum:</label>
					<input type="text" id="reg-nickname" class="input-field" placeholder="ex: VoidSniper_99" required>

					<label style="font-size: 12px; font-weight: 600;">Instituição / Turma ou Curso:</label>
					<input type="text" id="reg-turma" class="input-field" placeholder="ex: ADS - 4º Semestre / Ciência da Computação" required>

					<label style="font-size: 12px; font-weight: 600;">E-mail:</label>
					<input type="email" id="reg-email" class="input-field" placeholder="ex: dev@omnivoid.com.br" required>

					<label style="font-size: 12px; font-weight: 600;">Escolha seu Avatar:</label>
					<div class="avatar-picker-row">
						<span class="avatar-choice selected" onclick="selectAvatar('🧑‍🚀', this)">🧑‍🚀</span>
						<span class="avatar-choice" onclick="selectAvatar('🥷', this)">🥷</span>
						<span class="avatar-choice" onclick="selectAvatar('🧙‍♂️', this)">🧙‍♂️</span>
						<span class="avatar-choice" onclick="selectAvatar('🤖', this)">🤖</span>
						<span class="avatar-choice" onclick="selectAvatar('🧟', this)">🧟</span>
						<span class="avatar-choice" onclick="selectAvatar('👾', this)">👾</span>
						<span class="avatar-choice" onclick="selectAvatar('🕵️', this)">🕵️</span>
					</div>

					<label style="font-size: 12px; font-weight: 600;">Senha:</label>
					<input type="password" id="reg-password" class="input-field" placeholder="Mínimo 4 caracteres" required minlength="4">

					<button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 10px;">
						✨ Criar Minha Conta & Salvar Progresso
					</button>
				</form>
			</div>
		</div>

		<div id="modal-profile" class="modal-backdrop" onclick="closeModalOnBackdrop(event, 'modal-profile')">
			<div class="modal-box" style="max-width: 680px;">
				<button class="modal-close-btn" onclick="closeModal('modal-profile')">✕</button>

				<div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 16px; margin-bottom: 20px;">
					<div style="display: flex; align-items: center; gap: 14px;">
						<div style="font-size: 44px; width: 64px; height: 64px; background: rgba(255,255,255,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--accent-primary);" id="modal-profile-avatar">🧑‍🚀</div>
						<div>
							<h2 id="modal-profile-name" style="font-size: 22px; font-weight: 800;">Jogador</h2>
							<p id="modal-profile-sub" style="font-size: 13px; opacity: 0.85;">Aluno</p>
						</div>
					</div>
					<button class="btn-secondary" onclick="handleLogout()" style="padding: 6px 14px; font-size: 12px;">
						🚪 Sair
					</button>
				</div>

				<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 24px;">
					<div style="background: #121217; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; text-align: center;">
						<div id="prof-stat-level" style="font-size: 22px; font-weight: 800;">Nvl 1</div>
						<div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">Nível</div>
					</div>
					<div style="background: #121217; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; text-align: center;">
						<div id="prof-stat-cash" style="font-size: 22px; font-weight: 800;">$0</div>
						<div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">Moedas</div>
					</div>
					<div style="background: #121217; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; text-align: center;">
						<div id="prof-stat-wave" style="font-size: 22px; font-weight: 800;">Onda 0</div>
						<div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">Zombies Survive</div>
					</div>
					<div style="background: #121217; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; text-align: center;">
						<div id="prof-stat-kills" style="font-size: 22px; font-weight: 800;">0</div>
						<div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">Eliminações</div>
					</div>
				</div>
			</div>
		</div>
`;

const COMMON_AUTH_JS = `
<script>
let selectedAvatarIcon = '🧑‍🚀';
function selectAvatar(emoji, el) {
	selectedAvatarIcon = emoji;
	document.querySelectorAll('.avatar-choice').forEach(e => e.classList.remove('selected'));
	el.classList.add('selected');
}
function getUsersDB() {
	try {
		return JSON.parse(localStorage.getItem("omnivoid_users_db") || "[]");
	} catch (e) {
		return [];
	}
}
function saveUsersDB(users) {
	localStorage.setItem("omnivoid_users_db", JSON.stringify(users));
}
function getCurrentUser() {
	try {
		return JSON.parse(localStorage.getItem("omnivoid_current_user") || "null");
	} catch (e) {
		return null;
	}
}
function setCurrentUser(user) {
	if (user) {
		localStorage.setItem("omnivoid_current_user", JSON.stringify(user));
	} else {
		localStorage.removeItem("omnivoid_current_user");
	}
	updateUIAfterAuth();
}
let currentUser = getCurrentUser();
function updateUIAfterAuth() {
	currentUser = getCurrentUser();
	const loggedOutDiv = document.getElementById("auth-logged-out");
	const loggedInDiv = document.getElementById("auth-logged-in");
	if (!loggedOutDiv || !loggedInDiv) return;
	if (currentUser) {
		loggedOutDiv.style.display = "none";
		loggedInDiv.style.display = "flex";
		document.getElementById("nav-user-avatar").innerText = currentUser.avatar || "🧑‍🚀";
		document.getElementById("nav-user-name").innerText = currentUser.nickname || currentUser.name || "Jogador";
		document.getElementById("nav-user-level").innerText = \`Nvl \${currentUser.level || 1}\`;
	} else {
		loggedOutDiv.style.display = "flex";
		loggedInDiv.style.display = "none";
	}
}
function openAuthModal(tab) {
	document.getElementById("modal-auth").style.display = "flex";
	switchAuthTab(tab);
}
function switchAuthTab(tab) {
	const loginForm = document.getElementById("form-login");
	const regForm = document.getElementById("form-register");
	const loginBtn = document.getElementById("tab-btn-login");
	const regBtn = document.getElementById("tab-btn-register");
	if (tab === 'login') {
		loginForm.style.display = "block";
		regForm.style.display = "none";
		loginBtn.classList.add("active");
		regBtn.classList.remove("active");
	} else {
		loginForm.style.display = "none";
		regForm.style.display = "block";
		loginBtn.classList.remove("active");
		regBtn.classList.add("active");
	}
}
function handleLoginSubmit(e) {
	e.preventDefault();
	const identifier = document.getElementById("login-identifier").value.trim();
	const pass = document.getElementById("login-password").value;
	const users = getUsersDB();
	const user = users.find(u => (u.email === identifier || u.nickname === identifier) && u.password === pass);
	if (!user) {
		alert("E-mail/Nickname ou senha incorretos.");
		return;
	}
	setCurrentUser(user);
	closeModal('modal-auth');
	alert(\`Bem-vindo de volta, \${user.nickname}!\`);
}
function handleRegisterSubmit(e) {
	e.preventDefault();
	const name = document.getElementById("reg-name").value.trim();
	const nickname = document.getElementById("reg-nickname").value.trim();
	const turma = document.getElementById("reg-turma").value.trim();
	const email = document.getElementById("reg-email").value.trim().toLowerCase();
	const password = document.getElementById("reg-password").value;
	const users = getUsersDB();
	if (users.some(u => u.email === email)) {
		alert("Este e-mail já está cadastrado.");
		return;
	}
	if (users.some(u => u.nickname.toLowerCase() === nickname.toLowerCase())) {
		alert("Este nickname já está em uso.");
		return;
	}
	const user = {
		id: 'u_' + Date.now(),
		name,
		nickname,
		turma,
		email,
		password,
		avatar: selectedAvatarIcon,
		level: 1,
		xp: 0,
		cash: 1000,
		maxWave: 1,
		kills: 0,
		completedChallenges: [],
		createdAt: new Date().toISOString()
	};
	users.push(user);
	saveUsersDB(users);
	setCurrentUser(user);
	closeModal('modal-auth');
	alert(\`Conta criada com sucesso! Olá, \${user.nickname}!\`);
}
function handleLogout() {
	if (confirm("Deseja sair da sua conta?")) {
		setCurrentUser(null);
		closeModal('modal-profile');
	}
}
function openProfileModal() {
	if (!currentUser) {
		openAuthModal('login');
		return;
	}
	document.getElementById("modal-profile-avatar").innerText = currentUser.avatar || "🧑‍🚀";
	document.getElementById("modal-profile-name").innerText = currentUser.nickname || currentUser.name;
	document.getElementById("modal-profile-sub").innerText = \`\${currentUser.name} • \${currentUser.turma || 'Aluno'}\`;
	document.getElementById("prof-stat-level").innerText = \`Nvl \${currentUser.level || 1}\`;
	document.getElementById("prof-stat-cash").innerText = \`$\${(currentUser.cash || 0).toLocaleString()}\`;
	document.getElementById("prof-stat-wave").innerText = \`Onda \${currentUser.maxWave || 0}\`;
	document.getElementById("prof-stat-kills").innerText = (currentUser.kills || 0).toLocaleString();
	document.getElementById("modal-profile").style.display = "flex";
}
function closeModal(id) {
	document.getElementById(id).style.display = "none";
}
function closeModalOnBackdrop(e, id) {
	if (e.target.id === id) closeModal(id);
}
document.addEventListener("DOMContentLoaded", () => {
	updateUIAfterAuth();
});
</script>
`;

const COMMON_FOOTER = `
		<footer>
			<div class="container">
				<div class="footer-links">
					<a href="index.html">Início</a>
					<a href="zombiessurvive.html">Zombies Survive</a>
					<a href="skyrush.html">SkyRush</a>
					<a href="quiz.html">Teste de Programação</a>
					<a href="projetos.html">Projetos</a>
					<a href="devchat.html">Conversa Dev</a>
				</div>
				<p style="opacity: 0.85;">&copy; 2026 OmniVoid Studios. Todos os direitos reservados. Desenvolvido com paixão por desafios tecnológicos e games.</p>
			</div>
		</footer>
`;

// PAGE 1: INDEX
const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>OmniVoid Studios | Inovação, Engenharia de Software & GameDev</title>
	${COMMON_HEAD}
</head>
<body>
	${getNavbar('inicio')}

	<main class="container">
		<section style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: center; margin: 40px 0 60px 0;">
			<div>
				<div class="badge" style="background: rgba(0, 240, 255, 0.15); border-color: var(--accent-primary); margin-bottom: 16px;">
					⚡ Desenvolvedor Full-Stack & Game Engineer
				</div>
				<h1 style="font-size: 42px; line-height: 1.15; margin-bottom: 20px;">
					Criando Experiências Digitais e Desafios de Alta Performance
				</h1>
				<p style="font-size: 17px; line-height: 1.6; margin-bottom: 28px; opacity: 0.9;">
					Olá! Sou um desenvolvedor apaixonado por arquitetar sistemas complexos, resolver desafios de engenharia e criar jogos imersivos em Godot, WebGL, Node.js e C++. Bem-vindo ao portal da OmniVoid Studios.
				</p>
				<div style="display: flex; gap: 16px; flex-wrap: wrap;">
					<a href="zombiessurvive.html" class="btn-primary">
						🧟‍♂️ Jogar Zombies Survive
					</a>
					<a href="quiz.html" class="btn-secondary" style="border-color: var(--accent-purple);">
						🧠 Fazer Teste de Programação
					</a>
					<a href="projetos.html" class="btn-secondary">
						🚀 Ver Meus Projetos
					</a>
				</div>
			</div>

			<div style="text-align: center; position: relative;">
				<div style="background: radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%); position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 0;"></div>
				<img src="logo_omnivoid.png" alt="OmniVoid Studios" style="max-width: 320px; width: 100%; position: relative; z-index: 1; filter: drop-shadow(0 0 25px rgba(0,240,255,0.5));">
			</div>
		</section>

		<section style="margin-bottom: 60px;">
			<div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
				<div>
					<h2 style="font-size: 26px;">🎮 Jogos em Destaque</h2>
					<p style="font-size: 14px; opacity: 0.8;">Produzidos com engines modernas e arquitetura web escalável</p>
				</div>
			</div>

			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
				<div class="card" style="border-top: 4px solid var(--accent-danger);">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(255,0,85,0.2); border-color: var(--accent-danger);">🩸 Godot 4.3 Engine</span>
						<span class="badge">Survival Co-op / Solo</span>
					</div>
					<h3 style="font-size: 22px; margin-bottom: 10px;">Zombies Survive</h3>
					<p style="font-size: 14px; line-height: 1.5; margin-bottom: 20px; opacity: 0.85;">
						Sobreviva a hordas implacáveis no complexo polivalente de 10 andares. Compre armas, desbloqueie portas secretas, faça upgrades e enfrente chefes mutantes.
					</p>
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<a href="zombiessurvive.html" class="btn-primary" style="background: linear-gradient(135deg, #ff0055 0%, #c90044 100%);">
							Jogar Agora ➔
						</a>
						<span style="font-size: 12px; opacity: 0.7;">WebAssembly + WebGL</span>
					</div>
				</div>

				<div class="card" style="border-top: 4px solid var(--accent-primary);">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(0,240,255,0.2); border-color: var(--accent-primary);">☁️ HTML5 Canvas</span>
						<span class="badge">Arcade Multiplayer</span>
					</div>
					<h3 style="font-size: 22px; margin-bottom: 10px;">SkyRush</h3>
					<p style="font-size: 14px; line-height: 1.5; margin-bottom: 20px; opacity: 0.85;">
						Dispute altitudes extremas em um arcade supersônico. Colete orbs de energia, execute manobras aéreas e domine o Hall da Fama global.
					</p>
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<a href="skyrush.html" class="btn-primary">
							Decolar ➔
						</a>
						<span style="font-size: 12px; opacity: 0.7;">Solo Offline & Multiplayer</span>
					</div>
				</div>

				<div class="card" style="border-top: 4px solid var(--accent-purple);">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(157,78,221,0.2); border-color: var(--accent-purple);">🧠 Vocacional Tech</span>
						<span class="badge">12 Linguagens</span>
					</div>
					<h3 style="font-size: 22px; margin-bottom: 10px;">Teste de Programação</h3>
					<p style="font-size: 14px; line-height: 1.5; margin-bottom: 20px; opacity: 0.85;">
						Descubra qual linguagem de programação combina com seu estilo (Games, IA, Web, Mobile, Baixo Nível) e explore curiosidades épicas de cada uma.
					</p>
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<a href="quiz.html" class="btn-secondary" style="border-color: var(--accent-purple);">
							Fazer o Teste ➔
						</a>
						<span style="font-size: 12px; opacity: 0.7;">10 Perguntas Dinâmicas</span>
					</div>
				</div>
			</div>
		</section>

		<section class="card" style="margin-bottom: 60px; background: linear-gradient(180deg, var(--bg-card) 0%, rgba(18,18,26,0.9) 100%);">
			<h2 style="font-size: 24px; margin-bottom: 16px;">🛠️ Stack de Tecnologias & Engenharia</h2>
			<p style="font-size: 14px; margin-bottom: 24px; opacity: 0.85;">
				Ferramentas e ecossistemas utilizados no desenvolvimento de soluções de software e games:
			</p>
			<div style="display: flex; flex-wrap: wrap; gap: 12px;">
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🕹️ Godot Engine 4 (GDScript / C#)</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🌐 WebAssembly / Emscripten</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">⚡ TypeScript & Node.js</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🐍 Python (AI / Data Science)</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🦀 Rust & C++ (Sistemas & Engines)</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">☁️ Docker & CI/CD Pipelines</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🔥 WebSockets & Real-Time Netcode</span>
			</div>
		</section>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}
</body>
</html>`;

// PAGE 2: ZOMBIES SURVIVE
const zombiesHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Zombies Survive | OmniVoid Studios</title>
	${COMMON_HEAD}
	<style>
		#canvas-wrap {
			position: relative;
			width: 100%;
			max-width: 1100px;
			aspect-ratio: 16 / 9;
			margin: 0 auto 30px auto;
			background: #000000;
			border-radius: 12px;
			overflow: hidden;
			border: 2px solid var(--border-color);
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 0, 85, 0.2);
		}

		#canvas {
			width: 100%;
			height: 100%;
			display: block;
		}

		#game-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(10, 10, 15, 0.95);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			z-index: 10;
			padding: 20px;
			text-align: center;
		}

		.progress-bar-wrap {
			width: 320px;
			height: 14px;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 7px;
			overflow: hidden;
			margin-top: 18px;
			border: 1px solid var(--border-bright);
		}

		.progress-bar-fill {
			height: 100%;
			width: 0%;
			background: linear-gradient(90deg, #ff0055, #00f0ff);
			transition: width 0.15s ease;
		}
	</style>
</head>
<body>
	${getNavbar('zombies')}

	<main class="container">
		<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
			<div>
				<h1 style="font-size: 30px; display: flex; align-items: center; gap: 10px;">
					<span>🧟‍♂️ Zombies Survive</span>
					<span class="badge" style="background: rgba(255,0,85,0.2); border-color: var(--accent-danger); font-size: 12px;">v2.0 Web Edition</span>
				</h1>
				<p style="font-size: 14px; opacity: 0.85;">Mapa Polivalente: 10 Andares, Portas Desbloqueáveis, Caixas Misteriosas e Bosses</p>
			</div>
			<div style="display: flex; gap: 10px;">
				<button class="btn-secondary" onclick="toggleFullscreen()">⛶ Tela Cheia</button>
				<button class="btn-secondary" onclick="restartGame()">🔄 Recarregar</button>
			</div>
		</div>

		<div id="canvas-wrap">
			<canvas id="canvas" oncontextmenu="event.preventDefault();" tabindex="0"></canvas>
			
			<div id="game-overlay">
				<img src="logo_omnivoid.png" alt="Logo" style="max-height: 80px; margin-bottom: 16px;">
				<h2 id="overlay-title" style="font-size: 26px; margin-bottom: 8px;">🩸 ZOMBIES SURVIVE</h2>
				<p id="overlay-status" style="font-size: 14px; opacity: 0.85;">Clique no botão abaixo para carregar o motor e os mapas</p>
				
				<button id="btn-start-load" class="btn-primary" style="margin-top: 20px; font-size: 16px; padding: 14px 32px;" onclick="startGodotEngine()">
					▶ Iniciar Zombies Survive
				</button>

				<div id="progress-container" style="display: none; flex-direction: column; align-items: center;">
					<div class="progress-bar-wrap">
						<div id="progress-bar" class="progress-bar-fill"></div>
					</div>
					<span id="progress-text" style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Baixando pacotes de jogo (0%)...</span>
				</div>
			</div>
		</div>

		<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
			<div class="card">
				<h3 style="font-size: 20px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
					<span>🏆 Hall da Fama - Melhores Sobreviventes</span>
				</h3>
				<div style="overflow-x: auto;">
					<table style="width: 100%; border-collapse: collapse; font-size: 13px;">
						<thead>
							<tr style="border-bottom: 1px solid var(--border-bright); text-align: left;">
								<th style="padding: 8px 6px;">#</th>
								<th style="padding: 8px 6px;">Sobrevivente</th>
								<th style="padding: 8px 6px;">Onda Máx</th>
								<th style="padding: 8px 6px;">Eliminações</th>
								<th style="padding: 8px 6px;">Pontos</th>
							</tr>
						</thead>
						<tbody id="hof-tbody">
							<tr style="border-bottom: 1px solid var(--border-color);">
								<td style="padding: 8px 6px;">🥇 1º</td>
								<td style="padding: 8px 6px; font-weight: 700;">Guilherme Dev 🧑‍🚀</td>
								<td style="padding: 8px 6px;">Onda 48</td>
								<td style="padding: 8px 6px;">1.420</td>
								<td style="padding: 8px 6px; font-weight: 700; color: var(--accent-gold) !important;">185.900</td>
							</tr>
							<tr style="border-bottom: 1px solid var(--border-color);">
								<td style="padding: 8px 6px;">🥈 2º</td>
								<td style="padding: 8px 6px; font-weight: 700;">CyberSniper 🥷</td>
								<td style="padding: 8px 6px;">Onda 37</td>
								<td style="padding: 8px 6px;">1.050</td>
								<td style="padding: 8px 6px; font-weight: 700; color: var(--accent-gold) !important;">124.500</td>
							</tr>
							<tr style="border-bottom: 1px solid var(--border-color);">
								<td style="padding: 8px 6px;">🥉 3º</td>
								<td style="padding: 8px 6px; font-weight: 700;">Valkyrie_X 🧙‍♂️</td>
								<td style="padding: 8px 6px;">Onda 32</td>
								<td style="padding: 8px 6px;">890</td>
								<td style="padding: 8px 6px; font-weight: 700; color: var(--accent-gold) !important;">98.400</td>
							</tr>
							<tr style="border-bottom: 1px solid var(--border-color);">
								<td style="padding: 8px 6px;">4º</td>
								<td style="padding: 8px 6px; font-weight: 700;">VoidHunter 🤖</td>
								<td style="padding: 8px 6px;">Onda 28</td>
								<td style="padding: 8px 6px;">740</td>
								<td style="padding: 8px 6px; font-weight: 700; color: var(--accent-gold) !important;">76.100</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="card">
				<h3 style="font-size: 20px; margin-bottom: 16px;">🎯 Missões Ativas & Controles</h3>
				<div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
					<div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--accent-primary);">
						<div style="font-weight: 700; font-size: 13px;">🚪 Mestre da Exploração</div>
						<div style="font-size: 12px; opacity: 0.8;">Desbloqueie 3 portas no mapa Polivalente em uma única partida (+500 XP).</div>
					</div>
					<div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--accent-danger);">
						<div style="font-weight: 700; font-size: 13px;">💀 Exterminador Noturno</div>
						<div style="font-size: 12px; opacity: 0.8;">Elimine 100 zumbis usando escopetas ou rifles automáticos (+800 XP).</div>
					</div>
				</div>

				<h4 style="font-size: 14px; margin-bottom: 8px;">🎮 Controles do Teclado:</h4>
				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; opacity: 0.9;">
					<div><b>WASD:</b> Movimentar</div>
					<div><b>Mouse:</b> Mirar & Disparar</div>
					<div><b>R:</b> Recarregar Arma</div>
					<div><b>E / Espaço:</b> Interagir / Abrir Portas</div>
					<div><b>1, 2, 3:</b> Trocar Armas</div>
					<div><b>Shift / F:</b> Correr / Lanterna</div>
				</div>
			</div>
		</div>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}

	<script src="index.js"></script>
	<script>
		let godotEngine = null;

		function toggleFullscreen() {
			const elem = document.getElementById("canvas-wrap");
			if (!document.fullscreenElement) {
				elem.requestFullscreen().catch(err => alert("Erro ao entrar em tela cheia: " + err.message));
			} else {
				document.exitFullscreen();
			}
		}

		function restartGame() {
			window.location.reload();
		}

		async function startGodotEngine() {
			const btnStart = document.getElementById("btn-start-load");
			const progressContainer = document.getElementById("progress-container");
			const progressBar = document.getElementById("progress-bar");
			const progressText = document.getElementById("progress-text");
			const overlayStatus = document.getElementById("overlay-status");

			btnStart.style.display = "none";
			progressContainer.style.display = "flex";
			overlayStatus.innerText = "Baixando arquivos do jogo e assets HD...";

			try {
				const chunkFiles = [
					"index.pck.part0",
					"index.pck.part1",
					"index.pck.part2",
					"index.pck.part3"
				];

				const chunkBuffers = [];
				let totalBytesLoaded = 0;
				const estimatedTotalSize = 187777864; // ~179MB

				for (let i = 0; i < chunkFiles.length; i++) {
					const filename = chunkFiles[i];
					progressText.innerText = \`Baixando pacote \${i + 1} de \${chunkFiles.length}...\`;
					
					const response = await fetch(filename);
					if (!response.ok) {
						throw new Error(\`Falha ao carregar \${filename} (HTTP \${response.status})\`);
					}

					const reader = response.body.getReader();
					const chunks = [];
					let receivedLength = 0;

					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						chunks.push(value);
						receivedLength += value.length;
						totalBytesLoaded += value.length;

						const percent = Math.min(98, Math.round((totalBytesLoaded / estimatedTotalSize) * 100));
						progressBar.style.width = percent + "%";
						progressText.innerText = \`Baixando pacotes (\${percent}% - \${(totalBytesLoaded / 1048576).toFixed(1)} MB)...\`;
					}

					const partBuffer = new Uint8Array(receivedLength);
					let pos = 0;
					for (let chunk of chunks) {
						partBuffer.set(chunk, pos);
						pos += chunk.length;
					}
					chunkBuffers.push(partBuffer);
				}

				progressText.innerText = "Montando sistema de arquivos virtual...";
				progressBar.style.width = "99%";

				const mergedPck = new Uint8Array(totalBytesLoaded);
				let offset = 0;
				for (let buf of chunkBuffers) {
					mergedPck.set(buf, offset);
					offset += buf.length;
				}

				progressText.innerText = "Inicializando Godot WebAssembly...";

				godotEngine = new Engine({
					canvas: document.getElementById("canvas"),
					executable: "index",
					onProgress: function(current, total) {
						if (total > 0) {
							const pct = Math.round((current / total) * 100);
							progressBar.style.width = pct + "%";
						}
					}
				});

				await godotEngine.preloadFile(mergedPck.buffer, 'index.pck');
				
				document.getElementById("game-overlay").style.display = "none";

				await godotEngine.start({
					args: ['--main-pack', 'index.pck'],
					mainPack: 'index.pck'
				});

				console.log("Godot Engine iniciado com sucesso!");
			} catch (err) {
				console.error("Erro ao iniciar jogo:", err);
				overlayStatus.innerText = "Erro ao carregar o jogo: " + err.message;
				btnStart.style.display = "inline-flex";
				btnStart.innerText = "Tentar Novamente";
				progressContainer.style.display = "none";
			}
		}
	</script>
</body>
</html>`;

// PAGE 3: FATECCAOS REDIRECT
const fateccaosHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="refresh" content="0; url=zombiessurvive.html">
	<title>Redirecionando para Zombies Survive...</title>
	${COMMON_HEAD}
</head>
<body style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;">
	<div class="card" style="max-width: 500px; padding: 40px;">
		<h2 style="font-size: 26px; margin-bottom: 14px;">🧟‍♂️ Zombies Survive</h2>
		<p style="font-size: 15px; margin-bottom: 24px; opacity: 0.85;">
			O jogo foi atualizado para o nome oficial <b>Zombies Survive</b>. Você será redirecionado em instantes...
		</p>
		<a href="zombiessurvive.html" class="btn-primary">
			Clique aqui para Acessar Agora
		</a>
	</div>
</body>
</html>`;

// PAGE 4: SKYRUSH
const skyrushHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>SkyRush | OmniVoid Studios</title>
	${COMMON_HEAD}
	<style>
		#skyrush-frame-wrap {
			position: relative;
			width: 100%;
			max-width: 1100px;
			aspect-ratio: 16 / 9;
			margin: 0 auto 30px auto;
			background: #000000;
			border-radius: 12px;
			overflow: hidden;
			border: 2px solid var(--border-color);
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 240, 255, 0.2);
		}

		#skyrush-iframe {
			width: 100%;
			height: 100%;
			border: none;
			display: block;
		}
	</style>
</head>
<body>
	${getNavbar('skyrush')}

	<main class="container">
		<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
			<div>
				<h1 style="font-size: 30px; display: flex; align-items: center; gap: 10px;">
					<span>☁️ SkyRush Arcade</span>
					<span class="badge" style="background: rgba(0,240,255,0.2); border-color: var(--accent-primary); font-size: 12px;">Solo & Multiplayer</span>
				</h1>
				<p style="font-size: 14px; opacity: 0.85;">Voe em alta velocidade, desvie de tempestades cósmicas e dispute recordes</p>
			</div>
			<div style="display: flex; gap: 10px;">
				<button class="btn-secondary" onclick="toggleSkyRushFullscreen()">⛶ Tela Cheia</button>
				<button class="btn-secondary" onclick="document.getElementById('skyrush-iframe').src = document.getElementById('skyrush-iframe').src">🔄 Recarregar</button>
			</div>
		</div>

		<div id="skyrush-frame-wrap">
			<iframe id="skyrush-iframe" src="skyrush/index.html" allow="autoplay; fullscreen; gamepad"></iframe>
		</div>

		<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
			<div class="card">
				<h3 style="font-size: 20px; margin-bottom: 16px;">🏆 Hall da Fama SkyRush</h3>
				<table style="width: 100%; border-collapse: collapse; font-size: 13px;">
					<thead>
						<tr style="border-bottom: 1px solid var(--border-bright); text-align: left;">
							<th style="padding: 8px 6px;">#</th>
							<th style="padding: 8px 6px;">Piloto</th>
							<th style="padding: 8px 6px;">Altitude</th>
							<th style="padding: 8px 6px;">Pontos</th>
						</tr>
					</thead>
					<tbody>
						<tr style="border-bottom: 1px solid var(--border-color);">
							<td style="padding: 8px 6px;">🥇 1º</td>
							<td style="padding: 8px 6px; font-weight: 700;">AeroAce_99 🧑‍🚀</td>
							<td style="padding: 8px 6px;">18.420m</td>
							<td style="padding: 8px 6px; font-weight: 700; color: var(--accent-gold) !important;">245.000</td>
						</tr>
						<tr style="border-bottom: 1px solid var(--border-color);">
							<td style="padding: 8px 6px;">🥈 2º</td>
							<td style="padding: 8px 6px; font-weight: 700;">SkyPhantom 🥷</td>
							<td style="padding: 8px 6px;">15.100m</td>
							<td style="padding: 8px 6px; font-weight: 700; color: var(--accent-gold) !important;">198.200</td>
						</tr>
						<tr style="border-bottom: 1px solid var(--border-color);">
							<td style="padding: 8px 6px;">🥉 3º</td>
							<td style="padding: 8px 6px; font-weight: 700;">TurboDev 🤖</td>
							<td style="padding: 8px 6px;">12.850m</td>
							<td style="padding: 8px 6px; font-weight: 700; color: var(--accent-gold) !important;">164.500</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="card">
				<h3 style="font-size: 20px; margin-bottom: 16px;">🎮 Instruções de Voo</h3>
				<ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13px; opacity: 0.9;">
					<li>⚡ <b>Setas ou WASD:</b> Manobrar e inclinar aeronave no espaço aéreo.</li>
					<li>🔋 <b>Orbs Azuis:</b> Recarregam o propulsor de turbo (Nitro Boost).</li>
					<li>🔥 <b>Espaço ou Shift:</b> Ativar Super Nitro para ultrapassar barreiras.</li>
					<li>⭐ <b>Modo Solo Offline:</b> Jogue instantaneamente no navegador sem necessidade de servidor.</li>
				</ul>
			</div>
		</div>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}

	<script>
		function toggleSkyRushFullscreen() {
			const elem = document.getElementById("skyrush-frame-wrap");
			if (!document.fullscreenElement) {
				elem.requestFullscreen().catch(err => alert("Erro ao entrar em tela cheia: " + err.message));
			} else {
				document.exitFullscreen();
			}
		}
	</script>
</body>
</html>`;

// PAGE 5: QUIZ
const quizHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Teste de Programação & Vocacional Tech | OmniVoid Studios</title>
	${COMMON_HEAD}
	<style>
		.quiz-option {
			background: var(--bg-card);
			border: 1px solid var(--border-color);
			border-radius: 12px;
			padding: 16px 20px;
			cursor: pointer;
			display: flex;
			align-items: center;
			gap: 16px;
			transition: all 0.25s ease;
			margin-bottom: 12px;
		}

		.quiz-option:hover {
			border-color: var(--accent-primary);
			background: rgba(0, 240, 255, 0.08);
			transform: translateX(4px);
		}

		.quiz-option.selected {
			border-color: var(--accent-primary);
			background: rgba(0, 240, 255, 0.18);
			box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
		}

		.lang-card {
			background: var(--bg-card);
			border: 1px solid var(--border-color);
			border-radius: 14px;
			padding: 24px;
			transition: all 0.25s ease;
		}

		.lang-card:hover {
			border-color: var(--border-bright);
			transform: translateY(-3px);
		}

		.code-box {
			background: #0d0d14;
			border: 1px solid rgba(255, 255, 255, 0.15);
			border-radius: 8px;
			padding: 14px;
			font-family: var(--font-code);
			font-size: 13px;
			overflow-x: auto;
			margin: 12px 0;
			color: #00f0ff !important;
		}

		.code-box * {
			font-family: var(--font-code);
			color: #00f0ff !important;
		}
	</style>
</head>
<body>
	${getNavbar('quiz')}

	<main class="container">
		<section style="text-align: center; margin: 30px 0 40px 0;">
			<span class="badge" style="background: rgba(157,78,221,0.2); border-color: var(--accent-purple); font-size: 13px; margin-bottom: 12px;">
				🧠 Teste Vocacional de Desenvolvimento
			</span>
			<h1 style="font-size: 38px; margin-bottom: 12px;">
				Qual Linguagem de Programação Combina com Você?
			</h1>
			<p style="font-size: 16px; max-width: 750px; margin: 0 auto; opacity: 0.9; line-height: 1.6;">
				Responda ao questionário interativo para mapear seus interesses (Games, Inteligência Artificial, Web, Mobile, Sistemas, Segurança ou Robótica) e descubra sua linguagem ideal com curiosidades e guias de início!
			</p>
		</section>

		<section id="quiz-section" class="card" style="max-width: 820px; margin: 0 auto 60px auto; border-top: 4px solid var(--accent-primary);">
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
				<span id="quiz-question-num" style="font-weight: 700; font-size: 14px; color: var(--accent-primary) !important;">Pergunta 1 de 8</span>
				<div style="width: 200px; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
					<div id="quiz-bar" style="height: 100%; width: 12.5%; background: linear-gradient(90deg, #00f0ff, #9d4edd);"></div>
				</div>
			</div>

			<h2 id="quiz-question-title" style="font-size: 22px; margin-bottom: 24px; min-height: 56px;">
				Carregando pergunta...
			</h2>

			<div id="quiz-options-list"></div>

			<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 28px;">
				<button id="btn-quiz-prev" class="btn-secondary" onclick="prevQuizQuestion()" style="visibility: hidden;">
					⬅ Anterior
				</button>
				<button id="btn-quiz-next" class="btn-primary" onclick="nextQuizQuestion()" disabled style="opacity: 0.5;">
					Próxima ➔
				</button>
			</div>
		</section>

		<section id="result-section" style="display: none; max-width: 900px; margin: 0 auto 60px auto;">
			<div class="card" style="border-top: 5px solid var(--accent-primary); margin-bottom: 30px; text-align: center; padding: 40px 30px;">
				<div style="font-size: 64px; margin-bottom: 10px;" id="res-icon">🐍</div>
				<span class="badge" style="background: rgba(0, 240, 255, 0.2); border-color: var(--accent-primary); font-size: 13px; margin-bottom: 14px;">
					Match de Afinidade: <b id="res-match-pct" style="color: var(--accent-gold) !important;">98%</b>
				</span>
				<h2 id="res-lang-name" style="font-size: 36px; margin-bottom: 14px;">Python</h2>
				<p id="res-lang-tagline" style="font-size: 16px; max-width: 650px; margin: 0 auto 24px auto; opacity: 0.9; line-height: 1.6;">
					A linguagem perfeita para quem busca clareza, poder analítico, Inteligência Artificial e automação rápida.
				</p>

				<div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
					<button class="btn-primary" onclick="restartQuiz()">
						🔄 Refazer Teste
					</button>
					<button class="btn-secondary" onclick="document.getElementById('encyclopedia-section').scrollIntoView({ behavior: 'smooth' })">
						📚 Ver Todas as 12 Linguagens
					</button>
				</div>
			</div>

			<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px;">
				<div class="card">
					<h3 style="font-size: 18px; margin-bottom: 14px;">✨ Por que é perfeita para você?</h3>
					<p id="res-why-match" style="font-size: 14px; line-height: 1.6; opacity: 0.9;">
						Com base nas suas escolhas por inteligência artificial e facilidade de prototipagem, Python oferece um dos maiores ecossistemas do planeta.
					</p>
					<h4 style="font-size: 14px; margin-top: 18px; margin-bottom: 8px;">🔥 Projetos Famosos Feitos com Ela:</h4>
					<div id="res-famous-projects" style="font-size: 13px; opacity: 0.9; line-height: 1.5;"></div>
				</div>

				<div class="card">
					<h3 style="font-size: 18px; margin-bottom: 14px;">💡 Curiosidades Incríveis</h3>
					<p id="res-trivia" style="font-size: 14px; line-height: 1.6; opacity: 0.9; margin-bottom: 14px;"></p>
					
					<h4 style="font-size: 14px; margin-bottom: 6px;">⚡ Código de Exemplo:</h4>
					<div id="res-code-snippet" class="code-box"></div>
				</div>
			</div>
		</section>

		<section id="encyclopedia-section" style="margin-top: 40px;">
			<div style="text-align: center; margin-bottom: 30px;">
				<h2 style="font-size: 28px; margin-bottom: 10px;">📚 Enciclopédia & Curiosidades das Linguagens</h2>
				<p style="font-size: 14px; opacity: 0.85;">Explore o histórico, casos de uso e fatos marcantes das principais tecnologias mundiais</p>
			</div>

			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px;">
				<div class="lang-card" style="border-top: 3px solid #00f0ff;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
						<h3 style="font-size: 20px;">🕹️ GDScript</h3>
						<span class="badge">Godot Engine</span>
					</div>
					<p style="font-size: 13px; line-height: 1.5; opacity: 0.85; margin-bottom: 12px;">
						Linguagem de altíssimo desempenho projetada especificamente para criação de jogos no motor Godot. Sintaxe intuitiva similar ao Python.
					</p>
					<div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">
						<b>Curiosidade:</b> Criada pelo argentino Juan Linietsky após testes frustrados integrando Lua e Python no motor Godot. Otimizada para garbage collector de baixo custo!
					</div>
					<div class="code-box">func _process(delta):<br>&nbsp;&nbsp;position += velocity * delta</div>
				</div>

				<div class="lang-card" style="border-top: 3px solid #ffd60a;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
						<h3 style="font-size: 20px;">🐍 Python</h3>
						<span class="badge">IA & Ciência de Dados</span>
					</div>
					<p style="font-size: 13px; line-height: 1.5; opacity: 0.85; margin-bottom: 12px;">
						Líder absoluta em Inteligência Artificial, Machine Learning, automação e back-end rápido.
					</p>
					<div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">
						<b>Curiosidade:</b> O criador Guido van Rossum batizou a linguagem em homenagem ao grupo de comédia britânico Monty Python, e não à cobra!
					</div>
					<div class="code-box">import torch<br>model = torch.nn.Linear(10, 2)<br>print("AI Model Ready!")</div>
				</div>

				<div class="lang-card" style="border-top: 3px solid #0088ff;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
						<h3 style="font-size: 20px;">🌐 TypeScript / JS</h3>
						<span class="badge">Web & Full-Stack</span>
					</div>
					<p style="font-size: 13px; line-height: 1.5; opacity: 0.85; margin-bottom: 12px;">
						A espinha dorsal da web mundial. Roda em qualquer navegador do mundo e também em servidores ultra-rápidos com Node.js/Bun.
					</p>
					<div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">
						<b>Curiosidade:</b> O JavaScript original foi criado por Brendan Eich em apenas 10 dias em maio de 1995 para a Netscape!
					</div>
					<div class="code-box">const player: Player = { name: 'Dev', score: 100 };<br>console.log(\`Score: \${player.score}\`);</div>
				</div>

				<div class="lang-card" style="border-top: 3px solid #9d4edd;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
						<h3 style="font-size: 20px;">⚡ C# (.NET)</h3>
						<span class="badge">Unity, Godot & Enterprise</span>
					</div>
					<p style="font-size: 13px; line-height: 1.5; opacity: 0.85; margin-bottom: 12px;">
						Poderosa, tipada e extremamente elegante. Usada em jogos de grande escala na Unity e Godot, e em bancos corporativos globais.
					</p>
					<div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">
						<b>Curiosidade:</b> O símbolo "#" no nome foi inspirado no sustenido musical, indicando que é uma nota acima de C++!
					</div>
					<div class="code-box">public record Player(string Name, int Level);<br>var hero = new Player("Arthur", 99);</div>
				</div>

				<div class="lang-card" style="border-top: 3px solid #ff0055;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
						<h3 style="font-size: 20px;">🏎️ C++</h3>
						<span class="badge">AAA Games & Engines</span>
					</div>
					<p style="font-size: 13px; line-height: 1.5; opacity: 0.85; margin-bottom: 12px;">
						Desempenho bruto no metal. O motor do Unreal Engine, Godot C++, sistemas aeroespaciais da NASA e navegadores web são forjados em C++.
					</p>
					<div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">
						<b>Curiosidade:</b> Originalmente chamada de "C with Classes" por Bjarne Stroustrup em 1979 no Bell Labs.
					</div>
					<div class="code-box">std::vector&lt;int&gt; scores = {100, 250, 400};<br>for(auto s : scores) std::cout &lt;&lt; s &lt;&lt; "\\n";</div>
				</div>

				<div class="lang-card" style="border-top: 3px solid #ff7700;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
						<h3 style="font-size: 20px;">🦀 Rust</h3>
						<span class="badge">Segurança & Alta Performance</span>
					</div>
					<p style="font-size: 13px; line-height: 1.5; opacity: 0.85; margin-bottom: 12px;">
						A linguagem mais amada pelos desenvolvedores no mundo por 8 anos consecutivos. Concorrência segura e zero memory leaks.
					</p>
					<div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">
						<b>Curiosidade:</b> O criador Graydon Hoare começou o projeto após o elevador do seu prédio quebrar repetidamente por falhas de memória no software em C++!
					</div>
					<div class="code-box">fn main() {<br>&nbsp;&nbsp;println!("Zero-cost abstractions & Safety!");<br>}</div>
				</div>
			</div>
		</section>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}

	<script>
		const quizQuestions = [
			{
				title: "1. O que mais te empolga quando você pensa em criar com tecnologia?",
				options: [
					{ text: "🎮 Criar jogos eletrizantes com física, gráficos 2D/3D e combates intensos", tags: ["gdscript", "csharp", "cpp"] },
					{ text: "🤖 Treinar Inteligências Artificiais, chatbots inteligentes e visão computacional", tags: ["python"] },
					{ text: "🌐 Construir sites dinâmicos, portais web interativos e aplicativos globais", tags: ["typescript", "javascript"] },
					{ text: "🛡️ Explorar cibersegurança, criptografia, redes e engenharia de baixo nível", tags: ["rust", "cpp", "c", "python"] }
				]
			},
			{
				title: "2. Como você prefere lidar com regras de código e erros?",
				options: [
					{ text: "🚀 Quero rapidez máxima! Escrever poucas linhas e ver o resultado na tela imediatamente", tags: ["python", "gdscript", "javascript"] },
					{ text: "🛡️ Quero rigor total! Se houver qualquer erro de tipo ou memória, o compilador deve me avisar antes de rodar", tags: ["rust", "typescript", "csharp", "cpp"] },
					{ text: "🏎️ Quero controle absoluto sobre cada byte de memória RAM e ciclo de clock do processador", tags: ["cpp", "c", "rust"] },
					{ text: "📱 Quero criar interfaces elegantes para smartphones Android e iOS", tags: ["kotlin", "swift", "typescript"] }
				]
			},
			{
				title: "3. Se você fosse chamado para um projeto épico amanhã, qual escolheria?",
				options: [
					{ text: "🧟 Desenvolver a sequência do Zombies Survive com novos chefes e multiplayer", tags: ["gdscript", "csharp", "cpp"] },
					{ text: "🧠 Criar uma IA neural que aprende a jogar videogames sozinha por reforço", tags: ["python"] },
					{ text: "🌐 Lançar uma plataforma web moderna com milhões de acessos simultâneos", tags: ["typescript", "go", "rust"] },
					{ text: "🚀 Escrever o software de telemetria e navegação de um satélite espacial", tags: ["c", "cpp", "rust"] }
				]
			},
			{
				title: "4. Qual é a sua relação com a matemática e lógica pura?",
				options: [
					{ text: "📊 Adoro estatística, matrizes, probabilidade e visualização gráfica de dados", tags: ["python", "sql"] },
					{ text: "📐 Gosto de vetores, trigonometria, física de colisões e geometria espacial", tags: ["gdscript", "cpp", "csharp"] },
					{ text: "🧩 Prefiro lógica de negócios, rotas de API, bancos de dados e interfaces de usuário", tags: ["typescript", "sql", "csharp"] },
					{ text: "⚡ Gosto de álgebra booleana, registradores, ponteiros e algoritmos de ordenação extrema", tags: ["c", "cpp", "rust"] }
				]
			},
			{
				title: "5. Em qual ambiente você mais gostaria de ver suas criações rodando?",
				options: [
					{ text: "🎮 Em consoles (PlayStation/Xbox/Switch), Steam e WebGL para gamers", tags: ["cpp", "csharp", "gdscript"] },
					{ text: "☁️ Em servidores de nuvem de alta escala processando bilhões de dados por segundo", tags: ["go", "rust", "python"] },
					{ text: "📱 Nos celulares de milhares de pessoas na Google Play e App Store", tags: ["kotlin", "swift", "typescript"] },
					{ text: "🤖 Em robôs físicos, placas Arduino, microcontroladores e drones", tags: ["c", "cpp", "rust", "python"] }
				]
			},
			{
				title: "6. Qual frase mais define sua mentalidade como desenvolvedor?",
				options: [
					{ text: '"Simplicidade é a sofisticação máxima. Código legível supera código complexo."', tags: ["python", "go"] },
					{ text: '"Velocidade e controle são inegociáveis. Quero espremer 100% da máquina."', tags: ["cpp", "rust", "c"] },
					{ text: '"O jogo precisa ser divertido e responsivo acima de qualquer burocracia."', tags: ["gdscript", "csharp"] },
					{ text: '"Qualquer coisa que possa ser escrita em JS, um dia será escrita em JS."', tags: ["typescript", "javascript"] }
				]
			},
			{
				title: "7. Quando você estuda um novo assunto, o que mais te motiva?",
				options: [
					{ text: "🎨 Criar visuais, animações, efeitos de partículas e ver a mágica visual acontecer", tags: ["gdscript", "typescript", "csharp"] },
					{ text: "🔬 Resolver problemas de raciocínio lógico e quebra-cabeças analíticos", tags: ["python", "rust"] },
					{ text: "💼 Criar soluções práticas que as empresas usam no dia a dia para gerar valor", tags: ["csharp", "typescript", "sql"] },
					{ text: "⚙️ Entender as entranhas dos sistemas operacionais e como o hardware funciona", tags: ["c", "cpp", "rust"] }
				]
			},
			{
				title: "8. Qual formato de produto final te dá mais orgulho de apresentar?",
				options: [
					{ text: "🕹️ Um jogo publicado na Steam ou na Web onde amigos passam horas jogando", tags: ["gdscript", "csharp", "cpp"] },
					{ text: "🤖 Um modelo de IA respondendo perguntas ou gerando imagens incríveis", tags: ["python"] },
					{ text: "📱 Um aplicativo moderno publicado com visual limpo e design responsivo", tags: ["typescript", "kotlin", "swift"] },
					{ text: "⚡ Um sistema super otimizado que nunca trava e processa tudo instantaneamente", tags: ["rust", "go", "cpp"] }
				]
			}
		];

		const langDatabase = {
			"gdscript": {
				name: "GDScript (Godot Engine)",
				icon: "🕹️",
				tagline: "A linguagem feita sob medida para criadores de games dinâmicos e rápidos!",
				whyMatch: "Você demonstra paixão visceral por jogos, efeitos visuais e iteração rápida. O GDScript no Godot 4 te permite transformar ideias de gameplay em realidade em questão de minutos.",
				trivia: "O GDScript foi concebido dentro do próprio motor Godot com tipagem gradual opcional para garantir taxa de quadros estável a 60 FPS sem pausas de Garbage Collector!",
				famous: "Zombies Survive, Brotato, Dome Keeper, Cassette Beasts, Halls of Torment.",
				snippet: "extends CharacterBody2D\\n\\nfunc _physics_process(delta):\\n    velocity = Input.get_vector('ui_left', 'ui_right', 'ui_up', 'ui_down') * 250\\n    move_and_slide()"
			},
			"python": {
				name: "Python",
				icon: "🐍",
				tagline: "A superpotência da Inteligência Artificial, Ciência de Dados e Automação global.",
				whyMatch: "Suas escolhas revelam alto interesse por Machine Learning, clareza lógica e soluções inteligentes. Python é a linguagem oficial do futuro da IA.",
				trivia: "Criada pelo holandês Guido van Rossum em 1991. O nome homenageia o grupo cômico Monty Python! O software do telescópio espacial James Webb usa scripts em Python para calibrar seus espelhos.",
				famous: "ChatGPT (APIs & Treinamento), Instagram Backend, YouTube, Blender Scripts, TensorFlow.",
				snippet: "import openai\\n\\ndef ask_ai(prompt):\\n    return openai.chat.completions.create(model='gpt-4', messages=[{'role': 'user', 'content': prompt}])"
			},
			"typescript": {
				name: "TypeScript / JavaScript",
				icon: "🌐",
				tagline: "O motor universal da Web moderna, aplicativos móveis e APIs em tempo real.",
				whyMatch: "Você busca criar plataformas acessíveis por qualquer dispositivo no mundo, unindo interfaces atraentes e servidores modernos em tempo real.",
				trivia: "O JavaScript foi escrito em apenas 10 dias em 1995. Hoje, com TypeScript criado pela Microsoft, tornou-se uma das linguagens tipadas mais produtivas do planeta.",
				famous: "Netflix Web, Spotify Desktop, VS Code, SkyRush Web Portal, Discord Frontend.",
				snippet: "interface Hero { name: string; health: number; }\\nconst hero: Hero = { name: 'Sniper', health: 100 };\\nconsole.log(\`Hero Ready: \${hero.name}\`);"
			},
			"csharp": {
				name: "C# (.NET)",
				icon: "⚡",
				tagline: "Elegância, poder multiplataforma e a escolha de peso para grandes jogos e corporações.",
				whyMatch: "Você gosta de robustez, orientação a objetos clássica e flexibilidade para criar tanto jogos avançados (Unity/Godot) quanto grandes sistemas corporativos.",
				trivia: "Desenhada pelo lendário Anders Hejlsberg na Microsoft. O nome C# ('C Sharp') simboliza um sustenido musical sobre o C, significando evolução harmônica.",
				famous: "Hollow Knight, Cuphead, Terraria, Forza Horizon (UI), Sistemas Bancários Globais.",
				snippet: "public class Player : IEntity\\n{\\n    public string Nickname { get; set; } = 'VoidPlayer';\\n    public void LevelUp() => Console.WriteLine('Level Up!');\\n}"
			},
			"cpp": {
				name: "C++",
				icon: "🏎️",
				tagline: "O ápice do desempenho bruto, motores gráficos AAA e computação de alta precisão.",
				whyMatch: "Você quer entender o funcionamento do hardware, física pesada e ter controle milimétrico sobre alocação de memória e pipelines gráficos.",
				trivia: "Criada por Bjarne Stroustrup no Bell Labs em 1979. Praticamente todos os sistemas operacionais modernos (Windows, macOS, Linux) têm seus núcleos e drivers em C e C++.",
				famous: "Unreal Engine 5, Godot Core, GTA V, Counter-Strike 2, Adobe Photoshop.",
				snippet: "#include <iostream>\\nint main() {\\n    std::cout << 'Zero Overhead AAA Game Loop!' << std::endl;\\n    return 0;\\n}"
			},
			"rust": {
				name: "Rust",
				icon: "🦀",
				tagline: "Segurança de memória revolucionária aliada a desempenho idêntico ao C++.",
				whyMatch: "Você valoriza arquiteturas seguras, confiabilidade máxima e sistemas modernos que nunca sofrem com brechas de segurança ou memory leaks.",
				trivia: "Eleita a linguagem mais admirada do mundo pelos desenvolvedores do Stack Overflow por 8 anos consecutivos. O Linux Kernel agora aceita código oficial em Rust!",
				famous: "Discord Backend, Ferramentas do Linux Kernel, Cloudflare Workers, 1Password, Bevy Game Engine.",
				snippet: "fn main() {\\n    let mut health: i32 = 100;\\n    println!('Safe memory without garbage collector! Health: {}', health);\\n}"
			}
		};

		let currentQuestionIndex = 0;
		let userAnswers = [];

		function loadQuestion(index) {
			const q = quizQuestions[index];
			document.getElementById("quiz-question-num").innerText = \`Pergunta \${index + 1} de \${quizQuestions.length}\`;
			document.getElementById("quiz-bar").style.width = \`\${((index + 1) / quizQuestions.length) * 100}%\`;
			document.getElementById("quiz-question-title").innerText = q.title;

			const optionsDiv = document.getElementById("quiz-options-list");
			optionsDiv.innerHTML = "";

			const selectedOption = userAnswers[index];

			q.options.forEach((opt, optIdx) => {
				const optEl = document.createElement("div");
				optEl.className = \`quiz-option \${selectedOption === optIdx ? 'selected' : ''}\`;
				optEl.innerHTML = \`
					<div style="font-size: 18px; font-weight: 800; width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center;">\${String.fromCharCode(65 + optIdx)}</div>
					<div style="font-size: 14px; font-weight: 600; line-height: 1.4;">\${opt.text}</div>
				\`;
				optEl.onclick = () => selectOption(optIdx);
				optionsDiv.appendChild(optEl);
			});

			document.getElementById("btn-quiz-prev").style.visibility = index > 0 ? "visible" : "hidden";
			const nextBtn = document.getElementById("btn-quiz-next");
			if (selectedOption !== undefined) {
				nextBtn.disabled = false;
				nextBtn.style.opacity = "1";
				nextBtn.innerText = index === quizQuestions.length - 1 ? "Ver Meu Resultado 🏆" : "Próxima ➔";
			} else {
				nextBtn.disabled = true;
				nextBtn.style.opacity = "0.5";
				nextBtn.innerText = index === quizQuestions.length - 1 ? "Ver Meu Resultado 🏆" : "Próxima ➔";
			}
		}

		function selectOption(optIdx) {
			userAnswers[currentQuestionIndex] = optIdx;
			loadQuestion(currentQuestionIndex);
		}

		function nextQuizQuestion() {
			if (currentQuestionIndex < quizQuestions.length - 1) {
				currentQuestionIndex++;
				loadQuestion(currentQuestionIndex);
			} else {
				calculateAndShowResult();
			}
		}

		function prevQuizQuestion() {
			if (currentQuestionIndex > 0) {
				currentQuestionIndex--;
				loadQuestion(currentQuestionIndex);
			}
		}

		function calculateAndShowResult() {
			const scores = {
				"gdscript": 0,
				"python": 0,
				"typescript": 0,
				"csharp": 0,
				"cpp": 0,
				"rust": 0
			};

			userAnswers.forEach((ansIdx, qIdx) => {
				const tags = quizQuestions[qIdx].options[ansIdx].tags;
				tags.forEach(tag => {
					if (scores[tag] !== undefined) {
						scores[tag] += 1;
					}
				});
			});

			let bestLang = "python";
			let maxScore = -1;
			for (let lang in scores) {
				if (scores[lang] > maxScore) {
					maxScore = scores[lang];
					bestLang = lang;
				}
			}

			const langData = langDatabase[bestLang] || langDatabase["python"];
			
			document.getElementById("quiz-section").style.display = "none";
			const resSec = document.getElementById("result-section");
			resSec.style.display = "block";

			document.getElementById("res-icon").innerText = langData.icon;
			document.getElementById("res-lang-name").innerText = langData.name;
			document.getElementById("res-lang-tagline").innerText = langData.tagline;
			document.getElementById("res-why-match").innerText = langData.whyMatch;
			document.getElementById("res-trivia").innerText = langData.trivia;
			document.getElementById("res-famous-projects").innerText = langData.famous;
			document.getElementById("res-code-snippet").innerHTML = langData.snippet.replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;');

			resSec.scrollIntoView({ behavior: 'smooth' });
		}

		function restartQuiz() {
			currentQuestionIndex = 0;
			userAnswers = [];
			document.getElementById("result-section").style.display = "none";
			document.getElementById("quiz-section").style.display = "block";
			loadQuestion(0);
			document.getElementById("quiz-section").scrollIntoView({ behavior: 'smooth' });
		}

		document.addEventListener("DOMContentLoaded", () => {
			loadQuestion(0);
		});
	</script>
</body>
</html>`;

// PAGE 6: PROJETOS
const projetosHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Projetos & Portfólio | OmniVoid Studios</title>
	${COMMON_HEAD}
</head>
<body>
	${getNavbar('projetos')}

	<main class="container">
		<section style="margin: 30px 0 40px 0;">
			<span class="badge" style="background: rgba(0,240,255,0.15); border-color: var(--accent-primary); font-size: 13px; margin-bottom: 12px;">
				🚀 Portfólio de Engenharia & GameDev
			</span>
			<h1 style="font-size: 38px; margin-bottom: 12px;">Projetos Desenvolvidos</h1>
			<p style="font-size: 16px; opacity: 0.85; max-width: 780px; line-height: 1.6;">
				Conheça os principais softwares, jogos e sistemas criados com foco em alta performance, estabilidade e experiência do usuário.
			</p>
		</section>

		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 28px; margin-bottom: 60px;">
			<div class="card" style="border-top: 4px solid var(--accent-danger);">
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
					<span class="badge" style="background: rgba(255,0,85,0.2); border-color: var(--accent-danger);">Godot 4.3 Web</span>
					<span class="badge">Ativo & Online</span>
				</div>
				<h3 style="font-size: 22px; margin-bottom: 10px;">Zombies Survive (v2.0)</h3>
				<p style="font-size: 14px; line-height: 1.6; opacity: 0.85; margin-bottom: 18px;">
					Jogo de sobrevivência em ondas com mapa polivalente de 10 andares. Implementa portas desbloqueáveis, compra de armamento, IA de pathfinding adaptativa e renderização WebAssembly multichunk ultra rápida.
				</p>
				<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
					<span class="badge" style="font-size: 11px;">GDScript</span>
					<span class="badge" style="font-size: 11px;">WebAssembly</span>
					<span class="badge" style="font-size: 11px;">WebGL 2.0</span>
					<span class="badge" style="font-size: 11px;">AudioWorklet</span>
				</div>
				<a href="zombiessurvive.html" class="btn-primary" style="background: linear-gradient(135deg, #ff0055, #c90044);">
					Abrir Jogo ➔
				</a>
			</div>

			<div class="card" style="border-top: 4px solid var(--accent-primary);">
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
					<span class="badge" style="background: rgba(0,240,255,0.2); border-color: var(--accent-primary);">HTML5 Canvas & Netcode</span>
					<span class="badge">Online & Solo</span>
				</div>
				<h3 style="font-size: 22px; margin-bottom: 10px;">SkyRush Supersonic Arcade</h3>
				<p style="font-size: 14px; line-height: 1.6; opacity: 0.85; margin-bottom: 18px;">
					Arcade espacial em 2D com física de impulso, coleta de orbs de nitro, ranking em tempo real e modo offline instantâneo com simulação client-side.
				</p>
				<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
					<span class="badge" style="font-size: 11px;">JavaScript ES6</span>
					<span class="badge" style="font-size: 11px;">HTML5 Canvas</span>
					<span class="badge" style="font-size: 11px;">WebSockets</span>
					<span class="badge" style="font-size: 11px;">LocalStorage API</span>
				</div>
				<a href="skyrush.html" class="btn-primary">
					Decolar no SkyRush ➔
				</a>
			</div>

			<div class="card" style="border-top: 4px solid var(--accent-purple);">
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
					<span class="badge" style="background: rgba(157,78,221,0.2); border-color: var(--accent-purple);">Algoritmo de Afinidade</span>
					<span class="badge">Educacional</span>
				</div>
				<h3 style="font-size: 22px; margin-bottom: 10px;">Teste Vocacional de Programação</h3>
				<p style="font-size: 14px; line-height: 1.6; opacity: 0.85; margin-bottom: 18px;">
					Sistema interativo com algoritmo de pontuação ponderada para orientar estudantes sobre linguagens de programação, carreiras em tecnologia e curiosidades históricas.
				</p>
				<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
					<span class="badge" style="font-size: 11px;">Algoritmos</span>
					<span class="badge" style="font-size: 11px;">Frontend Reativo</span>
					<span class="badge" style="font-size: 11px;">12 Tech Stacks</span>
				</div>
				<a href="quiz.html" class="btn-secondary" style="border-color: var(--accent-purple);">
					Fazer o Teste ➔
				</a>
			</div>

			<div class="card" style="border-top: 4px solid var(--accent-emerald);">
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
					<span class="badge" style="background: rgba(0,255,136,0.2); border-color: var(--accent-emerald);">Backend & Cross-Origin</span>
					<span class="badge">Infraestrutura</span>
				</div>
				<h3 style="font-size: 22px; margin-bottom: 10px;">OmniVoid Multi-Thread Engine Core</h3>
				<p style="font-size: 14px; line-height: 1.6; opacity: 0.85; margin-bottom: 18px;">
					Arquitetura de headers de isolamento cruzado (COOP/COEP) via Service Worker transparente para suportar SharedArrayBuffer e multithreading em navegadores modernos sem necessidade de backend proprietário.
				</p>
				<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
					<span class="badge" style="font-size: 11px;">COOP / COEP</span>
					<span class="badge" style="font-size: 11px;">SharedArrayBuffer</span>
					<span class="badge" style="font-size: 11px;">GitHub Pages CDN</span>
				</div>
				<a href="devchat.html" class="btn-secondary">
					Discutir na Conversa Dev ➔
				</a>
			</div>
		</div>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}
</body>
</html>`;

// PAGE 7: DEVCHAT
const devchatHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Conversa Dev & Comunidade | OmniVoid Studios</title>
	${COMMON_HEAD}
	<style>
		.chat-channel-btn {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: 10px 14px;
			border-radius: 8px;
			background: transparent;
			border: 1px solid transparent;
			cursor: pointer;
			text-align: left;
			font-size: 13px;
			font-weight: 600;
			transition: all 0.2s;
		}

		.chat-channel-btn:hover {
			background: rgba(255, 255, 255, 0.08);
			border-color: rgba(255, 255, 255, 0.15);
		}

		.chat-channel-btn.active {
			background: rgba(0, 240, 255, 0.15);
			border-color: var(--accent-primary);
		}

		.message-bubble {
			background: var(--bg-surface);
			border: 1px solid var(--border-color);
			border-radius: 12px;
			padding: 14px 18px;
			margin-bottom: 14px;
			transition: all 0.2s ease;
		}

		.message-bubble:hover {
			border-color: var(--border-bright);
		}
	</style>
</head>
<body>
	${getNavbar('devchat')}

	<main class="container">
		<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
			<div>
				<h1 style="font-size: 30px; display: flex; align-items: center; gap: 10px;">
					<span>💬 Conversa Dev & Fórum Técnico</span>
				</h1>
				<p style="font-size: 14px; opacity: 0.85;">Troque ideias sobre GameDev, Godot, programação, tire dúvidas e compartilhe estratégias</p>
			</div>
		</div>

		<div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px; min-height: 600px; margin-bottom: 40px;">
			<div class="card" style="padding: 16px;">
				<h3 style="font-size: 16px; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
					📢 Canais de Discussão
				</h3>
				<div style="display: flex; flex-direction: column; gap: 6px;" id="channel-list">
					<button class="chat-channel-btn active" onclick="switchChannel('geral')">
						<span>💬 #geral</span>
						<span class="badge" style="font-size: 10px;">Ativo</span>
					</button>
					<button class="chat-channel-btn" onclick="switchChannel('zombies-survive')">
						<span>🧟 #zombies-survive</span>
						<span class="badge" style="font-size: 10px;">Godot</span>
					</button>
					<button class="chat-channel-btn" onclick="switchChannel('skyrush')">
						<span>☁️ #skyrush</span>
						<span class="badge" style="font-size: 10px;">Arcade</span>
					</button>
					<button class="chat-channel-btn" onclick="switchChannel('dicas-programacao')">
						<span>🧠 #dicas-programacao</span>
						<span class="badge" style="font-size: 10px;">Quiz</span>
					</button>
					<button class="chat-channel-btn" onclick="switchChannel('showcase')">
						<span>🚀 #projetos-alunos</span>
						<span class="badge" style="font-size: 10px;">Showcase</span>
					</button>
				</div>

				<div style="margin-top: 30px; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 12px; font-size: 12px; opacity: 0.85;">
					💡 <b>Dica Dev:</b> Entre na sua conta para que suas mensagens fiquem associadas ao seu nickname e avatar oficial.
				</div>
			</div>

			<div class="card" style="display: flex; flex-direction: column; padding: 20px;">
				<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 16px;">
					<h3 id="current-channel-title" style="font-size: 18px;">💬 #geral - Bate-papo Geral da Comunidade</h3>
					<span class="badge" id="online-counter">🟢 Online</span>
				</div>

				<div id="messages-container" style="flex: 1; max-height: 480px; overflow-y: auto; padding-right: 8px; margin-bottom: 16px;">
				</div>

				<form id="chat-form" onsubmit="handleSendMessage(event)" style="display: flex; gap: 10px; align-items: center;">
					<input type="text" id="chat-input" class="input-field" placeholder="Escreva uma mensagem ou dúvida técnica..." style="margin: 0; flex: 1;" required>
					<button type="submit" class="btn-primary" style="padding: 10px 20px; white-space: nowrap;">
						Enviar ➔
					</button>
				</form>
			</div>
		</div>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}

	<script>
		let currentChannel = 'geral';

		const initialMessages = {
			'geral': [
				{ author: 'Guilherme Dev', avatar: '🧑‍🚀', turma: 'Admin & Dev', time: '18:30', text: 'Fala pessoal! Sejam muito bem-vindos à plataforma OmniVoid Studios! Fiquem à vontade para testar os jogos e fazer o novo teste de programação!' },
				{ author: 'Lucas_Coder', avatar: '🥷', turma: 'ADS 3º Sem', time: '18:42', text: 'O novo teste de programação ficou sensacional! Deu 98% de afinidade com Python e GDScript pra mim.' }
			],
			'zombies-survive': [
				{ author: 'Guilherme Dev', avatar: '🧑‍🚀', turma: 'Admin & Dev', time: '17:15', text: 'Zombies Survive atualizado para v2.0 com o mapa Polivalente de 10 andares completo no Godot 4.3!' },
				{ author: 'Valkyrie_X', avatar: '🧙‍♂️', turma: 'Ciência Comp.', time: '18:10', text: 'Qual a melhor estratégia para passar da onda 20? As escopetas no 3º andar estão ajudando muito.' }
			],
			'skyrush': [
				{ author: 'AeroAce_99', avatar: '🤖', turma: 'Eng. Software', time: '16:00', text: 'Bati 18.400m de altitude no SkyRush! O modo solo offline está super fluido.' }
			],
			'dicas-programacao': [
				{ author: 'Guilherme Dev', avatar: '🧑‍🚀', turma: 'Admin & Dev', time: '15:20', text: 'Dica do dia: no Godot 4, use vetores tipados (Vector2 / Vector3) para que a engine execute operações diretamente em C++ com ganho de até 4x em performance.' }
			],
			'showcase': [
				{ author: 'Dev_Iniciante', avatar: '👾', turma: 'ADS 1º Sem', time: '14:50', text: 'Comecei a estudar lógica essa semana e o quiz me recomendou começar por Python e GDScript! Animado!' }
			]
		};

		function getChannelMessages(channel) {
			try {
				const stored = localStorage.getItem(\`omnivoid_chat_\${channel}\`);
				if (stored) return JSON.parse(stored);
			} catch (e) {}
			return initialMessages[channel] || [];
		}

		function saveChannelMessages(channel, msgs) {
			localStorage.setItem(\`omnivoid_chat_\${channel}\`, JSON.stringify(msgs));
		}

		function switchChannel(channel) {
			currentChannel = channel;
			document.querySelectorAll('.chat-channel-btn').forEach(b => b.classList.remove('active'));
			if (window.event && window.event.currentTarget) {
				window.event.currentTarget.classList.add('active');
			}
			
			const channelNames = {
				'geral': '💬 #geral - Bate-papo Geral da Comunidade',
				'zombies-survive': '🧟 #zombies-survive - Estratégias & Godot',
				'skyrush': '☁️ #skyrush - Recordes & Arcade',
				'dicas-programacao': '🧠 #dicas-programacao - Tutoriais & Quiz',
				'showcase': '🚀 #projetos-alunos - Mostre seus Projetos'
			};
			
			document.getElementById('current-channel-title').innerText = channelNames[channel] || \`#\${channel}\`;
			renderMessages();
		}

		function renderMessages() {
			const container = document.getElementById("messages-container");
			const msgs = getChannelMessages(currentChannel);
			container.innerHTML = "";

			msgs.forEach(m => {
				const div = document.createElement("div");
				div.className = "message-bubble";
				div.innerHTML = \`
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
						<div style="display: flex; align-items: center; gap: 8px;">
							<span style="font-size: 20px;">\${m.avatar || '🧑‍🚀'}</span>
							<b style="font-size: 13px;">\${m.author}</b>
							<span class="badge" style="font-size: 10px; padding: 2px 6px;">\${m.turma || 'Membro'}</span>
						</div>
						<span style="font-size: 11px; opacity: 0.7;">\${m.time}</span>
					</div>
					<div style="font-size: 14px; line-height: 1.5; opacity: 0.95;">\${m.text}</div>
				\`;
				container.appendChild(div);
			});

			container.scrollTop = container.scrollHeight;
		}

		function handleSendMessage(e) {
			e.preventDefault();
			const input = document.getElementById("chat-input");
			const text = input.value.trim();
			if (!text) return;

			const user = getCurrentUser() || {
				nickname: 'Visitante_' + Math.floor(Math.random() * 899 + 100),
				avatar: '🧑‍🚀',
				turma: 'Visitante'
			};

			const now = new Date();
			const timeStr = \`\${String(now.getHours()).padStart(2, '0')}:\${String(now.getMinutes()).padStart(2, '0')}\`;

			const msgs = getChannelMessages(currentChannel);
			msgs.push({
				author: user.nickname || user.name,
				avatar: user.avatar || '🧑‍🚀',
				turma: user.turma || 'Aluno',
				time: timeStr,
				text: text
			});

			saveChannelMessages(currentChannel, msgs);
			input.value = "";
			renderMessages();
		}

		document.addEventListener("DOMContentLoaded", () => {
			renderMessages();
		});
	</script>
</body>
</html>`;

const pages = {
	'index.html': indexHtml,
	'zombiessurvive.html': zombiesHtml,
	'fateccaos.html': fateccaosHtml,
	'skyrush.html': skyrushHtml,
	'quiz.html': quizHtml,
	'projetos.html': projetosHtml,
	'devchat.html': devchatHtml
};

for (const targetDir of [DOCS_DIR, PUBLIC_DIR]) {
	fs.mkdirSync(targetDir, { recursive: true });
	for (const [filename, content] of Object.entries(pages)) {
		const filePath = path.join(targetDir, filename);
		fs.writeFileSync(filePath, content, 'utf-8');
		console.log(`[OK] Generated ${filePath}`);
	}
}

console.log('\nAll 7 pages built and synchronized in docs/ and public/!');
