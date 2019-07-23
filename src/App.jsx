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
        <section>
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

function ScoreBoard({ dice }) {
  const scores = [
    { test: dice => dice.includes(1), name: "ones" },
    { test: dice => dice.includes(2), name: "twos" },
    { test: dice => dice.includes(3), name: "threes" },
    { test: dice => dice.includes(4), name: "fours" },
    { test: dice => dice.includes(5), name: "fives" },
    { test: dice => dice.includes(6), name: "sixes" },
    { test: dice => new Set(dice).size === 3, name: "threeKids" },
    { test: dice => new Set(dice).size === 2, name: "fourKids" },
    { test: dice => dice.includes(1), name: "smallStraight" },
    { test: dice => dice.includes(1), name: "longStraight" },
    { test: () => true, name: "chance" },
    { test: dice => new Set(dice).size === 1, name: "yahtzee" }
  ];

  return (
    <>
      {scores
        .map(score => ({ isValid: score.test(dice), name: score.name }))
        .filter(score => score.isValid)
        .map(({ name }) => (
          <p>{name}</p>
        ))}
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
      </ul>
      <ul>
        <li>3 of a kind</li>
        <li>4 of a kind</li>
        <li>Full House</li>
        <li>Small Straight</li>
        <li>Long Straight</li>
        <li>Chance</li>
        <li>Yahtzee</li>
      </ul>
    </>
  );
}

export default App;
