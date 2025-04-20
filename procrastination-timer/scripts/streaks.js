// scripts/streak.js

/**
 * Fetches the streak and session count from local storage.
 */
function getStreakData() {
    const streakData = JSON.parse(localStorage.getItem('streakData')) || { streak: 0, sessionCount: 0 };
    return streakData;
  }
  
  /**
   * Saves the streak and session count to local storage.
   */
  function saveStreakData(streakData) {
    localStorage.setItem('streakData', JSON.stringify(streakData));
  }
  
  /**
   * Updates the displayed streak and session count in the UI.
   */
  function updateStreakDisplay() {
    const streakData = getStreakData();
    document.getElementById('streak-count').textContent = streakData.streak;
    document.getElementById('session-count').textContent = streakData.sessionCount;
  }
  
  /**
   * Increments the session count and updates streak if a full session was completed.
   * 
   * If a break is done, increments the streak.
   */
  function incrementSessionCount() {
    const streakData = getStreakData();
    streakData.sessionCount++;
  
    // If work session was completed, increment streak
    if (streakData.streak < streakData.sessionCount) {
      streakData.streak++;
    }
  
    saveStreakData(streakData);
    updateStreakDisplay();
  }
  
  /**
   * Resets the streak data.
   */
  function resetStreak() {
    const streakData = { streak: 0, sessionCount: 0 };
    saveStreakData(streakData);
    updateStreakDisplay();
  }
  
  // Call to update streak on page load
  updateStreakDisplay();
  