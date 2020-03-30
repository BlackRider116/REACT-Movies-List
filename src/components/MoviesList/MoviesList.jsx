import React from "react";
import styles from "../../styles/styles.module.scss";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const MoviesList = ({
  filmNames,
  isFavorites,
  isNextFilmsButton,
  onNextFilmsButton
}) => {
  const Example = ({ item }) => (
    <OverlayTrigger
      key="right"
      placement="right"
      overlay={
        <Tooltip>
          {item.isBookmarks ? "Удалить из закладок" : "Добавить в избранное"}
        </Tooltip>
      }
    >
      <span
        className={styles.selected}
        onClick={() => {
          isFavorites(item);
        }}
      >
        {item.isBookmarks ? (
          <div className={styles.selectedOk}>★</div>
        ) : (
          <div>☆</div>
        )}
      </span>
    </OverlayTrigger>
  );

  return (
    <div style={{ margin: "8px" }}>
      {filmNames.map(item => {
        return (
          <div
            className="card mx-auto"
            style={{
              width: "480px",
              margin: "1px",
              backgroundColor: "rgb(235, 235, 235)"
            }}
            key={item.title}
          >
            <h5 className={styles.content}>
              <span className={styles.contentMovies}>{item.title}</span>

              <Example item={item} />
            </h5>
          </div>
        );
      })}

      {isNextFilmsButton && (
        <Button
          style={{ width: "480px", margin: "5px" }}
          variant="secondary"
          onClick={onNextFilmsButton}
        >
          Показать еще
        </Button>
      )}
    </div>
  );
};

export default MoviesList;
