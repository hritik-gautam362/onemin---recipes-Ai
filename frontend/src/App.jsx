import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import IngredientSelector from './components/IngredientSelector'
import DescriptionInput from './components/DescriptionInput'
import RecipeCard from './components/RecipeCard'
import Favorites from './components/Favorites'
import Footer from './components/Footer'
import LoadingState from './components/LoadingState'
import EmptyState from './components/EmptyState'

function App() {
  const [activeTab, setActiveTab] = useState('ingredients')
  const [currentRecipe, setCurrentRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    const savedFavorites = localStorage.getItem('onemin-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('onemin-favorites', JSON.stringify(favorites))
    }
  }, [favorites])

  const handleIngredientsSearch = async (ingredients) => {
    setLoading(true)
    setCurrentRecipe(null)
    
    try {
      const response = await fetch('/api/recipe/by-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      })
      
      const data = await response.json()
      if (data.success) {
        // Pass the full response data including ingredient breakdown
        setCurrentRecipe({
          ...data.recipe,
          userIngredients: data.userIngredients,
          matchedIngredients: data.matchedIngredients,
          missingIngredients: data.missingIngredients,
          optionalIngredients: data.optionalIngredients,
          needsAddOns: data.needsAddOns,
          addOnMessage: data.addOnMessage
        })
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDescriptionSearch = async (description) => {
    setLoading(true)
    setCurrentRecipe(null)
    
    try {
      const response = await fetch('/api/recipe/by-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      })
      
      const data = await response.json()
      if (data.success) {
        setCurrentRecipe(data.recipe)
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveToFavorites = () => {
    if (currentRecipe && !favorites.find(fav => fav.title === currentRecipe.title)) {
      setFavorites([...favorites, currentRecipe])
    }
  }

  const removeFromFavorites = (recipeTitle) => {
    setFavorites(favorites.filter(fav => fav.title !== recipeTitle))
  }

  const loadFavoriteRecipe = (recipe) => {
    setCurrentRecipe(recipe)
    setShowFavorites(false)
  }

  return (
    <div className="App">
      <Navbar 
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favoritesCount={favorites.length}
      />
      
      <main>
        {!showFavorites ? (
          <>
            <Hero 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <div className="container">
              <div className="recipe-generator">
                <div className="tabs">
                  <button 
                    className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ingredients')}
                  >
                    🥗 Pick Ingredients
                  </button>
                  <button 
                    className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    ✍️ Describe Recipe
                  </button>
                </div>
                
                <div className="tab-content">
                  {activeTab === 'ingredients' && (
                    <IngredientSelector onSearch={handleIngredientsSearch} />
                  )}
                  {activeTab === 'description' && (
                    <DescriptionInput onSearch={handleDescriptionSearch} />
                  )}
                </div>
              </div>
              
              {loading && <LoadingState />}
              
              {!loading && !currentRecipe && (
                <EmptyState 
                  activeTab={activeTab}
                  onTabSwitch={setActiveTab}
                />
              )}
              
              {currentRecipe && (
                <RecipeCard 
                  recipe={currentRecipe}
                  onSave={saveToFavorites}
                  isSaved={favorites.find(fav => fav.title === currentRecipe.title)}
                  onGenerateAnother={() => {
                    setCurrentRecipe(null)
                    setActiveTab('ingredients')
                  }}
                />
              )}
            </div>
          </>
        ) : (
          <div className="container">
            <Favorites 
              favorites={favorites}
              onRemove={removeFromFavorites}
              onSelect={loadFavoriteRecipe}
              onBack={() => setShowFavorites(false)}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default App
