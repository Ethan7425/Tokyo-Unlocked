import { storage } from './storage.js';
import { logger } from './logger.js';
import { firebaseAPI } from './firebase-init.js';
import { config } from './config.js';

export const auth = {
  currentUser: null,

  async init() {
    this.currentUser = storage.getCurrentUser();
    logger.log(
      'Auth initialized',
      this.currentUser ? `User: ${this.currentUser.nickname}` : 'No user logged in'
    );

    if (config.firebase?.enabled) {
      await firebaseAPI.init();
    }
  },

  async loginOrCreate(nickname, pin = '') {
    try {
      nickname = (nickname || '').trim();
      pin = (pin || '').trim();

      if (!nickname) throw new Error('Nickname is required');
      if (nickname.length > 20) throw new Error('Nickname must be 20 characters or less');
      if (pin && !/^\d{4}$/.test(pin)) throw new Error('PIN must be exactly 4 digits');

      const existing = storage.findUser(nickname);

      // === Existing user ===
      if (existing) {
        if (existing.pin && existing.pin !== pin) {
          return { success: false, error: 'Incorrect PIN for this nickname' };
        }

        this.currentUser = existing;
        storage.setCurrentUser(existing);
        logger.log('User logged in', nickname);

        if (config.firebase?.enabled) {
          await firebaseAPI.savePlayer(nickname, { progress: existing.progress });
        }

        return { success: true, user: existing, mode: 'login' };
      }

      // === New user ===
      const newUser = {
        nickname,
        pin: pin || null,
        avatar: null,
        progress: {
          chaptersCompleted: 0,
          puzzlesSolved: 0,
          totalTimePlayed: 0,
          bestScore: 0,
          completedChapters: [],
          chapterData: {}
        },
        joinedAt: new Date().toISOString()
      };

      storage.saveUser(newUser);
      this.currentUser = newUser;
      storage.setCurrentUser(newUser);
      logger.log('New user created', nickname);

      if (config.firebase?.enabled) {
        await firebaseAPI.init();
        if (config.cloud?.enforceUniqueNickname) {
          await firebaseAPI.claimNickname(nickname);
        }
        await firebaseAPI.savePlayer(nickname, { progress: newUser.progress });
      }

      return { success: true, user: newUser, mode: 'created' };

    } catch (error) {
      logger.error('Login/Create failed', error);
      return { success: false, error: error.message };
    }
  },

  logout() {
    try {
      logger.log('User logged out', this.currentUser?.nickname);
      this.currentUser = null;
      storage.clearCurrentUser();
      return { success: true };
    } catch (error) {
      logger.error('Logout failed', error);
      return { success: false, error: error.message };
    }
  },

  async deleteAccount() {
    try {
      if (!this.currentUser) throw new Error('No user is logged in');

      const confirmDelete = confirm(
        `Are you sure you want to permanently delete your account "${this.currentUser.nickname}"?`
      );
      if (!confirmDelete) return { success: false, cancelled: true };

      const nickname = this.currentUser.nickname;
      storage.deleteUser(nickname);
      storage.clearCurrentUser();
      logger.log('Account deleted', nickname);

      // optional: future cloud cleanup
      if (config.firebase?.enabled) {
        await firebaseAPI.deletePlayer?.(nickname);
      }

      this.currentUser = null;
      return { success: true };
    } catch (error) {
      logger.error('Delete account failed', error);
      return { success: false, error: error.message };
    }
  },

  isLoggedIn() {
    return this.currentUser !== null;
  },

  updateUser(updates) {
    try {
      if (!this.currentUser) throw new Error('No user logged in');
      this.currentUser = { ...this.currentUser, ...updates };
      storage.saveUser(this.currentUser);
      storage.setCurrentUser(this.currentUser);
      logger.log('User updated', this.currentUser.nickname);
      return { success: true, user: this.currentUser };
    } catch (error) {
      logger.error('Update user failed', error);
      return { success: false, error: error.message };
    }
  }
};
