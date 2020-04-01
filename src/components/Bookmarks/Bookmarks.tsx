import React from "react";
import { connect } from "react-redux";
import {
  getBookmarksThunk,
  deleteBookmarksThunk,
  nextFavoritesFilmsThunk,
  deleteAllFavoritesThunk,
  BookmarksType
} from "../../redux/reducers/bookmarksReducer";
import MoviesList from "../MoviesList/MoviesList";
import { StateType } from "../../redux/reduxStore";
import { FilmsType } from "../../redux/reducers/filmReducer";


type MapStateToPropsType = {
  bookmarks: Array<BookmarksType>
  isFavoritesButton: boolean
  favoritesLength: number
}
type MapDispatchToPropsType = {
  getBookmarksThunk: () => void
  nextFavoritesFilmsThunk: () => void
  deleteBookmarksThunk: (item: FilmsType) => void
  deleteAllFavoritesThunk: () => void
}
type PropsType = MapStateToPropsType & MapDispatchToPropsType

class Bookmarks extends React.Component<PropsType> {
  componentDidMount() {
    this.props.getBookmarksThunk();
  }

  render() {
    const style = {
      width: "480px",
      margin: "5px",
      fontSize: "18px",
      paddingLeft: this.props.favoritesLength !== 0 ? "100px" : "0px",
      backgroundColor: "rgb(235, 235, 235)"
    };

    return (
      <div>
        <div className="card mx-auto" style={style}>
          {this.props.favoritesLength !== 0 ? (
            <div>
              Фильмов в избранном: {this.props.favoritesLength}
              <button
                className="btn btn-danger btn-sm float-right"
                onClick={this.props.deleteAllFavoritesThunk}
              >
                Очистить список
              </button>
            </div>
          ) : (
              <div>Вы не выбрали ни одного фильма</div>
            )}
        </div>

        <MoviesList
          filmNames={this.props.bookmarks}
          onFavorites={this.props.deleteBookmarksThunk}
          isNextFilmsButton={this.props.isFavoritesButton}
          onNextFilmsButton={this.props.nextFavoritesFilmsThunk}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: StateType): MapStateToPropsType => {
  return {
    bookmarks: state.bookmarksPage.bookmarks,
    isFavoritesButton: state.bookmarksPage.isFavoritesButton,
    favoritesLength: state.bookmarksPage.favoritesLength
  };
};


export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, StateType>((mapStateToProps), {
  getBookmarksThunk,
  deleteBookmarksThunk,
  nextFavoritesFilmsThunk,
  deleteAllFavoritesThunk
})(Bookmarks);
