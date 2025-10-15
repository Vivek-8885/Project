const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

// Get all recipes
router.get('/', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ name: 1 });
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Get single recipe by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Calculate ingredients for specific servings
router.post('/:id/calculate', auth, async (req, res) => {
  try {
    const { servings, customIngredients } = req.body;
    const recipe = await Recipe.findById(req.params.id);
   
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    let calculatedIngredients;

    if (customIngredients && customIngredients.length > 0) {
      // User has modified ingredients - recalculate based on changes
      calculatedIngredients = customIngredients.map(customIng => {
        const originalIng = recipe.ingredients.find(
          ing => ing._id.toString() === customIng._id
        );
       
        if (!originalIng) return customIng;

        // Calculate the ratio of change
        const ratio = customIng.quantity / originalIng.quantity;
       
        return {
          ...customIng,
          ratio // Store ratio for reference
        };
      });
    } else {
      // Normal calculation based on servings
      const multiplier = servings / recipe.baseServings;
     
      calculatedIngredients = recipe.ingredients.map(ingredient => ({
        _id: ingredient._id,
        name: ingredient.name,
        quantity: ingredient.baseQuantity * multiplier,
        unit: ingredient.unit,
        baseQuantity: ingredient.baseQuantity
      }));
    }

    res.json({
      recipe: {
        id: recipe._id,
        name: recipe.name,
        description: recipe.description,
        baseServings: recipe.baseServings
      },
      servings,
      ingredients: calculatedIngredients
    });
  } catch (error) {
    console.error('Error calculating ingredients:', error);
    res.status(500).json({ error: 'Failed to calculate ingredients' });
  }
});

// Recalculate all ingredients when one is modified
router.post('/:id/recalculate', auth, async (req, res) => {
  try {
    const { modifiedIngredient, currentIngredients, servings } = req.body;
    const recipe = await Recipe.findById(req.params.id);
   
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Find the original ingredient
    const originalIng = recipe.ingredients.find(
      ing => ing._id.toString() === modifiedIngredient._id
    );

    if (!originalIng) {
      return res.status(400).json({ error: 'Invalid ingredient' });
    }

    // Calculate the ratio based on the modified ingredient
    const expectedQuantity = (originalIng.baseQuantity * servings) / recipe.baseServings;
    const actualQuantity = modifiedIngredient.quantity;
    const ratio = actualQuantity / expectedQuantity;

    // Apply the same ratio to all ingredients
    const recalculatedIngredients = currentIngredients.map(ing => {
      const originalIngredient = recipe.ingredients.find(
        orig => orig._id.toString() === ing._id
      );

      if (!originalIngredient) return ing;

      const baseExpected = (originalIngredient.baseQuantity * servings) / recipe.baseServings;
     
      return {
        ...ing,
        quantity: parseFloat((baseExpected * ratio).toFixed(2))
      };
    });

    res.json({
      ingredients: recalculatedIngredients,
      ratio
    });
  } catch (error) {
    console.error('Error recalculating ingredients:', error);
    res.status(500).json({ error: 'Failed to recalculate ingredients' });
  }
});

module.exports = router;


