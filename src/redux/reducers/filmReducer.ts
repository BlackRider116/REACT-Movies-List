import { StateType } from '../reduxStore';
import { ThunkAction } from 'redux-thunk';
import { filmsAPI } from '../../api/api';

const GET_FILMS = '/films/GET_FILM'
const TEXT_BODY = '/films/TEXT_BODY'
const ACTIVE_TAG_NAME = '/film/ACTIVE_TAG_NAME'
const GET_NEXT_FILMS = '/films/GET_NEXT_FILMS'
const IS_BOOKMARKS = '/films/IS_BOOKMARKS'

const lengthOfMovieList: number = 15
let arrFilterMoviesBody = [] as Array<FilmsType>


export type FilmsType = {
    title: string
    tags: Array<string>
    isBookmarks?: boolean 
}
export type TagNamesType = {
    name: string
    tagActive: boolean
    id: number
}
const initialState = {
    films: [] as Array<FilmsType>,
    tagNames: [] as Array<TagNamesType>,
    activeTagsName: [] as Array<string>,
    isMaxTagsError: false as boolean,
    isNextFilmsButton: false as boolean,
    inputTextValue: '' as string,
    hitList: 0 as number,
    isHitList: false as boolean
}
type InitialStateType = typeof initialState

const filmReducer = (state = initialState, action: any): InitialStateType => {
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

type ActionsTypes = GetFilmsActionType | OnInputBodyActionType | ActiveTagNamesActionType | NextFilmButtonActionType | IsBookmarksStateActionType
type ThunkType = ThunkAction<Promise<void>, StateType, unknown, ActionsTypes>


type GetFilmsActionType = { type: typeof GET_FILMS, payload: { films: Array<FilmsType>, tagNames: Array<TagNamesType>, isNextFilmsButton: boolean } }
const getFilmsAC = (films: Array<FilmsType>, tagNames: Array<TagNamesType>, isNextFilmsButton: boolean): GetFilmsActionType =>
    ({ type: GET_FILMS, payload: { films: inFavorites(films), tagNames, isNextFilmsButton } })
// первичный запрос данных
export const getFilmsThunk = (): ThunkType => async (dispatch, getState) => {
    let response = !arrFilterMoviesBody.length ? await filmsAPI.getMovies() : arrFilterMoviesBody
    const stateTags = getState().filmPage.tagNames

    let id = 0
    const dataTagItem = !stateTags.length ? await filmsAPI.getTags().map((item) => {
        id++
        return ({ name: item, tagActive: false, id })
    }) : stateTags

    dispatch(getFilmsAC(response.slice(0, lengthOfMovieList) as Array<FilmsType>, dataTagItem as Array<TagNamesType>, nextButtonBoolean(response.length)))
}

// Action Creator при поиске по названию
type OnInputBodyActionType = { type: typeof TEXT_BODY, payload: { films: Array<FilmsType>, inputTextValue: string, isNextFilmsButton: boolean, hitList: number, isHitList: boolean } }
const onInputBodyAC = (films: Array<FilmsType>, inputTextValue: string, isNextFilmsButton: boolean, hitList: number, isHitList: boolean): OnInputBodyActionType => ({
    type: TEXT_BODY,
    payload: { films: inFavorites(films), inputTextValue, isNextFilmsButton, hitList, isHitList }
})
// Action Creator при поиске по тегу
type ActiveTagNamesActionType = { type: typeof ACTIVE_TAG_NAME, payload: { films: Array<FilmsType>, tagNames: Array<TagNamesType>, activeTagsName: Array<string>, isMaxTagsError: boolean, isNextFilmsButton: boolean, hitList: number, isHitList: boolean } }
const activeTagNamesAC = (films: Array<FilmsType>, tagNames: Array<TagNamesType>, activeTagsName: Array<string>,
    isMaxTagsError: boolean, isNextFilmsButton: boolean, hitList: number, isHitList: boolean): ActiveTagNamesActionType => ({
        type: ACTIVE_TAG_NAME,
        payload: { films: inFavorites(films), tagNames, activeTagsName, isMaxTagsError, isNextFilmsButton, hitList, isHitList }
    })

// поиск фильмов по тегу и названию
export const filterToMoviesThunk = (body: string, boolean: boolean): ThunkType => async (dispatch, getState) => {
    const response = await filmsAPI.getMovies()
    const stateActiveTags = getState().filmPage.activeTagsName
    const stateInputTextValue = getState().filmPage.inputTextValue

    if (boolean === true) {// поиск по названию
        const moviesByTag = moviesFilterByTag(response, stateActiveTags)
        const filterFilmsName = moviesFilterByName(moviesByTag, body)

        dispatch(onInputBodyAC(filterFilmsName.slice(0, lengthOfMovieList), body,
            nextButtonBoolean(filterFilmsName.length), filterFilmsName.length, isHitList(filterFilmsName)))
    } else {// поиск по тегу
        let stateTagNames = getState().filmPage.tagNames
        let activeTagNames = [] as Array<string>

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
// поиск фильмов по названию
    function moviesFilterByName(movies: Array<FilmsType>, inputBody: string = '') {
        return movies.filter(item => {
            return item.title.toLowerCase().includes(inputBody)
        })
    }
// поиск фильмов по тегу
    function moviesFilterByTag(movies: Array<FilmsType>, activeTagNames: Array<string>) {
        let films = movies
        for (let tagActiveName of activeTagNames) {
            films = films.filter(item => {
                return item.tags.includes(tagActiveName)
            })
        }
        return films
    }
// вкл/выкл тег "Найдено совпадений" при поиске фильмов
    function isHitList(arr: Array<FilmsType>) {
        if (arr.length === response.length) {
            arrFilterMoviesBody = []
            return false
        } else {
            arrFilterMoviesBody = arr
            return true
        }
    }

}


type NextFilmButtonActionType = { type: typeof GET_NEXT_FILMS, films: Array<FilmsType>, isNextFilmsButton: boolean }
const nextFilmButtonAC = (films: Array<FilmsType>, isNextFilmsButton: boolean): NextFilmButtonActionType => ({ type: GET_NEXT_FILMS, films: inFavorites(films), isNextFilmsButton })
// кнопка "Показать еще", показывает следющие фильмы
export const nextFilmsButtonThunk = (): ThunkType => async (dispatch, getState) => {
    let state = getState().filmPage.films as Array<FilmsType>
    let filmNames = !arrFilterMoviesBody.length ? await filmsAPI.getMovies() : arrFilterMoviesBody

    state.map(itemFilm => {
        filmNames = filmNames.filter(item => item.title !== itemFilm.title)
    })

    dispatch(nextFilmButtonAC(filmNames.slice(0, lengthOfMovieList) as Array<FilmsType>, nextButtonBoolean(filmNames.length)))
}


type IsBookmarksStateActionType = { type: typeof IS_BOOKMARKS, payload: { films: Array<FilmsType> } }
const isBookmarksStateAC = (films: Array<FilmsType>): IsBookmarksStateActionType => ({ type: IS_BOOKMARKS, payload: { films } })
// добавить или удалить фильм из избранного
export const setBookmarksThunk = (filmName: FilmsType): ThunkType => async (dispatch, getState) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<FilmsType>
    const stateFilms = getState().filmPage.films
    let arr = getLocalItem

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

// вкл/выкл кнопку "показать еще"
const nextButtonBoolean = (arrLength: number) => {
    return arrLength <= lengthOfMovieList ? false : true
}

// проверяет если фильмы в избранном
const inFavorites = (itemName: Array<FilmsType>) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<FilmsType>
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

export default filmReducer;