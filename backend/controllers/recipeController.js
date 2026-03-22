const { generateRecipeFromIngredients } = require('../utils/recipeGenerator')
const { generateRecipeFromDescription } = require('../utils/recipeGenerator')
const { ingredients } = require('../data/ingredients')
const { recipeTemplates } = require('../data/recipeTemplates')

const getIngredients = (req, res) => {
  try {
    res.json({
      success: true,
      ingredients: ingredients
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ingredients'
    })
  }
}

const getRecipeByIngredients = (req, res) => {
  try {
    const { ingredients: userIngredients } = req.body
    
    if (!userIngredients || !Array.isArray(userIngredients) || userIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient'
      })
    }

    const recipe = generateRecipeFromIngredients(userIngredients)
    
    // Structure the response to clearly show ingredient relationships
    const response = {
      success: true,
      recipe: {
        ...recipe,
        // Include ingredient breakdown in recipe object for frontend access
        userIngredients: userIngredients,
        matchedIngredients: recipe.matchedIngredients || [],
        missingIngredients: recipe.missingIngredients || [],
        optionalIngredients: recipe.optionalIngredients || [],
        needsAddOns: recipe.needsAddOns || false,
        addOnMessage: recipe.addOnMessage || null
      },
      // Also include at top level for easier access
      userIngredients: userIngredients,
      matchedIngredients: recipe.matchedIngredients || [],
      missingIngredients: recipe.missingIngredients || [],
      optionalIngredients: recipe.optionalIngredients || [],
      needsAddOns: recipe.needsAddOns || false,
      addOnMessage: recipe.addOnMessage || null
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error generating recipe from ingredients:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate recipe'
    })
  }
}

const getRecipeByDescription = (req, res) => {
  try {
    const { description } = req.body
    
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description of what you want to cook'
      })
    }

    const recipe = generateRecipeFromDescription(description.trim())
    
    res.json({
      success: true,
      recipe
    })
  } catch (error) {
    console.error('Error generating recipe from description:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate recipe'
    })
  }
}

const getFallbackRecipes = (req, res) => {
  try {
    res.json({
      success: true,
      recipes: recipeTemplates.slice(0, 10) // Return first 10 recipes as fallback
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fallback recipes'
    })
  }
}

module.exports = {
  getIngredients,
  getRecipeByIngredients,
  getRecipeByDescription,
  getFallbackRecipes
}
