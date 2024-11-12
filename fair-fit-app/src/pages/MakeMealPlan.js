import React, { useState } from 'react';

function MyPage() {
  // Define the three groups of cards with dietary restrictions, allergies, and diet goals
  const cardGroups = [
    {
      type: "Dietary Restrictions",
      cards: [
        "Gluten-Free",
        "Lactose-Free",
        "Vegan",
        "Vegetarian",
        "Low Carb",
        "Sugar-Free",
        "Kosher",
        "Halal",
        "Paleo",
        "Keto"
      ],
    },
    {
      type: "Allergies",
      cards: [
        "Peanut Allergy",
        "Tree Nut Allergy",
        "Egg Allergy",
        "Fish Allergy",
        "Shellfish Allergy",
        "Wheat Allergy",
        "Soy Allergy",
        "Milk Allergy",
        "Sesame Allergy",
        "Sulphite Allergy"
      ],
    },
    {
      type: "Diet Goals",
      cards: [
        "Weight Loss",
        "Muscle Gain",
        "Maintain Weight",
        "Increase Energy",
        "Improve Digestion",
        "Boost Immunity",
        "Lower Cholesterol",
        "Control Blood Sugar",
        "Reduce Inflammation",
        "Heart Health"
      ],
    },
  ];

  // States for the current group, selected cards, and navigation control
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [selectedCardsGroup1, setSelectedCardsGroup1] = useState([]);
  const [selectedCardsGroup2, setSelectedCardsGroup2] = useState([]);
  const [selectedCardsGroup3, setSelectedCardsGroup3] = useState([]);

  // Function to get the selected cards for the current group
  const getSelectedCards = () => {
    if (currentGroupIndex === 0) return selectedCardsGroup1;
    if (currentGroupIndex === 1) return selectedCardsGroup2;
    return selectedCardsGroup3;
  };

  // Function to set the selected cards for the current group
  const setSelectedCards = (newSelectedCards) => {
    if (currentGroupIndex === 0) setSelectedCardsGroup1(newSelectedCards);
    else if (currentGroupIndex === 1) setSelectedCardsGroup2(newSelectedCards);
    else setSelectedCardsGroup3(newSelectedCards);
  };

  // Toggle the selection of a card based on its content
  const toggleCardSelection = (card) => {
    setSelectedCards((prevState) =>
      prevState.includes(card)
        ? prevState.filter((c) => c !== card)
        : [...prevState, card]
    );
  };

  // Function to move to the next group or go to another page
  const nextGroup = () => {
    if (currentGroupIndex < cardGroups.length - 1) {
      setCurrentGroupIndex((prevIndex) => prevIndex + 1);
    } else {
      // Save all selected cards in localStorage before redirecting
      const allSelectedCards = [...selectedCardsGroup1, ...selectedCardsGroup2, ...selectedCardsGroup3];
      localStorage.setItem('selectedCards', JSON.stringify(allSelectedCards));
      window.location.href = "/next-page"; // Redirects to another page
    }
  };

  // Function to go back to the previous group of cards
  const previousGroup = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <h1>My Header</h1>
      </header>

      {/* ScrollView of Cards */}
      <div style={styles.scrollView}>
        {cardGroups[currentGroupIndex].cards.map((card) => (
          <div
            key={card}
            style={{
              ...styles.card,
              backgroundColor: getSelectedCards().includes(card) ? 'lightblue' : 'white',
            }}
            onClick={() => toggleCardSelection(card)}
          >
            {card}
          </div>
        ))}
      </div>

      {/* ScrollView Buttons */}
      <div style={styles.scrollViewButtons}>
        <button
          style={{ ...styles.button, opacity: currentGroupIndex === 0 ? 0.5 : 1 }}
          onClick={previousGroup}
          disabled={currentGroupIndex === 0}
        >
          {currentGroupIndex > 0
            ? `Previous: ${cardGroups[currentGroupIndex - 1].type}`
            : "Previous"}
        </button>
        <button style={styles.button} onClick={nextGroup}>
          {currentGroupIndex < cardGroups.length - 1
            ? `Next: ${cardGroups[currentGroupIndex + 1].type}`
            : "Finish"}
        </button>
      </div>

      {/* Bottom Page Buttons */}
      <footer style={styles.footer}>
        <button style={styles.button}>Button A</button>
        <button style={styles.button}>Button B</button>
        <button style={styles.button}>Button C</button>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f1f8e9',
    color: '#2e7d32',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    padding: '20px',
    backgroundColor: '#66bb6a',
    color: 'white',
    textAlign: 'center',
    fontSize: '1.8em',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '20px',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  card: {
    padding: '15px 10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '120px',
    textAlign: 'center',
    fontSize: '1em',
    color: '#333',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  scrollViewButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '15px',
    backgroundColor: '#e0f2f1',
    borderTop: '1px solid #c8e6c9',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#66bb6a',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    backgroundColor: '#c8e6c9',
    borderTop: '1px solid #a5d6a7',
  },
  footerButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#388e3c',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
  },
};

export default MyPage;
