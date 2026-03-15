import { fetchData } from "./api";
//add additional imports as needed

// Create an event handler on the button to fetch the data.
// This will NOT call the Fetch API directly, instead it will call the function defined in api.js
// Overview of what the click handler will need to do:
//   - Hint: this should be functions calls imported from api.js and ui.js
//   1. Show a loading status
//   2. Fetch the data - pass the value from the text box into the function
//   3. Clear the loading status
//   4. Render results
//   5. Include Error handling - i.e. try/catch errors
