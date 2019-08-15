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
  hasYathzeed: false,
  allScoresScored: false
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
    case "scoredYahtzee": {
      if (state.hasYathzeed) {
        return {
          ...state,
          totalScores: {
            ...state.totalScores,
            yahtzees: state.totalScores.yahtzees + 1
          }
        };
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
    case "allScoresScored": {
      return {
        ...state,
        allScoresScored: true
      };
    }

    default:
      throw new Error();
  }
}

function App() {
  const [gameState, dispatchGameState] = useReducer(
    gameStateReducer,
    initialGameState
  );

  const upperScore = gameState.totalScores.upper;
  const lowerScore = gameState.totalScores.lower;
  const upperBonusScore = upperScore >= 63 ? 35 : 0;
  const yathzeeBonusScore =
    gameState.totalScores.yahtzees > 1
      ? gameState.totalScores.yahtzees * 100
      : 0;
  const finalScore =
    upperScore + lowerScore + upperBonusScore + yathzeeBonusScore;
  return (
    <>
      {gameState.allScoresScored ? (
        <>
          <h1>THE GAME IS OVER! </h1>
          <h2>Final Score: {finalScore}</h2>
          <div className="bonus-scores">
            {upperBonusScore !== 0 && (
              <span className="bonus-scores__upper">
                Upper Bonus:<span>{upperBonusScore}</span>
              </span>
            )}
            {yathzeeBonusScore !== 0 && (
              <span className="bonus-scores__yathzee">
                Yahtzee Bonus:
                <span className="bonus-scores__score">{yathzeeBonusScore}</span>
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="title-card">
            <h1 className="title-card__main">Yahtzee Redux!</h1>
            <h2 className="title-card__upper">Upper</h2>
            <h2 className="title-card__lower">Lower</h2>
          </div>
          <ScoreBoard
            dice={gameState.currentDice}
            diceRoll={gameState.currentDiceRoll}
            dispatchGameState={dispatchGameState}
            canScore={gameState.currentDiceRoll > 0}
          />
          <div className="dice-wrapper">
            <div className="round-tracker">
              <h2>Roll</h2>
              {Array.from({ length: 3 }, (v, index) => {
                const classes = `round-tracker__counter${
                  index < gameState.currentDiceRoll
                    ? " round-tracker__counter--counted"
                    : ""
                }`;
                return <div className={classes} />;
              })}
            </div>
            <Dice
              dispatchGameState={dispatchGameState}
              isOutOfRolls={gameState.currentDiceRoll === 3}
              isFirstRound={gameState.currentDiceRoll === 0}
            />
          </div>
        </>
      )}
    </>
  );
}

export default App;
