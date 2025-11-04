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
    enabled: true, // ✅ enable Firebase integration
    config: {
      apiKey: "AIzaSyAtEOEvq5FNHynqus19EoNFA-u4rSrq2OI",
      authDomain: "tokyo-unlocked.firebaseapp.com",
      projectId: "tokyo-unlocked",
      storageBucket: "tokyo-unlocked.firebasestorage.app",
      messagingSenderId: "906462471849",
      appId: "1:906462471849:web:8c65ca0a6cf6caac2e2bb8",
      measurementId: "G-6FJ887JXJT"
    }
  },

  cloud: {
    syncPlayers: true,
    enforceUniqueNickname: true
  }
};
