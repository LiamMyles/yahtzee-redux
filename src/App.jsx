import React, { useReducer } from "react";
import "./App.css";
import "./Die.css";

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

const initialDiceState = [...Array(6)].map((item, index) => ({
  theme: 3,
  side: 1,
  isRolling: false
}));

function diceReducer(state, { type, diceNumber }) {
  switch (type) {
    case "rollSingleDice":
      return state.map((die, index) => {
        if (diceNumber === index) {
          return { ...die, side: rollDice() };
        } else {
          return die;
        }
      });
    case "rollAllDice":
      return state.map(die => {
        return { ...die, side: rollDice() };
      });
    default:
      throw new Error();
  }
}

function App() {
  const [diceState, dispatch] = useReducer(diceReducer, initialDiceState);
  console.log(diceState);
  return (
    <div>
      <section
        onClick={() => {
          dispatch({ type: "rollAllDice" });
        }}
      >
        {diceState.map((dieState, index) => (
          <Die side={dieState.side} theme={dieState.theme} key={index} />
        ))}
        <Die />
      </section>
    </div>
  );
}

function Die({ side = 1, theme = 1 }) {
  return (
    <ul className={`die die--theme-${theme}`} data-current-side={side}>
      <li className="pip" />
      <li className="pip" />
      <li className="pip" />
      <li className="pip" />
      <li className="pip" />
      <li className="pip" />
    </ul>
  );
}

export default App;
