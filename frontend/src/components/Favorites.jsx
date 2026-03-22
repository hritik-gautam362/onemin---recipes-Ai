const Favorites = ({ favorites, onRemove, onSelect, onBack }) => {
  if (favorites.length === 0) {
    return (
      <div className="favorites-section">
        <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>
          ← Back to Recipe Generator
        </button>
        
        <div className="empty-state">
          <h3>No favorite recipes yet! 💔</h3>
          <p>Start generating recipes and save your favorites to see them here.</p>
          <button className="btn btn-primary" onClick={onBack} style={{ marginTop: '1rem' }}>
            🍳 Start Cooking
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-section">
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>
        ← Back to Recipe Generator
      </button>
      
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--dark-color)' }}>
        ❤️ Your Favorite Recipes ({favorites.length})
      </h2>
      
      <div className="favorites-grid">
        {favorites.map((recipe, index) => (
          <div key={index} className="favorite-card" onClick={() => onSelect(recipe)}>
            <h3 className="favorite-title">{recipe.title}</h3>
            <p className="favorite-description">{recipe.description}</p>
            
            <div className="favorite-meta">
              <span>⏱️ {recipe.totalTime}</span>
              <span>📊 {recipe.difficulty}</span>
              <span>🍽️ {recipe.servings}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>
                🌍 {recipe.cuisine}
              </span>
              <button 
                className="remove-favorite"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(recipe.title)
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favorites
