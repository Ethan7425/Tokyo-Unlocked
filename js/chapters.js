import { logger } from './logger.js';
import { auth } from './auth.js';
import { storage } from './storage.js';

const CHAPTERS_DATA = [
  {
    id: 1,
    title: 'The Mysterious Room',
    icon: '🔒',
    description: 'Trapped in a locked room, you must find clues to escape.',
    intro: 'You wake up in a dimly lit room with no memory of how you got here. The door is locked. Your companion, an AI guide, appears on the screen to help you navigate your predicament. Look around carefully...',
    requiredToUnlock: null
  },
  {
    id: 2,
    title: 'The Hidden Library',
    icon: '📚',
    description: 'Discover secrets hidden within ancient books.',
    intro: 'Having escaped the first room, you find yourself in a grand library. Dusty books line the shelves, and you sense that knowledge holds the key to your next escape. Your AI guide returns to assist you.',
    requiredToUnlock: 1
  },
  {
    id: 3,
    title: 'The Coded Vault',
    icon: '🔐',
    description: 'Crack complex codes to unlock valuable treasures.',
    intro: 'Deep beneath the library lies a vault. Ancient symbols and mathematical patterns cover the walls. You must decipher the codes to reach what lies beyond.',
    requiredToUnlock: 2
  },
  {
    id: 4,
    title: 'The Crystal Maze',
    icon: '✨',
    description: 'Navigate through a magical maze of mirrors and light.',
    intro: 'The vault opens to reveal an enchanted maze. Glowing crystals line the walls, and you must solve spatial puzzles to find the exit.',
    requiredToUnlock: 3
  },
  {
    id: 5,
    title: 'The Final Trial',
    icon: '👑',
    description: 'Face the ultimate challenge and claim your freedom.',
    intro: 'You stand at the threshold of the final chamber. Everything you\'ve learned will be tested. Your AI guide prepares for one last conversation that will determine your fate.',
    requiredToUnlock: 4
  }
];

export const chapters = {
  getAll() {
    return CHAPTERS_DATA;
  },

  getChapter(chapterId) {
    return CHAPTERS_DATA.find(ch => ch.id === chapterId);
  },

  getAvailableChapters() {
    try {
      if (!auth.currentUser) {
        return [];
      }

      const user = auth.currentUser;
      return CHAPTERS_DATA.map(chapter => ({
        ...chapter,
        isCompleted: user.progress.completedChapters?.includes(chapter.id) || false,
        isAvailable: this.isChapterAvailable(chapter)
      }));
    } catch (error) {
      logger.error('Failed to get available chapters', error);
      return [];
    }
  },

  isChapterAvailable(chapter) {
    if (!auth.currentUser) {
      return false;
    }

    if (chapter.requiredToUnlock === null) {
      return true;
    }

    const user = auth.currentUser;
    return user.progress.completedChapters?.includes(chapter.requiredToUnlock) || false;
  },

  markChapterComplete(chapterId) {
    try {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      const user = auth.currentUser;
      const completedChapters = user.progress.completedChapters || [];

      if (!completedChapters.includes(chapterId)) {
        completedChapters.push(chapterId);
        user.progress.completedChapters = completedChapters;
        user.progress.chaptersCompleted = completedChapters.length;

        const result = auth.updateUser(user);
        logger.log('Chapter marked complete', { chapterId, chapters: completedChapters });
        return result;
      }

      return { success: true };
    } catch (error) {
      logger.error('Failed to mark chapter complete', error);
      return { success: false, error: error.message };
    }
  },

  resetChapterProgress(chapterId) {
    try {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      const user = auth.currentUser;
      if (!user.progress.chapterData) {
        user.progress.chapterData = {};
      }

      user.progress.chapterData[chapterId] = {
        messages: [],
        state: 'started'
      };

      const result = auth.updateUser(user);
      logger.log('Chapter progress reset', chapterId);
      return result;
    } catch (error) {
      logger.error('Failed to reset chapter progress', error);
      return { success: false, error: error.message };
    }
  },

  getChapterProgress(chapterId) {
    try {
      if (!auth.currentUser) {
        return null;
      }

      if (!auth.currentUser.progress.chapterData) {
        auth.currentUser.progress.chapterData = {};
      }

      if (!auth.currentUser.progress.chapterData[chapterId]) {
        auth.currentUser.progress.chapterData[chapterId] = {
          messages: [],
          state: 'not_started'
        };
      }

      return auth.currentUser.progress.chapterData[chapterId];
    } catch (error) {
      logger.error('Failed to get chapter progress', error);
      return null;
    }
  },

  saveChapterMessage(chapterId, role, message) {
    try {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      const user = auth.currentUser;
      if (!user.progress.chapterData) {
        user.progress.chapterData = {};
      }

      if (!user.progress.chapterData[chapterId]) {
        user.progress.chapterData[chapterId] = {
          messages: [],
          state: 'started'
        };
      }

      user.progress.chapterData[chapterId].messages.push({
        role,
        message,
        timestamp: new Date().toISOString()
      });

      auth.updateUser(user);
      return { success: true };
    } catch (error) {
      logger.error('Failed to save chapter message', error);
      return { success: false, error: error.message };
    }
  }
};
