# WDV321 Final Project

Author: Hunter Lovan

This project is for educational purposes only.

## Overview
This project is a recipe collection web app built with HTML, CSS, and JavaScript. It allows users to browse recipes, view recipe details, adjust servings, and add their own recipes through a dynamic form.

The application is designed to demonstrate dynamic content rendering, external data handling, form validation, responsive layout techniques, and local data persistence in the browser.

## Author
Hunter Lovan

## Course
WDV321 Advanced JavaScript

## Purpose
The purpose of this exercise is to review and apply JavaScript dynamic content capabilities in a practical project.

## Main Features
- Display a collection of recipes as interactive cards
- Load initial recipe data from an external JSON file
- Save recipe data in `localStorage`
- View recipe details dynamically from JavaScript objects
- Show and hide ingredients and instructions with transitions
- Adjust serving counts and recalculate ingredient amounts
- Add new recipes using a dynamic input form
- Validate form fields with both HTML validation and JavaScript checks
- Support an unknown number of ingredients and instruction steps
- Provide responsive layout behavior for desktop and mobile screens
- Include keyboard-accessible recipe cards and visible focus states

## Project Structure
```text
WDV321Final/
|-- index.html
|-- input.html
|-- README.md
|-- css/
|   |-- styles.css
|-- data/
|   |-- sample-data.json
|-- images/
|   |-- recipe and pattern images
|-- js/
|   |-- home.js
|   |-- input.js
```

## File Summary
### `index.html`
Main landing page for browsing recipes and opening recipe details.

### `input.html`
Form page used to add a new recipe with dynamic ingredient and instruction fields.

### `css/styles.css`
Shared styling for layout, buttons, forms, responsive behavior, and theme colors.

### `js/home.js`
Handles recipe loading, displaying recipe cards, showing recipe details, changing servings, and loading sample data.

### `js/input.js`
Handles image selection, dynamic form inputs, form validation, and saving new recipes.

### `data/sample-data.json`
Stores the initial set of recipe objects used to populate the app on first load.

## How It Works
1. When the home page loads, the app checks `localStorage` for saved recipes.
2. If no saved recipes exist, it attempts to load recipe data from `data/sample-data.json`.
3. If external loading is unavailable, fallback sample data is used from JavaScript.
4. Recipes are rendered dynamically into the page as cards.
5. Selecting a recipe opens a detail view with ingredients, instructions, and serving controls.
6. The input page allows the user to create and save new recipe objects to `localStorage`.

## Data Format
Each recipe is stored as a JavaScript object / JSON object with this structure:

```json
{
  "name": "Recipe Name",
  "image": "./images/example.jpg",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "time": 30,
  "servings": 4
}
```

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)
- JSON
- Browser `localStorage`
- Fetch API

## Responsive and Accessibility Notes
- Responsive layout is handled with shared CSS media queries
- Buttons and form controls are sized for mobile usability
- Recipe cards support keyboard interaction
- Focus-visible styles were added for better navigation clarity

## Running the Project
Open `index.html` in a browser to use the app.

For the best experience with JSON loading, run the project from a local development server if your browser blocks `fetch()` requests from direct file access. The app includes a fallback data-loading path so it can still work if the JSON file cannot be fetched.

## Acknowledgements
Assisted by ChatGPT to debug, optimize code, improve extendability, and improve clarity through documentation.
