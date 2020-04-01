import React from "react";
import styles from "../../styles/styles.module.scss";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FilmsType } from "../../redux/reducers/filmReducer";

type PropsType = {
  filmNames: Array<FilmsType>
  isNextFilmsButton: boolean
  onFavorites: (item: FilmsType) => void
  onNextFilmsButton: () => void
}
const MoviesList: React.FC<PropsType> = ({ filmNames, onFavorites, isNextFilmsButton, onNextFilmsButton }) => {

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

              <OverlayTrigger placement="right" overlay={
                //@ts-ignore
                <Tooltip>{item.isBookmarks ? "Удалить из закладок" : "Добавить в избранное"}</Tooltip>
              }>
                <span className={styles.selected} onClick={() => {onFavorites(item)}}>
                {item.isBookmarks ? <div className={styles.selectedOk}>★</div> : <div>☆</div>}
                </span>
              </OverlayTrigger>

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
