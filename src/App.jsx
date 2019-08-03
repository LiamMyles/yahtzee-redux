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

function App() {
  const [diceState, dispatch] = useReducer(diceReducer, initialDiceState);
  return (
    <>
      <ScoreBoard dice={diceState.map(({ side }) => side)} />
      <div>
        <section className="dice">
          {diceState.map((dieState, index) => (
            <div key={index}>
              <Die
                side={dieState.side}
                theme={dieState.theme}
                isHeld={dieState.isHeld}
                clickFunction={() => {
                  dispatch({ type: "rollDie", dieNumber: index });
                }}
              />

              <button
                onClick={() => {
                  dispatch({ type: "holdDie", dieNumber: index });
                }}
              >
                Hold Die
              </button>
            </div>
          ))}
        </section>
        <button
          onClick={() => {
            dispatch({ type: "rollAllDice" });
          }}
        >
          Roll All
        </button>
        <button
          onClick={() => {
            dispatch({ type: "resetHeld" });
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

function ScoreButtonSelection({ isValidScore, children }) {
  return <button disabled={!isValidScore}>{children}</button>;
}

function ScoreBoard({ dice }) {
  function getUpperScoreFunction(scoringNumber) {
    return dice =>
      dice
        .filter(die => die === scoringNumber)
        .reduce((prev, current) => prev + current, 0);
  }

  const scores = {
    upper: [
      {
        test: dice => dice.includes(1),
        name: "ones",
        topScore: 5,
        getScore: getUpperScoreFunction(1)
      },
      {
        test: dice => dice.includes(2),
        name: "twos",
        topScore: 10,
        getScore: getUpperScoreFunction(2)
      },
      {
        test: dice => dice.includes(3),
        name: "threes",
        topScore: 15,
        getScore: getUpperScoreFunction(3)
      },
      {
        test: dice => dice.includes(4),
        name: "fours",
        topScore: 20,
        getScore: getUpperScoreFunction(4)
      },
      {
        test: dice => dice.includes(5),
        name: "fives",
        topScore: 25,
        getScore: getUpperScoreFunction(5)
      },
      {
        test: dice => dice.includes(6),
        name: "sixes",
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
        topScore: 30,
        getScore: dice => dice.reduce((prev, current) => prev + current, 0)
      },
      {
        test: dice => new Set(dice).size === 1,
        name: "yahtzee",
        topScore: 50,
        getScore: dice => 50
      }
    ]
  };

  return (
    <section className="score-board">
      <ul className="score-board__scores score-board__scores--upper-section">
        {scores.upper.map(({ name, test, topScore, getScore }) => {
          return (
            <ScoreButtonSelection isValidScore={test(dice)} key={name}>
              {`${name} ${topScore} ${getScore(dice)}`}
            </ScoreButtonSelection>
          );
        })}
      </ul>
      <ul className="score-board__scores score-board__scores--lower-section">
        {scores.lower.map(({ name, test, topScore, getScore }) => {
          return (
            <ScoreButtonSelection isValidScore={test(dice)} key={name}>
              {`${name} ${topScore} ${getScore(dice)}`}
            </ScoreButtonSelection>
          );
        })}
      </ul>
    </section>
  );
}

export default App;
