const EmptyState = ({ activeTab, onTabSwitch }) => {
  const getEmptyMessage = () => {
    if (activeTab === 'ingredients') {
      return {
        title: "🥗 No ingredients selected yet!",
        message: "Pick some ingredients from the list above and we'll find delicious recipes you can make.",
        action: "Start picking ingredients"
      }
    } else {
      return {
        title: "✍️ Tell us what you're craving!",
        message: "Describe the kind of recipe you want, and we'll generate something perfect for you.",
        action: "Start describing your recipe"
      }
    }
  }

  const { title, message, action } = getEmptyMessage()

  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      <button 
        className="btn btn-primary" 
        onClick={() => onTabSwitch(activeTab === 'ingredients' ? 'ingredients' : 'description')}
      >
        {action}
      </button>
    </div>
  )
}

export default EmptyState
