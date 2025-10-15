require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

const sampleRecipes = [
  {
    name: 'Chicken Biryani',
    description: 'Aromatic rice dish with tender chicken and spices',
    baseServings: 4,
    category: 'Main Course',
    ingredients: [
      { name: 'Basmati Rice', quantity: 2, unit: 'cups', baseQuantity: 2 },
      { name: 'Chicken', quantity: 500, unit: 'grams', baseQuantity: 500 },
      { name: 'Onions', quantity: 2, unit: 'pieces', baseQuantity: 2 },
      { name: 'Tomatoes', quantity: 2, unit: 'pieces', baseQuantity: 2 },
      { name: 'Yogurt', quantity: 1, unit: 'cup', baseQuantity: 1 },
      { name: 'Ginger-Garlic Paste', quantity: 2, unit: 'tbsp', baseQuantity: 2 },
      { name: 'Biryani Masala', quantity: 2, unit: 'tbsp', baseQuantity: 2 },
      { name: 'Mint Leaves', quantity: 0.5, unit: 'cup', baseQuantity: 0.5 },
      { name: 'Coriander Leaves', quantity: 0.5, unit: 'cup', baseQuantity: 0.5 },
      { name: 'Oil/Ghee', quantity: 4, unit: 'tbsp', baseQuantity: 4 },
      { name: 'Salt', quantity: 1, unit: 'tsp', baseQuantity: 1 }
    ]
  },
  {
    name: 'Paneer Butter Masala',
    description: 'Rich and creamy paneer curry',
    baseServings: 4,
    category: 'Main Course',
    ingredients: [
      { name: 'Paneer', quantity: 400, unit: 'grams', baseQuantity: 400 },
      { name: 'Tomatoes', quantity: 4, unit: 'pieces', baseQuantity: 4 },
      { name: 'Onions', quantity: 2, unit: 'pieces', baseQuantity: 2 },
      { name: 'Butter', quantity: 3, unit: 'tbsp', baseQuantity: 3 },
      { name: 'Cream', quantity: 0.5, unit: 'cup', baseQuantity: 0.5 },
      { name: 'Cashews', quantity: 10, unit: 'pieces', baseQuantity: 10 },
      { name: 'Ginger-Garlic Paste', quantity: 1, unit: 'tbsp', baseQuantity: 1 },
      { name: 'Red Chili Powder', quantity: 1, unit: 'tsp', baseQuantity: 1 },
      { name: 'Garam Masala', quantity: 1, unit: 'tsp', baseQuantity: 1 },
      { name: 'Kasuri Methi', quantity: 1, unit: 'tsp', baseQuantity: 1 },
      { name: 'Salt', quantity: 1, unit: 'tsp', baseQuantity: 1 }
    ]
  },
  {
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with spices',
    baseServings: 4,
    category: 'Main Course',
    ingredients: [
      { name: 'Toor Dal', quantity: 1, unit: 'cup', baseQuantity: 1 },
      { name: 'Onions', quantity: 1, unit: 'piece', baseQuantity: 1 },
      { name: 'Tomatoes', quantity: 2, unit: 'pieces', baseQuantity: 2 },
      { name: 'Green Chilies', quantity: 2, unit: 'pieces', baseQuantity: 2 },
      { name: 'Ginger', quantity: 1, unit: 'inch', baseQuantity: 1 },
      { name: 'Garlic', quantity: 4, unit: 'cloves', baseQuantity: 4 },
      { name: 'Cumin Seeds', quantity: 1, unit: 'tsp', baseQuantity: 1 },
      { name: 'Turmeric Powder', quantity: 0.5, unit: 'tsp', baseQuantity: 0.5 },
      { name: 'Red Chili Powder', quantity: 0.5, unit: 'tsp', baseQuantity: 0.5 },
      { name: 'Ghee', quantity: 2, unit: 'tbsp', baseQuantity: 2 },
      { name: 'Coriander Leaves', quantity: 2, unit: 'tbsp', baseQuantity: 2 },
      { name: 'Salt', quantity: 1, unit: 'tsp', baseQuantity: 1 }
    ]
  },
  {
    name: 'Vegetable Biryani',
    description: 'Fragrant rice with mixed vegetables',
    baseServings: 4,
    category: 'Main Course',
    ingredients: [
      { name: 'Basmati Rice', quantity: 2, unit: 'cups', baseQuantity: 2 },
      { name: 'Mixed Vegetables', quantity: 2, unit: 'cups', baseQuantity: 2 },
      { name: 'Onions', quantity: 2, unit: 'pieces', baseQuantity: 2 },
      { name: 'Tomatoes', quantity: 1, unit: 'piece', baseQuantity: 1 },
      { name: 'Yogurt', quantity: 0.5, unit: 'cup', baseQuantity: 0.5 },
      { name: 'Ginger-Garlic Paste', quantity: 1, unit: 'tbsp', baseQuantity: 1 },
      { name: 'Biryani Masala', quantity: 2, unit: 'tbsp', baseQuantity: 2 },
      { name: 'Mint Leaves', quantity: 0.25, unit: 'cup', baseQuantity: 0.25 },
      { name: 'Oil', quantity: 3, unit: 'tbsp', baseQuantity: 3 },
      { name: 'Salt', quantity: 1, unit: 'tsp', baseQuantity: 1 }
    ]
  },
  {
    name: 'Butter Chicken',
    description: 'Creamy tomato-based chicken curry',
    baseServings: 4,
    category: 'Main Course',
    ingredients: [
      { name: 'Chicken', quantity: 500, unit: 'grams', baseQuantity: 500 },
      { name: 'Tomatoes', quantity: 4, unit: 'pieces', baseQuantity: 4 },
      { name: 'Butter', quantity: 4, unit: 'tbsp', baseQuantity: 4 },
      { name: 'Cream', quantity: 0.5, unit: 'cup', baseQuantity: 0.5 },
      { name: 'Yogurt', quantity: 0.5, unit: 'cup', baseQuantity: 0.5 },
      { name: 'Ginger-Garlic Paste', quantity: 2, unit: 'tbsp', baseQuantity: 2 },
      { name: 'Kashmiri Red Chili', quantity: 1, unit: 'tbsp', baseQuantity: 1 },
      { name: 'Garam Masala', quantity: 1, unit: 'tsp', baseQuantity: 1 },
      { name: 'Kasuri Methi', quantity: 1, unit: 'tbsp', baseQuantity: 1 },
      { name: 'Honey', quantity: 1, unit: 'tsp', baseQuantity: 1 },
      { name: 'Salt', quantity: 1, unit: 'tsp', baseQuantity: 1 }
    ]
  },
  {
    name: 'Chole (Chickpea Curry)',
    description: 'Spicy and tangy chickpea curry',
    baseServings: 4,
    category: 'Main Course',
    ingredients: [
      { name: 'Chickpeas', quantity: 2, unit: 'cups', baseQuantity: 2 },
      { name: 'Onions', quantity: 2, unit: 'pieces', baseQuantity: 2 },
      { name: 'Tomatoes', quantity: 3, unit: 'pieces', baseQuantity: 3 },
      { name: 'Ginger-Garlic Paste', quantity: 1, unit: 'tbsp', baseQuantity: 1 },
      { name: 'Chole Masala', quantity: 2, unit: 'tbsp', baseQuantity: 2 },
      { name: 'Tea Bags', quantity: 2, unit: 'pieces', baseQuantity: 2 },
      { name: 'Oil', quantity: 3, unit: 'tbsp', baseQuantity: 3 },
      { name: 'Coriander Leaves', quantity: 2, unit: 'tbsp', baseQuantity: 2 },
      { name: 'Salt', quantity: 1, unit: 'tsp', baseQuantity: 1 }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Insert sample recipes
    await Recipe.insertMany(sampleRecipes);
    console.log('Sample recipes inserted successfully');

    console.log(`Inserted ${sampleRecipes.length} recipes`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


