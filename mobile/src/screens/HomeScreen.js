import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  FAB,
  Text,
  IconButton
} from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, recipes]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recipes');
      setRecipes(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch recipes');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterRecipes = () => {
    if (!searchQuery) {
      setFilteredRecipes(recipes);
      return;
    }

    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const renderRecipeCard = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
        <Text style={styles.servings}>Base Servings: {item.baseServings}</Text>
        <Text style={styles.ingredients}>
          {item.ingredients.length} ingredients
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
          View Recipe
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Title style={styles.headerTitle}>Recipe App</Title>
          <IconButton
            icon="logout"
            size={24}
            onPress={handleLogout}
          />
        </View>
        <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
      </View>

      <Searchbar
        placeholder="Search recipes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading recipes...' : 'No recipes found'}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('RequestDish')}
        label="Request Dish"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
  },
  welcomeText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  searchbar: {
    margin: 15,
    elevation: 2,
  },
  list: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  servings: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
  ingredients: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;


