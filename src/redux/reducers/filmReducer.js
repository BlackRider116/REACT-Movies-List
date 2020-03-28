import data from '../../taksnetJSON/films.json'
import tags from "../../taksnetJSON/tags.json";

const GET_FILMS = '/films/GET_FILM'
const TEXT_BODY = '/films/TEXT_BODY'
const ACTIVE_TAG_NAME = '/film/ACTIVE_TAG_NAME'
const GET_NEXT_FILMS = '/films/GET_NEXT_FILMS'
const IS_BOOKMARKS = '/films/IS_BOOKMARKS'

const lengthOfMovieList = 15
let filmNamesToFilter = []

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

const getFilms = (films, tagNames, inputTextValue, isNextFilmsButton, hitList, isHitList) =>
    ({ type: GET_FILMS, payload: { films: inFavorites(films), tagNames, inputTextValue, isNextFilmsButton, hitList, isHitList } })

export const getFilmsThunk = (textBody, hitList, isHitList) => async (dispatch) => {
    const response = await data
    const responseTags = await tags

    let id = 0
    const dataTagItem = responseTags.map((item) => {
        id++
        return ({ name: item, tagActive: false, id })
    })

    dispatch(getFilms(response.slice(0, lengthOfMovieList), dataTagItem, textBody, nextButtonBoolean(data.length), hitList, isHitList))
}

const onInputBody = (films, inputTextValue, isNextFilmsButton, hitList, isHitList, tagNames) => ({
    type: TEXT_BODY,
    payload: { films: inFavorites(films), inputTextValue, isNextFilmsButton, hitList, isHitList, tagNames }
})

export const filterFilmBody = (textBody) => async (dispatch, getState) => {
    const response = await data
    const stateTagNames = getState().filmPage.tagNames
    const filterFilms = response.filter(item => {
        return item.title.toLowerCase().includes(textBody)
    })

    const filterTagNames = stateTagNames.map(item => {
        if (item.tagActive === true) {
            return { ...item, tagActive: false };
        }
        return item
    })

    filmNamesToFilter = filterFilms.length === response.length ? [] : filterFilms

    !textBody ? dispatch(getFilmsThunk(textBody, filmNamesToFilter.length, false))
        : dispatch(onInputBody(filterFilms.slice(0, lengthOfMovieList), textBody, nextButtonBoolean(filterFilms.length), filmNamesToFilter.length, true, filterTagNames))
}

const activeTagNames = (films, tagNames, activeTagsName, isMaxTagsError, isNextFilmsButton, hitList, isHitList, inputTextValue) => ({
    type: ACTIVE_TAG_NAME,
    payload: { films: inFavorites(films), tagNames, activeTagsName, isMaxTagsError, isNextFilmsButton, hitList, isHitList, inputTextValue }
})

export const activeTagFilmsThunk = (bodyTagName) => async (dispatch, getState) => {
    let arrFilter = await data
    const stateTagNames = getState().filmPage.tagNames
    const stateActiveTags = getState().filmPage.activeTagsName
    let activeNames = []

    const filterTagNames = stateTagNames.map(item => {
        if (item.name === bodyTagName) {
            let activeItem = !item.tagActive && stateActiveTags.length < 3 ? true : false
            if (activeItem) { activeNames.push(item.name) }
            return { ...item, tagActive: activeItem };
        }
        if (item.tagActive) { activeNames.push(item.name) }
        return item
    })

    for (let tagActiveName of activeNames) {
        arrFilter = arrFilter.filter(item => {
            return item.tags.includes(tagActiveName)
        })
    }

    filmNamesToFilter = arrFilter.length === data.length ? [] : arrFilter
    const isHitList = activeNames.length !== 0 ? true : false
    const isMaxTagsError = stateActiveTags.length === 3 && activeNames.length === 3 ? true : false
    dispatch(activeTagNames(arrFilter.slice(0, lengthOfMovieList), filterTagNames, activeNames, isMaxTagsError,
        nextButtonBoolean(arrFilter.length), filmNamesToFilter.length, isHitList, ''))
}

const nextFilmButton = (films, isNextFilmsButton) => ({ type: GET_NEXT_FILMS, films: inFavorites(films), isNextFilmsButton })

export const nextFilmsButtonThunk = () => async (dispatch, getState) => {
    const response = await data
    let state = getState().filmPage.films
    let filmNames = filmNamesToFilter.length !== 0 ? filmNamesToFilter : response

    state.map(itemFilm => {
        filmNames = filmNames.filter(item => item.title !== itemFilm.title)
    })

    dispatch(nextFilmButton(filmNames.slice(0, lengthOfMovieList), nextButtonBoolean(filmNames.length)))
}

const nextButtonBoolean = (arrLength) => {
    return arrLength <= lengthOfMovieList ? false : true
}

export const isBookmarksState = films => ({ type: IS_BOOKMARKS, payload: { films } })

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