import { useState } from 'react'

const Navbar = ({ showFavorites, setShowFavorites, favoritesCount }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-container">
          <a href="#" className="logo">
            <div className="logo-icon">🍳</div>
            OneMin
          </a>
          
          <ul className="nav-links">
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  setShowFavorites(false)
                }}
              >
                🏠 Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  setShowFavorites(false)
                }}
              >
                🥗 Ingredients
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  setShowFavorites(false)
                }}
              >
                ✍️ Describe Recipe
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  setShowFavorites(true)
                }}
              >
                ❤️ Favorites ({favoritesCount})
              </a>
            </li>
            <li>
              <a href="#about">ℹ️ About</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
