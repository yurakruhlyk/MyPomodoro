let countdown;
const timerDisplay = document.getElementById('timer');
const startWorkButton = document.getElementById('startWork');
const startBreakButton = document.getElementById('startBreak');
const resetTimersButton = document.getElementById('resetTimers');
const notificationsButton = document.getElementById('notifications');
const soundsButton = document.getElementById('sounds');

// Sounds
const soundStartTimer = new Audio('./sounds/start.mp3');
const soundEndTimer = new Audio('./sounds/end.mp3');
const soundResetTimer = new Audio('./sounds/reset.mp3');

// Settings
let settings = (localStorage.getItem('settings')) ? JSON.parse(localStorage.getItem('settings')) : {
  notifications: true,
  sounds: true
};

renderButtons(); // Render buttons status

// Timer
function timer(seconds) {
  clearInterval(countdown);

  const currentTime = Date.now();
  const startTime = currentTime + seconds * 1000;
  renderTimerTime(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((startTime - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      playSounds(soundEndTimer);

      // message for notification
      seconds > 300 ? notifications('The timer for 25 minutes is over!') : notifications('The timer for 5 minutes is over!');

      return;
    }

    renderTimerTime(secondsLeft);
  }, 1000);
}

// Display timer
function renderTimerTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;

  document.title = display;
  timerDisplay.textContent = display;
}

// Start timer
function startTimer() {
  const seconds = this.dataset.time;

  timer(seconds);
  playSounds(soundStartTimer);
}

// Stop timer
function resetTimers() {
  const resetSeconds = '00:00';

  clearInterval(countdown);
  document.title = resetSeconds;
  timerDisplay.textContent = resetSeconds;
  playSounds(soundResetTimer);
}

// Render status buttons
function renderButtons() {
  if (settings.notifications === true)
    notificationsButton.setAttribute('checked', true);

  if (settings.sounds === true)
    soundsButton.setAttribute('checked', true);
}

// Change settings
function handleSwitchSettings(button, value) {
  if (button.getAttribute('checked', true)) {
    button.removeAttribute('checked', true);
    settings[value] = false;

  } else {
    button.setAttribute('checked', true);
    settings[value] = true;
  }

  updateSettings();
}

// Function play sounds
function playSounds(sound) {
  if (settings.sounds === true) {
    sound.play();
  }
}

// Function create notifications 
function notifications(message) {
  if (settings.notifications === true) {
    Push.create("MyPomodoro", {
      body: message,
      icon: 'favicon.png',
      onClick: function() {
        window.focus();
        this.close();
      }
    });
  }
}

// Update settings in localStrorage 
function updateSettings() {
  localStorage.setItem('settings', JSON.stringify(settings));
}

// Buttons click
startWorkButton.onclick = startTimer;
startBreakButton.onclick = startTimer;
resetTimersButton.onclick = resetTimers;
notificationsButton.addEventListener('click', () => handleSwitchSettings(notificationsButton, 'notifications'));
soundsButton.addEventListener('click', () => handleSwitchSettings(soundsButton, 'sounds'));