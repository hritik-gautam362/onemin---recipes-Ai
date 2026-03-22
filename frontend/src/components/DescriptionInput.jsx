import { useState } from 'react'

const DescriptionInput = ({ onSearch }) => {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const examplePrompts = [
    "I want a quick spicy dinner",
    "Make me a healthy breakfast with eggs",
    "Need a fun snack with cheese and bread",
    "Something vegetarian and easy to make",
    "I'm craving pasta with tomato sauce",
    "Make something sweet for dessert",
    "I need a protein-rich lunch",
    "Something with chicken and rice"
  ]

  const handleSubmit = async () => {
    if (description.trim()) {
      setLoading(true)
      try {
        await onSearch(description.trim())
      } finally {
        setLoading(false)
      }
    }
  }

  const handleExampleClick = (prompt) => {
    setDescription(prompt)
  }

  return (
    <div className="description-input">
      <h3 style={{ marginBottom: '1rem', color: 'var(--dark-color)' }}>
        ✍️ Describe Your Perfect Recipe
      </h3>
      
      <textarea
        className="description-textarea"
        placeholder="Describe what you want to cook... For example: 'I want a spicy quick dinner with rice' or 'Make me a healthy breakfast with eggs'"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <div className="example-prompts">
        <h4>💡 Need inspiration? Try these:</h4>
        <ul>
          {examplePrompts.map((prompt, index) => (
            <li 
              key={index}
              onClick={() => handleExampleClick(prompt)}
              style={{ cursor: 'pointer', padding: '0.25rem 0' }}
            >
              "{prompt}"
            </li>
          ))}
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={!description.trim() || loading}
        >
          {loading ? '🔄 Generating Recipe...' : '✨ Generate Recipe'}
        </button>
      </div>
    </div>
  )
}

export default DescriptionInput
