import { useState, useEffect } from "react";
import CountDownTimer from "../components/CountDownTimer";

function MathGame() {
  const TOTAL = 5;
  const ROUND_TIME = 10000;

  const [round, setRound] = useState(1);
  const [difficulty, setDifficulty] = useState("easy");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // difficulty logic
  useEffect(() => {
    if (round === 1) setDifficulty("easy");
    else if (round === 2) setDifficulty("medium");
    else setDifficulty("hard");
  }, [round]);

  // new question when round or difficulty changes
  useEffect(() => {
    if (!running || gameOver) return;
    generateQuestion();
  }, [round, difficulty, running]);

  function generateQuestion() {
    let max, ops;

    if (difficulty === "easy") {
      max = 10;
      ops = ["+"];
    } else if (difficulty === "medium") {
      max = 20;
      ops = ["+", "-"];
    } else {
      max = 50;
      ops = ["+", "-", "*"];
    }

    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    const op = ops[Math.floor(Math.random() * ops.length)];

    setQuestion(`${a} ${op} ${b}`);
  }

  function nextRound() {
    if (round >= TOTAL) {
      setRunning(false);
      setGameOver(true);
      return;
    }

    setRound(r => r + 1);
    setStartTime(Date.now());
  }

  function startGame() {
    setRound(1);
    setScore(0);
    setDifficulty("easy");
    setAnswer("");
    setGameOver(false);
    setRunning(true);
    setStartTime(Date.now());
  }

  function calculateOverallScore(score){
    return score/TOTAL; //score divided number of rounds  
  }

  function submit(e) {
    if(e.key && e.key!=="Enter") return; 
    e.preventDefault();
    const correct = eval(question);
    console.log(Number(answer) === correct ? "correct" : "wrong");
    if((Number(answer)===correct))setScore(prev=> prev+1);
    setAnswer("");
    nextRound();
  }

  // GAME OVER SCREEN
  if (gameOver) {
    calculateOverallScore(score);
    return (
      <>
        <h1 className="text-xl text-center">Game Over!</h1>
        <h2 className="text-center">{score} out of {TOTAL}</h2>
        <button onClick={startGame} className="btn">Play Again</button>
      </>
    );
  }

  // START SCREEN
  if (!running) {
    return (
      <>
        <h1 className="text-center text-xl mb-4">Welcome to Speed Math</h1>
      <div className="flex justify-center">
        <button className="btn btn-primary bg-[#B2BFFE] hover:bg-blue-700 " onClick={startGame}>Start Game</button>
      </div>
      </>
    );
  }

  // GAME ACTIVE
  return (
    <>
      <h1 className="text-xl text-center">Round {round} out of {TOTAL}</h1>
      

      <CountDownTimer
        startTime={startTime}
        duration={ROUND_TIME}
        onExpire={nextRound}
      />

      <h2 className="text-xl text-center">{question}</h2>

      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={submit}
        className="input-lg outline"
      />
      <br></br>

      <button onClick={submit} className="btn">Next</button>
    </>
  );
}

export default MathGame;