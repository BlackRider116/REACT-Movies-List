import React, { useState } from "react";
import classes from "../../styles/styles.module.scss";

const PaginationTag = ({ tagName, tagFilmsThunk, portionSize = 6 }) => {
  let [portionNumber, setPortionNumber] = useState(1)
  let leftPortionTagNumber = (portionNumber - 1) * portionSize + 1
  let rightPortionTagNumber = portionNumber * portionSize

  return (
    <div>
      {leftPortionTagNumber > 1 && <span className={`${classes.tagStyle} ${classes.tagStyleButton}`} onClick={()=>setPortionNumber(portionNumber - 1)} >НАЗАД</span>}
      {tagName
      .filter(p => p.id >= leftPortionTagNumber && p.id <= rightPortionTagNumber)
      .map(item => {
        return (
          <span
            className={
              item.tagActive
                ? `${classes.tagStyle} ${classes.tagStyleActive}`
                : classes.tagStyle
            }
            key={item.name}
            onClick={() => tagFilmsThunk(item.name)}
          >
            {item.name}
          </span>
        );
      })}
      {rightPortionTagNumber < 24 && <span className={`${classes.tagStyle} ${classes.tagStyleButton}`} onClick={()=>setPortionNumber(portionNumber + 1)} >ДАЛЕЕ</span>}
    </div>
  );
};

export default PaginationTag;
