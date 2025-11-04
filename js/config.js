import { firebaseConfig } from './firebase-config.js';

export const config = {
  discord: {
    webhookUrl: null
  },

  features: {
    leaderboard: false,
    chatbot: false,
    photoMechanics: false
  },

  storage: {
    useLocalStorage: true,
    useOnlineDB: false
  },

  game: {
    maxNicknameLength: 20,
    requirePin: false
  },

  firebase: {
    enabled: true,
    config: firebaseConfig
  },

  cloud: {
    syncPlayers: true,
    enforceUniqueNickname: true
  }
};
