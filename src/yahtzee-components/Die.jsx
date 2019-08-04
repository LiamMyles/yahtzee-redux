import React from "react";

export default function Die({ side = 1, theme = 1, clickFunction, isHeld }) {
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
