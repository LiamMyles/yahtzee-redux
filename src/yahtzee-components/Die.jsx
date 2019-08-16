import React from "react";

export default function Die({ side = 1, theme = 1, clickFunction, isHeld }) {
  return (
    <>
      <ul
        className={`die die--theme-${theme + (isHeld ? 1 : 0)}`}
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
