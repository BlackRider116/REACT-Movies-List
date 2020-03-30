import data from '../../taksnetJSON/films.json'
import tags from "../../taksnetJSON/tags.json";

const GET_FILMS = '/films/GET_FILM'
const TEXT_BODY = '/films/TEXT_BODY'
const ACTIVE_TAG_NAME = '/film/ACTIVE_TAG_NAME'
const GET_NEXT_FILMS = '/films/GET_NEXT_FILMS'
const IS_BOOKMARKS = '/films/IS_BOOKMARKS'

const lengthOfMovieList = 15
let arrMoviesByName = []
let arrMoviesByTag = []

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

export const filterFilmBody = (textBody) => async (dispatch) => {
    const response = await data
    const filmNames = !arrMoviesByTag.length ? response : arrMoviesByTag

    const filterFilms = filmNames.filter(item => {
        return item.title.toLowerCase().includes(textBody)
    })

    arrMoviesByName = !textBody ? [] : filterFilms
    const isHitList = !textBody && !arrMoviesByTag.length ? false : true
    dispatch(onInputBodyAC(filterFilms.slice(0, lengthOfMovieList), textBody,
        nextButtonBoolean(filterFilms.length), filterFilms.length, isHitList))
}

const activeTagNamesAC = (films, tagNames, activeTagsName, isMaxTagsError, isNextFilmsButton, hitList, isHitList) => ({
    type: ACTIVE_TAG_NAME,
    payload: { films: inFavorites(films), tagNames, activeTagsName, isMaxTagsError, isNextFilmsButton, hitList, isHitList }
})

export const activeTagFilmsThunk = (bodyTagName) => async (dispatch, getState) => {
    const response = await data
    let filmNames = !arrMoviesByName.length ? response : arrMoviesByName
    const stateTagNames = getState().filmPage.tagNames
    const stateActiveTags = getState().filmPage.activeTagsName
    let activeTagNames = []

    const filterTagNames = stateTagNames.map(item => {
        if (item.name === bodyTagName) {
            let activeItem = !item.tagActive && stateActiveTags.length < 3 ? true : false
            if (activeItem) { activeTagNames.push(item.name) }
            return { ...item, tagActive: activeItem };
        }
        if (item.tagActive) { activeTagNames.push(item.name) }
        return item
    })

    for (let tagActiveName of activeTagNames) {
        filmNames = filmNames.filter(item => {
            return item.tags.includes(tagActiveName)
        })
    }

    arrMoviesByTag = !activeTagNames.length ? [] : filmNames

    const isHitList = !activeTagNames.length && !arrMoviesByName.length ? false : true
    const isMaxTagsError = stateActiveTags.length === 3 && activeTagNames.length === 3 ? true : false
    dispatch(activeTagNamesAC(filmNames.slice(0, lengthOfMovieList), filterTagNames, activeTagNames, isMaxTagsError,
        nextButtonBoolean(filmNames.length), arrMoviesByTag.length, isHitList))
}

const nextFilmButtonAC = (films, isNextFilmsButton) => ({ type: GET_NEXT_FILMS, films: inFavorites(films), isNextFilmsButton })

export const nextFilmsButtonThunk = () => async (dispatch, getState) => {
    let state = getState().filmPage.films
    let filmNames = !arrMoviesByTag.length ? await data : arrMoviesByTag

    state.map(itemFilm => {
        filmNames = filmNames.filter(item => item.title !== itemFilm.title)
    })

    dispatch(nextFilmButtonAC(filmNames.slice(0, lengthOfMovieList), nextButtonBoolean(filmNames.length)))
}

const nextButtonBoolean = (arrLength) => {
    return arrLength <= lengthOfMovieList ? false : true
}

export const isBookmarksStateAC = films => ({ type: IS_BOOKMARKS, payload: { films } })

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