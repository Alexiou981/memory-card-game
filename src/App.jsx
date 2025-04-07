// App.jsx
import React, { useState } from 'react';
import Card from './components/Card'; // Using Option 2 (with 'context')
import './App.css';

// Shuffle function using Fisher–Yates algorithm
const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Create deck with pairs (using 'context' as the card's value)
const createDeck = () => {
  const uniqueContexts = ["A", "B", "C", "D", "E"];
  let deck = [];
  let id = 1;
  uniqueContexts.forEach(context => {
    deck.push({ id: id++, context, isFlipped: false });
    deck.push({ id: id++, context, isFlipped: false });
  });
  return shuffle(deck);
};

function App() {
  const [cards, setCards] = useState(createDeck());
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleCardSelect = (card) => {
    // If game is over, do nothing.
    if (gameOver) return;
    
    // Prevent clicking an already flipped card
    if (card.isFlipped) return;

    // Flip the clicked card
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      )
    );

    // Add card to the selection
    const newSelection = [...selectedCards, { ...card, isFlipped: true }];
    setSelectedCards(newSelection);

    // If two cards are selected, check for a match
    if (newSelection.length === 2) {
      const [first, second] = newSelection;
      if (first.context === second.context) {
        // They match: update score and clear selection
        setScore(prevScore => prevScore + 1);
        setSelectedCards([]);
      } else {
        // They don't match: game over
        setGameOver(true);
        // Optionally, you could flip them back after a delay:
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              (c.id === first.id || c.id === second.id)
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // Restart game handler: resets all state
  const restartGame = () => {
    setCards(createDeck());
    setSelectedCards([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="App">
      <h1>Memory Card Game</h1>
      <h2>Score: {score}</h2>
      
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over! Please Try Again</h2>
          <button onClick={restartGame}>Restart Game</button>
        </div>
      ) : (
        <div className="cards-container">
          {cards.map(card => (
            <Card
              key={card.id}
              id={card.id}
              context={card.context}
              isFlipped={card.isFlipped}
              onSelect={handleCardSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
