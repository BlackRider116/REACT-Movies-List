import data from '../../taksnetJSON/films.json'
import tags from "../../taksnetJSON/tags.json";

const GET_FILMS = '/films/GET_FILM'
const TEXT_BODY = '/films/TEXT_BODY'
const GET_TAG = '/films/GET_TAG'
const ACTIVE_TAG_NAME = '/film/ACTIVE_TAG_NAME'
const TAG_BODY = '/films/TAG_BODY'

const initialState = {
    films: [],
    tagName: [],
    activeTagName: [],
    nextButton: false,
    inputTextValue: ''
}

const filmReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_FILMS:
            return {
                ...state,
                films: [
                    ...state.films,
                    ...action.films
                ],
                nextButton: action.nextButton
            }
        case TEXT_BODY:
            return {
                ...state,
                films: [...action.films],
                inputTextValue: action.textBody,
                nextButton: action.nextButton,
            }
        case TAG_BODY:
            return {
                ...state,
                films: [...action.films],
                nextButton: action.nextButton,
            }
        case GET_TAG:
            return {
                ...state,
                tagName: [...action.tagName],
            }
        case ACTIVE_TAG_NAME:
            return {
                ...state,
                tagName: filterTagActive(state.tagName, action.activeTagName),
                activeTagName: filterActiveTagName(state.tagName)
            }
        default:
            return state;
    }
}

const getFilms = (films, nextButton) => ({ type: GET_FILMS, films, nextButton })

export const getFilmsThunk = () => async (dispatch, getState) => {
    const state = getState().filmPage.films;
    const response = await data
    if (!state.length) {
        dispatch(getFilms(response.slice(0, 15), true))
    } else {
        dispatch(nextMovies(response))
    }
}

const onInputBody = (films, textBody, nextButton) => ({ type: TEXT_BODY, films, textBody, nextButton })

export const filterFilmBody = (textBody) => async (dispatch, getState) => {
    const filterFilms = await data.filter(item => {
        return item.title.toLowerCase().includes(textBody)
    })
    const input = getState().filmPage.inputTextValue;
    if (!textBody.length) {
        dispatch(onInputBody([], textBody, false))
    }
    if (input !== textBody) {
        if (filterFilms.length < 15) {
            dispatch(onInputBody(filterFilms, textBody, false))
        } else {
            dispatch(onInputBody(filterFilms.slice(0, 15), textBody, true))
        }
    } else {
        dispatch(nextMovies(filterFilms))
    }
}

const tagFilms = (films, nextButton) => ({ type: TAG_BODY, films, nextButton })

let arr2 = []

export const filterFilmToTag = (tagName) => (dispatch, getState) => {
    let arr = getState().filmPage.activeTagName

   
    

    if(arr.length === 0) {
       arr2 = filterTagFilms(data, tagName)
       console.log(arr2)
    } 
    else if (arr.length === 1) {
        
        arr2 = filterTagFilms(arr2, tagName)
        console.log(arr2)
    } else if (arr.length === 2) {
        arr2 = filterTagFilms(arr2, tagName)
        console.log(arr2)
    }


    // console.log(arr2)
    // console.log(arr3)
    // console.log(arr4)
    
    

  

    // console.log(arr2)
    // if (activeTagName) {
    //     if (filterTagFilms.length < 15) {
    //         dispatch(tagFilms(filterTagFilms, false))
    //     } else {
    //         dispatch(tagFilms(filterTagFilms.slice(0, 15), true))
    //     }
    // } else {
    //     dispatch(nextMovies(filterTagFilms))
    // }

}

const filterTagFilms = (dataItems, tagName) => {
    return dataItems.filter(item => {
        return item.tags.includes(tagName)
    })
}

// const filterTagFilms = (dataItems, tagName) => {
//     return dataItems.filter(item => {
//         return item.tags.includes(tagName)
//     })
// }

const nextMovies = (dataItem) => (dispatch, getState) => {
    const state = getState().filmPage.films;
    const newState = dataItem.filter(item => !state.includes(item))
    if (newState.length < 15) {
        dispatch(getFilms(newState, false))
    } else {
        dispatch(getFilms(newState.slice(0, 15), true))
    }
}

//---------------------------------------------------------------------------------------------

const activeTagNames = (activeTagName, tagActive) => ({ type: ACTIVE_TAG_NAME, activeTagName, tagActive })
export const tagFilmsThunk = (activeTagName) => (dispatch) => {
    dispatch(activeTagNames(activeTagName))
    dispatch(filterFilmToTag(activeTagName))
}

const getTag = (tagName) => ({ type: GET_TAG, tagName })
export const getTagThunk = () => dispatch => {
    let id = 0
    const data = tags.map((item) => {
        id++
        return ({ name: item, tagActive: false, id })
    })
    dispatch(getTag(data))
}

const filterTagActive = (state, activeTagName) => {
    const maxActiveTag = filterActiveTagName(state)
    return state.map(item => {
        if (item.name === activeTagName) {
            let active = !item.tagActive && maxActiveTag.length < 3 ? true : false
            return { ...item, tagActive: active };
        }
        return item;
    })
}

const filterActiveTagName = (state) => {
    return state.filter(item => item.tagActive === true)
}

export default filmReducer;