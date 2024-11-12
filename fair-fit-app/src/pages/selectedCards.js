import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SelectedCardsPage() {
  const [selectedCards, setSelectedCards] = useState({ dietaryRestrictions: [], allergies: [], dietGoals: [] });
  const [recipeSuggestion, setRecipeSuggestion] = useState('');
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);

  useEffect(() => {
    // Retrieve selected cards from localStorage and categorize them by type
    const storedCards = JSON.parse(localStorage.getItem('selectedCards')) || [];
    const dietaryRestrictions = storedCards.filter(card => ["Gluten-Free", "Lactose-Free", "Vegan", "Vegetarian", "Low Carb", "Sugar-Free", "Kosher", "Halal", "Paleo", "Keto"].includes(card));
    const allergies = storedCards.filter(card => ["Peanut Allergy", "Tree Nut Allergy", "Egg Allergy", "Fish Allergy", "Shellfish Allergy", "Wheat Allergy", "Soy Allergy", "Milk Allergy", "Sesame Allergy", "Sulphite Allergy"].includes(card));
    const dietGoals = storedCards.filter(card => ["Weight Loss", "Muscle Gain", "Maintain Weight", "Increase Energy", "Improve Digestion", "Boost Immunity", "Lower Cholesterol", "Control Blood Sugar", "Reduce Inflammation", "Heart Health"].includes(card));

    setSelectedCards({ dietaryRestrictions, allergies, dietGoals });
  }, []);

  useEffect(() => {
    if (selectedCards.dietaryRestrictions.length || selectedCards.allergies.length || selectedCards.dietGoals.length) {
      const prompt = `
        Suggest a type of diet that follows these rules:
        Dietary Restrictions: ${selectedCards.dietaryRestrictions.join(', ')}
        Allergies: ${selectedCards.allergies.join(', ')}
        Diet Goals: ${selectedCards.dietGoals.join(', ')}
        And make it concise
      `;

      axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          }
        }
      )
        .then(response => {
          setRecipeSuggestion(response.data.choices[0].message.content.trim());
        })
        .catch(error => {
          console.error("Error accessing the OpenAI API:", error);
        });
    }
  }, [selectedCards]);

  const toggleSuggestionSelection = () => {
    setIsSuggestionSelected(prev => !prev);
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1>Diet Recommendation</h1>
      </header>

      <div style={styles.content}>
        <p style={styles.explanation}>
          Based on your selections of dietary restrictions, allergies, and diet goals, here’s a suggested diet that might be suitable for you:
        </p>

        {recipeSuggestion ? (
          <div
            style={{
              ...styles.card,
              backgroundColor: isSuggestionSelected ? '#d0e7ff' : '#ffffff',
              borderColor: isSuggestionSelected ? '#007bff' : '#ccc'
            }}
            onClick={toggleSuggestionSelection}
          >
            <p>{recipeSuggestion}</p>
          </div>
        ) : (
          <p>Loading diet suggestion...</p>
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={goToHome}>Home</button>
        <button
          style={{
            ...styles.button,
            backgroundColor: isSuggestionSelected ? '#007bff' : '#ccc',
            cursor: isSuggestionSelected ? 'pointer' : 'not-allowed'
          }}
          onClick={() => isSuggestionSelected && alert("Diet chosen!")}
          disabled={!isSuggestionSelected}
        >
          Choose Diet
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0fff4', // Light green background for readability
  },
  header: {
    padding: '20px',
    backgroundColor: '#66bb6a', // Light green for header
    color: 'white',
    textAlign: 'center',
    width: '90%',
    fontSize: '1.8em',
    fontWeight: 'bold',
    maxWidth: '600px',
    marginBottom: '20px',
    borderRadius: '8px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '600px',
  },
  explanation: {
    fontSize: '1.1em',
    marginBottom: '20px',
    padding: '0 10px',
    color: '#2e7d32', // Darker green for text
  },
  card: {
    padding: '20px',
    border: '1px solid #a5d6a7', // Light green border
    borderRadius: '5px',
    cursor: 'pointer',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    transition: 'background-color 0.3s, border-color 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    backgroundColor: '#ffffff', // White background for unselected cards
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '90%',
    maxWidth: '400px',
    marginTop: '20px',
    padding: '10px 0',
    gap: '10px',
  },
  button: {
    flex: 1,
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#81c784', // Medium green for primary button
    color: 'white',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  disabledButton: {
    backgroundColor: '#c8e6c9', // Light green-grey for disabled button
    cursor: 'not-allowed',
  },
};

export default SelectedCardsPage;
