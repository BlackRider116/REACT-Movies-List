const GET_BOOKMARKS = '/bookmarks/GET_BOOKMARKS'
const DELETE_BOOKMARKS = '/bookmarks/DELETE_BOOKMARKS'
const NEXT_FAVORITES_FILMS = '/bookmarks/NEXT_FAVORITES_FILMS'
const DELETE_ALL_FAVORITES = '/bookmarks/DELETE_ALL_FAVORITES'

const lengthOfMovieList = 15

type bookmarksType = {
    title: string
    tags: Array<string>
    isBookmarks: boolean
}
const initialState = {
    bookmarks: [] as Array<bookmarksType>,
    isFavoritesButton: false as boolean,
    favoritesLength: 0 as number
}
type initialStateType = typeof initialState

const bookmarksReducer = (state = initialState, action: any): initialStateType => {
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



type getBookmarksActionType = { type: typeof GET_BOOKMARKS,
    payload: { bookmarks: Array<bookmarksType>, isFavoritesButton: boolean, favoritesLength: number }
}
const getBookmarksAC = (bookmarks: Array<bookmarksType>, isFavoritesButton: boolean, favoritesLength: number): getBookmarksActionType => ({
    type: GET_BOOKMARKS,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})

export const getBookmarksThunk = () => (dispatch: any) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<bookmarksType>
    dispatch(getBookmarksAC(getLocalItem.slice(0, lengthOfMovieList), nextButtonBoolean(getLocalItem.length), getLocalItem.length))
}



type deleteBookmarksActionType = { type: typeof DELETE_BOOKMARKS,
    payload: { bookmarks: Array<bookmarksType>, isFavoritesButton: boolean, favoritesLength: number }
}
const deleteBookmarks = (bookmarks: Array<bookmarksType>, isFavoritesButton: boolean, favoritesLength: number): deleteBookmarksActionType => ({
    type: DELETE_BOOKMARKS,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})

export const deleteBookmarksThunk = (filmName: bookmarksType) => (dispatch: any) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<bookmarksType>
    const newState = getLocalItem.filter(item => item.title !== filmName.title)
    localStorage.setItem('Movies', JSON.stringify(newState))
    dispatch(deleteBookmarks(newState.slice(0, lengthOfMovieList), nextButtonBoolean(newState.length), newState.length))
}



type nextFavoritesFilmsActionType = { type: typeof NEXT_FAVORITES_FILMS, bookmarks: Array<bookmarksType>, isFavoritesButton: boolean }
const nextFavoritesFilmsAC = (bookmarks: Array<bookmarksType>, isFavoritesButton: boolean): nextFavoritesFilmsActionType =>
    ({ type: NEXT_FAVORITES_FILMS, bookmarks, isFavoritesButton })

export const nextFavoritesFilmsThunk = () => (dispatch: any, getState: any) => {
    let getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<bookmarksType>
    const state: Array<bookmarksType> = getState().bookmarksPage.bookmarks

    state.map(itemFilm => {
        getLocalItem = getLocalItem.filter(item => item.title !== itemFilm.title)
    })

    dispatch(nextFavoritesFilmsAC(getLocalItem.slice(0, lengthOfMovieList), nextButtonBoolean(getLocalItem.length)))
}

const nextButtonBoolean = (arrLength: number) => {
    return arrLength <= lengthOfMovieList ? false : true
}



type deleteAllFavoritesActionType = { type: typeof DELETE_ALL_FAVORITES,
    payload: { bookmarks: Array<bookmarksType>, isFavoritesButton: boolean, favoritesLength: number }
}
const deleteAllFavoritesAC = (bookmarks: Array<bookmarksType>, isFavoritesButton: boolean, favoritesLength: number): deleteAllFavoritesActionType => ({
    type: DELETE_ALL_FAVORITES,
    payload: { bookmarks, isFavoritesButton, favoritesLength }
})

export const deleteAllFavoritesThunk = () => (dispatch: any) => {
    localStorage.removeItem('Movies');
    dispatch(deleteAllFavoritesAC([], false, 0))
}

export default bookmarksReducer;