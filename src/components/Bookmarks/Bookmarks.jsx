import React from "react";
import styles from "../../styles/styles.module.scss";
import { connect } from "react-redux";
import {
  getBookmarksThunk,
  deleteBookmarksThunk,
  nextFavoritesFilmsThunk,
  deleteAllFavoritesThunk
} from "../../redux/reducers/bookmarksReducer";

class Bookmarks extends React.Component {
  componentDidMount() {
    this.props.getBookmarksThunk();
  }

  render() {
    return (
      <div>
        {this.props.favoritesLength !== 0 && (
          <div>
            В избранном {this.props.favoritesLength} фильмов
            <button onClick={this.props.deleteAllFavoritesThunk}>
              Очистить список
            </button>
          </div>
        )}
        {this.props.bookmarks.map(item => {
          return (
            <div key={item.title}>
              {item.title}
              <span
                className={styles.selected}
                onClick={() => this.props.deleteBookmarksThunk(item)}
              >
                ★
              </span>
            </div>
          );
        })}
        {this.props.isFavoritesButton && (
          <button onClick={this.props.nextFavoritesFilmsThunk}>
            Показать еще
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    bookmarks: state.bookmarksPage.bookmarks,
    isFavoritesButton: state.bookmarksPage.isFavoritesButton,
    favoritesLength: state.bookmarksPage.favoritesLength
  };
};

export default connect(mapStateToProps, {
  getBookmarksThunk,
  deleteBookmarksThunk,
  nextFavoritesFilmsThunk,
  deleteAllFavoritesThunk
})(Bookmarks);
