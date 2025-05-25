import React, { useState, useEffect } from 'react';
import "./App.css"
const EMOJI_CATEGORIES = {
  animals: ['🐶', '🐱', '🐵', '🐰', '🦊', '🐻'],
  food: ['🍕', '🍟', '🍔', '🍩', '🌮', '🍎'],
  sports: ['⚽', '🏀', '🏈', '🎾', '🏐', '🎱'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼'],
  space: ['🌟', '⭐', '🌙', '☀️', '🪐', '🚀'],
  hearts: ['❤️', '💖', '💕', '💗', '💝', '💘']
};

const CATEGORY_NAMES = {
  animals: 'Animals',
  food: 'Food',
  sports: 'Sports',
  nature: 'Nature',
  space: 'Space',
  hearts: 'Hearts'
};

function App() {
  const [gameState, setGameState] = useState('category-selection'); 
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerCategories, setPlayerCategories] = useState({ 1: null, 2: null });
  const [playerEmojis, setPlayerEmojis] = useState({ 1: [], 2: [] });
  const [playerPositions, setPlayerPositions] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [availableCategories, setAvailableCategories] = useState(Object.keys(EMOJI_CATEGORIES));
  const [scores, setScores] = useState({ 1: 0, 2: 0 });

  const selectCategory = (category) => {
    if (playerCategories[1] === null) {
      setPlayerCategories(prev => ({ ...prev, 1: category }));
      setAvailableCategories(prev => prev.filter(c => c !== category));
    } else if (playerCategories[2] === null) {
      setPlayerCategories(prev => ({ ...prev, 2: category }));
      setAvailableCategories(prev => prev.filter(c => c !== category));
      setGameState('playing');
    }
  };

  const getRandomEmoji = (player) => {
    const category = playerCategories[player];
    const emojis = EMOJI_CATEGORIES[category];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const checkWinner = (board, playerPositions) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6] 
    ];

    for (let player of [1, 2]) {
      for (let pattern of winPatterns) {
        if (pattern.every(pos =>
          playerPositions[player].includes(pos) &&
          board[pos] &&
          EMOJI_CATEGORIES[playerCategories[player]].includes(board[pos])
        )) {
          return { winner: player, pattern };
        }
      }
    }
    return null;
  };

  const makeMove = (position) => {
    if (board[position] !== null || gameState !== 'playing') return;

    const newEmoji = getRandomEmoji(currentPlayer);
    const newBoard = [...board];
    const newPlayerEmojis = { ...playerEmojis };
    const newPlayerPositions = { ...playerPositions };

    
    newPlayerEmojis[currentPlayer] = [...playerEmojis[currentPlayer], newEmoji];
    newPlayerPositions[currentPlayer] = [...playerPositions[currentPlayer], position];

   
    if (newPlayerPositions[currentPlayer].length > 3) {
      const oldestPosition = newPlayerPositions[currentPlayer].shift();
      newPlayerEmojis[currentPlayer].shift();
      newBoard[oldestPosition] = null;
    }

    newBoard[position] = newEmoji;

    setBoard(newBoard);
    setPlayerEmojis(newPlayerEmojis);
    setPlayerPositions(newPlayerPositions);

   
    const result = checkWinner(newBoard, newPlayerPositions);
    if (result) {
      setWinner(result);
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
      setGameState('game-over');
      return;
    }

    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setPlayerEmojis({ 1: [], 2: [] });
    setPlayerPositions({ 1: [], 2: [] });
    setWinner(null);
    setGameState('playing');
  };

  const startNewGame = () => {
    setGameState('category-selection');
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setPlayerCategories({ 1: null, 2: null });
    setPlayerEmojis({ 1: [], 2: [] });
    setPlayerPositions({ 1: [], 2: [] });
    setWinner(null);
    setAvailableCategories(Object.keys(EMOJI_CATEGORIES));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎮 Emoji Tic Tac Toe</h1>
        <div className="score-board">
          <div className="score">
            Player 1: {scores[1]} | Player 2: {scores[2]}
          </div>
          <button className="help-btn" onClick={() => setShowHelp(true)}>
            ❓ Help
          </button>
        </div>
      </header>

    
      {gameState === 'category-selection' && (
        <div className="category-selection">
          <h2>
            {playerCategories[1] === null
              ? "Player 1: Choose your emoji category"
              : "Player 2: Choose your emoji category"}
          </h2>
          <div className="categories-grid">
            {availableCategories.map(category => (
              <div
                key={category}
                className="category-card"
                onClick={() => selectCategory(category)}
              >
                <div className="category-emojis">
                  {EMOJI_CATEGORIES[category].slice(0, 3).map((emoji, i) => (
                    <span key={i} className="category-emoji">{emoji}</span>
                  ))}
                </div>
                <div className="category-name">{CATEGORY_NAMES[category]}</div>
              </div>
            ))}
          </div>
          {playerCategories[1] && (
            <div className="selection-status">
              Player 1 selected: {CATEGORY_NAMES[playerCategories[1]]}
              {EMOJI_CATEGORIES[playerCategories[1]].slice(0, 3).join(' ')}
            </div>
          )}
        </div>
      )}

     
      {(gameState === 'playing' || gameState === 'game-over') && (
        <div className="game-container">
          <div className="game-info">
            <div className="player-info">
              <div className={`player ${currentPlayer === 1 ? 'active' : ''}`}>
                Player 1: {CATEGORY_NAMES[playerCategories[1]]}
                <div className="player-emojis">
                  {playerEmojis[1].map((emoji, i) => (
                    <span key={i} className="player-emoji">{emoji}</span>
                  ))}
                </div>
              </div>
              <div className={`player ${currentPlayer === 2 ? 'active' : ''}`}>
                Player 2: {CATEGORY_NAMES[playerCategories[2]]}
                <div className="player-emojis">
                  {playerEmojis[2].map((emoji, i) => (
                    <span key={i} className="player-emoji">{emoji}</span>
                  ))}
                </div>
              </div>
            </div>
            {gameState === 'playing' && (
              <div className="turn-indicator">
                Player {currentPlayer}'s Turn
              </div>
            )}
          </div>

          <div className="board">
            {board.map((cell, index) => (
              <div
                key={index}
                className={`cell ${winner && winner.pattern.includes(index) ? 'winning-cell' : ''}`}
                onClick={() => makeMove(index)}
              >
                {cell && <span className="cell-emoji">{cell}</span>}
              </div>
            ))}
          </div>

          <div className="game-controls">
            <button onClick={resetGame} className="reset-btn">
              🔄 Reset Round
            </button>
            <button onClick={startNewGame} className="new-game-btn">
              🆕 New Game
            </button>
          </div>
        </div>
      )}

    
      {winner && (
        <div className="modal-overlay">
          <div className="winner-modal">
            <div className="confetti">🎉</div>
            <h2>🏆 Player {winner.winner} Wins! 🏆</h2>
            <div className="winning-combination">
              Winning combination: {winner.pattern.map(pos => board[pos]).join(' ')}
            </div>
            <div className="modal-buttons">
              <button onClick={resetGame} className="play-again-btn">
                🔄 Play Again
              </button>
              <button onClick={startNewGame} className="new-match-btn">
                🆕 New Match
              </button>
            </div>
          </div>
        </div>
      )}

    
      {showHelp && (
        <div className="modal-overlay">
          <div className="help-modal">
            <h2>🎮 How to Play</h2>
            <div className="help-content">
              <h3>🎯 Objective</h3>
              <p>Get 3 of your emojis in a row (horizontal, vertical, or diagonal)</p>
             
              <h3>🎲 Game Rules</h3>
              <ul>
                <li>Each player chooses an emoji category</li>
                <li>On your turn, you get a random emoji from your category</li>
                <li>Place your emoji on any empty cell</li>
                <li>You can only have 3 emojis on the board at once</li>
                <li>When you place a 4th emoji, your oldest emoji disappears</li>
                <li>First to get 3 in a row wins!</li>
              </ul>
             
              <h3>✨ Special Features</h3>
              <ul>
                <li>Vanishing emojis: Only 3 per player at a time</li>
                <li>Random emoji selection from your category</li>
                <li>Score tracking across multiple rounds</li>
              </ul>
            </div>
            <button onClick={() => setShowHelp(false)} className="close-help-btn">
              ✖️ Close
            </button>
          </div>
        </div>
      )}
 
     
    </div>
  );
}

export default App;
