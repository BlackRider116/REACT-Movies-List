import React from "react";
import { connect } from "react-redux";
import {
  getFilmsThunk,
  filterFilmBody,
  tagFilmsThunk,
  getTagThunk,
  filterFilmToTag
} from "../../redux/reducers/filmReducer";

import classes from "../../styles/styles.module.scss";
import { Input } from "antd";
import { setBookmarksThunk } from "../../redux/reducers/bookmarksReducer";
import PaginationTag from "../PaginationTag/PaginationTag.jsx";

class FilmContainer extends React.Component {
  componentDidMount() {
    this.props.getFilmsThunk();
    this.props.getTagThunk();
  }

  componentDidUpdate() {
    // console.log(!this.props.inputTextValue)
  }

  onInputText = ev => {
    const body = ev.target.value;
    this.props.filterFilmBody(body);
  };

  onNextFilm = () => {
    let inputValue = this.props.inputTextValue;
    if (!inputValue) {
      this.props.getFilmsThunk();
    } else if (this.props.activeTagName.length > 0) {
      this.props.filterFilmToTag(null);
    } else {
      this.props.filterFilmBody(inputValue);
    }
  };

  render() {
    return (
      <div>
        <Input
          placeholder="Введите название фильма"
          value={this.props.inputTextValue}
          onChange={this.onInputText}
        />
        <PaginationTag
          tagName={this.props.tagName}
          tagFilmsThunk={this.props.tagFilmsThunk}
        />

        {this.props.films.map(item => {
          return (
            <div key={item.title}>
              {item.title}
              <button
                onClick={() => {
                  this.props.setBookmarksThunk(item);
                }}
              >
                ☆
              </button>
            </div>
          );
        })}

        <div>
          {this.props.nextButton && (
            <button onClick={this.onNextFilm}>Показать еще</button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    films: state.filmPage.films,
    nextButton: state.filmPage.nextButton,
    inputTextValue: state.filmPage.inputTextValue,
    tagName: state.filmPage.tagName,

    activeTagName: state.filmPage.activeTagName
  };
};

export default connect(mapStateToProps, {
  getFilmsThunk,
  setBookmarksThunk,
  filterFilmBody,
  tagFilmsThunk,
  getTagThunk,
  filterFilmToTag
})(FilmContainer);
