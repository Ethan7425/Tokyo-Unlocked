import { auth } from './auth.js';
import { ui } from './ui.js';
import { logger } from './logger.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  await auth.init();
  if (auth.isLoggedIn()) ui.showScreen('home');
  else ui.showScreen('login');

  setupEventListeners();
  logger.log('App initialized');
}

function setupEventListeners() {
  // Login form
  const form = document.getElementById('login-form');
  form?.addEventListener('submit', onSubmit);

  // Logout buttons
  document.getElementById('logout-btn')?.addEventListener('click', onLogout);
  document.getElementById('profile-logout-btn')?.addEventListener('click', onLogout);

  const deleteBtn = document.getElementById('delete-account-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const result = await auth.deleteAccount();
      if (result.success) ui.showScreen('login');
      else if (!result.cancelled) alert(result.error || 'Failed to delete account');
  });
}


  // Menu navigation (Play / Profile)
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const screenName = e.currentTarget.dataset.screen;
      if (screenName) ui.showScreen(screenName);
    });
  });

  // Back buttons
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const screenName = e.currentTarget.dataset.screen;
      if (screenName) ui.showScreen(screenName);
    });
  });
}

async function onSubmit(e) {
  e.preventDefault();
  const nickname = document.getElementById('nickname')?.value || '';
  const pin = document.getElementById('pin')?.value || '';

  const res = await auth.loginOrCreate(nickname, pin);
  console.log('Auth result:', res);

  if (res.success) {
    ui.showScreen('home');
    e.currentTarget.reset();
  } else {
    alert(res.error || 'Login failed');
  }
}

function onLogout() {
  const out = auth.logout();
  if (out.success) ui.showScreen('login');
  else alert(out.error || 'Failed to logout');
}
