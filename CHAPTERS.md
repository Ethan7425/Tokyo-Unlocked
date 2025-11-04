# Escape Game - Chapter System

## Overview
The game features 5 progressive chapters, each as a standalone game experience. Players unlock chapters sequentially by completing previous ones.

## Chapter Structure

### Chapter 1: The Mysterious Room 🔒
**Description:** Trapped in a locked room, you must find clues to escape.
**Unlocked:** From the start
**Intro:** You wake up in a dimly lit room with no memory of how you got here...

### Chapter 2: The Hidden Library 📚
**Description:** Discover secrets hidden within ancient books.
**Unlocked:** After completing Chapter 1
**Intro:** Having escaped the first room, you find yourself in a grand library...

### Chapter 3: The Coded Vault 🔐
**Description:** Crack complex codes to unlock valuable treasures.
**Unlocked:** After completing Chapter 2
**Intro:** Deep beneath the library lies a vault with ancient codes...

### Chapter 4: The Crystal Maze ✨
**Description:** Navigate through a magical maze of mirrors and light.
**Unlocked:** After completing Chapter 3
**Intro:** The vault opens to reveal an enchanted maze...

### Chapter 5: The Final Trial 👑
**Description:** Face the ultimate challenge and claim your freedom.
**Unlocked:** After completing Chapter 4
**Intro:** You stand at the threshold of the final chamber...

## How It Works

### Chapter Selection (Play Screen)
- Grid of chapter cards showing title, description, and status
- Cards show: Available, Completed, or Locked
- Locked chapters are grayed out and unclickable
- Click an available chapter to enter it

### Chapter Gameplay
- Each chapter has its own chatbot conversation
- The chatbot responds based on keyword matching
- Messages are saved per chapter
- Players can reset a chapter anytime to start over
- Back button returns to chapter selection

### Data Persistence
- Chapter progress stored in user's localStorage
- Tracking: completed chapters, messages, chapter state
- Profile shows total chapters completed

## Adding New Content

### To Add a New Chapter:
1. Edit `/js/chapters.js` - CHAPTERS_DATA array
2. Add chapter object with: id, title, icon, description, intro, requiredToUnlock
3. Edit `/js/chatbot.js` - CHAPTER_RESPONSES object
4. Add responses with: intro, keywords, defaultResponse
5. Build and deploy

### Example
```javascript
// In chapters.js
{
  id: 6,
  title: 'New Chapter',
  icon: '🎭',
  description: 'Chapter description',
  intro: 'Intro text...',
  requiredToUnlock: 5
}

// In chatbot.js
6: {
  intro: 'Welcome message',
  keywords: {
    keyword: 'Response to keyword',
  },
  defaultResponse: 'Default response'
}
```

## Future Enhancements
- Puzzle mechanics and logic validation
- Timed challenges and scoring
- Photo-based clues
- Achievements and badges
- Analytics and leaderboard integration
