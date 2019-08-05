import React, { useReducer } from "react";
import "./App.css";
import "./Die.css";

import Dice from "./yahtzee-components/Dice";
import ScoreBoard from "./yahtzee-components/ScoreBoard";

const initialGameState = {
  totalScores: { lower: 0, upper: 0, yahtzees: 0 },
  currentRound: 0,
  currentDiceRoll: 0,
  currentDice: [1, 1, 1, 1, 1],
  hasYathzeed: false
};
function gameStateReducer(state, { type, score, section, currentDice }) {
  switch (type) {
    case "addScore": {
      return {
        ...state,
        totalScores: {
          ...state.totalScores,
          [section]: state.totalScores[section] + score
        },
        currentRound: state.currentRound + 1,
        currentDiceRoll: 0
      };
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
    case "updateCurrentRoll": {
      return {
        ...state,
        currentDice,
        currentDiceRoll: state.currentDiceRoll + 1
      };
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

  return (
    <>
      <h1>
        {`Upper - ${gameState.totalScores.upper} & Lower - ${
          gameState.totalScores.lower
        }`}
      </h1>
      <ScoreBoard
        dice={gameState.currentDice}
        dispatchGameState={dispatchGameState}
      />
      <div>
        <Dice dispatchGameState={dispatchGameState} />
        <h2>Current Roll {gameState.currentDiceRoll}/3</h2>
      </div>
    </>
  );
}

export default App;
