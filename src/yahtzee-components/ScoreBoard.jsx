import React, { useReducer, useEffect, useRef } from "react";

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
      isScored: false,
      count: 0
    }
  },
  allScoresScored: false
};
function scoreReducer(state, { type, alias, score, section }) {
  switch (type) {
    case "addScore": {
      const scoredState = {
        ...state,
        [section]: {
          ...state[section],
          [alias]: {
            ...state[section][alias],
            score,
            isScored: true,
            ...(alias === "yahtzee" && {
              count: state[section][alias].count + 1
            })
          }
        }
      };
      const allIsScored = [];
      const addIsScores = (scores, arrayToMutate) => {
        for (const score in scores) {
          if (scores.hasOwnProperty(score)) {
            arrayToMutate.push(scores[score].isScored);
          }
        }
      };
      addIsScores(scoredState.upper, allIsScored);
      addIsScores(scoredState.lower, allIsScored);

      const allScoresScored = allIsScored.every(isScored => isScored);

      return { ...scoredState, allScoresScored };
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

export default function ScoreBoard({
  dice,
  dispatchGameState,
  canScore,
  diceRoll
}) {
  const [scoreState, dispatchScores] = useReducer(
    scoreReducer,
    initialScoreState
  );

  useEffect(() => {
    if (scoreState.allScoresScored) {
      dispatchGameState({ type: "allScoresScored" });
    }
  }, [scoreState.allScoresScored, dispatchGameState]);

  const previousYahtzeeCount = usePrevious(scoreState.lower.yahtzee.count);
  useEffect(() => {
    if (previousYahtzeeCount < scoreState.lower.yahtzee.count) {
      dispatchGameState({ type: "scoredYahtzee" });
    }
  }, [scoreState.lower.yahtzee.count, dispatchGameState, previousYahtzeeCount]);
  return (
    <>
      <ScoreBoardCells
        dice={dice}
        scoreState={scoreState}
        canScore={canScore}
      />
      <ScoreSelection
        dice={dice}
        diceRoll={diceRoll}
        dispatchScores={dispatchScores}
        dispatchGameState={dispatchGameState}
        canScore={canScore}
        scoreState={scoreState}
      />
    </>
  );
}

function ScoreSelection({
  dice,
  diceRoll,
  dispatchScores,
  dispatchGameState,
  canScore,
  scoreState
}) {
  const cantScore = (blueprint, section) =>
    blueprint
      .map(({ alias, test }) => ({
        isScored: scoreState[section][alias].isScored,
        isValidScore: test(dice)
      }))
      .every(({ isScored, isValidScore }) => isScored || !isValidScore);
  const upperCantScore = cantScore(scoreboardBlueprint.upper, "upper");
  const lowerCantScore = cantScore(scoreboardBlueprint.lower, "lower");
  const mustScoreZero = diceRoll === 3 && upperCantScore && lowerCantScore;

  return (
    <>
      <section className="score-selection">
        <ul className="score-selection__buttons score-selection__buttons--upper">
          {scoreboardBlueprint.upper.map(
            ({ name, test, topScore, getScore, alias }) => (
              <ScoreButtonSelection
                mustScoreZero={mustScoreZero}
                canScore={canScore}
                section={"upper"}
                currentScore={getScore(dice)}
                isValidScore={test(dice)}
                name={name}
                isScored={scoreState.upper[alias].isScored}
                dispatchScores={dispatchScores}
                dispatchGameState={dispatchGameState}
                alias={alias}
                key={alias}
              />
            )
          )}
        </ul>
        <ul className="score-selection__buttons score-selection__buttons--lower">
          {scoreboardBlueprint.lower.map(
            ({ name, test, topScore, getScore, alias }) => (
              <ScoreButtonSelection
                mustScoreZero={mustScoreZero}
                canScore={canScore}
                section={"lower"}
                currentScore={getScore(dice)}
                isValidScore={test(dice)}
                key={alias}
                isScored={scoreState.lower[alias].isScored}
                dispatchScores={dispatchScores}
                dispatchGameState={dispatchGameState}
                alias={alias}
                name={name}
              />
            )
          )}
        </ul>
      </section>
    </>
  );
}
function ScoreButtonSelection({
  name,
  isValidScore,
  currentScore,
  isScored,
  dispatchScores,
  alias,
  section,
  canScore,
  dispatchGameState,
  mustScoreZero
}) {
  if (
    canScore === false ||
    (mustScoreZero && isScored) ||
    (!mustScoreZero && !isValidScore) ||
    (!mustScoreZero && isScored && alias !== "yahtzee")
  ) {
    return false;
  }
  const disableButton = !mustScoreZero && !isValidScore && alias !== "yahtzee";
  const countToScore = mustScoreZero ? 0 : currentScore;
  return (
    <button
      className="score-selection-button"
      onClick={() => {
        dispatchScores({
          type: "addScore",
          alias,
          section,
          score: countToScore
        });
        dispatchGameState({ type: "addScore", section, score: countToScore });
      }}
      disabled={disableButton}
    >
      {mustScoreZero ? (
        `Score Zero on ${name}`
      ) : (
        <>
          <span className="score-selection-button__name">{name}</span>
          <span className="score-selection-button__score">{currentScore}</span>
        </>
      )}
    </button>
  );
}
function ScoreBoardCells({ dice, scoreState, canScore }) {
  return (
    <section className="score-board">
      <ul className="score-board__scores score-board__scores--upper-section">
        {scoreboardBlueprint.upper.map(({ name, alias }) => (
          <ScoreCell
            key={alias}
            isScored={scoreState.upper[alias].isScored}
            scoredScore={scoreState.upper[alias].score}
            alias={alias}
            name={name}
          />
        ))}
      </ul>
      <ul className="score-board__scores score-board__scores--lower-section">
        {scoreboardBlueprint.lower.map(({ name, alias }) => (
          <ScoreCell
            key={alias}
            isScored={scoreState.lower[alias].isScored}
            scoredScore={scoreState.lower[alias].score}
            alias={alias}
            yathzeeCount={scoreState.lower[alias].count}
            name={name}
          />
        ))}
      </ul>
    </section>
  );
}

function ScoreCell({ name, isScored, scoredScore, alias, yathzeeCount }) {
  return (
    <li className="score-board__score">
      <span className="score-board__score-name">{name} </span>
      <span
        className={`score-board__score-scored ${
          isScored ? "score-board__score-scored--score-added" : ""
        }`}
      >
        {isScored && scoredScore}
      </span>
      {alias === "yahtzee" &&
        yathzeeCount > 1 &&
        [...Array(yathzeeCount)].map((x, index) => <span key={index}>*</span>)}
    </li>
  );
}

function getUpperScoreFunction(scoringNumber) {
  return dice =>
    dice
      .filter(die => die === scoringNumber)
      .reduce((prev, current) => prev + current, 0);
}
const scoreboardBlueprint = {
  upper: [
    {
      test: dice => dice.includes(1),
      name: "Ones",
      alias: "ones",
      topScore: 5,
      getScore: getUpperScoreFunction(1)
    },
    {
      test: dice => dice.includes(2),
      name: "Twos",
      alias: "twos",
      topScore: 10,
      getScore: getUpperScoreFunction(2)
    },
    {
      test: dice => dice.includes(3),
      name: "Threes",
      alias: "threes",
      topScore: 15,
      getScore: getUpperScoreFunction(3)
    },
    {
      test: dice => dice.includes(4),
      name: "Fours",
      alias: "fours",
      topScore: 20,
      getScore: getUpperScoreFunction(4)
    },
    {
      test: dice => dice.includes(5),
      name: "Fives",
      alias: "fives",
      topScore: 25,
      getScore: getUpperScoreFunction(5)
    },
    {
      test: dice => dice.includes(6),
      name: "Sixes",
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
      name: "Three of a Kind",
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
      name: "Four of a Kind",
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
      name: "Small Straight",
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
      name: "Long Straight",
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
      name: "Chance",
      alias: "chance",
      topScore: 30,
      getScore: dice => dice.reduce((prev, current) => prev + current, 0)
    },
    {
      test: dice => new Set(dice).size === 1,
      name: "Yahtzee",
      alias: "yahtzee",
      topScore: 50,
      getScore: () => 50
    }
  ]
};
