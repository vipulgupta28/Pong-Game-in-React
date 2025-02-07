import React, { useState, useEffect, useRef } from "react";
import "./index.css";

const Pong = () => {
  const gameWidth = 800;
  const gameHeight = 400;
  const paddleHeight = 50;
  const paddleWidth = 10;
  const ballSize = 15;

  const [ball, setBall] = useState({ x: gameWidth / 2, y: gameHeight / 2 });
  const [ballDirection, setBallDirection] = useState({
    x: 2 * (Math.random() > 0.5 ? 1 : -1), // Randomized direction at the start
    y: 2 * (Math.random() > 0.5 ? 1 : -1), // Randomized direction at the start
  });
  const [leftPaddle, setLeftPaddle] = useState(
    gameHeight / 2 - paddleHeight / 2
  );
  const [rightPaddle, setRightPaddle] = useState(
    gameHeight / 2 - paddleHeight / 2
  );
  const [score, setScore] = useState({ left: 0, right: 0 });

  const gameRef = useRef(null);

  // Ball movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBall((prev) => ({
        x: prev.x + ballDirection.x,
        y: prev.y + ballDirection.y,
      }));
    }, 10);

    return () => clearInterval(interval);
  }, [ballDirection]);

  // Collision detection
  useEffect(() => {
    const checkCollision = () => {
      if (ball.y <= 0 || ball.y >= gameHeight - ballSize) {
        setBallDirection((prev) => ({ ...prev, y: -prev.y }));
      }

      if (
        ball.x <= paddleWidth &&
        ball.y >= leftPaddle &&
        ball.y <= leftPaddle + paddleHeight
      ) {
        setBallDirection((prev) => increaseSpeed({ ...prev, x: -prev.x }));
      }

      if (
        ball.x >= gameWidth - paddleWidth - ballSize &&
        ball.y >= rightPaddle &&
        ball.y <= rightPaddle + paddleHeight
      ) {
        setBallDirection((prev) => increaseSpeed({ ...prev, x: -prev.x }));
      }

      if (ball.x < 0) {
        setScore((prev) => ({ ...prev, right: prev.right + 1 }));
        resetBall();
      }

      if (ball.x > gameWidth) {
        setScore((prev) => ({ ...prev, left: prev.left + 1 }));
        resetBall();
      }
    };

    checkCollision();
  }, [ball, leftPaddle, rightPaddle]);

  // Function to increase speed
  const increaseSpeed = (direction) => {
    const speedFactor = 1.1;
    const maxSpeed = 10;
    return {
      x:
        Math.sign(direction.x) *
        Math.min(Math.abs(direction.x) * speedFactor, maxSpeed),
      y:
        Math.sign(direction.y) *
        Math.min(Math.abs(direction.y) * speedFactor, maxSpeed),
    };
  };

  // Paddle movement
  const handleKeyDown = (e) => {
    if (e.key === "w" && leftPaddle > 0) {
      setLeftPaddle((prev) => prev - 20);
    }
    if (e.key === "s" && leftPaddle < gameHeight - paddleHeight) {
      setLeftPaddle((prev) => prev + 20);
    }
    if (e.key === "ArrowUp" && rightPaddle > 0) {
      setRightPaddle((prev) => prev - 20);
    }
    if (e.key === "ArrowDown" && rightPaddle < gameHeight - paddleHeight) {
      setRightPaddle((prev) => prev + 20);
    }
  };

  const resetBall = () => {
    setBall({ x: gameWidth / 2, y: gameHeight / 2 });
    setBallDirection({
      x: 2 * (Math.random() > 0.5 ? 1 : -1), // Randomized direction when reset
      y: 2 * (Math.random() > 0.5 ? 1 : -1), // Randomized direction when reset
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [leftPaddle, rightPaddle]);

  return (
    <>
      <h1 className="Heading">Pong Game</h1>
      <div className="instructions-box">
        <h3>Controls</h3>
        <p>
          <strong>Left Paddle:</strong> Use <kbd>W</kbd> (up) and <kbd>S</kbd>{" "}
          (down)
        </p>
        <p>
          <strong>Right Paddle:</strong> Use <kbd>↑</kbd> (up arrow) and{" "}
          <kbd>↓</kbd> (down arrow)
        </p>
      </div>
      <div
        ref={gameRef}
        className="game-area"
        style={{ width: gameWidth, height: gameHeight }}
      >
        <div
          className="paddle left-paddle"
          style={{ height: paddleHeight, width: paddleWidth, top: leftPaddle }}
        />
        <div
          className="paddle right-paddle"
          style={{ height: paddleHeight, width: paddleWidth, top: rightPaddle }}
        />
        <div
          className="ball"
          style={{
            width: ballSize,
            height: ballSize,
            top: ball.y,
            left: ball.x,
          }}
        />
        <div className="scoreboard">
          <span>Left: {score.left}</span> | <span>Right: {score.right}</span>
        </div>
      </div>
    </>
  );
};

export default Pong;