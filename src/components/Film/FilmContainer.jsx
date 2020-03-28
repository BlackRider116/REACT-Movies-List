import React from "react";
import { connect } from "react-redux";
import {
  getFilmsThunk,
  filterFilmBody,
  activeTagFilmsThunk,
  nextFilmsButtonThunk
} from "../../redux/reducers/filmReducer";

import styles from "../../styles/styles.module.scss";
import { Input } from "antd";
import { setBookmarksThunk } from "../../redux/reducers/bookmarksReducer";
import PaginationTag from "../PaginationTag/PaginationTag.jsx";

class FilmContainer extends React.Component {
  componentDidMount() {
    this.props.getFilmsThunk();
  }

  onInputText = ev => {
    const body = ev.target.value;
    this.props.filterFilmBody(body);
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
          tagNames={this.props.tagNames}
          tagFilmsThunk={this.props.activeTagFilmsThunk}
          {...this.props}
        />
        {this.props.isHitList && <div>Найдено совпадений: {this.props.hitList}</div> }
        {this.props.films.map(item => {
          return (
            <div key={item.title}>
              {item.title}
              <span className={styles.selected}
                onClick={() => {
                  this.props.setBookmarksThunk(item);
                }}
              >
  
               {item.isBookmarks === true ? '★' : '☆' }
              </span>
            </div>
          );
        })}

        <div>
          {this.props.isNextFilmsButton && (
            <button onClick={this.props.nextFilmsButtonThunk}>Показать еще</button>
          )}
        </div>
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
    isMaxTagsError: state.filmPage.isMaxTagsError,
  };
};

export default connect(mapStateToProps, {
  getFilmsThunk,
  setBookmarksThunk,
  filterFilmBody,
  activeTagFilmsThunk,
  nextFilmsButtonThunk
})(FilmContainer);
