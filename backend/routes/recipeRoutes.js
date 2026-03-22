const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')

// Get available ingredients
router.get('/ingredients', recipeController.getIngredients)

// Get recipe by ingredients
router.post('/recipe/by-ingredients', recipeController.getRecipeByIngredients)

// Get recipe by description
router.post('/recipe/by-description', recipeController.getRecipeByDescription)

// Get fallback recipes
router.get('/recipes/fallback', recipeController.getFallbackRecipes)

module.exports = router
