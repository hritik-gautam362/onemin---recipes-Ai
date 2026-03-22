const RecipeCard = ({ recipe, onSave, isSaved, onGenerateAnother }) => {
  return (
    <div className="recipe-result show">
      <div className="recipe-header">
        <h2 className="recipe-title">{recipe.title}</h2>
        <p className="recipe-description">{recipe.description}</p>
      </div>

      <div className="recipe-meta">
        <div className="meta-item">
          <div className="meta-label">⏱️ Prep Time</div>
          <div className="meta-value">{recipe.prepTime}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">🔥 Cook Time</div>
          <div className="meta-value">{recipe.cookTime}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">⏰ Total Time</div>
          <div className="meta-value">{recipe.totalTime}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">📊 Difficulty</div>
          <div className="meta-value">{recipe.difficulty}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">🍽️ Servings</div>
          <div className="meta-value">{recipe.servings}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">🌍 Cuisine</div>
          <div className="meta-value">{recipe.cuisine}</div>
        </div>
      </div>

      {/* Show ingredient breakdown for ingredient-based recipes */}
      {recipe.matchedIngredients && (
        <>
          <div className="recipe-section">
            <h3 className="section-title">
              <span className="section-icon">✅</span>
              Ingredients You Selected & Will Use
            </h3>
            <ul className="ingredients-list">
              {recipe.matchedIngredients.map((ingredient, index) => {
                const fullIngredient = recipe.ingredients.find(ing => 
                  ing.name.toLowerCase() === ingredient.toLowerCase()
                )
                return (
                  <li key={index} className="ingredient-item matched">
                    <input 
                      type="checkbox" 
                      className="ingredient-checkbox"
                      id={`matched-ingredient-${index}`}
                      defaultChecked={true}
                    />
                    <label htmlFor={`matched-ingredient-${index}`} style={{ cursor: 'pointer', flex: 1 }}>
                      <strong>{fullIngredient?.quantity || 'to taste'}</strong> {ingredient}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>

          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <div className="recipe-section">
              <h3 className="section-title">
                <span className="section-icon">➕</span>
                Extra Ingredients Needed
              </h3>
              <ul className="ingredients-list">
                {recipe.missingIngredients.map((ingredient, index) => {
                  const fullIngredient = recipe.ingredients.find(ing => 
                    ing.name.toLowerCase() === ingredient.toLowerCase()
                  )
                  return (
                    <li key={index} className="ingredient-item missing">
                      <input 
                        type="checkbox" 
                        className="ingredient-checkbox"
                        id={`missing-ingredient-${index}`}
                      />
                      <label htmlFor={`missing-ingredient-${index}`} style={{ cursor: 'pointer', flex: 1 }}>
                        <strong>{fullIngredient?.quantity || 'to taste'}</strong> {ingredient}
                      </label>
                    </li>
                  )
                })}
              </ul>
              {recipe.addOnMessage && (
                <p className="add-on-message">{recipe.addOnMessage}</p>
              )}
            </div>
          )}

          {recipe.optionalIngredients && recipe.optionalIngredients.length > 0 && (
            <div className="recipe-section">
              <h3 className="section-title">
                <span className="section-icon">🌟</span>
                Optional Add-ons (Nice to Have)
              </h3>
              <ul className="ingredients-list">
                {recipe.optionalIngredients.map((ingredient, index) => {
                  const fullIngredient = recipe.ingredients.find(ing => 
                    ing.name.toLowerCase() === ingredient.toLowerCase()
                  )
                  return (
                    <li key={index} className="ingredient-item optional">
                      <input 
                        type="checkbox" 
                        className="ingredient-checkbox"
                        id={`optional-ingredient-${index}`}
                      />
                      <label htmlFor={`optional-ingredient-${index}`} style={{ cursor: 'pointer', flex: 1 }}>
                        <strong>{fullIngredient?.quantity || 'to taste'}</strong> {ingredient}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Fallback for description-based recipes (no ingredient breakdown) */}
      {!recipe.matchedIngredients && (
        <div className="recipe-section">
          <h3 className="section-title">
            <span className="section-icon">🥗</span>
            Ingredients You'll Need
          </h3>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                <input 
                  type="checkbox" 
                  className="ingredient-checkbox"
                  id={`ingredient-${index}`}
                />
                <label htmlFor={`ingredient-${index}`} style={{ cursor: 'pointer', flex: 1 }}>
                  <strong>{ingredient.quantity}</strong> {ingredient.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="recipe-section">
        <h3 className="section-title">
          <span className="section-icon">👨‍🍳</span>
          Fun Cooking Steps
        </h3>
        <ol className="recipe-steps">
          {recipe.steps.map((step, index) => (
            <li key={index} className="step-item">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {recipe.tips && recipe.tips.length > 0 && (
        <div className="recipe-section">
          <h3 className="section-title">
            <span className="section-icon">💡</span>
            Pro Tips & Tricks
          </h3>
          <ul className="tips-list">
            {recipe.tips.map((tip, index) => (
              <li key={index} className="tip-item">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="recipe-actions">
        <button 
          className="btn btn-primary" 
          onClick={onSave}
          disabled={isSaved}
        >
          {isSaved ? '❤️ Saved to Favorites' : '🤍 Save to Favorites'}
        </button>
        <button className="btn btn-secondary" onClick={onGenerateAnother}>
          🔄 Generate Another Recipe
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Print Recipe
        </button>
      </div>
    </div>
  )
}

export default RecipeCard
