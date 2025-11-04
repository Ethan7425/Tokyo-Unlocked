import { config } from './config.js';

let initialized = false;
let auth, db, sdk;

export const firebaseAPI = {
  async init() {
    if (!config.firebase?.enabled || initialized) return initialized;

    const [{ initializeApp }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js')
    ]);

    const app = initializeApp(config.firebase.config);

    const [
      { getAuth, signInAnonymously, onAuthStateChanged },
      { getFirestore, doc, getDoc, setDoc, updateDoc, runTransaction, serverTimestamp }
    ] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js')
    ]);

    auth = getAuth(app);
    db = getFirestore(app);
    sdk = { doc, getDoc, setDoc, updateDoc, runTransaction, serverTimestamp };

    await signInAnonymously(auth);
    initialized = true;
    console.log('✅ Firebase connected');
    return true;
  },

  async claimNickname(nickname) {
    const lower = nickname.trim().toLowerCase();
    const ref = sdk.doc(db, 'handles', lower);
    const uid = auth.currentUser?.uid;

    return sdk.runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists() && snap.data().uid !== uid) {
        throw new Error('Nickname already taken');
      }
      tx.set(ref, { uid, updatedAt: sdk.serverTimestamp() });
      return true;
    });
  },

  async savePlayer(nickname, data) {
    const uid = auth.currentUser?.uid;
    const ref = sdk.doc(db, 'players', uid);
    await sdk.setDoc(ref, { nickname, ...data, updatedAt: sdk.serverTimestamp() }, { merge: true });
    return true;
  },

  async loadPlayer() {
    const uid = auth.currentUser?.uid;
    const ref = sdk.doc(db, 'players', uid);
    const snap = await sdk.getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }
};
