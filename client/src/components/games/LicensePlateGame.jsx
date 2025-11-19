import { useEffect, useState } from "react";
import { randomInt } from "../../util";
import { useAuth } from "../../AuthContext";

// game constants
const NUM_ROUNDS = 5;

function LicensePlateGame({ gameId }) {
  const { isAuthenticated, user } = useAuth();

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
  const [time, setTime] = useState(0); // in ms
  const [referenceTime, setReferenceTime] = useState(Date.now());
  const [timerOn, setTimerOn] = useState(false);

  const timerStep = () => {
    setTime((prevTime) => {
      const now = Date.now();
      const interval = now - referenceTime;
      setReferenceTime(now);
      return prevTime + interval;
    });
  };

  useEffect(() => {
    if (timerOn) {
      const t = setTimeout(timerStep, 100);
      return () => clearTimeout(t);
    }
  }, [time, timerOn]);

  const beginGame = () => {
    setGuess("");
    setTimerOn(true);
    setTime(0);
    setReferenceTime(Date.now());
    setRound(1);
    setNumCorrect(0);
    setFeedback(<></>);
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
  };

  const isGuessCorrect = (guess, answer) => {
    return (
      guess.toLowerCase().replaceAll(" ", "") ===
      answer.toLowerCase().replaceAll(" ", "")
    );
  };

  const formatTime = (time) => {
    time = time / 1000;
    if (time >= 60) {
      const min = String(Math.floor(time / 60)).padStart(2, "0");
      const sec = String(Math.floor(time % 60)).padStart(2, "0");
      const ms = String(Math.round((time % 1) * 10));
      return `${min}:${sec}.${ms}`;
    } else {
      const sec = String(Math.floor(time)).padStart(2, "0");
      const ms = String(Math.round((time % 1) * 10));
      return `${sec}.${ms}`;
    }
  };

  const getAccuracy = () => {
    if (numCorrect === 0 && round === 1) {
      return 0;
    } else {
      const denom =
        stage === "guessing" || stage === "showing" ? round - 1 : round;
      return numCorrect / denom;
    }
  };

  const getAccuracyFormatted = () => {
    const acc = getAccuracy();
    if (acc == null) {
      return "---";
    } else {
      return `${Math.round(100 * acc * 10) / 10}%`;
    }
  };

  const getScore = () => {
    return Math.round((1000 * numCorrect ** 2) / (time / 1000));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStage("evaluating");

    // stop the timer if finished
    if (round >= NUM_ROUNDS) {
      setTimerOn(false);
    }

    if (isGuessCorrect(guess, plate)) {
      console.log("Correct");
      setNumCorrect((currNumCorrect) => currNumCorrect + 1);
      setFeedback(<p className="text-success font-semibold">Correct</p>);
    } else {
      console.log("Incorrect");
      setFeedback(
        <p className="text-error font-semibold">Incorrect ({plate})</p>
      );
    }
  };

  const onNext = () => {
    if (round >= NUM_ROUNDS) {
      finishGame();
    } else {
      setGuess("");
      setRound((currRound) => currRound + 1);
      showPlateNumber();
    }
  };

  const finishGame = async () => {
    setStage("finished");

    /* TODO: store results on database */
    if (!isAuthenticated) return;
    const userId = user.id;

    const res = await fetch("/api/user-game-stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        gameId: gameId,
        score: getScore(),
        accuracy: getAccuracy(),
        timeTaken: time,
        datePlayed: new Date().toISOString(),
      }),
    });
    try {
      const json = await res.json();
      console.log(res.status, json);
    } catch (err) {
      console.error("store result error", err);
    }
  };

  useEffect(() => {
    // if (stage !== "evaluating") return;
    const handler = (e) => {
      if (e.key !== "Enter") return;
      // prevent default to avoid double submits / unwanted page reloads
      e.preventDefault();
      if (stage === "not playing" || stage === "finished") {
        beginGame();
      } else if (stage === "showing") {
        hidePlateNumber();
      } else if (stage === "guessing") {
        // call the same submit handler used by the form
        onSubmit(e);
      } else if (stage === "evaluating") {
        // if we're viewing the result, Enter should advance to next
        onNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stage, onNext]);

  const renderBasedOnPlayingStage = () => {
    if (stage === "showing") {
      return (
        <>
          <button onClick={hidePlateNumber} className="btn btn-primary mt-4">
            Memorized!
          </button>
        </>
      );
    } else if (stage === "guessing" || stage === "evaluating") {
      return (
        <>
          <form
            onSubmit={onSubmit}
            className="w-full flex flex-row gap-2"
          >
            <input
              autoFocus
              type="text"
              placeholder="Enter guess"
              value={guess}
              disabled={stage !== "guessing"}
              onChange={(e) => setGuess(e.target.value)}
              className="input input-bordered w-[4/5] mb-3"
            />
            <div className="flex w-[1/5] gap-2">
              <button type="submit" className="btn btn-primary">
                Enter
              </button>
              {stage === "evaluating" && (
                <button
                  type="button"
                  onClick={onNext}
                  className="btn btn-ghost"
                >
                  Next
                </button>
              )}
            </div>
          </form>
          {stage === "evaluating" && <div className="mt-3">{feedback}</div>}
        </>
      );
    } else {
      return null;
    }
  };

  const renderBasedOnStage = () => {
    if (stage === "not playing") {
      return (
        <button onClick={beginGame} className="btn btn-primary">
          Play
        </button>
      );
    } else if (stage === "finished") {
      return (
        <div className="card bg-base-100 shadow p-4 items-center">
          <p className="text-lg">
            Time: <span className="font-semibold">{formatTime(time)}</span>
          </p>
          <p className="text-lg">
            Accuracy:{" "}
            <span className="font-semibold">{getAccuracyFormatted()}</span>
          </p>
          <p className="text-lg">
            Score: <span className="font-semibold">{getScore()}</span>
          </p>
          <div className="mt-4">
            <button onClick={beginGame} className="btn btn-primary mr-2">
              Play Again
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="flex items-center justify-center mb-4 flex-col">
            <div className="stats stats-vertical md:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Round</div>
                <div className="stat-value">
                  {round}/{NUM_ROUNDS}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Time</div>
                <div className="stat-value">{formatTime(time)}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Accuracy</div>
                <div className="stat-value">{getAccuracyFormatted()}</div>
              </div>
            </div>

            <div className="game-container mt-4 flex flex-col">
              {renderBasedOnPlayingStage()}
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="hero min-h-[90vh] bg-base-200 rounded-lg p-6">
      <div className="hero-content flex-col lg:flex-row gap-8 w-full">
        <div className="w-full lg:w-2/3">
          <div className="card bg-base-100 shadow p-6">
            <h2 className="text-2xl font-bold mb-4">License Plate Challenge</h2>
            <div className="flex items-center justify-center mb-4">
              {/* Large plate display when showing */}
              {stage === "showing" ? (
                <div className="badge badge-lg badge-outline p-6 text-4xl font-mono tracking-widest">
                  {plate}
                </div>
              ) : (
                <div className="text-center text-4xl text-muted">Ready?</div>
              )}
            </div>

            <div>{renderBasedOnStage()}</div>
          </div>
        </div>

        {/*Stats table on Side */}
        {/* <aside className="w-full lg:w-1/3">
          <div className="card bg-base-100 shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Stats</h3>
            <div className="mb-3">
              <div className="text-sm text-muted">Round</div>
              <div className="text-xl font-medium">
                {round}/{NUM_ROUNDS}
              </div>
            </div>
            <div className="mb-3">
              <div className="text-sm text-muted">Time</div>
              <div className="text-xl font-medium">{formatTime(time)}</div>
            </div>
            <div className="mb-3">
              <div className="text-sm text-muted">Accuracy</div>
              <div className="text-xl font-medium">
                {getAccuracyFormatted()}
              </div>
            </div>
            <div className="mt-4">
              {stage === "not playing" && (
                <button onClick={beginGame} className="btn btn-primary w-full">
                  Start
                </button>
              )}
              {stage === "showing" && (
                <button
                  onClick={hidePlateNumber}
                  className="btn btn-secondary w-full"
                >
                  Memorized
                </button>
              )}
              {(stage === "guessing" || stage === "evaluating") && (
                <button
                  onClick={() => setStage("evaluating")}
                  className="btn btn-accent w-full"
                >
                  Submit Guess
                </button>
              )}
              {stage === "finished" && (
                <button onClick={beginGame} className="btn w-full">
                  Play Again
                </button>
              )}
            </div>
          </div>
        </aside> */}
      </div>
    </div>
  );
}

export default LicensePlateGame;
