import React from "react";
import styles from "../../styles/styles.module.scss";
import { connect } from "react-redux";
import {
  getBookmarksThunk,
  deleteBookmarksThunk,
  nextFavoritesFilmsThunk,
  deleteAllFavoritesThunk
} from "../../redux/reducers/bookmarksReducer";
import MoviesList from "../MoviesList/MoviesList";

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

        <MoviesList
          filmNames={this.props.bookmarks}
          isFavorites={this.props.deleteBookmarksThunk}
          isNextFilmsButton={this.props.isFavoritesButton}
          onNextFilmsButton={this.props.nextFavoritesFilmsThunk}
        />
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
