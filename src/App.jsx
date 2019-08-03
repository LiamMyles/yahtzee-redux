import React, { useReducer } from "react";
import "./App.css";
import "./Die.css";

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

const initialDiceState = [...Array(5)].map(() => ({
  theme: 3,
  side: 1,
  isRolling: false,
  isHeld: false
}));

function diceReducer(state, { type, dieNumber }) {
  switch (type) {
    case "rollDie":
      return state.map((die, index) => {
        if (dieNumber === index && !die.isHeld) {
          return { ...die, side: rollDice() };
        } else {
          return die;
        }
      });
    case "rollAllDice":
      return state.map(die => {
        if (die.isHeld) {
          return { ...die };
        } else {
          return { ...die, side: rollDice() };
        }
      });
    case "holdDie":
      return state.map((die, index) => {
        if (dieNumber === index) {
          return { ...die, isHeld: true };
        } else {
          return die;
        }
      });
    case "resetHeld":
      return state.map(die => ({ ...die, isHeld: false }));
    default:
      throw new Error();
  }
}
const initialScoreState = {
  ones: {
    score: 0,
    isScored: false
  },
  twos: {
    score: 0,
    isScored: false
  },
  threes: {
    score: 0,
    isScored: false
  },
  fours: {
    score: 0,
    isScored: false
  },
  fives: {
    score: 0,
    isScored: false
  },
  sixes: {
    score: 0,
    isScored: false
  },
  threeKinds: {
    score: 0,
    isScored: false
  },
  fourKinds: {
    score: 0,
    isScored: false
  },
  smallStraight: {
    score: 0,
    isScored: false
  },
  longStraight: {
    score: 0,
    isScored: false
  },
  chance: {
    score: 0,
    isScored: false
  },
  yahtzee: {
    score: 0,
    isScored: false
  }
};
function scoreReducer(state, { type, alias, score }) {
  switch (type) {
    case "addScore": {
      return { ...state, [alias]: { ...state[alias], score, isScored: true } };
    }
    default:
      throw new Error();
  }
}

function App() {
  // useEvent? Thing will take scoreState and DiceState to trigger updates to a GameState reducer

  const [diceState, dispatchDice] = useReducer(diceReducer, initialDiceState);
  const [scoreState, dispatchScores] = useReducer(
    scoreReducer,
    initialScoreState
  );

  let totalScores = [];
  for (const score in scoreState) {
    if (scoreState.hasOwnProperty(score)) {
      totalScores.push(scoreState[score].score);
    }
  }
  return (
    <>
      <h1>Total Score {totalScores.reduce((a, b) => a + b, 0)}</h1>
      <ScoreBoard
        dice={diceState.map(({ side }) => side)}
        scoreState={scoreState}
        dispatchScores={dispatchScores}
      />
      <div>
        <section className="dice">
          {diceState.map((dieState, index) => (
            <div key={index}>
              <Die
                side={dieState.side}
                theme={dieState.theme}
                isHeld={dieState.isHeld}
                clickFunction={() => {
                  dispatchDice({ type: "rollDie", dieNumber: index });
                }}
              />

              <button
                onClick={() => {
                  dispatchDice({ type: "holdDie", dieNumber: index });
                }}
              >
                Hold Die
              </button>
            </div>
          ))}
        </section>
        <button
          onClick={() => {
            dispatchDice({ type: "rollAllDice" });
          }}
        >
          Roll All
        </button>
        <button
          onClick={() => {
            dispatchDice({ type: "resetHeld" });
          }}
        >
          Reset Held
        </button>
      </div>
    </>
  );
}

function Die({ side = 1, theme = 1, clickFunction, isHeld }) {
  return (
    <>
      {isHeld && <h1>Holding</h1>}
      <ul
        className={`die die--theme-${theme}`}
        data-current-side={side}
        onClick={clickFunction}
      >
        <li className="pip" />
        <li className="pip" />
        <li className="pip" />
        <li className="pip" />
        <li className="pip" />
        <li className="pip" />
      </ul>
    </>
  );
}

function ScoreButtonSelection({
  name,
  isValidScore,
  currentScore,
  topScore,
  isScored,
  dispatchScores,
  alias,
  scoredScore
}) {
  const showCurrentScore =
    !isScored &&
    currentScore !== 0 &&
    currentScore !== undefined &&
    isValidScore;
  return (
    <button
      onClick={() =>
        dispatchScores({ type: "addScore", alias, score: currentScore })
      }
      disabled={!isValidScore || isScored}
      style={isScored ? { background: "red" } : {}}
    >
      {`${name} max: ${topScore} `}
      {showCurrentScore && `Current: ${currentScore}`}
      {isScored && `Scored: ${scoredScore}`}
    </button>
  );
}
function getUpperScoreFunction(scoringNumber) {
  return dice =>
    dice
      .filter(die => die === scoringNumber)
      .reduce((prev, current) => prev + current, 0);
}
const scoreboardLogic = {
  upper: [
    {
      test: dice => dice.includes(1),
      name: "ones",
      alias: "ones",
      topScore: 5,
      getScore: getUpperScoreFunction(1)
    },
    {
      test: dice => dice.includes(2),
      name: "twos",
      alias: "twos",
      topScore: 10,
      getScore: getUpperScoreFunction(2)
    },
    {
      test: dice => dice.includes(3),
      name: "threes",
      alias: "threes",
      topScore: 15,
      getScore: getUpperScoreFunction(3)
    },
    {
      test: dice => dice.includes(4),
      name: "fours",
      alias: "fours",
      topScore: 20,
      getScore: getUpperScoreFunction(4)
    },
    {
      test: dice => dice.includes(5),
      name: "fives",
      alias: "fives",
      topScore: 25,
      getScore: getUpperScoreFunction(5)
    },
    {
      test: dice => dice.includes(6),
      name: "sixes",
      alias: "sixes",
      topScore: 30,
      getScore: getUpperScoreFunction(6)
    }
  ],
  lower: [
    {
      test: dice => {
        const newDice = [...dice];
        newDice.sort();

        const firstHalf = newDice.slice(0, 3);
        const endHalf = newDice.slice(2);

        return (
          firstHalf.every(die => die === firstHalf[0]) ||
          endHalf.every(die => die === endHalf[0])
        );
      },
      name: "threeKinds",
      alias: "threeKinds",
      topScore: 18,
      getScore: dice => {
        const newDice = [...dice];
        newDice.sort();

        const firstHalf = newDice.slice(0, 3);
        const endHalf = newDice.slice(2);

        if (firstHalf.every(die => die === firstHalf[0]))
          return firstHalf[0] * 3;
        if (endHalf.every(die => die === endHalf[0])) return endHalf[0] * 3;
      }
    },
    {
      test: dice => {
        const newDice = [...dice];
        newDice.sort();

        const firstHalf = newDice.slice(0, 4);
        const endHalf = newDice.slice(1);

        return (
          firstHalf.every(die => die === firstHalf[0]) ||
          endHalf.every(die => die === endHalf[0])
        );
      },
      name: "fourKinds",
      alias: "fourKinds",
      topScore: 24,
      getScore: dice => {
        const newDice = [...dice];
        newDice.sort();

        const firstHalf = newDice.slice(0, 4);
        const endHalf = newDice.slice(1);

        if (firstHalf.every(die => die === firstHalf[0]))
          return firstHalf[0] * 4;
        if (endHalf.every(die => die === endHalf[0])) return endHalf[0] * 4;
      }
    },
    {
      test: dice => {
        const newDice = [...dice];
        newDice.sort();

        const firstHalf = newDice.slice(0, 4);
        const endHalf = newDice.slice(2);
        const checkAllAreConsecutive = (die, index, dice) => {
          if (index === dice.length - 1) return true;
          return die + 1 === dice[index + 1];
        };
        return (
          firstHalf.every(checkAllAreConsecutive) ||
          endHalf.every(checkAllAreConsecutive)
        );
      },
      name: "smallStraight",
      alias: "smallStraight",
      topScore: 30,
      getScore: dice => {
        const newDice = [...dice];
        newDice.sort();

        const firstHalf = newDice.slice(0, 4);
        const endHalf = newDice.slice(2);
        const checkAllAreConsecutive = (die, index, dice) => {
          if (index === dice.length - 1) return true;
          return die + 1 === dice[index + 1];
        };
        if (
          firstHalf.every(checkAllAreConsecutive) ||
          endHalf.every(checkAllAreConsecutive)
        ) {
          return 30;
        } else {
          return 0;
        }
      }
    },
    {
      test: dice => {
        const newDice = [...dice];
        newDice.sort();

        const checkAllAreConsecutive = (die, index, dice) => {
          if (index === dice.length - 1) return true;
          return die + 1 === dice[index + 1];
        };
        return newDice.every(checkAllAreConsecutive);
      },
      name: "longStraight",
      alias: "longStraight",
      topScore: 40,
      getScore: dice => {
        const newDice = [...dice];
        newDice.sort();

        const checkAllAreConsecutive = (die, index, dice) => {
          if (index === dice.length - 1) return true;
          return die + 1 === dice[index + 1];
        };
        if (newDice.every(checkAllAreConsecutive)) {
          return 40;
        } else {
          return 0;
        }
      }
    },
    {
      test: () => true,
      name: "chance",
      alias: "chance",
      topScore: 30,
      getScore: dice => dice.reduce((prev, current) => prev + current, 0)
    },
    {
      test: dice => new Set(dice).size === 1,
      name: "yahtzee",
      alias: "yahtzee",
      topScore: 50,
      getScore: () => 50
    }
  ]
};
function ScoreBoard({ dice, scoreState, dispatchScores }) {
  return (
    <section className="score-board">
      <ul className="score-board__scores score-board__scores--upper-section">
        {scoreboardLogic.upper.map(
          ({ name, test, topScore, getScore, alias }) => (
            <ScoreButtonSelection
              currentScore={getScore(dice)}
              isValidScore={test(dice)}
              topScore={topScore}
              name={name}
              isScored={scoreState[alias].isScored}
              scoredScore={scoreState[alias].score}
              dispatchScores={dispatchScores}
              alias={alias}
              key={alias}
            />
          )
        )}
      </ul>
      <ul className="score-board__scores score-board__scores--lower-section">
        {scoreboardLogic.lower.map(
          ({ name, test, topScore, getScore, alias }) => (
            <ScoreButtonSelection
              currentScore={getScore(dice)}
              isValidScore={test(dice)}
              topScore={topScore}
              key={alias}
              isScored={scoreState[alias].isScored}
              scoredScore={scoreState[alias].score}
              dispatchScores={dispatchScores}
              alias={alias}
              name={name}
            />
          )
        )}
      </ul>
    </section>
  );
}

export default App;
