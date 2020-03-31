import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import filmReducer from "./reducers/filmReducer.ts";
import bookmarksReducer from "./reducers/bookmarksReducer.ts";

const reducers = combineReducers({
  filmPage: filmReducer,
  bookmarksPage: bookmarksReducer,
});


let store = createStore(reducers, applyMiddleware(thunkMiddleware));

export default store;