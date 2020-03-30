import React from "react";
import styles from "../../styles/styles.module.scss";
import { Button } from "react-bootstrap";

const MoviesList = ({
  filmNames,
  isFavorites,
  isNextFilmsButton,
  onNextFilmsButton
}) => {
  return (
    <div>
      {filmNames.map(item => {
        return (
          <div
            className="card mx-auto"
            style={{ width: "480px" }}
            key={item.title}
          >
            <h5 className={styles.content}>
              <span className={styles.contentMovies}>{item.title}</span>
              <span
                className={styles.selected}
                onClick={() => {
                  isFavorites(item);
                }}
              >
                {item.isBookmarks === true ? (
                  <div className={styles.selectedOk}>★</div>
                ) : (
                  <div>☆</div>
                )}
              </span>
            </h5>
          </div>
        );
      })}
      <div>
        {isNextFilmsButton && (
          <Button
            style={{ width: "480px" }}
            variant="secondary"
            onClick={onNextFilmsButton}
          >
            Показать еще
          </Button>
        )}
      </div>
    </div>
  );
};

export default MoviesList;
