const GET_BOOKMARKS = '/films/GET_BOOKMARKS'
const SET_BOOKMARKS = '/films/SET_BOOKMARKS'
const DELETE_BOOKMARKS = '/films/DELETE_BOOKMARKS'

const initialState = {
    bookmarks: []
}

const bookmarksReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BOOKMARKS:
            return {
                ...state,
                bookmarks: action.filmName
            }
        case SET_BOOKMARKS:
            return {
                ...state,
                bookmarks: [
                    ...state.bookmarks,
                     action.filmName
                ]
            }
        case DELETE_BOOKMARKS:
            return {
                ...state,
                bookmarks: deleteFilm(state.bookmarks, action.filmName)
            }
        default:
            return state;
    }
}



// const filterBookmarks = (movies, filmName) => {
//     // console.log(movies)
//     // console.log(filmName)
//     return movies.filter(item => {
//         console.log(movies)
//         if(movies === []) {
//             console.log(filmName)
//             return  filmName}
//         if (item.title !== filmName.title) {
            
//             return filmName
//         }
//         // return movies
//     })
// }

// const deleteFilm = (movies, filmName) => {
//     return movies.filter(item => {
//         return (item.title !== filmName,
//             localStorage.removeItem('localFilmName')
//         )
//     })
// }

// export const setBookmarksThunk = filmName => async (dispatch, getState) => {
//     const localItem = getState().bookmarksPage.bookmarks
//     let newItem = localItem.filter(item => {
//         if (item !== filmName) {
//             dispatch(setBookmarks(filmName))
//         }
//     })
//     console.log(newItem)



//     // dispatch(setBookmarks(filmName))
// }

const setBookmarks = (filmName) => ({ type: SET_BOOKMARKS, filmName })
export const setBookmarksThunk = filmName => async (dispatch, getState) => {
    const localItem = getState().bookmarksPage.bookmarks
    dispatch(setBookmarks(filmName))
    localStorage.setItem('localFilmName', JSON.stringify(localItem))
}

const getBookmarks = (filmName) => ({ type: GET_BOOKMARKS, filmName })
export const getBookmarksThunk = () => (dispatch) => {
    const itemName = JSON.parse(localStorage.getItem('localFilmName'))
    if (itemName) {
        dispatch(getBookmarks(itemName))
    }
}

const deleteBookmarks = (filmName) => ({ type: DELETE_BOOKMARKS, filmName })
const deleteFilm = (movies, filmName) => {
    return movies.filter(item => {
        return (item.title !== filmName.title,
            localStorage.removeItem('localFilmName')
        )
    })
}
export const deleteBookmarksThunk = (filmName) => dispatch => {
    dispatch(deleteBookmarks(filmName))

}

export default bookmarksReducer;