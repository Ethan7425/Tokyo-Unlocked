import { logger } from './logger.js';
import { chapters } from './chapters.js';

const CHAPTER_RESPONSES = {
  1: {
    intro: 'Welcome to the Mystery Room. I am your guide. Look around and tell me what you see.',
    keywords: {
      window: 'The window is barred. You cannot escape through here.',
      door: 'The door is locked from the outside. We need to find the key.',
      key: 'Excellent observation! The key might be hidden somewhere in this room.',
      desk: 'Good! On the desk you find a note with a cryptic message.',
      clue: 'Yes, there are several clues scattered around. Keep searching!',
      help: 'Tell me what objects you can see around you, and I will help you find the escape route.',
      escape: 'To escape, we must solve the puzzle. What have you discovered?'
    },
    defaultResponse: 'That\'s interesting. Can you describe the objects or clues you find in the room? Look for anything unusual.'
  },

  2: {
    intro: 'You have entered the Hidden Library. These ancient books hold many secrets. What shall we explore?',
    keywords: {
      book: 'Books line every shelf. Some look ancient, others more recent. Which one interests you?',
      ancient: 'The oldest books contain the most valuable secrets. Look for symbols or markings.',
      shelf: 'The shelves stretch from floor to ceiling. Some have hidden compartments.',
      symbol: 'Interesting! Do you recognize any patterns in these symbols?',
      riddle: 'Yes, the books contain riddles. Solving them will lead us forward.',
      secret: 'Every book in this library protects a secret. We must read carefully.',
      passage: 'A passage lies behind the bookshelf. We must discover how to open it.'
    },
    defaultResponse: 'The library is vast and mysterious. Examine the books carefully and tell me what catches your eye.'
  },

  3: {
    intro: 'Welcome to the Coded Vault. Mathematical precision and ancient wisdom guard these treasures. What do you observe?',
    keywords: {
      code: 'The code is complex but not impossible. Look for patterns in the numbers and symbols.',
      number: 'Numbers are keys. Six different numbers appear throughout this chamber.',
      combination: 'You\'re on the right track! The correct combination will unlock the vault.',
      symbol: 'These symbols represent values. Ancient and modern mathematics blend here.',
      pattern: 'Patterns reveal themselves to the patient observer. Study the walls carefully.',
      treasure: 'Treasure awaits those who solve the puzzle. What is your next move?',
      solution: 'You seek the final solution. Gather all the clues and verify your theory.'
    },
    defaultResponse: 'The vault is challenging but fair. Describe what you see, and together we will unlock its secrets.'
  },

  4: {
    intro: 'Behold the Crystal Maze! Light and shadow dance upon the mirrored walls. Where shall we venture?',
    keywords: {
      mirror: 'Mirrors reflect more than just images. Some show the true path forward.',
      light: 'The crystals glow with an inner light. Follow the brightest paths.',
      path: 'Multiple paths exist, but only one leads to freedom. Choose wisely.',
      direction: 'The crystals point the way. Do you see the pattern emerging?',
      exit: 'The exit is near, but the final section is the most complex.',
      crystal: 'Each crystal pulses with energy. They communicate through light patterns.',
      illusion: 'Some of what you see may be illusion. Trust your instincts.'
    },
    defaultResponse: 'The maze challenges both mind and intuition. Describe the paths and crystals you see.'
  },

  5: {
    intro: 'You have reached the Final Trial. This is our greatest challenge. Are you ready to face your destiny?',
    keywords: {
      ready: 'Excellent. The trial tests everything you have learned and your character itself.',
      choice: 'Each choice matters now. What is your decision?',
      trial: 'The trial is designed to determine your worthiness. Speak from your heart.',
      freedom: 'Freedom awaits those who pass. What will you choose?',
      destiny: 'Your destiny is shaped by your choices. Make them wisely.',
      truth: 'Truth is the ultimate key. Do you understand what you have learned?',
      victory: 'Victory is within reach. Show me your strength of character.'
    },
    defaultResponse: 'This final moment will define your journey. Speak your truth to me.'
  }
};

export const chatbot = {
  currentChapterId: null,

  setChapter(chapterId) {
    this.currentChapterId = chapterId;
  },

  getIntroMessage(chapterId) {
    const responses = CHAPTER_RESPONSES[chapterId];
    if (!responses) {
      logger.warn('No chatbot responses for chapter', chapterId);
      return 'Hello! I am here to guide you through this chapter.';
    }
    return responses.intro;
  },

  generateResponse(userMessage) {
    try {
      if (!this.currentChapterId) {
        return 'I am not currently assigned to a chapter. Please select one first.';
      }

      const chapterResponses = CHAPTER_RESPONSES[this.currentChapterId];
      if (!chapterResponses) {
        return 'I seem to have lost my way. Please try again.';
      }

      const lowerMessage = userMessage.toLowerCase().trim();

      for (const [keyword, response] of Object.entries(chapterResponses.keywords)) {
        if (lowerMessage.includes(keyword)) {
          return response;
        }
      }

      return chapterResponses.defaultResponse;
    } catch (error) {
      logger.error('Chatbot response generation failed', error);
      return 'I apologize, but I am having difficulty responding. Please try again.';
    }
  },

  validateMessageInput(message) {
    const trimmed = message.trim();

    if (!trimmed) {
      return { valid: false, error: 'Message cannot be empty.' };
    }

    if (trimmed.length > 500) {
      return { valid: false, error: 'Message is too long (max 500 characters).' };
    }

    return { valid: true };
  }
};
