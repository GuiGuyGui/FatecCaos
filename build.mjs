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
			--bg-base: #07070c;
			--bg-surface: #101018;
			--bg-card: #151522;
			--bg-card-hover: #1e1e30;
			--border-color: rgba(255, 255, 255, 0.12);
			--border-bright: rgba(255, 255, 255, 0.3);
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
				radial-gradient(circle at 15% 15%, rgba(0, 240, 255, 0.07) 0%, transparent 40%),
				radial-gradient(circle at 85% 85%, rgba(157, 78, 221, 0.07) 0%, transparent 40%),
				linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
			background-size: 100% 100%, 100% 100%, 35px 35px, 35px 35px;
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
			background: rgba(7, 7, 12, 0.94);
			backdrop-filter: blur(14px);
			-webkit-backdrop-filter: blur(14px);
			border-bottom: 1px solid var(--border-color);
			padding: 12px 28px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-shadow: 0 4px 25px rgba(0, 0, 0, 0.7);
		}

		.nav-brand {
			display: flex;
			align-items: center;
			gap: 12px;
		}

		.nav-logo {
			height: 62px;
			width: auto;
			object-fit: contain;
			filter: none !important;
			transition: transform 0.2s ease;
		}

		.nav-logo:hover {
			transform: scale(1.05);
		}

		.nav-links {
			display: flex;
			align-items: center;
			gap: 6px;
			list-style: none;
		}

		.nav-link {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 8px 14px;
			border-radius: 8px;
			font-size: 13.5px;
			font-weight: 600;
			letter-spacing: 0.3px;
			color: #ffffff !important;
			background: transparent;
			border: 1px solid transparent;
			transition: all 0.2s ease;
			white-space: nowrap;
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
			max-width: 1380px;
			margin: 0 auto;
			padding: 30px 24px;
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

		/* Full-Width Hero Banner */
		.logo-hero-container {
			width: 100vw;
			position: relative;
			left: 50%;
			right: 50%;
			margin-left: -50vw;
			margin-right: -50vw;
			background: #050509;
			border-bottom: 1px solid var(--border-color);
			padding: 20px 16px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-shadow: none !important;
			overflow: hidden;
		}

		.logo-hero-img {
			width: 100%;
			max-width: 1500px;
			height: auto;
			max-height: 450px;
			object-fit: contain;
			filter: none !important;
			transition: transform 0.3s ease;
		}

		.logo-hero-img:hover {
			transform: scale(1.02);
		}

		/* Profile / Photo Container */
		.profile-avatar-frame {
			width: 160px;
			height: 160px;
			border-radius: 50%;
			border: 3px solid var(--accent-primary);
			box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
			overflow: hidden;
			background: #151522;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			flex-shrink: 0;
		}

		.profile-avatar-img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		/* Modal styling */
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
			background: #050508;
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

		@media (max-width: 1080px) {
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
				<li><a href="orcamento.html" class="nav-link ${activeTab === 'orcamento' ? 'active' : ''}">Serviços & Orçamento</a></li>
				<li><a href="jogos.html" class="nav-link ${activeTab === 'jogos' ? 'active' : ''}">Jogos</a></li>
				<li><a href="quiz.html" class="nav-link ${activeTab === 'quiz' ? 'active' : ''}">Teste Dev</a></li>
				<li><a href="projetos.html" class="nav-link ${activeTab === 'projetos' ? 'active' : ''}">Projetos</a></li>
				<li><a href="devchat.html" class="nav-link ${activeTab === 'devchat' ? 'active' : ''}">Conversa Dev</a></li>
				<li><a href="sobre.html" class="nav-link ${activeTab === 'sobre' ? 'active' : ''}">Sobre Mim</a></li>
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
						<span id="nav-user-avatar">👤</span>
						<span id="nav-user-name">Usuário</span>
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
					<p style="font-size: 13px; margin-bottom: 16px; opacity: 0.85;">Acesse sua conta para salvar recordes, simular orçamentos e interagir na comunidade.</p>

					<label style="font-size: 12px; font-weight: 600;">E-mail ou Nickname:</label>
					<input type="text" id="login-identifier" class="input-field" placeholder="ex: seu_nickname ou seu@email.com" required>

					<label style="font-size: 12px; font-weight: 600;">Senha:</label>
					<input type="password" id="login-password" class="input-field" placeholder="Sua senha de acesso" required>

					<button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 10px;">
						🚀 Entrar na Conta
					</button>
				</form>

				<form id="form-register" style="display: none;" onsubmit="handleRegisterSubmit(event)">
					<h3 style="font-size: 18px; margin-bottom: 12px;">Criar Conta de Usuário</h3>
					<p style="font-size: 13px; margin-bottom: 16px; opacity: 0.85;">Cadastre-se gratuitamente para salvar seu progresso, recordes e participar do chat.</p>

					<label style="font-size: 12px; font-weight: 600;">Nome Completo:</label>
					<input type="text" id="reg-name" class="input-field" placeholder="ex: Seu Nome" required>

					<label style="font-size: 12px; font-weight: 600;">Nickname / Apelido:</label>
					<input type="text" id="reg-nickname" class="input-field" placeholder="ex: Player1" required>

					<label style="font-size: 12px; font-weight: 600;">Área / Cargo ou Curso (Opcional):</label>
					<input type="text" id="reg-turma" class="input-field" placeholder="ex: Gamer / Dev / Estudante" value="Visitante">

					<label style="font-size: 12px; font-weight: 600;">E-mail:</label>
					<input type="email" id="reg-email" class="input-field" placeholder="ex: seu@email.com" required>

					<label style="font-size: 12px; font-weight: 600;">Escolha seu Avatar:</label>
					<div class="avatar-picker-row">
						<span class="avatar-choice selected" onclick="selectAvatar('🧑‍🚀', this)">🧑‍🚀</span>
						<span class="avatar-choice" onclick="selectAvatar('🥷', this)">🥷</span>
						<span class="avatar-choice" onclick="selectAvatar('🧙‍♂️', this)">🧙‍♂️</span>
						<span class="avatar-choice" onclick="selectAvatar('🤖', this)">🤖</span>
						<span class="avatar-choice" onclick="selectAvatar('🧟', this)">🧟</span>
						<span class="avatar-choice" onclick="selectAvatar('👾', this)">👾</span>
						<span class="avatar-choice" onclick="selectAvatar('🕵️', this)">🕵️</span>
						<span class="avatar-choice" onclick="selectAvatar('🐱', this)">🐱</span>
					</div>

					<label style="font-size: 12px; font-weight: 600;">Senha:</label>
					<input type="password" id="reg-password" class="input-field" placeholder="Mínimo 4 caracteres" required minlength="4">

					<button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 10px;">
						✨ Criar Minha Conta
					</button>
				</form>
			</div>
		</div>

		<div id="modal-profile" class="modal-backdrop" onclick="closeModalOnBackdrop(event, 'modal-profile')">
			<div class="modal-box" style="max-width: 600px;">
				<button class="modal-close-btn" onclick="closeModal('modal-profile')">✕</button>

				<div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 16px; margin-bottom: 20px;">
					<div style="display: flex; align-items: center; gap: 14px;">
						<div style="font-size: 40px; width: 60px; height: 60px; background: rgba(255,255,255,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--accent-primary);" id="modal-profile-avatar">👤</div>
						<div>
							<h2 id="modal-profile-name" style="font-size: 20px; font-weight: 800;">Usuário</h2>
							<p id="modal-profile-sub" style="font-size: 13px; opacity: 0.85;">Membro</p>
						</div>
					</div>
					<button class="btn-secondary" onclick="handleLogout()" style="padding: 6px 14px; font-size: 12px; color: #ff0055 !important;">
						🚪 Sair da Conta
					</button>
				</div>

				<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; margin-bottom: 16px;">
					<div style="background: #121217; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; text-align: center;">
						<div id="prof-stat-level" style="font-size: 20px; font-weight: 800; color: var(--accent-gold) !important;">Nvl 1</div>
						<div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">Nível</div>
					</div>
					<div style="background: #121217; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; text-align: center;">
						<div id="prof-stat-cash" style="font-size: 20px; font-weight: 800; color: var(--accent-emerald) !important;">$0</div>
						<div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">Créditos</div>
					</div>
					<div style="background: #121217; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; text-align: center;">
						<div id="prof-stat-wave" style="font-size: 20px; font-weight: 800; color: var(--accent-danger) !important;">Onda 1</div>
						<div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">Zombies</div>
					</div>
					<div style="background: #121217; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 12px; text-align: center;">
						<div id="prof-stat-kills" style="font-size: 20px; font-weight: 800; color: var(--accent-primary) !important;">0</div>
						<div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">Pontuação</div>
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
		const stored = localStorage.getItem("omnivoid_current_user");
		if (stored) {
			const parsed = JSON.parse(stored);
			if (parsed && parsed.nickname) return parsed;
		}
		return null;
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
function updateUIAfterAuth() {
	const user = getCurrentUser();
	const loggedOutDiv = document.getElementById("auth-logged-out");
	const loggedInDiv = document.getElementById("auth-logged-in");
	if (!loggedOutDiv || !loggedInDiv) return;
	if (user) {
		loggedOutDiv.style.display = "none";
		loggedInDiv.style.display = "flex";
		const navAvatar = document.getElementById("nav-user-avatar");
		const navName = document.getElementById("nav-user-name");
		const navLevel = document.getElementById("nav-user-level");
		if (navAvatar) navAvatar.innerText = user.avatar || "👤";
		if (navName) navName.innerText = user.nickname || user.name || "Usuário";
		if (navLevel) navLevel.innerText = "Nvl " + (user.level || 1);
	} else {
		loggedOutDiv.style.display = "flex";
		loggedInDiv.style.display = "none";
	}
}
function openAuthModal(tab) {
	const m = document.getElementById("modal-auth");
	if (m) {
		m.style.display = "flex";
		switchAuthTab(tab);
	}
}
function switchAuthTab(tab) {
	const fLog = document.getElementById("form-login");
	const fReg = document.getElementById("form-register");
	const bLog = document.getElementById("tab-btn-login");
	const bReg = document.getElementById("tab-btn-register");
	if (tab === "login") {
		if (fLog) fLog.style.display = "block";
		if (fReg) fReg.style.display = "none";
		if (bLog) bLog.classList.add("active");
		if (bReg) bReg.classList.remove("active");
	} else {
		if (fLog) fLog.style.display = "none";
		if (fReg) fReg.style.display = "block";
		if (bLog) bLog.classList.remove("active");
		if (bReg) bReg.classList.add("active");
	}
}
function openProfileModal() {
	const user = getCurrentUser();
	if (!user) {
		openAuthModal("login");
		return;
	}
	const mName = document.getElementById("modal-profile-name");
	const mSub = document.getElementById("modal-profile-sub");
	const mAvt = document.getElementById("modal-profile-avatar");
	const mLevel = document.getElementById("prof-stat-level");
	const mCash = document.getElementById("prof-stat-cash");
	const mWave = document.getElementById("prof-stat-wave");
	const mKills = document.getElementById("prof-stat-kills");

	if (mName) mName.innerText = user.nickname || user.name || "Usuário";
	if (mSub) mSub.innerText = (user.name || "Usuário") + " • " + (user.turma || "Membro");
	if (mAvt) mAvt.innerText = user.avatar || "👤";
	if (mLevel) mLevel.innerText = "Nvl " + (user.level || 1);
	if (mCash) mCash.innerText = "$" + (user.cash || 0).toLocaleString("pt-BR");
	if (mWave) mWave.innerText = "Onda " + (user.maxWave || 1);
	if (mKills) mKills.innerText = (user.kills || 0).toLocaleString("pt-BR");

	const m = document.getElementById("modal-profile");
	if (m) m.style.display = "flex";
}
function closeModal(id) {
	const m = document.getElementById(id);
	if (m) m.style.display = "none";
}
function closeModalOnBackdrop(e, id) {
	if (e.target && e.target.id === id) {
		closeModal(id);
	}
}
function handleLoginSubmit(e) {
	e.preventDefault();
	const ident = document.getElementById("login-identifier").value.trim().toLowerCase();
	const pass = document.getElementById("login-password").value.trim();
	const db = getUsersDB();
	const found = db.find(u => (u.email.toLowerCase() === ident || u.nickname.toLowerCase() === ident) && u.password === pass);
	if (found) {
		setCurrentUser(found);
		closeModal("modal-auth");
		alert("Bem-vindo de volta, " + found.nickname + "!");
	} else {
		alert("Usuário ou senha incorretos. Caso ainda não possua conta, clique na aba 'Novo Cadastro'.");
	}
}
function handleRegisterSubmit(e) {
	e.preventDefault();
	const name = document.getElementById("reg-name").value.trim();
	const nick = document.getElementById("reg-nickname").value.trim();
	const turma = document.getElementById("reg-turma").value.trim() || "Visitante";
	const email = document.getElementById("reg-email").value.trim().toLowerCase();
	const pass = document.getElementById("reg-password").value.trim();

	const db = getUsersDB();
	if (db.some(u => u.email.toLowerCase() === email || u.nickname.toLowerCase() === nick.toLowerCase())) {
		alert("E-mail ou Nickname já cadastrados! Escolha outro identificador.");
		return;
	}

	const newUser = {
		name: name,
		nickname: nick,
		turma: turma,
		email: email,
		password: pass,
		avatar: selectedAvatarIcon || "👤",
		level: 1,
		xp: 0,
		cash: 0,
		maxWave: 1,
		kills: 0,
		score: 0
	};
	db.push(newUser);
	saveUsersDB(db);
	setCurrentUser(newUser);
	closeModal("modal-auth");
	alert("Conta criada com sucesso! Bem-vindo, " + nick + "!");
}
function handleLogout() {
	if (confirm("Deseja desconectar de sua conta?")) {
		setCurrentUser(null);
		closeModal("modal-profile");
	}
}

// Sincronização em tempo real de estatísticas (XP, recordes, créditos) para a conta logada
window.addEventListener("message", (e) => {
	if (e.data && e.data.type === "SCORE_UPDATE") {
		const u = getCurrentUser();
		if (u) {
			const addedScore = parseInt(e.data.score) || 0;
			u.score = Math.max(u.score || 0, addedScore);
			u.cash = (u.cash || 0) + Math.floor(addedScore / 10);
			u.xp = (u.xp || 0) + Math.floor(addedScore / 5);
			u.level = Math.max(u.level || 1, 1 + Math.floor((u.xp || 0) / 1000));
			if (e.data.game === "zombies") {
				u.maxWave = Math.max(u.maxWave || 1, parseInt(e.data.wave) || 1);
				u.kills = (u.kills || 0) + (parseInt(e.data.kills) || 0);
			}
			setCurrentUser(u);
			const db = getUsersDB();
			const idx = db.findIndex(item => item.email === u.email || item.nickname === u.nickname);
			if (idx !== -1) {
				db[idx] = { ...db[idx], ...u };
				saveUsersDB(db);
			}
		}
	}
});

document.addEventListener("DOMContentLoaded", () => {
	updateUIAfterAuth();
});
updateUIAfterAuth();
</script>
`;

const COMMON_FOOTER = `
	<footer>
		<div class="footer-links">
			<a href="index.html">Início</a>
			<a href="orcamento.html">Serviços & Orçamento</a>
			<a href="jogos.html">Jogos</a>
			<a href="quiz.html">Teste Dev</a>
			<a href="projetos.html">Projetos</a>
			<a href="devchat.html">Conversa Dev</a>
			<a href="sobre.html">Sobre Mim</a>
		</div>
		<p style="font-size: 13px; opacity: 0.8; margin-bottom: 6px;">
			OmniVoid Studios © 2026 • Engenharia de Software, Game Lab & Cibersegurança de Alta Performance
		</p>
		<p style="font-size: 11px; opacity: 0.6;">
			Desenvolvido por <b>Guilherme Mendes (GuiGuy)</b> com dedicação e carinho para <b>Rita</b> • FATEC 2026
		</p>
	</footer>
`;

// ==========================================
// 1. PÁGINA INICIAL (index.html)
// ==========================================
const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>OmniVoid Studios | Software House & Game Lab</title>
	${COMMON_HEAD}
</head>
<body>
	${getNavbar('inicio')}

	<!-- Logo Banner -->
	<div class="logo-hero-container">
		<img src="logo_omnivoid.png" alt="OmniVoid Studios Logo" class="logo-hero-img">
	</div>

	<main class="container">
		<!-- Hero Section -->
		<section class="card" style="text-align: center; padding: 48px 24px; margin-bottom: 30px; background: radial-gradient(circle at center, rgba(0,240,255,0.08) 0%, rgba(21,21,34,0.95) 75%); border: 1.5px solid rgba(0,240,255,0.3); position: relative; overflow: hidden;">
			<div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0,240,255,0.12); border: 1px solid var(--accent-primary); padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 800; color: var(--accent-primary) !important; margin-bottom: 18px; text-transform: uppercase;">
				⚡ Software House • Game Development • Cibersegurança
			</div>

			<h1 style="font-size: clamp(26px, 4vw, 42px); line-height: 1.2; margin-bottom: 16px; text-transform: uppercase;">
				Transformamos Ideias Desafiadoras em <span style="background: linear-gradient(135deg, #00f0ff 0%, #9d4edd 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Softwares de Alta Performance</span>
			</h1>

			<p style="max-width: 860px; margin: 0 auto 28px auto; font-size: 16px; line-height: 1.6; opacity: 0.9;">
				Engenharia de software moderna, jogos 2D/3D imersivos em WebAssembly, plataformas corporativas sob medida e arquiteturas blindadas com foco em confiabilidade, educação tecnológica e segurança ofensiva/defensiva.
			</p>

			<div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
				<a href="orcamento.html" class="btn-primary" style="font-size: 14px; padding: 14px 28px;">
					💼 Fazer Orçamento Online ➔
				</a>
				<a href="jogos.html" class="btn-secondary" style="font-size: 14px; padding: 14px 24px;">
					🎮 Jogar Nossos Jogos
				</a>
				<a href="quiz.html" class="btn-secondary" style="font-size: 14px; padding: 14px 24px;">
					🧠 Teste Vocacional Dev
				</a>
			</div>
		</section>

		<!-- Métricas / Indicadores -->
		<section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 30px;">
			<div class="card" style="text-align: center; padding: 20px;">
				<div style="font-size: 32px; font-family: var(--font-title); font-weight: 800; color: var(--accent-primary) !important;">100%</div>
				<div style="font-size: 13px; font-weight: 700; margin-top: 4px;">WebAssembly & Direct Web</div>
				<div style="font-size: 11px; opacity: 0.7;">Jogos e apps direto no navegador</div>
			</div>
			<div class="card" style="text-align: center; padding: 20px;">
				<div style="font-size: 32px; font-family: var(--font-title); font-weight: 800; color: var(--accent-emerald) !important;">60 FPS</div>
				<div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Realtime Performance</div>
				<div style="font-size: 11px; opacity: 0.7;">Arquitetura sem lag e escalável</div>
			</div>
			<div class="card" style="text-align: center; padding: 20px;">
				<div style="font-size: 32px; font-family: var(--font-title); font-weight: 800; color: var(--accent-gold) !important;">Zero</div>
				<div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Vulnerabilidades Críticas</div>
				<div style="font-size: 11px; opacity: 0.7;">DevSecOps e auditoria rigorosa</div>
			</div>
			<div class="card" style="text-align: center; padding: 20px;">
				<div style="font-size: 32px; font-family: var(--font-title); font-weight: 800; color: var(--accent-purple) !important;">Sob Demanda</div>
				<div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Projetos Customizados</div>
				<div style="font-size: 11px; opacity: 0.7;">Calculadora de orçamento em tempo real</div>
			</div>
		</section>

		<!-- Nossos Serviços e Soluções -->
		<section style="margin-bottom: 35px;">
			<div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
				<div>
					<h2 style="font-size: 22px; margin-bottom: 4px;">💼 Soluções & Serviços de Engenharia</h2>
					<p style="font-size: 14px; opacity: 0.8;">Do conceito e design até a entrega final com suporte e segurança</p>
				</div>
				<a href="orcamento.html" style="color: var(--accent-primary) !important; font-size: 13px; font-weight: 700;">Simular Orçamento Completo ➔</a>
			</div>

			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
				<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-size: 36px; margin-bottom: 12px;">🏢</div>
						<h3 style="font-size: 18px; margin-bottom: 8px;">Plataformas Web & Softwares Corporativos</h3>
						<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
							Sistemas sob medida, painéis administrativos, bancos de dados relacionais e APIs REST/GraphQL de alta vazão construídos com Node.js, Docker e PostgreSQL.
						</p>
					</div>
					<div style="display: flex; gap: 6px; flex-wrap: wrap;">
						<span class="badge">Full-Stack</span>
						<span class="badge">Node.js</span>
						<span class="badge">PostgreSQL</span>
					</div>
				</div>

				<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-size: 36px; margin-bottom: 12px;">🎮</div>
						<h3 style="font-size: 18px; margin-bottom: 8px;">Game Development & Experiências Interativas</h3>
						<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
							Desenvolvimento de jogos 2D/3D no Godot 4, exportação para WebAssembly direta no navegador sem instalação, WebSockets em tempo real e simulações físicas avançadas.
						</p>
					</div>
					<div style="display: flex; gap: 6px; flex-wrap: wrap;">
						<span class="badge">Godot 4</span>
						<span class="badge">WebAssembly</span>
						<span class="badge">WebGL</span>
					</div>
				</div>

				<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-size: 36px; margin-bottom: 12px;">🛡️</div>
						<h3 style="font-size: 18px; margin-bottom: 8px;">Segurança da Informação & DevSecOps</h3>
						<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
							Auditorias de código estático (SAST), testes de intrusão (Pentest), mitigação de riscos OWASP Top 10, criptografia de dados e conformidade estrita de segurança.
						</p>
					</div>
					<div style="display: flex; gap: 6px; flex-wrap: wrap;">
						<span class="badge">Pentest</span>
						<span class="badge">SAST / DAST</span>
						<span class="badge">Hardening</span>
					</div>
				</div>

				<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-size: 36px; margin-bottom: 12px;">⚡</div>
						<h3 style="font-size: 18px; margin-bottom: 8px;">Automação, Bots & Telemetria IoT</h3>
						<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
							Integração de sensores, bots inteligentes de automação de processos, pipelines CI/CD automatizados e monitoramento de servidores 24/7.
						</p>
					</div>
					<div style="display: flex; gap: 6px; flex-wrap: wrap;">
						<span class="badge">Automação</span>
						<span class="badge">IoT</span>
						<span class="badge">CI/CD</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Destaque dos Jogos (Zombies Survive & SkyRush) -->
		<section class="card" style="margin-bottom: 35px; border-color: rgba(157, 78, 221, 0.4); background: linear-gradient(135deg, rgba(16,16,24,0.9) 0%, rgba(26,16,40,0.9) 100%);">
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
				<div>
					<span class="badge" style="background: rgba(157, 78, 221, 0.2); border-color: var(--accent-purple); color: #d8b4fe !important; margin-bottom: 8px;">🎮 GAME LAB OMNIVOID</span>
					<h2 style="font-size: 24px;">Jogos em Destaque no Portal</h2>
				</div>
				<a href="jogos.html" class="btn-primary" style="font-size: 13px; padding: 10px 20px;">
					Ver Hub Completo de Jogos ➔
				</a>
			</div>

			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
				<!-- Card Zombies Survive -->
				<div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
							<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5 !important;">🧟 Godot 4 WebAssembly</span>
							<span style="font-size: 11px; opacity: 0.7;">60 FPS • Fullscreen</span>
						</div>
						<h3 style="font-size: 20px; margin-bottom: 8px; color: #ff0055 !important;">Zombies Survive</h3>
						<p style="font-size: 13px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
							Enfrente hordas implacáveis de mortos-vivos no mapa Polivalente de 10 andares. Gráficos expandidos em tela cheia sem cortes e ranking online liderado por <b>GuiGuy</b> (99.999 pts).
						</p>
					</div>
					<a href="zombiessurvive.html" class="btn-primary" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #ff0055 0%, #9d4edd 100%); font-size: 13px;">
						🧟 Jogar Zombies Survive Agora
					</a>
				</div>

				<!-- Card SkyRush Arcade -->
				<div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
							<span class="badge" style="background: rgba(0, 240, 255, 0.2); color: #7dd3fc !important;">☁️ Solo & Multiplayer</span>
							<span style="font-size: 11px; opacity: 0.7;">Loadout de Armas • Caos Total</span>
						</div>
						<h3 style="font-size: 20px; margin-bottom: 8px; color: #00f0ff !important;">SkyRush Arcade</h3>
						<p style="font-size: 13px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
							Escalada arcade frenética até 8.000m! Escolha seu armamento inicial (Escopeta, AK-47, Pistola, Super Pulo) e sobreviva às anomalias cósmicas e buracos negros aleatórios.
						</p>
					</div>
					<a href="skyrush.html" class="btn-primary" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #00f0ff 0%, #0088ff 100%); font-size: 13px;">
						☁️ Jogar SkyRush Arcade Agora
					</a>
				</div>
			</div>
		</section>

		<!-- Stack Tecnológico -->
		<section class="card" style="margin-bottom: 35px; text-align: center; padding: 30px;">
			<h3 style="font-size: 20px; margin-bottom: 6px;">⚡ Stack de Engenharia & Tecnologias</h3>
			<p style="font-size: 13.5px; opacity: 0.8; margin-bottom: 20px;">Linguagens, ferramentas e frameworks modernos utilizados em nossos desenvolvimentos</p>

			<div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🚀 Godot Engine 4.3</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🌐 WebAssembly (Wasm)</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🟩 Node.js & Express</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🐍 Python & FastApi</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🔷 C# & .NET Core</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🦀 Rust</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🐳 Docker Containers</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🐘 PostgreSQL & Redis</span>
				<span class="badge" style="padding: 8px 14px; font-size: 13px;">🛡️ DevSecOps & Linux Hardening</span>
			</div>
		</section>

		<!-- CTA Final para Orçamento e Apresentação -->
		<section class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 32px; background: linear-gradient(135deg, rgba(0,240,255,0.12) 0%, rgba(157,78,221,0.12) 100%); border-color: var(--accent-primary); flex-wrap: wrap; gap: 20px;">
			<div style="max-width: 750px;">
				<h2 style="font-size: 24px; margin-bottom: 8px;">Precisa de um Projeto de Software, Jogo ou Consultoria?</h2>
				<p style="font-size: 14px; opacity: 0.9; line-height: 1.5;">
					Utilize nossa calculadora interativa para simular valores e prazos em poucos segundos ou entre em contato diretamente com nossa equipe técnica.
				</p>
			</div>
			<div style="display: flex; gap: 12px; flex-wrap: wrap;">
				<a href="orcamento.html" class="btn-primary" style="font-size: 14px; padding: 14px 26px;">
					💼 Fazer Orçamento Agora ➔
				</a>
				<a href="sobre.html" class="btn-secondary" style="font-size: 14px; padding: 14px 22px;">
					👤 Conhecer o Desenvolvedor
				</a>
			</div>
		</section>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}
</body>
</html>`;

// ==========================================
// 2. PÁGINA DE SERVIÇOS & ORÇAMENTO (orcamento.html)
// ==========================================
const orcamentoHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Serviços & Calculadora de Orçamento | OmniVoid Studios</title>
	${COMMON_HEAD}
	<style>
		.budget-layout-grid {
			display: grid;
			grid-template-columns: 1fr 380px;
			gap: 24px;
			align-items: start;
		}
		@media (max-width: 960px) {
			.budget-layout-grid {
				grid-template-columns: 1fr !important;
				display: flex !important;
				flex-direction: column !important;
			}
			.budget-summary-card {
				position: static !important;
				top: auto !important;
				width: 100% !important;
				order: 2 !important;
				margin-top: 10px !important;
			}
			.budget-form-card {
				order: 1 !important;
				width: 100% !important;
			}
		}
	</style>
</head>
<body>
	${getNavbar('orcamento')}

	<main class="container">
		<div style="text-align: center; margin-bottom: 30px;">
			<span class="badge" style="background: rgba(0, 240, 255, 0.15); border-color: var(--accent-primary); color: var(--accent-primary) !important; margin-bottom: 10px;">
				💼 SOLUÇÕES SOB DEMANDA & ESTIMATIVA INSTANTÂNEA
			</span>
			<h1 style="font-size: clamp(24px, 3.5vw, 36px); margin-bottom: 10px;">
				Calculadora Interativa de Orçamentos
			</h1>
			<p style="max-width: 760px; margin: 0 auto; font-size: 15px; opacity: 0.85; line-height: 1.5;">
				Simule o investimento e prazo para o seu software, plataforma corporativa, jogo ou auditoria de segurança. Ajuste os módulos em tempo real e gere uma proposta instantânea.
			</p>
		</div>

		<div class="budget-layout-grid">
			<!-- Formulário da Calculadora -->
			<div class="card budget-form-card" style="padding: 28px;">
				<h2 style="font-size: 18px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; align-items: center; gap: 8px;">
					<span>1.</span> Tipo de Projeto Principal
				</h2>

				<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 26px;">
					<label class="project-type-card" style="background: rgba(0,0,0,0.4); border: 1.5px solid var(--border-bright); border-radius: 10px; padding: 14px; cursor: pointer; display: flex; flex-direction: column; gap: 6px; transition: all 0.2s;">
						<input type="radio" name="projectType" value="web_app" checked onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<b style="font-size: 14px;">🏢 Plataforma Web / SaaS</b>
						<span style="font-size: 11px; opacity: 0.7;">Sistemas corporativos, ERP, CMS e portais sob medida</span>
					</label>

					<label class="project-type-card" style="background: rgba(0,0,0,0.4); border: 1.5px solid var(--border-color); border-radius: 10px; padding: 14px; cursor: pointer; display: flex; flex-direction: column; gap: 6px; transition: all 0.2s;">
						<input type="radio" name="projectType" value="game_dev" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<b style="font-size: 14px;">🎮 Jogo 2D/3D (Godot/Web)</b>
						<span style="font-size: 11px; opacity: 0.7;">Jogos WebAssembly, mobile ou desktop com física e IA</span>
					</label>

					<label class="project-type-card" style="background: rgba(0,0,0,0.4); border: 1.5px solid var(--border-color); border-radius: 10px; padding: 14px; cursor: pointer; display: flex; flex-direction: column; gap: 6px; transition: all 0.2s;">
						<input type="radio" name="projectType" value="security_audit" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<b style="font-size: 14px;">🛡️ Pentest & Auditoria DevSecOps</b>
						<span style="font-size: 11px; opacity: 0.7;">Auditoria estática/dinâmica de vulnerabilidades e hardening</span>
					</label>

					<label class="project-type-card" style="background: rgba(0,0,0,0.4); border: 1.5px solid var(--border-color); border-radius: 10px; padding: 14px; cursor: pointer; display: flex; flex-direction: column; gap: 6px; transition: all 0.2s;">
						<input type="radio" name="projectType" value="automation_api" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<b style="font-size: 14px;">⚡ Automação, Bots & APIs</b>
						<span style="font-size: 11px; opacity: 0.7;">Microserviços, automação de dados e telemetria em tempo real</span>
					</label>
				</div>

				<h2 style="font-size: 18px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; align-items: center; gap: 8px;">
					<span>2.</span> Funcionalidades & Módulos Necessários
				</h2>

				<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 26px;">
					<label style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;">
						<input type="checkbox" id="mod_auth" checked onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<span style="font-size: 13px;">🔐 Autenticação, Perfis & Permissões</span>
					</label>

					<label style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;">
						<input type="checkbox" id="mod_db" checked onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<span style="font-size: 13px;">🐘 Banco de Dados Relacional / Cloud</span>
					</label>

					<label style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;">
						<input type="checkbox" id="mod_admin" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<span style="font-size: 13px;">📊 Painel Administrativo / Dashboard</span>
					</label>

					<label style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;">
						<input type="checkbox" id="mod_realtime" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<span style="font-size: 13px;">⚡ WebSockets / Tempo Real / Multiplayer</span>
					</label>

					<label style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;">
						<input type="checkbox" id="mod_payments" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<span style="font-size: 13px;">💳 Integração de Pagamento / PIX / Stripe</span>
					</label>

					<label style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;">
						<input type="checkbox" id="mod_security" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<span style="font-size: 13px;">🛡️ Auditoria SAST & Hardening de Segurança</span>
					</label>

					<label style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;">
						<input type="checkbox" id="mod_uiux" checked onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<span style="font-size: 13px;">🎨 Design UI/UX Personalizado e Responsivo</span>
					</label>

					<label style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;">
						<input type="checkbox" id="mod_docker" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<span style="font-size: 13px;">🐳 Deploy Docker & Infraestrutura Cloud</span>
					</label>
				</div>

				<h2 style="font-size: 18px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; align-items: center; gap: 8px;">
					<span>3.</span> Nível de Urgência / Prazo
				</h2>

				<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px;">
					<label style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); text-align: center; cursor: pointer;">
						<input type="radio" name="deadline" value="normal" checked onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<div style="font-size: 12px; font-weight: 700; margin-top: 4px;">Padrão</div>
						<div style="font-size: 11px; opacity: 0.7;">30 a 45 dias</div>
					</label>

					<label style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); text-align: center; cursor: pointer;">
						<input type="radio" name="deadline" value="fast" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<div style="font-size: 12px; font-weight: 700; margin-top: 4px;">Acelerado</div>
						<div style="font-size: 11px; opacity: 0.7;">15 a 30 dias</div>
					</label>

					<label style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); text-align: center; cursor: pointer;">
						<input type="radio" name="deadline" value="urgent" onchange="updateBudgetCalculation()" style="accent-color: var(--accent-primary);">
						<div style="font-size: 12px; font-weight: 700; margin-top: 4px;">Urgente / Sprint</div>
						<div style="font-size: 11px; opacity: 0.7;">7 a 14 dias</div>
					</label>
				</div>

				<!-- Caixa de Valor ao Vivo Direto Abaixo das Opções (Perfeita para Mobile!) -->
				<div class="inline-price-display card" style="background: radial-gradient(circle at center, rgba(0, 240, 255, 0.12) 0%, rgba(16, 16, 24, 0.95) 100%); border: 2px solid var(--accent-primary); border-radius: 12px; padding: 18px 20px; margin: 20px 0 24px 0; text-align: center; box-shadow: 0 0 25px rgba(0,240,255,0.2);">
					<div style="font-size: 12px; opacity: 0.85; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">
						💰 VALOR ESTIMADO DO SEU PROJETO (TEMPO REAL):
					</div>
					<div id="inline-calc-price-range" style="font-size: clamp(24px, 4vw, 32px); font-family: var(--font-title); font-weight: 900; color: var(--accent-emerald) !important; margin-bottom: 6px;">
						R$ 2.400 - R$ 3.800
					</div>
					<div style="display: flex; justify-content: center; gap: 14px; font-size: 13px; opacity: 0.9; flex-wrap: wrap;">
						<span id="inline-calc-hours-display">⏱️ ~45 horas de desenvolvimento</span>
						<span id="inline-calc-complexity-badge" class="badge" style="background: rgba(157, 78, 221, 0.25); color: #d8b4fe !important;">Complexidade: Média</span>
					</div>
				</div>

				<h2 style="font-size: 18px; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; align-items: center; gap: 8px;">
					<span>4.</span> Detalhes & Descrição Adicional (Opcional)
				</h2>
				<textarea id="projectNotes" class="input-field" rows="3" placeholder="Descreva regras de negócio específicas, ideias do jogo ou necessidades da sua empresa..." style="resize: vertical;"></textarea>

				<!-- Botões de Ação para Celular / Direto no Formulário -->
				<div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
					<button type="button" class="btn-primary" onclick="sendQuoteWhatsApp()" style="width: 100%; justify-content: center; font-size: 14px; padding: 14px;">
						📱 Enviar Proposta via WhatsApp
					</button>
					<button type="button" class="btn-secondary" onclick="copyQuoteSummary()" style="width: 100%; justify-content: center; font-size: 13px;">
						📋 Copiar Resumo do Orçamento
					</button>
				</div>
			</div>

			<!-- Card Lateral do Resumo do Orçamento -->
			<div class="card budget-summary-card" style="padding: 24px; position: sticky; top: 90px; border-color: var(--accent-primary); background: linear-gradient(180deg, #151522 0%, #101018 100%);">
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
					<span class="badge" style="background: rgba(0, 240, 255, 0.2); color: var(--accent-primary) !important;">RESUMO GERAL</span>
					<span id="calc-complexity-badge" class="badge" style="background: rgba(157, 78, 221, 0.2); color: #d8b4fe !important;">Média</span>
				</div>

				<div style="margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">
					<div style="font-size: 12px; opacity: 0.8; text-transform: uppercase;">Faixa de Investimento Estimada:</div>
					<div id="calc-price-range" style="font-size: 26px; font-family: var(--font-title); font-weight: 800; color: var(--accent-emerald) !important; margin: 4px 0;">
						R$ 2.400 - R$ 3.800
					</div>
					<div id="calc-hours-display" style="font-size: 12px; opacity: 0.75;">
						⏱️ Carga de desenvolvimento: ~45 horas úteis
					</div>
				</div>

				<div style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
					<div style="font-weight: 700; margin-bottom: 6px;">O que está incluso:</div>
					<div style="display: flex; align-items: center; gap: 6px; opacity: 0.9;">✅ Código 100% limpo & documentado</div>
					<div style="display: flex; align-items: center; gap: 6px; opacity: 0.9;">✅ Testes de segurança e validação QA</div>
					<div style="display: flex; align-items: center; gap: 6px; opacity: 0.9;">✅ Suporte e garantia pós-entrega</div>
					<div style="display: flex; align-items: center; gap: 6px; opacity: 0.9;">✅ Repositório Git com versionamento</div>
				</div>

				<div style="display: flex; flex-direction: column; gap: 10px;">
					<button type="button" class="btn-primary" onclick="sendQuoteWhatsApp()" style="width: 100%; justify-content: center; font-size: 13px;">
						📱 Enviar Proposta via WhatsApp
					</button>
					<button type="button" class="btn-secondary" onclick="copyQuoteSummary()" style="width: 100%; justify-content: center; font-size: 13px;">
						📋 Copiar Resumo do Orçamento
					</button>
				</div>
			</div>
		</div>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}

	<script>
		function updateBudgetCalculation() {
			const type = document.querySelector('input[name="projectType"]:checked').value;
			const deadline = document.querySelector('input[name="deadline"]:checked').value;

			let baseHours = 30;
			let baseRate = 60; // R$/hora

			if (type === 'web_app') baseHours = 40;
			else if (type === 'game_dev') baseHours = 55;
			else if (type === 'security_audit') baseHours = 35;
			else if (type === 'automation_api') baseHours = 25;

			const modules = [
				{ id: 'mod_auth', hours: 8 },
				{ id: 'mod_db', hours: 10 },
				{ id: 'mod_admin', hours: 14 },
				{ id: 'mod_realtime', hours: 16 },
				{ id: 'mod_payments', hours: 12 },
				{ id: 'mod_security', hours: 10 },
				{ id: 'mod_uiux', hours: 12 },
				{ id: 'mod_docker', hours: 8 }
			];

			let totalHours = baseHours;
			modules.forEach(m => {
				const el = document.getElementById(m.id);
				if (el && el.checked) {
					totalHours += m.hours;
				}
			});

			let multiplier = 1.0;
			if (deadline === 'fast') multiplier = 1.25;
			if (deadline === 'urgent') multiplier = 1.55;

			const minPrice = Math.round(totalHours * baseRate * multiplier);
			const maxPrice = Math.round(minPrice * 1.35);

			let complexity = "Média";
			if (totalHours < 45) complexity = "Básica";
			else if (totalHours > 80) complexity = "Avançada / Enterprise";

			const priceStr = "R$ " + minPrice.toLocaleString('pt-BR') + " - R$ " + maxPrice.toLocaleString('pt-BR');
			const hoursStr = "⏱️ ~" + totalHours + " horas úteis de desenvolvimento";

			// Update Desktop Sidebar
			const pEl = document.getElementById('calc-price-range');
			const hEl = document.getElementById('calc-hours-display');
			const cEl = document.getElementById('calc-complexity-badge');
			if (pEl) pEl.innerText = priceStr;
			if (hEl) hEl.innerText = hoursStr;
			if (cEl) cEl.innerText = complexity;

			// Update Inline Mobile/Form Banner
			const ipEl = document.getElementById('inline-calc-price-range');
			const ihEl = document.getElementById('inline-calc-hours-display');
			const icEl = document.getElementById('inline-calc-complexity-badge');
			if (ipEl) ipEl.innerText = priceStr;
			if (ihEl) ihEl.innerText = hoursStr;
			if (icEl) icEl.innerText = "Complexidade: " + complexity;
		}

		function getQuoteText() {
			const typeEl = document.querySelector('input[name="projectType"]:checked');
			const deadlineEl = document.querySelector('input[name="deadline"]:checked');
			const notes = document.getElementById('projectNotes').value.trim();
			const priceText = document.getElementById('calc-price-range').innerText;
			const hoursText = document.getElementById('calc-hours-display').innerText;

			const typeNames = {
				'web_app': 'Plataforma Web / SaaS Corporativo',
				'game_dev': 'Jogo 2D/3D Web & Desktop',
				'security_audit': 'Auditoria de Segurança & Pentest',
				'automation_api': 'Automação, Bots & APIs'
			};

			const activeMods = [];
			['mod_auth', 'mod_db', 'mod_admin', 'mod_realtime', 'mod_payments', 'mod_security', 'mod_uiux', 'mod_docker'].forEach(id => {
				const el = document.getElementById(id);
				if (el && el.checked) {
					activeMods.push(el.parentElement.innerText.trim());
				}
			});

			const lines = [
				'*SOLICITAÇÃO DE ORÇAMENTO - OMNIVOID STUDIOS*',
				'',
				'📌 *Tipo de Projeto:* ' + (typeNames[typeEl.value] || 'Personalizado'),
				'⏱️ *Prazo Desejado:* ' + deadlineEl.value.toUpperCase(),
				'💰 *Estimativa Simulada:* ' + priceText + ' (' + hoursText + ')',
				'',
				'🛠️ *Módulos Selecionados:*',
				activeMods.map(m => '- ' + m).join('\\n'),
				'',
				'📝 *Observações:* ' + (notes || 'Nenhuma observação extra.')
			];
			return lines.join('\\n');
		}

		function sendQuoteWhatsApp() {
			const text = encodeURIComponent(getQuoteText());
			window.open('https://wa.me/5511999999999?text=' + text, '_blank');
		}

		function copyQuoteSummary() {
			navigator.clipboard.writeText(getQuoteText()).then(() => {
				alert("Resumo do orçamento copiado para a área de transferência!");
			});
		}

		document.addEventListener('DOMContentLoaded', updateBudgetCalculation);
	</script>
</body>
</html>`;

// ==========================================
// 3. PÁGINA HUB DE JOGOS (jogos.html)
// ==========================================
const jogosHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Hub de Jogos | OmniVoid Studios</title>
	${COMMON_HEAD}
</head>
<body>
	${getNavbar('jogos')}

	<main class="container">
		<div style="text-align: center; margin-bottom: 35px;">
			<span class="badge" style="background: rgba(157, 78, 221, 0.2); border-color: var(--accent-purple); color: #d8b4fe !important; margin-bottom: 10px;">
				🎮 GAME LAB • 100% WEBASSEMBLY NO NAVEGADOR
			</span>
			<h1 style="font-size: clamp(24px, 3.5vw, 38px); margin-bottom: 10px;">
				Escolha seu Jogo & Desafie os Recordes
			</h1>
			<p style="max-width: 760px; margin: 0 auto; font-size: 15px; opacity: 0.85; line-height: 1.5;">
				Jogos criados com motores gráficos de última geração (Godot 4 e Canvas 2D), executados diretamente no seu navegador em tela cheia e sem cortes.
			</p>
		</div>

		<!-- Grid dos Jogos -->
		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 28px; margin-bottom: 40px;">
			<!-- Jogo 1: Zombies Survive -->
			<div class="card" style="display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(255, 0, 85, 0.4); background: linear-gradient(180deg, #151522 0%, #1a0f18 100%);">
				<div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
						<span class="badge" style="background: rgba(255, 0, 85, 0.2); color: #ff0055 !important; border-color: #ff0055;">
							🧟 Godot 4.3 Engine
						</span>
						<span class="badge" style="color: #ffd60a !important;">⭐ #1 GuiGuy (99.999 pts)</span>
					</div>

					<h2 style="font-size: 24px; margin-bottom: 10px; color: #ff0055 !important;">
						Zombies Survive
					</h2>

					<p style="font-size: 14px; line-height: 1.6; opacity: 0.9; margin-bottom: 18px;">
						Sobreviva a ondas apocalípticas no mapa Polivalente de 10 andares. Compre armas na parede, faça barricadas e suba de andar enquanto gerencia munição e hordas vorazes.
					</p>

					<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 20px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
						<div>🎮 <b>Motor:</b> Godot 4 Wasm</div>
						<div>📐 <b>Tela:</b> Expandida Fullscreen</div>
						<div>🎯 <b>Gênero:</b> Survival Shooter</div>
						<div>💾 <b>Save:</b> Recordes Locais</div>
					</div>
				</div>

				<div style="display: flex; flex-direction: column; gap: 10px;">
					<a href="zombiessurvive.html" class="btn-primary" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #ff0055 0%, #9d4edd 100%); font-size: 14px; padding: 14px;">
						🚀 Jogar Zombies Survive
					</a>
				</div>
			</div>

			<!-- Jogo 2: SkyRush Arcade -->
			<div class="card" style="display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(0, 240, 255, 0.4); background: linear-gradient(180deg, #151522 0%, #0d1a24 100%);">
				<div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
						<span class="badge" style="background: rgba(0, 240, 255, 0.2); color: #00f0ff !important; border-color: #00f0ff;">
							☁️ Canvas 2D Physics
						</span>
						<span class="badge" style="color: #00ff88 !important;">⚡ Modo Solo & Multiplayer</span>
					</div>

					<h2 style="font-size: 24px; margin-bottom: 10px; color: #00f0ff !important;">
						SkyRush Arcade
					</h2>

					<p style="font-size: 14px; line-height: 1.6; opacity: 0.9; margin-bottom: 18px;">
						Escalada vertical competitiva com anomalias de mundo aleatórias (chuva de meteoros, buracos negros, matrix e gravidade lunar). Escolha seu equipamento inicial e alcance o topo!
					</p>

					<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 20px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
						<div>🔫 <b>Armas:</b> Escopeta, AK, Pistola</div>
						<div>🌪️ <b>Caos:</b> Mutações Automáticas</div>
						<div>👥 <b>Jogadores:</b> Solo c/ Bots ou Salas</div>
						<div>🏆 <b>Hall da Fama:</b> Online Sync</div>
					</div>
				</div>

				<div style="display: flex; flex-direction: column; gap: 10px;">
					<a href="skyrush.html" class="btn-primary" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #00f0ff 0%, #0088ff 100%); font-size: 14px; padding: 14px;">
						🚀 Jogar SkyRush Arcade
					</a>
				</div>
			</div>
		</div>

		<!-- Hall da Fama / Leaderboard Unificado -->
		<section class="card" style="padding: 28px;">
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
				<div>
					<h3 style="font-size: 20px;">🏆 Hall da Fama OmniVoid</h3>
					<p style="font-size: 13px; opacity: 0.8;">Os maiores recordes registrados no Zombies Survive e SkyRush Arcade</p>
				</div>
				<span class="badge" style="background: rgba(255, 214, 10, 0.2); color: #ffd60a !important;">
					👑 #1 Recordista Oficial: GuiGuy
				</span>
			</div>

			<div style="overflow-x: auto;">
				<table style="width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left;">
					<thead>
						<tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid var(--border-bright);">
							<th style="padding: 10px 14px;">Posição</th>
							<th style="padding: 10px 14px;">Jogador</th>
							<th style="padding: 10px 14px;">Jogo</th>
							<th style="padding: 10px 14px;">Marca / Onda</th>
							<th style="padding: 10px 14px; text-align: right;">Pontuação</th>
						</tr>
					</thead>
					<tbody>
						<tr style="border-bottom: 1px solid var(--border-color); background: rgba(0, 240, 255, 0.05);">
							<td style="padding: 12px 14px; font-weight: 800; color: #ffd60a !important;">🥇 1º</td>
							<td style="padding: 12px 14px; font-weight: 700;">GuiGuy 🧑‍🚀 (Guilherme Mendes)</td>
							<td style="padding: 12px 14px;"><span class="badge" style="background: rgba(255,0,85,0.2); color: #ff0055 !important;">Zombies Survive</span></td>
							<td style="padding: 12px 14px;">Onda 99 (10º Andar)</td>
							<td style="padding: 12px 14px; text-align: right; font-weight: 800; color: #ffd60a !important;">99.999 pts</td>
						</tr>
						<tr style="border-bottom: 1px solid var(--border-color);">
							<td style="padding: 12px 14px; font-weight: 800; color: #e2e8f0 !important;">🥈 2º</td>
							<td style="padding: 12px 14px; font-weight: 700;">GuiGuy 🧑‍🚀 (Guilherme Mendes)</td>
							<td style="padding: 12px 14px;"><span class="badge" style="background: rgba(0,240,255,0.2); color: #00f0ff !important;">SkyRush Arcade</span></td>
							<td style="padding: 12px 14px;">Cume 8.000m (Solo Caos)</td>
							<td style="padding: 12px 14px; text-align: right; font-weight: 800; color: #00f0ff !important;">99.999 pts</td>
						</tr>
						<tr style="border-bottom: 1px solid var(--border-color);">
							<td style="padding: 12px 14px; font-weight: 800; color: #cd7f32 !important;">🥉 3º</td>
							<td style="padding: 12px 14px;">CyberNinja_X</td>
							<td style="padding: 12px 14px;"><span class="badge">Zombies Survive</span></td>
							<td style="padding: 12px 14px;">Onda 24</td>
							<td style="padding: 12px 14px; text-align: right; font-weight: 700;">48.200 pts</td>
						</tr>
						<tr style="border-bottom: 1px solid var(--border-color);">
							<td style="padding: 12px 14px;">4º</td>
							<td style="padding: 12px 14px;">CloudClimber</td>
							<td style="padding: 12px 14px;"><span class="badge">SkyRush Arcade</span></td>
							<td style="padding: 12px 14px;">Altitude 6.420m</td>
							<td style="padding: 12px 14px; text-align: right; font-weight: 700;">32.100 pts</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}
</body>
</html>`;

// ==========================================
// 4. PÁGINA SOBRE MIM & DEDICATÓRIA (sobre.html)
// ==========================================
const sobreHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Sobre Mim & Dedicatória | Guilherme Mendes (GuiGuy)</title>
	${COMMON_HEAD}
</head>
<body>
	${getNavbar('sobre')}

	<main class="container" style="max-width: 1100px;">
		<!-- Hero Perfil -->
		<section class="card" style="padding: 40px; margin-bottom: 30px; background: linear-gradient(135deg, rgba(16,16,24,0.95) 0%, rgba(20,20,35,0.95) 100%); border-color: rgba(0,240,255,0.4);">
			<div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
				<!-- Espaço para Foto de Perfil -->
				<div style="position: relative; margin: 0 auto;">
					<div class="profile-avatar-frame" id="profileImageSlot">
						<span style="font-size: 64px;">🧑‍🚀</span>
					</div>
					<div style="text-align: center; margin-top: 10px;">
						<label for="customPhotoInput" style="font-size: 11px; color: var(--accent-primary) !important; cursor: pointer; text-decoration: underline;">
							📷 Alterar Foto
						</label>
						<input type="file" id="customPhotoInput" accept="image/*" style="display: none;" onchange="handleProfilePhotoUpload(event)">
					</div>
				</div>

				<div style="flex: 1; min-width: 280px;">
					<div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(0,240,255,0.15); border: 1px solid var(--accent-primary); padding: 4px 12px; border-radius: 16px; font-size: 11px; font-weight: 800; color: var(--accent-primary) !important; margin-bottom: 10px;">
						LEAD ENGINEER & GAME DEVELOPER
					</div>
					<h1 style="font-size: clamp(26px, 3.5vw, 36px); margin-bottom: 6px;">Guilherme Mendes</h1>
					<p style="font-size: 15px; color: var(--accent-gold) !important; font-weight: 700; margin-bottom: 16px;">
						Conhecido no mundo dev e gamer como <b>GuiGuy</b>
					</p>
					<p style="font-size: 14.5px; line-height: 1.6; opacity: 0.9; margin-bottom: 18px;">
						Sempre fui apaixonado por criar coisas mais desafiadoras e inovadoras que as outras. Movido pela curiosidade incansável e rigor técnico, tenho como foco o <b>Desenvolvimento de Software de Alta Performance</b>, a <b>Educação Tecnológica</b> para empoderar novos desenvolvedores e a <b>Segurança da Informação</b> para construir arquiteturas confiáveis e resilientes.
					</p>

					<div style="display: flex; gap: 8px; flex-wrap: wrap;">
						<span class="badge">🧠 Engenharia de Software</span>
						<span class="badge">🎮 Godot 4 & Game Dev</span>
						<span class="badge">🛡️ Segurança da Informação</span>
						<span class="badge">🌐 WebAssembly & C#</span>
						<span class="badge">🎓 Educação Tech</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Card de Dedicatória Especial para Rita -->
		<section class="card" style="padding: 36px; margin-bottom: 30px; background: linear-gradient(135deg, rgba(30,15,35,0.95) 0%, rgba(20,15,30,0.95) 100%); border: 2px solid #ffd60a; box-shadow: 0 10px 40px rgba(255, 214, 10, 0.15);">
			<div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
				<div style="font-size: 54px; line-height: 1;">💖</div>
				<div style="flex: 1; min-width: 260px;">
					<h2 style="font-size: 22px; color: #ffd60a !important; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
						Dedicatória Especial de Gratidão & Amor
					</h2>
					<p style="font-size: 15.5px; line-height: 1.7; opacity: 0.95; font-style: italic;">
						"Gostaria de deixar um agradecimento mais do que especial para a minha <b>Rita</b>, que sempre me incentiva, apoia incondicionalmente cada um dos meus passos e acredita nos meus sonhos mesmo nos desafios mais complexos. Este projeto e cada linha de código carregam sua inspiração e carinho."
					</p>
					<div style="margin-top: 12px; font-size: 13px; font-weight: 700; color: #ffd60a !important;">
						— Com todo amor e admiração, Guilherme Mendes (GuiGuy)
					</div>
				</div>
			</div>
		</section>

		<!-- Pilares de Atuação -->
		<section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 35px;">
			<div class="card" style="padding: 24px;">
				<div style="font-size: 32px; margin-bottom: 10px;">💻</div>
				<h3 style="font-size: 18px; margin-bottom: 8px;">Desenvolvimento de Software</h3>
				<p style="font-size: 13.5px; line-height: 1.6; opacity: 0.85;">
					Criação de arquiteturas modulares, microserviços, motores de jogos em WebAssembly e plataformas com altíssima disponibilidade e código limpo.
				</p>
			</div>

			<div class="card" style="padding: 24px;">
				<div style="font-size: 32px; margin-bottom: 10px;">🎓</div>
				<h3 style="font-size: 18px; margin-bottom: 8px;">Educação Tecnológica</h3>
				<p style="font-size: 13.5px; line-height: 1.6; opacity: 0.85;">
					Criação de testes vocacionais, materiais educativos e suporte à comunidade de estudantes para acelerar a entrada de novos talentos no mercado tech.
				</p>
			</div>

			<div class="card" style="padding: 24px;">
				<div style="font-size: 32px; margin-bottom: 10px;">🛡️</div>
				<h3 style="font-size: 18px; margin-bottom: 8px;">Segurança da Informação</h3>
				<p style="font-size: 13.5px; line-height: 1.6; opacity: 0.85;">
					Pesquisa contínua em segurança defensiva e ofensiva, análise de vulnerabilidades em código fonte (SAST) e blindagem de infraestruturas cloud.
				</p>
			</div>
		</section>

		<!-- Contato Direto -->
		<section class="card" style="text-align: center; padding: 32px;">
			<h3 style="font-size: 20px; margin-bottom: 8px;">Vamos Conversar ou Desenvolver Juntos?</h3>
			<p style="font-size: 14px; opacity: 0.85; margin-bottom: 20px;">
				Disponível para projetos corporativos, parcerias de game dev, consultorias e palestras técnicas.
			</p>
			<div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
				<a href="orcamento.html" class="btn-primary" style="font-size: 13px;">
					💼 Fazer um Orçamento ➔
				</a>
				<a href="devchat.html" class="btn-secondary" style="font-size: 13px;">
					💬 Bater Papo na Conversa Dev
				</a>
			</div>
		</section>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}

	<script>
		function handleProfilePhotoUpload(e) {
			const file = e.target.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = function(evt) {
				const base64 = evt.target.result;
				localStorage.setItem('omnivoid_custom_profile_photo', base64);
				renderProfilePhoto();
			};
			reader.readAsDataURL(file);
		}

		function renderProfilePhoto() {
			const slot = document.getElementById('profileImageSlot');
			const saved = localStorage.getItem('omnivoid_custom_profile_photo');
			if (slot) {
				if (saved) {
					slot.innerHTML = \`<img src="\${saved}" class="profile-avatar-img" alt="Guilherme Mendes">\`;
				} else {
					slot.innerHTML = \`<span style="font-size: 64px;">🧑‍🚀</span>\`;
				}
			}
		}

		document.addEventListener('DOMContentLoaded', renderProfilePhoto);
	</script>
</body>
</html>`;

// ==========================================
// 5. PÁGINA DO QUIZ / TESTE DEV (quiz.html)
// ==========================================
// Let's import or define the full quiz page
const quizHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Teste Dev & Orientação Vocacional | OmniVoid Studios</title>
	${COMMON_HEAD}
</head>
<body>
	${getNavbar('quiz')}

	<main class="container" style="max-width: 1000px;">
		<div style="text-align: center; margin-bottom: 30px;">
			<span class="badge" style="background: rgba(0, 240, 255, 0.15); border-color: var(--accent-primary); color: var(--accent-primary) !important; margin-bottom: 10px;">
				🧠 ORIENTAÇÃO VOCACIONAL & QUIZ TECNOLÓGICO
			</span>
			<h1 style="font-size: clamp(24px, 3.5vw, 36px); margin-bottom: 10px;">
				Descubra sua Linguagem de Programação Ideal
			</h1>
			<p style="max-width: 720px; margin: 0 auto; font-size: 15px; opacity: 0.85; line-height: 1.5;">
				Responda ao teste baseado nos seus interesses e descubra a linguagem que mais combina com você, acompanhada de curiosidades fascinantes de cada ecossistema.
			</p>
		</div>

		<!-- Quiz Container Card -->
		<div id="quiz-box" class="card" style="padding: 32px; margin-bottom: 30px;">
			<div id="quiz-progress-bar" style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 24px; overflow: hidden;">
				<div id="quiz-progress-fill" style="width: 16%; height: 100%; background: linear-gradient(90deg, #00f0ff, #9d4edd); transition: width 0.3s ease;"></div>
			</div>

			<div id="quiz-question-container">
				<!-- Injetado dinamicamente via JS -->
			</div>
		</div>

		<!-- Resultado do Quiz (Oculto inicialmente) -->
		<div id="quiz-result-box" class="card" style="display: none; padding: 36px; border-color: var(--accent-primary); margin-bottom: 30px;">
			<!-- Injetado dinamicamente via JS -->
		</div>

		<!-- Catálogo com Curiosidades das 12 Linguagens -->
		<section class="card" style="padding: 28px;">
			<h2 style="font-size: 20px; margin-bottom: 8px;">📚 Curiosidades de 12 Grandes Linguagens de Programação</h2>
			<p style="font-size: 13.5px; opacity: 0.8; margin-bottom: 24px;">Fatos históricos, arquiteturas e curiosidades para expandir seu repertório técnico.</p>

			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
				<div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px;">
					<b style="color: #ffd60a !important; font-size: 15px;">🐍 Python</b>
					<p style="font-size: 12.5px; line-height: 1.5; opacity: 0.85; margin-top: 6px;">
						O nome não veio da serpente, mas sim do grupo de humor britânico <i>Monty Python</i>! Criada por Guido van Rossum em 1991 como projeto de férias de Natal.
					</p>
				</div>

				<div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px;">
					<b style="color: #00f0ff !important; font-size: 15px;">🌐 JavaScript</b>
					<p style="font-size: 12.5px; line-height: 1.5; opacity: 0.85; margin-top: 6px;">
						Foi criada em apenas <b>10 dias</b> por Brendan Eich na Netscape em 1995. Hoje roda desde o navegador até foguetes espaciais e servidores com Node.js.
					</p>
				</div>

				<div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px;">
					<b style="color: #ff0055 !important; font-size: 15px;">🦀 Rust</b>
					<p style="font-size: 12.5px; line-height: 1.5; opacity: 0.85; margin-top: 6px;">
						Criada por Graydon Hoare após o elevador do seu prédio quebrar constantemente por bugs de memória em C++. Rust garante segurança de memória sem garbage collector!
					</p>
				</div>

				<div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px;">
					<b style="color: #9d4edd !important; font-size: 15px;">🎮 GDScript & C#</b>
					<p style="font-size: 12.5px; line-height: 1.5; opacity: 0.85; margin-top: 6px;">
						GDScript foi desenhada sob medida para a Godot Engine, otimizada para compilação instantânea e manipulação fluida de nós e vetores matemáticos.
					</p>
				</div>

				<div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px;">
					<b style="color: #00ff88 !important; font-size: 15px;">⚡ Go (Golang)</b>
					<p style="font-size: 12.5px; line-height: 1.5; opacity: 0.85; margin-top: 6px;">
						Desenvolvida no Google por lendas da computação (Ken Thompson e Rob Pike) enquanto esperavam compilações gigantescas de C++ terminarem.
					</p>
				</div>

				<div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px;">
					<b style="color: #38bdf8 !important; font-size: 15px;">⚙️ C / C++</b>
					<p style="font-size: 12.5px; line-height: 1.5; opacity: 0.85; margin-top: 6px;">
						A espinha dorsal de quase todos os sistemas operacionais (Windows, Linux, macOS), navegadores e engines de jogos AAA (Unreal Engine).
					</p>
				</div>
			</div>
		</section>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}

	<script>
		const quizData = [
			{
				q: "1. O que mais te desperta interesse ao pensar em tecnologia?",
				options: [
					{ text: "Criar jogos 2D/3D envolventes com física e jogabilidade épica", lang: "GDScript / C#" },
					{ text: "Construir sites, portais visuais dinâmicos e apps modernos", lang: "JavaScript / TypeScript" },
					{ text: "Inteligência Artificial, Data Science e automações inteligentes", lang: "Python" },
					{ text: "Segurança cibernética, sistemas de baixo nível e máxima velocidade", lang: "Rust / C++" }
				]
			},
			{
				q: "2. Como você prefere que seu código seja estruturado?",
				options: [
					{ text: "Sintaxe super limpa e legível que parece inglês falado", lang: "Python" },
					{ text: "Orientação a objetos robusta com tipagem forte e segura", lang: "C# / Java" },
					{ text: "Flexibilidade total para prototipar rápido e ver na tela", lang: "JavaScript" },
					{ text: "Controle estrito de memória e compilador que previne falhas", lang: "Rust" }
				]
			},
			{
				q: "3. Qual desafio de engenharia parece mais empolgante para você?",
				options: [
					{ text: "Otimizar uma renderização de gráficos a 60 FPS", lang: "C++ / GDScript" },
					{ text: "Treinar um modelo neural para reconhecer padrões complexos", lang: "Python" },
					{ text: "Conectar milhares de usuários simultâneos em tempo real", lang: "Go / Node.js" },
					{ text: "Encontrar e fechar brechas de segurança antes dos hackers", lang: "Rust / C" }
				]
			},
			{
				q: "4. Onde você sonha em ver seu software rodando?",
				options: [
					{ text: "Direto no navegador de qualquer pessoa no mundo sem instalar nada", lang: "JavaScript / WebAssembly" },
					{ text: "Nas lojas Steam, consoles e dispositivos móveis", lang: "C# / GDScript" },
					{ text: "Em supercomputadores de nuvem e servidores de alta escala", lang: "Go / Python" },
					{ text: "Em sistemas embarcados, satélites ou sistemas operacionais", lang: "Rust / C++" }
				]
			}
		];

		let currentQ = 0;
		const answers = [];

		function renderQuestion() {
			const container = document.getElementById('quiz-question-container');
			const progressFill = document.getElementById('quiz-progress-fill');
			if (!container) return;

			const total = quizData.length;
			const percent = ((currentQ + 1) / total) * 100;
			if (progressFill) progressFill.style.width = percent + '%';

			const q = quizData[currentQ];
			let html = \`
				<h2 style="font-size: 20px; margin-bottom: 20px;">\${q.q}</h2>
				<div style="display: flex; flex-direction: column; gap: 12px;">
			\`;

			q.options.forEach((opt, idx) => {
				html += \`
					<button class="btn-secondary" onclick="handleAnswer('\${opt.lang}')" style="justify-content: flex-start; text-align: left; padding: 14px 20px; font-size: 14px; font-weight: 600; line-height: 1.4;">
						\${opt.text}
					</button>
				\`;
			});

			html += '</div>';
			container.innerHTML = html;
		}

		function handleAnswer(lang) {
			answers.push(lang);
			currentQ++;
			if (currentQ < quizData.length) {
				renderQuestion();
			} else {
				showQuizResult();
			}
		}

		function showQuizResult() {
			document.getElementById('quiz-box').style.display = 'none';
			const resBox = document.getElementById('quiz-result-box');
			resBox.style.display = 'block';

			// Calculate primary language
			const counts = {};
			answers.forEach(a => counts[a] = (counts[a] || 0) + 1);
			const topLang = Object.keys(counts).sort((a,b) => counts[b] - counts[a])[0] || "Python / JavaScript";

			resBox.innerHTML = \`
				<div style="text-align: center;">
					<span class="badge" style="background: rgba(0, 240, 255, 0.2); color: var(--accent-primary) !important; font-size: 13px; margin-bottom: 12px;">
						🎉 SEU RESULTADO VOCACIONAL
					</span>
					<h2 style="font-size: 28px; margin-bottom: 12px; color: var(--accent-primary) !important;">
						Sua Linguagem Ideal: \${topLang}
					</h2>
					<p style="max-width: 680px; margin: 0 auto 24px auto; font-size: 15px; line-height: 1.6; opacity: 0.9;">
						Com base nas suas preferências, seu perfil tem forte sinergia com o ecossistema <b>\${topLang}</b>. Esta tecnologia lhe proporcionará as melhores ferramentas para construir os projetos que você mais ama!
					</p>

					<div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
						<a href="orcamento.html" class="btn-primary" style="font-size: 13px;">
							💼 Criar Projeto com essa Stack ➔
						</a>
						<button class="btn-secondary" onclick="location.reload()" style="font-size: 13px;">
							🔄 Refazer o Teste
						</button>
					</div>
				</div>
			\`;
		}

		document.addEventListener('DOMContentLoaded', renderQuestion);
	</script>
</body>
</html>`;

// ==========================================
// 6. PÁGINA DE PROJETOS (projetos.html)
// ==========================================
const projetosHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Projetos & Portfólio | OmniVoid Studios</title>
	${COMMON_HEAD}
</head>
<body>
	${getNavbar('projetos')}

	<main class="container">
		<div style="text-align: center; margin-bottom: 35px;">
			<span class="badge" style="background: rgba(0, 240, 255, 0.15); border-color: var(--accent-primary); color: var(--accent-primary) !important; margin-bottom: 10px;">
				🚀 PORTFÓLIO TÉCNICO & INOVAÇÃO
			</span>
			<h1 style="font-size: clamp(24px, 3.5vw, 36px); margin-bottom: 10px;">
				Projetos Desenvolvidos & Em Produção
			</h1>
			<p style="max-width: 760px; margin: 0 auto; font-size: 15px; opacity: 0.85; line-height: 1.5;">
				Conheça alguns dos softwares, engines, simuladores e plataformas construídos com as melhores práticas de engenharia de software e cibersegurança.
			</p>
		</div>

		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 35px;">
			<!-- Projeto 1: Zombies Survive -->
			<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
				<div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(0, 255, 136, 0.2); color: #00ff88 !important;">🟢 Live em Produção</span>
						<span class="badge">Godot 4 Wasm</span>
					</div>
					<h3 style="font-size: 20px; margin-bottom: 8px; color: #ff0055 !important;">Zombies Survive</h3>
					<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
						Jogo de tiro e sobrevivência zumbi com mapa Polivalente de 10 andares. Gráficos expandidos sem tarjas pretas e WebAssembly nativo rodando a 60 FPS.
					</p>
				</div>
				<a href="zombiessurvive.html" class="btn-primary" style="justify-content: center; font-size: 13px;">
					Jogar Agora ➔
				</a>
			</div>

			<!-- Projeto 2: SkyRush Arcade -->
			<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
				<div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(0, 255, 136, 0.2); color: #00ff88 !important;">🟢 Live em Produção</span>
						<span class="badge">Realtime Physics</span>
					</div>
					<h3 style="font-size: 20px; margin-bottom: 8px; color: #00f0ff !important;">SkyRush Arcade</h3>
					<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
						Engine física vetorial de escalada vertical com loadouts de armas, mutações climáticas dinâmicas, anomalias cósmicas e ranking sincronizado online.
					</p>
				</div>
				<a href="skyrush.html" class="btn-primary" style="justify-content: center; font-size: 13px;">
					Jogar Agora ➔
				</a>
			</div>

			<!-- Projeto 3: DevGuard SAST Scanner -->
			<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
				<div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(157, 78, 221, 0.2); color: #d8b4fe !important;">⚡ Versão Beta</span>
						<span class="badge">Python & Rust</span>
					</div>
					<h3 style="font-size: 20px; margin-bottom: 8px;">DevGuard SAST Scanner</h3>
					<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
						Ferramenta de análise estática de segurança que inspeciona repositórios Git em busca de segredos vazados, injeções SQL e vulnerabilidades OWASP Top 10.
					</p>
				</div>
				<a href="orcamento.html" class="btn-secondary" style="justify-content: center; font-size: 13px;">
					Solicitar Demonstração
				</a>
			</div>

			<!-- Projeto 4: OmniVoid Serverless Relay -->
			<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
				<div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(0, 240, 255, 0.2); color: #7dd3fc !important;">⚙️ Em Desenvolvimento</span>
						<span class="badge">Node.js & WSS</span>
					</div>
					<h3 style="font-size: 20px; margin-bottom: 8px;">OmniVoid Serverless Relay</h3>
					<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
						Hub de comunicação e roteamento WebSocket de baixíssima latência para sincronização de estados de jogos e eventos em tempo real.
					</p>
				</div>
				<a href="orcamento.html" class="btn-secondary" style="justify-content: center; font-size: 13px;">
					Ver Arquitetura
				</a>
			</div>

			<!-- Projeto 5: CyberSim Virtual Range -->
			<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
				<div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(255, 214, 10, 0.2); color: #ffd60a !important;">🧪 Lab Educacional</span>
						<span class="badge">Docker & Linux</span>
					</div>
					<h3 style="font-size: 20px; margin-bottom: 8px;">CyberSim Virtual Range</h3>
					<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
						Ambiente interativo de simulação para alunos e profissionais treinarem defesa de redes, análise forense de logs e resposta a incidentes de segurança.
					</p>
				</div>
				<a href="devchat.html" class="btn-secondary" style="justify-content: center; font-size: 13px;">
					Discutir no Fórum
				</a>
			</div>

			<!-- Projeto 6: SmartCampus IoT Telemetry -->
			<div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
				<div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span class="badge" style="background: rgba(0, 255, 136, 0.2); color: #00ff88 !important;">🟢 Concluído</span>
						<span class="badge">IoT & MQTT</span>
					</div>
					<h3 style="font-size: 20px; margin-bottom: 8px;">SmartCampus IoT Telemetry</h3>
					<p style="font-size: 13.5px; line-height: 1.5; opacity: 0.85; margin-bottom: 16px;">
						Painel de telemetria em tempo real para coleta e visualização de consumo de energia, ocupação de salas e métricas ambientais de sensores.
					</p>
				</div>
				<a href="orcamento.html" class="btn-secondary" style="justify-content: center; font-size: 13px;">
					Ver Detalhes
				</a>
			</div>
		</div>
	</main>

	${COMMON_AUTH_MODALS}
	${COMMON_FOOTER}
	${COMMON_AUTH_JS}
</body>
</html>`;

// ==========================================
// 7. PÁGINA CONVERSA DEV (devchat.html)
// ==========================================
const devchatHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Conversa Dev • Fórum & Chat | OmniVoid Studios</title>
	${COMMON_HEAD}
	<style>
		.chat-channel-btn {
			width: 100%;
			text-align: left;
			padding: 10px 14px;
			border-radius: 8px;
			background: transparent;
			border: 1px solid transparent;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 13px;
			font-weight: 600;
			transition: all 0.2s;
			color: #ffffff !important;
		}
		.chat-channel-btn:hover {
			background: rgba(255,255,255,0.06);
			border-color: rgba(255,255,255,0.15);
		}
		.chat-channel-btn.active {
			background: linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%);
			border-color: var(--accent-primary);
		}
		.message-bubble {
			background: rgba(255,255,255,0.04);
			border: 1px solid var(--border-color);
			border-radius: 10px;
			padding: 12px 16px;
			margin-bottom: 10px;
		}
	</style>
</head>
<body>
	${getNavbar('devchat')}

	<main class="container">
		<div style="text-align: center; margin-bottom: 24px;">
			<span class="badge" style="background: rgba(0, 240, 255, 0.15); border-color: var(--accent-primary); color: var(--accent-primary) !important; margin-bottom: 8px;">
				💬 COMUNIDADE DE DESENVOLVEDORES & ALUNOS
			</span>
			<h1 style="font-size: clamp(22px, 3.5vw, 32px);">
				Conversa Dev • Networking & Dúvidas Técnicas
			</h1>
		</div>

		<div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px; min-height: 580px;">
			<!-- Canais Laterais -->
			<div class="card" style="padding: 16px;">
				<div style="font-size: 11px; font-weight: 800; opacity: 0.7; text-transform: uppercase; margin-bottom: 12px;">Canais da Comunidade</div>

				<div style="display: flex; flex-direction: column; gap: 6px;">
					<button class="chat-channel-btn active" onclick="switchChannel('geral')">
						<span>💬 #geral</span>
						<span class="badge" style="font-size: 10px;">Principal</span>
					</button>
					<button class="chat-channel-btn" onclick="switchChannel('zombies-survive')">
						<span>🧟 #zombies-survive</span>
						<span class="badge" style="font-size: 10px;">Godot 4</span>
					</button>
					<button class="chat-channel-btn" onclick="switchChannel('skyrush')">
						<span>☁️ #skyrush</span>
						<span class="badge" style="font-size: 10px;">Arcade</span>
					</button>
					<button class="chat-channel-btn" onclick="switchChannel('dicas-programacao')">
						<span>🧠 #dicas-dev</span>
						<span class="badge" style="font-size: 10px;">Quiz</span>
					</button>
					<button class="chat-channel-btn" onclick="switchChannel('showcase')">
						<span>🚀 #projetos-alunos</span>
						<span class="badge" style="font-size: 10px;">Showcase</span>
					</button>
				</div>
			</div>

			<!-- Feed de Mensagens -->
			<div class="card" style="display: flex; flex-direction: column; padding: 20px;">
				<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 16px;">
					<h3 id="current-channel-title" style="font-size: 17px;">💬 #geral - Bate-papo Geral da Comunidade</h3>
					<span class="badge" id="online-counter">🟢 Comunidade Online</span>
				</div>

				<div id="messages-container" style="flex: 1; max-height: 480px; overflow-y: auto; padding-right: 8px; margin-bottom: 16px;"></div>

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
				{ author: 'GuiGuy (Guilherme Mendes)', avatar: '🧑‍🚀', turma: 'Criador & Admin', time: '18:30', text: 'Fala pessoal! Sejam muito bem-vindos ao portal reestruturado da OmniVoid Studios! Agora temos simulador de orçamentos, hub centralizado de jogos e área Sobre Mim.' },
				{ author: 'Lucas_Coder', avatar: '🥷', turma: 'ADS 3º Sem', time: '18:42', text: 'A calculadora de orçamento em tempo real ficou excelente!' }
			],
			'zombies-survive': [
				{ author: 'GuiGuy (Guilherme Mendes)', avatar: '🧑‍🚀', turma: 'Criador & Admin', time: '17:15', text: 'Zombies Survive com mapa Polivalente de 10 andares rodando em resolução expandida e WebAssembly direto no navegador!' },
				{ author: 'Valkyrie_X', avatar: '🧙‍♂️', turma: 'Ciência Comp.', time: '18:10', text: 'A pontuação de 99999 do GuiGuy tá insana! Vou tentar alcançar no 10º andar.' }
			],
			'skyrush': [
				{ author: 'GuiGuy (Guilherme Mendes)', avatar: '🧑‍🚀', turma: 'Criador & Admin', time: '16:00', text: 'SkyRush Arcade com física de vôo supersônico, loadouts de armas e modo solo com caos automático!' }
			],
			'dicas-programacao': [
				{ author: 'GuiGuy (Guilherme Mendes)', avatar: '🧑‍🚀', turma: 'Criador & Admin', time: '15:20', text: 'Dica do dia: no Godot 4, utilize viewport stretch mode como canvas_items e aspect como expand para telas responsivas sem letterboxing.' }
			],
			'showcase': [
				{ author: 'Dev_Iniciante', avatar: '👾', turma: 'ADS 1º Sem', time: '14:50', text: 'Fiz o teste de programação e adorei a lista de curiosidades das 12 linguagens!' }
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
				'dicas-programacao': '🧠 #dicas-dev - Tutoriais & Quiz',
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

			const loggedUser = getCurrentUser();
			let authorName = '';
			let avatarIcon = '👤';
			let userTurma = 'Visitante';

			if (loggedUser && loggedUser.nickname) {
				authorName = loggedUser.nickname;
				avatarIcon = loggedUser.avatar || '🧑‍🚀';
				userTurma = loggedUser.turma || 'Membro';
			} else {
				let guestName = localStorage.getItem("omnivoid_guest_nick");
				if (!guestName) {
					guestName = 'Convidado_' + Math.floor(Math.random() * 899 + 100);
					localStorage.setItem("omnivoid_guest_nick", guestName);
				}
				authorName = guestName;
				avatarIcon = '👤';
				userTurma = 'Visitante';
			}

			const now = new Date();
			const timeStr = \`\${String(now.getHours()).padStart(2, '0')}:\${String(now.getMinutes()).padStart(2, '0')}\`;

			const msgs = getChannelMessages(currentChannel);
			msgs.push({
				author: authorName,
				avatar: avatarIcon,
				turma: userTurma,
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

// ==========================================
// 8. GAME RUNNERS (zombiessurvive.html & skyrush.html)
// ==========================================
const zombiesHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>Zombies Survive | OmniVoid Studios</title>
	${COMMON_HEAD}
	<style>
		body {
			background: #000000;
			overflow: hidden;
			width: 100vw;
			height: 100vh;
			display: flex;
			flex-direction: column;
		}
		#canvas-wrapper {
			position: relative;
			flex: 1;
			width: 100vw;
			height: calc(100vh - 65px);
			background: #000000;
			overflow: hidden;
		}
		#canvas {
			display: block;
			width: 100% !important;
			height: 100% !important;
			position: absolute;
			top: 0;
			left: 0;
			outline: none;
		}
		#status-overlay {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: rgba(16, 16, 24, 0.95);
			border: 1.5px solid var(--accent-primary);
			border-radius: 16px;
			padding: 30px;
			text-align: center;
			z-index: 100;
			max-width: 440px;
			box-shadow: 0 0 30px rgba(0, 240, 255, 0.3);
		}
		.spinner {
			width: 40px;
			height: 40px;
			border: 4px solid rgba(255,255,255,0.1);
			border-top-color: var(--accent-primary);
			border-radius: 50%;
			animation: spin 0.8s linear infinite;
			margin: 0 auto 16px auto;
		}
		@keyframes spin {
			to { transform: rotate(360deg); }
		}
	</style>
</head>
<body>
	${getNavbar('jogos')}

	<div id="canvas-wrapper">
		<canvas id="canvas"></canvas>

		<div id="status-overlay">
			<div class="spinner"></div>
			<h3 style="font-size: 18px; margin-bottom: 8px;">Carregando Zombies Survive...</h3>
			<p id="status-text" style="font-size: 12.5px; opacity: 0.8;">Iniciando WebAssembly e carregando o mapa Polivalente...</p>
		</div>
	</div>

	${COMMON_AUTH_MODALS}
	${COMMON_AUTH_JS}

	<script src="index.js"></script>
	<script>
		const GODOT_CONFIG = {
			"args": [],
			"canvasResizePolicy": 2,
			"ensureCrossOriginIsolationHeaders": true,
			"executable": "index",
			"experimentalVK": false,
			"fileSizes": { "index.pck": 187777864, "index.wasm": 39514754 },
			"focusCanvas": true,
			"gdextensionLibs": []
		};

		const engine = new Engine(GODOT_CONFIG);

		(function() {
			const statusOverlay = document.getElementById('status-overlay');
			const statusText = document.getElementById('status-text');

			async function loadPckParts() {
				const parts = ['index.pck.part0', 'index.pck.part1', 'index.pck.part2', 'index.pck.part3'];
				const totalBytes = 187777864;
				let loadedBytes = 0;
				const chunks = [];

				for (let i = 0; i < parts.length; i++) {
					statusText.innerText = \`Baixando recursos (\${i + 1}/\${parts.length})...\`;
					const resp = await fetch(parts[i]);
					if (!resp.ok) throw new Error(\`Erro ao baixar \${parts[i]}\`);
					const reader = resp.body.getReader();
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						chunks.push(value);
						loadedBytes += value.length;
						const pct = Math.min(100, Math.round((loadedBytes / totalBytes) * 100));
						statusText.innerText = \`Carregando texturas e áudio: \${pct}%\`;
					}
				}

				const combined = new Uint8Array(loadedBytes);
				let offset = 0;
				for (const chunk of chunks) {
					combined.set(chunk, offset);
					offset += chunk.length;
				}
				return combined.buffer;
			}

			loadPckParts().then(pckBuffer => {
				statusText.innerText = 'Inicializando Godot Engine 4.3...';
				return engine.init().then(() => {
					engine.copyToFS('/index.pck', pckBuffer);
					return engine.start({ args: ['--main-pack', '/index.pck'] });
				});
			}).then(() => {
				if (statusOverlay) statusOverlay.style.display = 'none';
			}).catch(err => {
				console.error(err);
				statusText.innerText = 'Erro ao inicializar o jogo: ' + err.message;
			});
		})();
	</script>
</body>
</html>`;

const skyrushHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<title>SkyRush Arcade | OmniVoid Studios</title>
	${COMMON_HEAD}
	<style>
		body {
			background: #000000;
			overflow: hidden;
			width: 100vw;
			height: 100vh;
			display: flex;
			flex-direction: column;
		}
		#game-frame-container {
			flex: 1;
			width: 100vw;
			height: calc(100vh - 65px);
			border: none;
			background: #000000;
		}
	</style>
</head>
<body>
	${getNavbar('jogos')}

	<iframe id="game-frame-container" src="skyrush/index.html" allow="autoplay; fullscreen"></iframe>

	${COMMON_AUTH_MODALS}
	${COMMON_AUTH_JS}
</body>
</html>`;

const fateccaosHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta http-equiv="refresh" content="0; URL='zombiessurvive.html'" />
	<title>Redirecionando para Zombies Survive...</title>
</head>
<body>
	<p>Redirecionando para <a href="zombiessurvive.html">Zombies Survive</a>...</p>
</body>
</html>`;

// ==========================================
// GRAVAÇÃO DE ARQUIVOS NOS DESTINOS
// ==========================================
const pages = {
	'index.html': indexHtml,
	'orcamento.html': orcamentoHtml,
	'jogos.html': jogosHtml,
	'quiz.html': quizHtml,
	'projetos.html': projetosHtml,
	'devchat.html': devchatHtml,
	'sobre.html': sobreHtml,
	'zombiessurvive.html': zombiesHtml,
	'skyrush.html': skyrushHtml,
	'fateccaos.html': fateccaosHtml
};

for (const targetDir of [DOCS_DIR, PUBLIC_DIR]) {
	fs.mkdirSync(targetDir, { recursive: true });
	for (const [filename, content] of Object.entries(pages)) {
		const filePath = path.join(targetDir, filename);
		fs.writeFileSync(filePath, content, 'utf-8');
		console.log(`[OK] Generated ${filePath}`);
	}
}

console.log('\nAll pages successfully built and synchronized in docs/ and public/!');
