

🎮 Emoji Tic Tac Toe
A playful twist on classic Tic Tac Toe, built with React! Players select emoji categories and take turns placing random emojis on the board. But there's a twist — emojis vanish after 3 plays!

🧰 Tech Stack
React (Functional Components & Hooks)

JavaScript (ES6+)

CSS for basic styling and responsive UI

🏷️ Emoji Categories
Players can choose from the following fun categories:

🐶 Animals: 🐶 🐱 🐵 🐰 🦊 🐻

🍔 Food: 🍕 🍟 🍔 🍩 🌮 🍎

⚽ Sports: ⚽ 🏀 🏈 🎾 🏐 🎱

🌸 Nature: 🌸 🌺 🌻 🌷 🌹 🌼

🌟 Space: 🌟 ⭐ 🌙 ☀️ 🪐 🚀

❤️ Hearts: ❤️ 💖 💕 💗 💝 💘

🧙 Vanishing Emoji Feature
To keep things dynamic, each player can only have 3 emojis on the board at a time. Once a player places a 4th emoji:

The oldest emoji (based on turn order) is automatically removed from the board.

This is implemented by:

Tracking player positions in playerPositions

Using .shift() to remove the oldest entry when the count exceeds 3

Updating the board to null at the removed position

if (newPlayerPositions[currentPlayer].length > 3) {
  const oldestPosition = newPlayerPositions[currentPlayer].shift();
  newPlayerEmojis[currentPlayer].shift();
  newBoard[oldestPosition] = null;
}
This keeps gameplay strategic and fresh!

