class RecipeValidator {
  static validate(recipe) {
    const errors = []

    // 1. Check required fields
    const requiredFields = ['title', 'description', 'ingredients', 'steps', 'prepTime', 'cookTime', 'totalTime', 'difficulty', 'servings', 'cuisine']
    for (const field of requiredFields) {
      if (!recipe[field] || (Array.isArray(recipe[field]) && recipe[field].length === 0)) {
        errors.push(`Missing required field: ${field}`)
      }
    }

    // 2. Validate ingredients structure
    if (recipe.ingredients) {
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = recipe.ingredients[i]
        if (!ingredient.name || !ingredient.quantity) {
          errors.push(`Ingredient ${i + 1} missing name or quantity`)
        }
      }
    }

    // 3. Validate steps reference ingredients
    if (recipe.ingredients && recipe.steps) {
      const ingredientNames = recipe.ingredients.map(ing => ing.name.toLowerCase())
      
      for (let i = 0; i < recipe.steps.length; i++) {
        const step = recipe.steps[i].toLowerCase()
        
        // Only check for ingredients that should be in THIS specific recipe
        // Don't cross-reference with other recipes
        const stepIngredients = []
        
        // Extract potential ingredient mentions from the step
        if (step.includes('chicken') && ingredientNames.some(name => name.includes('chicken'))) {
          stepIngredients.push('chicken')
        }
        if (step.includes('paneer') && ingredientNames.some(name => name.includes('paneer'))) {
          stepIngredients.push('paneer')
        }
        if (step.includes('egg') && ingredientNames.some(name => name.includes('egg'))) {
          stepIngredients.push('egg')
        }
        if (step.includes('rice') && ingredientNames.some(name => name.includes('rice'))) {
          stepIngredients.push('rice')
        }
        if (step.includes('pasta') && ingredientNames.some(name => name.includes('pasta'))) {
          stepIngredients.push('pasta')
        }
        if (step.includes('noodles') && ingredientNames.some(name => name.includes('noodles'))) {
          stepIngredients.push('noodles')
        }
        if (step.includes('bread') && ingredientNames.some(name => name.includes('bread'))) {
          stepIngredients.push('bread')
        }
        if (step.includes('cheese') && ingredientNames.some(name => name.includes('cheese'))) {
          stepIngredients.push('cheese')
        }
        if (step.includes('potato') && ingredientNames.some(name => name.includes('potato'))) {
          stepIngredients.push('potato')
        }
        if (step.includes('tomato') && ingredientNames.some(name => name.includes('tomato'))) {
          stepIngredients.push('tomato')
        }
        if (step.includes('onion') && ingredientNames.some(name => name.includes('onion'))) {
          stepIngredients.push('onion')
        }
        if (step.includes('garlic') && ingredientNames.some(name => name.includes('garlic'))) {
          stepIngredients.push('garlic')
        }
        if (step.includes('ginger') && ingredientNames.some(name => name.includes('ginger'))) {
          stepIngredients.push('ginger')
        }
        if (step.includes('cream') && ingredientNames.some(name => name.includes('cream'))) {
          stepIngredients.push('cream')
        }
        if (step.includes('butter') && ingredientNames.some(name => name.includes('butter'))) {
          stepIngredients.push('butter')
        }
        
        // Check if step mentions an ingredient that's not in this recipe
        const commonIngredients = ['chicken', 'paneer', 'egg', 'rice', 'pasta', 'noodles', 'bread', 'cheese', 'potato', 'tomato', 'onion', 'garlic', 'ginger', 'cream', 'butter']
        
        for (const commonIng of commonIngredients) {
          if (step.includes(commonIng) && !ingredientNames.some(name => name.includes(commonIng))) {
            errors.push(`Step ${i + 1} mentions "${commonIng}" but it's not in ingredients list`)
          }
        }
      }
    }

    // 4. Validate consistency between title and main ingredients
    if (recipe.title && recipe.ingredients) {
      const title = recipe.title.toLowerCase()
      const ingredientNames = recipe.ingredients.map(ing => ing.name.toLowerCase())
      
      // Check for contradictions
      if (title.includes('chicken') && !ingredientNames.some(name => name.includes('chicken'))) {
        errors.push('Recipe title mentions chicken but no chicken in ingredients')
      }
      if (title.includes('paneer') && !ingredientNames.some(name => name.includes('paneer'))) {
        errors.push('Recipe title mentions paneer but no paneer in ingredients')
      }
      if (title.includes('egg') && !ingredientNames.some(name => name.includes('egg'))) {
        errors.push('Recipe title mentions egg but no egg in ingredients')
      }
      if (title.includes('rice') && !ingredientNames.some(name => name.includes('rice'))) {
        errors.push('Recipe title mentions rice but no rice in ingredients')
      }
      if (title.includes('pasta') && !ingredientNames.some(name => name.includes('pasta'))) {
        errors.push('Recipe title mentions pasta but no pasta in ingredients')
      }
      if (title.includes('noodles') && !ingredientNames.some(name => name.includes('noodles'))) {
        errors.push('Recipe title mentions noodles but no noodles in ingredients')
      }
    }

    // 5. Validate time consistency
    if (recipe.prepTime && recipe.cookTime && recipe.totalTime) {
      const prep = this.parseTime(recipe.prepTime)
      const cook = this.parseTime(recipe.cookTime)
      const total = this.parseTime(recipe.totalTime)
      
      if (prep !== null && cook !== null && total !== null) {
        if (total < (prep + cook)) {
          errors.push('Total time is less than prep time + cook time')
        }
      }
    }

    // 6. Validate category-specific logic
    this.validateCategoryLogic(recipe, errors)

    // 7. Validate ingredient matching logic
    if (recipe.matchedIngredients && recipe.missingIngredients) {
      // Check if matchedIngredients are actually in the recipe
      for (const matched of recipe.matchedIngredients) {
        if (!recipe.ingredients.some(ing => ing.name.toLowerCase().includes(matched.toLowerCase()))) {
          errors.push(`Matched ingredient "${matched}" is not in the recipe ingredients`)
        }
      }
      
      // Check if missingIngredients are actually missing from user selection
      if (recipe.missingIngredients.length > 3) {
        errors.push('Too many missing ingredients - should be 3 or fewer')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static parseTime(timeString) {
    // Extract numeric value from time strings like "20 mins", "1 hour", etc.
    const match = timeString.match(/(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  static validateCategoryLogic(recipe, errors) {
    const category = recipe.category?.toLowerCase()
    const steps = recipe.steps || []
    const ingredients = recipe.ingredients || []

    if (category === 'curry') {
      // Curry recipes should have curry-like steps
      const hasCurrySteps = steps.some(step => 
        step.toLowerCase().includes('simmer') || 
        step.toLowerCase().includes('gravy') ||
        step.toLowerCase().includes('sauce')
      )
      if (!hasCurrySteps) {
        errors.push('Curry recipe should have simmering or gravy-making steps')
      }
    }

    if (category === 'rice') {
      // Rice recipes should mention rice cooking
      const hasRiceSteps = steps.some(step => 
        step.toLowerCase().includes('rice') || 
        step.toLowerCase().includes('steam') ||
        step.toLowerCase().includes('cook rice')
      )
      if (!hasRiceSteps) {
        errors.push('Rice recipe should mention rice cooking steps')
      }
    }

    if (category === 'pasta') {
      // Pasta recipes should mention boiling pasta
      const hasPastaSteps = steps.some(step => 
        step.toLowerCase().includes('pasta') || 
        step.toLowerCase().includes('boil') ||
        step.toLowerCase().includes('al dente')
      )
      if (!hasPastaSteps) {
        errors.push('Pasta recipe should mention boiling pasta')
      }
    }

    if (category === 'sandwich') {
      // Sandwich recipes should mention bread
      const hasBreadIngredients = ingredients.some(ing => 
        ing.name.toLowerCase().includes('bread')
      )
      if (!hasBreadIngredients) {
        errors.push('Sandwich recipe should include bread in ingredients')
      }
    }

    if (category === 'breakfast') {
      // Breakfast recipes should have breakfast-appropriate timing
      const prep = this.parseTime(recipe.prepTime || '')
      const cook = this.parseTime(recipe.cookTime || '')
      const total = this.parseTime(recipe.totalTime || '')
      
      if (total !== null && total > 30) {
        errors.push('Breakfast recipes should ideally be ready within 30 minutes')
      }
    }
  }

  static sanitizeRecipe(recipe) {
    // Create a clean copy with only valid fields
    const sanitized = {
      title: recipe.title || "Untitled Recipe",
      description: recipe.description || "A delicious recipe",
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      prepTime: recipe.prepTime || "10 mins",
      cookTime: recipe.cookTime || "20 mins",
      totalTime: recipe.totalTime || "30 mins",
      difficulty: recipe.difficulty || "Easy",
      servings: recipe.servings || "2",
      cuisine: recipe.cuisine || "International",
      tips: recipe.tips || [],
      category: recipe.category || "main",
      tags: recipe.tags || [],
      // Preserve ingredient breakdown fields
      generatedFrom: recipe.generatedFrom,
      matchedType: recipe.matchedType,
      matchedIngredients: recipe.matchedIngredients || [],
      missingIngredients: recipe.missingIngredients || [],
      optionalIngredients: recipe.optionalIngredients || [],
      needsAddOns: recipe.needsAddOns || false,
      addOnMessage: recipe.addOnMessage || null,
      matchScore: recipe.matchScore
    }

    return sanitized
  }
}

module.exports = RecipeValidator
