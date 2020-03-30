import React, { useState } from "react";
import classes from "../../styles/styles.module.scss";

const PaginationTag = ({
  tagNames,
  tagFilmsThunk,
  portionSize = 6,
  ...props
}) => {
  let [portionNumber, setPortionNumber] = useState(1);
  let leftPortionTagNumber = (portionNumber - 1) * portionSize + 1;
  let rightPortionTagNumber = portionNumber * portionSize;

  return (
    <div>
      {leftPortionTagNumber > 1 && (
        <span
          className={`${classes.tagStyle} ${classes.tagStyleButton}`}
          onClick={() => setPortionNumber(portionNumber - 1)}
        >
          НАЗАД
        </span>
      )}

      {tagNames
        .filter(
          item =>
            item.id >= leftPortionTagNumber && item.id <= rightPortionTagNumber
        )
        .map(item => {
          return (
            <span
              className={
                item.tagActive
                  ? `${classes.tagStyle} ${classes.tagStyleActive}`
                  : classes.tagStyle
              }
              key={item.id}
              onClick={() => tagFilmsThunk(item.name)}
            >
              {item.name}
            </span>
          );
        })}

      {rightPortionTagNumber < tagNames.length && (
        <span
          className={`${classes.tagStyle} ${classes.tagStyleButton}`}
          onClick={() => setPortionNumber(portionNumber + 1)}
        >
          ДАЛЕЕ
        </span>
      )}

      {props.isMaxTagsError && (
        <div
        className={classes.maxTagsError}
        >
          Выбрано максимум 3 тега !
        </div>
      )}
    </div>
  );
};

export default PaginationTag;
