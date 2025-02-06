import React, { useState, useEffect } from "react";
import "./index.css";

const colors = ["red", "blue", "green", "teal", "purple", "orange"];

const ColorGame = () => {
  const [targetColor, setTargetColor] = useState("");
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("Guess the correct color!");
  const [timeLeft, setTimeLeft] = useState(10);
  const [streak, setStreak] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [boxColor, setBoxColor] = useState("gray");

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStatus("Time's Up! Click New Game.");
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  useEffect(() => {
    let interval;
    if (gameActive) {
      interval = setInterval(() => {
        setBoxColor(colors[Math.floor(Math.random() * colors.length)]);
      }, 300);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  // Start a new round 
  const startNewRound = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(randomColor);
    setGameStatus("Guess the correct color!");
    setTimeLeft(10);
    setGameActive(true);
  };

  // Reset game
  const startNewGame = () => {
    setScore(0);
    setStreak(0);
    startNewRound();
  };

  const handleGuess = (color) => {
    if (!gameActive) return;

    if (color === targetColor) {
      setGameStatus("Correct! 🎉");
      setScore((prevScore) => prevScore + 1);
      setStreak((prevStreak) => prevStreak + 1);
      playSound("correct");
      startNewRound(); 
    } else {
      setGameStatus("Wrong! Try again.");
      setStreak(0);
      playSound("wrong");
    }
  };

  const playSound = (type) => {
    const audio = new Audio(type === "correct" ? "./correct.mp3" : "./wrong.mp3");
    audio.play().catch((error) => console.error("Audio error:", error));
  };

  return (
    <div className="game-container">
      <h1>Color Guessing Game</h1>
      <p data-testid="gameInstructions">Guess the correct color before time runs out!</p>
      <div data-testid="colorBox" className={`color-box ${gameActive ? "rotate" : ""}`} style={{ backgroundColor: gameActive ? boxColor : "gray" }}></div>
      <p className="timer">Time Left: {timeLeft}s</p>
      <div className="buttons-container">
        {colors.map((color) => (
          <button 
            key={color} 
            data-testid="colorOption" 
            className="color-button" 
            style={{ backgroundColor: color }} 
            onClick={() => handleGuess(color)} 
            disabled={!gameActive}
          >
            {color}
          </button>
        ))}
      </div>
      <p data-testid="gameStatus" className="game-status">{gameStatus}</p>
      <p data-testid="score" className="score">Score: {score} | Streak: {streak}</p>
      <button data-testid="newGameButton" className="new-game-button" onClick={startNewGame}>New Game</button>
    </div>
  );
};

export default ColorGame;
