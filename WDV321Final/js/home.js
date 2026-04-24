// Load and display recipes on home page
document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
});

async function loadRecipes() {
    // Get recipes from localStorage
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    // Seed from external JSON on first load, then fallback to built-in sample data.
    if (recipes.length === 0) {
        const loadedFromExternalData = await loadExternalSampleData();
        if (!loadedFromExternalData) {
            loadSampleData();
        }
        return;
    }

    displayRecipeList(recipes);
}

async function loadExternalSampleData() {
    try {
        const response = await fetch('./data/sample-data.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            return false;
        }

        localStorage.setItem('recipes', JSON.stringify(data));
        displayRecipeList(data);
        return true;
    } catch (error) {
        console.warn('Could not load external sample data, using fallback data.', error);
        return false;
    }
}

function displayRecipeList(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    if (recipes.length === 0) {
        recipeList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No recipes yet. Add one to get started!</p>';
        return;
    }

    recipes.forEach((recipe, index) => {
        const card = createRecipeCard(recipe, index);
        recipeList.appendChild(card);
    });
}

function createRecipeCard(recipe, index) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View recipe details for ${recipe.name}`);
    card.innerHTML = `
        <img src="${recipe.image || 'https://via.placeholder.com/280x200?text=Recipe'}" alt="${recipe.name}" class="recipe-image" onerror="this.src='https://via.placeholder.com/280x200?text=Recipe'">
        <div class="recipe-info">
            <div class="recipe-title">${recipe.name}</div>
            <div class="recipe-meta">⏱️ ${recipe.time} mins | 🍽️ ${recipe.servings} servings</div>
        </div>
    `;
    
    card.addEventListener('click', () => showRecipeDetail(index));
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showRecipeDetail(index);
        }
    });
    return card;
}

function showRecipeDetail(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes[index];
    
    const recipeList = document.getElementById('recipe-list');
    const recipeDetail = document.getElementById('recipe-detail');
    
    recipeList.classList.add('hidden');
    recipeDetail.classList.remove('hidden');
    
    const ingredientsList = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');
    const instructionsList = recipe.instructions.map(instr => `<li>${instr}</li>`).join('');
    
    recipeDetail.innerHTML = `
        <div class="recipe-detail-buttons">
            <button class="btn-back" onclick="goBackToList()">← Back</button>
            <button class="btn-edit" onclick="editRecipeServings(${index})">✏️ Edit Servings</button>
            <button class="btn-delete" onclick="deleteRecipe(${index})">🗑️ Delete</button>
        </div>
        <h2>${recipe.name}</h2>
        <img src="${recipe.image || 'https://via.placeholder.com/400x300?text=Recipe'}" alt="${recipe.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Recipe'">
        
        <div class="recipe-detail-section">
            <div class="section-header">
                <h3>📋 Ingredients</h3>
                <button type="button" class="toggle-section-btn" onclick="toggleDetailSection('ingredients-display', this)" aria-expanded="true">Hide</button>
            </div>
            <div id="ingredients-display" class="detail-content-panel">
                <ul>${ingredientsList}</ul>
            </div>
        </div>
        
        <div class="recipe-detail-section">
            <div class="section-header">
                <h3>👨‍🍳 Instructions</h3>
                <button type="button" class="toggle-section-btn" onclick="toggleDetailSection('instructions-display', this)" aria-expanded="true">Hide</button>
            </div>
            <div id="instructions-display" class="detail-content-panel">
                <ol>${instructionsList}</ol>
            </div>
        </div>
        
        <div class="recipe-detail-section">
            <h3>⏰ Details</h3>
            <p><strong>Cooking Time:</strong> ${recipe.time} minutes</p>
            <p><strong>Servings:</strong> <span id="servings-display">${recipe.servings}</span></p>
        </div>
    `;
}

function toggleDetailSection(sectionId, button) {
    const section = document.getElementById(sectionId);
    if (!section) {
        return;
    }

    section.classList.toggle('is-hidden');
    const isHidden = section.classList.contains('is-hidden');
    button.textContent = isHidden ? 'Show' : 'Hide';
    button.setAttribute('aria-expanded', String(!isHidden));
}

function goBackToList() {
    document.getElementById('recipe-list').classList.remove('hidden');
    document.getElementById('recipe-detail').classList.add('hidden');
}

function deleteRecipe(index) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.splice(index, 1);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        goBackToList();
        loadRecipes();
    }
}

function editRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes[index];
    const recipeDetail = document.getElementById('recipe-detail');
    
    recipeDetail.innerHTML = `
        <div class="recipe-detail-buttons">
            <button class="btn-back" onclick="showRecipeDetail(${index})">← Back</button>
            <button class="btn-submit" onclick="saveRecipeChanges(${index})">✅ Save Changes</button>
        </div>
        <h2>Edit Recipe</h2>
        <img id="edit-image-preview" src="${recipe.image || 'https://via.placeholder.com/400x300?text=Recipe'}" alt="${recipe.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
        
        <div class="recipe-detail-section">
            <h3>📝 Recipe Name</h3>
            <input type="text" id="edit-recipe-name" value="${recipe.name}" style="width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px;">
        </div>

        <div class="recipe-detail-section">
            <h3>🖼️ Recipe Image</h3>
            <select id="edit-recipe-image" onchange="updateEditImagePreview()" style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px;">
                ${[
                    'caesarsalad.jpg',
                    'oxtalestew.jpg',
                    'pineapplecake.jpg',
                    'SpaghettiCarbonara.jpg',
                    'SpaghettiCarbonara.png',
                    'tomatoesoup.jpg',
                    'zucchinibread.jpg'
                ].map(img => `<option value="./images/${img}" ${recipe.image === './images/' + img ? 'selected' : ''}>${img.replace(/\.(jpg|png)$/i, '').replace(/([A-Z])/g, ' $1').trim()}</option>`).join('')}
            </select>
        </div>

        <div class="recipe-detail-section">
            <h3>🔧 Adjust Servings</h3>
            <div style="margin: 15px 0;">
                <label for="edit-servings-input">Number of Servings:</label>
                <input type="number" id="edit-servings-input" min="1" value="${recipe.servings}" style="margin: 10px 0; padding: 8px; font-size: 16px; width: 100px;">
                <button onclick="updateRecipeIngredients(${index})" style="margin-left: 10px; padding: 8px 15px; cursor: pointer;">Update Quantities</button>
            </div>
        </div>
        
        <div class="recipe-detail-section">
            <h3>📋 Ingredients</h3>
            <div id="scaled-ingredients">
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="recipe-detail-section">
            <h3>👨‍🍳 Instructions</h3>
            <div id="edit-instructions" style="background: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #ddd;">
                ${recipe.instructions.map((instr, idx) => `
                    <div class="instruction-item" style="margin-bottom: 12px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e0e0e0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label style="font-weight: bold;">Step ${idx + 1}:</label>
                            <button type="button" class="btn-remove" style="background-color: #e74c3c; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;" onclick="removeInstructionField(this)">Remove</button>
                        </div>
                        <input type="text" class="edit-instruction-input" value="${instr}" style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px;" required>
                    </div>
                `).join('')}
            </div>
            <button type="button" style="background-color: #27ae60; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 10px;" onclick="addInstructionField()">+ Add Instruction</button>
        </div>
        
        <div class="recipe-detail-section">
            <h3>⏰ Details</h3>
            <p><strong>Original Servings:</strong> ${recipe.servings}</p>
            <p><strong>Adjusted Servings:</strong> <span id="adjusted-servings">${recipe.servings}</span></p>
        </div>
    `;
}

// Keep the old function name for backward compatibility
function editRecipeServings(index) {
    editRecipe(index);
}

function updateEditImagePreview() {
    const select = document.getElementById('edit-recipe-image');
    const preview = document.getElementById('edit-image-preview');
    preview.src = select.value;
}

function scaleIngredient(ingredient, scaleFactor) {
    // Find numeric values in the ingredient string
    const numberPattern = /(\d+\.?\d*)\s*([a-zA-Z]*)/;
    const match = ingredient.match(numberPattern);
    
    if (match) {
        const originalQuantity = parseFloat(match[1]);
        const unit = match[2];
        const scaledQuantity = (originalQuantity * scaleFactor).toFixed(2).replace(/\.?0+$/, '');
        const description = ingredient.substring(match[0].length).trim();
        
        return `${scaledQuantity}${unit ? ' ' + unit : ''} ${description}`;
    }
    
    return ingredient;
}

function updateRecipeIngredients(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes[index];
    const newServings = parseInt(document.getElementById('edit-servings-input').value);
    
    if (newServings < 1) {
        alert('Please enter a valid number of servings');
        return;
    }
    
    const scaleFactor = newServings / recipe.servings;
    const scaledIngredients = recipe.ingredients.map(ing => scaleIngredient(ing, scaleFactor));
    
    const scaledIngredientsHTML = scaledIngredients.map(ing => `<li>${ing}</li>`).join('');
    document.getElementById('scaled-ingredients').innerHTML = `<ul>${scaledIngredientsHTML}</ul>`;
    document.getElementById('adjusted-servings').textContent = newServings;
}

function saveRecipeChanges(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    // Validate inputs
    const newName = document.getElementById('edit-recipe-name').value.trim();
    if (!newName) {
        alert('Recipe name cannot be empty');
        return;
    }

    const instructionInputs = document.querySelectorAll('.edit-instruction-input');
    const instructions = Array.from(instructionInputs)
        .map(input => input.value.trim())
        .filter(instr => instr);
    
    if (instructions.length === 0) {
        alert('At least one instruction is required');
        return;
    }

    const newServings = parseInt(document.getElementById('edit-servings-input').value);
    if (newServings < 1) {
        alert('Servings must be at least 1');
        return;
    }

    const newImage = document.getElementById('edit-recipe-image').value;

    // Update recipe object
    recipes[index].name = newName;
    recipes[index].image = newImage;
    recipes[index].instructions = instructions;
    recipes[index].servings = newServings;

    // Save to localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Show success message and redirect
    alert('✅ Recipe updated successfully!');
    showRecipeDetail(index);
}

function addInstructionField() {
    const instructionsContainer = document.getElementById('edit-instructions');
    const itemCount = instructionsContainer.querySelectorAll('.instruction-item').length;
    const newStep = itemCount + 1;
    
    const newInstructionDiv = document.createElement('div');
    newInstructionDiv.className = 'instruction-item';
    newInstructionDiv.style.cssText = 'margin-bottom: 12px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e0e0e0;';
    newInstructionDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="font-weight: bold;">Step ${newStep}:</label>
            <button type="button" class="btn-remove" style="background-color: #e74c3c; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;" onclick="removeInstructionField(this)">Remove</button>
        </div>
        <input type="text" class="edit-instruction-input" placeholder="Enter instruction step" style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px;" required>
    `;
    
    instructionsContainer.appendChild(newInstructionDiv);
    updateInstructionStepNumbers();
}

function removeInstructionField(button) {
    const instructionsContainer = document.getElementById('edit-instructions');
    const items = instructionsContainer.querySelectorAll('.instruction-item');
    
    // Don't allow removing if it's the only instruction
    if (items.length > 1) {
        button.closest('.instruction-item').remove();
        updateInstructionStepNumbers();
    } else {
        alert('You must have at least one instruction.');
    }
}

function updateInstructionStepNumbers() {
    const instructionsContainer = document.getElementById('edit-instructions');
    const items = instructionsContainer.querySelectorAll('.instruction-item');
    
    items.forEach((item, idx) => {
        const label = item.querySelector('label');
        label.textContent = `Step ${idx + 1}:`;
    });
}

// Sample data for testing. It's added on first load if no recipes are found in localStorage. You can remove this function and its call if you want to start with an empty recipe list.
function loadSampleData() {
    const sampleRecipes = [
        {
            name: 'Spaghetti Carbonara',
            image: './images/SpaghettiCarbonara.png',
            ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', '100g Parmesan cheese', 'Black pepper', 'Salt'],
            instructions: ['Cook spaghetti until al dente', 'Fry pancetta until crispy', 'Mix eggs with grated cheese', 'Combine all ingredients', 'Season with pepper and serve'],
            time: 20,
            servings: 4
        },
        {
            name: 'Caesar Salad',
            image: './images/caesarsalad.jpg',
            ingredients: ['2 romaine lettuces', 'Parmesan cheese', '1 cup croutons', '4 cloves garlic', '2 tbsp olive oil', 'Lemon juice'],
            instructions: ['Wash and chop romaine lettuce', 'Make Caesar dressing', 'Toss lettuce with dressing', 'Add croutons and cheese', 'Serve immediately'],
            time: 15,
            servings: 4
        },
        {
            name: 'Tomato Soup',
            image: './images/tomatoesoup.jpg',
            ingredients: ['1kg tomatoes', '2 onions', '4 cloves garlic', '1L vegetable broth', 'Cream', 'Basil'],
            instructions: ['Chop tomatoes and onions', 'Sauté garlic and onions', 'Add tomatoes and broth', 'Simmer for 20 minutes', 'Blend smooth', 'Add cream and serve'],
            time: 35,
            servings: 4
        },
        {
            name: 'Pineapple Cake',
            image: './images/pineapplecake.jpg',
            ingredients: [
                'Cake:',
                '2 1/2 cups all-purpose flour',
                '1 1/2 cups granulated sugar',
                '1 cup buttermilk (or milk + 1 tbsp vinegar)',
                '1/2 cup unsalted butter, softened',
                '1/2 cup vegetable oil',
                '4 egg whites',
                '1 tablespoon baking powder',
                '1/2 teaspoon salt',
                '1 teaspoon vanilla extract',
                '1 cup crushed pineapple, drained (reserve juice)',
                'Pineapple Syrup (optional but amazing):',
                '1/2 cup reserved pineapple juice',
                '1/4 cup sugar',
                'Frosting (Pineapple Cream Cheese):',
                '8 oz cream cheese, softened',
                '1/2 cup unsalted butter, softened',
                '3 cups powdered sugar',
                '2-3 tablespoons pineapple juice',
                '1/2 cup crushed pineapple, well drained',
                '1 teaspoon vanilla'
            ],
            instructions: [
                '1. Make the Cake: Preheat oven to 350F (175C).',
                'Grease and flour two 8-inch round pans or a 9x13 pan.',
                'In a large bowl, beat butter, oil, and sugar until fluffy.',
                'Add egg whites and vanilla; mix until smooth.',
                'In a separate bowl, whisk flour, baking powder, and salt.',
                'Add dry ingredients to the wet mixture, alternating with buttermilk.',
                'Fold in the drained crushed pineapple.',
                'Pour into pans and bake 25-30 minutes or until a toothpick comes out clean.',
                'Cool completely.',
                '2. Pineapple Syrup (Optional): Heat pineapple juice and sugar in a small saucepan.',
                'Simmer 3-4 minutes until slightly thickened.',
                'Brush over warm cake layers.',
                '3. Frosting: Beat cream cheese and butter until smooth.',
                'Add powdered sugar gradually.',
                'Mix in pineapple juice, vanilla, and crushed pineapple.',
                'Chill 10 minutes to firm up.',
                '4. Assemble: Spread frosting between layers.',
                'Frost the outside.',
                'Decorate with pineapple chunks or coconut if desired.'
            ],
            time: 55,
            servings: 12
        },
        {
            name: 'Zucchini Bread',
            image: './images/zucchinibread.jpg',
            ingredients: [
                '2 cups all-purpose flour',
                '1 teaspoon baking soda',
                '1 teaspoon baking powder',
                '1/2 teaspoon salt',
                '1 teaspoon ground cinnamon',
                '2 eggs',
                '1 cup granulated sugar',
                '1/2 cup vegetable oil',
                '1 teaspoon vanilla extract',
                '2 cups grated zucchini'
            ],
            instructions: [
                'Preheat oven to 350F (175C). Grease a loaf pan.',
                'Whisk flour, baking soda, baking powder, salt, and cinnamon in a bowl.',
                'In another bowl, beat eggs, sugar, oil, and vanilla until combined.',
                'Stir dry ingredients into wet ingredients until just mixed.',
                'Fold in grated zucchini.',
                'Pour batter into pan and bake 50-60 minutes, until a toothpick comes out clean.',
                'Cool in the pan for 10 minutes, then transfer to a rack to cool completely.'
            ],
            time: 70,
            servings: 10
        },
        {
            name: 'Ox Tale Stew',
            image: './images/oxtalestew.jpg',
            ingredients: [
                '3 lbs oxtail pieces',
                '2 tablespoons vegetable oil',
                '1 large onion, chopped',
                '3 carrots, sliced',
                '3 celery stalks, sliced',
                '4 cloves garlic, minced',
                '2 tablespoons tomato paste',
                '4 cups beef broth',
                '1 cup red wine or extra broth',
                '3 potatoes, cut into chunks',
                '2 teaspoons thyme',
                '2 bay leaves',
                '1 teaspoon smoked paprika',
                'Salt',
                'Black pepper'
            ],
            instructions: [
                'Season oxtail with salt and pepper.',
                'Heat oil in a large Dutch oven and brown the oxtail on all sides, then remove and set aside.',
                'Add onion, carrots, and celery to the pot and cook until softened.',
                'Stir in garlic and tomato paste and cook for 1 minute.',
                'Pour in beef broth and red wine, scraping up any browned bits from the bottom of the pot.',
                'Return oxtail to the pot and add thyme, bay leaves, and smoked paprika.',
                'Bring to a simmer, cover, and cook on low heat for 2 1/2 to 3 hours until the meat is tender.',
                'Add potatoes during the last 40 minutes of cooking and simmer until fork-tender.',
                'Taste and adjust seasoning, then serve hot.'
            ],
            time: 210,
            servings: 6
        }
    ];

    localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
    displayRecipeList(sampleRecipes);
}
