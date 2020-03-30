import React from "react";
import { connect } from "react-redux";
import {
  getFilmsThunk,
  filterToMoviesThunk,
  nextFilmsButtonThunk,
  setBookmarksThunk
} from "../../redux/reducers/filmReducer";
import { Input } from "antd";
import PaginationTag from "../PaginationTag/PaginationTag.jsx";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import MoviesList from "../MoviesList/MoviesList";

class Movies extends React.Component {
  componentDidMount() {
    this.props.getFilmsThunk();
  }

  onInputText = ev => {
    const body = ev.target.value;
    this.props.filterToMoviesThunk(body, true);
  };

  render() {
    return (
      <div>
        <Input
          style={{ width: "480px", margin: "5px" }}
          placeholder="Поиск фильма по названию"
          value={this.props.inputTextValue}
          onChange={this.onInputText}
        />

        <PaginationTag
          tagNames={this.props.tagNames}
          tagFilmsThunk={this.props.filterToMoviesThunk}
          {...this.props}
        />

        {this.props.isHitList && (
          <div
            className="card mx-auto"
            style={{
              width: "480px",
              margin: "3px",
              backgroundColor: "rgb(235, 235, 235)",
              fontSize: "17px"
            }}
          >
            Найдено совпадений: {this.props.hitList}
          </div>
        )}

        <MoviesList
          filmNames={this.props.films}
          isFavorites={this.props.setBookmarksThunk}
          isNextFilmsButton={this.props.isNextFilmsButton}
          onNextFilmsButton={this.props.nextFilmsButtonThunk}
        />

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    films: state.filmPage.films,
    isNextFilmsButton: state.filmPage.isNextFilmsButton,
    inputTextValue: state.filmPage.inputTextValue,
    tagNames: state.filmPage.tagNames,
    activeTagsName: state.filmPage.activeTagsName,
    hitList: state.filmPage.hitList,
    isHitList: state.filmPage.isHitList,
    isMaxTagsError: state.filmPage.isMaxTagsError
  };
};

export default connect(mapStateToProps, {
  getFilmsThunk,
  setBookmarksThunk,
  filterToMoviesThunk,
  nextFilmsButtonThunk
})(Movies);
