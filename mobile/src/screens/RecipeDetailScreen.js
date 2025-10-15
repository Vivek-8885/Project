import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import {
  Title,
  Text,
  TextInput,
  Button,
  Card,
  Divider,
  List
} from 'react-native-paper';
import api from '../config/api';

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params;
  const [servings, setServings] = useState(recipe.baseServings.toString());
  const [ingredients, setIngredients] = useState([]);
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateIngredients = async () => {
    const numServings = parseInt(servings);
    if (isNaN(numServings) || numServings <= 0) {
      Alert.alert('Error', 'Please enter a valid number of servings');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/recipes/${recipe._id}/calculate`, {
        servings: numServings
      });
      setIngredients(response.data.ingredients);
      setCalculated(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate ingredients');
      console.error('Error calculating ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientChange = async (ingredientId, newQuantity) => {
    const quantity = parseFloat(newQuantity);
    if (isNaN(quantity) || quantity < 0) return;

    // Update the ingredient locally
    const updatedIngredients = ingredients.map(ing =>
      ing._id === ingredientId ? { ...ing, quantity } : ing
    );

    // Find the modified ingredient
    const modifiedIngredient = updatedIngredients.find(ing => ing._id === ingredientId);

    try {
      // Recalculate all ingredients based on the change
      const response = await api.post(`/recipes/${recipe._id}/recalculate`, {
        modifiedIngredient,
        currentIngredients: updatedIngredients,
        servings: parseInt(servings)
      });

      setIngredients(response.data.ingredients);
    } catch (error) {
      console.error('Error recalculating ingredients:', error);
      // Keep the local change even if recalculation fails
      setIngredients(updatedIngredients);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{recipe.name}</Title>
          <Text style={styles.description}>{recipe.description}</Text>
         
          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Number of Persons</Text>
          <View style={styles.servingsContainer}>
            <TextInput
              mode="outlined"
              keyboardType="numeric"
              value={servings}
              onChangeText={setServings}
              style={styles.servingsInput}
              label="Servings"
            />
            <Button
              mode="contained"
              onPress={calculateIngredients}
              loading={loading}
              disabled={loading}
              style={styles.calculateButton}
            >
              Calculate
            </Button>
          </View>

          {calculated && ingredients.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.subtitle}>
                (Tap to edit quantities - other ingredients will adjust automatically)
              </Text>
             
              {ingredients.map((ingredient, index) => (
                <View key={ingredient._id || index} style={styles.ingredientRow}>
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientUnit}>{ingredient.unit}</Text>
                  </View>
                  <TextInput
                    mode="outlined"
                    keyboardType="decimal-pad"
                    value={ingredient.quantity.toString()}
                    onChangeText={(value) => handleIngredientChange(ingredient._id, value)}
                    style={styles.quantityInput}
                    dense
                  />
                </View>
              ))}
            </>
          )}

          {!calculated && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Enter the number of persons and tap "Calculate" to see the required ingredients.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  servingsInput: {
    flex: 1,
    marginRight: 10,
  },
  calculateButton: {
    paddingHorizontal: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ingredientUnit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quantityInput: {
    width: 80,
    height: 40,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
  },
});

export default RecipeDetailScreen;


