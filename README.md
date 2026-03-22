# 🍳 OneMin - Smart Recipe Generator

A playful, intelligent recipe website that helps you cook delicious meals with ingredients you already have or by describing what you're craving!

## ✨ Features

### 🥗 **Ingredient-Based Recipe Search**
- Select from a comprehensive list of common ingredients
- Add custom ingredients not in the list
- Get logical recipe suggestions based on what you have
- Smart matching algorithms for ingredient combinations

### ✍️ **Describe Your Recipe**
- Type natural language descriptions like "I want a spicy quick dinner"
- AI-style recipe generation based on your cravings
- Understands keywords for meal type, spice level, and preferences

### 🎯 **Smart Recipe Generation**
- Logical recipe matching (not random!)
- Considers ingredient combinations and cooking styles
- Playful, friendly step-by-step instructions
- Realistic cooking times and difficulty levels

### ❤️ **Additional Features**
- Save favorite recipes to localStorage
- Fully responsive design for mobile and desktop
- Beautiful, playful UI with smooth animations
- No external CSS frameworks - pure CSS
- Loading states and empty states
- Print-friendly recipe format

## 🛠️ Tech Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development
- **Plain CSS** (no Tailwind, Bootstrap, or other frameworks)
- **Responsive Design** with mobile-first approach

### Backend
- **Node.js** with Express
- **CORS** enabled for frontend communication
- **Rule-based recipe generation** (no external AI APIs needed)
- **RESTful API** endpoints

## 📁 Project Structure

```
onemin/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── IngredientSelector.jsx
│   │   │   ├── DescriptionInput.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/
│   ├── routes/
│   │   └── recipeRoutes.js
│   ├── controllers/
│   │   └── recipeController.js
│   ├── data/
│   │   ├── ingredients.js
│   │   └── recipeTemplates.js
│   ├── utils/
│   │   └── recipeGenerator.js
│   ├── package.json
│   └── server.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### 1. Clone/Download the Project
Make sure you have the entire project folder with both `frontend` and `backend` directories.

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

Open a **new terminal window** and run:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### 4. Access the Application
Open your browser and go to `http://localhost:5173`

You should see the OneMin homepage with the playful cooking interface!

## 🎮 How to Use

### Method 1: Pick Ingredients
1. Click on "🥗 Pick Ingredients" tab
2. Search and select ingredients from the list
3. Add custom ingredients if needed
4. Click "🍳 Find Recipes" to get suggestions

### Method 2: Describe Recipe
1. Click on "✍️ Describe Recipe" tab
2. Type what you want, like:
   - "I want a quick spicy dinner"
   - "Make me a healthy breakfast with eggs"
   - "Need a fun snack with cheese and bread"
3. Click "✨ Generate Recipe"

### Managing Favorites
- Click "❤️ Save to Favorites" on any recipe you like
- Access favorites from the navigation menu
- Favorites are saved in your browser's localStorage

## 🧠 Recipe Generation Logic

The system uses intelligent rule-based matching:

### Ingredient Combinations
- **rice + egg + onion + tomato** → Spicy Tomato Egg Fried Rice
- **bread + cheese** → Cheesy Garlic Toast
- **potato + onion** → Masala Potato Fry
- **noodles + vegetables** → Veggie Noodle Stir-Fry
- **paneer + tomato + onion** → Paneer Tomato Curry

### Description Keywords
- **spicy** → Adds more spices and chili
- **healthy** → Suggests lighter, veggie-focused options
- **quick/fast** → Prioritizes recipes under 25 minutes
- **breakfast** → Suggests morning-appropriate dishes
- **snack** → Recommends finger foods and quick bites
- **dinner/lunch** → Full meal suggestions

## 🎨 Design Features

- **Playful color palette** inspired by food (oranges, greens, warm tones)
- **Smooth animations** and hover effects
- **Card-based layout** for better organization
- **Responsive design** works perfectly on mobile, tablet, and desktop
- **Loading states** with custom spinner
- **Empty states** with helpful guidance
- **Print-friendly** recipe formatting

## 🛠️ Development Commands

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-restart on changes)
```

## 📡 API Endpoints

### GET `/api/ingredients`
Returns the list of available ingredients.

### POST `/api/recipe/by-ingredients`
Generate recipe from selected ingredients.
```json
{
  "ingredients": ["egg", "tomato", "onion"]
}
```

### POST `/api/recipe/by-description`
Generate recipe from text description.
```json
{
  "description": "I want a spicy quick dinner"
}
```

### GET `/api/recipes/fallback`
Returns fallback recipe templates.

## 🎯 Recipe Format

Each recipe includes:
```json
{
  "title": "Recipe Name",
  "description": "Fun, engaging description",
  "ingredients": [
    { "name": "ingredient", "quantity": "amount" }
  ],
  "prepTime": "10 mins",
  "cookTime": "15 mins",
  "totalTime": "25 mins",
  "difficulty": "Easy",
  "servings": "2-3",
  "cuisine": "Cuisine Type",
  "steps": ["Playful step 1", "Playful step 2"],
  "tips": ["Helpful tip 1", "Helpful tip 2"]
}
```

## 🐛 Troubleshooting

### Backend Issues
- **Port 3000 already in use**: Change the PORT in `backend/server.js`
- **CORS errors**: Make sure backend is running before starting frontend

### Frontend Issues
- **Vite dev server won't start**: Try `npm install` again
- **API calls failing**: Check that backend is running on port 3000

### General Issues
- Clear browser cache and localStorage if you see strange behavior
- Make sure both frontend and backend are running simultaneously
- Check browser console for any error messages

## 🤝 Contributing

This is a demonstration project showcasing:
- React best practices
- Modern CSS techniques
- Express API design
- Intelligent recipe generation logic
- Playful UX design

Feel free to extend with:
- More recipe templates
- Additional ingredient matching rules
- User authentication for cloud favorites
- Real AI API integration
- Image generation for recipes

## 📄 License

MIT License - feel free to use this project for learning and development!

## 🎉 Enjoy Cooking!

Made with ❤️ for food lovers and home cooks everywhere.

*"Cook smart. Cook playful."*
