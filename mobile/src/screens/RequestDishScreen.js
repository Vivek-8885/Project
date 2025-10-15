import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import {
  Title,
  TextInput,
  Button,
  Card,
  Text
} from 'react-native-paper';
import api from '../config/api';

const RequestDishScreen = ({ navigation }) => {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return;
    }

    try {
      setLoading(true);
      await api.post('/dish-requests', {
        dishName: dishName.trim(),
        description: description.trim()
      });

      Alert.alert(
        'Success',
        'Your dish request has been submitted! We will review it and add it to the app soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              setDishName('');
              setDescription('');
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit dish request. Please try again.');
      console.error('Error submitting dish request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Request a New Dish</Title>
            <Text style={styles.subtitle}>
              Can't find your favorite dish? Request it here and we'll add it to the app!
            </Text>

            <TextInput
              label="Dish Name *"
              value={dishName}
              onChangeText={setDishName}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Chicken Tikka Masala"
            />

            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Tell us more about this dish..."
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Submit Request
            </Button>

            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              disabled={loading}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            📧 You will receive an email notification once your request is reviewed.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  cancelButton: {
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
  },
});

export default RequestDishScreen;


