import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SelectedCardsPage() {
  const [selectedCards, setSelectedCards] = useState({ group1: [], group2: [], group3: [] });
  const [recipeSuggestion, setRecipeSuggestion] = useState('');

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem('selectedCards')) || [];
    const group1 = storedCards.filter(card => card.includes('Grupo 1'));
    const group2 = storedCards.filter(card => card.includes('Grupo 2'));
    const group3 = storedCards.filter(card => card.includes('Grupo 3'));

    setSelectedCards({ group1, group2, group3 });
  }, []);

  useEffect(() => {
    if (selectedCards.group1.length || selectedCards.group2.length || selectedCards.group3.length) {
      const prompt = `
        Indique uma receita que siga as seguintes regras:
        Grupo 1: ${selectedCards.group1.join(', ')}
        Grupo 2: ${selectedCards.group2.join(', ')}
        Grupo 3: ${selectedCards.group3.join(', ')}
      `;

      axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
          temperature: 0.7,
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
          console.error("Erro ao acessar a API da OpenAI:", error);
        });
    }
  }, [selectedCards]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cartões Selecionados</h2>
      <ul>
        <li><strong>Grupo 1:</strong> {selectedCards.group1.join(', ')}</li>
        <li><strong>Grupo 2:</strong> {selectedCards.group2.join(', ')}</li>
        <li><strong>Grupo 3:</strong> {selectedCards.group3.join(', ')}</li>
      </ul>

      <h3>Sugestão de Receita</h3>
      <p>{recipeSuggestion || "Carregando sugestão de receita..."}</p>
    </div>
  );
}

export default SelectedCardsPage;
