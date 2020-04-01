import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import filmReducer from "./reducers/filmReducer";
import bookmarksReducer from "./reducers/bookmarksReducer";

const rootReducer = combineReducers({
  filmPage: filmReducer,
  bookmarksPage: bookmarksReducer,
});

type RootReducerType = typeof rootReducer
export type StateType = ReturnType<RootReducerType>

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;