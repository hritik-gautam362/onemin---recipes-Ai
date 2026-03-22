const Hero = ({ activeTab, setActiveTab }) => {
  return (
    <section className="hero">
      <div className="container">
        <h1>🍳 Cook Something Fun With What You Have!</h1>
        <p className="hero-subtitle">
          Pick your ingredients or describe your craving, and get a smart recipe 
          with fun step-by-step cooking instructions.
        </p>
        
        <div className="cta-buttons">
          <button 
            className={`btn ${activeTab === 'ingredients' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('ingredients')}
          >
            🥗 Pick Ingredients
          </button>
          <button 
            className={`btn ${activeTab === 'description' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('description')}
          >
            ✍️ Describe a Recipe
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
