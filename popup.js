document.addEventListener('DOMContentLoaded', () => {
  const tabCountEl = document.getElementById('tabCount');
  const noteInput = document.getElementById('noteInput');
  const statusText = document.getElementById('statusText');

  // 1. Get the current window tab count
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    tabCountEl.textContent = tabs.length;
  });

  // 2. Load saved notes from Chrome Storage
  chrome.storage.sync.get(['quickNote'], (result) => {
    if (result.quickNote) {
      noteInput.value = result.quickNote;
    }
  });

  // 3. Auto-save note on user input
  let saveTimeout;
  noteInput.addEventListener('input', () => {
    statusText.textContent = 'Saving...';
    
    // Debounce saving to avoid firing too many storage calls
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      chrome.storage.sync.set({ quickNote: noteInput.value }, () => {
        statusText.textContent = 'Saved!';
        setTimeout(() => {
          statusText.textContent = '';
        }, 1200);
      });
    }, 400);
  });
});