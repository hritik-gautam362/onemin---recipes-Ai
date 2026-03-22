const RecipeMatcher = require('./recipeMatcher')
const RecipeValidator = require('./recipeValidator')

const recipeMatcher = new RecipeMatcher()

// Recipe generation based on ingredients
const generateRecipeFromIngredients = (ingredients) => {
  try {
    const recipe = recipeMatcher.matchByIngredients(ingredients)
    const validation = RecipeValidator.validate(recipe)
    
    if (!validation.isValid) {
      console.warn('Recipe validation warnings:', validation.errors)
    }
    
    return RecipeValidator.sanitizeRecipe(recipe)
  } catch (error) {
    console.error('Error generating recipe from ingredients:', error)
    return getEmergencyFallbackRecipe()
  }
}

// Recipe generation based on description
const generateRecipeFromDescription = (description) => {
  try {
    const recipe = recipeMatcher.matchByDescription(description)
    const validation = RecipeValidator.validate(recipe)
    
    if (!validation.isValid) {
      console.warn('Recipe validation warnings:', validation.errors)
    }
    
    return RecipeValidator.sanitizeRecipe(recipe)
  } catch (error) {
    console.error('Error generating recipe from description:', error)
    return getEmergencyFallbackRecipe()
  }
}

// Emergency fallback recipe
const getEmergencyFallbackRecipe = () => {
  return {
    title: "Simple Vegetable Dish",
    description: "Here's a tasty idea based on your craving! A simple and delicious vegetable preparation.",
    ingredients: [
      { name: "mixed vegetables", quantity: "2 cups" },
      { name: "onion", quantity: "1 medium, chopped" },
      { name: "garlic", quantity: "2 cloves, minced" },
      { name: "oil", quantity: "2 tablespoons" },
      { name: "spices", quantity: "to taste" }
    ],
    steps: [
      "Heat oil in a pan over medium heat.",
      "Add chopped onions and sauté until golden brown.",
      "Add minced garlic and cook for 1 minute until fragrant.",
      "Add mixed vegetables and stir-fry for 5-7 minutes.",
      "Season with your favorite spices and salt.",
      "Cover and cook until vegetables are tender.",
      "Serve hot with rice or bread!"
    ],
    prepTime: "10 mins",
    cookTime: "15 mins",
    totalTime: "25 mins",
    difficulty: "Easy",
    servings: "2-3",
    cuisine: "International",
    tips: [
      "Use any seasonal vegetables you have available.",
      "Adjust spices according to your preference.",
      "Add a squeeze of lemon juice for extra freshness."
    ],
    generatedFrom: 'emergency_fallback'
  }
}

module.exports = {
  generateRecipeFromIngredients,
  generateRecipeFromDescription
}
