// This file will include the following functions:
//   1. Show Loading Status (example provided)
//   2. Show Error Messages
//   3. Clear the Loading Status
//   4. Render the fetched data results
// Hint: these functions will need to be imported in main.js

export function showLoading() {
  const status = document.getElementById('status');
  status.textContent = 'Loading...';
  status.className = 'loading';
}
