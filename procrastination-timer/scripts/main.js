// Global variables for timer control
let isRunning = false;
let timeLeft = 25 * 60; // Default work session time in seconds (25 minutes)
let interval;
let sessionType = "Work Session"; // Default session is Work

// Get DOM elements
const timerDisplay = document.getElementById("timer-display");
const sessionTypeDisplay = document.getElementById("session-type");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const swapButton = document.getElementById("swap-btn"); // Swap button for work/break switch
const timeInput = document.getElementById("time-input");
const timeInputSec = document.getElementById("time-input-sec"); // New input for seconds
const breakInput = document.getElementById("break-input");
const breakInputSec = document.getElementById("break-input-sec"); // New input for seconds
const streakCountDisplay = document.getElementById("streak-count");
const sessionCountDisplay = document.getElementById("session-count");
const motivationBox = document.getElementById("motivation-box");
const motivationContent = document.getElementById("motivation-content");
const closeMotivationButton = document.getElementById("close-motivation-btn");

let streakCount = parseInt(localStorage.getItem("streakCount") || "0");
let sessionCount = parseInt(localStorage.getItem("sessionCount") || "0");

// Fetch quotes from the assets/quotes.json file
async function fetchQuotes() {
  try {
    const response = await fetch("assets/quotes.json");
    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }
    const quotes = await response.json();

    if (!Array.isArray(quotes)) {
      throw new Error("quotes.json must be an array");
    }

    return quotes.filter(item => item.type === "quote" && item.text);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [
      { text: "Stay strong!", author: "Unknown" }
    ];
  }
}

// Fetch memes from the assets/memes folder
async function fetchMemes() {
  const memeFiles = ["meme1.jpg", "meme2.jpg", "meme3.jpg"]; // Add your meme filenames here
  const memes = memeFiles.map(file => `assets/memes/${file}`);
  return memes;
}

// Show a random quote when the session ends
async function showMotivation() {
  const quotes = await fetchQuotes();

  if (quotes.length === 0) {
    motivationContent.innerHTML = `<p>Stay strong! 💪</p>`;
  } else {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    motivationContent.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <p><em>– ${randomQuote.author || "Unknown"}</em></p>
    `;
  }

  motivationBox.style.display = "block";
}

// Update the display (in MM:SS format)
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  sessionTypeDisplay.textContent = sessionType;
}

// Start or pause the timer
function toggleTimer() {
  if (isRunning) {
    clearInterval(interval);
  } else {
    interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        switchSession();
      }
    }, 1000);
  }
  isRunning = !isRunning;
  startButton.textContent = isRunning ? "Pause" : "Start";
}

// Switch between work and break sessions
function switchSession() {
  if (sessionType === "Work Session") {
    sessionType = "Break Session";
    timeLeft = (parseInt(breakInput.value) * 60) + parseInt(breakInputSec.value);
    streakCount++;
    sessionCount++;
    saveSessionData();
    showMotivation(); // Show quote after work session ends
  } else {
    sessionType = "Work Session";
    timeLeft = (parseInt(timeInput.value) * 60) + parseInt(timeInputSec.value);
  }
  updateDisplay();
}

// Swap between work session and break session without waiting for timer to end
function swapWorkBreak() {
  if (sessionType === "Work Session") {
    sessionType = "Break Session";
    timeLeft = (parseInt(breakInput.value) * 60) + parseInt(breakInputSec.value);
  } else {
    sessionType = "Work Session";
    timeLeft = (parseInt(timeInput.value) * 60) + parseInt(timeInputSec.value);
  }
  updateDisplay();
}

// Reset the timer
function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  timeLeft = (parseInt(timeInput.value) * 60) + parseInt(timeInputSec.value);
  sessionType = "Work Session";
  updateDisplay();
  startButton.textContent = "Start";
}

// Save session data to localStorage
function saveSessionData() {
  localStorage.setItem("streakCount", streakCount);
  localStorage.setItem("sessionCount", sessionCount);
  streakCountDisplay.textContent = streakCount;
  sessionCountDisplay.textContent = sessionCount;
}

// Initialize the app
function initialize() {
  updateDisplay();
  streakCountDisplay.textContent = streakCount;
  sessionCountDisplay.textContent = sessionCount;
}

// Close the motivation box when the close button is clicked
closeMotivationButton.addEventListener("click", () => {
  motivationBox.style.display = "none"; // Hide the motivation box
});

// Event listeners
startButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);
swapButton.addEventListener("click", swapWorkBreak);

// Event listener for session input (minutes and seconds)
timeInput.addEventListener("input", () => {
  if (!isRunning) {
    timeLeft = (parseInt(timeInput.value) * 60) + parseInt(timeInputSec.value);
    updateDisplay();
  }
});
timeInputSec.addEventListener("input", () => {
  if (!isRunning) {
    timeLeft = (parseInt(timeInput.value) * 60) + parseInt(timeInputSec.value);
    updateDisplay();
  }
});

// Event listener for break input (minutes and seconds)
breakInput.addEventListener("input", () => {
  if (!isRunning && sessionType === "Break Session") {
    timeLeft = (parseInt(breakInput.value) * 60) + parseInt(breakInputSec.value);
    updateDisplay();
  }
});
breakInputSec.addEventListener("input", () => {
  if (!isRunning && sessionType === "Break Session") {
    timeLeft = (parseInt(breakInput.value) * 60) + parseInt(breakInputSec.value);
    updateDisplay();
  }
});

// Initialize on load
initialize();
