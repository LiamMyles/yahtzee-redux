import React, { useReducer, useEffect, useRef } from "react";

import Die from "./Die";

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

const initialDiceState = {
  dice: [...Array(5)].map(() => ({
    theme: 3,
    side: 1,
    isRolling: false,
    isHeld: false
  })),
  currentRoll: 0,
  currentDice: [1, 1, 1, 1, 1]
};

function diceReducer(state, { type, dieNumber, isFirstRound }) {
  switch (type) {
    case "rollDie": {
      const newDice = state.dice.map((die, index) => {
        if (dieNumber === index && !die.isHeld) {
          return { ...die, side: rollDie() };
        } else {
          return die;
        }
      });
      return { ...state, dice: newDice };
    }
    case "rollDice": {
      const newDice = state.dice.map(die => {
        if (die.isHeld) {
          return { ...die };
        } else {
          return { ...die, side: rollDie() };
        }
      });
      return { ...state, dice: newDice, currentRoll: state.currentRoll + 1 };
    }
    case "toggleHold": {
      if (isFirstRound) return state;
      const newDice = state.dice.map((die, index) => {
        if (dieNumber === index) {
          return { ...die, isHeld: !die.isHeld };
        } else {
          return die;
        }
      });
      return { ...state, dice: newDice };
    }
    case "resetHeld": {
      const newDice = state.dice.map(die => ({ ...die, isHeld: false }));
      return { ...state, dice: newDice };
    }
    default:
      throw new Error();
  }
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Dice({
  dispatchGameState,
  isOutOfRolls,
  isFirstRound
}) {
  const [diceState, dispatchDice] = useReducer(diceReducer, initialDiceState);
  const previousRoll = usePrevious(diceState.currentRoll);

  useEffect(() => {
    if (diceState.currentRoll === previousRoll + 1) {
      dispatchGameState({
        type: "updateCurrentRoll",
        currentDice: diceState.dice.map(({ side }) => side)
      });
    }
  }, [diceState, dispatchGameState, previousRoll]);

  useEffect(() => {
    dispatchDice({ type: "resetHeld" });
  }, [isFirstRound]);

  return (
    <>
      <div className="round-tracker">
        <h2>Roll</h2>
        {Array.from({ length: 3 }, (v, index) => {
          const classes = `round-tracker__counter${
            index < diceState.currentRoll
              ? " round-tracker__counter--counted"
              : ""
          }`;
          return <div className={classes} />;
        })}
      </div>
      <section className="dice">
        {diceState.dice.map((dieState, index) => (
          <div key={index}>
            <Die
              side={isFirstRound ? 1 : dieState.side}
              theme={dieState.theme}
              isHeld={dieState.isHeld}
              clickFunction={() => {
                dispatchDice({
                  type: "toggleHold",
                  dieNumber: index,
                  isFirstRound
                });
              }}
            />
          </div>
        ))}
      </section>
      <button
        disabled={isOutOfRolls}
        onClick={() => {
          dispatchDice({ type: "rollDice" });
        }}
      >
        Roll All
      </button>
    </>
  );
}
