import React from "react";

function ScoreButtonSelection({
  name,
  isValidScore,
  currentScore,
  topScore,
  isScored,
  dispatchScores,
  alias,
  scoredScore,
  section,
  dispatchGameState
}) {
  const showCurrentScore =
    !isScored &&
    currentScore !== 0 &&
    currentScore !== undefined &&
    isValidScore;
  return (
    <button
      onClick={() => {
        dispatchScores({
          type: "addScore",
          alias,
          section,
          score: currentScore
        });
        dispatchGameState({ type: "addScore", section, score: currentScore });
      }}
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
const scoreboardBlueprint = {
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
export default function ScoreBoard({
  dice,
  scoreState,
  dispatchScores,
  dispatchGameState
}) {
  return (
    <section className="score-board">
      <ul className="score-board__scores score-board__scores--upper-section">
        {scoreboardBlueprint.upper.map(
          ({ name, test, topScore, getScore, alias }) => (
            <ScoreButtonSelection
              section={"upper"}
              currentScore={getScore(dice)}
              isValidScore={test(dice)}
              topScore={topScore}
              name={name}
              isScored={scoreState.upper[alias].isScored}
              scoredScore={scoreState.upper[alias].score}
              dispatchScores={dispatchScores}
              dispatchGameState={dispatchGameState}
              alias={alias}
              key={alias}
            />
          )
        )}
      </ul>
      <ul className="score-board__scores score-board__scores--lower-section">
        {scoreboardBlueprint.lower.map(
          ({ name, test, topScore, getScore, alias }) => (
            <ScoreButtonSelection
              section={"lower"}
              currentScore={getScore(dice)}
              isValidScore={test(dice)}
              topScore={topScore}
              key={alias}
              isScored={scoreState.lower[alias].isScored}
              scoredScore={scoreState.lower[alias].score}
              dispatchScores={dispatchScores}
              dispatchGameState={dispatchGameState}
              alias={alias}
              name={name}
            />
          )
        )}
      </ul>
    </section>
  );
}
