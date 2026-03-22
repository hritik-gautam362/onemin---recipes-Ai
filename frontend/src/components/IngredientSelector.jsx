import { useState, useEffect } from 'react'

const IngredientSelector = ({ onSearch }) => {
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [customIngredient, setCustomIngredient] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchIngredients()
  }, [])

  const fetchIngredients = async () => {
    try {
      const response = await fetch('/api/ingredients')
      const data = await response.json()
      if (data.success) {
        setAvailableIngredients(data.ingredients)
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error)
      // Fallback ingredients
      setAvailableIngredients([
        'onion', 'tomato', 'potato', 'egg', 'rice', 'chicken', 'paneer', 
        'cheese', 'milk', 'garlic', 'ginger', 'chili', 'flour', 'butter',
        'spinach', 'mushroom', 'noodles', 'bread'
      ])
    }
  }

  const filteredIngredients = availableIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient))
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
  }

  const removeIngredient = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient))
  }

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      setSelectedIngredients([...selectedIngredients, customIngredient.trim()])
      setCustomIngredient('')
    }
  }

  const handleSearch = async () => {
    if (selectedIngredients.length > 0) {
      setLoading(true)
      try {
        await onSearch(selectedIngredients)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="ingredient-selector">
      <h3 style={{ marginBottom: '1rem', color: 'var(--dark-color)' }}>
        🥗 Select Your Ingredients
      </h3>
      
      <div className="ingredient-search">
        <input
          type="text"
          className="search-input"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="ingredients-list">
        {filteredIngredients.map(ingredient => (
          <div
            key={ingredient}
            className={`ingredient-item ${selectedIngredients.includes(ingredient) ? 'selected' : ''}`}
            onClick={() => toggleIngredient(ingredient)}
          >
            {ingredient}
          </div>
        ))}
      </div>

      <div className="selected-ingredients">
        {selectedIngredients.length === 0 ? (
          <span style={{ color: '#999', fontStyle: 'italic' }}>
            No ingredients selected yet. Click ingredients above to add them!
          </span>
        ) : (
          selectedIngredients.map(ingredient => (
            <div key={ingredient} className="ingredient-chip">
              {ingredient}
              <span 
                className="remove" 
                onClick={() => removeIngredient(ingredient)}
              >
                ×
              </span>
            </div>
          ))
        )}
      </div>

      <div className="custom-ingredient">
        <input
          type="text"
          className="search-input"
          placeholder="Add custom ingredient..."
          value={customIngredient}
          onChange={(e) => setCustomIngredient(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomIngredient()}
        />
        <button className="btn btn-secondary" onClick={addCustomIngredient}>
          Add
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSearch}
          disabled={selectedIngredients.length === 0 || loading}
        >
          {loading ? '🔄 Finding Recipes...' : '🍳 Find Recipes'}
        </button>
      </div>
    </div>
  )
}

export default IngredientSelector
