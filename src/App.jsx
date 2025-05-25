import React, { useState, useEffect } from 'react';

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

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Arial', sans-serif;
          color: white;
          padding: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0 0 20px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .score-board {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .score {
          font-size: 1.2rem;
          background: rgba(255,255,255,0.2);
          padding: 10px 20px;
          border-radius: 25px;
          backdrop-filter: blur(10px);
        }

        .help-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 10px 15px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .help-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }

        .category-selection {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .category-selection h2 {
          font-size: 1.5rem;
          margin-bottom: 30px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .category-card {
          background: rgba(255,255,255,0.15);
          border-radius: 15px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
        }

        .category-card:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-5px);
          border: 2px solid rgba(255,255,255,0.3);
        }

        .category-emojis {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .category-emoji {
          margin: 0 5px;
        }

        .category-name {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .selection-status {
          background: rgba(255,255,255,0.2);
          padding: 15px;
          border-radius: 10px;
          font-size: 1.1rem;
        }

        .game-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .game-info {
          margin-bottom: 30px;
        }

        .player-info {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .player {
          background: rgba(255,255,255,0.15);
          padding: 15px;
          border-radius: 10px;
          flex: 1;
          min-width: 200px;
          transition: all 0.3s ease;
        }

        .player.active {
          background: rgba(255,255,255,0.3);
          border: 2px solid white;
          box-shadow: 0 0 20px rgba(255,255,255,0.3);
        }

        .player-emojis {
          margin-top: 10px;
          min-height: 30px;
        }

        .player-emoji {
          font-size: 1.5rem;
          margin: 0 5px;
        }

        .turn-indicator {
          text-align: center;
          font-size: 1.3rem;
          font-weight: bold;
          background: rgba(255,255,255,0.2);
          padding: 10px;
          border-radius: 25px;
        }

        .board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          max-width: 300px;
          margin: 0 auto 30px auto;
        }

        .cell {
          aspect-ratio: 1;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .cell:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.05);
        }

        .cell-emoji {
          font-size: 2.5rem;
          animation: popIn 0.3s ease-out;
        }

        .winning-cell {
          background: rgba(255,215,0,0.6) !important;
          animation: pulse 1s infinite;
        }

        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .game-controls {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .reset-btn, .new-game-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .reset-btn:hover, .new-game-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .winner-modal, .help-modal {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          position: relative;
          animation: modalPop 0.5s ease-out;
        }

        .winner-modal {
          border: 3px solid gold;
          box-shadow: 0 0 30px rgba(255,215,0,0.5);
        }

        @keyframes modalPop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .confetti {
          font-size: 3rem;
          margin-bottom: 20px;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .winner-modal h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: gold;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .winning-combination {
          font-size: 1.5rem;
          margin-bottom: 30px;
          background: rgba(255,255,255,0.2);
          padding: 15px;
          border-radius: 10px;
        }

        .modal-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .play-again-btn, .new-match-btn, .close-help-btn {
          background: rgba(255,255,255,0.3);
          border: none;
          color: white;
          padding: 15px 25px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-weight: bold;
        }

        .play-again-btn:hover, .new-match-btn:hover, .close-help-btn:hover {
          background: rgba(255,255,255,0.5);
          transform: scale(1.05);
        }

        .help-modal {
          max-width: 600px;
          text-align: left;
        }

        .help-modal h2 {
          text-align: center;
          margin-bottom: 30px;
        }

        .help-content h3 {
          color: #FFD700;
          margin: 20px 0 10px 0;
        }

        .help-content ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .help-content li {
          margin: 8px 0;
          line-height: 1.5;
        }

        .close-help-btn {
          display: block;
          margin: 30px auto 0 auto;
        }

        @media (max-width: 768px) {
          .app {
            padding: 10px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .categories-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
          }

          .category-card {
            padding: 15px;
          }

          .player-info {
            flex-direction: column;
          }

          .board {
            max-width: 270px;
          }

          .cell-emoji {
            font-size: 2rem;
          }

          .game-controls {
            flex-direction: column;
            align-items: center;
          }

          .modal-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
