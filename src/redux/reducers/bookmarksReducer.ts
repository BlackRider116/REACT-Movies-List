import { ThunkAction } from "redux-thunk"
import { StateType } from "../reduxStore"

const GET_BOOKMARKS = '/bookmarks/GET_BOOKMARKS'
const DELETE_BOOKMARKS = '/bookmarks/DELETE_BOOKMARKS'
const NEXT_FAVORITES_FILMS = '/bookmarks/NEXT_FAVORITES_FILMS'
const DELETE_ALL_FAVORITES = '/bookmarks/DELETE_ALL_FAVORITES'

const lengthOfMovieList = 15

export type BookmarksType = {
    title: string
    tags: Array<string>
    isBookmarks?: boolean
}
const initialState = {
    bookmarks: [] as Array<BookmarksType>,
    isFavoritesButton: false as boolean,
    favoritesLength: 0 as number
}
type InitialStateType = typeof initialState

const bookmarksReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case GET_BOOKMARKS:
        case DELETE_BOOKMARKS:
        case DELETE_ALL_FAVORITES:
            return {
                ...state,
                ...action.payload
            }
        case NEXT_FAVORITES_FILMS:
            return {
                ...state,
                bookmarks: [
                    ...state.bookmarks,
                    ...action.bookmarks
                ],
                isFavoritesButton: action.isFavoritesButton
            }
        default:
            return state;
    }
}

type ActionsTypes = GetBookmarksActionType | DeleteBookmarksActionType | NextFavoritesFilmsActionType | DeleteAllFavoritesActionType
type ThunkType = ThunkAction<void, StateType, unknown, ActionsTypes>

type GetBookmarksActionType = { type: typeof GET_BOOKMARKS, payload: { bookmarks: Array<BookmarksType>, isFavoritesButton: boolean, favoritesLength: number } }
const getBookmarksAC = (bookmarks: Array<BookmarksType>, isFavoritesButton: boolean, favoritesLength: number): GetBookmarksActionType => ({
    type: GET_BOOKMARKS,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})
// первичный запрос данных
export const getBookmarksThunk = (): ThunkType => (dispatch) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<BookmarksType>
    dispatch(getBookmarksAC(getLocalItem.slice(0, lengthOfMovieList), nextButtonBoolean(getLocalItem.length), getLocalItem.length))
}


type DeleteBookmarksActionType = { type: typeof DELETE_BOOKMARKS, payload: { bookmarks: Array<BookmarksType>, isFavoritesButton: boolean, favoritesLength: number } }
const deleteBookmarks = (bookmarks: Array<BookmarksType>, isFavoritesButton: boolean, favoritesLength: number): DeleteBookmarksActionType => ({
    type: DELETE_BOOKMARKS,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})
// удаляет фильм из избранного
export const deleteBookmarksThunk = (filmName: BookmarksType): ThunkType => (dispatch) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<BookmarksType>
    const newState = getLocalItem.filter(item => item.title !== filmName.title)
    localStorage.setItem('Movies', JSON.stringify(newState))
    dispatch(deleteBookmarks(newState.slice(0, lengthOfMovieList), nextButtonBoolean(newState.length), newState.length))
}



type NextFavoritesFilmsActionType = { type: typeof NEXT_FAVORITES_FILMS, bookmarks: Array<BookmarksType>, isFavoritesButton: boolean }
const nextFavoritesFilmsAC = (bookmarks: Array<BookmarksType>, isFavoritesButton: boolean): NextFavoritesFilmsActionType =>
    ({ type: NEXT_FAVORITES_FILMS, bookmarks, isFavoritesButton })
// кнопка "Показать еще", показывает следющие фильмы
export const nextFavoritesFilmsThunk = (): ThunkType => (dispatch, getState) => {
    let getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<BookmarksType>
    const state = getState().bookmarksPage.bookmarks

    for (let itemFilm of state) {
        getLocalItem = getLocalItem.filter(item => item.title !== itemFilm.title)
    }

    dispatch(nextFavoritesFilmsAC(getLocalItem.slice(0, lengthOfMovieList), nextButtonBoolean(getLocalItem.length)))
}

// вкл/выкл кнопку "показать еще"
const nextButtonBoolean = (arrLength: number) => {
    return arrLength <= lengthOfMovieList ? false : true
}


type DeleteAllFavoritesActionType = { type: typeof DELETE_ALL_FAVORITES, payload: { bookmarks: Array<BookmarksType>, isFavoritesButton: boolean, favoritesLength: number } }
const deleteAllFavoritesAC = (bookmarks: Array<BookmarksType>, isFavoritesButton: boolean, favoritesLength: number): DeleteAllFavoritesActionType => ({
    type: DELETE_ALL_FAVORITES,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})
// кнопка "Очистить список"
export const deleteAllFavoritesThunk = (): ThunkType => (dispatch) => {
    const removeLocalStorage = window.confirm('Вы уверены, что хотите очистить список?')
    if (removeLocalStorage) {
        localStorage.removeItem('Movies');
        dispatch(deleteAllFavoritesAC([], false, 0))
    }
}

export default bookmarksReducer;