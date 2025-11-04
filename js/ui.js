import { auth } from './auth.js';
import { logger } from './logger.js';
import { chapters } from './chapters.js';

export const ui = {
  currentScreen: 'login',
  currentChapterId: null,

  showScreen(screenName) {
    try {
      if (screenName !== 'login' && !auth.isLoggedIn()) {
        logger.warn('Attempted to access protected screen without login');
        this.showScreen('login');
        return;
      }

      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });

      const targetScreen = document.getElementById(`${screenName}-screen`);
      if (targetScreen) {
        targetScreen.classList.add('active');
        this.currentScreen = screenName;
        logger.log('Screen changed to', screenName);

        if (screenName === 'home') {
          this.updateHomeScreen();
        } else if (screenName === 'profile') {
          this.updateProfileScreen();
        } else if (screenName === 'play') {
          this.renderChapters();
        }
      }
    } catch (error) {
      logger.sendError('Failed to show screen', { screenName, error: error.message });
    }
  },

  updateHomeScreen() {
    const welcomeNickname = document.getElementById('welcome-nickname');
    if (welcomeNickname && auth.currentUser) {
      welcomeNickname.textContent = auth.currentUser.nickname;
    }
  },

  updateProfileScreen() {
    if (!auth.currentUser) return;

    const user = auth.currentUser;

    const avatarInitial = document.getElementById('avatar-initial');
    if (avatarInitial) {
      avatarInitial.textContent = user.nickname.charAt(0).toUpperCase();
    }

    const avatarDisplay = document.getElementById('avatar-display');
    if (avatarDisplay && user.avatar) {
      avatarDisplay.innerHTML = `<img src="${user.avatar}" alt="Avatar" />`;
    }

    const profileNickname = document.getElementById('profile-nickname');
    if (profileNickname) {
      profileNickname.textContent = user.nickname;
    }

    const joinedDate = document.getElementById('joined-date');
    if (joinedDate) {
      const date = new Date(user.joinedAt);
      joinedDate.textContent = date.toLocaleDateString();
    }

    const statChapters = document.getElementById('stat-chapters');
    if (statChapters) {
      statChapters.textContent = user.progress.chaptersCompleted || 0;
    }

    const statPuzzles = document.getElementById('stat-puzzles');
    if (statPuzzles) {
      statPuzzles.textContent = user.progress.puzzlesSolved || 0;
    }

    const statTime = document.getElementById('stat-time');
    if (statTime) {
      const hours = Math.floor((user.progress.totalTimePlayed || 0) / 60);
      const minutes = (user.progress.totalTimePlayed || 0) % 60;
      statTime.textContent = `${hours}h ${minutes}m`;
    }

    const statScore = document.getElementById('stat-score');
    if (statScore) {
      statScore.textContent = user.progress.bestScore || 0;
    }
  },

  renderChapters() {
    const grid = document.getElementById('chapters-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const availableChapters = chapters.getAvailableChapters();

    availableChapters.forEach(chapter => {
      const card = document.createElement('div');
      card.className = `chapter-card ${!chapter.isAvailable ? 'locked' : ''}`;

      const statusClass = chapter.isCompleted ? 'completed' :
                         chapter.isAvailable ? '' : 'locked';

      const statusText = chapter.isCompleted ? 'Completed' :
                        chapter.isAvailable ? 'Available' : 'Locked';

      card.innerHTML = `
        <div class="chapter-icon">${chapter.icon}</div>
        <h2>${chapter.title}</h2>
        <p>${chapter.description}</p>
        <span class="chapter-status ${statusClass}">${statusText}</span>
      `;

      if (chapter.isAvailable) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          this.loadChapter(chapter.id);
        });
      }

      grid.appendChild(card);
    });
  },

  loadChapter(chapterId) {
    const chapter = chapters.getChapter(chapterId);
    if (!chapter) {
      this.showError('Chapter not found');
      return;
    }

    this.currentChapterId = chapterId;

    const titleEl = document.getElementById('chapter-title');
    const headingEl = document.getElementById('chapter-heading');
    const descEl = document.getElementById('chapter-description');
    const introEl = document.getElementById('chapter-intro');

    if (titleEl) titleEl.textContent = chapter.title;
    if (headingEl) headingEl.textContent = `${chapter.icon} ${chapter.title}`;
    if (descEl) descEl.textContent = chapter.description;
    if (introEl) introEl.textContent = chapter.intro;

    const messageThread = document.getElementById('message-thread');
    if (messageThread) {
      messageThread.innerHTML = '';
      this.addBotMessage(chapterId);
    }

    this.showScreen('chapter');
  },

  addBotMessage(chapterId = null, text = null) {
    const messageThread = document.getElementById('message-thread');
    if (!messageThread) return;

    const message = document.createElement('div');
    message.className = 'message bot';

    let botText = text;
    if (!botText) {
      const currentChapter = chapterId || this.currentChapterId;
      const chapter = chapters.getChapter(currentChapter);
      botText = chapter?.intro || 'Welcome!';
    }

    message.innerHTML = `<div class="message-content">${this.escapeHtml(botText)}</div>`;
    messageThread.appendChild(message);
    messageThread.scrollTop = messageThread.scrollHeight;
  },

  addUserMessage(text) {
    const messageThread = document.getElementById('message-thread');
    if (!messageThread) return;

    const message = document.createElement('div');
    message.className = 'message user';
    message.innerHTML = `<div class="message-content">${this.escapeHtml(text)}</div>`;
    messageThread.appendChild(message);
    messageThread.scrollTop = messageThread.scrollHeight;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  showError(message) {
    alert(message);
  },

  showSuccess(message) {
    alert(message);
  }
};
