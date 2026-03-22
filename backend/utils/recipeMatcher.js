const { recipeTemplates } = require('../data/recipeTemplates')

class RecipeMatcher {
  constructor() {
    this.exactMatches = {
      'butter chicken': 'butter-chicken',
      'butterchicken': 'butter-chicken',
      'paneer butter masala': 'paneer-butter-masala',
      'paneer butter masala': 'paneer-butter-masala',
      'egg fried rice': 'egg-fried-rice',
      'eggfriedrice': 'egg-fried-rice',
      'fried rice': 'egg-fried-rice',
      'grilled cheese': 'grilled-cheese',
      'grilledcheese': 'grilled-cheese',
      'cheese sandwich': 'grilled-cheese',
      'pasta': 'pasta',
      'tomato pasta': 'pasta',
      'noodles': 'noodles',
      'veg noodles': 'noodles',
      'vegetable noodles': 'noodles',
      'biryani': 'biryani',
      'veg biryani': 'biryani',
      'vegetable biryani': 'biryani'
    }

    this.intentKeywords = {
      spicy: ['spicy', 'hot', 'chili', 'pepper', 'curry'],
      healthy: ['healthy', 'light', 'low fat', 'nutritious', 'fresh'],
      quick: ['quick', 'fast', 'easy', 'simple', 'ready'],
      breakfast: ['breakfast', 'morning', 'brunch'],
      dinner: ['dinner', 'lunch', 'meal', 'supper'],
      snack: ['snack', 'finger food', 'bite', 'quick bite'],
      vegetarian: ['vegetarian', 'veg', 'meatless'],
      chicken: ['chicken'],
      paneer: ['paneer'],
      egg: ['egg', 'eggs'],
      cheese: ['cheese', 'cheesy'],
      rice: ['rice'],
      pasta: ['pasta'],
      noodles: ['noodles', 'noodle']
    }
  }

  matchByDescription(description) {
    const desc = description.toLowerCase().trim()
    
    // 1. Check for exact recipe name matches
    for (const [phrase, recipeId] of Object.entries(this.exactMatches)) {
      if (desc === phrase || desc.includes(phrase)) {
        const recipe = recipeTemplates.find(r => r.id === recipeId)
        if (recipe) {
          return {
            ...recipe,
            generatedFrom: 'description',
            matchedType: 'exact',
            matchedPhrase: phrase
          }
        }
      }
    }

    // 2. Analyze intent and find best matching recipe
    const intent = this.analyzeIntent(desc)
    const bestMatch = this.findBestRecipeByIntent(intent)
    
    if (bestMatch) {
      return {
        ...bestMatch,
        generatedFrom: 'description',
        matchedType: 'intent',
        detectedIntents: Object.keys(intent).filter(key => intent[key])
      }
    }

    // 3. Fallback to most relevant recipe
    return this.getFallbackRecipe(desc)
  }

  matchByIngredients(ingredients) {
    const normalizedIngredients = ingredients.map(i => i.toLowerCase().trim())
    
    // Step 1: Calculate weighted scores for all recipes
    const scoredRecipes = recipeTemplates.map(recipe => {
      const score = this.calculateWeightedScore(normalizedIngredients, recipe)
      return { recipe, score }
    })

    // Step 2: Sort by score (highest first)
    scoredRecipes.sort((a, b) => b.score - a.score)

    // Step 3: Find the best recipe with a meaningful score
    const bestCandidate = scoredRecipes[0]
    
    if (bestCandidate.score >= 50) {
      // Strong match found - return this recipe
      const recipe = bestCandidate.recipe
      const matchedIngredients = recipe.requiredIngredients.filter(ing => 
        normalizedIngredients.includes(ing.toLowerCase())
      )
      const missingIngredients = recipe.requiredIngredients.filter(ing => 
        !normalizedIngredients.includes(ing.toLowerCase())
      )

      return {
        ...recipe,
        generatedFrom: 'ingredients',
        matchedType: 'weighted_match',
        matchedIngredients,
        missingIngredients,
        optionalIngredients: recipe.optionalIngredients || [],
        needsAddOns: missingIngredients.length > 0,
        addOnMessage: missingIngredients.length > 0 ? 
          "You can make this with a few add-ons." : null,
        matchScore: bestCandidate.score
      }
    }

    // Step 4: If no strong match, try exact combinations
    const exactMatches = this.findExactIngredientMatches(normalizedIngredients)
    if (exactMatches.length > 0) {
      const bestMatch = exactMatches[0]
      return {
        ...bestMatch,
        generatedFrom: 'ingredients',
        matchedType: 'exact',
        matchedIngredients: bestMatch.requiredIngredients.filter(ing => 
          normalizedIngredients.includes(ing.toLowerCase())
        ),
        missingIngredients: [],
        optionalIngredients: bestMatch.optionalIngredients || [],
        needsAddOns: false,
        matchScore: 100
      }
    }

    // Step 5: No suitable match found - return fallback
    return this.getIngredientFallbackRecipe(normalizedIngredients)
  }

  calculateWeightedScore(userIngredients, recipe) {
    let score = 0
    const coreIngredients = this.getCoreIngredients(recipe.id)
    const supportingIngredients = this.getSupportingIngredients(recipe.id)
    const optionalIngredients = recipe.optionalIngredients || []

    // Core ingredient matching (highest weight)
    for (const core of coreIngredients) {
      if (userIngredients.includes(core.toLowerCase())) {
        score += 30 // High weight for core ingredients
      }
    }

    // Supporting ingredient matching (medium weight)
    for (const supporting of supportingIngredients) {
      if (userIngredients.includes(supporting.toLowerCase())) {
        score += 15 // Medium weight for supporting ingredients
      }
    }

    // Optional ingredient matching (low weight)
    for (const optional of optionalIngredients) {
      if (userIngredients.includes(optional.toLowerCase())) {
        score += 5 // Low weight for optional ingredients
      }
    }

    // Required ingredient overlap bonus
    const requiredMatches = recipe.requiredIngredients.filter(ing => 
      userIngredients.includes(ing.toLowerCase())
    ).length
    const requiredPercentage = requiredMatches / recipe.requiredIngredients.length
    
    if (requiredPercentage >= 0.8) {
      score += 25 // Bonus for high required ingredient overlap
    } else if (requiredPercentage >= 0.6) {
      score += 15 // Moderate bonus for decent overlap
    } else if (requiredPercentage >= 0.4) {
      score += 5 // Small bonus for some overlap
    }

    // Penalty for too many missing core ingredients
    const missingCore = coreIngredients.filter(core => 
      !userIngredients.includes(core.toLowerCase())
    ).length
    if (missingCore > 0) {
      score -= missingCore * 20 // Heavy penalty for missing core ingredients
    }

    // Penalty for weak generic recipes when user has many ingredients
    if (this.isWeakGenericRecipe(recipe.id) && userIngredients.length >= 4) {
      score -= 30 // Penalize weak recipes when user has good ingredients
    }

    // Bonus for recipe complexity matching user ingredient count
    if (userIngredients.length >= 6 && recipe.difficulty === 'Medium') {
      score += 10
    } else if (userIngredients.length >= 8 && recipe.difficulty === 'Medium') {
      score += 15
    }

    return Math.max(0, score) // Ensure score doesn't go negative
  }

  getCoreIngredients(recipeId) {
    const coreMap = {
      'butter-chicken': ['chicken'],
      'paneer-butter-masala': ['paneer'],
      'egg-fried-rice': ['egg', 'rice'],
      'grilled-cheese': ['bread', 'cheese'],
      'pasta': ['pasta'],
      'noodles': ['noodles'],
      'biryani': ['rice'],
      'masala-omelette': ['egg'],
      'aloo-fry': ['potato']
    }
    return coreMap[recipeId] || []
  }

  getSupportingIngredients(recipeId) {
    const supportingMap = {
      'butter-chicken': ['butter', 'cream', 'tomato'],
      'paneer-butter-masala': ['butter', 'cream', 'tomato'],
      'egg-fried-rice': ['onion', 'soy sauce'],
      'grilled-cheese': ['butter'],
      'pasta': ['tomato', 'garlic'],
      'noodles': ['vegetables', 'soy sauce'],
      'biryani': ['vegetables', 'yogurt'],
      'masala-omelette': ['onion', 'turmeric'],
      'aloo-fry': ['onion', 'spices']
    }
    return supportingMap[recipeId] || []
  }

  isWeakGenericRecipe(recipeId) {
    // These are fallback recipes that should only appear when no good match exists
    const weakRecipes = ['simple-onion-dish', 'basic-tomato-saute', 'garlic-fry', 'simple-vegetable-dish']
    return weakRecipes.includes(recipeId)
  }

  findExactIngredientMatches(normalizedIngredients) {
    const matches = []

    // Define exact ingredient combinations
    const exactCombinations = [
      {
        ingredients: ['bread', 'cheese'],
        recipeId: 'grilled-cheese'
      },
      {
        ingredients: ['egg', 'onion', 'tomato'],
        recipeId: 'masala-omelette'
      },
      {
        ingredients: ['egg', 'rice', 'onion'],
        recipeId: 'egg-fried-rice'
      },
      {
        ingredients: ['egg', 'rice'],
        recipeId: 'egg-fried-rice'
      },
      {
        ingredients: ['paneer', 'onion', 'tomato'],
        recipeId: 'paneer-butter-masala'
      },
      {
        ingredients: ['paneer', 'tomato'],
        recipeId: 'paneer-butter-masala'
      },
      {
        ingredients: ['noodles', 'vegetables'],
        recipeId: 'noodles'
      },
      {
        ingredients: ['potato', 'onion'],
        recipeId: 'aloo-fry'
      },
      {
        ingredients: ['chicken', 'onion', 'tomato'],
        recipeId: 'butter-chicken'
      },
      {
        ingredients: ['pasta', 'tomato'],
        recipeId: 'pasta'
      },
      {
        ingredients: ['rice', 'vegetables'],
        recipeId: 'biryani'
      }
    ]

    for (const combo of exactCombinations) {
      if (combo.ingredients.every(ing => normalizedIngredients.includes(ing))) {
        const recipe = recipeTemplates.find(r => r.id === combo.recipeId)
        if (recipe) {
          matches.push(recipe)
        }
      }
    }

    // Sort by number of matching ingredients (most specific first)
    matches.sort((a, b) => {
      const aMatches = a.requiredIngredients.filter(ing => 
        normalizedIngredients.includes(ing.toLowerCase())
      ).length
      const bMatches = b.requiredIngredients.filter(ing => 
        normalizedIngredients.includes(ing.toLowerCase())
      ).length
      return bMatches - aMatches
    })

    return matches
  }

  countCoreIngredientMatches(userIngredients, recipe) {
    const coreIngredients = {
      'butter-chicken': ['chicken'],
      'paneer-butter-masala': ['paneer'],
      'egg-fried-rice': ['egg', 'rice'],
      'grilled-cheese': ['bread', 'cheese'],
      'pasta': ['pasta'],
      'noodles': ['noodles'],
      'biryani': ['rice'],
      'masala-omelette': ['egg']
    }

    const coreIngs = coreIngredients[recipe.id] || []
    return coreIngs.filter(ing => userIngredients.includes(ing)).length
  }

  getIngredientFallbackRecipe(normalizedIngredients) {
    // Only use fallback when user has very few ingredients or no good matches
    if (normalizedIngredients.length <= 2) {
      // For single ingredients, create a simple dish
      const mainIngredient = normalizedIngredients[0]
      if (mainIngredient) {
        return {
          title: `Simple ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Dish`,
          description: "Here's a tasty idea based on what you have!",
          ingredients: [
            { name: mainIngredient, quantity: "to taste" },
            { name: "oil", quantity: "1 tablespoon" },
            { name: "salt", quantity: "to taste" },
            { name: "spices", quantity: "to taste" }
          ],
          steps: [
            `Heat oil in a pan over medium heat.`,
            `Add ${mainIngredient} and cook until done.`,
            `Season with salt and spices.`,
            `Serve hot and enjoy!`
          ],
          prepTime: "5 mins",
          cookTime: "10 mins",
          totalTime: "15 mins",
          difficulty: "Easy",
          servings: "1",
          cuisine: "International",
          tips: [
            "Adjust spices according to your preference.",
            "Add other ingredients if available."
          ],
          generatedFrom: 'ingredients',
          matchedType: 'simple_fallback',
          matchedIngredients: [mainIngredient],
          missingIngredients: [],
          optionalIngredients: [],
          needsAddOns: false,
          matchScore: 10
        }
      }
    }

    // For more ingredients but no strong match, try to find the best available recipe
    const availableRecipes = recipeTemplates.filter(recipe => {
      const requiredMatches = recipe.requiredIngredients.filter(ing => 
        normalizedIngredients.includes(ing.toLowerCase())
      ).length
      return requiredMatches >= 2 // At least 2 ingredients match
    })

    if (availableRecipes.length > 0) {
      // Sort by number of matching ingredients
      availableRecipes.sort((a, b) => {
        const aMatches = a.requiredIngredients.filter(ing => 
          normalizedIngredients.includes(ing.toLowerCase())
        ).length
        const bMatches = b.requiredIngredients.filter(ing => 
          normalizedIngredients.includes(ing.toLowerCase())
        ).length
        return bMatches - aMatches
      })

      const bestMatch = availableRecipes[0]
      const matchedIngredients = bestMatch.requiredIngredients.filter(ing => 
        normalizedIngredients.includes(ing.toLowerCase())
      )
      const missingIngredients = bestMatch.requiredIngredients.filter(ing => 
        !normalizedIngredients.includes(ing.toLowerCase())
      )

      return {
        ...bestMatch,
        generatedFrom: 'ingredients',
        matchedType: 'best_available',
        matchedIngredients,
        missingIngredients,
        optionalIngredients: bestMatch.optionalIngredients || [],
        needsAddOns: missingIngredients.length > 0,
        addOnMessage: "Here's a tasty idea based on what you have!",
        matchScore: 25
      }
    }

    // Ultimate fallback - only when absolutely nothing matches
    return {
      title: "Simple Vegetable Dish",
      description: "Here's a tasty idea based on what you have! A simple and delicious vegetable preparation.",
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
      generatedFrom: 'ingredients',
      matchedType: 'emergency_fallback',
      matchedIngredients: normalizedIngredients,
      missingIngredients: [],
      optionalIngredients: [],
      needsAddOns: false,
      matchScore: 5
    }
  }

  analyzeIntent(description) {
    const intent = {}
    
    for (const [intentType, keywords] of Object.entries(this.intentKeywords)) {
      intent[intentType] = keywords.some(keyword => description.includes(keyword))
    }

    return intent
  }

  findBestRecipeByIntent(intent) {
    const candidates = []

    for (const recipe of recipeTemplates) {
      let score = 0

      // Score based on matching tags and category
      if (intent.spicy && recipe.tags.includes('spicy')) score += 3
      if (intent.healthy && recipe.tags.includes('healthy')) score += 3
      if (intent.quick && recipe.tags.includes('quick')) score += 3
      if (intent.vegetarian && recipe.tags.includes('vegetarian')) score += 3
      if (intent.breakfast && recipe.category === 'breakfast') score += 3
      if (intent.dinner && recipe.category === 'dinner') score += 3
      if (intent.snack && recipe.category === 'snack') score += 3

      // Score based on specific ingredient mentions
      if (intent.chicken && recipe.tags.includes('chicken')) score += 4
      if (intent.paneer && recipe.tags.includes('paneer')) score += 4
      if (intent.egg && recipe.tags.includes('egg')) score += 4
      if (intent.cheese && recipe.tags.includes('cheese')) score += 4
      if (intent.rice && recipe.category === 'rice') score += 4
      if (intent.pasta && recipe.category === 'pasta') score += 4
      if (intent.noodles && recipe.category === 'noodles') score += 4

      if (score > 0) {
        candidates.push({ recipe, score })
      }
    }

    // Return the highest scoring recipe
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score)
      return candidates[0].recipe
    }

    return null
  }

  getFallbackRecipe(description) {
    // Choose a sensible default based on any keywords found
    const desc = description.toLowerCase()
    
    if (desc.includes('breakfast')) {
      const breakfastRecipe = recipeTemplates.find(r => r.category === 'breakfast')
      if (breakfastRecipe) {
        return {
          ...breakfastRecipe,
          title: "Quick Breakfast Special",
          description: "Here's a tasty breakfast idea based on your craving!",
          generatedFrom: 'description',
          matchedType: 'fallback'
        }
      }
    }

    if (desc.includes('spicy')) {
      const spicyRecipe = recipeTemplates.find(r => r.tags.includes('spicy'))
      if (spicyRecipe) {
        return {
          ...spicyRecipe,
          title: "Spicy Special Dish",
          description: "Here's a tasty idea based on your craving for something spicy!",
          generatedFrom: 'description',
          matchedType: 'fallback'
        }
      }
    }

    if (desc.includes('quick') || desc.includes('fast')) {
      const quickRecipe = recipeTemplates.find(r => r.tags.includes('quick'))
      if (quickRecipe) {
        return {
          ...quickRecipe,
          title: "Quick & Easy Dish",
          description: "Here's a tasty idea based on your craving for something quick!",
          generatedFrom: 'description',
          matchedType: 'fallback'
        }
      }
    }

    // Ultimate fallback - return the first recipe
    const defaultRecipe = recipeTemplates[0]
    return {
      ...defaultRecipe,
      title: "Chef's Special For You",
      description: "Here's a tasty idea based on your craving! We've created something special just for you.",
      generatedFrom: 'description',
      matchedType: 'fallback'
    }
  }
}

module.exports = RecipeMatcher
