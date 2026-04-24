// Available images in the project
const AVAILABLE_IMAGES = [
    'caesarsalad.jpg',
    'oxtalestew.jpg',
    'pineapplecake.jpg',
    'SpaghettiCarbonara.jpg',
    'SpaghettiCarbonara.png',
    'tomatoesoup.jpg',
    'zucchinibread.jpg'
];

// Initialize form on page load
document.addEventListener('DOMContentLoaded', () => {
    populateImageDropdown();
    setupImagePreview();
    const form = document.getElementById('recipe-form');
    form.addEventListener('submit', handleFormSubmit);
});

// Populate image dropdown with available images
function populateImageDropdown() {
    const imageSelect = document.getElementById('recipe-image');
    AVAILABLE_IMAGES.forEach(image => {
        const option = document.createElement('option');
        option.value = `./images/${image}`;
        option.textContent = image.replace(/\.(jpg|png)$/i, '').replace(/([A-Z])/g, ' $1').trim();
        imageSelect.appendChild(option);
    });
}

// Setup image preview on selection change
function setupImagePreview() {
    const imageSelect = document.getElementById('recipe-image');
    imageSelect.addEventListener('change', function() {
        const previewImg = document.getElementById('image-preview');
        if (this.value) {
            previewImg.src = this.value;
            previewImg.style.display = 'block';
        } else {
            previewImg.style.display = 'none';
        }
    });
}

// Add a new ingredient input
function addIngredient() {
    const ingredientsList = document.getElementById('ingredients-list');
    const newInput = document.createElement('div');
    newInput.className = 'input-with-button';
    newInput.innerHTML = `
        <input type="text" class="ingredient-input" placeholder="e.g., 400g spaghetti" required>
        <button type="button" class="btn-remove" onclick="removeIngredient(this)">Remove</button>
    `;
    ingredientsList.appendChild(newInput);
}

// Remove an ingredient input
function removeIngredient(button) {
    const ingredientsList = document.getElementById('ingredients-list');
    // Don't allow removing if it's the only ingredient
    if (ingredientsList.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('You must have at least one ingredient.');
    }
}

// Add a new instruction input
function addInstruction() {
    const instructionsList = document.getElementById('instructions-list');
    const newInput = document.createElement('div');
    newInput.className = 'input-with-button';
    newInput.innerHTML = `
        <input type="text" class="instruction-input" placeholder="e.g., Cook spaghetti until al dente" required>
        <button type="button" class="btn-remove" onclick="removeInstruction(this)">Remove</button>
    `;
    instructionsList.appendChild(newInput);
}

// Remove an instruction input
function removeInstruction(button) {
    const instructionsList = document.getElementById('instructions-list');
    // Don't allow removing if it's the only instruction
    if (instructionsList.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('You must have at least one instruction.');
    }
}

// Validate the form
function validateForm() {
    let isValid = true;
    const errors = {};

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => msg.classList.remove('show'));

    // Validate recipe name
    const name = document.getElementById('recipe-name').value.trim();
    if (!name) {
        errors.name = true;
        isValid = false;
    }

    // Validate image selection
    const image = document.getElementById('recipe-image').value.trim();
    if (!image) {
        errors.image = true;
        isValid = false;
    }

    // Validate ingredients
    const ingredientInputs = document.querySelectorAll('.ingredient-input');
    const ingredients = Array.from(ingredientInputs)
        .map(input => input.value.trim())
        .filter(ing => ing);
    if (ingredients.length === 0) {
        errors.ingredients = true;
        isValid = false;
    }

    // Validate instructions
    const instructionInputs = document.querySelectorAll('.instruction-input');
    const instructions = Array.from(instructionInputs)
        .map(input => input.value.trim())
        .filter(instr => instr);
    if (instructions.length === 0) {
        errors.instructions = true;
        isValid = false;
    }

    // Validate servings
    const servings = parseInt(document.getElementById('recipe-servings').value);
    if (isNaN(servings) || servings < 1) {
        errors.servings = true;
        isValid = false;
    }

    // Validate cooking time
    const time = parseInt(document.getElementById('recipe-time').value);
    if (isNaN(time) || time < 1) {
        errors.time = true;
        isValid = false;
    }

    // Show error messages
    if (errors.name) {
        document.getElementById('error-name').classList.add('show');
    }
    if (errors.image) {
        document.getElementById('error-image').classList.add('show');
    }
    if (errors.ingredients) {
        document.getElementById('error-ingredients').classList.add('show');
    }
    if (errors.instructions) {
        document.getElementById('error-instructions').classList.add('show');
    }
    if (errors.servings) {
        document.getElementById('error-servings').classList.add('show');
    }
    if (errors.time) {
        document.getElementById('error-time').classList.add('show');
    }

    return isValid;
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    // Validate form
    if (!validateForm()) {
        alert('Please fix the errors in the form before submitting.');
        return;
    }

    // Get form values
    const name = document.getElementById('recipe-name').value.trim();
    const image = document.getElementById('recipe-image').value.trim();
    
    // Collect ingredients
    const ingredientInputs = document.querySelectorAll('.ingredient-input');
    const ingredients = Array.from(ingredientInputs)
        .map(input => input.value.trim())
        .filter(ing => ing);

    // Collect instructions
    const instructionInputs = document.querySelectorAll('.instruction-input');
    const instructions = Array.from(instructionInputs)
        .map(input => input.value.trim())
        .filter(instr => instr);

    const servings = parseInt(document.getElementById('recipe-servings').value);
    const time = parseInt(document.getElementById('recipe-time').value);

    // Create recipe object in defined format
    const recipe = {
        name: name,
        image: image,
        ingredients: ingredients,
        instructions: instructions,
        servings: servings,
        time: time
    };

    // Get existing recipes from localStorage
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    // Add new recipe
    recipes.push(recipe);
    
    // Save to localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Show success message
    alert(`✅ Recipe "${recipe.name}" added successfully!`);
    
    // Reset form
    document.getElementById('recipe-form').reset();
    
    // Reset dynamic inputs to single ingredient and instruction
    document.getElementById('ingredients-list').innerHTML = `
        <div class="input-with-button">
            <input type="text" class="ingredient-input" placeholder="e.g., 400g spaghetti" required>
            <button type="button" class="btn-remove" onclick="removeIngredient(this)">Remove</button>
        </div>
    `;
    document.getElementById('instructions-list').innerHTML = `
        <div class="input-with-button">
            <input type="text" class="instruction-input" placeholder="e.g., Cook spaghetti until al dente" required>
            <button type="button" class="btn-remove" onclick="removeInstruction(this)">Remove</button>
        </div>
    `;
    
    // Hide image preview
    document.getElementById('image-preview').style.display = 'none';
    
    // Redirect to home page after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}
