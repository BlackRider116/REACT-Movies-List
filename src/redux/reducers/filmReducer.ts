import data from '../../taksnetJSON/films.json'
import tags from "../../taksnetJSON/tags.json";

const GET_FILMS = '/films/GET_FILM'
const TEXT_BODY = '/films/TEXT_BODY'
const ACTIVE_TAG_NAME = '/film/ACTIVE_TAG_NAME'
const GET_NEXT_FILMS = '/films/GET_NEXT_FILMS'
const IS_BOOKMARKS = '/films/IS_BOOKMARKS'

const lengthOfMovieList: number = 15
let arrFilterMoviesBody = [] as Array<filmsType>


type filmsType = {
    title: string
    tags: Array<string>
    isBookmarks: boolean
}
type tagNamesType = {
    name: string
    tagActive: boolean
    id: number
}
const initialState = {
    films: [] as Array<filmsType>,
    tagNames: [] as Array<tagNamesType>,
    activeTagsName: [] as Array<string>,
    isMaxTagsError: false as boolean,
    isNextFilmsButton: false as boolean,
    inputTextValue: '' as string,
    hitList: 0 as number,
    isHitList: false as boolean
}
type initialStateType = typeof initialState

const filmReducer = (state = initialState, action: any): initialStateType => {
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


type getFilmsActionType = { type: typeof GET_FILMS
    payload: { films: Array<filmsType>, tagNames: Array<tagNamesType>, isNextFilmsButton: boolean }
}
const getFilmsAC = (films: Array<filmsType>, tagNames: Array<tagNamesType>, isNextFilmsButton: boolean): getFilmsActionType =>
    ({ type: GET_FILMS, payload: { films: inFavorites(films), tagNames, isNextFilmsButton } })

export const getFilmsThunk = () => async (dispatch: any) => {
    const response = await data
    const responseTags = await tags

    let id = 0
    const dataTagItem = responseTags.map((item) => {
        id++
        return ({ name: item, tagActive: false, id })
    })

    dispatch(getFilmsAC(response.slice(0, lengthOfMovieList) as Array<filmsType>, dataTagItem as Array<tagNamesType>, nextButtonBoolean(data.length)))
}


type onInputBodyActionType = { type: typeof TEXT_BODY,
    payload: { films: Array<filmsType>, inputTextValue: string, isNextFilmsButton: boolean, hitList: number, isHitList: boolean }
}
const onInputBodyAC = (films: Array<filmsType>, inputTextValue: string, isNextFilmsButton: boolean, hitList: number, isHitList: boolean): onInputBodyActionType => ({
    type: TEXT_BODY,
    payload: { films: inFavorites(films), inputTextValue, isNextFilmsButton, hitList, isHitList }
})

type activeTagNamesActionType = { type: typeof ACTIVE_TAG_NAME,
    payload: { films: Array<filmsType>, tagNames: Array<tagNamesType>, activeTagsName: Array<string>,
        isMaxTagsError: boolean, isNextFilmsButton: boolean, hitList: number, isHitList: boolean }
}
const activeTagNamesAC = (films: Array<filmsType>, tagNames: Array<tagNamesType>, activeTagsName: Array<string>,
    isMaxTagsError: boolean, isNextFilmsButton: boolean, hitList: number, isHitList: boolean): activeTagNamesActionType => ({
        type: ACTIVE_TAG_NAME,
        payload: { films: inFavorites(films), tagNames, activeTagsName, isMaxTagsError, isNextFilmsButton, hitList, isHitList }
    })

export const filterToMoviesThunk = (body: string, boolean: boolean) => async (dispatch: any, getState: any) => {
    const response = await data
    const stateActiveTags = getState().filmPage.activeTagsName
    const stateInputTextValue = getState().filmPage.inputTextValue

    if (boolean === true) {
        const moviesByTag = moviesFilterByTag(response as Array<filmsType>, stateActiveTags)
        const filterFilmsName = moviesFilterByName(moviesByTag, body)

        dispatch(onInputBodyAC(filterFilmsName.slice(0, lengthOfMovieList), body,
            nextButtonBoolean(filterFilmsName.length), filterFilmsName.length, isHitList(filterFilmsName)))
    } else {
        let stateTagNames = getState().filmPage.tagNames as Array<tagNamesType>
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

        const moviesByName = moviesFilterByName(response as Array<filmsType>, stateInputTextValue)
        const filterFilmsByTag = moviesFilterByTag(moviesByName, activeTagNames)

        const isMaxTagsError = stateActiveTags.length === 3 && activeTagNames.length === 3 ? true : false
        dispatch(activeTagNamesAC(filterFilmsByTag.slice(0, lengthOfMovieList), stateTagNames, activeTagNames, isMaxTagsError,
            nextButtonBoolean(filterFilmsByTag.length), filterFilmsByTag.length, isHitList(filterFilmsByTag)))
    }

    function moviesFilterByName(movies: Array<filmsType>, inputBody: string = '') {
        return movies.filter(item => {
            return item.title.toLowerCase().includes(inputBody)
        })
    }

    function moviesFilterByTag(movies: Array<filmsType>, activeTagNames: Array<string>) {
        let films = movies
        for (let tagActiveName of activeTagNames) {
            films = films.filter(item => {
                return item.tags.includes(tagActiveName)
            })
        }
        return films
    }

    function isHitList(arr: Array<filmsType>) {
        if (arr.length === response.length) {
            arrFilterMoviesBody = []
            return false
        } else {
            arrFilterMoviesBody = arr
            return true
        }
    }

}



type nextFilmButtonActionType = { type: typeof GET_NEXT_FILMS, films: Array<filmsType>, isNextFilmsButton: boolean }
const nextFilmButtonAC = (films: Array<filmsType>, isNextFilmsButton: boolean): nextFilmButtonActionType => ({ type: GET_NEXT_FILMS, films: inFavorites(films), isNextFilmsButton })

export const nextFilmsButtonThunk = () => async (dispatch: any, getState: any) => {
    let state = getState().filmPage.films as Array<filmsType>
    let filmNames = !arrFilterMoviesBody.length ? await data : arrFilterMoviesBody

    state.map(itemFilm => {
        filmNames = filmNames.filter(item => item.title !== itemFilm.title)
    })

    dispatch(nextFilmButtonAC(filmNames.slice(0, lengthOfMovieList) as Array<filmsType>, nextButtonBoolean(filmNames.length)))
}



type isBookmarksStateActionType = { type: typeof IS_BOOKMARKS, payload: { films: Array<filmsType> } }
const isBookmarksStateAC = (films: Array<filmsType>): isBookmarksStateActionType => ({ type: IS_BOOKMARKS, payload: { films } })

export const setBookmarksThunk = (filmName: filmsType) => async (dispatch: any, getState: any) => {
    const stateFilms = getState().filmPage.films as Array<filmsType>
    const getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<filmsType>
    let arr = getLocalItem as Array<filmsType>

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

const nextButtonBoolean = (arrLength: number) => {
    return arrLength <= lengthOfMovieList ? false : true
}

const inFavorites = (itemName: Array<filmsType>) => {
    const getLocalItem = JSON.parse(localStorage.getItem('Movies') || '[]') as Array<filmsType>
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