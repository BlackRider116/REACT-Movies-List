import React from "react";
import { connect } from "react-redux";
import { getBookmarksThunk, deleteBookmarksThunk } from "../../redux/reducers/bookmarksReducer";

class Bookmarks extends React.Component {
  componentDidMount(){
    this.props.getBookmarksThunk()
  }

  componentDidUpdate(){
    // console.log(this.props.bookmarks)
  }

  render() {
    return (
      <div>
        {this.props.bookmarks.length > 0 && this.props.bookmarks.map(item => {
          return (
            <div key={item.title}>
              {item.title}
              <button onClick={() => this.props.deleteBookmarksThunk(item)}>
                ☆
              </button>
            </div>
          );
        })}
        <button>Показать еще</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    bookmarks: state.bookmarksPage.bookmarks
  };
};

export default connect(mapStateToProps,{getBookmarksThunk, deleteBookmarksThunk})(Bookmarks);
