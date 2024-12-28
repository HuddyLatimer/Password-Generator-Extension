// Element References
const generateTab = document.getElementById('generateTab');
const recentTab = document.getElementById('recentTab');
const generateSection = document.getElementById('generateSection');
const recentSection = document.getElementById('recentSection');
const generateBtn = document.getElementById('generateBtn');
const passwordDisplay = document.getElementById('passwordDisplay');
const copyBtn = document.getElementById('copyBtn');
const recentPasswords = document.getElementById('recentPasswords');

// Options
const lengthInput = document.getElementById('lengthInput');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');

// Event Listeners for Tabs
generateTab.addEventListener('click', () => {
  generateSection.classList.remove('hidden');
  recentSection.classList.add('hidden');
  generateTab.classList.add('active');
  recentTab.classList.remove('active');
});

recentTab.addEventListener('click', () => {
  generateSection.classList.add('hidden');
  recentSection.classList.remove('hidden');
  generateTab.classList.remove('active');
  recentTab.classList.add('active');
});

// Password Generator
const characters = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+[]{}|;:,.<>?'
};

function generatePassword() {
  const length = parseInt(lengthInput.value);
  let charPool = '';
  if (includeUppercase.checked) charPool += characters.upper;
  if (includeLowercase.checked) charPool += characters.lower;
  if (includeNumbers.checked) charPool += characters.numbers;
  if (includeSymbols.checked) charPool += characters.symbols;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    password += charPool[randomIndex];
  }

  return password;
}

// Save Passwords
function savePassword(password) {
  chrome.storage.local.get(['recent'], (result) => {
    const recent = result.recent || [];
    recent.unshift(password);
    chrome.storage.local.set({ recent });
    loadRecentPasswords();
  });
}

// Load Recent Passwords
function loadRecentPasswords() {
  chrome.storage.local.get(['recent'], (result) => {
    const recent = result.recent || [];
    recentPasswords.innerHTML = recent.map(pwd => `<li>${pwd}</li>`).join('');
  });
}

// Generate Button Click
generateBtn.addEventListener('click', () => {
  const password = generatePassword();
  passwordDisplay.textContent = password;
  savePassword(password);
});

// Copy Button Click
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(passwordDisplay.textContent);
  alert('Password copied!');
});

// Load Recent on Start
loadRecentPasswords();
