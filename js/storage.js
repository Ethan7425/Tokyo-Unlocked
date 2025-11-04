import { logger } from './logger.js';
import { config } from './config.js';

const STORAGE_KEYS = {
  CURRENT_USER: 'escape_game_current_user',
  USERS: 'escape_game_users'
};

export const storage = {
  getCurrentUser() {
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      logger.error('Failed to get current user', error);
      return null;
    }
  },

  setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      return true;
    } catch (error) {
      logger.error('Failed to set current user', error);
      return false;
    }
  },

  getAllUsers() {
    try {
      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      logger.error('Failed to get all users', error);
      return [];
    }
  },

  saveUser(user) {
    try {
      const users = this.getAllUsers();
      const existingIndex = users.findIndex(u => u.nickname === user.nickname);

      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (error) {
      logger.error('Failed to save user', error);
      return false;
    }
  },

  findUser(nickname) {
    try {
      const users = this.getAllUsers();
      return users.find(u => u.nickname === nickname);
    } catch (error) {
      logger.error('Failed to find user', error);
      return null;
    }
  },

  clearCurrentUser() {
    return this.setCurrentUser(null);
  }
};
