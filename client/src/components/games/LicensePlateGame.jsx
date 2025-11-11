import { useEffect, useState } from "react";
import { randomInt } from "../../util";

// game constants
const NUM_ROUNDS = 5;

function LicensePlateGame() {
  // stats
  const [round, setRound] = useState(1);
  const [numCorrect, setNumCorrect] = useState(0);

  // not playing, showing, guessing, evaluating, finished
  const [stage, setStage] = useState("not playing");
  // keep track of the generated license plate number
  const [plate, setPlate] = useState("");
  // keep track of the user's guess
  const [guess, setGuess] = useState("");
  // keep track of the element that says "correct" or "incorrect"
  const [feedback, setFeedback] = useState(<></>);

  // timer
  const [time, setTime] = useState(0);    // in ms
  const [referenceTime, setReferenceTime] = useState(Date.now());
  const [timerOn, setTimerOn] = useState(false);

  const timerStep = () => {
    setTime(prevTime => {
      const now = Date.now();
      const interval = now - referenceTime;
      setReferenceTime(now);
      return prevTime + interval;
    });
  };

  useEffect(() => {
    if (timerOn) {
      setTimeout(timerStep, 100);
    }
  }, [time, timerOn]);

  const beginGame = () => {
    setTimerOn(true);
    showPlateNumber();
  };

  const newPlateNumber = () => {
    const letter1 = String.fromCharCode(randomInt(65, 90));
    const number2 = randomInt(0, 9);
    const number3 = randomInt(0, 9);
    const letter4 = String.fromCharCode(randomInt(65, 90));
    const letter5 = String.fromCharCode(randomInt(65, 90));
    const letter6 = String.fromCharCode(randomInt(65, 90));

    setPlate(`${letter1}${number2}${number3} ${letter4}${letter5}${letter6}`);
  };

  const showPlateNumber = () => {
    setStage("showing");
    newPlateNumber();
  };

  const hidePlateNumber = () => {
    setStage("guessing");
  }

  const isGuessCorrect = (guess, answer) => {
    return guess.toLowerCase().replaceAll(" ", "") === answer.toLowerCase().replaceAll(" ", "");
  };

  const formatTime = (time) => {
    time = time / 1000;
    if (time >= 60) {
      const min = String(Math.floor(time / 60)).padStart(2, '0');
      const sec = String(Math.floor(time % 60)).padStart(2, '0');
      const ms = String(Math.round(time % 1 * 10));
      return `${min}:${sec}.${ms}`;
    } else {
      const sec = String(Math.floor(time)).padStart(2, '0');
      const ms = String(Math.round(time % 1 * 10));
      return `${sec}.${ms}`;
    }
  }

  const getAccuracy = () => {
    if (numCorrect === 0 && round === 1) {
      return "---"
    } else {
      const denom = (stage === "guessing" || stage === "showing") ? round - 1 : round;
      return `${Math.round((100 * numCorrect / denom) * 10) / 10}%`;
    }
  }

  const getScore = () => {
    return Math.round(1000 * (numCorrect) ** 2 / (time / 1000));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setStage("evaluating");

    // stop the timer
    if (round >= NUM_ROUNDS) {
      // clearInterval(timeInt);
      setTimerOn(false);
    }

    if (isGuessCorrect(guess, plate)) {
      setNumCorrect(currNumCorrect => currNumCorrect + 1);
      setFeedback(
        <p className="feedback correct">Correct</p>
      );
    } else {
      setFeedback(
        <p className="feedback incorrect">Incorrect ({plate})</p>
      );
    }
  };

  const onNext = () => {
    if (round >= NUM_ROUNDS) {
      finishGame();
    } else {
      setGuess("");
      setRound(currRound => currRound + 1);
      showPlateNumber();
    }
  };

  const finishGame = () => {
    setStage("finished");

    /* TODO: store results on database */
  };

  const renderBasedOnPlayingStage = () => {
    if (stage === "showing") {
      return (
        <>
          <p className="plate-number">{plate}</p>
          <button onClick={hidePlateNumber} class="hide-plate">Memorized!</button>
        </>
      );
    } else if (stage === "guessing" || stage === "evaluating") {
      return (
        <>
          <form>
            <input
              autoFocus={true}
              type="text"
              placeholder="Enter guess"
              value={guess}
              disabled={stage !== "guessing"}
              onChange={(e) => setGuess(e.target.value)}
            />
            <input onClick={onSubmit} type="submit" value="Enter" role="button" />
          </form>
          {stage === "evaluating" && (
            <>
              {feedback}
              <button onClick={onNext} className="next">Next</button>
            </>
          )}
        </>
      );
    } else {
      console.log("Invalid stage.");
    }
  };

  const renderBasedOnStage = () => {
    if (stage === "not playing") {
      return <button onClick={beginGame} className="play">Play</button>;
    } else if (stage === "finished") {
      return (
        <div className="results">
          <p>Time: {formatTime(time)} </p>
          <p>Accuracy: {getAccuracy()}</p>
          <p>Score: {getScore()}</p>
        </div>
      );
    } else {
      return (
        <>
          <div className="stats">
            <p>Round: {round}/{NUM_ROUNDS}</p>
            <p>Time: {formatTime(time)} </p>
            <p>Accuracy: {getAccuracy()}</p>
          </div>
          <div className="game-container">
            {renderBasedOnPlayingStage()}
          </div>
        </>
      );
    }
  };

  return (
    <div className="LicensePlateGame">
      <div className="container">
        {renderBasedOnStage()}
      </div>
    </div>
  );
}

export default LicensePlateGame;