import React, { useReducer } from "react";
import "./App.css";
import "./Die.css";

import Die from "./yahtzee-components/Die";
import ScoreBoard from "./yahtzee-components/ScoreBoard";

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
  upper: {
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
    }
  },
  lower: {
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
  }
};
function scoreReducer(state, { type, alias, score, section }) {
  switch (type) {
    case "addScore": {
      return {
        ...state,
        [section]: {
          ...state[section],
          [alias]: {
            ...state[section][alias],
            score,
            isScored: true
          }
        }
      };
    }
    default:
      throw new Error();
  }
}

const initialGameState = {
  totalScores: { lower: 0, upper: 0, yahtzees: 0 },
  currentRound: 0,
  currentDiceRoll: 0,
  hasYathzeed: false
};
function gameStateReducer(state, { type, score, section }) {
  switch (type) {
    case "addScore": {
      return {
        ...state,
        totalScores: {
          ...state.totalScores,
          [section]: state.totalScores[section] + score
        }
      };
    }
    case "incrementRound": {
      return { ...state, currentRound: state.currentRound + 1 };
    }
    case "incrementDiceRoll": {
      return { ...state, currentDiceRoll: state.currentDiceRoll + 1 };
    }
    case "updateYahtzees": {
      if (state.hasYathzeed) {
        return { ...state };
      } else {
        return {
          ...state,
          hasYathzeed: true,
          totalScores: {
            ...state.totalScores,
            yahtzees: state.totalScores.yahtzees + 1
          }
        };
      }
    }

    default:
      throw new Error();
  }
}

function App() {
  // useEvent? Thing will take scoreState and DiceState to trigger updates to a GameState reducer
  const [gameState, dispatchGameState] = useReducer(
    gameStateReducer,
    initialGameState
  );
  const [diceState, dispatchDice] = useReducer(diceReducer, initialDiceState);
  const [scoreState, dispatchScores] = useReducer(
    scoreReducer,
    initialScoreState
  );

  return (
    <>
      <h1>
        {`Upper - ${gameState.totalScores.upper} & Lower - ${
          gameState.totalScores.lower
        }`}
      </h1>
      <ScoreBoard
        dice={diceState.map(({ side }) => side)}
        scoreState={scoreState}
        dispatchScores={dispatchScores}
        dispatchGameState={dispatchGameState}
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

export default App;
