import React from "react";
import { connect } from "react-redux";
import {
  getFilmsThunk,
  filterToMoviesThunk,
  nextFilmsButtonThunk,
  setBookmarksThunk
} from "../../redux/reducers/filmReducer";

import styles from "../../styles/styles.module.scss";
import { Input } from "antd";
import PaginationTag from "../PaginationTag/PaginationTag.jsx";

import { Button,  OverlayTrigger, Tooltip } from "react-bootstrap";
import MoviesList from "../MoviesList/MoviesList";

class Movies extends React.Component {
  componentDidMount() {
    this.props.getFilmsThunk();
  }

  onInputText = ev => {
    const body = ev.target.value;
    this.props.filterToMoviesThunk(body, true);
  };

  // renderTooltip(props) {
  //   return (
  //     <Tooltip id="button-tooltip" {...props}>
  //       Добавить в избранное
  //     </Tooltip>
  //   );
  // }

  // Example = () => (
  //   <OverlayTrigger
  //     placement="right"
  //     delay={{ show: 250, hide: 400 }}
  //     overlay={this.renderTooltip}
  //   >
  //     <Button variant="success">Hover me to see</Button>
  //   </OverlayTrigger>
  // );

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
          tagFilmsThunk={this.props.filterToMoviesThunk}
          {...this.props}
        />

        {this.props.isHitList && (
          <div>Найдено совпадений: {this.props.hitList}</div>
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
