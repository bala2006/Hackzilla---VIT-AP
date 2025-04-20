let timer;
let isTimerRunning = false;
let isSessionActive = true; // True if it's a work session, false for break
let timeRemaining = 25 * 60; // Default work session is 25 minutes in seconds
let breakTime = 5 * 60; // Default break time is 5 minutes in seconds

// Updates the timer display on the page
function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  document.getElementById('timer-display').textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
  document.getElementById('session-type').textContent = isSessionActive ? 'Work Session' : 'Break Time';
}

// Formats the time to ensure two digits
function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// Starts or stops the timer
function startTimer() {
  if (isTimerRunning) {
    clearInterval(timer);
    isTimerRunning = false;
    document.getElementById('start-btn').textContent = 'Start';
  } else {
    isTimerRunning = true;
    document.getElementById('start-btn').textContent = 'Pause';
    timer = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay();
      if (timeRemaining <= 0) {
        handleEndOfSession();
      }
    }, 1000);
  }
}

// Resets the timer
function resetTimer() {
  clearInterval(timer);
  isTimerRunning = false;
  timeRemaining = isSessionActive ? 25 * 60 : breakTime; // Reset to current session time
  updateTimerDisplay();
  document.getElementById('start-btn').textContent = 'Start';
}

// Handles the end of the session, toggles session and triggers streak update
function handleEndOfSession() {
  clearInterval(timer);
  isTimerRunning = false;
  if (isSessionActive) {
    // Work session ended, trigger break and update streak
    isSessionActive = false;
    timeRemaining = breakTime;
    showMotivation(); // Show motivational quote or meme
  } else {
    // Break ended, go back to work session
    isSessionActive = true;
    timeRemaining = 25 * 60; // Reset to default work time
  }
  updateTimerDisplay();
  document.getElementById('start-btn').textContent = 'Start';
}

// Displays a motivational message or meme
function showMotivation() {
  const motivationBox = document.getElementById('motivation-box');
  const motivationContent = document.getElementById('motivation-content');
  
  // Pick a random quote or meme from the list
  const randomMotivation = getRandomMotivation();
  motivationContent.innerHTML = randomMotivation;
  motivationBox.style.display = 'block';
}

// Closes the motivation box
function closeMotivation() {
  document.getElementById('motivation-box').style.display = 'none';
}

// Sets new session time from input
function setSessionTime(newTime) {
  timeRemaining = newTime * 60; // Convert minutes to seconds
  if (!isTimerRunning) {
    updateTimerDisplay(); // Update the display immediately
  }
}

// Sets new break time from input
function setBreakTime(newBreakTime) {
  breakTime = newBreakTime * 60; // Convert minutes to seconds
  if (!isTimerRunning && !isSessionActive) {
    updateTimerDisplay(); // Update the display immediately when in break session
  }
}

// Event listeners for user input (change session/break times)
document.getElementById('time-input').addEventListener('input', (e) => {
  setSessionTime(e.target.value);
});

document.getElementById('break-input').addEventListener('input', (e) => {
  setBreakTime(e.target.value);
});

// Initialize the timer display on page load
updateTimerDisplay();

// Get random motivational message or meme
function getRandomMotivation() {
  const motivations = [
    "Believe in yourself!",
    "Keep pushing, you're almost there!",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't stop when you're tired. Stop when you're done!",
    "You can do it! Keep going!",
    "Hard work beats talent when talent doesn't work hard."
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}
