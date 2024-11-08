import React, { useState } from 'react';

function MyPage() {
  // Definindo os três conjuntos de cards
  const cardGroups = [
    Array.from({ length: 10 }, (_, index) => `Grupo 1 - Card ${index + 1}`),
    Array.from({ length: 10 }, (_, index) => `Grupo 2 - Card ${index + 1}`),
    Array.from({ length: 10 }, (_, index) => `Grupo 3 - Card ${index + 1}`)
  ];

  // Estados para o grupo atual, seleção de cartões, e controle de navegação
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [selectedCardsGroup1, setSelectedCardsGroup1] = useState([]);
  const [selectedCardsGroup2, setSelectedCardsGroup2] = useState([]);
  const [selectedCardsGroup3, setSelectedCardsGroup3] = useState([]);

  // Função para obter o estado de seleção do grupo atual
  const getSelectedCards = () => {
    if (currentGroupIndex === 0) return selectedCardsGroup1;
    if (currentGroupIndex === 1) return selectedCardsGroup2;
    return selectedCardsGroup3;
  };

  // Função para definir o estado de seleção do grupo atual
  const setSelectedCards = (newSelectedCards) => {
    if (currentGroupIndex === 0) setSelectedCardsGroup1(newSelectedCards);
    else if (currentGroupIndex === 1) setSelectedCardsGroup2(newSelectedCards);
    else setSelectedCardsGroup3(newSelectedCards);
  };

  // Alterna a seleção de um card com base no conteúdo do card
  const toggleCardSelection = (card) => {
    setSelectedCards((prevState) =>
      prevState.includes(card)
        ? prevState.filter((c) => c !== card)
        : [...prevState, card]
    );
  };

  // Função para avançar para o próximo grupo de cartões ou ir para outra página
  const nextGroup = () => {
    if (currentGroupIndex < cardGroups.length - 1) {
      setCurrentGroupIndex((prevIndex) => prevIndex + 1);
    } else {
      // Salvar todos os cartões selecionados no localStorage antes de redirecionar
      const allSelectedCards = [...selectedCardsGroup1, ...selectedCardsGroup2, ...selectedCardsGroup3];
      localStorage.setItem('selectedCards', JSON.stringify(allSelectedCards));
      window.location.href = "/outra-pagina"; // Redireciona para outra página
    }
  };

  // Função para retroceder para o grupo anterior de cartões
  const previousGroup = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <h1>Meu Header</h1>
      </header>

      {/* ScrollView de Cards */}
      <div style={styles.scrollView}>
        {cardGroups[currentGroupIndex].map((card) => (
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

      {/* Botões no final da ScrollView */}
      <div style={styles.scrollViewButtons}>
        <button
          style={{ ...styles.button, opacity: currentGroupIndex === 0 ? 0.5 : 1 }}
          onClick={previousGroup}
          disabled={currentGroupIndex === 0}
        >
          Botão 1 - Anterior
        </button>
        <button style={styles.button} onClick={nextGroup}>
          Botão 2 - Próximo
        </button>
      </div>

      {/* Botões na parte inferior da página */}
      <footer style={styles.footer}>
        <button style={styles.button}>Botão A</button>
        <button style={styles.button}>Botão B</button>
        <button style={styles.button}>Botão C</button>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  header: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    maxHeight: '300px', // Limita a altura da ScrollView
  },
  card: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100px',
    textAlign: 'center',
  },
  scrollViewButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default MyPage;
