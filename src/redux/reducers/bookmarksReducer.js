const GET_BOOKMARKS = '/bookmarks/GET_BOOKMARKS'
const DELETE_BOOKMARKS = '/bookmarks/DELETE_BOOKMARKS'
const NEXT_FAVORITES_FILMS = '/bookmarks/NEXT_FAVORITES_FILMS'
const DELETE_ALL_FAVORITES = '/bookmarks/DELETE_ALL_FAVORITES'

const lengthOfMovieList = 15

const initialState = {
    bookmarks: [],
    isFavoritesButton: false,
    favoritesLength: 0
}

const bookmarksReducer = (state = initialState, action) => {
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

const getBookmarks = (bookmarks, isFavoritesButton, favoritesLength) => ({
    type: GET_BOOKMARKS,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})
export const getBookmarksThunk = () => (dispatch) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies'))
    if (getLocalItem !== null) {
        dispatch(getBookmarks(getLocalItem.slice(0, lengthOfMovieList), nextButtonBoolean(getLocalItem), getLocalItem.length))
    }
}

const deleteBookmarks = (bookmarks, isFavoritesButton, favoritesLength) => ({
    type: DELETE_BOOKMARKS,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})

export const deleteBookmarksThunk = (filmName) => dispatch => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies'))
    const newState = getLocalItem.filter(item => item.title !== filmName.title)
    localStorage.setItem('Movies', JSON.stringify(newState))
    dispatch(deleteBookmarks(newState.slice(0, lengthOfMovieList), nextButtonBoolean(newState), newState.length))
}

const nextFavoritesFilms = (bookmarks, isFavoritesButton) => ({ type: NEXT_FAVORITES_FILMS, bookmarks, isFavoritesButton })

export const nextFavoritesFilmsThunk = () => (dispatch, getState) => {
    let getLocalItem = JSON.parse(localStorage.getItem('Movies'))
    const state = getState().bookmarksPage.bookmarks

    state.map(itemFilm => {
        getLocalItem = getLocalItem.filter(item => item.title !== itemFilm.title)
    })

    dispatch(nextFavoritesFilms(getLocalItem.slice(0, lengthOfMovieList), nextButtonBoolean(getLocalItem)))
}

const nextButtonBoolean = (arrLength) => {
    return arrLength.length <= lengthOfMovieList ? false : true
}

const deleteAllFavorites = (bookmarks, isFavoritesButton, favoritesLength) => ({
    type: DELETE_ALL_FAVORITES,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})

export const deleteAllFavoritesThunk = () => dispatch => {
    localStorage.removeItem('Movies');
    dispatch(deleteAllFavorites([], false, 0))
}

export default bookmarksReducer;