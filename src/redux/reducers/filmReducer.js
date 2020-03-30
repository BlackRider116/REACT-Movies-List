import data from '../../taksnetJSON/films.json'
import tags from "../../taksnetJSON/tags.json";

const GET_FILMS = '/films/GET_FILM'
const TEXT_BODY = '/films/TEXT_BODY'
const ACTIVE_TAG_NAME = '/film/ACTIVE_TAG_NAME'
const GET_NEXT_FILMS = '/films/GET_NEXT_FILMS'
const IS_BOOKMARKS = '/films/IS_BOOKMARKS'

const lengthOfMovieList = 15
let arrFilterMoviesBody = []

const initialState = {
    films: [],
    tagNames: [],
    activeTagsName: [],
    isMaxTagsError: false,
    isNextFilmsButton: false,
    inputTextValue: '',
    hitList: 0,
    isHitList: false
}

const filmReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_FILMS:
        case TEXT_BODY:
        case ACTIVE_TAG_NAME:
        case IS_BOOKMARKS:
            return {
                ...state,
                ...action.payload
            }
        case GET_NEXT_FILMS:
            return {
                ...state,
                films: [
                    ...state.films,
                    ...action.films
                ],
                isNextFilmsButton: action.isNextFilmsButton
            }
        default:
            return state;
    }
}

const getFilmsAC = (films, tagNames, inputTextValue, isNextFilmsButton, hitList, isHitList) =>
    ({ type: GET_FILMS, payload: { films: inFavorites(films), tagNames, inputTextValue, isNextFilmsButton, hitList, isHitList } })

export const getFilmsThunk = (textBody, hitList, isHitList) => async (dispatch) => {
    const response = await data
    const responseTags = await tags

    let id = 0
    const dataTagItem = responseTags.map((item) => {
        id++
        return ({ name: item, tagActive: false, id })
    })

    dispatch(getFilmsAC(response.slice(0, lengthOfMovieList), dataTagItem, textBody, nextButtonBoolean(data.length), hitList, isHitList))
}

const onInputBodyAC = (films, inputTextValue, isNextFilmsButton, hitList, isHitList) => ({
    type: TEXT_BODY,
    payload: { films: inFavorites(films), inputTextValue, isNextFilmsButton, hitList, isHitList }
})

const activeTagNamesAC = (films, tagNames, activeTagsName, isMaxTagsError, isNextFilmsButton, hitList, isHitList) => ({
    type: ACTIVE_TAG_NAME,
    payload: { films: inFavorites(films), tagNames, activeTagsName, isMaxTagsError, isNextFilmsButton, hitList, isHitList }
})

export const filterToMoviesThunk = (body, boolean) => async (dispatch, getState) => {
    const response = await data
    const stateActiveTags = getState().filmPage.activeTagsName
    const stateInputTextValue = getState().filmPage.inputTextValue

    if (boolean === true) {
        const moviesByTag = moviesFilterByTag(response, stateActiveTags)
        const filterFilmsName = moviesFilterByName(moviesByTag, body)

        dispatch(onInputBodyAC(filterFilmsName.slice(0, lengthOfMovieList), body,
            nextButtonBoolean(filterFilmsName.length), filterFilmsName.length, isHitList(filterFilmsName)))
    } else {
        let stateTagNames = getState().filmPage.tagNames
        let activeTagNames = []
        
        stateTagNames = stateTagNames.map(item => {
            if (item.name === body) {
                let activeItem = !item.tagActive && stateActiveTags.length < 3 ? true : false
                if (activeItem) { activeTagNames.push(item.name) }
                return { ...item, tagActive: activeItem };
            }
            if (item.tagActive) { activeTagNames.push(item.name) }
            return item
        })

        const moviesByName = moviesFilterByName(response, stateInputTextValue)
        const filterFilmsByTag = moviesFilterByTag(moviesByName, activeTagNames)

        const isMaxTagsError = stateActiveTags.length === 3 && activeTagNames.length === 3 ? true : false
        dispatch(activeTagNamesAC(filterFilmsByTag.slice(0, lengthOfMovieList), stateTagNames, activeTagNames, isMaxTagsError,
            nextButtonBoolean(filterFilmsByTag.length), filterFilmsByTag.length, isHitList(filterFilmsByTag)))
    }

    function moviesFilterByName(movies, inputBody = '') {
        return movies.filter(item => {
            return item.title.toLowerCase().includes(inputBody)
        })
    }

    function moviesFilterByTag(movies, activeTagNames) {
        let films = movies
        for (let tagActiveName of activeTagNames) {
            films = films.filter(item => {
                return item.tags.includes(tagActiveName)
            })
        }
        return films
    }

    function isHitList (arr) {
        if (arr.length === response.length){
            arrFilterMoviesBody = []
            return false
        } else {
            arrFilterMoviesBody = arr
            return true
        }
    }

}

const nextFilmButtonAC = (films, isNextFilmsButton) => ({ type: GET_NEXT_FILMS, films: inFavorites(films), isNextFilmsButton })

export const nextFilmsButtonThunk = () => async (dispatch, getState) => {
    let state = getState().filmPage.films
    let filmNames = !arrFilterMoviesBody.length ? await data : arrFilterMoviesBody

    state.map(itemFilm => {
        filmNames = filmNames.filter(item => item.title !== itemFilm.title)
    })

    dispatch(nextFilmButtonAC(filmNames.slice(0, lengthOfMovieList), nextButtonBoolean(filmNames.length)))
}

const isBookmarksStateAC = films => ({ type: IS_BOOKMARKS, payload: { films } })

export const setBookmarksThunk = filmName => async (dispatch, getState) => {
    const stateFilms = getState().filmPage.films
    const getLocalItem = JSON.parse(localStorage.getItem('Movies'))
    let arr = []

    if (getLocalItem !== null) arr.push(...getLocalItem)
    const newFilmState = stateFilms.map(item => {
        if (item.title === filmName.title) {
            const isBookmarks = item.isBookmarks ? false : true
            const itemValue = { ...item, isBookmarks }
            isBookmarks === true ? arr.push(itemValue) :
                arr = arr.filter(p => p.title !== item.title)
            return itemValue
        }
        return item
    })

    dispatch(isBookmarksStateAC(newFilmState))
    localStorage.setItem('Movies', JSON.stringify(arr))
}

const nextButtonBoolean = (arrLength) => {
    return arrLength <= lengthOfMovieList ? false : true
}

const inFavorites = (itemName) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies'))

    if (getLocalItem !== null) {
        let arrFilter = itemName
        getLocalItem.map(localItem => {
            arrFilter = arrFilter.map(item => {
                if (item.title === localItem.title) {
                    return { ...item, isBookmarks: true }
                }
                return item
            })
        })
        return arrFilter
    }
    else return itemName
}

export default filmReducer;